
import { ChatInterface } from "@/components/ChatInterface";
import { SessionSidebar } from "@/components/SessionSidebar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { UserMenu } from "@/components/navigation/UserMenu";
import { useDatabase } from "@/hooks/useDatabase";

const Index = () => {
  // Initialize database sync
  useDatabase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="flex h-screen">
        <SessionSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/80 backdrop-blur-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold nexus-gradient bg-clip-text text-transparent">
                  Nexus AI
                </h1>
                <span className="text-sm text-muted-foreground">
                  Your AI Assistant Platform
                </span>
              </div>
              <UserMenu />
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 flex">
            <ChatInterface />
            <SettingsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
