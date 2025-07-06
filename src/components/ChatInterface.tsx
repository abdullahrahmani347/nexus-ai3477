
import React, { useState } from 'react';
import { ChatManager } from '@/components/ChatManager';
import { SettingsButton } from '@/components/SettingsButton';
import { ChatHubSidebar } from '@/components/navigation/ChatHubSidebar';
import { NexusLogo } from '@/components/ui/nexus-logo';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu, X, Search, Settings, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ChatInterface = () => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-indigo-900">
      {/* Enhanced Nexus Sidebar */}
      <ChatHubSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Premium Nexus Header */}
        <header className="nexus-card border-b border-white/20 px-6 py-4 flex-shrink-0 sticky top-0 z-40 bg-gradient-to-r from-white/90 to-blue-50/90 dark:from-slate-900/90 dark:to-indigo-900/90 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden hover:bg-blue-100 dark:hover:bg-blue-900/20 h-10 w-10 p-0 rounded-xl"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              {/* Brand Logo - Hidden on mobile when sidebar is closed */}
              <div className={cn(
                "lg:hidden transition-opacity duration-200",
                sidebarOpen ? "opacity-0" : "opacity-100"
              )}>
                <NexusLogo size="sm" />
              </div>

              {/* Desktop Title */}
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent heading-font">
                  Advanced AI Intelligence
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Powered by next-generation artificial intelligence
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button - Desktop */}
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 px-3 rounded-xl"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search</span>
                <kbd className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border">
                  ⌘K
                </kbd>
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-blue-100 dark:hover:bg-blue-900/20 h-10 w-10 p-0 relative rounded-xl"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
              </Button>

              {/* User Profile */}
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl px-3 py-2 border border-blue-200/50 dark:border-blue-800/50">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-32">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Nexus Pro
                  </p>
                </div>
              </div>

              {/* Settings */}
              <SettingsButton />

              {/* Sign Out */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors h-10 rounded-xl border-gray-300 dark:border-gray-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Enhanced Chat Area */}
        <main className="flex-1 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-indigo-900/30 dark:to-purple-900/30">
          <ChatManager />
        </main>
      </div>
    </div>
  );
};

export default ChatInterface;
