import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Minimize2, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

interface ChatBotProps {
  mcpServerUrl?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ 
  mcpServerUrl = 'https://dowhistle-beta-mcp-server.onrender.com/mcp/',
  isOpen: externalIsOpen,
  onOpenChange
}) => {
  const [internalIsOpen, setIsInternalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your DoWhistle Assistant. I can help you find transportation services, book rides, and navigate our platform. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setIsInternalOpen;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Simulate MCP connection status
  useEffect(() => {
    const checkConnection = () => {
      // Simulate connection check
      const connected = Math.random() > 0.1; // 90% success rate
      setIsConnected(connected);
      
      if (!connected) {
        toast({
          title: "Connection Issue",
          description: "Reconnecting to DoWhistle services...",
          variant: "destructive"
        });
      }
    };

    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [toast]);

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    
    // DoWhistle-specific responses
    if (lowerMessage.includes('book') || lowerMessage.includes('ride')) {
      return "I can help you book a ride! Our 'Search on the move' platform connects you with local transportation providers. Would you like me to check available services in your area?";
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('provider')) {
      return "DoWhistle connects transportation consumers with service providers seamlessly. Are you looking to find a service or register as a provider?";
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('area')) {
      return "I can help you find transportation services in your area. Please share your location or the area where you need transportation, and I'll connect you with available providers.";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Pricing varies by service provider and distance. I can help you get quotes from multiple providers in your area for the best rates. What type of transportation do you need?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return "I'm here to help! DoWhistle makes transportation simple with our 'Search on the move' platform. I can assist with bookings, finding providers, answering questions about our services, or guiding you through the platform.";
    }

    // Default response
    return "Thank you for your message! I'm here to help with all your DoWhistle transportation needs. Whether you're looking to book a ride, find service providers, or learn about our platform, I'm ready to assist. What would you like to know?";
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await simulateAIResponse(inputValue);
      
      setIsTyping(false);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`mb-4 bg-card border-2 border-secondary/20 rounded-xl shadow-2xl overflow-hidden ${
              isMinimized ? 'w-80 h-16' : 'w-80 md:w-96 h-[600px]'
            } transition-all duration-300 flex flex-col`}
          >
                         {/* Header */}
             <div className="bg-chat-header text-chat-header-foreground p-4 flex items-center justify-between flex-shrink-0 border-b border-secondary/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">DoWhistle Assistant</h3>
                  <div className="flex items-center space-x-1">
                    {isConnected ? (
                      <Wifi className="w-3 h-3 text-green-400" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-red-400" />
                    )}
                    <span className="text-xs opacity-75">
                      {isConnected ? 'Connected' : 'Reconnecting...'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMinimize}
                  className="text-chat-header-foreground hover:bg-chat-header-foreground/10 h-8 w-8 p-0"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="text-chat-header-foreground hover:bg-chat-header-foreground/10 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                                 {/* Messages - This will take up remaining space */}
                 <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-chat-background min-h-0 chat-scrollbar">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-chat-bubble-user text-chat-bubble-user-foreground'
                            : 'bg-chat-bubble-bot text-chat-bubble-bot-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-chat-bubble-bot text-chat-bubble-bot-foreground p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <motion.div
                            className="w-2 h-2 bg-current rounded-full"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-current rounded-full"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-current rounded-full"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                                 {/* Input Footer - Fixed at bottom */}
                 <div className="border-t border-secondary/20 p-4 bg-card flex-shrink-0">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about transportation services..."
                      className="flex-1 bg-input border-border"
                      disabled={isTyping}
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
             <motion.button
         onClick={toggleChat}
         className="bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-primary/90 transition-all duration-200 border-2 border-secondary/20"
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         animate={isOpen ? { rotate: 0 } : { rotate: 0 }}
       >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
};