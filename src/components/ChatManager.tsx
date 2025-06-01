
import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
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
      toast.error('Please configure your API key in settings');
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

    // Add messages to store
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

      // Update final message
      updateMessage(assistantMessageId, { 
        text: fullResponse
      });

      // Auto-speak if enabled
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
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please configure your API key in the settings panel to start chatting.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="max-w-md">
                <h3 className="text-lg font-semibold mb-2">Welcome to Nexus AI</h3>
                <p className="text-muted-foreground">
                  Start a conversation by typing a message below. I'm here to help with any questions or tasks you have.
                </p>
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
              <div className="bg-muted border rounded-lg px-4 py-3">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <InputArea
        onSend={handleSendMessage}
        disabled={isStreaming}
        placeholder={
          !user 
            ? "Please sign in to start chatting..." 
            : isStreaming 
              ? "Generating response..." 
              : "Type your message..."
        }
      />
    </div>
  );
};
