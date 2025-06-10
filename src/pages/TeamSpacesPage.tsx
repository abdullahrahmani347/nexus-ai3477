
import React, { useState } from 'react';
import { TeamWorkspace } from '@/components/advanced/TeamWorkspace';
import { Sparkles, Crown, Zap, Users, MessageSquare, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SessionSidebar from '@/components/SessionSidebar';
import { UserMenu } from '@/components/navigation/UserMenu';

const TeamSpacesPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const teamFeatures = [
    {
      title: "Collaborative Workspaces",
      description: "Create shared spaces where team members can collaborate on AI projects",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Shared Conversations",
      description: "Share AI conversations and insights across your team in real-time",
      icon: MessageSquare,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Role Management",
      description: "Manage team permissions with granular role-based access control",
      icon: Shield,
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
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                      Nexus AI Teams
                    </h1>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                      <span className="text-xs text-white/60">Collaboration Hub</span>
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
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome to Team Collaboration</h2>
                  <p className="text-white/60 max-w-2xl mx-auto">
                    Create collaborative workspaces where your team can share AI conversations, insights, and knowledge. 
                    Build smarter together with Nexus AI's powerful team features.
                  </p>
                </div>
              </div>
            </Card>

            {/* Team Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamFeatures.map((feature, index) => (
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
                      Enterprise Ready
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* Getting Started Guide */}
            <Card className="nexus-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Getting Started with Team Workspaces</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <div>
                      <h4 className="font-medium text-white">Create a Workspace</h4>
                      <p className="text-white/60 text-sm">Start by creating a new team workspace with a descriptive name and purpose.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <div>
                      <h4 className="font-medium text-white">Invite Team Members</h4>
                      <p className="text-white/60 text-sm">Send invitations to colleagues and assign appropriate roles and permissions.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <div>
                      <h4 className="font-medium text-white">Share Conversations</h4>
                      <p className="text-white/60 text-sm">Share AI conversations and insights with your team for collaborative analysis.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                    <div>
                      <h4 className="font-medium text-white">Collaborate & Grow</h4>
                      <p className="text-white/60 text-sm">Work together to build knowledge and achieve better results with AI.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Team Workspace Interface */}
            <TeamWorkspace />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSpacesPage;
