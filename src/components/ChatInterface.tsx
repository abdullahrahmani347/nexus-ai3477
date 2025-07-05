
import React from 'react';
import { ChatManager } from '@/components/ChatManager';
import { SettingsButton } from '@/components/SettingsButton';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User, Bot } from 'lucide-react';
import { toast } from 'sonner';

const ChatInterface = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Modern Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-gray-900 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Nexus AI
              </h1>
              <p className="text-xs text-gray-400">Your AI Companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300 bg-black/20 rounded-xl px-3 py-2">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <SettingsButton />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ChatManager />
      </div>
    </div>
  );
};

export default ChatInterface;
