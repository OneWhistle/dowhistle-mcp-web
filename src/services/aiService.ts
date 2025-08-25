import OpenAI from 'openai';

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
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      ...config
    };

    if (config.apiKey) {
      this.openai = new OpenAI({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  private getDoWhistleKnowledge(): string {
    return `
You are the DoWhistle Assistant — a focused helper for the DoWhistle hyperlocal platform. Only answer questions related to DoWhistle’s brand, app, and services.

About DoWhistle (brand & positioning)
- Taglines: “Search on the move.” “Bridging the ‘Need’ and ‘Have’.” “Answering all your needs; just one ‘Whistle’ away.”
- What it is: A location-based, two-sided platform that connects nearby “Whistlers” (providers and consumers) and alerts them when a match is close by. Users can search, post a Whistle (need or offer), and connect directly.

Core concepts
- Provider Whistlers:
  • Taxi & ride-share providers (affordable subscription, local-government guided fares, no surge, in-app meter, know drop points before accepting).
  • Service providers (plumbers, handymen, etc.).
  • Retail businesses (post nearby offers/deals).
  • Custom Whistlers (unique skills or “have” items).
- Consumer Whistlers:
  • Discover nearby providers for rides, services, and retail offers without heavy searching.
  • Create Consumer Whistles to get alerts when matching providers are nearing.
- Platform scope:
  • DoWhistle facilitates discovery, matching, and communication. Payments are not processed by DoWhistle; users handle transactions directly.
  • Available on iOS and Android (download links on the DoWhistle site).

What you can help with
1) Explain how DoWhistle works (provider vs. consumer, tags, alerts, matching).
2) Guide users to create effective Whistles:
   - Choose Provider or Consumer.
   - Add tags (e.g., Ride Share, Plumber, Offer Share).
   - Add details/description.
   - Set alert radius.
   - Set expiry (1–24 hours or always on).
3) Help users discover categories (rides, local services, retail offers) and how to connect with Whistlers (call/SMS from profiles).
4) Offer app guidance: anonymous browsing vs. registered features, adjusting search radius, OTP/troubleshooting basics, ratings (thumbs up/down).
5) Clarify guardrails: DoWhistle doesn’t take payments or charge commissions; no guarantees on transactions. Encourage safe, direct communication.

Tone & boundaries
- Be concise, helpful, and brand-true.
- Do NOT answer general or off-topic questions.
- When asked to “book” or “hire,” guide the user to post/search in the app and connect with nearby Whistlers.
- Keep recommendations strictly within DoWhistle’s services and features.
`;
  }

  async processMessage(message: string, context: ChatContext = {}): Promise<AIResponse> {
    try {
      if (this.openai) {
        return await this.getOpenAIResponse(message, context);
      } else {
        return await this.getFallbackResponse(message, context);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        text:
          "I’m having trouble responding right now. Please try again, or tell me how I can help with DoWhistle services."
      };
    }
  }

  private async getOpenAIResponse(message: string, context: ChatContext): Promise<AIResponse> {
    const systemPrompt = `${this.getDoWhistleKnowledge()}

Current context: ${JSON.stringify(context)}

Respond naturally and helpfully. If you suggest actions (like searching, posting a Whistle, or connecting to a provider), include simple action objects in your response.`;

    const completion = await this.openai!.chat.completions.create({
      model: this.config.model!,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: this.config.temperature,
      max_tokens: 300
    });

    const responseText =
      completion.choices[0]?.message?.content ||
      "I’m here to help with DoWhistle — rides, local services, and nearby offers. What do you need?";

    return this.parseAIResponse(responseText, message, context);
  }

  private async getFallbackResponse(message: string, context: ChatContext): Promise<AIResponse> {
    const lower = message.toLowerCase();

    if (lower.includes('book') || lower.includes('ride')) {
      return {
        text:
          "I can help you find nearby ride providers on DoWhistle. Share your pickup area and I’ll connect you with available Whistlers.",
        suggestions: ['Find nearby providers', 'Set pickup', 'View provider details'],
        actions: [{ type: 'search_services', data: { category: 'Ride Share', location: context.userLocation } }]
      };
    }

    if (lower.includes('service') || lower.includes('provider') || lower.includes('offer')) {
      return {
        text:
          "DoWhistle connects you with nearby rides, local services, and retail offers. Are you looking to book a service, find a deal, or register as a provider?",
        suggestions: ['Book a service', 'Find offers', 'Become a provider'],
        needsUserInput: true
      };
    }

    if (lower.includes('location') || lower.includes('area')) {
      return {
        text:
          "Tell me your location or allow location access, and I’ll show nearby Whistlers that match your need.",
        actions: [{ type: 'request_location', data: {} }],
        needsUserInput: true
      };
    }

    if (lower.includes('price') || lower.includes('cost') || lower.includes('fare')) {
      return {
        text:
          "Pricing depends on provider, distance, and service type. I can help you compare nearby options before you connect.",
        suggestions: ['Get quotes', 'Compare providers'],
        actions: [{ type: 'price_comparison', data: { location: context.userLocation } }]
      };
    }

    if (lower.includes('help') || lower.includes('how')) {
      return {
        text:
          "I’m your DoWhistle Assistant. I can guide you to post a Whistle, find nearby providers, or connect with rides and services.",
        suggestions: ['Post a Whistle', 'Find providers', 'Learn how DoWhistle works']
      };
    }

    return {
      text:
        "Hi! I’m the DoWhistle Assistant. I can help you find rides, local services, or nearby offers. What do you need right now?",
      suggestions: ['Book a ride', 'Find services', 'See offers']
    };
  }

  private parseAIResponse(responseText: string, originalMessage: string, _context: ChatContext): AIResponse {
    const actions: Array<{ type: string; data: any }> = [];
    const suggestions: string[] = [];

    if (responseText.toLowerCase().includes('book') || originalMessage.toLowerCase().includes('book')) {
      actions.push({ type: 'booking_intent', data: { message: originalMessage } });
    }
    if (responseText.toLowerCase().includes('location') || originalMessage.toLowerCase().includes('location')) {
      actions.push({ type: 'location_request', data: {} });
    }

    if (originalMessage.toLowerCase().includes('price')) {
      suggestions.push('Get quotes', 'Compare providers');
    } else if (originalMessage.toLowerCase().includes('book')) {
      suggestions.push('Choose service type', 'Set pickup location');
    } else {
      suggestions.push('Book a ride', 'Find services', 'See offers');
    }

    return {
      text: responseText,
      suggestions: suggestions.length ? suggestions : undefined,
      actions: actions.length ? actions : undefined
    };
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
