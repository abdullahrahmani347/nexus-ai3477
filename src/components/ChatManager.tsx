
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Sparkles, Crown, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageDisplay } from './MessageDisplay';
import { InputArea } from './InputArea';
import TypingIndicator from './TypingIndicator';
import { ConversationSearch } from './advanced/ConversationSearch';
import { ConversationExport } from './advanced/ConversationExport';
import { AdvancedVoiceControl } from './advanced/AdvancedVoiceControl';
import { ConversationTemplates } from './advanced/ConversationTemplates';
import { useChatStore } from '@/store/chatStore';
import { useAuth } from '@/hooks/useAuth';
import { generateStreamingResponse } from '@/services/streamingService';
import { FileData } from '@/services/fileService';
import { voiceService } from '@/services/voiceService';
import { toast } from 'sonner';
import { Message } from './MessageBubble';

interface ChatManagerProps {
  className?: string;
}

export const ChatManager: React.FC<ChatManagerProps> = ({ className = '' }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const {
    messages,
    addMessage,
    updateMessage,
    deleteMessage,
    regenerateResponse,
    isStreaming,
    setIsStreaming,
    streamingMessageId,
    setStreamingMessageId,
    apiKey,
    model,
    maxTokens,
    temperature,
    systemPrompt,
    isConnected,
    autoSpeak,
    voiceEnabled
  } = useChatStore();

  // Use filtered messages when search is active, otherwise use all messages
  const displayMessages = isSearchActive ? filteredMessages : messages;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [displayMessages, isStreaming]);

  const handleSendMessage = useCallback(async (text: string, files?: FileData[]) => {
    if (!text.trim() && (!files || files.length === 0)) return;
    if (!apiKey.trim()) {
      toast.error('Please configure your API key to start chatting');
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      text: text || '',
      sender: 'user' as const,
      timestamp: new Date(),
      attachments: files
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage = {
      id: assistantMessageId,
      text: '',
      sender: 'bot' as const,
      timestamp: new Date()
    };

    addMessage(userMessage);
    addMessage(assistantMessage);

    setIsStreaming(true);
    setStreamingMessageId(assistantMessageId);

    try {
      let fullResponse = '';
      
      await generateStreamingResponse(
        text,
        messages,
        apiKey,
        (chunk) => {
          fullResponse = chunk;
          updateMessage(assistantMessageId, { text: chunk });
        },
        {
          model,
          maxTokens,
          temperature,
          systemPrompt
        }
      );

      updateMessage(assistantMessageId, { 
        text: fullResponse
      });

      if (voiceEnabled && autoSpeak && fullResponse) {
        setTimeout(() => {
          voiceService.speak(fullResponse);
        }, 500);
      }

    } catch (error) {
      console.error('Error generating response:', error);
      updateMessage(assistantMessageId, {
        text: 'Sorry, I encountered an error while generating a response. Please check your API key and try again.'
      });
      toast.error('Failed to generate response');
    } finally {
      setIsStreaming(false);
      setStreamingMessageId(null);
    }
  }, [
    messages, apiKey, model, maxTokens, temperature, systemPrompt,
    addMessage, updateMessage, setIsStreaming, setStreamingMessageId,
    voiceEnabled, autoSpeak
  ]);

  const handleRegenerate = useCallback((messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex > 0) {
      const previousUserMessage = messages[messageIndex - 1];
      regenerateResponse(messageId);
      if (previousUserMessage && previousUserMessage.sender === 'user') {
        handleSendMessage(previousUserMessage.text, previousUserMessage.attachments);
      }
    }
  }, [messages, regenerateResponse, handleSendMessage]);

  const handleDeleteMessage = useCallback((messageId: string) => {
    deleteMessage(messageId);
    toast.success('Message deleted');
  }, [deleteMessage]);

  const handleVoiceInput = useCallback((text: string) => {
    handleSendMessage(text);
  }, [handleSendMessage]);

  const handleTemplateSelect = useCallback((prompt: string) => {
    handleSendMessage(prompt);
  }, [handleSendMessage]);

  const handleSearchResults = useCallback((results: Message[]) => {
    setFilteredMessages(results);
    setIsSearchActive(results.length !== messages.length || results.length === 0);
  }, [messages.length]);

  if (!isConnected) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="nexus-card p-8 max-w-md mx-auto text-center nexus-hover-lift">
            <div className="nexus-brand-logo w-20 h-20 mx-auto mb-6 animate-glow-pulse">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Connect to Get Started</h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              You'll need to configure your API key to unlock the full power of Nexus AI. Visit the Profile tab to get started.
            </p>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 nexus-transition">
              <Crown className="w-3 h-3 mr-1" />
              Premium Features Available
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Enhanced Header with Advanced Controls */}
      <div className="border-b border-white/10 p-4 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className={`${
                showSearch 
                  ? 'text-blue-400 bg-blue-400/10' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            
            <ConversationTemplates onSelectTemplate={handleTemplateSelect} />
            <ConversationExport />
          </div>
          
          <div className="flex items-center gap-2">
            <AdvancedVoiceControl onVoiceInput={handleVoiceInput} disabled={isStreaming} />
            
            {isSearchActive && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                {filteredMessages.length} results
              </Badge>
            )}
          </div>
        </div>
        
        {/* Search Panel */}
        {showSearch && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <ConversationSearch onResultsChange={handleSearchResults} />
          </div>
        )}
      </div>

      {/* Enhanced Messages Area with custom scrolling */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 nexus-scrollbar">
        <div className="space-y-6 max-w-4xl mx-auto">
          {displayMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center py-12">
              <div className="max-w-lg space-y-8">
                {/* Enhanced Welcome Section with better branding */}
                <div className="relative mb-12">
                  <div className="nexus-brand-logo w-28 h-28 mx-auto animate-float">
                    <Sparkles className="w-14 h-14 text-white" />
                  </div>
                  <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-full blur-2xl animate-gradient-shift" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold nexus-text-gradient">
                    Welcome to Nexus AI
                  </h2>
                  <p className="text-xl text-white/90 font-semibold">
                    Your Premium AI Assistant
                  </p>
                  <p className="text-white/70 leading-relaxed text-lg">
                    Experience the power of advanced artificial intelligence with personalized responses, 
                    multimodal capabilities, and seamless conversation flow.
                  </p>
                </div>

                {/* Enhanced feature highlights */}
                <div className="grid grid-cols-2 gap-6 mt-12">
                  <div className="nexus-card p-6 text-left nexus-interactive">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 nexus-shadow">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-white text-base mb-2">AI Powered</h4>
                    <p className="text-sm text-white/70">Advanced language understanding with cutting-edge models</p>
                  </div>
                  <div className="nexus-card p-6 text-left nexus-interactive">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 nexus-shadow">
                      <Crown className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-white text-base mb-2">Premium Experience</h4>
                    <p className="text-sm text-white/70">Exclusive features, priority support & enhanced capabilities</p>
                  </div>
                </div>

                {!apiKey && (
                  <div className="nexus-card p-6 border-orange-500/30 bg-orange-500/10 mt-8 nexus-transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        🔑
                      </div>
                      <div>
                        <p className="text-orange-300 font-semibold text-sm">
                          Configure API Key Required
                        </p>
                        <p className="text-orange-300/80 text-xs">
                          Visit the Profile tab to begin your AI journey
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {isSearchActive && (
                <div className="nexus-card p-4 mb-6 border-blue-500/30 bg-blue-500/10">
                  <div className="flex items-center gap-2 text-blue-300">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm">
                      Showing {filteredMessages.length} of {messages.length} messages
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsSearchActive(false);
                        setShowSearch(false);
                      }}
                      className="ml-auto text-blue-300 hover:text-blue-200 hover:bg-blue-400/10"
                    >
                      Clear filters
                    </Button>
                  </div>
                </div>
              )}
              
              {displayMessages.map((message, index) => (
                <MessageDisplay
                  key={message.id}
                  message={message}
                  isLast={index === displayMessages.length - 1}
                  onRegenerate={message.sender === 'bot' ? () => handleRegenerate(message.id) : undefined}
                  onDelete={() => handleDeleteMessage(message.id)}
                />
              ))}
            </>
          )}
          
          {isStreaming && streamingMessageId && (
            <div className="flex justify-start">
              <div className="nexus-card p-4 max-w-xs nexus-transition">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Enhanced Input Area */}
      <div className="p-6 bg-black/20 backdrop-blur-xl border-t border-white/10 nexus-shadow">
        <InputArea
          onSend={handleSendMessage}
          disabled={isStreaming}
          placeholder={
            !user 
              ? "Sign in to start your AI conversation..." 
              : isStreaming 
                ? "Nexus AI is thinking..." 
                : "Message Nexus AI..."
          }
        />
      </div>
    </div>
  );
};
