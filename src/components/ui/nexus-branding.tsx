import React from 'react';
import { Sparkles, Crown, Zap, Brain, Rocket, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NexusBrandingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  showBadge?: boolean;
  subtitle?: string;
  variant?: 'default' | 'premium' | 'enterprise';
  className?: string;
}

export const NexusBranding: React.FC<NexusBrandingProps> = ({
  size = 'md',
  showStatus = true,
  showBadge = true,
  subtitle = 'AI Platform',
  variant = 'default',
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
    },
    xl: {
      logo: 'w-20 h-20',
      icon: 'w-10 h-10',
      title: 'text-4xl',
      subtitle: 'text-base',
      badge: 'text-sm'
    }
  };

  const variantConfig = {
    default: {
      icon: Brain,
      badgeText: 'AI Powered',
      badgeIcon: Zap,
      gradient: 'from-purple-500 via-blue-500 to-pink-500'
    },
    premium: {
      icon: Sparkles,
      badgeText: 'Premium',
      badgeIcon: Crown,
      gradient: 'from-purple-500 via-violet-500 to-pink-500'
    },
    enterprise: {
      icon: Shield,
      badgeText: 'Enterprise',
      badgeIcon: Rocket,
      gradient: 'from-blue-600 via-purple-600 to-pink-600'
    }
  };

  const sizes = sizeClasses[size];
  const config = variantConfig[variant];

  return (
    <div className={`nexus-brand-container ${className}`}>
      <div className="relative">
        <div className={`nexus-brand-logo ${sizes.logo} nexus-shadow bg-gradient-to-br ${config.gradient}`}>
          <config.icon className={`${sizes.icon} text-white`} />
        </div>
        {showStatus && (
          <div className="nexus-status-indicator" />
        )}
      </div>
      <div>
        <h1 className={`nexus-brand-text ${sizes.title}`}>
          Nexus AI
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          {showBadge && (
            <Badge variant="secondary" className={`bg-purple-500/20 text-purple-300 border-purple-500/30 ${sizes.badge} nexus-transition`}>
              <config.badgeIcon className="w-3 h-3 mr-1" />
              {config.badgeText}
            </Badge>
          )}
          <span className={`nexus-subtitle ${sizes.subtitle}`}>{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

interface NexusStatusBadgeProps {
  variant?: 'default' | 'premium' | 'enterprise';
  className?: string;
}

export const NexusStatusBadge: React.FC<NexusStatusBadgeProps> = ({ 
  variant = 'default',
  className = '' 
}) => {
  const variantConfig = {
    default: { icon: Zap, text: 'AI Powered', color: 'from-purple-500/20 to-blue-500/20' },
    premium: { icon: Crown, text: 'Premium', color: 'from-purple-500/20 to-pink-500/20' },
    enterprise: { icon: Shield, text: 'Enterprise', color: 'from-blue-500/20 to-purple-500/20' }
  };

  const config = variantConfig[variant];

  return (
    <div className={`hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${config.color} rounded-full border border-purple-500/30 nexus-transition nexus-interactive ${className}`}>
      <config.icon className="w-4 h-4 text-purple-400" />
      <span className="text-sm text-white/80 font-medium">{config.text}</span>
    </div>
  );
};

interface NexusCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: 'default' | 'elevated' | 'subtle' | 'premium';
  hover?: boolean;
  onClick?: () => void;
}

export const NexusCard: React.FC<NexusCardProps> = ({ 
  children, 
  className = '', 
  interactive = false,
  variant = 'default',
  hover = true,
  onClick
}) => {
  const variantClasses = {
    default: 'nexus-card',
    elevated: 'nexus-card nexus-glow',
    subtle: 'nexus-card opacity-90',
    premium: 'nexus-card bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20'
  };

  const baseClasses = variantClasses[variant];
  const interactiveClasses = interactive ? 'nexus-interactive cursor-pointer' : '';
  const hoverClasses = hover ? 'hover:bg-white/10 transition-all duration-300' : '';

  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface NexusGradientTextProps {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'success' | 'warning';
  className?: string;
}

export const NexusGradientText: React.FC<NexusGradientTextProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const gradients = {
    default: 'from-purple-400 via-blue-400 to-pink-400',
    premium: 'from-purple-400 via-violet-400 to-pink-400',
    success: 'from-green-400 via-emerald-400 to-teal-400',
    warning: 'from-yellow-400 via-orange-400 to-red-400'
  };

  return (
    <span className={`bg-gradient-to-r ${gradients[variant]} bg-clip-text text-transparent font-bold ${className}`}>
      {children}
    </span>
  );
};

interface NexusFeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  features?: string[];
  badge?: string;
  onClick?: () => void;
}

export const NexusFeatureCard: React.FC<NexusFeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  features = [],
  badge,
  onClick
}) => {
  return (
    <NexusCard 
      interactive={!!onClick} 
      variant="premium" 
      className="p-6 group cursor-pointer hover:scale-105"
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg mb-1">{title}</h3>
          {badge && (
            <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
              {badge}
            </Badge>
          )}
        </div>
      </div>
      <p className="text-white/70 text-sm leading-relaxed mb-4">{description}</p>
      {features.length > 0 && (
        <div className="space-y-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              <span className="text-xs text-white/60">{feature}</span>
            </div>
          ))}
        </div>
      )}
    </NexusCard>
  );
};
