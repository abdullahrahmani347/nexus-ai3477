
import React, { useState, useEffect } from 'react';
import { Puzzle, Settings, Play, Square, Code, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  category: 'utility' | 'integration' | 'enhancement' | 'analytics';
  permissions: string[];
  config?: Record<string, any>;
}

const AVAILABLE_PLUGINS: Plugin[] = [
  {
    id: 'code-highlighter',
    name: 'Code Syntax Highlighter',
    version: '1.2.0',
    description: 'Automatically highlights code blocks in conversations',
    author: 'Nexus AI Team',
    enabled: true,
    category: 'enhancement',
    permissions: ['message-processing']
  },
  {
    id: 'conversation-analytics',
    name: 'Advanced Analytics',
    version: '2.1.0',
    description: 'Provides detailed conversation insights and metrics',
    author: 'Nexus AI Team',
    enabled: false,
    category: 'analytics',
    permissions: ['data-access', 'analytics']
  },
  {
    id: 'api-monitor',
    name: 'API Performance Monitor',
    version: '1.0.5',
    description: 'Monitors API response times and error rates',
    author: 'Community',
    enabled: false,
    category: 'utility',
    permissions: ['network-access', 'monitoring']
  },
  {
    id: 'webhook-integration',
    name: 'Webhook Integration',
    version: '1.3.2',
    description: 'Send conversation events to external webhooks',
    author: 'Nexus AI Team',
    enabled: false,
    category: 'integration',
    permissions: ['network-access', 'webhooks']
  }
];

export const PluginSystem: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>(AVAILABLE_PLUGINS);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  const togglePlugin = (pluginId: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === pluginId 
        ? { ...plugin, enabled: !plugin.enabled }
        : plugin
    ));
  };

  const getCategoryColor = (category: Plugin['category']) => {
    switch (category) {
      case 'utility': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'integration': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'enhancement': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'analytics': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const enabledPlugins = plugins.filter(p => p.enabled);

  return (
    <div className="nexus-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Puzzle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Plugin System</h3>
            <p className="text-white/60 text-sm">Extend Nexus AI functionality</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            {enabledPlugins.length} Active
          </Badge>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" />
            Browse Store
          </Button>
        </div>
      </div>

      {/* Active Plugins Summary */}
      {enabledPlugins.length > 0 && (
        <div className="nexus-card p-4 border border-green-500/30 bg-green-500/10">
          <h4 className="font-medium text-green-300 mb-2">Active Plugins</h4>
          <div className="flex flex-wrap gap-2">
            {enabledPlugins.map(plugin => (
              <Badge 
                key={plugin.id} 
                variant="secondary" 
                className="bg-green-500/20 text-green-300 text-xs"
              >
                {plugin.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Plugin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plugins.map(plugin => (
          <Card key={plugin.id} className="nexus-card p-4 border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white">{plugin.name}</h4>
                  <Badge variant="secondary" className={getCategoryColor(plugin.category)}>
                    {plugin.category}
                  </Badge>
                </div>
                <p className="text-sm text-white/60 mb-2">{plugin.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span>v{plugin.version}</span>
                  <span>by {plugin.author}</span>
                </div>
              </div>
              
              <Switch
                checked={plugin.enabled}
                onCheckedChange={() => togglePlugin(plugin.id)}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex flex-wrap gap-1">
                {plugin.permissions.slice(0, 2).map(permission => (
                  <Badge 
                    key={permission} 
                    variant="outline" 
                    className="text-xs border-white/20 text-white/60"
                  >
                    {permission}
                  </Badge>
                ))}
                {plugin.permissions.length > 2 && (
                  <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                    +{plugin.permissions.length - 2}
                  </Badge>
                )}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/70 hover:text-white"
                    onClick={() => setSelectedPlugin(plugin)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="nexus-card border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">{plugin.name} Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white/80">Plugin Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Switch
                          checked={plugin.enabled}
                          onCheckedChange={() => togglePlugin(plugin.id)}
                        />
                        <span className="text-sm text-white/60">
                          {plugin.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-white/80">Permissions</label>
                      <div className="mt-1 space-y-2">
                        {plugin.permissions.map(permission => (
                          <div key={permission} className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                              {permission}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>

      {/* Plugin Development */}
      <div className="nexus-card p-4 border border-purple-500/30 bg-purple-500/10">
        <div className="flex items-center gap-2 mb-2">
          <Code className="w-4 h-4 text-purple-400" />
          <h4 className="font-medium text-purple-300">Plugin Development</h4>
        </div>
        <p className="text-sm text-white/60 mb-3">
          Create custom plugins to extend Nexus AI functionality with our development SDK.
        </p>
        <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
          <Code className="w-4 h-4 mr-2" />
          View Documentation
        </Button>
      </div>
    </div>
  );
};
