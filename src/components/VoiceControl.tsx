
import React, { useState, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { voiceService } from '@/services/voiceService';
import { toast } from 'sonner';

interface VoiceControlProps {
  onVoiceInput: (text: string) => void;
  disabled?: boolean;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({
  onVoiceInput,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);

  const handleStartListening = useCallback(async () => {
    if (!voiceService.isSpeechRecognitionSupported()) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    try {
      setIsListening(true);
      await voiceService.startListening({
        onResult: (text: string) => {
          onVoiceInput(text);
        },
        onEnd: () => {
          setIsListening(false);
        },
        onError: (error: string) => {
          toast.error(`Voice recognition error: ${error}`);
          setIsListening(false);
        }
      });
    } catch (error) {
      toast.error('Failed to start voice recognition');
      setIsListening(false);
    }
  }, [onVoiceInput]);

  const handleStopListening = useCallback(() => {
    voiceService.stopListening();
    setIsListening(false);
  }, []);

  if (!voiceService.isSpeechRecognitionSupported()) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={isListening ? handleStopListening : handleStartListening}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        {isListening ? 'Stop Listening' : 'Start Voice Input'}
      </Button>
      
      {isListening && (
        <span className="text-sm text-muted-foreground animate-pulse">
          Listening...
        </span>
      )}
    </div>
  );
};
