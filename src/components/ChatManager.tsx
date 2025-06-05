
import React, { useState, useCallback, useMemo } from 'react';
import { Search, Settings, BarChart3, Download, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatInterface from './ChatInterface';
import { ConversationSearch } from './advanced/ConversationSearch';
import { EnhancedConversationExport } from './advanced/EnhancedConversationExport';
import { AdvancedVoiceControl } from './advanced/AdvancedVoiceControl';
import { ConversationTemplates } from './advanced/ConversationTemplates';
import { PerformanceOptimization } from './api/PerformanceOptimization';
import { Message } from './MessageBubble';
import { useChatStore } from '@/store/chatStore';

interface ChatManagerProps {
  className?: string;
}

export const ChatManager: React.FC<ChatManagerProps> = ({ className = '' }) => {
  const { messages, addMessage } = useChatStore();
  const [activeTab, setActiveTab] = useState('chat');
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Memoized chat interface to prevent unnecessary re-renders
  const chatInterface = useMemo(() => (
    <ChatInterface 
      className="h-full"
    />
  ), []);

  // Handle search results
  const handleSearchResults = useCallback((results: Message[]) => {
    setSearchResults(results);
    setIsSearchActive(results.length < messages.length);
  }, [messages.length]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setIsSearchActive(false);
  }, []);

  // Handle template selection
  const handleSelectTemplate = useCallback((template: any) => {
    const templateMessage = {
      id: Date.now().toString(),
      text: template.content,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    addMessage(templateMessage);
    setActiveTab('chat');
  }, [addMessage]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-5 bg-black/20 border-white/10">
          <TabsTrigger 
            value="chat" 
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="search"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
          >
            <Search className="w-4 h-4 mr-1" />
            Search
          </TabsTrigger>
          <TabsTrigger 
            value="voice"
            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300"
          >
            Voice
          </TabsTrigger>
          <TabsTrigger 
            value="templates"
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger 
            value="performance"
            className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300"
          >
            <Zap className="w-4 h-4 mr-1" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 mt-0">
          <div className="h-full flex flex-col">
            {/* Chat Header with Actions */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Chat Interface</h3>
                {isSearchActive && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-yellow-400">
                      Showing {searchResults.length} filtered messages
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      Clear Filter
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <EnhancedConversationExport />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('search')}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Chat Interface */}
            <div className="flex-1">
              {chatInterface}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search" className="flex-1 mt-0">
          <div className="h-full p-6 space-y-6">
            <ConversationSearch
              onResultsChange={handleSearchResults}
              className="mb-6"
            />
            
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">
                    Search Results ({searchResults.length})
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('chat')}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    View in Chat
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto nexus-scrollbar">
                  {searchResults.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 bg-black/20 border border-white/10 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${
                          message.sender === 'user' ? 'text-blue-400' : 'text-purple-400'
                        }`}>
                          {message.sender === 'user' ? 'You' : 'Nexus AI'}
                        </span>
                        <span className="text-xs text-white/60">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white/90 text-sm">{message.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="voice" className="flex-1 mt-0">
          <div className="h-full p-6">
            <AdvancedVoiceControl />
          </div>
        </TabsContent>

        <TabsContent value="templates" className="flex-1 mt-0">
          <div className="h-full p-6">
            <ConversationTemplates onSelectTemplate={handleSelectTemplate} />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="flex-1 mt-0">
          <div className="h-full p-6 nexus-scrollbar">
            <PerformanceOptimization />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
