
import React from 'react';
import { cn } from '@/lib/utils';

interface NexusLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({
  size = 'md',
  showText = true,
  className
}) => {
  const sizeConfig = {
    sm: { container: 'w-8 h-8', text: 'text-sm', logoSize: 32 },
    md: { container: 'w-12 h-12', text: 'text-lg', logoSize: 48 },
    lg: { container: 'w-16 h-16', text: 'text-xl', logoSize: 64 },
    xl: { container: 'w-20 h-20', text: 'text-2xl', logoSize: 80 }
  };

  const config = sizeConfig[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(
        'relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-110',
        config.container
      )}>
        <img 
          src="/lovable-uploads/a3767cde-0ade-4ba6-a2b7-f396947bd8fd.png"
          alt="Nexus AI Logo"
          className="w-full h-full object-cover"
          style={{ imageRendering: 'crisp-edges' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-purple-500/20" />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            'font-bold nexus-brand-text leading-none',
            config.text
          )}>
            NEXUS AI
          </h1>
          {(size === 'lg' || size === 'xl') && (
            <p className="text-xs text-white/60 font-medium mt-1">
              Advanced AI Platform
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export const NexusIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className
}) => {
  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-110',
        className
      )}
      style={{ width: size, height: size }}
    >
      <img 
        src="/lovable-uploads/a3767cde-0ade-4ba6-a2b7-f396947bd8fd.png"
        alt="Nexus AI"
        className="w-full h-full object-cover"
        style={{ imageRendering: 'crisp-edges' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-purple-500/20" />
    </div>
  );
};
