
import React, { useState } from 'react';
import { Users, Plus, Crown, Shield, User, MessageSquare, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useTeamWorkspaces } from '@/hooks/useTeamWorkspaces';
import { useAuth } from '@/hooks/useAuth';

export const TeamWorkspace: React.FC = () => {
  const { user } = useAuth();
  const { workspaces, loading, createWorkspace, inviteMember } = useTeamWorkspaces();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: ''
  });

  const handleCreateWorkspace = async () => {
    const workspace = await createWorkspace(newWorkspace.name, newWorkspace.description);
    if (workspace) {
      setNewWorkspace({ name: '', description: '' });
      setIsCreateDialogOpen(false);
    }
  };

  const handleInviteMember = async () => {
    if (!selectedWorkspace || !inviteEmail) return;
    
    const success = await inviteMember(selectedWorkspace, inviteEmail);
    if (success) {
      setInviteEmail('');
      setIsInviteDialogOpen(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <Card className="nexus-card p-6">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <h3 className="text-lg font-semibold text-white mb-2">No Team Workspaces</h3>
          <p className="text-white/60 mb-4">Create your first team workspace to collaborate</p>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                <Plus className="w-4 h-4 mr-2" />
                Create Workspace
              </Button>
            </DialogTrigger>
            <DialogContent className="nexus-card border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Create Team Workspace</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Workspace name"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newWorkspace.description}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Button onClick={handleCreateWorkspace} className="w-full">
                  Create Workspace
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {workspaces.map((workspace) => (
        <Card key={workspace.id} className="nexus-card p-6">
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
              <div className="text-2xl font-bold text-white">{workspace.member_count || 0}</div>
              <div className="text-sm text-white/60">Members</div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-white/60">Shared Chats</div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/60">Availability</div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-white">Team Members</h4>
            {workspace.owner_id === user?.id && (
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => setSelectedWorkspace(workspace.id)}
                  >
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
                    <Button onClick={handleInviteMember} className="w-full">
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-3">
            {workspace.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {(member.full_name || member.email || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor('online')}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium truncate">
                      {member.full_name || member.email}
                    </span>
                    <Badge variant="secondary" className={getRoleColor(member.role)}>
                      {getRoleIcon(member.role)}
                      {member.role}
                    </Badge>
                  </div>
                  <div className="text-xs text-white/60">{member.email}</div>
                </div>
                
                <div className="text-xs text-white/60">
                  {new Date(member.joined_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card className="nexus-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <h4 className="font-medium text-white">Shared Conversations</h4>
        </div>
        <div className="text-center py-8 text-white/60">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No shared conversations yet</p>
          <p className="text-sm">Start collaborating to see shared chats here</p>
        </div>
      </Card>

      {/* Create Workspace Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="nexus-card border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Create Team Workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Workspace name"
              value={newWorkspace.name}
              onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newWorkspace.description}
              onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
            />
            <Button onClick={handleCreateWorkspace} className="w-full">
              Create Workspace
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
