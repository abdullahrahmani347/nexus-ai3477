
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { NexusLogo, NexusStatusIndicator } from '@/components/ui/nexus-logo';
import { 
  MessageSquare, 
  Users, 
  Brain, 
  Search, 
  BarChart3, 
  Code, 
  User,
  Database,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Crown,
  Shield,
  Zap,
  Globe,
  ChevronDown,
  ChevronRight,
  FileText,
  Share2,
  Bookmark,
  History,
  Palette,
  Home,
  Layers,
  Cpu,
  Lock,
  Activity
} from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatHubSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatHubSidebar: React.FC<ChatHubSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['core', 'chat-sessions']));
  
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    deleteSession, 
    switchSession,
    updateSessionTitle 
  } = useChatStore();

  const navigationGroups = [
    {
      id: 'core',
      label: 'Core Platform',
      icon: Layers,
      items: [
        { 
          name: 'AI Chat Hub', 
          path: '/', 
          icon: MessageSquare, 
          description: 'Main AI conversation interface',
          badge: null,
          premium: false 
        },
        { 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: Home, 
          description: 'Overview and quick actions',
          badge: null,
          premium: false 
        }
      ]
    },
    {
      id: 'intelligence',
      label: 'AI Intelligence',
      icon: Brain,
      items: [
        { 
          name: 'Semantic Search', 
          path: '/search', 
          icon: Search, 
          description: 'Advanced AI-powered search',
          badge: 'Enhanced',
          premium: true 
        },
        { 
          name: 'Memory System', 
          path: '/memory', 
          icon: Brain, 
          description: 'Persistent AI memory & learning',
          badge: 'Pro',
          premium: true 
        },
        { 
          name: 'Advanced Features', 
          path: '/advanced', 
          icon: Cpu, 
          description: 'Cutting-edge AI capabilities',
          badge: 'Beta',
          premium: true 
        }
      ]
    },
    {
      id: 'collaboration',
      label: 'Team & Collaboration',
      icon: Users,
      items: [
        { 
          name: 'Team Workspaces', 
          path: '/teams', 
          icon: Users, 
          description: 'Collaborative AI workspaces',
          badge: 'Pro',
          premium: true 
        },
        { 
          name: 'Analytics Hub', 
          path: '/analytics', 
          icon: BarChart3, 
          description: 'Usage insights & performance',
          badge: null,
          premium: false 
        }
      ]
    },
    {
      id: 'developer',
      label: 'Developer Tools',
      icon: Code,
      items: [
        { 
          name: 'API Center', 
          path: '/api', 
          icon: Code, 
          description: 'Developer APIs & integrations',
          badge: 'Pro',
          premium: true 
        },
        { 
          name: 'Features Gallery', 
          path: '/features', 
          icon: Palette, 
          description: 'Explore all platform features',
          badge: null,
          premium: false 
        }
      ]
    },
    {
      id: 'management',
      label: 'Account & Settings',
      icon: Settings,
      items: [
        { 
          name: 'Profile Center', 
          path: '/profile', 
          icon: User, 
          description: 'Personal settings & preferences',
          badge: null,
          premium: false 
        },
        { 
          name: 'Admin Dashboard', 
          path: '/admin', 
          icon: Database, 
          description: 'System administration panel',
          badge: 'Admin',
          premium: true 
        },
        { 
          name: 'White Label', 
          path: '/white-label', 
          icon: Shield, 
          description: 'Custom branding & themes',
          badge: 'Enterprise',
          premium: true 
        }
      ]
    }
  ];

  const handleCreateSession = () => {
    const newSessionId = createSession();
    setEditingId(newSessionId);
    setEditTitle('New AI Chat');
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

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const filteredSessions = sessions
    .filter(session => 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.messages.some(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto">
        <div 
          className="absolute inset-0 bg-black/20 nexus-blur lg:hidden" 
          onClick={onClose} 
        />
        
        {/* Sidebar Container */}
        <div className="nexus-sidebar fixed left-0 top-0 h-full w-80 max-w-[85vw] lg:relative lg:w-full lg:max-w-none">
          
          {/* Header */}
          <div className="nexus-sidebar-header">
            <div className="flex items-center justify-between">
              <NexusLogo size="md" />
              <div className="flex items-center nexus-space-sm">
                <NexusStatusIndicator status="online" size="sm" />
                <Badge className="nexus-badge-info">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose} 
                  className="lg:hidden nexus-btn-tertiary h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 px-4 py-4 h-[calc(100vh-140px)]">
            <div className="nexus-stack-lg">
              
              {/* Quick Actions */}
              <div className="nexus-stack-sm">
                <Button 
                  onClick={handleCreateSession}
                  className="w-full nexus-btn-primary justify-start nexus-space-sm h-11"
                >
                  <Plus className="w-4 h-4" />
                  New AI Conversation
                </Button>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 nexus-input"
                  />
                </div>
              </div>

              {/* Chat Sessions */}
              <div className="nexus-sidebar-group">
                <div 
                  className="flex items-center justify-between cursor-pointer group mb-3"
                  onClick={() => toggleGroup('chat-sessions')}
                >
                  <div className="flex items-center nexus-space-sm">
                    {expandedGroups.has('chat-sessions') ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                    <h3 className="nexus-sidebar-group-label">
                      Recent Conversations
                    </h3>
                  </div>
                  <Badge variant="outline" className="nexus-badge-neutral">
                    {filteredSessions.length}
                  </Badge>
                </div>
                
                {expandedGroups.has('chat-sessions') && (
                  <div className="nexus-stack-sm ml-2">
                    {filteredSessions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="nexus-small">
                          {searchQuery ? 'No matching conversations' : 'No conversations yet'}
                        </p>
                        <p className="nexus-caption mt-1">
                          {searchQuery ? 'Try a different search term' : 'Start a new chat to begin'}
                        </p>
                      </div>
                    ) : (
                      filteredSessions.slice(0, 8).map((session) => (
                        <div
                          key={session.id}
                          className={cn(
                            'nexus-card group p-4 cursor-pointer transition-all duration-200',
                            session.id === currentSessionId && 'nexus-card-prominent'
                          )}
                          onClick={() => !editingId && switchSession(session.id)}
                        >
                          {editingId === session.id ? (
                            <div className="nexus-stack-sm">
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleEditSave();
                                  if (e.key === 'Escape') handleEditCancel();
                                }}
                                className="nexus-input h-8"
                                autoFocus
                              />
                              <div className="flex nexus-space-sm">
                                <Button 
                                  size="sm" 
                                  onClick={handleEditSave}
                                  className="nexus-btn-primary h-7 px-3"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={handleEditCancel}
                                  className="nexus-btn-secondary h-7 px-3"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0 nexus-stack-sm">
                                <h4 className="nexus-body font-medium text-foreground truncate">
                                  {session.title}
                                </h4>
                                <div className="flex items-center nexus-space-sm nexus-caption">
                                  <span>{session.messages.length} messages</span>
                                  <span>•</span>
                                  <span>{format(new Date(session.updatedAt), 'MMM d, HH:mm')}</span>
                                </div>
                                {session.messages.length > 0 && (
                                  <p className="nexus-caption truncate">
                                    {session.messages[session.messages.length - 1].text.slice(0, 50)}...
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex nexus-space-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditStart(session.id, session.title);
                                  }}
                                  className="nexus-btn-tertiary w-6 h-6 p-0"
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
                                  className="nexus-btn-tertiary w-6 h-6 p-0 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
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
                )}
              </div>

              <Separator className="bg-border" />

              {/* Navigation Groups */}
              {navigationGroups.map((group) => (
                <div key={group.id} className="nexus-sidebar-group">
                  <div 
                    className="flex items-center justify-between cursor-pointer group mb-3"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <div className="flex items-center nexus-space-sm">
                      {expandedGroups.has(group.id) ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <group.icon className="w-4 h-4 text-primary" />
                      <h3 className="nexus-sidebar-group-label">
                        {group.label}
                      </h3>
                    </div>
                  </div>
                  
                  {expandedGroups.has(group.id) && (
                    <div className="nexus-stack-sm ml-6">
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link key={item.path} to={item.path} onClick={onClose}>
                            <div className={cn(
                              'nexus-nav-item',
                              isActive && 'active'
                            )}>
                              <item.icon className="nexus-nav-icon" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center nexus-space-sm">
                                  <span className="font-medium truncate">
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <Badge className={cn(
                                      'px-1.5 py-0.5',
                                      item.badge === 'Pro' && 'nexus-badge-info',
                                      item.badge === 'Enhanced' && 'nexus-badge-success',
                                      item.badge === 'Beta' && 'nexus-badge-warning',
                                      item.badge === 'Admin' && 'nexus-badge-error',
                                      item.badge === 'Enterprise' && 'nexus-badge-neutral'
                                    )}>
                                      {item.badge === 'Pro' && <Crown className="w-2.5 h-2.5 mr-0.5" />}
                                      {item.badge === 'Enhanced' && <Zap className="w-2.5 h-2.5 mr-0.5" />}
                                      {item.badge === 'Enterprise' && <Shield className="w-2.5 h-2.5 mr-0.5" />}
                                      {item.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="nexus-caption truncate">
                                  {item.description}
                                </p>
                              </div>
                              {isActive && (
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="nexus-card p-4 nexus-gradient-bg text-white">
              <div className="flex items-center nexus-space-sm mb-2">
                <div className="flex nexus-space-sm">
                  <Zap className="w-4 h-4" />
                  <Shield className="w-4 h-4" />
                  <Activity className="w-4 h-4" />
                </div>
                <span className="nexus-small font-semibold">
                  Nexus AI Platform
                </span>
              </div>
              <p className="nexus-caption opacity-90 leading-relaxed mb-3">
                Where Intelligence Connects - Advanced AI platform with enterprise-grade capabilities.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center nexus-space-sm">
                  <Globe className="w-3 h-3 text-green-400" />
                  <span className="nexus-caption text-green-300 font-medium">
                    System Online
                  </span>
                </div>
                <Badge className="bg-white/20 text-white nexus-caption border-white/30">
                  v2.1.0
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
