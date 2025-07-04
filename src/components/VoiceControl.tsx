
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { voiceService } from '@/services/voiceService';
import { useChatStore } from '@/store/chatStore';

interface VoiceControlProps {
  onVoiceInput?: (text: string) => void;
  onSpeakResponse?: (speakFn: (text: string) => void) => void;
  disabled?: boolean;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({ 
  onVoiceInput, 
  onSpeakResponse,
  disabled = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const { voiceEnabled, setVoiceEnabled, autoSpeak, setAutoSpeak } = useChatStore();

  const handleStartListening = async () => {
    if (!voiceService.isSpeechRecognitionSupported() || disabled) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening(true);
    try {
      await voiceService.startListening({
        onResult: (text) => {
          onVoiceInput?.(text);
        },
        onEnd: () => {
          setIsListening(false);
        },
        onError: (error) => {
          console.error('Voice recognition error:', error);
          setIsListening(false);
        }
      });
    } catch (error) {
      console.error('Failed to start listening:', error);
      setIsListening(false);
    }
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const handleSpeak = async (text: string) => {
    if (!voiceService.isSpeechSynthesisSupported()) {
      console.warn('Speech synthesis not supported');
      return;
    }

    try {
      setIsSpeaking(true);
      await voiceService.speak(text, { rate: speechRate, volume });
    } catch (error) {
      console.error('Speech synthesis error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleStopSpeaking = () => {
    voiceService.cancelSpeech();
    setIsSpeaking(false);
  };

  // Provide speak function to parent
  useEffect(() => {
    if (onSpeakResponse) {
      onSpeakResponse(handleSpeak);
    }
  }, [onSpeakResponse, speechRate, volume]);

  if (!voiceService.isSupported()) {
    return null;
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Voice Controls</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={voiceEnabled ? 'text-green-600' : 'text-gray-400'}
          disabled={disabled}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
      </div>

      {voiceEnabled && (
        <>
          <div className="flex items-center gap-2">
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              onClick={isListening ? handleStopListening : handleStartListening}
              disabled={!voiceService.isSpeechRecognitionSupported() || disabled}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? 'Stop' : 'Listen'}
            </Button>

            {isSpeaking && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStopSpeaking}
                disabled={disabled}
              >
                Stop Speaking
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Speech Rate</label>
              <Slider
                value={[speechRate]}
                onValueChange={(value) => setSpeechRate(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
                disabled={disabled}
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Volume</label>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
                disabled={disabled}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoSpeak"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="rounded"
                disabled={disabled}
              />
              <label htmlFor="autoSpeak" className="text-xs text-gray-600">
                Auto-speak AI responses
              </label>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
