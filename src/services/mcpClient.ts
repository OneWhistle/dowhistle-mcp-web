import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

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

class MCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private config: MCPConnectionConfig;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor(config: MCPConnectionConfig) {
    this.config = {
      timeout: 10000,
      retryAttempts: 3,
      ...config
    };
  }

  async connect(): Promise<boolean> {
    try {
      console.log('Connecting to MCP server:', this.config.serverUrl);
      
      // Initialize MCP client and transport
      this.transport = new StdioClientTransport({
        command: 'node',
        args: ['-e', `
          const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
          const server = new Server();
          server.connect().then(() => {
            console.log('MCP Server connected');
          });
        `]
      });

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
    if (!this.isConnected || !this.client) {
      return {
        success: false,
        error: 'Not connected to MCP server'
      };
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
    if (!this.isConnected || !this.client) {
      return {
        success: false,
        error: 'Not connected to MCP server'
      };
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
    if (!this.isConnected || !this.client) {
      return {
        success: false,
        error: 'Not connected to MCP server'
      };
    }

    try {
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
}

// Singleton instance for global use
let mcpClientInstance: MCPClient | null = null;

export const getMCPClient = (config?: MCPConnectionConfig): MCPClient => {
  if (!mcpClientInstance && config) {
    mcpClientInstance = new MCPClient(config);
  } else if (!mcpClientInstance) {
    mcpClientInstance = new MCPClient({
      serverUrl: 'https://dowhistle-beta-mcp-server.onrender.com/mcp/'
    });
  }
  
  return mcpClientInstance;
};

export { MCPClient };
export type { MCPConnectionConfig, MCPMessage, MCPResponse };