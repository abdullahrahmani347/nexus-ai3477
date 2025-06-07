
import React, { useState, useCallback, useMemo } from 'react';
import { Settings, BarChart3, Download, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatInterface from './ChatInterface';
import { Message } from './MessageBubble';
import { useChatStore } from '@/store/chatStore';

interface ChatManagerProps {
  className?: string;
}

export const ChatManager: React.FC<ChatManagerProps> = ({ className = '' }) => {
  const { messages } = useChatStore();
  const [activeTab, setActiveTab] = useState('chat');

  // Memoized chat interface to prevent unnecessary re-renders
  const chatInterface = useMemo(() => (
    <ChatInterface />
  ), []);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-1 bg-black/20 border-white/10">
          <TabsTrigger 
            value="chat" 
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
          >
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 mt-0">
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Chat Interface</h3>
              </div>
            </div>
            
            {/* Chat Interface */}
            <div className="flex-1">
              {chatInterface}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
