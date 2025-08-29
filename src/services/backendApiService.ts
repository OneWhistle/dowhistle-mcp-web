interface BackendApiConfig {
  baseUrl: string;
  timeout?: number;
}

interface ProcessMessageRequest {
  message: string;
  context?: {
    userLocation?: string;
    serviceHistory?: any[];
    currentBooking?: any;
    preferences?: Record<string, any>;
  };
}

interface ProcessMessageResponse {
  response: {
    text: string;
    suggestions?: string[];
    actions?: Array<{
      type: string;
      data: any;
    }>;
    needsUserInput?: boolean;
  };
  toolExecuted?: boolean;
  toolResult?: any;
}

interface ExecuteToolRequest {
  toolName: string;
  args: Record<string, any>;
  authToken?: string;
  userId?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class BackendApiService {
  private config: BackendApiConfig;
  private authToken?: string;
  private userId?: string;

  constructor(config: BackendApiConfig) {
    this.config = {
      timeout: 10000,
      ...config
    };
  }

  setAuth(accessToken?: string, userId?: string) {
    this.authToken = accessToken;
    this.userId = userId;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    // Add auth headers if available
    if (this.authToken) {
      headers['Authorization'] = `${this.authToken}`;
    }
    if (this.userId) {
      headers['X-User-Id'] = this.userId;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // AI Service Methods
  async processMessage(request: ProcessMessageRequest): Promise<ProcessMessageResponse> {
    return this.makeRequest<ProcessMessageResponse>('/api/ai/process-message', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  // MCP Service Methods
  async listTools(): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/api/mcp/tools');
  }

  async executeMcpTool(toolName: string, params: any): Promise<any> {
    return this.makeRequest(`/api/mcp/tools/${toolName}`, {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  async connectMCP(): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/api/mcp/connect', {
      method: 'POST'
    });
  }

  async disconnectMCP(): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/api/mcp/disconnect', {
      method: 'POST'
    });
  }

  async getMCPStatus(): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/api/mcp/status');
  }

  async getHealthCheck(): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/api/mcp/health');
  }

  // Convenience methods for specific tools
  async searchBusinesses(params: any): Promise<any> {
    return this.executeMcpTool('search_businesses', params);
  }

  async signIn(params: any): Promise<any> {
    return this.executeMcpTool('sign_in', params);
  }

  async verifyOtp(params: any): Promise<any> {
    return this.executeMcpTool('verify_otp', params);
  }

  async resendOtp(params: any): Promise<any> {
    return this.executeMcpTool('resend_otp', params);
  }

  async createWhistle(params: any): Promise<any> {
    return this.executeMcpTool('create_whistle', params);
  }

  async listWhistles(params: any): Promise<any> {
    return this.executeMcpTool('list_whistles', params);
  }

  async toggleVisibility(params: any): Promise<any> {
    return this.executeMcpTool('toggle_visibility', params);
  }

  async getUserProfile(params: any): Promise<any> {
    return this.executeMcpTool('get_user_profile', params);
  }

}

// Singleton instance
let backendApiInstance: BackendApiService | null = null;

export const getBackendApiService = (config?: BackendApiConfig): BackendApiService => {
  if (!backendApiInstance) {
    const baseUrl = config?.baseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    backendApiInstance = new BackendApiService({ baseUrl, ...config });
  }
  return backendApiInstance;
};

export type { BackendApiConfig, ProcessMessageRequest, ProcessMessageResponse, ExecuteToolRequest, ApiResponse };
