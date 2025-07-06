
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
    <div className="h-screen flex bg-gradient-to-br from-background to-primary/5 dark:from-background dark:to-primary/10">
      {/* Enhanced Nexus Sidebar */}
      <ChatHubSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Premium Nexus Header */}
        <header className="glass-effect border-b border-border px-6 py-4 flex-shrink-0 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden hover:bg-accent h-10 w-10 p-0 rounded-xl"
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
                <h1 className="text-xl font-bold text-nexus-gradient font-heading">
                  Advanced AI Intelligence
                </h1>
                <p className="text-sm text-muted-foreground">
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
                className="hidden md:flex items-center gap-2 text-muted-foreground hover:bg-accent px-3 rounded-xl"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search</span>
                <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded border">
                  ⌘K
                </kbd>
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-accent h-10 w-10 p-0 relative rounded-xl"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
              </Button>

              {/* User Profile */}
              <div className="hidden md:flex items-center gap-2 glass-effect rounded-xl px-3 py-2 border">
                <div className="w-8 h-8 bg-nexus-primary rounded-lg flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground truncate max-w-32">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-primary font-medium">
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
                className="hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-colors h-10 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Enhanced Chat Area */}
        <main className="flex-1 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/5 dark:from-background dark:via-primary/10 dark:to-accent/10">
          <ChatManager />
        </main>
      </div>
    </div>
  );
};

export default ChatInterface;
