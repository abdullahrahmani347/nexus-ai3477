import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, Download, Plus, Moon, Sun, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SettingsPanel from './SettingsPanel';
import VoiceControl from './VoiceControl';
import FileAttachment from './FileAttachment';
import SessionSidebar from './SessionSidebar';
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
        }
      }

      // Escape to close settings
      if (e.key === 'Escape' && showSettings) {
        setShowSettings(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSettings, clearMessages, toggleTheme]);

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

  const exportTranscript = () => {
    const session = getCurrentSession();
    const transcript = (session?.messages || messages)
      .map(msg => `${msg.sender.toUpperCase()} (${new Date(msg.timestamp).toLocaleString()}): ${msg.text}`)
      .join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-transcript-${currentSessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter messages based on search
  const filteredMessages = searchQuery 
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Session Sidebar */}
      <SessionSidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AI</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {getCurrentSession()?.title || 'Gemini Chat'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isConnected ? 'Connected' : 'Not connected'}
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
                className="pl-9 w-48 h-8 text-sm"
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
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportTranscript}
              disabled={messages.length === 0}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearMessages()}
              disabled={messages.length === 0}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              title="New Chat (Ctrl+K)"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
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
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">AI</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Welcome to Gemini Chat</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Start a conversation with Google's Gemini AI</p>
                <div className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <p><kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+K</kbd> New chat</p>
                  <p><kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+,</kbd> Settings</p>
                  <p><kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+D</kbd> Toggle theme</p>
                </div>
                {!apiKey && (
                  <p className="text-orange-600 text-sm mt-4">
                    Please configure your API key in settings to begin
                  </p>
                )}
              </div>
            )}

            {searchQuery && filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No messages found for "{searchQuery}"</p>
              </div>
            )}
            
            {filteredMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isStreaming && <TypingIndicator />}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 p-4">
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
                  className="pr-12 min-h-[44px] resize-none bg-white/90 dark:bg-gray-700/90 border-gray-300/50 dark:border-gray-600/50 focus:border-blue-500 focus:ring-blue-500/20 dark:text-gray-100"
                  style={{ minHeight: '44px' }}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || !apiKey || isStreaming}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-11 px-6"
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
