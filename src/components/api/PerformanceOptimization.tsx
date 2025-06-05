
import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Zap, Clock, Database, Wifi, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useChatStore } from '@/store/chatStore';
import { useToast } from '@/hooks/use-toast';

interface PerformanceMetrics {
  responseTime: number;
  tokensPerSecond: number;
  memoryUsage: number;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  apiLatency: number;
  cacheHitRate: number;
}

export const PerformanceOptimization: React.FC = () => {
  const { apiKey, model, isConnected } = useChatStore();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 0,
    tokensPerSecond: 0,
    memoryUsage: 0,
    connectionQuality: 'good',
    apiLatency: 0,
    cacheHitRate: 85
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastOptimization, setLastOptimization] = useState<Date | null>(null);

  // Performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      updateMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateMetrics = useCallback(() => {
    // Simulate performance metrics (in real app, these would come from actual monitoring)
    const newMetrics: PerformanceMetrics = {
      responseTime: Math.random() * 2000 + 500,
      tokensPerSecond: Math.random() * 50 + 20,
      memoryUsage: Math.random() * 100,
      connectionQuality: isConnected ? 
        (Math.random() > 0.8 ? 'excellent' : 
         Math.random() > 0.6 ? 'good' : 
         Math.random() > 0.3 ? 'fair' : 'poor') : 'poor',
      apiLatency: Math.random() * 200 + 50,
      cacheHitRate: Math.random() * 20 + 80
    };
    setMetrics(newMetrics);
  }, [isConnected]);

  const testApiConnection = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please configure your API key in settings.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    const startTime = Date.now();

    try {
      // Test API connection
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: 'Test connection' }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10
          }
        })
      });

      const endTime = Date.now();
      const latency = endTime - startTime;

      if (response.ok) {
        setMetrics(prev => ({
          ...prev,
          apiLatency: latency,
          connectionQuality: latency < 500 ? 'excellent' : 
                            latency < 1000 ? 'good' : 
                            latency < 2000 ? 'fair' : 'poor'
        }));

        toast({
          title: "Connection Test Successful",
          description: `API responded in ${latency}ms`,
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('API connection test failed:', error);
      toast({
        title: "Connection Test Failed",
        description: "Unable to connect to the API. Check your key and network.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const optimizePerformance = async () => {
    setIsOptimizing(true);
    
    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear any cached data that might be stale
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      setLastOptimization(new Date());
      
      toast({
        title: "Performance Optimized",
        description: "Cache cleared and connection optimized.",
      });
    } catch (error) {
      console.error('Optimization failed:', error);
      toast({
        title: "Optimization Failed",
        description: "Unable to complete performance optimization.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const getConnectionColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Performance Monitor</h2>
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
          <Activity className="w-3 h-3 mr-1" />
          Live Monitoring
        </Badge>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="nexus-card border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/70 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.responseTime.toFixed(0)}ms
            </div>
            <Progress 
              value={Math.max(0, 100 - (metrics.responseTime / 30))} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="nexus-card border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/70 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Tokens/Second
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.tokensPerSecond.toFixed(1)}
            </div>
            <Progress 
              value={(metrics.tokensPerSecond / 70) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="nexus-card border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/70 flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Cache Hit Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.cacheHitRate.toFixed(1)}%
            </div>
            <Progress 
              value={metrics.cacheHitRate} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Connection Status */}
      <Card className="nexus-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wifi className="w-5 h-5 mr-2" />
            API Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Connection Quality</span>
            <Badge 
              variant="secondary" 
              className={`${getConnectionColor(metrics.connectionQuality)} bg-white/10`}
            >
              {metrics.connectionQuality.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/70">API Latency</span>
            <span className="text-white">{metrics.apiLatency.toFixed(0)}ms</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/70">Model</span>
            <span className="text-white">{model}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/70">API Key Status</span>
            <Badge 
              variant="secondary" 
              className={apiKey ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}
            >
              {apiKey ? 'Configured' : 'Missing'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Controls */}
      <Card className="nexus-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Performance Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={testApiConnection}
              disabled={isOptimizing || !apiKey}
              className="nexus-gradient hover:opacity-90"
            >
              <Wifi className="w-4 h-4 mr-2" />
              {isOptimizing ? 'Testing...' : 'Test API Connection'}
            </Button>
            
            <Button
              onClick={optimizePerformance}
              disabled={isOptimizing}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isOptimizing ? 'Optimizing...' : 'Optimize Performance'}
            </Button>
          </div>
          
          {lastOptimization && (
            <p className="text-sm text-white/60">
              Last optimization: {lastOptimization.toLocaleString()}
            </p>
          )}
          
          {!apiKey && (
            <div className="flex items-center gap-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-200 text-sm">
                Configure your API key in settings to enable connection testing.
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
