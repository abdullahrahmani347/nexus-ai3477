
import React from 'react';
import { Brain } from 'lucide-react';

interface SimplifiedBrandingProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const SimplifiedBranding: React.FC<SimplifiedBrandingProps> = ({ 
  size = 'md', 
  showText = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center`}>
        <Brain className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent`}>
          Nexus AI
        </span>
      )}
    </div>
  );
};
