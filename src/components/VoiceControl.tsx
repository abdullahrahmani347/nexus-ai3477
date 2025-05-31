
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { voiceService } from '../services/voiceService';

interface VoiceControlProps {
  onVoiceInput: (text: string) => void;
  onSpeakResponse: (speakFn: (text: string) => void) => void;
  disabled?: boolean;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  onVoiceInput,
  onSpeakResponse,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(voiceService.isSupported());
  }, []);

  const handleStartListening = async () => {
    if (disabled || isListening) return;

    try {
      setIsListening(true);
      await voiceService.startListening(
        (text) => {
          console.log('Voice input received:', text);
          onVoiceInput(text);
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
    if (disabled || !text.trim()) return;

    setIsSpeaking(true);
    voiceService.speak(text, () => {
      setIsSpeaking(false);
    });
  };

  const handleStopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  };

  useEffect(() => {
    onSpeakResponse(handleSpeak);
  }, [onSpeakResponse]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={isListening ? handleStopListening : handleStartListening}
        disabled={disabled}
        className={`${
          isListening 
            ? 'text-red-600 bg-red-50 hover:bg-red-100' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={isSpeaking ? handleStopSpeaking : () => {}}
        disabled={disabled || !isSpeaking}
        className={`${
          isSpeaking 
            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
        title={isSpeaking ? 'Stop speaking' : 'Text-to-speech'}
      >
        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default VoiceControl;
