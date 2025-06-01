
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Clock, MessageSquare, Tag, Zap } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

interface SearchResult {
  id: string;
  content: string;
  sessionId: string;
  sessionTitle: string;
  timestamp: Date;
  sender: 'user' | 'bot';
  relevanceScore: number;
  tags: string[];
}

export const SemanticSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { sessions } = useChatStore();

  const filterOptions = [
    { id: 'user', label: 'User Messages', icon: '👤' },
    { id: 'bot', label: 'AI Responses', icon: '🤖' },
    { id: 'recent', label: 'Recent (7 days)', icon: '📅' },
    { id: 'popular', label: 'Popular Topics', icon: '🔥' }
  ];

  const performSemanticSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Mock semantic search results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        content: 'How can I improve my productivity with AI tools?',
        sessionId: 'session-1',
        sessionTitle: 'Productivity Discussion',
        timestamp: new Date('2024-01-05'),
        sender: 'user',
        relevanceScore: 0.95,
        tags: ['productivity', 'ai-tools', 'workflow']
      },
      {
        id: '2',
        content: 'AI can significantly boost productivity by automating repetitive tasks, providing intelligent insights, and helping with decision-making processes...',
        sessionId: 'session-1',
        sessionTitle: 'Productivity Discussion',
        timestamp: new Date('2024-01-05'),
        sender: 'bot',
        relevanceScore: 0.92,
        tags: ['productivity', 'automation', 'insights']
      },
      {
        id: '3',
        content: 'What are the best practices for project management?',
        sessionId: 'session-2',
        sessionTitle: 'Project Management',
        timestamp: new Date('2024-01-04'),
        sender: 'user',
        relevanceScore: 0.88,
        tags: ['project-management', 'best-practices']
      },
      {
        id: '4',
        content: 'Effective project management involves clear goal setting, regular communication, proper resource allocation...',
        sessionId: 'session-2',
        sessionTitle: 'Project Management',
        timestamp: new Date('2024-01-04'),
        sender: 'bot',
        relevanceScore: 0.85,
        tags: ['project-management', 'communication', 'resources']
      }
    ].filter(result => {
      // Apply filters
      if (selectedFilters.includes('user') && result.sender !== 'user') return false;
      if (selectedFilters.includes('bot') && result.sender !== 'bot') return false;
      if (selectedFilters.includes('recent')) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (result.timestamp < weekAgo) return false;
      }
      return true;
    });

    // Simulate API delay
    setTimeout(() => {
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSemanticSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedFilters]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Semantic Search</h1>
          <p className="text-muted-foreground">Search through your conversations using AI-powered semantic understanding</p>
        </div>
        <Badge variant="secondary">
          <Zap className="mr-1 h-3 w-3" />
          AI-Powered
        </Badge>
      </div>

      {/* Search Input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your conversations... (e.g., 'productivity tips', 'API integration', 'workflow automation')"
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filterOptions.map((filter) => (
              <Badge
                key={filter.id}
                variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFilter(filter.id)}
              >
                <span className="mr-1">{filter.icon}</span>
                {filter.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Results
              {!isSearching && (
                <Badge variant="outline">
                  {searchResults.length} results
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Results are ranked by semantic relevance to your query
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Searching through your conversations...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={result.sender === 'user' ? 'default' : 'secondary'}>
                          {result.sender === 'user' ? '👤 User' : '🤖 AI'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(result.relevanceScore * 100)}% match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {result.timestamp.toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        From: {result.sessionTitle}
                      </p>
                      <div className="text-sm">
                        {highlightText(
                          result.content.length > 200 
                            ? result.content.substring(0, 200) + '...'
                            : result.content,
                          searchQuery
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {result.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="mr-1 h-2 w-2" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Open Session
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try using different keywords or removing some filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      {!searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Search Tips</CardTitle>
            <CardDescription>Get the most out of semantic search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">🎯 Try semantic queries</h4>
                <p className="text-sm text-muted-foreground">
                  "How to be more productive" instead of just "productivity"
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">🔍 Use concepts</h4>
                <p className="text-sm text-muted-foreground">
                  Search for ideas and concepts, not just exact words
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">📝 Natural language</h4>
                <p className="text-sm text-muted-foreground">
                  Ask questions as you would in conversation
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">🏷️ Filter results</h4>
                <p className="text-sm text-muted-foreground">
                  Use filters to narrow down results by type or date
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
