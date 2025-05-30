
import React from 'react';
import { format } from 'date-fns';
import { User, Bot, AlertCircle } from 'lucide-react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isError = message.isError;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 ${isUser ? 'space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
            : isError 
              ? 'bg-red-500' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : isError ? (
            <AlertCircle className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`relative px-4 py-3 rounded-2xl max-w-full ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : isError
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
          }`}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">
              {message.text}
            </p>
            
            {/* Message tail */}
            <div className={`absolute w-3 h-3 transform rotate-45 ${
              isUser 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 -right-1 bottom-3' 
                : isError
                  ? 'bg-red-50 border-r border-b border-red-200 -left-1 bottom-3'
                  : 'bg-white border-r border-b border-gray-200 -left-1 bottom-3'
            }`} />
          </div>
          
          {/* Timestamp */}
          <span className="text-xs text-gray-500 mt-1 px-1">
            {format(message.timestamp, 'HH:mm')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
