
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Square, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStore } from '@/store/chatStore';
import { useDatabase } from '@/hooks/useDatabase';
import { StreamingService } from '@/services/streamingService';
import { voiceService } from '@/services/voiceService';
import { MessageDisplay } from '@/components/MessageDisplay';
import { TypingIndicator } from '@/components/TypingIndicator';
import { VoiceControl } from '@/components/VoiceControl';
import FileAttachment from '@/components/FileAttachment';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ChatManager: React.FC = () => {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    addMessage,
    updateMessage,
    apiKey,
    model,
    systemPrompt,
    currentSessionId,
    isStreaming,
    setIsStreaming,
    streamingMessageId,
    setStreamingMessageId,
    attachedFiles,
    clearFiles,
    autoSpeak,
    voiceEnabled
  } = useChatStore();

  const { isConnected } = useDatabase();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const generateResponse = useCallback(async (userMessage: string, messageId: string) => {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const conversationMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userMessage }
    ];

    abortControllerRef.current = new AbortController();
    
    setIsStreaming(true);
    setStreamingMessageId(messageId);
    let fullResponse = '';

    try {
      await StreamingService.streamChat(
        conversationMessages,
        apiKey,
        model,
        {
          onToken: (token: string) => {
            fullResponse += token;
            updateMessage(messageId, { text: fullResponse });
          },
          onComplete: (response: string) => {
            updateMessage(messageId, { 
              text: response,
              timestamp: new Date()
            });
            
            if (voiceEnabled && autoSpeak && voiceService.isSpeechSynthesisSupported()) {
              voiceService.speak(response).catch(console.error);
            }
            
            setIsStreaming(false);
            setStreamingMessageId(null);
            setIsGenerating(false);
          },
          onError: (error: string) => {
            updateMessage(messageId, { 
              text: `Error: ${error}`,
              timestamp: new Date()
            });
            setIsStreaming(false);
            setStreamingMessageId(null);
            setIsGenerating(false);
          }
        },
        abortControllerRef.current.signal
      );
    } catch (error) {
      console.error('Generation error:', error);
      updateMessage(messageId, { 
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      });
      setIsStreaming(false);
      setStreamingMessageId(null);
      setIsGenerating(false);
    }
  }, [apiKey, model, systemPrompt, messages, updateMessage, setIsStreaming, setStreamingMessageId, voiceEnabled, autoSpeak]);

  const handleSend = useCallback(async () => {
    if ((!input.trim() && attachedFiles.length === 0) || isGenerating || !isConnected) return;

    const userMessageId = Date.now().toString();
    const botMessageId = (Date.now() + 1).toString();
    
    let messageContent = input.trim();
    if (attachedFiles.length > 0) {
      const fileDescriptions = attachedFiles.map(file => `[File: ${file.name}]`).join(' ');
      messageContent = `${messageContent} ${fileDescriptions}`.trim();
    }

    addMessage({
      id: userMessageId,
      text: messageContent,
      sender: 'user',
      timestamp: new Date()
    });

    addMessage({
      id: botMessageId,
      text: '',
      sender: 'bot',
      timestamp: new Date()
    });

    setInput('');
    clearFiles();
    setIsGenerating(true);

    await generateResponse(messageContent, botMessageId);
  }, [input, attachedFiles, isGenerating, isConnected, addMessage, clearFiles, generateResponse]);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setStreamingMessageId(null);
    setIsGenerating(false);
  }, [setIsStreaming, setStreamingMessageId]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleVoiceInput = useCallback((text: string) => {
    setInput(prev => prev + (prev ? ' ' : '') + text);
  }, []);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30 mx-auto">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-400 to-red-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">Configure API Key</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Please configure your Together AI API key in settings to start chatting with your AI companion.
            </p>
            <Button 
              onClick={() => {/* Open settings */}} 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
            >
              Open Settings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 mx-auto">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Start a conversation</h3>
                <p className="text-gray-400 text-sm">Ask me anything! I'm here to help with your questions and tasks.</p>
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <MessageDisplay
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}
          
          <TypingIndicator isVisible={isStreaming} />
        </div>
      </ScrollArea>

      <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 p-4 space-y-4">
        {voiceEnabled && (
          <VoiceControl onVoiceInput={handleVoiceInput} />
        )}
        
        <FileAttachment
          files={attachedFiles}
          onFilesAdd={(files) => {
            const { addFiles } = useChatStore.getState();
            addFiles(files);
          }}
          onFileRemove={(fileId) => {
            const { removeFile } = useChatStore.getState();
            removeFile(fileId);
          }}
          disabled={isGenerating}
        />

        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isGenerating}
            className="min-h-[60px] resize-none bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 rounded-2xl"
            rows={2}
          />
          
          <div className="flex flex-col gap-2">
            {isGenerating ? (
              <Button 
                onClick={handleStop} 
                variant="destructive" 
                size="lg"
                className="bg-red-500 hover:bg-red-600 rounded-2xl px-6"
              >
                <Square className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSend} 
                disabled={(!input.trim() && attachedFiles.length === 0) || !isConnected}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl px-6 shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
