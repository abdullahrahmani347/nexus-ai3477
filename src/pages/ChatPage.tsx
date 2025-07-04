
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import { MobileOptimizedChat } from '@/components/MobileOptimizedChat';
import ChatInterface from '@/components/ChatInterface';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const ChatPage = () => {
  const { user, loading } = useAuth();
  const { isConnected } = useDatabase();
  const [isMobile, setIsMobile] = React.useState(false);

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your chat..." />;
  }

  // Show mobile-optimized version on smaller screens
  if (isMobile) {
    return <MobileOptimizedChat />;
  }

  // Desktop version
  return (
    <div className="h-screen">
      <ChatInterface />
    </div>
  );
};

export default ChatPage;
