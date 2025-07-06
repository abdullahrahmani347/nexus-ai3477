
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
    <div className="nexus-page-layout h-screen flex">
      {/* Enhanced Sidebar */}
      <ChatHubSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Premium Header */}
        <header className="nexus-page-header px-6 py-4 flex-shrink-0 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden nexus-btn-ghost h-10 w-10 p-0"
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
                <h1 className="nexus-heading-md">
                  Intelligent Conversations
                </h1>
                <p className="nexus-text-subtle">
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
                className="hidden md:flex items-center gap-2 nexus-btn-ghost px-3"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search</span>
                <kbd className="text-xs bg-white/20 dark:bg-gray-800/40 px-1.5 py-0.5 rounded border border-white/30 dark:border-gray-700/50">
                  ⌘K
                </kbd>
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm"
                className="nexus-btn-ghost h-10 w-10 p-0 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Profile */}
              <div className="hidden md:flex items-center gap-2 nexus-card px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-32">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs nexus-text-subtle">
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
                className="nexus-btn-secondary hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors h-10"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main className="nexus-page-content overflow-hidden">
          <ChatManager />
        </main>
      </div>
    </div>
  );
};

export default ChatInterface;
