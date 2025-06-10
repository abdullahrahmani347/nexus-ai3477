
import React from 'react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { Sparkles, Crown, Zap, BarChart3, TrendingUp, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SessionSidebar from '@/components/SessionSidebar';
import { UserMenu } from '@/components/navigation/UserMenu';
import { useState } from 'react';

const AnalyticsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const analyticsFeatures = [
    {
      title: "Usage Patterns",
      description: "Track your AI interaction patterns and discover peak productivity hours",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Performance Metrics",
      description: "Monitor response times, token usage, and system efficiency",
      icon: BarChart3,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Goal Tracking",
      description: "Set and monitor your productivity goals and achievements",
      icon: Target,
      color: "from-green-500 to-emerald-500"
    }
  ];

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
          {/* Header */}
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
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                      Nexus AI Analytics
                    </h1>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                      <span className="text-xs text-white/60">Performance Insights</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white/80">AI Powered</span>
                </div>
                <UserMenu />
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Welcome Section */}
            <Card className="nexus-card p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
                  <p className="text-white/60 max-w-2xl mx-auto">
                    Gain deep insights into your AI usage patterns, productivity metrics, and performance trends. 
                    Optimize your workflow with data-driven intelligence.
                  </p>
                </div>
              </div>
            </Card>

            {/* Analytics Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analyticsFeatures.map((feature, index) => (
                <Card key={index} className="nexus-card p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">{feature.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                      Live Data
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* Key Insights */}
            <Card className="nexus-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Understanding Your Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">📊 Usage Metrics</h4>
                    <p className="text-white/60 text-sm">Track total messages, sessions, and token consumption to understand your AI interaction volume.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">⏱️ Performance Data</h4>
                    <p className="text-white/60 text-sm">Monitor response times and system efficiency to optimize your workflow.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">🎯 Productivity Insights</h4>
                    <p className="text-white/60 text-sm">Discover your most productive hours and peak usage patterns.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">🏆 Achievement Tracking</h4>
                    <p className="text-white/60 text-sm">Set goals and track your progress with detailed achievement metrics.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Analytics Dashboard */}
            <AnalyticsDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
