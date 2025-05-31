
export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionConstructor();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  isSupported(): boolean {
    return this.recognition !== null && 'speechSynthesis' in window;
  }

  startListening(onResult: (text: string) => void, onError?: (error: string) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        const error = 'Speech recognition not supported';
        onError?.(error);
        reject(new Error(error));
        return;
      }

      if (this.isListening) {
        resolve();
        return;
      }

      this.isListening = true;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        this.isListening = false;
        resolve();
      };

      this.recognition.onerror = (event) => {
        const error = `Speech recognition error: ${event.error}`;
        onError?.(error);
        this.isListening = false;
        reject(new Error(error));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string, onEnd?: () => void): void {
    if (!('speechSynthesis' in window)) return;

    // Stop any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synthesis.speak(utterance);
  }

  stopSpeaking(): void {
    this.synthesis.cancel();
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceService = new VoiceService();
