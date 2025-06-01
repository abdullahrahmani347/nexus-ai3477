
import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Sparkles, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MessageDisplay } from './MessageDisplay';
import { InputArea } from './InputArea';
import TypingIndicator from './TypingIndicator';
import { useChatStore } from '@/store/chatStore';
import { useAuth } from '@/hooks/useAuth';
import { generateStreamingResponse } from '@/services/streamingService';
import { FileData } from '@/services/fileService';
import { voiceService } from '@/services/voiceService';
import { toast } from 'sonner';

interface ChatManagerProps {
  className?: string;
}

export const ChatManager: React.FC<ChatManagerProps> = ({ className = '' }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
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

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isStreaming]);

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

  if (!isConnected) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="nexus-card p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Connect to Get Started</h3>
            <p className="text-white/70 mb-4">
              You'll need to configure your API key to unlock the full power of Nexus AI. Visit the Profile tab to get started.
            </p>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
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
      {/* Enhanced Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 custom-scrollbar">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center py-12">
              <div className="max-w-lg space-y-6">
                {/* Enhanced Welcome Section */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto animate-float nexus-glow">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold nexus-text-gradient">
                    Welcome to Nexus AI
                  </h2>
                  <p className="text-xl text-white/80 font-medium">
                    Your Premium AI Assistant
                  </p>
                  <p className="text-white/60 leading-relaxed">
                    Experience the power of advanced artificial intelligence with personalized responses, 
                    multimodal capabilities, and seamless conversation flow.
                  </p>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="nexus-card p-4 text-left">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                    <h4 className="font-medium text-white text-sm">AI Powered</h4>
                    <p className="text-xs text-white/60">Advanced language understanding</p>
                  </div>
                  <div className="nexus-card p-4 text-left">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                      <Crown className="w-4 h-4 text-blue-400" />
                    </div>
                    <h4 className="font-medium text-white text-sm">Premium</h4>
                    <p className="text-xs text-white/60">Exclusive features & priority</p>
                  </div>
                </div>

                {!apiKey && (
                  <div className="nexus-card p-4 border-orange-500/30 bg-orange-500/10 mt-6">
                    <p className="text-orange-300 text-sm font-medium">
                      🔑 Configure your API key in the Profile tab to begin your AI journey
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageDisplay
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
                onRegenerate={message.sender === 'bot' ? () => handleRegenerate(message.id) : undefined}
                onDelete={() => handleDeleteMessage(message.id)}
              />
            ))
          )}
          
          {isStreaming && streamingMessageId && (
            <div className="flex justify-start">
              <div className="nexus-card p-4 max-w-xs">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Enhanced Input Area */}
      <div className="p-6 bg-black/20 backdrop-blur-xl border-t border-white/10">
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
