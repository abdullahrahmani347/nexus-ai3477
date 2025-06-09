
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ErrorLogEntry {
  error_type: string;
  error_message: string;
  stack_trace?: string;
  user_agent?: string;
  url?: string;
}

export function useErrorLogging() {
  const { user } = useAuth();

  const logError = async (error: Error, context?: string) => {
    try {
      const errorEntry: ErrorLogEntry = {
        error_type: error.name || 'Error',
        error_message: error.message,
        stack_trace: error.stack,
        user_agent: navigator.userAgent,
        url: window.location.href
      };

      const { error: logError } = await supabase
        .from('error_logs')
        .insert({
          ...errorEntry,
          user_id: user?.id || null
        });

      if (logError) {
        console.error('Failed to log error:', logError);
      }
    } catch (loggingError) {
      console.error('Error logging failed:', loggingError);
    }
  };

  const getErrorLogs = async (limit = 50) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching error logs:', error);
      return [];
    }
  };

  return {
    logError,
    getErrorLogs
  };
}
