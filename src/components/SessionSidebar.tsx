
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '../store/chatStore';
import { format } from 'date-fns';

interface SessionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SessionSidebar: React.FC<SessionSidebarProps> = ({ isOpen, onClose }) => {
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
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Chat Sessions</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateSession}
            className="text-blue-600 hover:text-blue-800"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {sortedSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chat sessions yet</p>
              <p className="text-xs">Create your first chat to get started</p>
            </div>
          ) : (
            sortedSessions.map((session) => (
              <div
                key={session.id}
                className={`group p-3 rounded-lg border cursor-pointer transition-colors ${
                  session.id === currentSessionId
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                    : 'hover:bg-gray-50 border-transparent dark:hover:bg-gray-700'
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
                      className="text-sm"
                      autoFocus
                    />
                    <div className="flex space-x-1">
                      <Button size="sm" onClick={handleEditSave}>
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {session.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {session.messages.length} messages
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
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
                          className="w-6 h-6 p-0"
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
                          className="w-6 h-6 p-0 text-red-600 hover:text-red-800"
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
