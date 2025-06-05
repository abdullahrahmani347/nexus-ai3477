
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, Bot, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/components/MessageBubble';

interface SearchFilters {
  searchTerm: string;
  sender: 'all' | 'user' | 'bot';
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

interface ConversationSearchProps {
  onResultsChange: (results: Message[]) => void;
  className?: string;
}

export const ConversationSearch: React.FC<ConversationSearchProps> = ({
  onResultsChange,
  className = ''
}) => {
  const { messages } = useChatStore();
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    sender: 'all',
    dateRange: {}
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Perform search whenever filters change
  useEffect(() => {
    const searchResults = messages.filter(message => {
      // Text search
      if (filters.searchTerm && !message.text.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // Sender filter
      if (filters.sender !== 'all' && message.sender !== filters.sender) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const messageDate = new Date(message.timestamp);
        if (filters.dateRange.from && messageDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to && messageDate > filters.dateRange.to) {
          return false;
        }
      }

      return true;
    });

    onResultsChange(searchResults);
  }, [filters, messages, onResultsChange]);

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      sender: 'all',
      dateRange: {}
    });
  };

  const hasActiveFilters = filters.searchTerm || filters.sender !== 'all' || filters.dateRange.from || filters.dateRange.to;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
        <Input
          placeholder="Search conversations..."
          value={filters.searchTerm}
          onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
          className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-white/60"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2">
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 p-0 flex items-center justify-center bg-purple-500/20 text-purple-300 text-xs">
                  !
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-black/90 backdrop-blur-xl border-white/20" align="start">
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Filter Messages</h4>
              
              {/* Sender Filter */}
              <div className="space-y-2">
                <label className="text-sm text-white/70">Sender</label>
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'All', icon: null },
                    { value: 'user', label: 'You', icon: User },
                    { value: 'bot', label: 'AI', icon: Bot }
                  ].map(({ value, label, icon: Icon }) => (
                    <Button
                      key={value}
                      variant={filters.sender === value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, sender: value as any }))}
                      className={filters.sender === value ? "bg-purple-500 hover:bg-purple-600" : "text-white/70 hover:text-white hover:bg-white/10"}
                    >
                      {Icon && <Icon className="h-3 w-3 mr-1" />}
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm text-white/70">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="justify-start text-white/70 hover:text-white hover:bg-white/10">
                        <Calendar className="h-3 w-3 mr-2" />
                        {filters.dateRange.from ? filters.dateRange.from.toLocaleDateString() : 'From'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) => setFilters(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, from: date } 
                        }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="justify-start text-white/70 hover:text-white hover:bg-white/10">
                        <Calendar className="h-3 w-3 mr-2" />
                        {filters.dateRange.to ? filters.dateRange.to.toLocaleDateString() : 'To'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) => setFilters(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, to: date } 
                        }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="w-full text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-3 w-3 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex gap-1 flex-wrap">
            {filters.sender !== 'all' && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                {filters.sender === 'user' ? 'Your messages' : 'AI messages'}
              </Badge>
            )}
            {filters.dateRange.from && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                From: {filters.dateRange.from.toLocaleDateString()}
              </Badge>
            )}
            {filters.dateRange.to && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                To: {filters.dateRange.to.toLocaleDateString()}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
