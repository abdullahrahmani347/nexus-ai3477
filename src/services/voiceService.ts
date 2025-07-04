
interface VoiceServiceCallbacks {
  onResult: (text: string) => void;
  onEnd: () => void;
  onError: (error: string) => void;
}

class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;

  constructor() {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  isSupported(): boolean {
    return !!(this.recognition || this.synthesis);
  }

  isSpeechRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  isSpeechSynthesisSupported(): boolean {
    return !!this.synthesis;
  }

  async startListening(callbacks: VoiceServiceCallbacks): Promise<void> {
    if (!this.recognition || this.isListening) {
      callbacks.onError('Speech recognition not available or already listening');
      return;
    }

    this.isListening = true;
    let finalTranscript = '';

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        callbacks.onResult(finalTranscript);
        finalTranscript = '';
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      callbacks.onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd();
    };

    try {
      this.recognition.start();
    } catch (error) {
      this.isListening = false;
      callbacks.onError('Failed to start speech recognition');
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}): Promise<void> {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not supported');
    }

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.synthesis!.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis!.speak(utterance);
    });
  }

  cancelSpeech(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }
}

export const voiceService = new VoiceService();
