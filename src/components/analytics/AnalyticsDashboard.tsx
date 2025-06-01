
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { MessageSquare, Clock, Zap, TrendingUp, Calendar, Users, Target, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UsageStats {
  messages_sent: number;
  tokens_used: number;
  api_calls: number;
}

interface AnalyticsData {
  totalMessages: number;
  totalSessions: number;
  avgResponseTime: number;
  favoriteModel: string;
  dailyActivity: Array<{ date: string; messages: number; tokens: number }>;
  modelUsage: Array<{ model: string; count: number; color: string }>;
  responseTypes: Array<{ type: string; count: number }>;
  timeDistribution: Array<{ hour: number; activity: number }>;
}

export function AnalyticsDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
      loadUsage();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      // Mock data for demonstration - replace with real API calls
      const mockAnalytics: AnalyticsData = {
        totalMessages: 156,
        totalSessions: 24,
        avgResponseTime: 1.2,
        favoriteModel: 'Gemini 2.0 Flash',
        dailyActivity: [
          { date: '2024-12-01', messages: 12, tokens: 1500 },
          { date: '2024-12-02', messages: 18, tokens: 2200 },
          { date: '2024-12-03', messages: 8, tokens: 980 },
          { date: '2024-12-04', messages: 22, tokens: 2800 },
          { date: '2024-12-05', messages: 15, tokens: 1800 },
          { date: '2024-12-06', messages: 25, tokens: 3100 },
          { date: '2024-12-07', messages: 19, tokens: 2300 }
        ],
        modelUsage: [
          { model: 'Gemini 2.0 Flash', count: 45, color: '#8b5cf6' },
          { model: 'Gemini 1.5 Pro', count: 32, color: '#3b82f6' },
          { model: 'Gemini 1.5 Flash', count: 18, color: '#ec4899' }
        ],
        responseTypes: [
          { type: 'Text', count: 120 },
          { type: 'Code', count: 25 },
          { type: 'Analysis', count: 11 }
        ],
        timeDistribution: [
          { hour: 9, activity: 8 },
          { hour: 10, activity: 12 },
          { hour: 11, activity: 15 },
          { hour: 12, activity: 10 },
          { hour: 13, activity: 6 },
          { hour: 14, activity: 18 },
          { hour: 15, activity: 22 },
          { hour: 16, activity: 20 },
          { hour: 17, activity: 14 }
        ]
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-white">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="flex items-center justify-center h-96 text-white">Failed to load analytics</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.totalMessages}</div>
            <p className="text-xs text-white/60">
              Across {analytics.totalSessions} sessions
            </p>
          </CardContent>
        </Card>

        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.avgResponseTime}s</div>
            <p className="text-xs text-white/60">
              Lightning fast responses
            </p>
          </CardContent>
        </Card>

        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Tokens Used</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{usage?.tokens_used || 0}</div>
            <p className="text-xs text-white/60">
              Today's usage
            </p>
          </CardContent>
        </Card>

        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Favorite Model</CardTitle>
            <Award className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">{analytics.favoriteModel}</div>
            <p className="text-xs text-white/60">
              Most used AI model
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity */}
        <Card className="nexus-card">
          <CardHeader>
            <CardTitle className="text-white">Daily Activity</CardTitle>
            <CardDescription className="text-white/60">Messages and tokens over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Area type="monotone" dataKey="messages" stroke="#8b5cf6" fill="rgba(139,92,246,0.2)" strokeWidth={2} />
                <Area type="monotone" dataKey="tokens" stroke="#3b82f6" fill="rgba(59,130,246,0.2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Model Usage */}
        <Card className="nexus-card">
          <CardHeader>
            <CardTitle className="text-white">Model Usage</CardTitle>
            <CardDescription className="text-white/60">Distribution of AI models used</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.modelUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ model, percent }) => `${model.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.modelUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Types */}
        <Card className="nexus-card">
          <CardHeader>
            <CardTitle className="text-white">Response Types</CardTitle>
            <CardDescription className="text-white/60">Types of AI responses generated</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.responseTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="type" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="count" fill="rgba(139,92,246,0.8)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity by Time */}
        <Card className="nexus-card">
          <CardHeader>
            <CardTitle className="text-white">Activity by Time</CardTitle>
            <CardDescription className="text-white/60">When you're most active</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.timeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Line type="monotone" dataKey="activity" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="nexus-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <CardTitle className="text-white">Productivity Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Most productive day</span>
                <Badge className="bg-green-500/20 text-green-300">Saturday</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Peak hours</span>
                <Badge className="bg-blue-500/20 text-blue-300">2-4 PM</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Efficiency score</span>
                <Badge className="bg-purple-500/20 text-purple-300">95%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="nexus-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-white">Goals & Achievements</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Messages this week</span>
                <span className="text-white">87/100</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
              <p className="text-sm text-white/60">13 more to reach your weekly goal!</p>
            </div>
          </CardContent>
        </Card>

        <Card className="nexus-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <CardTitle className="text-white">Streak Counter</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">7</div>
              <p className="text-white/80">Days active</p>
              <Badge className="bg-yellow-500/20 text-yellow-300">On fire! 🔥</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
