
import React from 'react';
import { Copy, Check, RefreshCw, Trash2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chatStore';
import { voiceService } from '@/services/voiceService';
import { Message } from './MessageBubble';

interface MessageDisplayProps {
  message: Message;
  isLast?: boolean;
  onRegenerate?: () => void;
  onDelete?: () => void;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({
  message,
  isLast = false,
  onRegenerate,
  onDelete
}) => {
  const [copied, setCopied] = React.useState(false);
  const [speaking, setSpeaking] = React.useState(false);
  const { voiceEnabled } = useChatStore();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = async () => {
    if (speaking) {
      voiceService.cancelSpeech();
      setSpeaking(false);
    } else {
      try {
        setSpeaking(true);
        await voiceService.speak(message.text);
        setSpeaking(false);
      } catch (error) {
        console.error('Speech error:', error);
        setSpeaking(false);
      }
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`
        max-w-[80%] rounded-lg px-4 py-3 relative
        ${message.sender === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted border'
        }
      `}>
        {/* Message Content */}
        <div className="whitespace-pre-wrap break-words">
          {message.text}
        </div>

        {/* Message Metadata */}
        <div className="flex items-center justify-between mt-2 text-xs opacity-70">
          <div className="flex items-center gap-2">
            <span>{formatTimestamp(message.timestamp)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`
          absolute -top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity
          ${message.sender === 'user' ? '-left-16' : '-right-16'}
        `}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 w-6 p-0 bg-background border shadow-sm"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>

          {voiceEnabled && message.sender === 'bot' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSpeak}
              className="h-6 w-6 p-0 bg-background border shadow-sm"
            >
              {speaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>
          )}

          {message.sender === 'bot' && isLast && onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              className="h-6 w-6 p-0 bg-background border shadow-sm"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-6 w-6 p-0 bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
