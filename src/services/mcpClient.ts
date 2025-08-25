import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

interface MCPConnectionConfig {
  serverUrl: string;
  timeout?: number;
  retryAttempts?: number;
}

interface MCPMessage {
  id: string;
  content: string;
  context?: any;
  metadata?: Record<string, any>;
}

interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

// ---- Tool Param/Result Types ----
export interface SearchBusinessesParams {
  latitude: number;
  longitude: number;
  radius?: number; // default 10
  keyword?: string; // default ""
  limit?: number; // default 10
}

export interface SignInParams {
  phone: string;
  country_code: string;
  name: string;
  location: [number, number];
}

export interface VerifyOtpParams {
  user_id: string;
  otp_code: string;
}

export interface ResendOtpParams {
  user_id: string;
}

export interface CreateWhistleParams {
  user_input: string;
  access_token: string;
  confidence_threshold?: number; // default 0.6
  force_create?: boolean; // default false
}

export interface ListWhistlesParams {
  access_token: string;
  active_only?: boolean; // default false
}

export interface ToggleVisibilityParams {
  access_token: string;
  visible: "true" | "false";
}

export interface GetUserProfileParams {
  access_token: string;
}

class MCPClient {
  private client: Client | null = null;
  private transport: StreamableHTTPClientTransport | null = null;
  private config: MCPConnectionConfig;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private authHeaders: Record<string, string> = {};

  constructor(config: MCPConnectionConfig) {
    this.config = {
      timeout: 10000,
      retryAttempts: 3,
      ...config
    };
  }

  private async ensureConnected(): Promise<boolean> {
    if (this.isConnected && this.client) return true;
    return this.connect();
  }

  async connect(): Promise<boolean> {
    try {
      console.log('Connecting to MCP server:', this.config.serverUrl);
      
      // Initialize HTTP transport
      this.transport = new StreamableHTTPClientTransport(
        new URL(this.config.serverUrl),
        {
         reconnectionOptions:{
          initialReconnectionDelay: 1000,
          maxReconnectionDelay: 10000,
          reconnectionDelayGrowFactor: 2,
          maxRetries: 5,
         },
         requestInit:{
          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Merge runtime auth headers
            ...this.authHeaders,
          }
         }
         
        }
      );

      this.client = new Client({
        name: 'dowhistle-chatbot-client',
        version: '1.0.0'
      }, {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {}
        }
      });

      await this.client.connect(this.transport);
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      console.log('Successfully connected to MCP server');
      return true;
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      this.isConnected = false;
      
      // Attempt reconnection
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        
        setTimeout(() => {
          this.connect();
        }, 2000 * this.reconnectAttempts); // Exponential backoff
      }
      
      return false;
    }
  }

  // Set/clear runtime auth headers; call connect() after setting to apply
  setAuth(accessToken?: string, userId?: string) {
    const headers: Record<string, string> = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    if (userId) headers['X-User-Id'] = userId;
    this.authHeaders = headers;
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
      }
      
      if (this.transport) {
        await this.transport.close();
        this.transport = null;
      }
      
      this.isConnected = false;
      console.log('Disconnected from MCP server');
    } catch (error) {
      console.error('Error during disconnection:', error);
    }
  }

  async sendMessage(message: MCPMessage): Promise<MCPResponse> {
    if (!(await this.ensureConnected()) || !this.client) {
      return { success: false, error: 'Not connected to MCP server' };
    }

    try {
      // Use MCP protocol to send message
      const response = await this.client.callTool({
        name: 'process_message',
        arguments: {
          message: message.content,
          context: message.context,
          metadata: message.metadata
        }
      });

      return {
        success: true,
        data: response,
        metadata: { timestamp: new Date().toISOString() }
      };
    } catch (error) {
      console.error('Error sending message via MCP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getResources(): Promise<MCPResponse> {
    if (!(await this.ensureConnected()) || !this.client) {
      return { success: false, error: 'Not connected to MCP server' };
    }

    try {
      const resources = await this.client.listResources();
      return {
        success: true,
        data: resources
      };
    } catch (error) {
      console.error('Error getting resources:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async executeService(serviceName: string, params: any): Promise<MCPResponse> {
    if (!(await this.ensureConnected()) || !this.client) {
      return { success: false, error: 'Not connected to MCP server' };
    }

    try {
      console.log(`serviceName:${serviceName}`)
      console.log("params",params)
      const result = await this.client.callTool({
        name: serviceName,
        arguments: params
      });

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error(`Error executing service ${serviceName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async listTools(): Promise<MCPResponse> {
    if (!(await this.ensureConnected()) || !this.client) {
      return { success: false, error: 'Not connected to MCP server' };
    }

    try {
      const tools = await this.client.listTools();
      return { success: true, data: tools };
    } catch (error) {
      console.error('Error listing tools:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getConnectionStatus(): { connected: boolean; attempts: number } {
    return {
      connected: this.isConnected,
      attempts: this.reconnectAttempts
    };
  }

  // DoWhistle-specific service methods
  async findTransportServices(location: string, serviceType?: string): Promise<MCPResponse> {
    return this.executeService('find_transport_services', {
      location,
      serviceType
    });
  }

  async bookService(serviceId: string, details: any): Promise<MCPResponse> {
    return this.executeService('book_service', {
      serviceId,
      details
    });
  }

  async getServiceStatus(bookingId: string): Promise<MCPResponse> {
    return this.executeService('get_service_status', {
      bookingId
    });
  }

  async searchProviders(criteria: any): Promise<MCPResponse> {
    return this.executeService('search_providers', criteria);
  }

  // ---- Strongly-typed wrappers for MCP tools ----

  async searchBusinesses(params: SearchBusinessesParams): Promise<MCPResponse> {
    return this.executeService('search_businesses', params);
  }

  async signIn(params: SignInParams): Promise<MCPResponse> {
    return this.executeService('sign_in', params);
  }

  async verifyOtp(params: VerifyOtpParams): Promise<MCPResponse> {
    return this.executeService('verify_otp', params);
  }

  async resendOtp(params: ResendOtpParams): Promise<MCPResponse> {
    return this.executeService('resend_otp', params);
  }

  async createWhistle(params: CreateWhistleParams): Promise<MCPResponse> {
    return this.executeService('create_whistle', params);
  }

  async listWhistles(params: ListWhistlesParams): Promise<MCPResponse> {
    return this.executeService('list_whistles', params);
  }

  async toggleVisibility(params: ToggleVisibilityParams): Promise<MCPResponse> {
    return this.executeService('toggle_visibility', params);
  }

  async getUserProfile(params: GetUserProfileParams): Promise<MCPResponse> {
    return this.executeService('get_user_profile', params);
  }
}

// Singleton instance for global use
let mcpClientInstance: MCPClient | null = null;

export const getMCPClient = (config?: MCPConnectionConfig): MCPClient => {
  if (!mcpClientInstance && config) {
    mcpClientInstance = new MCPClient(config);
  } else if (!mcpClientInstance) {
    mcpClientInstance = new MCPClient({
      serverUrl: (import.meta as any)?.env?.VITE_MCP_SERVER_URL || 'http://localhost:8000/mcp/'
    });
  }
  
  return mcpClientInstance;
};

export { MCPClient };
export type { MCPConnectionConfig, MCPMessage, MCPResponse };