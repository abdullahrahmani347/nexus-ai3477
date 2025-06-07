
import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Clock, Bug } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ErrorEvent {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  component?: string;
  userAgent?: string;
  url?: string;
  resolved: boolean;
}

interface ErrorStats {
  total: number;
  lastHour: number;
  trend: 'up' | 'down' | 'stable';
  topErrors: Array<{ message: string; count: number }>;
}

export const ErrorMonitoring: React.FC = () => {
  const [errors, setErrors] = useState<ErrorEvent[]>([]);
  const [stats, setStats] = useState<ErrorStats>({
    total: 0,
    lastHour: 0,
    trend: 'stable',
    topErrors: []
  });

  useEffect(() => {
    loadErrorData();
    
    // Set up error listener
    const handleError = (event: ErrorEvent) => {
      console.error('Captured error:', event);
      setErrors(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 errors
    };

    window.addEventListener('error', (e) => {
      handleError({
        id: Date.now().toString(),
        message: e.message,
        stack: e.error?.stack,
        timestamp: new Date(),
        severity: 'medium',
        component: 'Global',
        url: window.location.href,
        userAgent: navigator.userAgent,
        resolved: false
      });
    });

    return () => {
      window.removeEventListener('error', handleError as any);
    };
  }, []);

  const loadErrorData = () => {
    // Mock error data
    const mockErrors: ErrorEvent[] = [
      {
        id: '1',
        message: 'Failed to fetch user data',
        timestamp: new Date(Date.now() - 300000),
        severity: 'high',
        component: 'UserProfile',
        resolved: false
      },
      {
        id: '2',
        message: 'Network timeout',
        timestamp: new Date(Date.now() - 600000),
        severity: 'medium',
        component: 'API',
        resolved: true
      },
      {
        id: '3',
        message: 'Invalid token',
        timestamp: new Date(Date.now() - 900000),
        severity: 'critical',
        component: 'Auth',
        resolved: false
      }
    ];

    setErrors(mockErrors);
    setStats({
      total: 156,
      lastHour: 12,
      trend: 'down',
      topErrors: [
        { message: 'Network timeout', count: 45 },
        { message: 'Failed to fetch user data', count: 23 },
        { message: 'Invalid token', count: 18 }
      ]
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const resolveError = (id: string) => {
    setErrors(prev => prev.map(error => 
      error.id === id ? { ...error, resolved: true } : error
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="nexus-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Bug className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Error Monitoring</h3>
            <p className="text-white/60 text-sm">Real-time error tracking and analytics</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Total Errors</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Last Hour</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.lastHour}</div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Trend</span>
              {stats.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-red-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-400" />
              )}
            </div>
            <div className={`text-2xl font-bold ${
              stats.trend === 'up' ? 'text-red-400' : 'text-green-400'
            }`}>
              {stats.trend === 'up' ? '↑' : '↓'} {Math.abs(15)}%
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Resolved</span>
              <div className="w-4 h-4 rounded-full bg-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {errors.filter(e => e.resolved).length}
            </div>
          </div>
        </div>
      </Card>

      <Card className="nexus-card p-6">
        <h4 className="font-semibold text-white mb-4">Recent Errors</h4>
        <div className="space-y-3">
          {errors.slice(0, 10).map((error) => (
            <div key={error.id} className={`p-4 rounded-lg border ${
              error.resolved 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{error.message}</span>
                    <Badge variant="secondary" className={getSeverityColor(error.severity)}>
                      {error.severity}
                    </Badge>
                    {error.resolved && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                        Resolved
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-white/60 space-x-4">
                    <span>{error.component}</span>
                    <span>{error.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                {!error.resolved && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resolveError(error.id)}
                    className="border-green-500/30 text-green-300 hover:bg-green-500/20"
                  >
                    Resolve
                  </Button>
                )}
              </div>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-white/60 cursor-pointer">Stack trace</summary>
                  <pre className="text-xs text-white/50 mt-1 overflow-x-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="nexus-card p-6">
        <h4 className="font-semibold text-white mb-4">Top Error Types</h4>
        <div className="space-y-3">
          {stats.topErrors.map((error, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white">{error.message}</span>
              <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                {error.count} occurrences
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
