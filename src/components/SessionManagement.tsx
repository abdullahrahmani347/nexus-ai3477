
import React from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/store/chatStore';
import { formatDistanceToNow } from 'date-fns';

interface SessionManagementProps {
  onSessionSelect?: (sessionId: string) => void;
}

export const SessionManagement: React.FC<SessionManagementProps> = ({
  onSessionSelect
}) => {
  const [editingSessionId, setEditingSessionId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

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

  const handleDelete = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this session?')) {
      deleteSession(sessionId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <Button
          onClick={handleNewSession}
          className="w-full flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`
                group relative p-3 rounded-lg cursor-pointer transition-colors
                ${session.id === currentSessionId 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-muted/50'
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
                        className="h-6 text-sm"
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
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditCancel}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-sm truncate">
                        {session.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <MessageSquare className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
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
                      className="h-6 w-6 p-0"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDelete(session.id, e)}
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
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
    </div>
  );
};
