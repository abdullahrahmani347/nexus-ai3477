
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

  // Initialize with Together.ai API key
  React.useEffect(() => {
    const togetherApiKey = 'tgp_v1_Sd31SxMcpt5_PYpRxWDOEU-r_ipmKpxoWTlgT1HmLI8';
    
    console.log('Setting Together.ai API key...');
    setApiKey(togetherApiKey);
  }, [setApiKey]);

  // Update connection status - always connected with the hardcoded API key
  React.useEffect(() => {
    const isValidKey = apiKey && apiKey.trim().length > 20 && apiKey.startsWith('tgp_v1_');
    setIsConnected(isValidKey);
    
    if (isValidKey) {
      console.log('Together.ai API key validated and connected');
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
      apiKeyValid: !!(apiKey && apiKey.trim().length > 20 && apiKey.startsWith('tgp_v1_')),
      user: user?.email,
      fullApiKey: apiKey
    });
  }, [model, maxTokens, temperature, systemPrompt, apiKey, user]);

  return <>{children}</>;
};
