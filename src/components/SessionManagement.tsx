
import React from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/store/chatStore';
import { useDatabase } from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface SessionManagementProps {
  onSessionSelect?: (sessionId: string) => void;
}

export const SessionManagement: React.FC<SessionManagementProps> = ({
  onSessionSelect
}) => {
  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const { user } = useAuth();
  const { deleteSessionFromDb } = useDatabase();

  const {
    sessions,
    currentSessionId,
    createSession,
    deleteSession,
    switchSession,
    updateSessionTitle
  } = useChatStore();

  const handleNewSession = () => {
    const newSessionId = createSession();
    onSessionSelect?.(newSessionId);
  };

  const handleSessionClick = (sessionId: string) => {
    switchSession(sessionId);
    onSessionSelect?.(sessionId);
  };

  const handleEditStart = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditTitle(currentTitle);
  };

  const handleEditSave = () => {
    if (editingSessionId && editTitle.trim()) {
      updateSessionTitle(editingSessionId, editTitle.trim());
    }
    setEditingSessionId(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingSessionId(null);
    setEditTitle('');
  };

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this session?')) {
      // Delete from database if user is authenticated
      if (user) {
        await deleteSessionFromDb(sessionId);
      }
      // Delete from local store
      deleteSession(sessionId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <Button
          onClick={handleNewSession}
          className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white nexus-transition"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.length === 0 && (
            <div className="text-center py-8 text-white/60">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chat sessions yet</p>
              <p className="text-xs">Start a new conversation!</p>
            </div>
          )}
          
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`
                group relative p-3 rounded-lg cursor-pointer transition-all duration-200
                ${session.id === currentSessionId 
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 shadow-lg' 
                  : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                }
              `}
              onClick={() => handleSessionClick(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {editingSessionId === session.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-6 text-sm bg-black/20 border-white/20 text-white"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleEditSave();
                          if (e.key === 'Escape') handleEditCancel();
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditSave}
                        className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditCancel}
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-sm truncate text-white">
                        {session.title}
                      </h3>
                      <p className="text-xs text-white/60 mt-1">
                        {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <MessageSquare className="h-3 w-3 text-white/40" />
                        <span className="text-xs text-white/60">
                          {session.messages.length} messages
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                {editingSessionId !== session.id && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStart(session.id, session.title);
                      }}
                      className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDelete(session.id, e)}
                      className="h-6 w-6 p-0 text-white/60 hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Connection Status */}
      {user && (
        <div className="p-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Synced to database</span>
          </div>
        </div>
      )}
    </div>
  );
};
