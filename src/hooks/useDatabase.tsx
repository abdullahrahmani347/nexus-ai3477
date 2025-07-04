
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useChatStore } from '@/store/chatStore';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useDatabase() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    sessions, 
    currentSessionId, 
    messages,
    addMessage,
    createSession,
    switchSession,
    updateSessionTitle,
    deleteSession,
    setSessions,
    setMessages
  } = useChatStore();

  // Sync sessions from database on user login
  useEffect(() => {
    if (user) {
      console.log('User authenticated, loading sessions for:', user.email);
      loadSessions();
      loadCurrentSessionMessages();
    } else {
      console.log('User not authenticated, clearing local data');
      setSessions([]);
      setMessages([]);
    }
  }, [user?.id]); // Use user.id instead of user to avoid unnecessary re-renders

  // Auto-save messages when they change
  useEffect(() => {
    if (user && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.id && !lastMessage.id.startsWith('temp-')) {
        console.log('Auto-saving message:', lastMessage.id);
        saveMessage(lastMessage);
        updateUsageTracking(lastMessage);
      }
    }
  }, [messages.length, user?.id]);

  // Auto-save session title changes
  useEffect(() => {
    if (user && currentSessionId) {
      const currentSession = sessions.find(s => s.id === currentSessionId);
      if (currentSession && currentSession.title !== 'New Chat') {
        console.log('Auto-saving session:', currentSession.id, currentSession.title);
        saveSession(currentSession.id, currentSession.title);
      }
    }
  }, [sessions, currentSessionId, user?.id]);

  const loadSessions = async () => {
    if (!user) return;

    try {
      console.log('Loading sessions for user:', user.id);
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Failed to load sessions:', error);
        toast({
          title: "Error loading sessions",
          description: "Failed to load your chat sessions from the database.",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        console.log(`Loaded ${data.length} sessions from database`);
        const loadedSessions = data.map(session => ({
          id: session.id,
          title: session.title,
          createdAt: new Date(session.created_at),
          updatedAt: new Date(session.updated_at),
          messages: []
        }));

        setSessions(loadedSessions);
        
        // Switch to the most recent session if no current session
        if (!currentSessionId || !loadedSessions.find(s => s.id === currentSessionId)) {
          switchSession(loadedSessions[0].id);
        }
      } else {
        console.log('No sessions found, creating first session');
        // Create initial session for new users
        const firstSessionId = createSession('Welcome Chat');
        saveSession(firstSessionId, 'Welcome Chat');
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: "Database Error",
        description: "Failed to connect to the database. Using local storage.",
        variant: "destructive",
      });
    }
  };

  const loadCurrentSessionMessages = async () => {
    if (!user || !currentSessionId) return;

    try {
      console.log('Loading messages for session:', currentSessionId);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', currentSessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to load messages:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log(`Loaded ${data.length} messages for session`);
        const loadedMessages = data.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender === 'assistant' ? 'bot' : msg.sender as 'user' | 'bot',
          timestamp: new Date(msg.created_at),
          model: msg.model_used || undefined,
          tokens: msg.tokens_used || undefined
        }));

        setMessages(loadedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveSession = async (sessionId: string, title: string) => {
    if (!user) return;

    try {
      console.log('Saving session:', sessionId, title);
      const { error } = await supabase
        .from('chat_sessions')
        .upsert({
          id: sessionId,
          user_id: user.id,
          title,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to save session:', error);
        toast({
          title: "Save Error",
          description: "Failed to save session to database.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const saveMessage = async (message: any) => {
    if (!user || !message.id || !currentSessionId) return;

    try {
      console.log('Saving message:', message.id);
      const { error } = await supabase
        .from('messages')
        .upsert({
          id: message.id,
          session_id: currentSessionId,
          user_id: user.id,
          content: message.text,
          sender: message.sender === 'bot' ? 'assistant' : message.sender,
          model_used: message.model || null,
          tokens_used: message.tokens || 0
        });

      if (error) {
        console.error('Failed to save message:', error);
        toast({
          title: "Save Error",
          description: "Failed to save message to database.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const updateUsageTracking = async (message: any) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('update_usage_tracking', {
        p_user_id: user.id,
        p_messages_sent: message.sender === 'user' ? 1 : 0,
        p_tokens_used: message.tokens || 0,
        p_api_calls: message.sender === 'bot' ? 1 : 0
      });

      if (error) {
        console.error('Failed to update usage tracking:', error);
      }
    } catch (error) {
      console.error('Error updating usage tracking:', error);
    }
  };

  const deleteSessionFromDb = async (sessionId: string) => {
    if (!user) return;

    try {
      console.log('Deleting session from database:', sessionId);
      // Delete messages first
      await supabase
        .from('messages')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      // Then delete session
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to delete session:', error);
        toast({
          title: "Delete Error",
          description: "Failed to delete session from database.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  return {
    saveSession,
    loadSessions,
    loadCurrentSessionMessages,
    updateUsageTracking,
    deleteSessionFromDb,
    isConnected: !!user
  };
}
