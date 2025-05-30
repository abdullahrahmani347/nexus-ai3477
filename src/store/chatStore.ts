
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '../components/MessageBubble';

interface ChatState {
  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  
  // API Configuration
  apiKey: string;
  setApiKey: (key: string) => void;
  
  // Model Settings
  model: string;
  setModel: (model: string) => void;
  maxTokens: number;
  setMaxTokens: (tokens: number) => void;
  temperature: number;
  setTemperature: (temp: number) => void;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  
  // Session
  sessionId: string;
  newSession: () => void;
  
  // Status
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Messages
      messages: [],
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
      })),
      clearMessages: () => set({ 
        messages: [],
        sessionId: generateSessionId()
      }),
      
      // API Configuration
      apiKey: 'AIzaSyChoxttA3sTyJ0uprxEug5cZnxSQcz054c',
      setApiKey: (key) => set({ 
        apiKey: key,
        isConnected: !!key.trim()
      }),
      
      // Model Settings
      model: 'gemini-2.0-flash',
      setModel: (model) => set({ model }),
      maxTokens: 2048,
      setMaxTokens: (tokens) => set({ maxTokens: tokens }),
      temperature: 0.7,
      setTemperature: (temp) => set({ temperature: temp }),
      systemPrompt: 'You are a helpful AI assistant. Be concise, accurate, and friendly in your responses.',
      setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
      
      // Session
      sessionId: generateSessionId(),
      newSession: () => set({ 
        messages: [],
        sessionId: generateSessionId()
      }),
      
      // Status
      isConnected: true,
      setIsConnected: (connected) => set({ isConnected: connected }),
    }),
    {
      name: 'gemini-chat-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        model: state.model,
        maxTokens: state.maxTokens,
        temperature: state.temperature,
        systemPrompt: state.systemPrompt,
      }),
    }
  )
);

function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
