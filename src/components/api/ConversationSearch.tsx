
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar, User, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chatStore';

interface SearchFilters {
  query: string;
  sender: 'all' | 'user' | 'bot';
  dateRange: 'all' | 'today' | 'week' | 'month';
  hasAttachments: boolean;
}

interface ConversationSearchProps {
  onFilteredResults: (results: any[]) => void;
}

export const ConversationSearch: React.FC<ConversationSearchProps> = ({ onFilteredResults }) => {
  const { messages, sessions } = useChatStore();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sender: 'all',
    dateRange: 'all',
    hasAttachments: false
  });
  const [isSearching, setIsSearching] = useState(false);

  const filteredResults = useMemo(() => {
    setIsSearching(true);
    
    let results = [...messages];

    // Text search
    if (filters.query) {
      results = results.filter(msg => 
        msg.text.toLowerCase().includes(filters.query.toLowerCase())
      );
    }

    // Sender filter
    if (filters.sender !== 'all') {
      results = results.filter(msg => msg.sender === filters.sender);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      results = results.filter(msg => new Date(msg.timestamp) >= filterDate);
    }

    // Attachments filter
    if (filters.hasAttachments) {
      results = results.filter(msg => msg.attachments && msg.attachments.length > 0);
    }

    setTimeout(() => setIsSearching(false), 100);
    return results;
  }, [messages, filters]);

  useEffect(() => {
    onFilteredResults(filteredResults);
  }, [filteredResults, onFilteredResults]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      sender: 'all',
      dateRange: 'all',
      hasAttachments: false
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== 'all' && value !== false
  ).length;

  return (
    <div className="nexus-card p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Search Conversations</h3>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            {activeFiltersCount} active
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-white/70">Search Query</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Search messages..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/70">Sender</label>
          <Select value={filters.sender} onValueChange={(value) => updateFilter('sender', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="user">User Messages</SelectItem>
              <SelectItem value="bot">AI Messages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/70">Date Range</label>
          <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/70">Filters</label>
          <div className="flex items-center gap-2">
            <Button
              variant={filters.hasAttachments ? "default" : "ghost"}
              size="sm"
              onClick={() => updateFilter('hasAttachments', !filters.hasAttachments)}
              className="text-xs"
            >
              <Tag className="w-3 h-3 mr-1" />
              Has Attachments
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <div className="text-sm text-white/60">
          {isSearching ? 'Searching...' : `${filteredResults.length} results found`}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-white/70">
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
