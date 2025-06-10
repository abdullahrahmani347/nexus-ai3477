
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '../components/MessageBubble';
import { FileData } from '../services/fileService';

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

interface ChatState {
  // Sessions
  sessions: ChatSession[];
  currentSessionId: string;
  createSession: (title?: string) => string;
  deleteSession: (sessionId: string) => void;
  switchSession: (sessionId: string) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  getCurrentSession: () => ChatSession | undefined;
  setSessions: (sessions: ChatSession[]) => void;
  
  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
  regenerateResponse: (fromMessageId: string) => void;
  setMessages: (messages: Message[]) => void;
  
  // File attachments
  attachedFiles: FileData[];
  addFiles: (files: FileData[]) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  
  // Streaming
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  streamingMessageId: string | null;
  setStreamingMessageId: (id: string | null) => void;
  
  // API Configuration
  apiKey: string;
  setApiKey: (key: string) => void;
  validateApiKey: () => boolean;
  
  // Model Settings
  model: string;
  setModel: (model: string) => void;
  maxTokens: number;
  setMaxTokens: (tokens: number) => void;
  temperature: number;
  setTemperature: (temp: number) => void;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  
  // UI Settings
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Voice settings
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  autoSpeak: boolean;
  setAutoSpeak: (enabled: boolean) => void;
  
  // Status
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

// Input validation utilities
const validateApiKey = (key: string): boolean => {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  return trimmed.length > 20 && trimmed.startsWith('AIza');
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Sessions
      sessions: [],
      currentSessionId: generateSessionId(),
      createSession: (title = 'New Chat') => {
        const sanitizedTitle = sanitizeInput(title);
        const newSessionId = generateSessionId();
        const newSession: ChatSession = {
          id: newSessionId,
          title: sanitizedTitle,
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: []
        };
        
        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: newSessionId,
          messages: [],
          attachedFiles: []
        }));
        
        return newSessionId;
      },
      deleteSession: (sessionId) => {
        set((state) => {
          const newSessions = state.sessions.filter(s => s.id !== sessionId);
          let newCurrentSessionId = state.currentSessionId;
          let newMessages = state.messages;
          
          if (sessionId === state.currentSessionId) {
            if (newSessions.length > 0) {
              newCurrentSessionId = newSessions[0].id;
              newMessages = newSessions[0].messages;
            } else {
              newCurrentSessionId = generateSessionId();
              newMessages = [];
            }
          }
          
          return {
            sessions: newSessions,
            currentSessionId: newCurrentSessionId,
            messages: newMessages,
            attachedFiles: []
          };
        });
      },
      switchSession: (sessionId) => {
        const state = get();
        const session = state.sessions.find(s => s.id === sessionId);
        if (session) {
          set({
            currentSessionId: sessionId,
            messages: session.messages,
            attachedFiles: []
          });
        }
      },
      updateSessionTitle: (sessionId, title) => {
        const sanitizedTitle = sanitizeInput(title);
        set((state) => ({
          sessions: state.sessions.map(s => 
            s.id === sessionId 
              ? { ...s, title: sanitizedTitle, updatedAt: new Date() }
              : s
          )
        }));
      },
      getCurrentSession: () => {
        const state = get();
        return state.sessions.find(s => s.id === state.currentSessionId);
      },
      setSessions: (sessions) => set({ sessions }),
      
      // Messages
      messages: [],
      addMessage: (message) => {
        set((state) => {
          const newMessages = [...state.messages, message];
          
          const updatedSessions = state.sessions.map(s => 
            s.id === state.currentSessionId
              ? { ...s, messages: newMessages, updatedAt: new Date() }
              : s
          );
          
          if (!updatedSessions.find(s => s.id === state.currentSessionId)) {
            const firstUserMessage = newMessages.find(m => m.sender === 'user');
            const title = firstUserMessage ? 
              sanitizeInput(firstUserMessage.text.slice(0, 50) + (firstUserMessage.text.length > 50 ? '...' : '')) :
              'New Chat';
              
            const newSession: ChatSession = {
              id: state.currentSessionId,
              title,
              createdAt: new Date(),
              updatedAt: new Date(),
              messages: newMessages
            };
            updatedSessions.push(newSession);
          }
          
          return { 
            messages: newMessages,
            sessions: updatedSessions
          };
        });
      },
      updateMessage: (id, updates) => set((state) => {
        const newMessages = state.messages.map(msg => 
          msg.id === id ? { ...msg, ...updates } : msg
        );
        
        const updatedSessions = state.sessions.map(s => 
          s.id === state.currentSessionId
            ? { ...s, messages: newMessages, updatedAt: new Date() }
            : s
        );
        
        return {
          messages: newMessages,
          sessions: updatedSessions
        };
      }),
      deleteMessage: (id) => set((state) => {
        const newMessages = state.messages.filter(msg => msg.id !== id);
        
        const updatedSessions = state.sessions.map(s => 
          s.id === state.currentSessionId
            ? { ...s, messages: newMessages, updatedAt: new Date() }
            : s
        );
        
        return {
          messages: newMessages,
          sessions: updatedSessions
        };
      }),
      clearMessages: () => {
        const newSessionId = generateSessionId();
        set({ 
          messages: [],
          attachedFiles: [],
          currentSessionId: newSessionId
        });
      },
      regenerateResponse: (fromMessageId) => {
        const state = get();
        const messageIndex = state.messages.findIndex(msg => msg.id === fromMessageId);
        if (messageIndex !== -1) {
          const newMessages = state.messages.slice(0, messageIndex + 1);
          set({ messages: newMessages });
        }
      },
      setMessages: (messages) => set({ messages }),
      
      // File attachments
      attachedFiles: [],
      addFiles: (files) => set((state) => ({
        attachedFiles: [...state.attachedFiles, ...files]
      })),
      removeFile: (fileId) => set((state) => ({
        attachedFiles: state.attachedFiles.filter(f => f.id !== fileId)
      })),
      clearFiles: () => set({ attachedFiles: [] }),
      
      // Streaming
      isStreaming: false,
      setIsStreaming: (streaming) => set({ isStreaming: streaming }),
      streamingMessageId: null,
      setStreamingMessageId: (id) => set({ streamingMessageId: id }),
      
      // API Configuration with proper validation
      apiKey: '',
      setApiKey: (key) => {
        const sanitizedKey = sanitizeInput(key);
        const isValid = validateApiKey(sanitizedKey);
        
        set({ 
          apiKey: sanitizedKey,
          isConnected: isValid
        });
      },
      validateApiKey: () => {
        const state = get();
        return validateApiKey(state.apiKey);
      },
      
      // Model Settings with validation
      model: 'gemini-2.0-flash',
      setModel: (model) => {
        const sanitizedModel = sanitizeInput(model);
        set({ model: sanitizedModel });
      },
      maxTokens: 2048,
      setMaxTokens: (tokens) => {
        const validTokens = Math.max(1, Math.min(tokens, 8192));
        set({ maxTokens: validTokens });
      },
      temperature: 0.7,
      setTemperature: (temp) => {
        const validTemp = Math.max(0, Math.min(temp, 2));
        set({ temperature: validTemp });
      },
      systemPrompt: 'You are a helpful AI assistant. Be concise, accurate, and friendly in your responses.',
      setSystemPrompt: (prompt) => {
        const sanitizedPrompt = sanitizeInput(prompt);
        set({ systemPrompt: sanitizedPrompt });
      },
      
      // UI Settings
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      // Voice settings
      voiceEnabled: false,
      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
      autoSpeak: false,
      setAutoSpeak: (enabled) => set({ autoSpeak: enabled }),
      
      // Status
      isConnected: false,
      setIsConnected: (connected) => set({ isConnected: connected }),
    }),
    {
      name: 'nexus-chat-storage',
      partialize: (state) => ({
        currentSessionId: state.currentSessionId,
        apiKey: state.apiKey,
        model: state.model,
        maxTokens: state.maxTokens,
        temperature: state.temperature,
        systemPrompt: state.systemPrompt,
        theme: state.theme,
        voiceEnabled: state.voiceEnabled,
        autoSpeak: state.autoSpeak,
      }),
    }
  )
);

function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
