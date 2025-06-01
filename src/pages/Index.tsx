
import { useState } from "react";
import { Settings, Sparkles, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="flex h-screen relative z-10">
        <SessionSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  ☰
                </Button>
                
                {/* Enhanced Nexus AI Branding */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                      Nexus AI
                    </h1>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                      <span className="text-xs text-white/60">Your AI Assistant</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Premium Features Indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white/80">AI Powered</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
                <UserMenu />
              </div>
            </div>
          </header>
          
          {/* Main Content with improved styling */}
          <div className="flex-1 flex relative">
            <div className="flex-1 relative">
              <ChatManager className="h-full" />
              
              {/* Floating branding element */}
              <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Nexus AI</p>
                    <p className="text-xs text-white/60">Powered by Advanced AI</p>
                  </div>
                </div>
              </div>
            </div>
            
            {isSettingsOpen && (
              <div className="w-80 border-l border-white/10 bg-black/20 backdrop-blur-xl">
                <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
