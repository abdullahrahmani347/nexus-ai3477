
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Settings, Bell, Shield, Palette, Globe } from 'lucide-react';

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

interface UserSettings {
  theme: string;
  notifications: boolean;
  language: string;
  privacy_mode: boolean;
}

export function ProfileManagement() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    notifications: true,
    language: 'en',
    privacy_mode: false
  });
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadSubscription();
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-blue-500';
      case 'enterprise': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U';
  };

  if (!profile) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Profile Information */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="nexus-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-white">Profile Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-purple-500/20 text-purple-300 text-lg">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-white">{profile.full_name || 'Not set'}</h3>
                <p className="text-white/60">{profile.email}</p>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Profile Fields */}
            <div className="space-y-4">
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
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="nexus-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-white">Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white/80">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => setSettings({...settings, theme: value})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Language</Label>
                <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <Label className="text-white/80">Notifications</Label>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <Label className="text-white/80">Privacy Mode</Label>
                </div>
                <Switch
                  checked={settings.privacy_mode}
                  onCheckedChange={(checked) => setSettings({...settings, privacy_mode: checked})}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Subscription Status */}
        <Card className="nexus-card">
          <CardHeader>
            <CardTitle className="text-white">Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getTierColor(subscription?.tier || 'free')}>
                {subscription?.tier?.toUpperCase() || 'FREE'}
              </Badge>
              <span className="text-sm text-white/60">
                Status: {subscription?.status || 'Active'}
              </span>
            </div>
            <Button className="w-full nexus-button">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="nexus-card">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              <Palette className="w-4 h-4 mr-2" />
              Customize Theme
            </Button>
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              <Globe className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Settings
            </Button>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card className="nexus-card">
          <CardHeader>
            <CardTitle className="text-white">Account Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Member since</span>
                <span className="text-white">Dec 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Total sessions</span>
                <span className="text-white">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Messages sent</span>
                <span className="text-white">156</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
