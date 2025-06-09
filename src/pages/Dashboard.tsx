
import { useState } from "react";
import { MessageSquare, Users, Code, Star, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatManager } from "@/components/ChatManager";
import SessionSidebar from "@/components/SessionSidebar";
import { UserMenu } from "@/components/navigation/UserMenu";
import { UserAnalytics } from "@/components/UserAnalytics";
import { FeaturesSidebar } from "@/components/navigation/FeaturesSidebar";
import { SimplifiedBranding } from "@/components/ui/simplified-branding";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useDatabase } from "@/hooks/useDatabase";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  useDatabase();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
          {/* Header */}
          <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 lg:px-6 py-4 relative flex-shrink-0">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 lg:gap-4">
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
                  className="text-white/70 hover:text-white hover:bg-white/10 hidden sm:flex"
                >
                  Features
                </Button>
              </div>
              
              <div className="flex items-center gap-2 lg:gap-3">
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="text-white/70 hover:text-white hover:bg-white/10 hidden sm:flex"
                  >
                    {showAnalytics ? 'Dashboard' : 'Analytics'}
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
              <div className="p-4 lg:p-6 space-y-6 lg:space-y-8 overflow-y-auto h-full">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto">
                  <SimplifiedBranding size="lg" className="justify-center mb-4" />
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    Complete AI Chatbot Platform
                  </h1>
                  <p className="text-lg lg:text-xl text-white/60 mb-8">
                    Chat with AI, manage teams, analyze data, and build custom integrations
                  </p>
                  
                  {/* Main Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Link to="/chat">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Start AI Chat
                      </Button>
                    </Link>
                    <Link to="/features">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
                      >
                        <Star className="w-5 h-5 mr-2" />
                        Explore Features
                      </Button>
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">24+</div>
                      <div className="text-sm text-white/60">Features</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-green-400">100%</div>
                      <div className="text-sm text-white/60">Mobile Ready</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-blue-400">6</div>
                      <div className="text-sm text-white/60">AI Models</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-purple-400">∞</div>
                      <div className="text-sm text-white/60">Conversations</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl lg:text-2xl font-semibold text-white">Quick Actions</h2>
                    <Link to="/features">
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                        View All Features →
                      </Button>
                    </Link>
                  </div>
                  <QuickActions />
                </div>

                {/* Feature Highlights */}
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6">Platform Highlights</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                          </div>
                          Advanced AI Chat
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-white/60 text-sm">
                          State-of-the-art conversational AI with streaming responses, voice control, and persistent memory
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-purple-500/20 text-purple-300 text-xs">Multi-model</Badge>
                          <Badge className="bg-blue-500/20 text-blue-300 text-xs">Voice enabled</Badge>
                          <Badge className="bg-green-500/20 text-green-300 text-xs">Memory</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          Team Collaboration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-white/60 text-sm">
                          Collaborative workspaces, shared memory, and team analytics for enhanced productivity
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-500/20 text-blue-300 text-xs">Workspaces</Badge>
                          <Badge className="bg-cyan-500/20 text-cyan-300 text-xs">Real-time</Badge>
                          <Badge className="bg-teal-500/20 text-teal-300 text-xs">Sharing</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <Code className="w-5 h-5 text-white" />
                          </div>
                          Developer Tools
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-white/60 text-sm">
                          Comprehensive API, webhooks, plugins, and white-label customization options
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-orange-500/20 text-orange-300 text-xs">REST API</Badge>
                          <Badge className="bg-red-500/20 text-red-300 text-xs">Webhooks</Badge>
                          <Badge className="bg-pink-500/20 text-pink-300 text-xs">White-label</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Recent Updates */}
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6">Recent Updates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Zap className="w-5 h-5 text-purple-400" />
                          <span className="font-semibold text-white">Enhanced Performance</span>
                          <Badge className="bg-green-500/20 text-green-300 text-xs">New</Badge>
                        </div>
                        <p className="text-white/60 text-sm">Improved response times and reduced latency across all AI models</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <BarChart3 className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-white">Advanced Analytics</span>
                          <Badge className="bg-blue-500/20 text-blue-300 text-xs">Updated</Badge>
                        </div>
                        <p className="text-white/60 text-sm">New conversation insights and usage tracking capabilities</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Getting Started */}
                {!user && (
                  <div className="max-w-4xl mx-auto text-center">
                    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                      <CardContent className="p-6 lg:p-8">
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
                        <p className="text-white/60 mb-6">
                          Sign up now to access all features and start building with our AI platform
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500">
                            Create Account
                          </Button>
                          <Button size="lg" variant="outline" className="border-white/20 text-white">
                            Learn More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
