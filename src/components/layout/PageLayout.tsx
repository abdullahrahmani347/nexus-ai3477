
import React from 'react';
import { ChatHubSidebar } from '@/components/navigation/ChatHubSidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  showSidebar?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  className,
  showSidebar = true
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex nexus-gradient-bg">
      {/* Sidebar */}
      {showSidebar && (
        <ChatHubSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="nexus-page-header px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center nexus-space-md">
              {/* Mobile Menu Button */}
              {showSidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden nexus-btn-tertiary h-10 w-10 p-0"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              )}

              {/* Page Title */}
              {title && (
                <div className="nexus-stack-sm">
                  <h1 className="nexus-page-title">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="nexus-page-subtitle">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={cn(
          "nexus-page-content",
          className
        )}>
          <div className="nexus-container py-8 nexus-animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
