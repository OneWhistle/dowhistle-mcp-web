import { ChatBot } from '@/components/ChatBot';
import Hero from '@/components/Hero';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* AI Assistant Ready Indicator */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40">
        <div className="inline-flex items-center space-x-2 bg-card/90 backdrop-blur-sm rounded-full px-6 py-3 border border-border shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-gentle"></div>
          <span className="text-sm text-muted-foreground">AI Assistant Ready</span>
        </div>
      </div>

      {/* ChatBot Component */}
      <ChatBot mcpServerUrl="https://dowhistle-beta-mcp-server.onrender.com/mcp/" />
    </div>
  );
};

export default Index;
