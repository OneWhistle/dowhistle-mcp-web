import { ChatBot } from '@/components/ChatBot';
import Hero from '@/components/Hero';
import ConsumerFeatures from '@/components/ConsumerFeatures';
import ProviderFeatures from '@/components/ProviderFeatures';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';
import { LocationStatusBar } from '@/components/LocationStatusBar';
import { useLocationOnMount } from '@/hooks/useLocationOnMount';
import { useState } from 'react';

const Index = () => {
  // Auto-get location on mount
  useLocationOnMount();
  
  // ChatBot state management
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const openChat = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero onStartWhistling={openChat} />

      {/* Consumer Features Section */}
      <ConsumerFeatures />

      {/* Provider Features Section */}
      <ProviderFeatures />

      {/* Download CTA Section */}
      <DownloadCTA />

      {/* Footer Section */}
      <Footer />

      {/* Location Status Bar */}
      <div className="fixed top-4 right-4 z-50">
        <LocationStatusBar />
      </div>

      {/* AI Assistant Ready Indicator */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1 z-40 ">
        <div className="inline-flex items-center space-x-2 bg-card/90 backdrop-blur-sm rounded-full px-3 py-3 md:px-6  border border-border shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-gentle"></div>
          <span className="text-sm text-muted-foreground">DoWhistle Assistant Ready</span>
        </div>
      </div>

      {/* ChatBot Component */}
      <ChatBot 
        mcpServerUrl="https://dowhistle-beta-mcp-server.onrender.com/mcp/"
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </div>
  );
};

export default Index;
