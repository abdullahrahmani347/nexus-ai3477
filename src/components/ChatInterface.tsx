
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Moon, Sun, Menu, Search, Download, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import VoiceControl from './VoiceControl';
import FileAttachment from './FileAttachment';
import SessionSidebar from './SessionSidebar';
import ExportDialog from './ExportDialog';
import { SimplifiedBranding } from '@/components/ui/simplified-branding';
import { useChatStore } from '../store/chatStore';
import { generateStreamingResponse } from '../services/streamingService';
import { useTheme } from './ThemeProvider';
import { voiceService } from '../services/voiceService';
import { toast } from 'sonner';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    messages, 
    addMessage, 
    clearMessages, 
    apiKey,
    isConnected,
    currentSessionId,
    model,
    maxTokens,
    temperature,
    systemPrompt,
    attachedFiles,
    addFiles,
    removeFile,
    clearFiles,
    isStreaming,
    setIsStreaming,
    streamingMessageId,
    setStreamingMessageId,
    voiceEnabled,
    autoSpeak,
    getCurrentSession,
    updateMessage
  } = useChatStore();

  const { theme, toggleTheme } = useTheme();

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus input on any key press (except when editing)
      if (
        !e.ctrlKey && 
        !e.metaKey && 
        !e.altKey &&
        e.key.length === 1 &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        inputRef.current?.focus();
      }

      // Keyboard shortcuts
      if ((e.ctrlKey || e.metaKey)) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            clearMessages();
            break;
          case 'd':
            e.preventDefault();
            toggleTheme();
            break;
          case 'b':
            e.preventDefault();
            setShowSidebar(!showSidebar);
            break;
        }
      }

      // Escape to close sidebar
      if (e.key === 'Escape') {
        if (showSidebar) setShowSidebar(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSidebar, clearMessages, toggleTheme]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      toast.error('Please enter a message');
      return;
    }

    console.log('Sending message with API key:', apiKey ? (apiKey.substring(0, 10) + '...') : 'No API key');

    const userMessage = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: 'user' as const,
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    addMessage(userMessage);
    setInput('');
    clearFiles();
    setIsTyping(false);
    setIsStreaming(true);

    // Create bot message for streaming
    const botMessageId = (Date.now() + 1).toString();
    setStreamingMessageId(botMessageId);
    
    const botMessage = {
      id: botMessageId,
      text: '',
      sender: 'bot' as const,
      timestamp: new Date(),
    };
    addMessage(botMessage);

    try {
      console.log('Starting response generation...');
      const response = await generateStreamingResponse(
        userMessage.text, 
        messages, 
        apiKey,
        (chunk) => {
          // Update the streaming message
          updateMessage(botMessageId, { text: chunk });
        },
        {
          model,
          maxTokens,
          temperature,
          systemPrompt
        }
      );
      
      console.log('Response generation completed');
      // Final update
      updateMessage(botMessageId, { text: response });

      // Auto-speak if enabled
      if (autoSpeak && voiceEnabled) {
        voiceService.speak(response);
      }

      toast.success('Response generated successfully');

    } catch (error) {
      console.error('Failed to generate response:', error);
      const errorMessage = error instanceof Error ? error.message : "I'm sorry, I'm having trouble connecting right now. Please try again later.";
      
      updateMessage(botMessageId, { 
        text: errorMessage,
        isError: true
      });

      toast.error(errorMessage);
    } finally {
      setIsStreaming(false);
      setStreamingMessageId(null);
    }
  };

  const handleVoiceInput = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const handleSpeakResponse = (speakFn: (text: string) => void) => {
    // This callback receives the speak function from VoiceControl
    // It's used to set up the speaking capability
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Filter messages based on search
  const filteredMessages = searchQuery 
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Check if API key is properly configured
  const isApiKeyValid = apiKey && apiKey.trim().length > 20 && apiKey.startsWith('AIza');

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Enhanced background with smoother gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-blue-500/4 to-pink-500/8" />
      
      {/* Session Sidebar */}
      <SessionSidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Enhanced Header with Professional Branding */}
        <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
          <div className="flex items-center space-x-4 relative z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-xl"
              title="Toggle Sidebar (Ctrl+B)"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            {/* Professional Nexus AI Branding */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  isApiKeyValid ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                }`} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Nexus AI
                </h1>
                <div className="text-xs text-white/60 flex items-center gap-2">
                  {isApiKeyValid ? (
                    <>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      AI Ready
                    </>
                  ) : (
                    <>
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                      Initializing
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 relative z-10">
            {/* Enhanced Search */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-52 h-9 text-sm bg-white/10 border-white/20 focus:border-purple-400 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm"
              />
            </div>

            {/* Voice Controls */}
            {voiceEnabled && (
              <VoiceControl
                onVoiceInput={handleVoiceInput}
                onSpeakResponse={handleSpeakResponse}
                disabled={isStreaming}
              />
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-xl"
              title="Toggle Theme (Ctrl+D)"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            <ExportDialog>
              <Button
                variant="ghost"
                size="sm"
                disabled={messages.length === 0}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-xl"
                title="Export Chat"
              >
                <Download className="w-4 h-4" />
              </Button>
            </ExportDialog>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearMessages()}
              disabled={messages.length === 0}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-xl"
              title="New Chat (Ctrl+K)"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </Button>
          </div>
        </div>

        {/* Messages Area with improved styling */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
          <div className="space-y-6 max-w-4xl mx-auto">
            {filteredMessages.length === 0 && !searchQuery && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">
                  Welcome to Nexus AI
                </h2>
                <div className="text-white/70 mb-8 max-w-md mx-auto">
                  Your intelligent AI assistant is ready to help. Start a conversation by typing a message below.
                </div>
              </div>
            )}

            {searchQuery && filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 max-w-md mx-auto">
                  <Search className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
                  <div className="text-white/60 mb-4">No messages found for "{searchQuery}"</div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSearchQuery('')}
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-xl"
                  >
                    Clear search
                  </Button>
                </div>
              </div>
            )}
            
            {filteredMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isStreaming && <TypingIndicator />}
          </div>
        </ScrollArea>

        {/* Enhanced Input Area */}
        <div className="bg-black/40 backdrop-blur-xl border-t border-white/10 p-6 relative z-10">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* File Attachments */}
            <FileAttachment
              files={attachedFiles}
              onFilesAdd={addFiles}
              onFileRemove={removeFile}
              disabled={isStreaming}
            />

            {/* Enhanced Input */}
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Enter to send)"
                  disabled={isStreaming}
                  className="min-h-[50px] text-base bg-white/10 border-white/20 focus:border-purple-400 focus:ring-purple-400/20 text-white placeholder:text-white/50 rounded-xl px-4 py-3 backdrop-blur-sm"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 h-[50px] w-[50px] p-0 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-purple-500/25"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Simple status indicator */}
            {messages.length > 0 && (
              <div className="flex items-center justify-center">
                <div className="text-xs text-white/50 flex items-center gap-2">
                  <User className="w-3 h-3" />
                  {messages.filter(m => m.sender === 'user').length} messages from you
                  <Bot className="w-3 h-3 ml-2" />
                  {messages.filter(m => m.sender === 'bot').length} from AI
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
