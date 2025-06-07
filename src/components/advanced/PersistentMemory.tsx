
import React, { useState, useEffect } from 'react';
import { Brain, Plus, Edit, Trash2, Tag, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface MemoryEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  importance: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  context?: string;
  relatedSessions: string[];
}

export const PersistentMemory: React.FC = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryEntry | null>(null);
  const [newMemory, setNewMemory] = useState({
    title: '',
    content: '',
    tags: '',
    importance: 'medium' as const
  });

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    // Mock memories for demo
    const mockMemories: MemoryEntry[] = [
      {
        id: '1',
        title: 'Preferred Python frameworks',
        content: 'User prefers FastAPI for backend development and Streamlit for data science prototypes. Dislikes Django due to complexity.',
        tags: ['preferences', 'python', 'frameworks'],
        importance: 'high',
        createdAt: new Date(Date.now() - 86400000 * 5),
        updatedAt: new Date(Date.now() - 86400000 * 2),
        context: 'Discussion about web frameworks',
        relatedSessions: ['session-1', 'session-3']
      },
      {
        id: '2',
        title: 'Project: E-commerce Platform',
        content: 'Working on a multi-vendor e-commerce platform using React, Node.js, and PostgreSQL. Focus on performance and scalability.',
        tags: ['project', 'e-commerce', 'react', 'nodejs'],
        importance: 'high',
        createdAt: new Date(Date.now() - 86400000 * 3),
        updatedAt: new Date(Date.now() - 86400000),
        context: 'Project planning session',
        relatedSessions: ['session-2', 'session-4']
      },
      {
        id: '3',
        title: 'Learning Goal: Machine Learning',
        content: 'Wants to learn ML with focus on NLP and computer vision. Has basic Python knowledge but needs guidance on mathematics.',
        tags: ['learning', 'machine-learning', 'nlp', 'cv'],
        importance: 'medium',
        createdAt: new Date(Date.now() - 86400000 * 7),
        updatedAt: new Date(Date.now() - 86400000 * 4),
        context: 'Career development discussion',
        relatedSessions: ['session-5']
      }
    ];
    setMemories(mockMemories);
  };

  const saveMemory = async () => {
    if (!newMemory.title.trim() || !newMemory.content.trim()) return;

    const memory: MemoryEntry = {
      id: Date.now().toString(),
      title: newMemory.title,
      content: newMemory.content,
      tags: newMemory.tags.split(',').map(t => t.trim()).filter(Boolean),
      importance: newMemory.importance,
      createdAt: new Date(),
      updatedAt: new Date(),
      relatedSessions: []
    };

    setMemories(prev => [memory, ...prev]);
    setNewMemory({ title: '', content: '', tags: '', importance: 'medium' });
    setIsAddDialogOpen(false);
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-purple-500/20 text-purple-300',
      'bg-blue-500/20 text-blue-300',
      'bg-green-500/20 text-green-300',
      'bg-pink-500/20 text-pink-300',
      'bg-orange-500/20 text-orange-300'
    ];
    const index = tag.length % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-6">
      <Card className="nexus-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Persistent Memory</h3>
              <p className="text-white/60 text-sm">AI remembers your preferences and context</p>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                <Plus className="w-4 h-4 mr-2" />
                Add Memory
              </Button>
            </DialogTrigger>
            <DialogContent className="nexus-card border-white/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Add Memory Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Title</label>
                  <Input
                    placeholder="Enter memory title"
                    value={newMemory.title}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Content</label>
                  <Textarea
                    placeholder="Describe what you want the AI to remember"
                    value={newMemory.content}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white min-h-24"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Tags (comma-separated)</label>
                  <Input
                    placeholder="e.g. preferences, project, learning"
                    value={newMemory.tags}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, tags: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Importance</label>
                  <select
                    value={newMemory.importance}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, importance: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <Button onClick={saveMemory} className="w-full">
                  Save Memory
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">{memories.length}</div>
            <div className="text-sm text-white/60">Total Memories</div>
          </div>
          <div className="bg-white/5 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">
              {memories.filter(m => m.importance === 'high').length}
            </div>
            <div className="text-sm text-white/60">High Priority</div>
          </div>
          <div className="bg-white/5 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">
              {new Set(memories.flatMap(m => m.tags)).size}
            </div>
            <div className="text-sm text-white/60">Unique Tags</div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {memories.map((memory) => (
          <Card key={memory.id} className="nexus-card p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-white">{memory.title}</h4>
                  <Badge variant="secondary" className={getImportanceColor(memory.importance)}>
                    {memory.importance}
                  </Badge>
                </div>
                <p className="text-white/80 mb-3">{memory.content}</p>
                
                {memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {memory.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className={`${getTagColor(tag)} text-xs`}>
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Created {memory.createdAt.toLocaleDateString()}
                  </div>
                  {memory.updatedAt.getTime() !== memory.createdAt.getTime() && (
                    <div>Updated {memory.updatedAt.toLocaleDateString()}</div>
                  )}
                  {memory.relatedSessions.length > 0 && (
                    <div>{memory.relatedSessions.length} related sessions</div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white"
                  onClick={() => setEditingMemory(memory)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => deleteMemory(memory.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
