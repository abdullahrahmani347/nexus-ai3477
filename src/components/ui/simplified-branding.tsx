
import React from 'react';
import { Brain, Sparkles, Shield } from 'lucide-react';

interface SimplifiedBrandingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'minimal' | 'premium';
  className?: string;
}

export const SimplifiedBranding: React.FC<SimplifiedBrandingProps> = ({ 
  size = 'md', 
  showText = true,
  variant = 'default',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const variantConfig = {
    default: {
      icon: Brain,
      gradient: 'from-purple-500 to-blue-500',
      textGradient: 'from-purple-400 to-blue-400'
    },
    minimal: {
      icon: Brain,
      gradient: 'from-slate-600 to-slate-700',
      textGradient: 'from-slate-400 to-slate-500'
    },
    premium: {
      icon: Sparkles,
      gradient: 'from-purple-500 via-violet-500 to-pink-500',
      textGradient: 'from-purple-400 via-violet-400 to-pink-400'
    }
  };

  const config = variantConfig[variant];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105`}>
        <config.icon className={`${iconSizeClasses[size]} text-white`} />
      </div>
      {showText && (
        <div>
          <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r ${config.textGradient} bg-clip-text text-transparent`}>
            Nexus AI
          </span>
          {size === 'lg' || size === 'xl' ? (
            <div className="text-xs text-white/60 font-medium">
              AI Platform
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

interface SimplifiedLogoProps {
  size?: number;
  variant?: 'default' | 'minimal' | 'premium';
  className?: string;
}

export const SimplifiedLogo: React.FC<SimplifiedLogoProps> = ({
  size = 32,
  variant = 'default',
  className = ''
}) => {
  const variantConfig = {
    default: {
      icon: Brain,
      gradient: 'from-purple-500 to-blue-500'
    },
    minimal: {
      icon: Brain,
      gradient: 'from-slate-600 to-slate-700'
    },
    premium: {
      icon: Sparkles,
      gradient: 'from-purple-500 via-violet-500 to-pink-500'
    }
  };

  const config = variantConfig[variant];
  const iconSize = Math.floor(size * 0.6);

  return (
    <div 
      className={`bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      <config.icon 
        style={{ width: iconSize, height: iconSize }}
        className="text-white" 
      />
    </div>
  );
};
