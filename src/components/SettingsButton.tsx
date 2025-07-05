
import React, { useState } from 'react';
import { Settings, Palette, Volume2, Zap, Monitor, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useChatStore } from '@/store/chatStore';
import { useTheme } from '@/components/ThemeProvider';
import { ModelSelector } from '@/components/ModelSelector';
import { toast } from 'sonner';

export const SettingsButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const {
    model,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 rounded-xl"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            Settings & Configuration
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Configure your AI experience and platform settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="model" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="model" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/30 data-[state=active]:to-blue-500/30">
              <Cpu className="w-4 h-4 mr-2" />
              AI Models
            </TabsTrigger>
            <TabsTrigger value="voice" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/30 data-[state=active]:to-blue-500/30">
              <Volume2 className="w-4 h-4 mr-2" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/30 data-[state=active]:to-blue-500/30">
              <Zap className="w-4 h-4 mr-2" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="theme" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/30 data-[state=active]:to-blue-500/30">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </TabsTrigger>
          </TabsList>

          <TabsContent value="model" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">AI Model Selection</h3>
              </div>
              <ModelSelector />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Voice Settings</h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <Label className="text-sm font-medium text-white">Enable Voice Features</Label>
                  <p className="text-xs text-gray-400 mt-1">Voice input and text-to-speech</p>
                </div>
                <Switch
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                />
              </div>

              {voiceEnabled && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <Label className="text-sm font-medium text-white">Auto-speak Responses</Label>
                      <p className="text-xs text-gray-400 mt-1">Automatically read AI responses aloud</p>
                    </div>
                    <Switch
                      checked={autoSpeak}
                      onCheckedChange={setAutoSpeak}
                    />
                  </div>

                  <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium text-white">Speech Rate</Label>
                        <span className="text-sm text-purple-400">{speechRate}x</span>
                      </div>
                      <Slider
                        value={[speechRate]}
                        onValueChange={(value) => setSpeechRate(value[0])}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium text-white">Volume</Label>
                        <span className="text-sm text-purple-400">{Math.round(speechVolume * 100)}%</span>
                      </div>
                      <Slider
                        value={[speechVolume]}
                        onValueChange={(value) => setSpeechVolume(value[0])}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Advanced Parameters</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-white">Temperature</Label>
                    <span className="text-sm text-purple-400">{temperature}</span>
                  </div>
                  <Slider
                    value={[temperature]}
                    onValueChange={(value) => setTemperature(value[0])}
                    min={0}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Higher values make responses more creative, lower values more consistent
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-white">Max Tokens</Label>
                    <span className="text-sm text-purple-400">{maxTokens}</span>
                  </div>
                  <Slider
                    value={[maxTokens]}
                    onValueChange={(value) => setMaxTokens(value[0])}
                    min={256}
                    max={4096}
                    step={256}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Maximum number of tokens in the response
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">System Prompt</Label>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-gray-400 resize-none focus:border-purple-500 transition-colors"
                    placeholder="Enter custom system instructions..."
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                  />
                  <p className="text-xs text-gray-400">
                    Custom instructions that will be included in every conversation
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Appearance</h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <Label className="text-sm font-medium text-white">Dark Mode</Label>
                  <p className="text-xs text-gray-400 mt-1">Toggle between light and dark themes</p>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">Theme Preview</span>
                </div>
                <p className="text-xs text-white/70">
                  Experience the premium Nexus AI interface with advanced gradient themes and glassmorphism effects.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
