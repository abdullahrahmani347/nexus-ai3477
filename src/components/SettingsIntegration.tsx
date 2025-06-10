
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
    setIsConnected,
    setApiKey
  } = useChatStore();

  // Initialize with provided API key if not already set
  React.useEffect(() => {
    const providedApiKey = 'AIzaSyCQng6ZRpsK7jM6FIU3aXtFheTOlvA44lg';
    
    if (!apiKey || apiKey.trim().length === 0) {
      console.log('Initializing API key...');
      setApiKey(providedApiKey);
    }
  }, [apiKey, setApiKey]);

  // Update connection status based on API key availability and validity
  React.useEffect(() => {
    const isValidKey = apiKey && apiKey.trim().length > 20 && apiKey.startsWith('AIza');
    setIsConnected(isValidKey);
    
    if (isValidKey) {
      console.log('API key validated and connected');
    } else {
      console.log('API key validation failed or missing');
    }
  }, [apiKey, setIsConnected]);

  // Log settings changes for debugging
  React.useEffect(() => {
    console.log('Current settings:', {
      model,
      maxTokens,
      temperature,
      systemPrompt: systemPrompt.slice(0, 50) + '...',
      hasApiKey: !!apiKey,
      apiKeyValid: !!(apiKey && apiKey.trim().length > 20 && apiKey.startsWith('AIza')),
      user: user?.email
    });
  }, [model, maxTokens, temperature, systemPrompt, apiKey, user]);

  return <>{children}</>;
};
