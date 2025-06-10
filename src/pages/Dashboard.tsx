
import { useState } from "react";
import { MessageSquare, Users, Code, Star, Zap, BarChart3, Brain, Sparkles, Crown, ArrowRight, TrendingUp, Shield, Rocket } from "lucide-react";
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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Initializing Nexus AI...</p>
        </div>
      </div>
    );
  }

  const platformStats = [
    { label: "AI Models", value: "6+", icon: Brain, color: "from-purple-500 to-blue-500" },
    { label: "Features", value: "24+", icon: Sparkles, color: "from-blue-500 to-cyan-500" },
    { label: "Uptime", value: "99.9%", icon: Shield, color: "from-green-500 to-emerald-500" },
    { label: "Response Time", value: "<2s", icon: Zap, color: "from-orange-500 to-red-500" }
  ];

  const featuredCapabilities = [
    {
      title: "Advanced AI Chat",
      description: "State-of-the-art conversational AI with streaming responses, voice control, and persistent memory across sessions",
      icon: MessageSquare,
      color: "from-purple-500 to-blue-500",
      features: ["Multi-model support", "Voice enabled", "Memory retention", "Real-time streaming"]
    },
    {
      title: "Team Collaboration",
      description: "Enterprise-grade collaborative workspaces with shared memory, real-time sync, and advanced permission controls",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      features: ["Shared workspaces", "Real-time collaboration", "Role management", "Team analytics"]
    },
    {
      title: "Developer Platform",
      description: "Comprehensive API suite with webhooks, plugins, white-label customization, and advanced monitoring tools",
      icon: Code,
      color: "from-orange-500 to-red-500",
      features: ["REST API", "Webhooks", "White-label", "Custom plugins"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-500" />
      
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
          {/* Enhanced Header */}
          <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 lg:px-6 py-4 relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 lg:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  ☰
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                      Nexus AI
                    </h1>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Enterprise
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeatures(!showFeatures)}
                  className="text-white/70 hover:text-white hover:bg-white/10 hidden sm:flex transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Features
                </Button>
              </div>
              
              <div className="flex items-center gap-2 lg:gap-3">
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="text-white/70 hover:text-white hover:bg-white/10 hidden sm:flex transition-all duration-200"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {showAnalytics ? 'Dashboard' : 'Analytics'}
                  </Button>
                )}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white/80 font-medium">AI Powered</span>
                </div>
                <UserMenu />
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {showAnalytics && user ? (
              <UserAnalytics className="h-full" />
            ) : (
              <div className="p-4 lg:p-6 space-y-8 lg:space-y-10 overflow-y-auto h-full nexus-scrollbar">
                {/* Enhanced Hero Section */}
                <div className="text-center max-w-5xl mx-auto">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-purple-500/25 animate-glow-pulse">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                        Nexus AI Platform
                      </h1>
                      <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-500/30">
                        <Rocket className="w-3 h-3 mr-1" />
                        v2.0
                      </Badge>
                    </div>
                    <p className="text-xl lg:text-2xl text-white/80 mb-4 font-medium">
                      The Ultimate AI Collaboration Platform
                    </p>
                    <p className="text-lg text-white/60 max-w-3xl mx-auto">
                      Experience next-generation AI with advanced chat capabilities, team collaboration tools, 
                      comprehensive analytics, and enterprise-grade customization options.
                    </p>
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Link to="/chat">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 text-lg px-8 py-3"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Start AI Chat
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/features">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-3 transition-all duration-300 hover:scale-105"
                      >
                        <Star className="w-5 h-5 mr-2" />
                        Explore Features
                      </Button>
                    </Link>
                  </div>

                  {/* Platform Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {platformStats.map((stat, index) => (
                      <Card key={index} className="nexus-card p-4 hover:bg-white/10 transition-all duration-200 group">
                        <div className="text-center">
                          <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                          <div className="text-sm text-white/60">{stat.label}</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-2">Quick Actions</h2>
                      <p className="text-white/60">Get started with these popular features</p>
                    </div>
                    <Link to="/features">
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                        View All Features
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <QuickActions />
                </div>

                {/* Featured Capabilities */}
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4">Platform Capabilities</h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                      Discover the powerful features that make Nexus AI the ultimate platform for AI-powered collaboration
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {featuredCapabilities.map((capability, index) => (
                      <Card key={index} className="nexus-card p-6 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${capability.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                              <capability.icon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-xl">{capability.title}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-white/70 leading-relaxed">
                            {capability.description}
                          </p>
                          <div className="space-y-2">
                            {capability.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                <span className="text-sm text-white/60">{feature}</span>
                              </div>
                            ))}
                          </div>
                          <Badge variant="outline" className="border-white/20 text-white/60 text-xs mt-4">
                            Enterprise Ready
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Recent Updates */}
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-6">What's New</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="nexus-card p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold text-white text-lg">Enhanced Performance</span>
                            <Badge className="bg-green-500/20 text-green-300 text-xs ml-2">New</Badge>
                          </div>
                        </div>
                        <p className="text-white/70 mb-3">Improved response times and reduced latency across all AI models with new optimization algorithms</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400 font-medium">40% faster responses</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="nexus-card p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold text-white text-lg">Advanced Analytics</span>
                            <Badge className="bg-blue-500/20 text-blue-300 text-xs ml-2">Updated</Badge>
                          </div>
                        </div>
                        <p className="text-white/70 mb-3">New conversation insights and usage tracking capabilities with real-time performance metrics</p>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-blue-400 font-medium">Real-time insights</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* CTA Section */}
                {!user && (
                  <div className="max-w-4xl mx-auto text-center">
                    <Card className="nexus-card p-8 lg:p-10 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                      <CardContent className="p-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">Ready to Transform Your Workflow?</h3>
                        <p className="text-white/70 mb-8 text-lg max-w-2xl mx-auto">
                          Join thousands of teams already using Nexus AI to revolutionize their productivity with cutting-edge AI technology
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25 text-lg px-8 py-3">
                            <Crown className="w-5 h-5 mr-2" />
                            Get Started Free
                          </Button>
                          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3">
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Schedule Demo
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
