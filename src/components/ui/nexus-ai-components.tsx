import React from 'react';
import { Bot, User, Loader, CheckCircle, AlertCircle, Zap, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// AI Chat Interface Components
interface ChatBubbleProps {
  message: string;
  sender: 'ai' | 'user';
  timestamp?: string;
  isTyping?: boolean;
  confidence?: number;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  sender,
  timestamp,
  isTyping = false,
  confidence,
  className
}) => {
  return (
    <div className={cn(
      'flex gap-3 mb-4',
      sender === 'user' ? 'justify-end' : 'justify-start',
      className
    )}>
      {sender === 'ai' && (
        <div className="w-8 h-8 nexus-gradient-bg rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-3 transition-all duration-200',
        sender === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-card border border-border text-card-foreground shadow-[var(--nexus-shadow-sm)]'
      )}>
        {isTyping ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <span className="text-sm text-muted-foreground">AI is thinking...</span>
          </div>
        ) : (
          <>
            <div className="text-sm leading-relaxed">{message}</div>
            {sender === 'ai' && confidence && (
              <div className="mt-2 pt-2 border-t border-border">
                <Badge variant="secondary" className="text-xs">
                  Confidence: {Math.round(confidence * 100)}%
                </Badge>
              </div>
            )}
            {timestamp && (
              <div className="mt-1 text-xs text-muted-foreground">
                {timestamp}
              </div>
            )}
          </>
        )}
      </div>
      
      {sender === 'user' && (
        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

// AI Model Selector
interface ModelOption {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  performance: 'fast' | 'balanced' | 'advanced';
}

interface ModelSelectorProps {
  models: ModelOption[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  className?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onModelChange,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selected = models.find(m => m.id === selectedModel);

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'fast': return 'text-connection-cyan';
      case 'balanced': return 'text-warning-amber';
      case 'advanced': return 'text-neural-purple';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between nexus-card"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          <span>{selected?.name || 'Select Model'}</span>
          {selected && (
            <Badge variant="secondary" className={getPerformanceColor(selected.performance)}>
              {selected.performance}
            </Badge>
          )}
        </div>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 nexus-card p-2 z-50 max-h-96 overflow-y-auto">
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
              className={cn(
                'p-3 rounded-lg cursor-pointer transition-colors duration-200',
                'hover:bg-muted/50',
                selectedModel === model.id && 'bg-primary/10 border border-primary/20'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{model.name}</span>
                <Badge variant="secondary" className={getPerformanceColor(model.performance)}>
                  {model.performance}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{model.description}</p>
              <div className="flex flex-wrap gap-1">
                {model.capabilities.map((cap, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// AI Processing Indicator
interface ProcessingIndicatorProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
  progress?: number;
  className?: string;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  status,
  message,
  progress,
  className
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn('flex items-center gap-2 p-3 nexus-card', className)}>
      {getStatusIcon()}
      <span className="text-sm">{message || `Status: ${status}`}</span>
      {progress !== undefined && (
        <div className="flex-1 bg-muted rounded-full h-2 ml-2">
          <div 
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// AI Result Card
interface ResultCardProps {
  title: string;
  content: string;
  confidence?: number;
  tags?: string[];
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  }>;
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  content,
  confidence,
  tags = [],
  actions = [],
  className
}) => {
  return (
    <div className={cn('nexus-card p-6 space-y-4', className)}>
      <div className="flex items-start justify-between">
        <h3 className="nexus-h4">{title}</h3>
        {confidence && (
          <Badge variant={confidence > 0.8 ? 'default' : confidence > 0.6 ? 'secondary' : 'outline'}>
            {Math.round(confidence * 100)}% confidence
          </Badge>
        )}
      </div>
      
      <div className="text-sm text-muted-foreground leading-relaxed">
        {content}
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      {actions.length > 0 && (
        <div className="flex gap-2 pt-2 border-t border-border">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

// AI Prompt Builder
interface PromptBuilderProps {
  onPromptSubmit: (prompt: string) => void;
  suggestions?: string[];
  isLoading?: boolean;
  className?: string;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  onPromptSubmit,
  suggestions = [],
  isLoading = false,
  className
}) => {
  const [prompt, setPrompt] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onPromptSubmit(prompt.trim());
      setPrompt('');
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you'd like the AI to help you with..."
            className="nexus-textarea min-h-[100px] pr-12"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute bottom-2 right-2"
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
      
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Suggestions:</span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(suggestion)}
                disabled={isLoading}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};