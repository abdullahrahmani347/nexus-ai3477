
import React, { useState } from 'react';
import { Zap, Monitor, Database, Wifi, Settings, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OptimizationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  value?: number;
  type: 'boolean' | 'range';
  min?: number;
  max?: number;
  impact: 'low' | 'medium' | 'high';
}

const OPTIMIZATION_SETTINGS: OptimizationSetting[] = [
  {
    id: 'message-caching',
    name: 'Message Caching',
    description: 'Cache frequently accessed messages for faster loading',
    enabled: true,
    type: 'boolean',
    impact: 'high'
  },
  {
    id: 'lazy-loading',
    name: 'Lazy Loading',
    description: 'Load messages progressively as user scrolls',
    enabled: true,
    type: 'boolean',
    impact: 'medium'
  },
  {
    id: 'compression',
    name: 'Response Compression',
    description: 'Compress API responses to reduce bandwidth',
    enabled: false,
    type: 'boolean',
    impact: 'medium'
  },
  {
    id: 'prefetch-size',
    name: 'Prefetch Buffer Size',
    description: 'Number of messages to prefetch ahead',
    enabled: true,
    value: 20,
    type: 'range',
    min: 5,
    max: 50,
    impact: 'low'
  },
  {
    id: 'debounce-delay',
    name: 'Input Debounce (ms)',
    description: 'Delay before processing user input',
    enabled: true,
    value: 300,
    type: 'range',
    min: 100,
    max: 1000,
    impact: 'low'
  }
];

const PERFORMANCE_DATA = Array.from({ length: 12 }, (_, i) => ({
  time: `${i + 1}h`,
  responseTime: Math.random() * 500 + 200,
  throughput: Math.random() * 100 + 50,
  memoryUsage: Math.random() * 30 + 40
}));

export const PerformanceOptimization: React.FC = () => {
  const [settings, setSettings] = useState<OptimizationSetting[]>(OPTIMIZATION_SETTINGS);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  const updateSetting = (id: string, field: 'enabled' | 'value', value: boolean | number) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, [field]: value } : setting
    ));
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setOptimizationProgress(i);
    }
    
    setIsOptimizing(false);
  };

  const getImpactColor = (impact: OptimizationSetting['impact']) => {
    switch (impact) {
      case 'high': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const enabledOptimizations = settings.filter(s => s.enabled).length;
  const totalOptimizations = settings.length;

  return (
    <div className="nexus-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Performance Optimization</h3>
            <p className="text-white/60 text-sm">Fine-tune system performance</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right text-sm">
            <div className="text-white font-medium">{enabledOptimizations}/{totalOptimizations}</div>
            <div className="text-white/60">Active</div>
          </div>
          <Button 
            onClick={runOptimization} 
            disabled={isOptimizing}
            className="nexus-gradient"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isOptimizing ? 'Optimizing...' : 'Auto-Optimize'}
          </Button>
        </div>
      </div>

      {/* Optimization Progress */}
      {isOptimizing && (
        <Card className="nexus-card p-4 border-green-500/30 bg-green-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-300 font-medium">Optimizing Performance...</span>
            <span className="text-green-300 text-sm">{optimizationProgress}%</span>
          </div>
          <Progress value={optimizationProgress} className="h-2" />
        </Card>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="nexus-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white/80">Response Time</span>
          </div>
          <div className="text-2xl font-bold text-white">285ms</div>
          <div className="text-xs text-green-400">↓ 15% improved</div>
        </Card>

        <Card className="nexus-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white/80">Memory Usage</span>
          </div>
          <div className="text-2xl font-bold text-white">42MB</div>
          <div className="text-xs text-green-400">↓ 8% optimized</div>
        </Card>

        <Card className="nexus-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white/80">Throughput</span>
          </div>
          <div className="text-2xl font-bold text-white">127 req/s</div>
          <div className="text-xs text-green-400">↑ 22% increased</div>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="nexus-card p-4">
        <h4 className="font-semibold text-white mb-4">Performance Trends</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PERFORMANCE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
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
              <Line type="monotone" dataKey="throughput" stroke="#10B981" name="Throughput (req/s)" />
              <Line type="monotone" dataKey="memoryUsage" stroke="#F59E0B" name="Memory Usage (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Optimization Settings */}
      <Card className="nexus-card p-4">
        <h4 className="font-semibold text-white mb-4">Optimization Settings</h4>
        <div className="space-y-4">
          {settings.map(setting => (
            <div key={setting.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-white">{setting.name}</h5>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getImpactColor(setting.impact)}`}>
                      {setting.impact} impact
                    </span>
                  </div>
                  <p className="text-sm text-white/60">{setting.description}</p>
                </div>
                
                {setting.type === 'boolean' && (
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={(checked) => updateSetting(setting.id, 'enabled', checked)}
                  />
                )}
              </div>

              {setting.type === 'range' && setting.enabled && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/70">Value: {setting.value}</span>
                    <span className="text-xs text-white/50">{setting.min} - {setting.max}</span>
                  </div>
                  <Slider
                    value={[setting.value || setting.min || 0]}
                    onValueChange={([value]) => updateSetting(setting.id, 'value', value)}
                    min={setting.min || 0}
                    max={setting.max || 100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Recommendations */}
      <Card className="nexus-card p-4 border border-blue-500/30 bg-blue-500/10">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold text-blue-300">Performance Recommendations</h4>
        </div>
        <div className="space-y-2 text-sm text-white/70">
          <div>• Enable response compression to reduce bandwidth usage by ~30%</div>
          <div>• Consider increasing prefetch buffer size for users with faster connections</div>
          <div>• Monitor memory usage during peak hours for potential optimization</div>
          <div>• Implement service worker caching for offline message access</div>
        </div>
      </Card>
    </div>
  );
};
