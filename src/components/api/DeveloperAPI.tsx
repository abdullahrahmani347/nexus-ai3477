
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code, Key, BookOpen, Settings, Download, Search, 
  MessageSquare, Puzzle, TestTube, AlertTriangle, Zap,
  PlayCircle, Database, Webhook, Shield, BarChart3, FileText
} from 'lucide-react';
import { ConversationSearch } from './ConversationSearch';
import { MessageReactions } from './MessageReactions';
import { ExportOptions } from './ExportOptions';
import { PluginSystem } from './PluginSystem';
import { TestingSuite } from './TestingSuite';
import { ErrorMonitoring } from './ErrorMonitoring';
import { PerformanceOptimization } from './PerformanceOptimization';

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  params?: string[];
}

const API_ENDPOINTS: APIEndpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/conversations',
    description: 'Create a new conversation',
    params: ['title', 'model', 'system_prompt']
  },
  {
    method: 'GET',
    path: '/api/v1/conversations',
    description: 'List all conversations',
    params: ['limit', 'offset', 'filter']
  },
  {
    method: 'POST',
    path: '/api/v1/conversations/{id}/messages',
    description: 'Send a message to a conversation',
    params: ['message', 'attachments', 'stream']
  },
  {
    method: 'GET',
    path: '/api/v1/conversations/{id}/messages',
    description: 'Get conversation messages',
    params: ['limit', 'before', 'after']
  },
  {
    method: 'DELETE',
    path: '/api/v1/conversations/{id}',
    description: 'Delete a conversation',
    params: []
  }
];

export const DeveloperAPI: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [messageReactions, setMessageReactions] = useState<Record<string, any>>({});

  const handleReaction = (messageId: string, emoji: string) => {
    setMessageReactions(prev => {
      const existing = prev[messageId] || {};
      const reaction = existing[emoji] || { count: 0, users: [], hasReacted: false };
      
      return {
        ...prev,
        [messageId]: {
          ...existing,
          [emoji]: {
            ...reaction,
            count: reaction.hasReacted ? reaction.count - 1 : reaction.count + 1,
            hasReacted: !reaction.hasReacted
          }
        }
      };
    });
  };

  return (
    <div className="h-full space-y-6">
      {/* API Overview Header */}
      <div className="nexus-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Nexus AI Developer API</h2>
              <p className="text-white/60">Build powerful AI applications with our comprehensive API</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              v2.1.0
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              RESTful
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="nexus-card p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">15+</div>
            <div className="text-sm text-white/60">Endpoints</div>
          </div>
          <div className="nexus-card p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">99.9%</div>
            <div className="text-sm text-white/60">Uptime</div>
          </div>
          <div className="nexus-card p-4 text-center">
            <div className="text-2xl font-bold text-green-400">~200ms</div>
            <div className="text-sm text-white/60">Avg Response</div>
          </div>
          <div className="nexus-card p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">10K+</div>
            <div className="text-sm text-white/60">Requests/Day</div>
          </div>
        </div>
      </div>

      {/* Main API Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-1 bg-white/5 p-1 rounded-lg">
          <TabsTrigger value="overview" className="flex items-center gap-2 text-xs">
            <BookOpen className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2 text-xs">
            <Search className="w-4 h-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="reactions" className="flex items-center gap-2 text-xs">
            <MessageSquare className="w-4 h-4" />
            Reactions
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2 text-xs">
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
          <TabsTrigger value="plugins" className="flex items-center gap-2 text-xs">
            <Puzzle className="w-4 h-4" />
            Plugins
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2 text-xs">
            <TestTube className="w-4 h-4" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2 text-xs">
            <Zap className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* API Endpoints */}
          <Card className="nexus-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">API Endpoints</h3>
            <div className="space-y-3">
              {API_ENDPOINTS.map((endpoint, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${endpoint.method === 'GET' ? 'border-green-500/30 text-green-300' : ''}
                        ${endpoint.method === 'POST' ? 'border-blue-500/30 text-blue-300' : ''}
                        ${endpoint.method === 'DELETE' ? 'border-red-500/30 text-red-300' : ''}
                      `}
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-purple-300 bg-purple-500/20 px-2 py-1 rounded text-sm">
                      {endpoint.path}
                    </code>
                  </div>
                  <p className="text-white/70 text-sm mb-2">{endpoint.description}</p>
                  {endpoint.params && endpoint.params.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {endpoint.params.map(param => (
                        <Badge key={param} variant="secondary" className="text-xs bg-white/10 text-white/60">
                          {param}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Authentication */}
          <Card className="nexus-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Authentication</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="font-medium text-green-300 mb-2">API Key Authentication</div>
                <p className="text-white/70 text-sm mb-3">
                  Include your API key in the Authorization header for all requests.
                </p>
                <code className="block bg-black/20 p-3 rounded text-sm text-purple-300">
                  Authorization: Bearer your_api_key_here
                </code>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Key className="w-4 h-4 mr-2" />
                  Generate API Key
                </Button>
                <Button variant="ghost" className="text-white/70 hover:text-white">
                  View Documentation
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <ConversationSearch onFilteredResults={setSearchResults} />
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <Card className="nexus-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Search Results</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.slice(0, 10).map(result => (
                  <div key={result.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm mb-1">
                          {result.sender === 'user' ? '👤 User' : '🤖 AI'}
                        </div>
                        <div className="text-white/70 text-sm line-clamp-2">{result.text}</div>
                        <div className="text-xs text-white/50 mt-1">
                          {new Date(result.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <MessageReactions
                        messageId={result.id}
                        reactions={messageReactions[result.id]}
                        onReact={handleReaction}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reactions" className="space-y-6">
          <Card className="nexus-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Message Reactions & Formatting</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h4 className="font-medium text-purple-300 mb-2">Interactive Reactions</h4>
                <p className="text-white/70 text-sm mb-3">
                  Users can react to messages with emojis, providing feedback and engagement metrics.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">Available reactions:</span>
                  <div className="flex gap-1">
                    {['👍', '👎', '❤️', '😊', '⭐'].map(emoji => (
                      <Button key={emoji} variant="ghost" size="sm" className="h-8 w-8 p-0 text-lg">
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-medium text-blue-300 mb-2">Rich Text Formatting</h4>
                <p className="text-white/70 text-sm mb-3">
                  Support for markdown formatting, code syntax highlighting, and media embeds.
                </p>
                <div className="space-y-2 text-sm">
                  <div>• **Bold** and *italic* text formatting</div>
                  <div>• `Code blocks` with syntax highlighting</div>
                  <div>• [Links](https://example.com) and media embeds</div>
                  <div>• Tables, lists, and blockquotes</div>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-medium text-green-300 mb-2">Analytics Integration</h4>
                <p className="text-white/70 text-sm">
                  Track reaction patterns, sentiment analysis, and user engagement metrics through the API.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card className="nexus-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Export Options</h3>
              </div>
              
              <ExportOptions>
                <Button className="nexus-gradient">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </ExportOptions>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  <h4 className="font-medium text-blue-300">Structured Exports</h4>
                </div>
                <ul className="text-sm text-white/70 space-y-1">
                  <li>• JSON format with full metadata</li>
                  <li>• CSV for spreadsheet analysis</li>
                  <li>• XML for system integration</li>
                </ul>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  <h4 className="font-medium text-green-300">Document Formats</h4>
                </div>
                <ul className="text-sm text-white/70 space-y-1">
                  <li>• PDF with formatting preserved</li>
                  <li>• Markdown for documentation</li>
                  <li>• Plain text for simple archiving</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Webhook className="w-4 h-4 text-purple-400" />
                  <h4 className="font-medium text-purple-300">API Integration</h4>
                </div>
                <ul className="text-sm text-white/70 space-y-1">
                  <li>• Webhook notifications on export</li>
                  <li>• Scheduled automated exports</li>
                  <li>• Custom format transformations</li>
                </ul>
              </div>

              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                  <h4 className="font-medium text-orange-300">Analytics Export</h4>
                </div>
                <ul className="text-sm text-white/70 space-y-1">
                  <li>• Conversation analytics data</li>
                  <li>• Usage statistics and metrics</li>
                  <li>• Performance benchmarks</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="plugins" className="space-y-6">
          <PluginSystem />
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <TestingSuite />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <ErrorMonitoring />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceOptimization />
        </TabsContent>
      </Tabs>
    </div>
  );
};
