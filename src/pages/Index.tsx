
import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatManager } from "@/components/ChatManager";
import SessionSidebar from "@/components/SessionSidebar";
import SettingsPanel from "@/components/SettingsPanel";
import { UserMenu } from "@/components/navigation/UserMenu";
import { useDatabase } from "@/hooks/useDatabase";

const Index = () => {
  // Initialize database sync
  useDatabase();

  // State for controlling sidebar and settings panel visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="flex h-screen">
        <SessionSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/80 backdrop-blur-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
                >
                  ☰
                </Button>
                <h1 className="text-2xl font-bold nexus-gradient bg-clip-text text-transparent">
                  Nexus AI
                </h1>
                <span className="text-sm text-muted-foreground">
                  Your AI Assistant Platform
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <UserMenu />
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 flex">
            <ChatManager />
            {isSettingsOpen && (
              <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
