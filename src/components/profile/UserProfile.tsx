
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

interface Subscription {
  tier: 'free' | 'pro' | 'enterprise';
  status: string;
}

interface UsageStats {
  messages_sent: number;
  tokens_used: number;
  api_calls: number;
}

export function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadSubscription();
      loadUsage();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (error) {
      toast.error('Failed to load profile');
      return;
    }

    setProfile(data);
    setFullName(data.full_name || '');
  };

  const loadSubscription = async () => {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('tier, status')
      .eq('user_id', user?.id)
      .single();

    if (error) {
      console.error('Failed to load subscription:', error);
      return;
    }

    setSubscription(data);
  };

  const loadUsage = async () => {
    const { data, error } = await supabase
      .from('usage_tracking')
      .select('messages_sent, tokens_used, api_calls')
      .eq('user_id', user?.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to load usage:', error);
      return;
    }

    setUsage(data || { messages_sent: 0, tokens_used: 0, api_calls: 0 });
  };

  const updateProfile = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user?.id);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
      setEditing(false);
      loadProfile();
    }
    setLoading(false);
  };

  if (!profile) return null;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-blue-500';
      case 'enterprise': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email} disabled />
          </div>
          
          <div className="space-y-2">
            <Label>Full Name</Label>
            {editing ? (
              <div className="flex gap-2">
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Button onClick={updateProfile} disabled={loading}>
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <Input value={profile.full_name || 'Not set'} disabled />
                <Button onClick={() => setEditing(true)}>Edit</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge className={getTierColor(subscription?.tier || 'free')}>
              {subscription?.tier?.toUpperCase() || 'FREE'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Status: {subscription?.status || 'Active'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{usage?.messages_sent || 0}</div>
              <div className="text-sm text-muted-foreground">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{usage?.tokens_used || 0}</div>
              <div className="text-sm text-muted-foreground">Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{usage?.api_calls || 0}</div>
              <div className="text-sm text-muted-foreground">API Calls</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
