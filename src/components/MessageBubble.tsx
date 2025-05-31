
import React, { useState } from 'react';
import { Copy, Edit2, Trash2, Check, X, FileText, Image, File, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '../store/chatStore';
import { FileData } from '../services/fileService';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  attachments?: FileData[];
  isError?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [copied, setCopied] = useState(false);
  const { updateMessage, deleteMessage } = useChatStore();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleSave = () => {
    if (editText.trim() !== message.text) {
      updateMessage(message.id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(message.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteMessage(message.id);
  };

  const renderFileAttachment = (file: FileData) => {
    const getFileIcon = () => {
      if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
      if (file.type === 'text/plain' || file.type === 'text/markdown') return <FileText className="w-4 h-4" />;
      return <File className="w-4 h-4" />;
    };

    const formatSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
      <div key={file.id} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded border">
        {getFileIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatSize(file.size)}
          </p>
        </div>
        {file.preview && (
          <img 
            src={file.preview} 
            alt={file.name}
            className="w-12 h-12 object-cover rounded"
          />
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}>
      <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
        {/* Avatar and Name */}
        <div className={`flex items-center gap-2 mb-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex items-center gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.sender === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'nexus-gradient text-white nexus-glow'
            }`}>
              {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {message.sender === 'user' ? 'You' : 'Nexus AI'}
            </span>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl relative ${
            message.sender === 'user'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : message.isError
              ? 'glass-effect border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
              : 'glass-effect border border-white/20 dark:border-white/10 text-gray-800 dark:text-gray-200 shadow-lg'
          } backdrop-blur-xl break-words`}
        >
          {/* File Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-3 space-y-2">
              {message.attachments.map(renderFileAttachment)}
            </div>
          )}

          {/* Message Content */}
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="bg-white/20 dark:bg-gray-600/20 border-white/30 focus:border-purple-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSave();
                  } else if (e.key === 'Escape') {
                    handleCancel();
                  }
                }}
                autoFocus
              />
              <div className="flex space-x-2">
                <Button onClick={handleSave} size="sm" variant="ghost" className="text-current hover:bg-white/20">
                  <Check className="w-3 h-3" />
                </Button>
                <Button onClick={handleCancel} size="sm" variant="ghost" className="text-current hover:bg-white/20">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
          )}
        </div>

        {/* Message Actions */}
        <div className={`flex items-center space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
          message.sender === 'user' ? 'justify-end' : 'justify-start'
        }`}>
          <Button
            onClick={handleCopy}
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </Button>
          
          {message.sender === 'user' && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
          )}
          
          <Button
            onClick={handleDelete}
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
          message.sender === 'user' ? 'text-right' : 'text-left'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
