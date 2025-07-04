
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Moon, Sun, Menu, Search, Download, Bot, User, Settings, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import MessageBubble from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { VoiceControl } from './VoiceControl';
import FileAttachment from './FileAttachment';
import SessionSidebar from './SessionSidebar';
import ExportDialog from './ExportDialog';
import { ModelSelector } from './ModelSelector';
import { useChatStore } from '../store/chatStore';
import { StreamingService } from '../services/streamingService';
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

    if (!apiKey || !isConnected) {
      toast.error('API connection not available. Please check your connection.');
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
      console.log('Starting response generation with API key:', apiKey);
      await StreamingService.streamChat(
        [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          { role: 'user', content: userMessage.text }
        ],
        apiKey,
        model,
        {
          onToken: (token: string) => {
            updateMessage(botMessageId, { text: token });
          },
          onComplete: (fullResponse: string) => {
            updateMessage(botMessageId, { text: fullResponse });
            
            // Auto-speak if enabled
            if (autoSpeak && voiceEnabled) {
              voiceService.speak(fullResponse);
            }
            
            toast.success('Response generated successfully');
          },
          onError: (error: string) => {
            updateMessage(botMessageId, { 
              text: error,
              isError: true
            });
            toast.error(error);
          }
        }
      );
      
      console.log('Response generation completed');

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
  const isApiKeyValid = apiKey && apiKey.trim().length > 20 && apiKey.startsWith('tgp_v1_');

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Enhanced background with premium gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]" />
      
      {/* Session Sidebar */}
      <SessionSidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Premium Header */}
        <div className="bg-black/50 backdrop-blur-xl border-b border-white/20 p-4 flex items-center justify-between relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-pink-500/10" />
          <div className="flex items-center space-x-4 relative z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-xl border border-white/10"
              title="Toggle Sidebar (Ctrl+B)"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            {/* Premium Nexus AI Branding */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 border border-white/20">
                  <Bot className="w-7 h-7 text-white drop-shadow-sm" />
                </div>
                {isConnected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-900 animate-pulse shadow-lg shadow-green-500/50" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 bg-clip-text text-transparent drop-shadow-sm">
                    Nexus AI
                  </h1>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/30 text-purple-200 text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                <div className="text-xs text-white/70 flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-sm" />
                      <span className="font-medium">Connected & Ready</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
                      <span>Connecting...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 relative z-10">
            {/* Enhanced Search */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-56 h-10 text-sm bg-white/10 border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/60 rounded-xl backdrop-blur-sm"
              />
            </div>

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
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-xl border border-white/10"
              title="Toggle Theme (Ctrl+D)"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            <ExportDialog>
              <Button
                variant="ghost"
                size="sm"
                disabled={messages.length === 0}
                className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-xl border border-white/10"
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
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-xl border border-white/10"
              title="New Chat (Ctrl+K)"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </Button>
          </div>
        </div>

        {/* Model Selection and Rate Limit Info */}
        <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <ModelSelector />
          </div>
        </div>

        {/* Messages Area with premium styling */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
          <div className="space-y-6 max-w-4xl mx-auto">
            {filteredMessages.length === 0 && !searchQuery && (
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/30 border border-white/20">
                    <Bot className="w-12 h-12 text-white drop-shadow-sm" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-full blur-xl -z-10" />
                </div>
                
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 bg-clip-text text-transparent mb-4">
                  Welcome to Nexus AI
                </h2>
                <div className="text-white/80 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                  Your premium AI assistant is ready to help. Experience the power of advanced AI conversation.
                </div>
                
                <div className="flex items-center justify-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>AI Powered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span>Premium Experience</span>
                  </div>
                </div>
              </div>
            )}

            {searchQuery && filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
                  <Search className="w-12 h-12 text-white/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
                  <div className="text-white/70 mb-4">No messages found for "{searchQuery}"</div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSearchQuery('')}
                    className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 rounded-xl border border-purple-500/30"
                  >
                    Clear search
                  </Button>
                </div>
              </div>
            )}
            
            {filteredMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            <TypingIndicator isVisible={isStreaming} />
          </div>
        </ScrollArea>

        {/* Premium Input Area */}
        <div className="bg-black/50 backdrop-blur-xl border-t border-white/20 p-6 relative z-10">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* File Attachments */}
            <FileAttachment
              files={attachedFiles}
              onFilesAdd={addFiles}
              onFileRemove={removeFile}
              disabled={isStreaming}
            />

            {voiceEnabled && (
              <VoiceControl
                onVoiceInput={handleVoiceInput}
                disabled={isStreaming}
              />
            )}

            {/* Premium Input */}
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything... (Enter to send)"
                  disabled={isStreaming}
                  className="min-h-[56px] text-base bg-white/10 border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/60 rounded-2xl px-6 py-4 backdrop-blur-sm shadow-lg shadow-black/20"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming || !isConnected}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 h-[56px] w-[56px] p-0 rounded-2xl font-medium transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Enhanced status indicator */}
            {messages.length > 0 && (
              <div className="flex items-center justify-center">
                <div className="text-xs text-white/60 flex items-center gap-4 bg-white/5 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{messages.filter(m => m.sender === 'user').length} from you</span>
                  </div>
                  <div className="w-px h-3 bg-white/20" />
                  <div className="flex items-center gap-2">
                    <Bot className="w-3 h-3" />
                    <span>{messages.filter(m => m.sender === 'bot').length} from AI</span>
                  </div>
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
