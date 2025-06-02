import React, { useState } from 'react';
import { Heart, ThumbsUp, ThumbsDown, Smile, Star, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chatStore';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
  hasReacted: boolean;
}

interface MessageReactionsProps {
  messageId: string;
  reactions?: Record<string, Reaction>;
  onReact: (messageId: string, emoji: string) => void;
}

const REACTION_EMOJIS = [
  { emoji: '👍', icon: ThumbsUp, label: 'Like' },
  { emoji: '👎', icon: ThumbsDown, label: 'Dislike' },
  { emoji: '❤️', icon: Heart, label: 'Love' },
  { emoji: '😊', icon: Smile, label: 'Smile' },
  { emoji: '⭐', icon: Star, label: 'Star' },
];

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  messageId,
  reactions = {},
  onReact
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReaction = (emoji: string) => {
    onReact(messageId, emoji);
    setShowReactionPicker(false);
  };

  const handleCopyMessage = async () => {
    const { messages } = useChatStore.getState();
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      {/* Existing Reactions */}
      {Object.entries(reactions).map(([emoji, reaction]) => (
        <Button
          key={emoji}
          variant={reaction.hasReacted ? "default" : "ghost"}
          size="sm"
          onClick={() => handleReaction(emoji)}
          className={`h-7 px-2 text-xs ${
            reaction.hasReacted 
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
              : 'text-white/70 hover:bg-white/10'
          }`}
        >
          <span className="mr-1">{emoji}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}

      {/* Reaction Picker */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReactionPicker(!showReactionPicker)}
          className="h-7 w-7 p-0 text-white/50 hover:text-white hover:bg-white/10"
        >
          😊
        </Button>

        {showReactionPicker && (
          <div className="absolute bottom-8 left-0 nexus-card p-2 flex gap-1 z-10">
            {REACTION_EMOJIS.map(({ emoji, label }) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                onClick={() => handleReaction(emoji)}
                className="h-8 w-8 p-0 text-lg hover:bg-white/10"
                title={label}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Copy Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyMessage}
        className="h-7 w-7 p-0 text-white/50 hover:text-white hover:bg-white/10"
        title="Copy message"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      </Button>
    </div>
  );
};
