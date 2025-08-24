import OpenAI from 'openai';
import { getMCPClient, MCPResponse } from './mcpClient';

interface AIServiceConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
}

interface ChatContext {
  userLocation?: string;
  serviceHistory?: any[];
  currentBooking?: any;
  preferences?: Record<string, any>;
}

interface AIResponse {
  text: string;
  suggestions?: string[];
  actions?: Array<{
    type: string;
    data: any;
  }>;
  needsUserInput?: boolean;
}

class AIService {
  private openai: OpenAI | null = null;
  private mcpClient = getMCPClient();
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      ...config
    };

    // Initialize OpenAI if API key is provided
    if (config.apiKey) {
      this.openai = new OpenAI({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  private getDoWhistleKnowledge(): string {
    return `
    You are the DoWhistle Assistant, an AI helper for the DoWhistle transportation platform.
    
    About DoWhistle:
    - "Search on the move" transportation platform
    - Connects transportation consumers with service providers
    - Website: https://www.dowhistle.com/
    - Facilitates ride booking, service discovery, and provider connections
    
    Your capabilities:
    1. Help users find transportation services
    2. Assist with booking rides and services
    3. Connect consumers with providers
    4. Provide platform guidance and support
    5. Answer questions about DoWhistle services
    6. Offer location-based service recommendations
    
    Always be helpful, professional, and focused on transportation solutions.
    When users ask about booking or services, offer to connect them with available providers.
    `;
  }

  async processMessage(
    message: string, 
    context: ChatContext = {}
  ): Promise<AIResponse> {
    try {
      // First, try to get enhanced response using MCP server
      const mcpResponse = await this.tryMCPEnhancement(message, context);
      
      if (this.openai) {
        return await this.getOpenAIResponse(message, context, mcpResponse);
      } else {
        return await this.getFallbackResponse(message, context, mcpResponse);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        text: "I apologize, but I'm experiencing some technical difficulties. Please try again, or let me know how else I can help you with DoWhistle services."
      };
    }
  }

  private async tryMCPEnhancement(
    message: string, 
    context: ChatContext
  ): Promise<MCPResponse | null> {
    try {
      const mcpClient = getMCPClient();
      const response = await mcpClient.sendMessage({
        id: Date.now().toString(),
        content: message,
        context: context
      });
      
      return response.success ? response : null;
    } catch (error) {
      console.warn('MCP enhancement failed:', error);
      return null;
    }
  }

  private async getOpenAIResponse(
    message: string, 
    context: ChatContext,
    mcpData: MCPResponse | null
  ): Promise<AIResponse> {
    const systemPrompt = `${this.getDoWhistleKnowledge()}
    
    Current context: ${JSON.stringify(context)}
    ${mcpData ? `MCP Server Data: ${JSON.stringify(mcpData.data)}` : ''}
    
    Respond naturally and helpfully. If you can take actions like booking or searching, 
    include appropriate action objects in your response.`;

    const completion = await this.openai!.chat.completions.create({
      model: this.config.model!,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: this.config.temperature,
      max_tokens: 300
    });

    const responseText = completion.choices[0]?.message?.content || 
      "I'm here to help with your DoWhistle transportation needs!";

    return this.parseAIResponse(responseText, message, context);
  }

  private async getFallbackResponse(
    message: string, 
    context: ChatContext,
    mcpData: MCPResponse | null
  ): Promise<AIResponse> {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced responses with MCP data if available
    if (mcpData?.data) {
      return {
        text: `Based on real-time data: ${this.formatMCPResponse(mcpData.data)}`,
        actions: [{ type: 'mcp_data_received', data: mcpData.data }]
      };
    }
    
    // DoWhistle-specific pattern matching
    if (lowerMessage.includes('book') || lowerMessage.includes('ride')) {
      return {
        text: "I can help you book a ride through our 'Search on the move' platform. Let me connect you with available transportation providers in your area.",
        suggestions: ['Find nearby services', 'Check ride prices', 'See provider reviews'],
        actions: [{ type: 'search_services', data: { location: context.userLocation } }]
      };
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('provider')) {
      return {
        text: "DoWhistle connects you with trusted transportation providers. Are you looking to book a service or register as a provider?",
        suggestions: ['Book a service', 'Become a provider', 'View services'],
        needsUserInput: true
      };
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('area')) {
      return {
        text: "I can help you find transportation services in your area. Please share your location, and I'll show you available providers and services.",
        actions: [{ type: 'request_location', data: {} }],
        needsUserInput: true
      };
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return {
        text: "Transportation pricing varies by provider, distance, and service type. I can help you compare prices from multiple providers for the best rates.",
        suggestions: ['Get price quotes', 'Compare providers', 'See pricing factors'],
        actions: [{ type: 'price_comparison', data: {} }]
      };
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return {
        text: "I'm here to help with all your DoWhistle needs! Our platform makes transportation simple by connecting you with local providers. I can assist with bookings, finding services, or answering questions.",
        suggestions: ['Book a ride', 'Find providers', 'Learn about DoWhistle', 'Get support']
      };
    }

    // Default response
    return {
      text: "Thank you for reaching out! I'm your DoWhistle Assistant, ready to help with transportation services, bookings, and platform guidance. What can I help you with today?",
      suggestions: ['Book transportation', 'Find services', 'Get help']
    };
  }

  private formatMCPResponse(data: any): string {
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.services) return `Found ${data.services.length} available services in your area.`;
    return 'I have the latest information to help you.';
  }

  private parseAIResponse(responseText: string, originalMessage: string, context: ChatContext): AIResponse {
    // Extract potential actions and suggestions from AI response
    const actions: Array<{ type: string; data: any }> = [];
    const suggestions: string[] = [];
    
    // Look for booking intent
    if (responseText.toLowerCase().includes('book') || originalMessage.toLowerCase().includes('book')) {
      actions.push({ type: 'booking_intent', data: { message: originalMessage } });
    }
    
    // Look for location intent
    if (responseText.toLowerCase().includes('location') || originalMessage.toLowerCase().includes('location')) {
      actions.push({ type: 'location_request', data: {} });
    }
    
    // Generate contextual suggestions
    if (originalMessage.toLowerCase().includes('price')) {
      suggestions.push('Get price quotes', 'Compare providers');
    } else if (originalMessage.toLowerCase().includes('book')) {
      suggestions.push('Choose service type', 'Set pickup location');
    } else {
      suggestions.push('Book a ride', 'Find services', 'Get help');
    }

    return {
      text: responseText,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      actions: actions.length > 0 ? actions : undefined
    };
  }

  async initializeMCPConnection(): Promise<boolean> {
    try {
      return await this.mcpClient.connect();
    } catch (error) {
      console.error('Failed to initialize MCP connection:', error);
      return false;
    }
  }

  getMCPConnectionStatus() {
    return this.mcpClient.getConnectionStatus();
  }
}

// Singleton instance
let aiServiceInstance: AIService | null = null;

export const getAIService = (config?: AIServiceConfig): AIService => {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(config);
  }
  return aiServiceInstance;
};

export { AIService };
export type { AIServiceConfig, ChatContext, AIResponse };