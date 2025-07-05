
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  MessageSquare, 
  Users, 
  Brain, 
  Search, 
  Monitor, 
  BarChart3, 
  Settings, 
  Code, 
  Palette, 
  User,
  Database,
  Zap,
  X,
  Crown,
  Sparkles,
  Shield,
  Cpu,
  Globe
} from 'lucide-react';

interface FeaturesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeaturesSidebar: React.FC<FeaturesSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const features = [
    {
      category: 'Core Features',
      items: [
        { name: 'AI Chat', path: '/', icon: MessageSquare, description: 'Main chat interface', premium: false },
        { name: 'Memory System', path: '/memory', icon: Brain, description: 'Persistent AI memory', premium: true },
        { name: 'Advanced Features', path: '/advanced', icon: Zap, description: 'All advanced AI features', premium: true },
      ]
    },
    {
      category: 'Collaboration',
      items: [
        { name: 'Team Spaces', path: '/teams', icon: Users, description: 'Collaborative workspaces', premium: true },
        { name: 'Semantic Search', path: '/search', icon: Search, description: 'Smart content search', premium: true },
      ]
    },
    {
      category: 'Analytics & Insights',
      items: [
        { name: 'Analytics', path: '/analytics', icon: BarChart3, description: 'Usage analytics', premium: false },
        { name: 'Performance', path: '/performance', icon: Monitor, description: 'System monitoring', premium: true },
      ]
    },
    {
      category: 'Development',
      items: [
        { name: 'API Hub', path: '/api', icon: Code, description: 'Developer tools & API', premium: true },
        { name: 'White Label', path: '/whitelabel', icon: Palette, description: 'Brand customization', premium: true },
      ]
    },
    {
      category: 'Management',
      items: [
        { name: 'Profile', path: '/profile', icon: User, description: 'User settings', premium: false },
        { name: 'Admin Panel', path: '/admin', icon: Database, description: 'System administration', premium: true },
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto">
        <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={onClose} />
        
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-r border-white/10 lg:relative lg:w-full lg:max-w-none shadow-2xl">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10" />
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-500/20 to-transparent" />
          
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Nexus AI
                </h2>
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-500/30 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden text-white/60 hover:text-white hover:bg-white/10">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4 relative z-10">
            <div className="space-y-6">
              {features.map((category) => (
                <div key={category.category}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                      {category.category}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link key={item.path} to={item.path} onClick={onClose}>
                          <div
                            className={`group relative overflow-hidden rounded-xl p-3 transition-all duration-300 ${
                              isActive 
                                ? 'bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-pink-500/30 border border-purple-400/50 shadow-lg shadow-purple-500/20' 
                                : 'bg-white/5 hover:bg-gradient-to-r hover:from-purple-500/20 hover:via-blue-500/20 hover:to-pink-500/20 border border-white/10 hover:border-purple-400/30'
                            }`}
                          >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            
                            <div className="relative flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                isActive 
                                  ? 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg' 
                                  : 'bg-white/10 group-hover:bg-white/20'
                              } transition-all duration-300`}>
                                <item.icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium truncate ${
                                    isActive ? 'text-white' : 'text-white/90'
                                  }`}>
                                    {item.name}
                                  </span>
                                  {item.premium && (
                                    <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 text-xs border-amber-500/30 px-1.5 py-0.5">
                                      <Crown className="w-2.5 h-2.5 mr-0.5" />
                                      Pro
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-white/60 truncate mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                              {isActive && (
                                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse" />
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="relative z-10 p-4 border-t border-white/10">
            <div className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <Shield className="w-4 h-4 text-blue-400" />
                  <Cpu className="w-4 h-4 text-pink-400" />
                </div>
                <span className="text-sm font-semibold text-white">AI Platform</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Complete AI solution with advanced features, team collaboration, and enterprise-grade security.
              </p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                <Globe className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-300">Online & Ready</span>
                <div className="flex-1" />
                <Badge className="bg-green-500/20 text-green-300 text-xs border-green-500/30">
                  v2.0
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
