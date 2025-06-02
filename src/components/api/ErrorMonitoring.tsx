
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, TrendingUp, Clock, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  component?: string;
  userId?: string;
  sessionId?: string;
}

interface PerformanceMetric {
  timestamp: Date;
  responseTime: number;
  memoryUsage: number;
  errorRate: number;
}

const MOCK_ERRORS: ErrorLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000),
    level: 'error',
    message: 'API request failed: Network timeout',
    component: 'ChatManager',
    sessionId: 'sess_123'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 7200000),
    level: 'warning',
    message: 'High memory usage detected',
    component: 'MessageBubble'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 10800000),
    level: 'error',
    message: 'Failed to parse API response',
    component: 'StreamingService',
    stack: 'Error: JSON.parse failed\n  at parseResponse...'
  }
];

const MOCK_PERFORMANCE: PerformanceMetric[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() - (23 - i) * 3600000),
  responseTime: Math.random() * 1000 + 200,
  memoryUsage: Math.random() * 50 + 30,
  errorRate: Math.random() * 5
}));

export const ErrorMonitoring: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLog[]>(MOCK_ERRORS);
  const [performance, setPerformance] = useState<PerformanceMetric[]>(MOCK_PERFORMANCE);
  const [timeRange, setTimeRange] = useState('24h');
  const [levelFilter, setLevelFilter] = useState('all');

  const filteredErrors = errors.filter(error => {
    if (levelFilter !== 'all' && error.level !== levelFilter) return false;
    
    const now = new Date();
    const timeThreshold = new Date();
    
    switch (timeRange) {
      case '1h':
        timeThreshold.setHours(now.getHours() - 1);
        break;
      case '24h':
        timeThreshold.setHours(now.getHours() - 24);
        break;
      case '7d':
        timeThreshold.setDate(now.getDate() - 7);
        break;
      default:
        return true;
    }
    
    return error.timestamp >= timeThreshold;
  });

  const getLevelColor = (level: ErrorLog['level']) => {
    switch (level) {
      case 'error': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getLevelIcon = (level: ErrorLog['level']) => {
    switch (level) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const errorCounts = {
    total: filteredErrors.length,
    errors: filteredErrors.filter(e => e.level === 'error').length,
    warnings: filteredErrors.filter(e => e.level === 'warning').length,
    info: filteredErrors.filter(e => e.level === 'info').length
  };

  const avgResponseTime = performance.reduce((acc, p) => acc + p.responseTime, 0) / performance.length;
  const avgMemoryUsage = performance.reduce((acc, p) => acc + p.memoryUsage, 0) / performance.length;
  const avgErrorRate = performance.reduce((acc, p) => acc + p.errorRate, 0) / performance.length;

  return (
    <div className="nexus-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Error Monitoring</h3>
            <p className="text-white/60 text-sm">Real-time error tracking and analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-24 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="1h">1H</SelectItem>
              <SelectItem value="24h">24H</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
            </SelectContent>
          </Select>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="error">Errors</SelectItem>
              <SelectItem value="warning">Warnings</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="nexus-card p-4 text-center">
          <div className="text-2xl font-bold text-white">{errorCounts.total}</div>
          <div className="text-sm text-white/60">Total Events</div>
        </Card>
        <Card className="nexus-card p-4 text-center border-red-500/30 bg-red-500/10">
          <div className="text-2xl font-bold text-red-300">{errorCounts.errors}</div>
          <div className="text-sm text-white/60">Errors</div>
        </Card>
        <Card className="nexus-card p-4 text-center border-yellow-500/30 bg-yellow-500/10">
          <div className="text-2xl font-bold text-yellow-300">{errorCounts.warnings}</div>
          <div className="text-sm text-white/60">Warnings</div>
        </Card>
        <Card className="nexus-card p-4 text-center border-blue-500/30 bg-blue-500/10">
          <div className="text-2xl font-bold text-blue-300">{errorCounts.info}</div>
          <div className="text-sm text-white/60">Info</div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="nexus-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white/80">Avg Response Time</span>
          </div>
          <div className="text-2xl font-bold text-white">{Math.round(avgResponseTime)}ms</div>
          <div className="text-xs text-green-400">↓ 12% from yesterday</div>
        </Card>

        <Card className="nexus-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white/80">Memory Usage</span>
          </div>
          <div className="text-2xl font-bold text-white">{Math.round(avgMemoryUsage)}%</div>
          <div className="text-xs text-yellow-400">↑ 3% from yesterday</div>
        </Card>

        <Card className="nexus-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-white/80">Error Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">{avgErrorRate.toFixed(2)}%</div>
          <div className="text-xs text-green-400">↓ 8% from yesterday</div>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="nexus-card p-4">
        <h4 className="font-semibold text-white mb-4">Performance Over Time</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Line type="monotone" dataKey="responseTime" stroke="#3B82F6" name="Response Time (ms)" />
              <Line type="monotone" dataKey="errorRate" stroke="#EF4444" name="Error Rate (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Errors */}
      <Card className="nexus-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-white">Recent Events</h4>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredErrors.map(error => (
            <div key={error.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getLevelIcon(error.level)}
                  <div className="flex-1">
                    <div className="font-medium text-white">{error.message}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
                      <span>{error.timestamp.toLocaleString()}</span>
                      {error.component && <span>• {error.component}</span>}
                      {error.sessionId && <span>• Session: {error.sessionId}</span>}
                    </div>
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="text-xs text-white/50 cursor-pointer hover:text-white/70">
                          Stack trace
                        </summary>
                        <pre className="text-xs text-white/50 mt-1 p-2 bg-black/20 rounded overflow-x-auto">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
                
                <Badge variant="outline" className={getLevelColor(error.level)}>
                  {error.level}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
