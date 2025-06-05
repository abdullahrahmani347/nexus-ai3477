
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChatStore } from '@/store/chatStore';
import { voiceService } from '@/services/voiceService';

interface VoiceSettings {
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  voice: string;
  autoSpeak: boolean;
  backgroundListening: boolean;
}

interface AdvancedVoiceControlProps {
  onVoiceInput?: (text: string) => void;
  disabled?: boolean;
}

export const AdvancedVoiceControl: React.FC<AdvancedVoiceControlProps> = ({
  onVoiceInput,
  disabled = false
}) => {
  const { voiceEnabled, setVoiceEnabled, autoSpeak, setAutoSpeak } = useChatStore();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>({
    speechRate: 1,
    speechPitch: 1,
    speechVolume: 1,
    voice: '',
    autoSpeak: false,
    backgroundListening: false
  });
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !settings.voice) {
        setSettings(prev => ({ ...prev, voice: voices[0].name }));
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Handle recording timer
  useEffect(() => {
    if (isListening) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isListening]);

  const handleStartListening = async () => {
    if (!voiceEnabled || isListening) return;

    try {
      setIsListening(true);
      await voiceService.startListening(
        (text) => {
          console.log('Voice input received:', text);
          onVoiceInput?.(text);
          setIsListening(false);
        },
        (error) => {
          console.error('Voice recognition error:', error);
          setIsListening(false);
        }
      );
    } catch (error) {
      console.error('Failed to start listening:', error);
      setIsListening(false);
    }
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const handleSpeak = (text: string) => {
    if (!voiceEnabled || !text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice settings
    utterance.rate = settings.speechRate;
    utterance.pitch = settings.speechPitch;
    utterance.volume = settings.speechVolume;
    
    const selectedVoice = availableVoices.find(voice => voice.name === settings.voice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
  };

  const handlePauseResume = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!voiceService.isSupported()) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Main Voice Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setVoiceEnabled(!voiceEnabled)}
        className={`${
          voiceEnabled 
            ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20' 
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        title="Toggle voice features"
      >
        {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>

      {voiceEnabled && (
        <>
          {/* Recording Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={isListening ? handleStopListening : handleStartListening}
              disabled={disabled}
              className={`${
                isListening 
                  ? 'text-red-400 bg-red-400/10 hover:bg-red-400/20 animate-pulse' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title={isListening ? 'Stop recording' : 'Start voice input'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            {isListening && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-red-500/20 text-red-300 text-xs px-1 animate-pulse"
              >
                {formatTime(recordingTime)}
              </Badge>
            )}
          </div>

          {/* Speech Controls */}
          {isSpeaking && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePauseResume}
                className="text-white/70 hover:text-white hover:bg-white/10"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStop}
                className="text-white/70 hover:text-white hover:bg-white/10"
                title="Stop speaking"
              >
                <SkipForward className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Voice Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
                title="Voice settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-black/90 backdrop-blur-xl border-white/20" align="end">
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Voice Settings</h4>
                
                {/* Voice Selection */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Voice</label>
                  <Select value={settings.voice} onValueChange={(value) => setSettings(prev => ({ ...prev, voice: value }))}>
                    <SelectTrigger className="bg-black/20 border-white/20 text-white">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      {availableVoices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name} className="text-white">
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Speech Rate */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Speech Rate: {settings.speechRate.toFixed(1)}x</label>
                  <Slider
                    value={[settings.speechRate]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, speechRate: value[0] }))}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Speech Pitch */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Pitch: {settings.speechPitch.toFixed(1)}</label>
                  <Slider
                    value={[settings.speechPitch]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, speechPitch: value[0] }))}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Volume */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Volume: {Math.round(settings.speechVolume * 100)}%</label>
                  <Slider
                    value={[settings.speechVolume]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, speechVolume: value[0] }))}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Auto-speak Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoSpeak"
                    checked={autoSpeak}
                    onChange={(e) => setAutoSpeak(e.target.checked)}
                    className="rounded bg-white/10 border-white/20"
                  />
                  <label htmlFor="autoSpeak" className="text-sm text-white/90">
                    Auto-speak AI responses
                  </label>
                </div>

                {/* Test Voice */}
                <Button
                  onClick={() => handleSpeak("Hello! This is a test of the voice settings.")}
                  className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
                  size="sm"
                >
                  Test Voice
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Status Indicators */}
          <div className="flex gap-1">
            {autoSpeak && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                Auto
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs animate-pulse">
                Speaking
              </Badge>
            )}
          </div>
        </>
      )}
    </div>
  );
};
