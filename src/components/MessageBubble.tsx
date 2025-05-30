
import React, { useState } from 'react';
import { format } from 'date-fns';
import { User, Bot, AlertCircle, Copy, Edit2, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
  isEditing?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isError = message.isError;
  const [showActions, setShowActions] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [copied, setCopied] = useState(false);
  
  const { updateMessage, deleteMessage, regenerateResponse } = useChatStore();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    updateMessage(message.id, { isEditing: true });
    setEditText(message.text);
  };

  const handleSaveEdit = () => {
    updateMessage(message.id, { text: editText, isEditing: false });
    if (isUser) {
      regenerateResponse(message.id);
    }
  };

  const handleCancelEdit = () => {
    updateMessage(message.id, { isEditing: false });
    setEditText(message.text);
  };

  const handleDelete = () => {
    deleteMessage(message.id);
  };

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
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
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} relative`}>
          <div className={`relative px-4 py-3 rounded-2xl max-w-full ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : isError
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
          }`}>
            {message.isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full min-h-[60px] p-2 border rounded text-gray-800 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSaveEdit();
                    } else if (e.key === 'Escape') {
                      handleCancelEdit();
                    }
                  }}
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                {message.text}
              </p>
            )}
            
            {/* Message tail */}
            <div className={`absolute w-3 h-3 transform rotate-45 ${
              isUser 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 -right-1 bottom-3' 
                : isError
                  ? 'bg-red-50 border-r border-b border-red-200 -left-1 bottom-3'
                  : 'bg-white border-r border-b border-gray-200 -left-1 bottom-3'
            }`} />
          </div>
          
          {/* Actions */}
          {showActions && !message.isEditing && (
            <div className={`absolute top-0 ${isUser ? 'left-0' : 'right-0'} flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-lg border p-1 z-10`}>
              <Button size="sm" variant="ghost" onClick={handleCopy}>
                {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
              </Button>
              {isUser && (
                <Button size="sm" variant="ghost" onClick={handleEdit}>
                  <Edit2 className="w-3 h-3" />
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={handleDelete} className="text-red-600 hover:text-red-800">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
          
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
