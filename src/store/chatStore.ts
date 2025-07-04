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
  return trimmed.length > 20 && trimmed.startsWith('tgp_v1_');
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Sessions
      sessions: [],
      currentSessionId: '',
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
        
        console.log('Creating new session:', newSessionId, sanitizedTitle);
        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: newSessionId,
          messages: [],
          attachedFiles: []
        }));
        
        return newSessionId;
      },
      deleteSession: (sessionId) => {
        console.log('Deleting session:', sessionId);
        set((state) => {
          const newSessions = state.sessions.filter(s => s.id !== sessionId);
          let newCurrentSessionId = state.currentSessionId;
          let newMessages = state.messages;
          
          if (sessionId === state.currentSessionId) {
            if (newSessions.length > 0) {
              newCurrentSessionId = newSessions[0].id;
              newMessages = newSessions[0].messages;
            } else {
              // Create a new session if no sessions left
              const firstSessionId = generateSessionId();
              const firstSession: ChatSession = {
                id: firstSessionId,
                title: 'New Chat',
                createdAt: new Date(),
                updatedAt: new Date(),
                messages: []
              };
              newSessions.push(firstSession);
              newCurrentSessionId = firstSessionId;
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
        console.log('Switching to session:', sessionId);
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
        console.log('Updating session title:', sessionId, sanitizedTitle);
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
      setSessions: (sessions) => {
        console.log('Setting sessions:', sessions.length);
        set({ sessions });
      },
      
      // Messages
      messages: [],
      addMessage: (message) => {
        console.log('Adding message:', message.id, message.sender);
        set((state) => {
          const newMessages = [...state.messages, message];
          
          // Update session with new messages
          const updatedSessions = state.sessions.map(s => 
            s.id === state.currentSessionId
              ? { ...s, messages: newMessages, updatedAt: new Date() }
              : s
          );
          
          // Create session if it doesn't exist
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
        console.log('Clearing messages');
        set({ 
          messages: [],
          attachedFiles: []
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
      setMessages: (messages) => {
        console.log('Setting messages:', messages.length);
        set({ messages });
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
      
      // API Configuration with Together.ai validation
      apiKey: '',
      setApiKey: (key) => {
        const sanitizedKey = sanitizeInput(key);
        const isValid = validateApiKey(sanitizedKey);
        console.log('Setting API key, valid:', isValid);
        set({ 
          apiKey: sanitizedKey,
          isConnected: isValid
        });
      },
      validateApiKey: () => {
        const state = get();
        return validateApiKey(state.apiKey);
      },
      
      // Model Settings - default to Together.ai model
      model: 'meta-llama/Llama-3-8b-chat-hf',
      setModel: (model) => {
        const sanitizedModel = sanitizeInput(model);
        console.log('Setting model:', sanitizedModel);
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
