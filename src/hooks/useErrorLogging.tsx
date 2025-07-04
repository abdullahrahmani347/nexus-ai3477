
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ErrorInfo {
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  url?: string;
  userAgent?: string;
}

export function useErrorLogging() {
  useEffect(() => {
    const handleError = async (event: ErrorEvent) => {
      const errorInfo: ErrorInfo = {
        errorType: 'JavaScript Error',
        errorMessage: event.message,
        stackTrace: event.error?.stack,
        url: event.filename,
        userAgent: navigator.userAgent
      };

      await logError(errorInfo);
    };

    const handleUnhandledRejection = async (event: PromiseRejectionEvent) => {
      const errorInfo: ErrorInfo = {
        errorType: 'Unhandled Promise Rejection',
        errorMessage: event.reason?.message || String(event.reason),
        stackTrace: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      await logError(errorInfo);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const logError = async (errorInfo: ErrorInfo) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('error_logs').insert({
        user_id: user?.id || null,
        error_type: errorInfo.errorType,
        error_message: errorInfo.errorMessage,
        stack_trace: errorInfo.stackTrace,
        url: errorInfo.url,
        user_agent: errorInfo.userAgent
      });
    } catch (error) {
      console.error('Failed to log error:', error);
    }
  };

  return { logError };
}
