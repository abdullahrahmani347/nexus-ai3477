
import React, { useState } from 'react';
import { Brain, Plus, Search, Tag, Star, Clock, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemoryEntries } from '@/hooks/useMemoryEntries';

// Input validation utility
const validateInput = (input: string, maxLength = 1000): boolean => {
  return input && input.trim().length > 0 && input.length <= maxLength;
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const PersistentMemory: React.FC = () => {
  const { entries, loading, createEntry, updateEntry, deleteEntry } = useMemoryEntries();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    tags: '',
    importance: 'medium' as 'low' | 'medium' | 'high',
    context: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const validateForm = (data: typeof newEntry): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!validateInput(data.title, 100)) {
      newErrors.title = 'Title is required (max 100 characters)';
    }
    
    if (!validateInput(data.content, 2000)) {
      newErrors.content = 'Content is required (max 2000 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEntry = async () => {
    if (!validateForm(newEntry)) return;

    const success = await createEntry({
      title: sanitizeInput(newEntry.title),
      content: sanitizeInput(newEntry.content),
      tags: newEntry.tags.split(',').map(tag => sanitizeInput(tag)).filter(Boolean),
      importance: newEntry.importance,
      context: sanitizeInput(newEntry.context),
      related_sessions: []
    });

    if (success) {
      setNewEntry({ title: '', content: '', tags: '', importance: 'medium', context: '' });
      setErrors({});
      setIsCreateDialogOpen(false);
    }
  };

  const handleUpdateEntry = async () => {
    if (!editingEntry || !validateForm(editingEntry)) return;

    const success = await updateEntry(editingEntry.id, {
      title: sanitizeInput(editingEntry.title),
      content: sanitizeInput(editingEntry.content),
      tags: editingEntry.tags.split(',').map((tag: string) => sanitizeInput(tag)).filter(Boolean),
      importance: editingEntry.importance,
      context: sanitizeInput(editingEntry.context)
    });

    if (success) {
      setEditingEntry(null);
      setErrors({});
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-500/20 text-red-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'low': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="nexus-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Persistent Memory</h3>
            <div className="text-white/60 text-sm">Store and retrieve important information</div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <Input
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                <Plus className="w-4 h-4 mr-2" />
                Add Memory
              </Button>
            </DialogTrigger>
            <DialogContent className="nexus-card border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Create Memory Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  {errors.title && <div className="text-red-400 text-xs mt-1">{errors.title}</div>}
                </div>
                <div>
                  <Textarea
                    placeholder="Content"
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    rows={4}
                  />
                  {errors.content && <div className="text-red-400 text-xs mt-1">{errors.content}</div>}
                </div>
                <Input
                  placeholder="Tags (comma separated)"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Select value={newEntry.importance} onValueChange={(value: any) => setNewEntry(prev => ({ ...prev, importance: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Context (optional)"
                  value={newEntry.context}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, context: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Button onClick={handleCreateEntry} className="w-full">
                  Create Memory
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <div>No memory entries found</div>
              <div className="text-sm">Create your first memory to get started</div>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <Card key={entry.id} className="bg-white/5 border-white/10 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{entry.title}</h4>
                      <Badge variant="secondary" className={getImportanceColor(entry.importance)}>
                        <Star className="w-3 h-3 mr-1" />
                        {entry.importance}
                      </Badge>
                    </div>
                    <div className="text-white/80 text-sm mb-2">{entry.content}</div>
                    
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-white/20 text-white/60">
                            <Tag className="w-2 h-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingEntry({ ...entry, tags: entry.tags.join(', ') })}
                      className="text-white/60 hover:text-white"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
        <DialogContent className="nexus-card border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Memory Entry</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Title"
                  value={editingEntry.title}
                  onChange={(e) => setEditingEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
                {errors.title && <div className="text-red-400 text-xs mt-1">{errors.title}</div>}
              </div>
              <div>
                <Textarea
                  placeholder="Content"
                  value={editingEntry.content}
                  onChange={(e) => setEditingEntry(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                  rows={4}
                />
                {errors.content && <div className="text-red-400 text-xs mt-1">{errors.content}</div>}
              </div>
              <Input
                placeholder="Tags (comma separated)"
                value={editingEntry.tags}
                onChange={(e) => setEditingEntry(prev => ({ ...prev, tags: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
              />
              <Select value={editingEntry.importance} onValueChange={(value: any) => setEditingEntry(prev => ({ ...prev, importance: value }))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleUpdateEntry} className="w-full">
                Update Memory
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
