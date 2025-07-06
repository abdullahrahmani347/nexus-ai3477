
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { BrandLogo } from '@/components/ui/brand-logo';
import { 
  MessageSquare, 
  Users, 
  Brain, 
  Search, 
  BarChart3, 
  Code, 
  User,
  Database,
  Sparkles,
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
  Mic,
  FileText,
  Share2,
  Bookmark,
  History,
  Menu
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
      label: 'Core Features',
      icon: Zap,
      items: [
        { 
          name: 'AI Chat', 
          path: '/', 
          icon: MessageSquare, 
          description: 'Main chat interface',
          badge: null,
          premium: false 
        },
        { 
          name: 'Search & Discovery', 
          path: '/search', 
          icon: Search, 
          description: 'Smart content search',
          badge: 'New',
          premium: true 
        },
        { 
          name: 'Memory System', 
          path: '/memory', 
          icon: Brain, 
          description: 'Persistent AI memory',
          badge: 'Pro',
          premium: true 
        }
      ]
    },
    {
      id: 'collaboration',
      label: 'Collaboration',
      icon: Users,
      items: [
        { 
          name: 'Team Workspaces', 
          path: '/teams', 
          icon: Users, 
          description: 'Collaborative spaces',
          badge: 'Pro',
          premium: true 
        },
        { 
          name: 'Shared Conversations', 
          path: '/shared', 
          icon: Share2, 
          description: 'Share with your team',
          badge: null,
          premium: true 
        }
      ]
    },
    {
      id: 'insights',
      label: 'Analytics & Insights',
      icon: BarChart3,
      items: [
        { 
          name: 'Analytics', 
          path: '/analytics', 
          icon: BarChart3, 
          description: 'Usage analytics & insights',
          badge: null,
          premium: false 
        },
        { 
          name: 'Bookmarks', 
          path: '/bookmarks', 
          icon: Bookmark, 
          description: 'Saved conversations',
          badge: null,
          premium: false 
        },
        { 
          name: 'Activity History', 
          path: '/history', 
          icon: History, 
          description: 'Complete activity log',
          badge: null,
          premium: true 
        }
      ]
    },
    {
      id: 'developer',
      label: 'Developer Tools',
      icon: Code,
      items: [
        { 
          name: 'API Hub', 
          path: '/api', 
          icon: Code, 
          description: 'Developer tools & API',
          badge: 'Pro',
          premium: true 
        },
        { 
          name: 'Custom Integrations', 
          path: '/integrations', 
          icon: Sparkles, 
          description: 'Third-party integrations',
          badge: 'New',
          premium: true 
        }
      ]
    },
    {
      id: 'management',
      label: 'Account & Settings',
      icon: Settings,
      items: [
        { 
          name: 'Profile Settings', 
          path: '/profile', 
          icon: User, 
          description: 'Account preferences',
          badge: null,
          premium: false 
        },
        { 
          name: 'Admin Panel', 
          path: '/admin', 
          icon: Database, 
          description: 'System administration',
          badge: 'Admin',
          premium: true 
        }
      ]
    }
  ];

  const handleCreateSession = () => {
    const newSessionId = createSession();
    setEditingId(newSessionId);
    setEditTitle('New Chat');
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
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm lg:hidden" onClick={onClose} />
        
        {/* Sidebar Container */}
        <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 lg:relative lg:w-full lg:max-w-none shadow-custom-large">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <BrandLogo size="md" variant="premium" />
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 text-xs font-medium">
                <Crown className="w-3 h-3 mr-1" />
                Pro
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose} 
                className="lg:hidden h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 px-4 py-4 h-[calc(100vh-140px)]">
            <div className="space-y-8">
              
              {/* Quick Actions */}
              <div className="space-y-3">
                <Button 
                  onClick={handleCreateSession}
                  className="w-full btn-primary justify-start gap-3 h-11"
                >
                  <Plus className="w-4 h-4" />
                  New Conversation
                </Button>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 input-field h-10"
                  />
                </div>
              </div>

              {/* Chat Sessions */}
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => toggleGroup('chat-sessions')}
                >
                  <div className="flex items-center gap-2">
                    {expandedGroups.has('chat-sessions') ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                      Recent Chats
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {filteredSessions.length}
                  </Badge>
                </div>
                
                {expandedGroups.has('chat-sessions') && (
                  <div className="space-y-2 ml-2">
                    {filteredSessions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          {searchQuery ? 'No matching conversations' : 'No conversations yet'}
                        </p>
                        <p className="text-xs mt-1">
                          {searchQuery ? 'Try a different search term' : 'Start a new chat to begin'}
                        </p>
                      </div>
                    ) : (
                      filteredSessions.slice(0, 8).map((session) => (
                        <div
                          key={session.id}
                          className={cn(
                            'group p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-small',
                            session.id === currentSessionId
                              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                          )}
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
                                className="text-sm h-8"
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={handleEditSave}
                                  className="h-7 px-3 bg-indigo-500 hover:bg-indigo-600 text-white"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={handleEditCancel}
                                  className="h-7 px-3"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0 space-y-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {session.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span>{session.messages.length} messages</span>
                                  <span>•</span>
                                  <span>{format(new Date(session.updatedAt), 'MMM d, HH:mm')}</span>
                                </div>
                                {session.messages.length > 0 && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    {session.messages[session.messages.length - 1].text.slice(0, 50)}...
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditStart(session.id, session.title);
                                  }}
                                  className="w-6 h-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
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
                                  className="w-6 h-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
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

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              {/* Navigation Groups */}
              {navigationGroups.map((group) => (
                <div key={group.id} className="space-y-3">
                  <div 
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedGroups.has(group.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <group.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                        {group.label}
                      </h3>
                    </div>
                  </div>
                  
                  {expandedGroups.has(group.id) && (
                    <div className="space-y-1 ml-6">
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link key={item.path} to={item.path} onClick={onClose}>
                            <div className={cn(
                              'sidebar-nav-item',
                              isActive && 'active'
                            )}>
                              <item.icon className="sidebar-nav-icon" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium truncate">
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <Badge className={cn(
                                      'text-xs px-1.5 py-0.5',
                                      item.badge === 'Pro' && 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
                                      item.badge === 'New' && 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 dark:text-green-400 border-green-500/20',
                                      item.badge === 'Admin' && 'bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                    )}>
                                      {item.badge === 'Pro' && <Crown className="w-2.5 h-2.5 mr-0.5" />}
                                      {item.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {item.description}
                                </p>
                              </div>
                              {isActive && (
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
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
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="card-elevated p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-1">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <Shield className="w-4 h-4 text-purple-500" />
                  <Zap className="w-4 h-4 text-pink-500" />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  ChatHub Pro
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Advanced AI platform with intelligent conversations, team collaboration, and enterprise features.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Online & Ready
                  </span>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs border-green-200 dark:border-green-800">
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
