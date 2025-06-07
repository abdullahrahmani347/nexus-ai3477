
import React, { useState } from 'react';
import { Search, Brain, Zap, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  content: string;
  sessionTitle: string;
  timestamp: Date;
  relevanceScore: number;
  context: string;
  messageType: 'user' | 'assistant';
}

interface SearchFilters {
  dateRange: 'all' | 'week' | 'month' | 'year';
  messageType: 'all' | 'user' | 'assistant';
  minRelevance: number;
}

export const SemanticSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: 'all',
    messageType: 'all',
    minRelevance: 0.5
  });

  const performSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Call semantic search edge function
      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          query: query.trim(),
          filters: filters,
          limit: 20
        }
      });

      if (error) throw error;

      // Mock results for demo
      const mockResults: SearchResult[] = [
        {
          id: '1',
          content: 'How to implement machine learning models in production?',
          sessionTitle: 'ML Discussion',
          timestamp: new Date(Date.now() - 86400000),
          relevanceScore: 0.95,
          context: 'Discussion about deploying ML models',
          messageType: 'user'
        },
        {
          id: '2',
          content: 'For production ML deployment, consider using containerization with Docker and orchestration with Kubernetes...',
          sessionTitle: 'ML Discussion',
          timestamp: new Date(Date.now() - 86400000),
          relevanceScore: 0.92,
          context: 'AI response about ML deployment',
          messageType: 'assistant'
        },
        {
          id: '3',
          content: 'What are the best practices for data preprocessing?',
          sessionTitle: 'Data Science Chat',
          timestamp: new Date(Date.now() - 172800000),
          relevanceScore: 0.87,
          context: 'Question about data preprocessing',
          messageType: 'user'
        }
      ];

      setResults(mockResults.filter(r => 
        r.relevanceScore >= filters.minRelevance &&
        (filters.messageType === 'all' || r.messageType === filters.messageType)
      ));
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const highlightQuery = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-400 text-black">$1</mark>');
  };

  return (
    <div className="space-y-6">
      <Card className="nexus-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Semantic Search</h3>
            <p className="text-white/60 text-sm">AI-powered search across all conversations</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <Input
                placeholder="Search through your conversations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              />
            </div>
            <Button 
              onClick={performSearch}
              disabled={isSearching || !query.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/80">Filters:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Date:</span>
              <select 
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
              >
                <option value="all">All time</option>
                <option value="week">Past week</option>
                <option value="month">Past month</option>
                <option value="year">Past year</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Type:</span>
              <select
                value={filters.messageType}
                onChange={(e) => setFilters(prev => ({ ...prev, messageType: e.target.value as any }))}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
              >
                <option value="all">All messages</option>
                <option value="user">My messages</option>
                <option value="assistant">AI responses</option>
              </select>
            </div>

            <div className="flex items-center gap-2 min-w-32">
              <span className="text-xs text-white/60">Relevance:</span>
              <Slider
                value={[filters.minRelevance]}
                onValueChange={([value]) => setFilters(prev => ({ ...prev, minRelevance: value }))}
                min={0}
                max={1}
                step={0.1}
                className="flex-1"
              />
              <span className="text-xs text-white/60">{(filters.minRelevance * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </Card>

      {results.length > 0 && (
        <Card className="nexus-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white">Search Results</h4>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {results.length} found
            </Badge>
          </div>

          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={
                        result.messageType === 'user' 
                          ? 'bg-blue-500/20 text-blue-300' 
                          : 'bg-green-500/20 text-green-300'
                      }
                    >
                      {result.messageType === 'user' ? 'You' : 'AI'}
                    </Badge>
                    <span className="text-sm text-white/60">{result.sessionTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-white/60">
                      {(result.relevanceScore * 100).toFixed(0)}% match
                    </span>
                  </div>
                </div>
                
                <div 
                  className="text-white mb-2"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightQuery(result.content, query) 
                  }}
                />
                
                <div className="text-xs text-white/50">
                  {result.timestamp.toLocaleDateString()} • {result.context}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {query && results.length === 0 && !isSearching && (
        <Card className="nexus-card p-6 text-center">
          <Search className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <h4 className="font-semibold text-white mb-2">No Results Found</h4>
          <p className="text-white/60">Try adjusting your search query or filters</p>
        </Card>
      )}
    </div>
  );
};
