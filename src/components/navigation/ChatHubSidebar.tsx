
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NexusBranding, NexusStatusBadge } from '@/components/ui/nexus-branding';
import { NexusLogo } from '@/components/ui/nexus-logo';
import { 
  MessageSquare, 
  Users, 
  Brain, 
  Search, 
  Monitor, 
  BarChart3, 
  Code, 
  User,
  Database,
  Zap,
  X,
  Crown,
  Sparkles,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Check
} from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface ChatHubSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatHubSidebar: React.FC<ChatHubSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    deleteSession, 
    switchSession,
    updateSessionTitle 
  } = useChatStore();

  const features = [
    {
      category: 'Core AI Features',
      items: [
        { name: 'AI Conversations', path: '/', icon: MessageSquare, description: 'Main chat interface', premium: false },
        { name: 'Memory System', path: '/memory', icon: Brain, description: 'Persistent AI memory', premium: true },
        { name: 'Advanced AI', path: '/advanced', icon: Zap, description: 'Premium AI capabilities', premium: true },
      ]
    },
    {
      category: 'Collaboration',
      items: [
        { name: 'Team Workspaces', path: '/teams', icon: Users, description: 'Collaborative AI spaces', premium: true },
        { name: 'Smart Search', path: '/search', icon: Search, description: 'Semantic content search', premium: true },
      ]
    },
    {
      category: 'Analytics & Insights',
      items: [
        { name: 'Analytics Hub', path: '/analytics', icon: BarChart3, description: 'Usage insights', premium: false },
        { name: 'Performance', path: '/performance', icon: Monitor, description: 'System monitoring', premium: true },
      ]
    },
    {
      category: 'Developer Tools',
      items: [
        { name: 'API Gateway', path: '/api', icon: Code, description: 'Developer tools & API', premium: true },
        { name: 'White Label', path: '/whitelabel', icon: Sparkles, description: 'Brand customization', premium: true },
      ]
    },
    {
      category: 'Administration',
      items: [
        { name: 'User Profile', path: '/profile', icon: User, description: 'Account settings', premium: false },
        { name: 'Admin Console', path: '/admin', icon: Database, description: 'System administration', premium: true },
      ]
    }
  ];

  const handleCreateSession = () => {
    const newSessionId = createSession();
    setEditingId(newSessionId);
    setEditTitle('New Conversation');
  };

  const handleEditStart = (sessionId: string, currentTitle: string) => {
    setEditingId(sessionId);
    setEditTitle(currentTitle);
  };

  const handleEditSave = () => {
    if (editingId && editTitle.trim()) {
      updateSessionTitle(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto">
        <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={onClose} />
        
        {/* Enhanced Nexus Sidebar */}
        <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900 backdrop-blur-xl border-r border-white/10 lg:relative lg:w-full lg:max-w-none shadow-2xl">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10" />
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-500/20 via-purple-500/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-500/20 to-transparent" />
          
          {/* Header with Enhanced Branding */}
          <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
            <NexusLogo size="md" />
            <div className="flex items-center gap-2">
              <NexusStatusBadge variant="premium" />
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden text-white/60 hover:text-white hover:bg-white/10">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4 relative z-10 h-[calc(100vh-200px)]">
            <div className="space-y-8">
              {/* Enhanced Chat Sessions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    AI Conversations
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCreateSession}
                    className="h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-xl"
                    title="New Conversation"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3 mb-8">
                  {sortedSessions.length === 0 ? (
                    <div className="nexus-card text-center py-6">
                      <MessageSquare className="w-8 h-8 mx-auto mb-3 text-white/30" />
                      <p className="text-sm text-white/60">Start your first AI conversation</p>
                      <Button 
                        onClick={handleCreateSession}
                        className="mt-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Chat
                      </Button>
                    </div>
                  ) : (
                    sortedSessions.slice(0, 8).map((session) => (
                      <div
                        key={session.id}
                        className={`group nexus-card p-4 cursor-pointer nexus-transition ${
                          session.id === currentSessionId
                            ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 border-blue-400/40 nexus-glow'
                            : 'hover:bg-white/10 border-white/20 hover:border-white/30'
                        }`}
                        onClick={() => !editingId && switchSession(session.id)}
                      >
                        {editingId === session.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEditSave();
                                if (e.key === 'Escape') handleEditCancel();
                              }}
                              className="text-sm bg-white/10 border-white/30 text-white placeholder-white/50"
                              autoFocus
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleEditSave} className="h-7 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleEditCancel} className="h-7 border-white/30 text-white hover:bg-white/10">
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-white truncate mb-1">
                                {session.title}
                              </h4>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-white/10 text-white/70 text-xs border-white/20">
                                  {session.messages.length} msgs
                                </Badge>
                                <span className="text-xs text-white/50">
                                  {format(new Date(session.updatedAt), 'MMM d, HH:mm')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 nexus-transition ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStart(session.id, session.title);
                                }}
                                className="w-6 h-6 p-0 text-white/60 hover:text-white hover:bg-white/20 rounded-lg"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Delete this conversation?')) {
                                    deleteSession(session.id);
                                  }
                                }}
                                className="w-6 h-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                
                <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              {/* Enhanced Feature Categories */}
              {features.map((category) => (
                <div key={category.category}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider">
                      {category.category}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link key={item.path} to={item.path} onClick={onClose}>
                          <div
                            className={`group nexus-card p-4 nexus-transition ${
                              isActive 
                                ? 'bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 border-blue-400/50 nexus-glow' 
                                : 'hover:bg-white/10 border-white/10 hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-xl nexus-transition ${
                                isActive 
                                  ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 shadow-lg' 
                                  : 'bg-white/10 group-hover:bg-white/20'
                              }`}>
                                <item.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`font-semibold truncate ${
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
                                <p className="text-xs text-white/60 truncate">
                                  {item.description}
                                </p>
                              </div>
                              {isActive && (
                                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse" />
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

          {/* Enhanced Footer */}
          <div className="relative z-10 p-4 border-t border-white/10">
            <div className="nexus-card p-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 border-blue-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <Shield className="w-4 h-4 text-blue-400" />
                  <Brain className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm font-bold text-white">Nexus AI Platform</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed mb-3">
                Advanced artificial intelligence with enterprise-grade security and unlimited possibilities.
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/20">
                <div className="flex-1">
                  <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 text-xs border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                    Online & Ready
                  </Badge>
                </div>
                <Badge className="bg-white/10 text-white/70 text-xs border-white/20">
                  v2.1
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
