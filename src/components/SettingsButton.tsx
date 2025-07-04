import React, { useState } from 'react';
import { Settings, Key, Palette, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChatStore } from '@/store/chatStore';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'sonner';

export const SettingsButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const {
    apiKey,
    setApiKey,
    model,
    setModel,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    systemPrompt,
    setSystemPrompt,
    voiceEnabled,
    setVoiceEnabled,
    autoSpeak,
    setAutoSpeak,
    speechRate,
    setSpeechRate,
    speechVolume,
    setSpeechVolume
  } = useChatStore();

  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    toast.success('API key saved successfully');
  };

  const availableModels = [
    'meta-llama/Llama-3-8b-chat-hf',
    'meta-llama/Llama-3-70b-chat-hf',
    'mistralai/Mixtral-8x7B-Instruct-v0.1',
    'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
    'openchat/openchat-3.5-1210'
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="nexus-transition">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="nexus-text-gradient">Settings</DialogTitle>
          <DialogDescription>
            Configure your chat experience and AI settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="model">Model</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-semibold">API Configuration</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">Together AI API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your Together AI API key"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Get your API key from{' '}
                  <a 
                    href="https://api.together.xyz/settings/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Together AI Dashboard
                  </a>
                </p>
              </div>

              <Button onClick={handleSaveApiKey} className="w-full nexus-button">
                Save API Key
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="model" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Model Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="model-select">AI Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((modelName) => (
                      <SelectItem key={modelName} value={modelName}>
                        {modelName.split('/')[1] || modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature: {temperature}</Label>
                <Slider
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Higher values make responses more creative, lower values more consistent
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
                <Slider
                  id="max-tokens"
                  min={256}
                  max={4096}
                  step={256}
                  value={[maxTokens]}
                  onValueChange={(value) => setMaxTokens(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <textarea
                  id="system-prompt"
                  className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm rounded-md"
                  placeholder="Enter system prompt..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-semibold">Voice Settings</h3>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="voice-enabled">Enable Voice Features</Label>
                <Switch
                  id="voice-enabled"
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                />
              </div>

              {voiceEnabled && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-speak">Auto-speak Responses</Label>
                    <Switch
                      id="auto-speak"
                      checked={autoSpeak}
                      onCheckedChange={setAutoSpeak}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="speech-rate">Speech Rate: {speechRate}x</Label>
                    <Slider
                      id="speech-rate"
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={[speechRate]}
                      onValueChange={(value) => setSpeechRate(value[0])}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="speech-volume">Volume: {Math.round(speechVolume * 100)}%</Label>
                    <Slider
                      id="speech-volume"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[speechVolume]}
                      onValueChange={(value) => setSpeechVolume(value[0])}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-semibold">Appearance</h3>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};