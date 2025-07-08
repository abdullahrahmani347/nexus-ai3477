
import React from 'react';
import { Brain, Zap, Network } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NexusLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'minimal' | 'icon-only';
  className?: string;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'default',
  className
}) => {
  const sizeConfig = {
    sm: { 
      container: 'gap-2', 
      icon: 'w-6 h-6', 
      iconContainer: 'w-8 h-8',
      text: 'text-lg',
      tagline: 'text-xs'
    },
    md: { 
      container: 'gap-3', 
      icon: 'w-8 h-8', 
      iconContainer: 'w-12 h-12',
      text: 'text-2xl',
      tagline: 'text-sm'
    },
    lg: { 
      container: 'gap-4', 
      icon: 'w-10 h-10', 
      iconContainer: 'w-16 h-16',
      text: 'text-3xl',
      tagline: 'text-base'
    },
    xl: { 
      container: 'gap-5', 
      icon: 'w-12 h-12', 
      iconContainer: 'w-20 h-20',
      text: 'text-4xl',
      tagline: 'text-lg'
    }
  };

  const config = sizeConfig[size];

  const LogoIcon = () => (
    <div className={cn(
      'nexus-gradient-bg rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-300 hover:scale-105',
      config.iconContainer
    )}>
      {/* Neural Network Pattern */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-2 h-2 bg-white/30 rounded-full top-2 left-2"></div>
        <div className="absolute w-1.5 h-1.5 bg-white/30 rounded-full top-3 right-3"></div>
        <div className="absolute w-1 h-1 bg-white/30 rounded-full bottom-3 left-3"></div>
        <div className="absolute w-1.5 h-1.5 bg-white/30 rounded-full bottom-2 right-2"></div>
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 64 64">
          <path d="M12 12 L52 20 L16 48 L48 52 Z" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M20 12 L44 52" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
      </div>
      
      {/* Main Icon */}
      <Brain className={cn(config.icon, 'text-white relative z-10')} />
    </div>
  );

  if (variant === 'icon-only') {
    return <LogoIcon />;
  }

  return (
    <div className={cn('flex items-center', config.container, className)}>
      <LogoIcon />
      
      {showText && variant !== 'minimal' && (
        <div className="flex flex-col">
          <h1 className={cn(
            'font-bold tracking-tight leading-none nexus-gradient-text',
            config.text
          )}>
            Nexus AI
          </h1>
          {(size === 'lg' || size === 'xl') && (
            <p className={cn(
              'text-muted-foreground font-medium leading-none mt-1',
              config.tagline
            )}>
              Where Intelligence Connects
            </p>
          )}
        </div>
      )}
      
      {showText && variant === 'minimal' && (
        <span className={cn(
          'font-bold tracking-tight nexus-gradient-text',
          config.text
        )}>
          Nexus AI
        </span>
      )}
    </div>
  );
};

interface NexusStatusIndicatorProps {
  status?: 'online' | 'processing' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const NexusStatusIndicator: React.FC<NexusStatusIndicatorProps> = ({
  status = 'online',
  size = 'md',
  showLabel = false,
  className
}) => {
  const sizeConfig = {
    sm: { dot: 'w-2 h-2', container: 'gap-1.5', text: 'text-xs' },
    md: { dot: 'w-3 h-3', container: 'gap-2', text: 'text-sm' },
    lg: { dot: 'w-4 h-4', container: 'gap-2.5', text: 'text-base' }
  };

  const statusConfig = {
    online: { 
      color: 'bg-green-500', 
      label: 'Online', 
      animate: 'animate-pulse' 
    },
    processing: { 
      color: 'bg-amber-500', 
      label: 'Processing', 
      animate: 'animate-pulse' 
    },
    offline: { 
      color: 'bg-gray-400', 
      label: 'Offline', 
      animate: '' 
    }
  };

  const config = sizeConfig[size];
  const statusStyles = statusConfig[status];

  return (
    <div className={cn('flex items-center', config.container, className)}>
      <div className={cn(
        'rounded-full',
        config.dot,
        statusStyles.color,
        statusStyles.animate
      )} />
      {showLabel && (
        <span className={cn(
          'font-medium text-muted-foreground',
          config.text
        )}>
          {statusStyles.label}
        </span>
      )}
    </div>
  );
};

interface NexusMetricsProps {
  metrics: Array<{
    label: string;
    value: string | number;
    change?: number;
    icon?: React.ComponentType<any>;
  }>;
  className?: string;
}

export const NexusMetrics: React.FC<NexusMetricsProps> = ({ metrics, className }) => {
  return (
    <div className={cn('nexus-responsive-grid', className)}>
      {metrics.map((metric, index) => (
        <div key={index} className="nexus-card p-6 nexus-animate-scale-in">
          <div className="flex items-center justify-between mb-2">
            <span className="nexus-small">{metric.label}</span>
            {metric.icon && <metric.icon className="w-4 h-4 text-muted-foreground" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="nexus-h3">{metric.value}</span>
            {metric.change !== undefined && (
              <span className={cn(
                'nexus-caption font-medium',
                metric.change > 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
