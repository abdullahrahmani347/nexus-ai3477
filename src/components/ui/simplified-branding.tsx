
import React from 'react';
import { Bot } from 'lucide-react';

interface SimplifiedBrandingProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const SimplifiedBranding: React.FC<SimplifiedBrandingProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', title: 'text-lg', subtitle: 'text-xs' },
    md: { icon: 'w-8 h-8', title: 'text-xl', subtitle: 'text-sm' },
    lg: { icon: 'w-12 h-12', title: 'text-3xl', subtitle: 'text-base' }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg p-2 shadow-lg">
        <Bot className={`${sizes.icon} text-white`} />
      </div>
      <div>
        <h1 className={`${sizes.title} font-bold text-white`}>
          Nexus AI
        </h1>
        {showSubtitle && (
          <p className={`${sizes.subtitle} text-white/60`}>
            AI Chatbot Platform
          </p>
        )}
      </div>
    </div>
  );
};
