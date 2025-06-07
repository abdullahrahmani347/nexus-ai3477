
import React, { useState, useEffect } from 'react';
import { Users, Plus, Crown, Shield, User, MessageSquare, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  lastActive: Date;
  status: 'online' | 'away' | 'offline';
}

interface TeamWorkspace {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  sharedConversations: number;
  createdAt: Date;
}

export const TeamWorkspace: React.FC = () => {
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<TeamWorkspace | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  useEffect(() => {
    loadWorkspace();
  }, []);

  const loadWorkspace = async () => {
    // Mock workspace data
    const mockWorkspace: TeamWorkspace = {
      id: '1',
      name: 'My Team Workspace',
      description: 'Collaborative AI workspace for our team',
      members: [
        {
          id: '1',
          email: user?.email || 'user@example.com',
          name: user?.user_metadata?.full_name || 'Current User',
          role: 'owner',
          lastActive: new Date(),
          status: 'online'
        }
      ],
      sharedConversations: 5,
      createdAt: new Date()
    };
    setWorkspace(mockWorkspace);
  };

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !workspace) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      email: inviteEmail,
      name: inviteEmail.split('@')[0],
      role: 'member',
      lastActive: new Date(),
      status: 'offline'
    };

    setWorkspace(prev => prev ? {
      ...prev,
      members: [...prev.members, newMember]
    } : null);

    setInviteEmail('');
    setIsInviteDialogOpen(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-500/20 text-purple-300';
      case 'admin': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (!workspace) {
    return (
      <Card className="nexus-card p-6">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <h3 className="text-lg font-semibold text-white mb-2">No Team Workspace</h3>
          <p className="text-white/60 mb-4">Create or join a team workspace to collaborate</p>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
            Create Workspace
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="nexus-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{workspace.name}</h3>
              <p className="text-white/60 text-sm">{workspace.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">{workspace.members.length}</div>
            <div className="text-sm text-white/60">Members</div>
          </div>
          <div className="bg-white/5 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">{workspace.sharedConversations}</div>
            <div className="text-sm text-white/60">Shared Chats</div>
          </div>
          <div className="bg-white/5 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-sm text-white/60">Availability</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-white">Team Members</h4>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Plus className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="nexus-card border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Invite Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Button onClick={inviteMember} className="w-full">
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {workspace.members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(member.status)}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium truncate">{member.name}</span>
                  <Badge variant="secondary" className={getRoleColor(member.role)}>
                    {getRoleIcon(member.role)}
                    {member.role}
                  </Badge>
                </div>
                <div className="text-xs text-white/60">{member.email}</div>
              </div>
              
              <div className="text-xs text-white/60">
                {member.lastActive.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="nexus-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <h4 className="font-medium text-white">Shared Conversations</h4>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
              <MessageSquare className="w-4 h-4 text-white/60" />
              <div className="flex-1">
                <div className="text-white text-sm">Shared Conversation #{i}</div>
                <div className="text-white/60 text-xs">Last updated 2 hours ago</div>
              </div>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                Active
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
