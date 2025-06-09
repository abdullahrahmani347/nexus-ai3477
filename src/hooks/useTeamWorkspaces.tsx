
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TeamWorkspace {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  members?: TeamMember[];
  member_count?: number;
}

interface TeamMember {
  id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  email?: string;
  full_name?: string;
}

export function useTeamWorkspaces() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workspaces, setWorkspaces] = useState<TeamWorkspace[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWorkspaces = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_workspaces')
        .select(`
          *,
          team_members!inner(
            id,
            user_id,
            role,
            joined_at,
            profiles(email, full_name)
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const workspacesWithMembers = data?.map(workspace => ({
        ...workspace,
        members: workspace.team_members?.map((member: any) => ({
          id: member.id,
          user_id: member.user_id,
          role: member.role,
          joined_at: member.joined_at,
          email: member.profiles?.email,
          full_name: member.profiles?.full_name
        })),
        member_count: workspace.team_members?.length || 0
      })) || [];

      setWorkspaces(workspacesWithMembers);
    } catch (error) {
      console.error('Error loading workspaces:', error);
      toast({
        title: "Error",
        description: "Failed to load team workspaces",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (name: string, description?: string) => {
    if (!user) return null;

    try {
      const { data: workspace, error: workspaceError } = await supabase
        .from('team_workspaces')
        .insert({
          name,
          description,
          owner_id: user.id
        })
        .select()
        .single();

      if (workspaceError) throw workspaceError;

      // Add creator as owner member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      await loadWorkspaces();
      
      toast({
        title: "Success",
        description: "Team workspace created successfully",
      });

      return workspace;
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast({
        title: "Error",
        description: "Failed to create workspace",
        variant: "destructive",
      });
      return null;
    }
  };

  const inviteMember = async (workspaceId: string, email: string) => {
    if (!user) return false;

    try {
      // First check if user exists in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError) {
        toast({
          title: "Error",
          description: "User not found with this email",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('team_members')
        .insert({
          workspace_id: workspaceId,
          user_id: profile.id,
          role: 'member'
        });

      if (error) throw error;

      await loadWorkspaces();
      
      toast({
        title: "Success",
        description: "Member invited successfully",
      });

      return true;
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: "Error",
        description: "Failed to invite member",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadWorkspaces();
    }
  }, [user]);

  return {
    workspaces,
    loading,
    createWorkspace,
    inviteMember,
    loadWorkspaces
  };
}
