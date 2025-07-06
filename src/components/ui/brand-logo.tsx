
import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'minimal' | 'premium';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'default',
  className
}) => {
  const sizeConfig = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', container: 'gap-2' },
    md: { icon: 'w-8 h-8', text: 'text-xl', container: 'gap-3' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', container: 'gap-3' },
    xl: { icon: 'w-12 h-12', text: 'text-3xl', container: 'gap-4' }
  };

  const variantConfig = {
    default: {
      background: 'bg-brand-gradient',
      icon: MessageSquare,
      textColor: 'text-brand-gradient'
    },
    minimal: {
      background: 'bg-gray-100 dark:bg-gray-800',
      icon: MessageSquare,
      textColor: 'text-gray-900 dark:text-gray-100'
    },
    premium: {
      background: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
      icon: Sparkles,
      textColor: 'text-brand-gradient'
    }
  };

  const config = sizeConfig[size];
  const variantStyles = variantConfig[variant];
  const IconComponent = variantStyles.icon;

  return (
    <div className={cn('flex items-center', config.container, className)}>
      <div className={cn(
        'flex items-center justify-center rounded-xl shadow-small transition-all duration-200 hover:scale-105',
        config.icon,
        variantStyles.background
      )}>
        <IconComponent className={cn('text-white', config.icon === 'w-12 h-12' ? 'w-7 h-7' : config.icon === 'w-10 h-10' ? 'w-6 h-6' : config.icon === 'w-8 h-8' ? 'w-5 h-5' : 'w-4 h-4')} />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            'font-bold heading-font tracking-tight leading-none',
            config.text,
            variantStyles.textColor
          )}>
            ChatHub Pro
          </h1>
          {(size === 'lg' || size === 'xl') && (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Intelligent Conversations
            </p>
          )}
        </div>
      )}
    </div>
  );
};

interface BrandIconProps {
  size?: number;
  variant?: 'default' | 'minimal' | 'premium';
  className?: string;
}

export const BrandIcon: React.FC<BrandIconProps> = ({
  size = 32,
  variant = 'default',
  className
}) => {
  const variantConfig = {
    default: {
      background: 'bg-brand-gradient',
      icon: MessageSquare
    },
    minimal: {
      background: 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600',
      icon: MessageSquare
    },
    premium: {
      background: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
      icon: Sparkles
    }
  };

  const variantStyles = variantConfig[variant];
  const IconComponent = variantStyles.icon;
  const iconSize = Math.floor(size * 0.6);

  return (
    <div 
      className={cn(
        'flex items-center justify-center rounded-xl shadow-small transition-all duration-200 hover:scale-105',
        variantStyles.background,
        className
      )}
      style={{ width: size, height: size }}
    >
      <IconComponent 
        style={{ width: iconSize, height: iconSize }}
        className="text-white" 
      />
    </div>
  );
};
