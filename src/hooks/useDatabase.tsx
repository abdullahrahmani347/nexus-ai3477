
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useChatStore } from '@/store/chatStore';
import { supabase } from '@/integrations/supabase/client';

export function useDatabase() {
  const { user } = useAuth();
  const { 
    sessions, 
    currentSessionId, 
    messages,
    addMessage,
    createSession,
    switchSession,
    updateSessionTitle,
    deleteSession
  } = useChatStore();

  // Sync sessions from database
  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  // Save new messages to database
  useEffect(() => {
    if (user && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      saveMessage(lastMessage);
      updateUsageTracking();
    }
  }, [messages, user]);

  const loadSessions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to load sessions:', error);
      return;
    }

    // Update store with database sessions
    // This would need to be implemented in the store
    console.log('Loaded sessions:', data);
  };

  const saveSession = async (sessionId: string, title: string) => {
    if (!user) return;

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
    }
  };

  const saveMessage = async (message: any) => {
    if (!user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        id: message.id,
        session_id: currentSessionId,
        user_id: user.id,
        content: message.text,
        sender: message.sender,
        model_used: message.model,
        tokens_used: message.tokens || 0
      });

    if (error) {
      console.error('Failed to save message:', error);
    }
  };

  const updateUsageTracking = async () => {
    if (!user) return;

    const { error } = await supabase.rpc('update_usage_tracking', {
      p_user_id: user.id,
      p_messages_sent: 1,
      p_tokens_used: 0, // This would come from the actual API response
      p_api_calls: 1
    });

    if (error) {
      console.error('Failed to update usage tracking:', error);
    }
  };

  return {
    saveSession,
    loadSessions,
    updateUsageTracking
  };
}
