
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users, MessageSquare, Share2, Settings, Crown, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TeamSpace {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  sharedSessions: number;
  createdAt: Date;
  ownerId: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
}

export const TeamSpaces: React.FC = () => {
  const { user } = useAuth();
  const [teamSpaces, setTeamSpaces] = useState<TeamSpace[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');

  useEffect(() => {
    loadTeamSpaces();
  }, []);

  const loadTeamSpaces = async () => {
    // Mock data for team spaces
    const mockSpaces: TeamSpace[] = [
      {
        id: '1',
        name: 'Marketing Team',
        description: 'Collaborative space for marketing campaigns and content creation',
        members: [
          { id: '1', name: 'John Doe', email: 'john@company.com', role: 'owner' },
          { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'admin' },
          { id: '3', name: 'Bob Wilson', email: 'bob@company.com', role: 'member' }
        ],
        sharedSessions: 12,
        createdAt: new Date(),
        ownerId: '1'
      },
      {
        id: '2',
        name: 'Product Development',
        description: 'Space for product discussions and feature planning',
        members: [
          { id: '4', name: 'Alice Johnson', email: 'alice@company.com', role: 'owner' },
          { id: '5', name: 'Charlie Brown', email: 'charlie@company.com', role: 'member' }
        ],
        sharedSessions: 8,
        createdAt: new Date(),
        ownerId: '4'
      }
    ];
    setTeamSpaces(mockSpaces);
  };

  const createTeamSpace = async () => {
    if (!newSpaceName.trim()) return;

    const newSpace: TeamSpace = {
      id: Date.now().toString(),
      name: newSpaceName,
      description: newSpaceDescription,
      members: [
        {
          id: user?.id || '1',
          name: user?.user_metadata?.full_name || 'Current User',
          email: user?.email || 'user@example.com',
          role: 'owner'
        }
      ],
      sharedSessions: 0,
      createdAt: new Date(),
      ownerId: user?.id || '1'
    };

    setTeamSpaces(prev => [...prev, newSpace]);
    setNewSpaceName('');
    setNewSpaceDescription('');
    setIsCreateDialogOpen(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Spaces</h1>
          <p className="text-muted-foreground">Collaborate with your team on AI conversations</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Space
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Team Space</DialogTitle>
              <DialogDescription>
                Create a new collaborative space for your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="space-name">Space Name</Label>
                <Input
                  id="space-name"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="Enter space name"
                />
              </div>
              <div>
                <Label htmlFor="space-description">Description</Label>
                <Textarea
                  id="space-description"
                  value={newSpaceDescription}
                  onChange={(e) => setNewSpaceDescription(e.target.value)}
                  placeholder="Describe the purpose of this space"
                />
              </div>
              <Button onClick={createTeamSpace} className="w-full">
                Create Space
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamSpaces.map((space) => (
          <Card key={space.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {space.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {space.description}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {space.sharedSessions} sessions
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {space.members.length} members
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Members</span>
                  <Button variant="ghost" size="sm">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {space.members.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={getRoleColor(member.role)}>
                        {member.role === 'owner' && <Crown className="h-3 w-3 mr-1" />}
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                  {space.members.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{space.members.length - 3} more members
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Enter Space
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
