
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
      <Card className="nexus-card">
        <CardHeader>
          <CardTitle className="text-white">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/80">Email</Label>
            <Input value={profile.email} disabled className="bg-white/5 border-white/10 text-white" />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white/80">Full Name</Label>
            {editing ? (
              <div className="flex gap-2">
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button onClick={updateProfile} disabled={loading} className="nexus-button">
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)} className="border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <Input value={profile.full_name || 'Not set'} disabled className="bg-white/5 border-white/10 text-white" />
                <Button onClick={() => setEditing(true)} className="ml-2 nexus-button">Edit</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="nexus-card">
        <CardHeader>
          <CardTitle className="text-white">Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge className={getTierColor(subscription?.tier || 'free')}>
              {subscription?.tier?.toUpperCase() || 'FREE'}
            </Badge>
            <span className="text-sm text-white/60">
              Status: {subscription?.status || 'Active'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="nexus-card">
        <CardHeader>
          <CardTitle className="text-white">Today's Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{usage?.messages_sent || 0}</div>
              <div className="text-sm text-white/60">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{usage?.tokens_used || 0}</div>
              <div className="text-sm text-white/60">Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{usage?.api_calls || 0}</div>
              <div className="text-sm text-white/60">API Calls</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
