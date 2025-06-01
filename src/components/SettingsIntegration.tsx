
import React from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAuth } from '@/hooks/useAuth';

interface SettingsIntegrationProps {
  children: React.ReactNode;
}

export const SettingsIntegration: React.FC<SettingsIntegrationProps> = ({ children }) => {
  const { user } = useAuth();
  const { 
    apiKey, 
    model, 
    maxTokens, 
    temperature, 
    systemPrompt,
    setIsConnected 
  } = useChatStore();

  // Update connection status based on API key availability
  React.useEffect(() => {
    setIsConnected(!!apiKey.trim());
  }, [apiKey, setIsConnected]);

  // Log settings changes for debugging
  React.useEffect(() => {
    console.log('Settings updated:', {
      model,
      maxTokens,
      temperature,
      systemPrompt: systemPrompt.slice(0, 50) + '...',
      hasApiKey: !!apiKey,
      user: user?.email
    });
  }, [model, maxTokens, temperature, systemPrompt, apiKey, user]);

  return <>{children}</>;
};
