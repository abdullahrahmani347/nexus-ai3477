
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
  Upload, 
  Search, 
  Monitor, 
  BarChart3, 
  Settings, 
  Code, 
  Palette, 
  User,
  Database,
  Zap,
  X
} from 'lucide-react';

interface FeaturesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeaturesSidebar: React.FC<FeaturesSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const features = [
    {
      category: 'Chat & AI',
      items: [
        { name: 'AI Chat', path: '/', icon: MessageSquare, description: 'Main chat interface' },
        { name: 'Memory', path: '/memory', icon: Brain, description: 'Persistent AI memory' },
        { name: 'Advanced Features', path: '/advanced', icon: Zap, description: 'All advanced AI features' },
      ]
    },
    {
      category: 'Team & Collaboration',
      items: [
        { name: 'Team Spaces', path: '/teams', icon: Users, description: 'Collaborative workspaces' },
        { name: 'Semantic Search', path: '/search', icon: Search, description: 'Smart content search' },
      ]
    },
    {
      category: 'Analytics & Monitoring',
      items: [
        { name: 'Analytics', path: '/analytics', icon: BarChart3, description: 'Usage analytics' },
        { name: 'Performance', path: '/advanced', icon: Monitor, description: 'System monitoring' },
      ]
    },
    {
      category: 'Development',
      items: [
        { name: 'API & Development', path: '/api', icon: Code, description: 'Developer tools' },
        { name: 'White Label', path: '/whitelabel', icon: Palette, description: 'Customization' },
      ]
    },
    {
      category: 'Account',
      items: [
        { name: 'Profile', path: '/profile', icon: User, description: 'User settings' },
        { name: 'Admin', path: '/admin', icon: Database, description: 'System admin' },
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 lg:relative lg:w-full">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Features & Tools</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {features.map((category) => (
              <div key={category.category}>
                <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wide">
                  {category.category}
                </h3>
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link key={item.path} to={item.path} onClick={onClose}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start gap-3 h-auto p-3 ${
                            isActive 
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <div className="text-left">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs opacity-70">{item.description}</div>
                          </div>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/10">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">Nexus AI Platform</span>
            </div>
            <p className="text-xs text-white/60">
              Complete AI chatbot solution with advanced features
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
