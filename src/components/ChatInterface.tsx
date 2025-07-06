
import React, { useState } from 'react';
import { ChatManager } from '@/components/ChatManager';
import { SettingsButton } from '@/components/SettingsButton';
import { ChatHubSidebar } from '@/components/navigation/ChatHubSidebar';
import { BrandLogo } from '@/components/ui/brand-logo';
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
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced Sidebar */}
      <ChatHubSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Premium Header */}
        <header className="glass-effect border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 h-10 w-10 p-0"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              {/* Brand Logo - Hidden on mobile when sidebar is closed */}
              <div className={cn(
                "lg:hidden transition-opacity duration-200",
                sidebarOpen ? "opacity-0" : "opacity-100"
              )}>
                <BrandLogo size="sm" variant="premium" />
              </div>

              {/* Desktop Title */}
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-heading">
                  Intelligent Conversations
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Powered by advanced AI models
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button - Desktop */}
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 px-3"
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
                className="hover:bg-gray-100 dark:hover:bg-gray-800 h-10 w-10 p-0 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Profile */}
              <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-32">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Pro Member
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
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors h-10"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-800">
          <ChatManager />
        </main>
      </div>
    </div>
  );
};

export default ChatInterface;
