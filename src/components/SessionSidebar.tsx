
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, MessageSquare, BarChart3, Users, Code, Search, Brain, Settings, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useChatStore } from '../store/chatStore';
import { format } from 'date-fns';
import { Link, useLocation } from 'react-router-dom';

interface SessionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { name: 'Chat', path: '/', icon: MessageSquare },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Team Spaces', path: '/teams', icon: Users },
  { name: 'Developer API', path: '/api', icon: Code },
  { name: 'Semantic Search', path: '/search', icon: Search },
  { name: 'Memory', path: '/memory', icon: Brain },
  { name: 'Admin', path: '/admin', icon: Settings },
];

const SessionSidebar: React.FC<SessionSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    deleteSession, 
    switchSession,
    updateSessionTitle 
  } = useChatStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

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

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col h-full relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10" />
      
      {/* Header */}
      <div className="relative z-10 p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                Nexus AI
              </h2>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <Separator className="my-4 bg-white/10" />

        {/* Chat Sessions Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/80">Chat Sessions</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateSession}
            className="h-8 w-8 p-0 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 relative z-10 p-2 custom-scrollbar">
        <div className="space-y-1">
          {sortedSessions.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chat sessions yet</p>
              <p className="text-xs">Create your first chat to get started</p>
            </div>
          ) : (
            sortedSessions.map((session) => (
              <div
                key={session.id}
                className={`group p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  session.id === currentSessionId
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30'
                    : 'hover:bg-white/5 border-transparent hover:border-white/20'
                }`}
                onClick={() => !editingId && switchSession(session.id)}
              >
                {editingId === session.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave();
                        if (e.key === 'Escape') handleEditCancel();
                      }}
                      className="text-sm bg-white/5 border-white/20 text-white"
                      autoFocus
                    />
                    <div className="flex space-x-1">
                      <Button size="sm" onClick={handleEditSave} className="nexus-button h-7">
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel} className="h-7 border-white/20 text-white hover:bg-white/10">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">
                          {session.title}
                        </h3>
                        <p className="text-xs text-white/50 mt-1">
                          {session.messages.length} messages
                        </p>
                        <p className="text-xs text-white/40">
                          {format(new Date(session.updatedAt), 'MMM d, HH:mm')}
                        </p>
                      </div>
                      
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStart(session.id, session.title);
                          }}
                          className="w-6 h-6 p-0 text-white/60 hover:text-white hover:bg-white/20"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this chat session?')) {
                              deleteSession(session.id);
                            }
                          }}
                          className="w-6 h-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SessionSidebar;
