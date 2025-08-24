import { ChatBot } from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-bold mb-6 text-foreground">
            DoWhistle
          </h1>
          <p className="text-2xl text-muted-foreground mb-8">
            Search on the move
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with transportation services and providers seamlessly. 
            Our AI assistant is ready to help you navigate the platform, 
            book rides, and find the perfect transportation solution.
          </p>
          
          <div className="mt-12">
            <div className="inline-flex items-center space-x-2 bg-card rounded-full px-6 py-3 border border-border">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-gentle"></div>
              <span className="text-sm text-muted-foreground">AI Assistant Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* ChatBot Component */}
      <ChatBot mcpServerUrl="https://dowhistle-beta-mcp-server.onrender.com/mcp/" />
    </div>
  );
};

export default Index;
