import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Minimize2, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getBackendApiService } from '@/services/backendApiService';
import { useLocationStore } from '@/stores/locationStore';
import { useAuthStore } from '@/stores/authStore'; // Import the new auth store

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
  mcpServerUrl = (import.meta as any)?.env?.VITE_MCP_SERVER_URL,
  isOpen: externalIsOpen,
  onOpenChange
}) => {
  const backendApi = getBackendApiService();
  const [internalIsOpen, setIsInternalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text:
        "Hi! I'm your DoWhistle Assistant. Tell me what you need rides, services, or deals and I'll find nearby options and let you know when one's close. You're just one whistle away. How can I help?",
      sender: 'bot',
      timestamp: new Date(),
    },
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

  // Check backend API connection status
  useEffect(() => {
    let cancelled = false;
    const checkConnection = async () => {
      try {
        await backendApi.getHealth();
        if (!cancelled) setIsConnected(true);
      } catch (error) {
        if (!cancelled) {
          setIsConnected(false);
          toast({
            title: "Connection Error",
            description: "Could not connect to the backend service.",
            variant: "destructive",
          });
        }
      }
    };

    // Initial check
    checkConnection();

    // Set up interval for periodic checks
    const intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => { 
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [backendApi, toast]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsTyping(true);

    const { userId, token, setUserId, setToken } = useAuthStore.getState(); // Access auth store state and actions

    try {
      backendApi.setAuth(token, userId); // <-- ensures headers are injected

      // Get location from store for context
      const { latitude: storedLat, longitude: storedLng } = useLocationStore.getState();
      const context = {
        userLocation: storedLat != null && storedLng != null ? `${storedLat},${storedLng}` : undefined,
        userId: userId || undefined, // Include userId in context if available
        accessToken: token || undefined, // Include accessToken in context if available
      };
      
      // Process message through backend API
      const response = await backendApi.processMessage({
        message: messageText,
        context,
      });

      setIsTyping(false);

      // Handle tool execution results for authentication
      if (response.toolExecuted && response.toolResult?.success) {
        const toolData = response.toolResult.data?.structuredContent?.result; // Access structured content
        const executedTool = response.response.actions?.find(a => a.type === 'mcp_tool')?.data?.tool;

        if (executedTool === 'sign_in' && toolData?.user?.id) {
          setUserId(toolData.user.id); // Save user_id to Zustand store
          console.log('User ID saved:', toolData.user.id); // For debugging
        } else if (executedTool === 'verify_otp' && toolData?.token) {
          setToken(toolData.token); // Save token to Zustand store
          console.log('Auth token saved:', toolData.token); // For debugging
        }
      }

      // Create bot response message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response.text || "I'm here to help with DoWhistle services. What do you need?",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setIsTyping(false);
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble responding right now. Please try again, or tell me how I can help with DoWhistle services.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
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
              {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMinimize}
                  className="text-chat-header-foreground hover:bg-chat-header-foreground/10 h-8 w-8 p-0"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button> */}
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
                        {message.sender === 'bot' ? (
                          <div className="markdown-body text-sm">
                            <Markdown>{message.text}</Markdown>
                          </div>
                        ) : (
                          <p className="text-sm">{message.text}</p>
                        )}
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