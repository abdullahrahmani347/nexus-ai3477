
import React, { useState } from 'react';
import { X, Key, Settings, Info, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useChatStore } from '../store/chatStore';
import { voiceService } from '../services/voiceService';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { 
    apiKey, 
    setApiKey, 
    model, 
    setModel,
    maxTokens,
    setMaxTokens,
    temperature,
    setTemperature,
    systemPrompt,
    setSystemPrompt,
    voiceEnabled,
    setVoiceEnabled,
    autoSpeak,
    setAutoSpeak
  } = useChatStore();

  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
  };

  const models = [
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Recommended)' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  ];

  const isVoiceSupported = voiceService.isSupported();

  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Settings</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* API Configuration */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-blue-600" />
            <h3 className="font-medium text-gray-800 dark:text-gray-200">API Configuration</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Gemini API Key
              </Label>
              <div className="mt-1 flex space-x-2">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </Button>
              </div>
              <div className="mt-2 flex space-x-2">
                <Button 
                  onClick={handleSaveApiKey}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!tempApiKey.trim()}
                >
                  Save Key
                </Button>
                {apiKey && (
                  <span className="text-xs text-green-600 flex items-center">
                    ✓ Key configured
                  </span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="model" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Model
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Voice Settings */}
        {isVoiceSupported && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-purple-600" />
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Voice Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Voice Features
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Voice input and text-to-speech
                  </p>
                </div>
                <Switch
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                />
              </div>

              {voiceEnabled && (
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Auto-speak Responses
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Automatically read AI responses aloud
                    </p>
                  </div>
                  <Switch
                    checked={autoSpeak}
                    onCheckedChange={setAutoSpeak}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Model Parameters */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Model Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Max Tokens
                </Label>
                <span className="text-sm text-gray-500">{maxTokens}</span>
              </div>
              <Slider
                value={[maxTokens]}
                onValueChange={(value) => setMaxTokens(value[0])}
                min={100}
                max={8192}
                step={100}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of tokens in the response
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Temperature
                </Label>
                <span className="text-sm text-gray-500">{temperature}</span>
              </div>
              <Slider
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Controls randomness: 0 = focused, 2 = creative
              </p>
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">System Prompt</h3>
          <div>
            <Label htmlFor="systemPrompt" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Instructions
            </Label>
            <textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter custom instructions for the AI..."
              className="mt-1 w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              These instructions will be included in every conversation
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">Getting Started</p>
              <p className="text-blue-700 dark:text-blue-300">
                Get your free Gemini API key from Google AI Studio. 
                The key is stored locally in your browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
