
import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-end space-x-2 max-w-[80%]">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>

        {/* Typing bubble */}
        <div className="relative bg-white border border-gray-200 shadow-sm px-4 py-3 rounded-2xl">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          
          {/* Message tail */}
          <div className="absolute w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45 -left-1 bottom-3" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
