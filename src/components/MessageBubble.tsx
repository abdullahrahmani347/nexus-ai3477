
import React, { useState } from 'react';
import { Copy, Edit2, Trash2, Check, X, FileText, Image, File } from 'lucide-react';
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
        <div
          className={`p-4 rounded-2xl ${
            message.sender === 'user'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : message.isError
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              : 'bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-gray-200 border border-gray-200/50 dark:border-gray-600/50'
          } shadow-sm backdrop-blur-sm break-words`}
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
                className="bg-white/50 dark:bg-gray-600/50"
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
                <Button onClick={handleSave} size="sm" variant="ghost">
                  <Check className="w-3 h-3" />
                </Button>
                <Button onClick={handleCancel} size="sm" variant="ghost">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.text}</div>
          )}
        </div>

        {/* Message Actions */}
        <div className={`flex items-center space-x-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
          message.sender === 'user' ? 'justify-end' : 'justify-start'
        }`}>
          <Button
            onClick={handleCopy}
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </Button>
          
          {message.sender === 'user' && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
          )}
          
          <Button
            onClick={handleDelete}
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
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
