import { useState } from "react";
import { MessageSquare, Users, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatManager } from "@/components/ChatManager";
import SessionSidebar from "@/components/SessionSidebar";
import { UserMenu } from "@/components/navigation/UserMenu";
import { UserAnalytics } from "@/components/UserAnalytics";
import { FeaturesSidebar } from "@/components/navigation/FeaturesSidebar";
import { SimplifiedBranding } from "@/components/ui/simplified-branding";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useDatabase } from "@/hooks/useDatabase";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  useDatabase();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

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
      {/* Simplified background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5" />
      
      <div className="flex h-screen relative z-10">
        {/* Features Sidebar */}
        <FeaturesSidebar 
          isOpen={showFeatures} 
          onClose={() => setShowFeatures(false)} 
        />
        
        {/* Main Sidebar */}
        <SessionSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Simplified Header */}
          <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative flex-shrink-0">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  ☰
                </Button>
                
                <SimplifiedBranding size="md" />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeatures(!showFeatures)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Features
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    {showAnalytics ? 'Chat' : 'Analytics'}
                  </Button>
                )}
                <UserMenu />
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {showAnalytics && user ? (
              <UserAnalytics className="h-full" />
            ) : (
              <div className="p-6 space-y-6">
                {/* Welcome Section */}
                <div className="text-center max-w-2xl mx-auto">
                  <SimplifiedBranding size="lg" className="justify-center mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Complete AI Chatbot Platform
                  </h2>
                  <p className="text-white/60">
                    Chat with AI, manage teams, analyze data, and build custom integrations
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <QuickActions />
                </div>

                {/* Feature Overview */}
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        AI Chat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/60 text-sm">
                        Advanced AI conversations with memory, file uploads, and voice control
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Collaboration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/60 text-sm">
                        Team workspaces, shared memory, and collaborative AI sessions
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        Development
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/60 text-sm">
                        API access, webhooks, custom integrations, and white-label options
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Start Chat Button */}
                <div className="text-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    onClick={() => {
                      // Switch to chat interface
                      setShowAnalytics(false);
                    }}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start AI Chat
                  </Button>
                </div>
              </div>
            )}

            {/* Chat Interface (when not showing analytics) */}
            {!showAnalytics && user && (
              <div className="absolute inset-0">
                <ChatManager className="h-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
