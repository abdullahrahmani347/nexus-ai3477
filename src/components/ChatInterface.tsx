
import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SettingsPanel from './SettingsPanel';
import { useChatStore } from '../store/chatStore';
import { generateResponse } from '../services/geminiService';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    addMessage, 
    clearMessages, 
    apiKey,
    isConnected,
    sessionId 
  } = useChatStore();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateResponse(input, messages, apiKey);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot' as const,
        timestamp: new Date(),
      };

      addMessage(botMessage);
    } catch (error) {
      console.error('Failed to generate response:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please check your API key in settings or try again later.",
        sender: 'bot' as const,
        timestamp: new Date(),
        isError: true,
      };
      addMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exportTranscript = () => {
    const transcript = messages
      .map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`)
      .join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-transcript-${sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AI</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Gemini Chat</h1>
              <p className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Not connected'}
                {messages.length > 0 && ` • ${messages.length} messages`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportTranscript}
              disabled={messages.length === 0}
              className="text-gray-600 hover:text-gray-800"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearMessages()}
              disabled={messages.length === 0}
              className="text-gray-600 hover:text-gray-800"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 hover:text-gray-800"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">AI</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Gemini Chat</h2>
                <p className="text-gray-600 mb-4">Start a conversation with Google's Gemini AI</p>
                {!apiKey && (
                  <p className="text-orange-600 text-sm">
                    Please configure your API key in settings to begin
                  </p>
                )}
              </div>
            )}
            
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isTyping && <TypingIndicator />}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4">
          <div className="max-w-4xl mx-auto flex items-end space-x-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={apiKey ? "Type your message..." : "Configure API key in settings first"}
                disabled={!apiKey}
                className="pr-12 min-h-[44px] resize-none bg-white/90 border-gray-300/50 focus:border-blue-500 focus:ring-blue-500/20"
                style={{ minHeight: '44px' }}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !apiKey || isTyping}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-11 px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default ChatInterface;
