
import React, { useState } from 'react';
import { Sparkles, Crown, Zap, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import SessionSidebar from '@/components/SessionSidebar';
import { UserMenu } from '@/components/navigation/UserMenu';

const SemanticSearchPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="flex h-screen relative z-10">
        <SessionSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  ☰
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                      Nexus AI Search
                    </h1>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                      <span className="text-xs text-white/60">Semantic Intelligence</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white/80">AI Powered</span>
                </div>
                <UserMenu />
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Search Interface */}
              <Card className="nexus-card p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/20">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Semantic Search</h2>
                  <p className="text-white/60">Search through your conversations with AI-powered understanding</p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                    <Input
                      placeholder="Ask anything about your conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 text-lg bg-white/10 border-white/20 focus:border-purple-400 text-white placeholder:text-white/50 rounded-xl"
                    />
                  </div>
                  
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl"
                    disabled={!searchQuery.trim()}
                  >
                    Search Conversations
                  </Button>
                </div>
              </Card>

              {/* Coming Soon Message */}
              <Card className="nexus-card p-6 text-center">
                <div className="text-white/60 mb-4">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white mb-2">Advanced Search Coming Soon</h3>
                  <p className="text-sm">
                    We're working on bringing you powerful semantic search capabilities to find exactly what you're looking for in your conversations.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h4 className="font-medium text-purple-300 text-sm">Natural Language</h4>
                    <p className="text-xs text-white/60 mt-1">Ask questions in plain English</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-medium text-blue-300 text-sm">Context Aware</h4>
                    <p className="text-xs text-white/60 mt-1">Understands meaning and context</p>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h4 className="font-medium text-green-300 text-sm">Instant Results</h4>
                    <p className="text-xs text-white/60 mt-1">Fast and accurate search results</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemanticSearchPage;
