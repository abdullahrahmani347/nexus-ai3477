
import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, Plus, Moon, Sun, Menu, Search, Download, Sparkles, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SettingsPanel from './SettingsPanel';
import VoiceControl from './VoiceControl';
import FileAttachment from './FileAttachment';
import SessionSidebar from './SessionSidebar';
import ExportDialog from './ExportDialog';
import { useChatStore } from '../store/chatStore';
import { generateStreamingResponse } from '../services/streamingService';
import { useTheme } from './ThemeProvider';
import { voiceService } from '../services/voiceService';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
    getCurrentSession
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
      // Focus input on any key press (except when in settings or editing)
      if (
        !showSettings && 
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
          case ',':
            e.preventDefault();
            setShowSettings(!showSettings);
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

      // Escape to close settings/sidebar
      if (e.key === 'Escape') {
        if (showSettings) setShowSettings(false);
        if (showSidebar) setShowSidebar(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSettings, showSidebar, clearMessages, toggleTheme]);

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input.trim(),
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
      const response = await generateStreamingResponse(
        userMessage.text, 
        messages, 
        apiKey,
        (chunk) => {
          // Update the streaming message
          const state = useChatStore.getState();
          state.updateMessage(botMessageId, { text: chunk });
        },
        {
          model,
          maxTokens,
          temperature,
          systemPrompt
        }
      );
      
      // Final update
      const state = useChatStore.getState();
      state.updateMessage(botMessageId, { text: response });

      // Auto-speak if enabled
      if (autoSpeak && voiceEnabled) {
        voiceService.speak(response);
      }

    } catch (error) {
      console.error('Failed to generate response:', error);
      const errorMessage = error instanceof Error ? error.message : "I'm sorry, I'm having trouble connecting right now. Please check your API key in settings or try again later.";
      
      const state = useChatStore.getState();
      state.updateMessage(botMessageId, { 
        text: errorMessage,
        isError: true
      });
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

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10 animate-pulse" />
      
      {/* Session Sidebar */}
      <SessionSidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Enhanced Header */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between relative nexus-shadow">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
          <div className="flex items-center space-x-4 relative z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-white/70 hover:text-white hover:bg-white/10 nexus-transition rounded-lg"
              title="Toggle Sidebar (Ctrl+B)"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            {/* Enhanced Nexus AI Branding */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 nexus-gradient rounded-2xl flex items-center justify-center nexus-glow">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black/80 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold nexus-text-gradient">
                  Nexus AI
                </h1>
                <p className="text-sm text-white/60 flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Advanced AI Assistant
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Not connected
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {/* Session Title */}
            {getCurrentSession()?.title && getCurrentSession()?.title !== 'Nexus AI' && (
              <div className="hidden md:block">
                <div className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/20">
                  <span className="text-sm text-white/90 font-medium">
                    {getCurrentSession()?.title}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 relative z-10">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48 h-9 text-sm bg-white/10 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40"
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
              className="text-white/70 hover:text-white hover:bg-white/10 nexus-transition"
              title="Toggle Theme (Ctrl+D)"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            <ExportDialog>
              <Button
                variant="ghost"
                size="sm"
                disabled={messages.length === 0}
                className="text-white/70 hover:text-white hover:bg-white/10 nexus-transition"
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
              className="text-white/70 hover:text-white hover:bg-white/10 nexus-transition"
              title="New Chat (Ctrl+K)"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white/70 hover:text-white hover:bg-white/10 nexus-transition"
              title="Settings (Ctrl+,)"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
          <div className="space-y-6 max-w-4xl mx-auto">
            {filteredMessages.length === 0 && !searchQuery && (
              <div className="text-center py-16">
                {/* Enhanced Welcome Section */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 nexus-gradient rounded-3xl flex items-center justify-center mx-auto nexus-glow animate-glow-pulse">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse" />
                </div>
                
                <h2 className="text-3xl font-bold nexus-text-gradient mb-3">
                  Welcome to Nexus AI
                </h2>
                <p className="text-white/70 mb-8 text-lg">
                  Your intelligent AI companion powered by advanced machine learning
                </p>
                
                {/* Enhanced Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                  <div className="nexus-card p-4 nexus-interactive">
                    <Bot className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Smart Conversations</h3>
                    <p className="text-sm text-white/60">Natural language processing for human-like interactions</p>
                  </div>
                  <div className="nexus-card p-4 nexus-interactive">
                    <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Advanced Features</h3>
                    <p className="text-sm text-white/60">Voice control, file attachments, and export options</p>
                  </div>
                </div>
                
                {/* Keyboard Shortcuts */}
                <div className="nexus-card p-6 max-w-md mx-auto">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Keyboard Shortcuts
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">New chat</span>
                      <kbd className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs font-medium text-purple-300">Ctrl+K</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Settings</span>
                      <kbd className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs font-medium text-purple-300">Ctrl+,</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Toggle theme</span>
                      <kbd className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs font-medium text-purple-300">Ctrl+D</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Sidebar</span>
                      <kbd className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs font-medium text-purple-300">Ctrl+B</kbd>
                    </div>
                  </div>
                </div>
                
                {!apiKey && (
                  <div className="mt-6">
                    <div className="nexus-card p-4 max-w-md mx-auto border-orange-500/30 bg-orange-500/10">
                      <Settings className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                      <p className="text-orange-300 text-sm font-medium">
                        Please configure your API key in settings to begin
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {searchQuery && filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <div className="nexus-card p-8 max-w-md mx-auto">
                  <Search className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
                  <p className="text-white/60 mb-4">No messages found for "{searchQuery}"</p>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSearchQuery('')}
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
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
        <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 p-6 relative z-10">
          <div className="max-w-4xl mx-auto space-y-3">
            {/* File Attachments */}
            <FileAttachment
              files={attachedFiles}
              onFilesAdd={addFiles}
              onFileRemove={removeFile}
              disabled={!apiKey || isStreaming}
            />

            {/* Enhanced Input */}
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={apiKey ? "Type your message... (Enter to send)" : "Configure API key in settings first"}
                  disabled={!apiKey || isStreaming}
                  className="min-h-[48px] text-base bg-white/10 border-white/20 focus:border-purple-500 focus:ring-purple-500/20 text-white placeholder:text-white/50 rounded-xl px-4 py-3"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || !apiKey || isStreaming}
                className="nexus-gradient hover:opacity-90 text-white border-0 h-12 w-12 p-0 rounded-xl font-medium nexus-transition nexus-glow"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Status indicator */}
            {messages.length > 0 && (
              <div className="flex items-center justify-center">
                <div className="text-xs text-white/40 flex items-center gap-2">
                  <User className="w-3 h-3" />
                  {messages.filter(m => m.sender === 'user').length} messages from you
                  <Bot className="w-3 h-3 ml-2" />
                  {messages.filter(m => m.sender === 'bot').length} from Nexus AI
                </div>
              </div>
            )}
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
