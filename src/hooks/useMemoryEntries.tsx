
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MemoryEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  importance: 'low' | 'medium' | 'high';
  context?: string;
  related_sessions: string[];
  created_at: string;
  updated_at: string;
}

export function useMemoryEntries() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memory_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure importance field matches our interface
      const typedEntries = (data || []).map(entry => ({
        ...entry,
        importance: entry.importance as 'low' | 'medium' | 'high',
        tags: entry.tags || [],
        related_sessions: entry.related_sessions || []
      }));
      
      setEntries(typedEntries);
    } catch (error) {
      console.error('Error loading memory entries:', error);
      toast({
        title: "Error",
        description: "Failed to load memory entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entry: Omit<MemoryEntry, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('memory_entries')
        .insert({
          ...entry,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await loadEntries();
      toast({
        title: "Success",
        description: "Memory entry created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating memory entry:', error);
      toast({
        title: "Error",
        description: "Failed to create memory entry",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateEntry = async (id: string, updates: Partial<MemoryEntry>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('memory_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadEntries();
      toast({
        title: "Success",
        description: "Memory entry updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error updating memory entry:', error);
      toast({
        title: "Error",
        description: "Failed to update memory entry",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('memory_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadEntries();
      toast({
        title: "Success",
        description: "Memory entry deleted successfully",
      });

      return true;
    } catch (error) {
      console.error('Error deleting memory entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete memory entry",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  return {
    entries,
    loading,
    createEntry,
    updateEntry,
    deleteEntry,
    loadEntries
  };
}
