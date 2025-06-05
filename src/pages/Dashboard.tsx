
import { useState } from "react";
import { Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatManager } from "@/components/ChatManager";
import SessionSidebar from "@/components/SessionSidebar";
import { UserMenu } from "@/components/navigation/UserMenu";
import { NexusBranding, NexusStatusBadge } from "@/components/ui/nexus-branding";
import { UserAnalytics } from "@/components/UserAnalytics";
import { useDatabase } from "@/hooks/useDatabase";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  useDatabase();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Show loading screen while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading Nexus AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background effects with Phase 4 polish */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10 animate-pulse" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-pink-500/15 rounded-full blur-2xl animate-pulse delay-500" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <div className="flex h-screen relative z-10 nexus-scrollbar">
        <SessionSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header with Phase 4 optimizations */}
          <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative nexus-shadow">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-white/70 hover:text-white hover:bg-white/10 nexus-transition rounded-lg transition-all duration-200"
                >
                  ☰
                </Button>
                
                <NexusBranding 
                  size="md"
                  subtitle="Advanced AI Dashboard"
                  showStatus={true}
                  showBadge={true}
                />
                
                {/* Enhanced Phase 4 Badge */}
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-500/30 nexus-transition animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Phase 4 Optimized
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="text-white/70 hover:text-white hover:bg-white/10 nexus-transition transition-all duration-200"
                  >
                    {showAnalytics ? 'Chat' : 'Analytics'}
                  </Button>
                )}
                <NexusStatusBadge />
                <UserMenu />
              </div>
            </div>
          </header>
          
          {/* Main Content with enhanced performance optimizations */}
          <div className="flex-1 p-6 nexus-scrollbar">
            <div className="h-full nexus-card transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              {showAnalytics && user ? (
                <UserAnalytics className="h-full p-6" />
              ) : (
                <ChatManager className="h-full" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced performance indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-xs text-white/60">
          Phase 4: Scale & Polish Active
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
