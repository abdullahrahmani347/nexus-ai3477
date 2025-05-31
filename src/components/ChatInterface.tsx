
import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, Plus, Moon, Sun, Menu, Search, Download, Sparkles } from 'lucide-react';
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
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 pointer-events-none" />
      
      {/* Session Sidebar */}
      <SessionSidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="glass-effect border-b border-white/10 dark:border-white/5 p-4 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
              title="Toggle Sidebar (Ctrl+B)"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div className="relative">
              <div className="w-10 h-10 nexus-gradient rounded-full flex items-center justify-center nexus-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                {getCurrentSession()?.title || 'Nexus AI'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isConnected ? (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Connected
                  </span>
                ) : 'Not connected'}
                {messages.length > 0 && ` • ${messages.length} messages`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48 h-8 text-sm glass-effect border-white/20 focus:border-purple-500"
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
              className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
              title="Toggle Theme (Ctrl+D)"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            <ExportDialog>
              <Button
                variant="ghost"
                size="sm"
                disabled={messages.length === 0}
                className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
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
              className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
              title="New Chat (Ctrl+K)"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
              title="Settings (Ctrl+,)"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredMessages.length === 0 && !searchQuery && (
              <div className="text-center py-12">
                <div className="relative mb-6">
                  <div className="w-20 h-20 nexus-gradient rounded-full flex items-center justify-center mx-auto nexus-glow">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
                  Welcome to Nexus AI
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Your intelligent AI companion powered by advanced machine learning</p>
                <div className="glass-effect rounded-lg p-4 max-w-md mx-auto">
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p><kbd className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs font-medium">Ctrl+K</kbd> New chat</p>
                    <p><kbd className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs font-medium">Ctrl+,</kbd> Settings</p>
                    <p><kbd className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs font-medium">Ctrl+D</kbd> Toggle theme</p>
                    <p><kbd className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs font-medium">Ctrl+B</kbd> Toggle sidebar</p>
                  </div>
                </div>
                {!apiKey && (
                  <p className="text-orange-600 text-sm mt-4 glass-effect rounded-lg p-3 inline-block">
                    Please configure your API key in settings to begin
                  </p>
                )}
              </div>
            )}

            {searchQuery && filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No messages found for "{searchQuery}"</p>
                <Button 
                  variant="ghost" 
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-sm hover:text-purple-600"
                >
                  Clear search
                </Button>
              </div>
            )}
            
            {filteredMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isStreaming && <TypingIndicator />}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="glass-effect border-t border-white/10 dark:border-white/5 p-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* File Attachments */}
            <FileAttachment
              files={attachedFiles}
              onFilesAdd={addFiles}
              onFileRemove={removeFile}
              disabled={!apiKey || isStreaming}
            />

            {/* Input */}
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={apiKey ? "Type your message... (Enter to send, Shift+Enter for new line)" : "Configure API key in settings first"}
                  disabled={!apiKey || isStreaming}
                  className="pr-12 min-h-[44px] resize-none glass-effect border-white/20 focus:border-purple-500 focus:ring-purple-500/20 dark:text-gray-100"
                  style={{ minHeight: '44px' }}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || !apiKey || isStreaming}
                className="nexus-gradient hover:opacity-90 text-white border-0 h-11 px-6 font-medium transition-all nexus-glow"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
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
