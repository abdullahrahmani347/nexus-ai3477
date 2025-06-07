
import React from 'react';
import ChatInterface from './ChatInterface';

interface ChatManagerProps {
  className?: string;
}

export const ChatManager: React.FC<ChatManagerProps> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <ChatInterface />
    </div>
  );
};
