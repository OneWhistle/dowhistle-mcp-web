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
      {/* Header */}
      <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="inline-flex items-center gap-3" aria-label="DoWhistle home">
              <img
                src="/Whistle_Logo.svg"
                alt="DoWhistle"
                className="h-8 md:h-10 w-auto object-contain"
                loading="eager"
                decoding="async"
              />
            </a>
            <div className="hidden sm:flex items-center gap-3"></div>
          </div>
        </div>
      </header>
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
      {/* <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 ">
        <div className="inline-flex items-center space-x-2 bg-card/90 backdrop-blur-sm rounded-full px-2 py-3 md:px-6  border border-border shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-gentle"></div>
          <span className="text-sm text-muted-foreground">DoWhistle Assistant Ready</span>
        </div>
      </div> */}

      {/* ChatBot Component */}
      <ChatBot 
        mcpServerUrl={(import.meta as any)?.env?.VITE_MCP_SERVER_URL}
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </div>
  );
};

export default Index;
