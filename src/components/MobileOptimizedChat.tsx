
import React from 'react';
import { MessageSquare, Settings, Menu, X, Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/store/chatStore';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from '@/components/navigation/UserMenu';
import { SessionManagement } from '@/components/SessionManagement';
import { MessageDisplay } from '@/components/MessageDisplay';
import { ModelSelector } from '@/components/ModelSelector';

export function MobileOptimizedChat() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const { messages, isStreaming } = useChatStore();
  const { user } = useAuth();

  const handleSendMessage = () => {
    if (inputValue.trim() && !isStreaming) {
      // Message sending logic would go here
      setInputValue('');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:bg-white/10 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Nexus AI
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            className="text-white hover:bg-white/10 lg:hidden"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <UserMenu />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                  <MessageSquare className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Welcome to Nexus AI
                </h3>
                <p className="text-white/60 mb-4">
                  Start a conversation with your AI assistant
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <MessageDisplay 
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1}
                />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Mobile Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 flex-shrink-0"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12"
                disabled={isStreaming}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isStreaming}
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 w-8 h-8 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl border-r border-white/10">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Chat Sessions</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <SessionManagement onSessionSelect={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile Settings Overlay */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSettingsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl border-l border-white/10">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSettingsOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              <ModelSelector />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
