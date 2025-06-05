
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Zap, Clock, TrendingUp } from 'lucide-react';

interface UsageStats {
  messages_sent: number;
  tokens_used: number;
  api_calls: number;
  date: string;
}

interface UserAnalyticsProps {
  className?: string;
}

export const UserAnalytics: React.FC<UserAnalyticsProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageStats[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalMessages: 0,
    totalTokens: 0,
    totalApiCalls: 0,
    totalSessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load usage tracking data for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: usageData, error: usageError } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (usageError) throw usageError;

      // Load total sessions count
      const { count: sessionsCount, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (sessionsError) throw sessionsError;

      // Calculate totals
      const totals = usageData?.reduce(
        (acc, day) => ({
          totalMessages: acc.totalMessages + day.messages_sent,
          totalTokens: acc.totalTokens + day.tokens_used,
          totalApiCalls: acc.totalApiCalls + day.api_calls,
          totalSessions: sessionsCount || 0
        }),
        { totalMessages: 0, totalTokens: 0, totalApiCalls: 0, totalSessions: 0 }
      ) || { totalMessages: 0, totalTokens: 0, totalApiCalls: 0, totalSessions: sessionsCount || 0 };

      setUsageData(usageData || []);
      setTotalStats(totals);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <p className="text-white/60">Please sign in to view your analytics</p>
      </div>
    );
  }

  const chartData = usageData.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    messages: day.messages_sent,
    tokens: day.tokens_used,
    apiCalls: day.api_calls
  }));

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
          Last 30 Days
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStats.totalMessages}</div>
            <p className="text-xs text-white/60">Across {totalStats.totalSessions} sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Tokens Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStats.totalTokens.toLocaleString()}</div>
            <p className="text-xs text-white/60">Processing power</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              API Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStats.totalApiCalls}</div>
            <p className="text-xs text-white/60">AI interactions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStats.totalSessions}</div>
            <p className="text-xs text-white/60">Chat sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Daily Messages</CardTitle>
            <CardDescription className="text-white/60">
              Message activity over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar 
                  dataKey="messages" 
                  fill="url(#purpleGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Token Usage</CardTitle>
            <CardDescription className="text-white/60">
              Processing efficiency over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  );
};
