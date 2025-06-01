
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Plus, Edit, Trash2, Search, Tag, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MemoryEntry {
  id: string;
  type: 'preference' | 'fact' | 'context' | 'skill';
  content: string;
  tags: string[];
  importance: 'low' | 'medium' | 'high';
  createdAt: Date;
  lastAccessed: Date;
  accessCount: number;
}

export const PersistentMemory: React.FC = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [newMemory, setNewMemory] = useState({
    type: 'preference' as const,
    content: '',
    tags: '',
    importance: 'medium' as const
  });

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = () => {
    // Mock persistent memory data
    const mockMemories: MemoryEntry[] = [
      {
        id: '1',
        type: 'preference',
        content: 'User prefers concise, technical explanations with code examples',
        tags: ['communication', 'coding', 'style'],
        importance: 'high',
        createdAt: new Date('2024-01-01'),
        lastAccessed: new Date('2024-01-15'),
        accessCount: 25
      },
      {
        id: '2',
        type: 'fact',
        content: 'User is a React developer working on e-commerce applications',
        tags: ['profession', 'technology', 'react'],
        importance: 'high',
        createdAt: new Date('2024-01-02'),
        lastAccessed: new Date('2024-01-14'),
        accessCount: 18
      },
      {
        id: '3',
        type: 'context',
        content: 'Currently working on implementing a payment system with Stripe',
        tags: ['project', 'stripe', 'payments'],
        importance: 'medium',
        createdAt: new Date('2024-01-10'),
        lastAccessed: new Date('2024-01-13'),
        accessCount: 12
      },
      {
        id: '4',
        type: 'skill',
        content: 'Has intermediate knowledge of TypeScript and advanced React skills',
        tags: ['skills', 'typescript', 'react'],
        importance: 'medium',
        createdAt: new Date('2024-01-05'),
        lastAccessed: new Date('2024-01-12'),
        accessCount: 8
      }
    ];
    setMemories(mockMemories);
  };

  const addMemory = () => {
    if (!newMemory.content.trim()) return;

    const memory: MemoryEntry = {
      id: Date.now().toString(),
      type: newMemory.type,
      content: newMemory.content,
      tags: newMemory.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      importance: newMemory.importance,
      createdAt: new Date(),
      lastAccessed: new Date(),
      accessCount: 0
    };

    setMemories(prev => [...prev, memory]);
    setNewMemory({
      type: 'preference',
      content: '',
      tags: '',
      importance: 'medium'
    });
    setIsAddingMemory(false);
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(memory => memory.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'preference': return '⚙️';
      case 'fact': return '📋';
      case 'context': return '🎯';
      case 'skill': return '🎓';
      default: return '🧠';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || memory.type === selectedType;
    return matchesSearch && matchesType;
  });

  const memoryStats = {
    total: memories.length,
    byType: {
      preference: memories.filter(m => m.type === 'preference').length,
      fact: memories.filter(m => m.type === 'fact').length,
      context: memories.filter(m => m.type === 'context').length,
      skill: memories.filter(m => m.type === 'skill').length
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8" />
            Persistent Memory
          </h1>
          <p className="text-muted-foreground">AI remembers important information across all your sessions</p>
        </div>
        <Button onClick={() => setIsAddingMemory(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Memory
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{memoryStats.total}</div>
            <p className="text-sm text-muted-foreground">Total Memories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold">⚙️ {memoryStats.byType.preference}</div>
            <p className="text-sm text-muted-foreground">Preferences</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold">📋 {memoryStats.byType.fact}</div>
            <p className="text-sm text-muted-foreground">Facts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold">🎯 {memoryStats.byType.context}</div>
            <p className="text-sm text-muted-foreground">Context</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold">🎓 {memoryStats.byType.skill}</div>
            <p className="text-sm text-muted-foreground">Skills</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories..."
                className="pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">All Types</option>
              <option value="preference">Preferences</option>
              <option value="fact">Facts</option>
              <option value="context">Context</option>
              <option value="skill">Skills</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Add Memory Dialog */}
      {isAddingMemory && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Memory</CardTitle>
            <CardDescription>Store important information for the AI to remember</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="memory-type">Type</Label>
              <select
                id="memory-type"
                value={newMemory.type}
                onChange={(e) => setNewMemory(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full p-2 border rounded"
              >
                <option value="preference">Preference</option>
                <option value="fact">Fact</option>
                <option value="context">Context</option>
                <option value="skill">Skill</option>
              </select>
            </div>

            <div>
              <Label htmlFor="memory-content">Content</Label>
              <Textarea
                id="memory-content"
                value={newMemory.content}
                onChange={(e) => setNewMemory(prev => ({ ...prev, content: e.target.value }))}
                placeholder="What should the AI remember?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="memory-tags">Tags (comma-separated)</Label>
              <Input
                id="memory-tags"
                value={newMemory.tags}
                onChange={(e) => setNewMemory(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="coding, react, style"
              />
            </div>

            <div>
              <Label htmlFor="memory-importance">Importance</Label>
              <select
                id="memory-importance"
                value={newMemory.importance}
                onChange={(e) => setNewMemory(prev => ({ ...prev, importance: e.target.value as any }))}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={addMemory}>Add Memory</Button>
              <Button variant="outline" onClick={() => setIsAddingMemory(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Memory List */}
      <div className="space-y-4">
        {filteredMemories.map((memory) => (
          <Card key={memory.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getTypeIcon(memory.type)}</span>
                    <Badge variant="outline">{memory.type}</Badge>
                    <Badge variant="secondary" className={getImportanceColor(memory.importance)}>
                      {memory.importance}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Used {memory.accessCount} times
                    </span>
                  </div>
                  
                  <p className="text-sm mb-3">{memory.content}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {memory.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="mr-1 h-2 w-2" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Created {memory.createdAt.toLocaleDateString()}
                    </span>
                    <span>Last accessed {memory.lastAccessed.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMemory(memory.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMemories.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No memories found matching your search' : 'No memories stored yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
