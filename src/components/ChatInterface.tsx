
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
    <div className="min-h-screen flex nexus-gradient-bg">
      {/* Enhanced Sidebar */}
      <ChatHubSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Nexus AI Header */}
        <header className="nexus-page-header px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center nexus-space-md">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden h-10 w-10 p-0"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              {/* Brand Logo - Hidden on mobile when sidebar is closed */}
              <div className={cn(
                "lg:hidden transition-opacity duration-200",
                sidebarOpen ? "opacity-0" : "opacity-100"
              )}>
                <NexusLogo size="sm" variant="minimal" />
              </div>

              {/* Desktop Title */}
              <div className="hidden lg:block">
                <h1 className="nexus-h4 nexus-gradient-text font-bold">
                  Nexus AI Hub
                </h1>
                <p className="nexus-small text-muted-foreground">
                  Where Intelligence Connects
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center nexus-space-sm">
              {/* Search Button - Desktop */}
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden md:flex items-center nexus-space-sm px-3"
              >
                <Search className="w-4 h-4" />
                <span className="nexus-small">Search</span>
                <kbd className="nexus-caption bg-muted px-1.5 py-0.5 rounded border text-muted-foreground">
                  ⌘K
                </kbd>
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm"
                className="h-10 w-10 p-0 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-error-red rounded-full animate-pulse"></span>
              </Button>

              {/* User Profile */}
              <div className="hidden md:flex items-center nexus-space-sm nexus-card px-3 py-2">
                <div className="w-8 h-8 nexus-gradient-bg rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="nexus-small">
                  <p className="font-medium text-foreground truncate max-w-32">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="nexus-caption text-muted-foreground">
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
                className="h-10 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors"
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
