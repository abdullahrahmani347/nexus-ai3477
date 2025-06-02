
import React from 'react';
import { Sparkles, Crown, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NexusBrandingProps {
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  showBadge?: boolean;
  subtitle?: string;
  className?: string;
}

export const NexusBranding: React.FC<NexusBrandingProps> = ({
  size = 'md',
  showStatus = true,
  showBadge = true,
  subtitle = 'Your AI Dashboard',
  className = ''
}) => {
  const sizeClasses = {
    sm: {
      logo: 'w-8 h-8',
      icon: 'w-4 h-4',
      title: 'text-lg',
      subtitle: 'text-xs',
      badge: 'text-xs'
    },
    md: {
      logo: 'w-12 h-12',
      icon: 'w-6 h-6',
      title: 'text-2xl',
      subtitle: 'text-xs',
      badge: 'text-xs'
    },
    lg: {
      logo: 'w-16 h-16',
      icon: 'w-8 h-8',
      title: 'text-3xl',
      subtitle: 'text-sm',
      badge: 'text-sm'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`nexus-brand-container ${className}`}>
      <div className="relative">
        <div className={`nexus-brand-logo ${sizes.logo} nexus-shadow`}>
          <Sparkles className={`${sizes.icon} text-white`} />
        </div>
        {showStatus && (
          <div className="nexus-status-indicator" />
        )}
      </div>
      <div>
        <h1 className={`nexus-brand-text ${sizes.title}`}>
          Nexus AI
        </h1>
        <div className="flex items-center gap-2">
          {showBadge && (
            <Badge variant="secondary" className={`bg-purple-500/20 text-purple-300 border-purple-500/30 ${sizes.badge} nexus-transition`}>
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          <span className={`nexus-subtitle ${sizes.subtitle}`}>{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

interface NexusStatusBadgeProps {
  className?: string;
}

export const NexusStatusBadge: React.FC<NexusStatusBadgeProps> = ({ className = '' }) => {
  return (
    <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 nexus-transition nexus-interactive ${className}`}>
      <Zap className="w-4 h-4 text-purple-400" />
      <span className="text-sm text-white/80 font-medium">AI Powered</span>
    </div>
  );
};

interface NexusCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: 'default' | 'elevated' | 'subtle';
}

export const NexusCard: React.FC<NexusCardProps> = ({ 
  children, 
  className = '', 
  interactive = false,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'nexus-card',
    elevated: 'nexus-card nexus-glow',
    subtle: 'nexus-card opacity-80'
  };

  const baseClasses = variantClasses[variant];
  const interactiveClasses = interactive ? 'nexus-interactive' : '';

  return (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`}>
      {children}
    </div>
  );
};
