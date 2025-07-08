
import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic, MicOff, X, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chatStore';
import { voiceService } from '@/services/voiceService';
import { FileService, FileData } from '@/services/fileService';

interface InputAreaProps {
  onSend: (message: string, files?: FileData[]) => void;
  disabled?: boolean;
  placeholder?: string;
  isGenerating?: boolean;
  onStop?: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
  isGenerating = false,
  onStop
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    attachedFiles, 
    addFiles, 
    removeFile, 
    clearFiles,
    voiceEnabled 
  } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || attachedFiles.length > 0) {
      onSend(input.trim(), attachedFiles);
      setInput('');
      clearFiles();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const processedFiles = await Promise.all(
        files.map(file => FileService.processFile(file))
      );
      addFiles(processedFiles);
    } catch (error) {
      console.error('Error processing files:', error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVoiceToggle = async () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      try {
        await voiceService.startListening({
          onResult: (text) => {
            setInput(prev => prev + (prev ? ' ' : '') + text);
          },
          onEnd: () => setIsListening(false),
          onError: (error) => {
            console.error('Voice recognition error:', error);
            setIsListening(false);
          }
        });
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        setIsListening(false);
      }
    }
  };

  const isVoiceSupported = voiceService.isSpeechRecognitionSupported();

  return (
    <div className="border-t bg-background p-4">
      {/* File Attachments */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachedFiles.map((file) => (
            <Badge key={file.id} variant="secondary" className="flex items-center gap-1 nexus-badge-neutral">
              {file.name}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.id)}
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="nexus-textarea min-h-[60px] resize-none pr-20"
            rows={1}
          />
          
          {/* Controls in textarea */}
          <div className="absolute right-2 bottom-2 flex gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.txt,.doc,.docx,.json,.md"
            />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 p-0 nexus-btn-tertiary"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {voiceEnabled && isVoiceSupported && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleVoiceToggle}
                className={`h-8 w-8 p-0 nexus-btn-tertiary ${isListening ? 'bg-red-100 text-red-600' : ''}`}
                disabled={disabled}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {isGenerating ? (
          <Button 
            type="button"
            onClick={onStop}
            variant="destructive"
            className="h-[60px] px-6"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            type="submit" 
            disabled={disabled || (!input.trim() && attachedFiles.length === 0)}
            className="h-[60px] px-6 nexus-btn-primary"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  );
};
