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
  
  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
  regenerateResponse: (fromMessageId: string) => void;
  
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

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Sessions
      sessions: [],
      currentSessionId: generateSessionId(),
      createSession: (title = 'New Chat') => {
        const newSessionId = generateSessionId();
        const newSession: ChatSession = {
          id: newSessionId,
          title,
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
        set((state) => ({
          sessions: state.sessions.map(s => 
            s.id === sessionId 
              ? { ...s, title, updatedAt: new Date() }
              : s
          )
        }));
      },
      getCurrentSession: () => {
        const state = get();
        return state.sessions.find(s => s.id === state.currentSessionId);
      },
      
      // Messages
      messages: [],
      addMessage: (message) => {
        set((state) => {
          const newMessages = [...state.messages, message];
          
          // Update current session
          const updatedSessions = state.sessions.map(s => 
            s.id === state.currentSessionId
              ? { ...s, messages: newMessages, updatedAt: new Date() }
              : s
          );
          
          // If no session exists, create one
          if (!updatedSessions.find(s => s.id === state.currentSessionId)) {
            const newSession: ChatSession = {
              id: state.currentSessionId,
              title: message.text.slice(0, 50) + (message.text.length > 50 ? '...' : ''),
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
      
      // UI Settings
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      // Voice settings
      voiceEnabled: false,
      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
      autoSpeak: false,
      setAutoSpeak: (enabled) => set({ autoSpeak: enabled }),
      
      // Status
      isConnected: true,
      setIsConnected: (connected) => set({ isConnected: connected }),
    }),
    {
      name: 'gemini-chat-storage',
      partialize: (state) => ({
        sessions: state.sessions,
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
