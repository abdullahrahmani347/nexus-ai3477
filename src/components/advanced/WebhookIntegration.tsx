
import React, { useState, useEffect } from 'react';
import { Webhook, Plus, Edit, Trash2, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastTriggered?: Date;
  status: 'active' | 'failed' | 'pending';
  description?: string;
}

export const WebhookIntegration: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    description: ''
  });

  const availableEvents = [
    'message.created',
    'message.updated',
    'session.created',
    'session.ended',
    'user.login',
    'user.logout',
    'error.occurred',
    'file.uploaded'
  ];

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = () => {
    // Mock webhooks
    const mockWebhooks: WebhookConfig[] = [
      {
        id: '1',
        name: 'Slack Notifications',
        url: 'https://hooks.slack.com/services/...',
        events: ['message.created', 'error.occurred'],
        isActive: true,
        lastTriggered: new Date(Date.now() - 300000),
        status: 'active',
        description: 'Send notifications to Slack channel'
      },
      {
        id: '2',
        name: 'Analytics Tracking',
        url: 'https://api.analytics.com/webhook',
        events: ['session.created', 'user.login'],
        isActive: true,
        lastTriggered: new Date(Date.now() - 600000),
        status: 'active',
        description: 'Track user events for analytics'
      },
      {
        id: '3',
        name: 'CRM Integration',
        url: 'https://api.crm.com/webhook',
        events: ['user.login'],
        isActive: false,
        status: 'failed',
        description: 'Sync user data with CRM'
      }
    ];
    setWebhooks(mockWebhooks);
  };

  const addWebhook = () => {
    if (!newWebhook.name.trim() || !newWebhook.url.trim()) return;

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      isActive: true,
      status: 'pending',
      description: newWebhook.description
    };

    setWebhooks(prev => [...prev, webhook]);
    setNewWebhook({ name: '', url: '', events: [], description: '' });
    setIsAddDialogOpen(false);
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(webhook =>
      webhook.id === id 
        ? { ...webhook, isActive: !webhook.isActive }
        : webhook
    ));
  };

  const testWebhook = async (webhook: WebhookConfig) => {
    try {
      const { data, error } = await supabase.functions.invoke('webhook-handler', {
        body: {
          event: 'test.webhook',
          payload: { message: 'Test webhook from Nexus AI' },
          webhookUrl: webhook.url
        }
      });

      if (error) throw error;

      setWebhooks(prev => prev.map(w =>
        w.id === webhook.id 
          ? { ...w, status: 'active' as const, lastTriggered: new Date() }
          : w
      ));
    } catch (error) {
      console.error('Webhook test failed:', error);
      setWebhooks(prev => prev.map(w =>
        w.id === webhook.id 
          ? { ...w, status: 'failed' as const }
          : w
      ));
    }
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300';
      case 'failed': return 'bg-red-500/20 text-red-300';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <div className="w-4 h-4 rounded-full bg-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="nexus-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Webhook className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Webhook Integration</h3>
              <p className="text-white/60 text-sm">Connect external services and automations</p>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Plus className="w-4 h-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="nexus-card border-white/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Add Webhook</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Name</label>
                  <Input
                    placeholder="Enter webhook name"
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">URL</label>
                  <Input
                    placeholder="https://your-service.com/webhook"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Events</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {availableEvents.map(event => (
                      <label key={event} className="flex items-center gap-2 text-sm text-white/80">
                        <input
                          type="checkbox"
                          checked={newWebhook.events.includes(event)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewWebhook(prev => ({ 
                                ...prev, 
                                events: [...prev.events, event] 
                              }));
                            } else {
                              setNewWebhook(prev => ({ 
                                ...prev, 
                                events: prev.events.filter(e => e !== event) 
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        {event}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Description</label>
                  <Input
                    placeholder="Optional description"
                    value={newWebhook.description}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <Button onClick={addWebhook} className="w-full">
                  Add Webhook
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">{webhooks.length}</div>
            <div className="text-sm text-white/60">Total Webhooks</div>
          </div>
          <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30 text-center">
            <div className="text-2xl font-bold text-green-400">
              {webhooks.filter(w => w.isActive && w.status === 'active').length}
            </div>
            <div className="text-sm text-green-300">Active</div>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30 text-center">
            <div className="text-2xl font-bold text-red-400">
              {webhooks.filter(w => w.status === 'failed').length}
            </div>
            <div className="text-sm text-red-300">Failed</div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="nexus-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-white">{webhook.name}</h4>
                  <Badge variant="secondary" className={getStatusColor(webhook.status)}>
                    {getStatusIcon(webhook.status)}
                    {webhook.status}
                  </Badge>
                  <Badge variant="secondary" className={
                    webhook.isActive 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-gray-500/20 text-gray-300'
                  }>
                    {webhook.isActive ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                
                <div className="text-sm text-white/60 mb-2">{webhook.url}</div>
                
                {webhook.description && (
                  <div className="text-sm text-white/80 mb-3">{webhook.description}</div>
                )}
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {webhook.events.map(event => (
                    <Badge key={event} variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
                
                {webhook.lastTriggered && (
                  <div className="text-xs text-white/50">
                    Last triggered: {webhook.lastTriggered.toLocaleString()}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => testWebhook(webhook)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <TestTube className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWebhook(webhook.id)}
                  className="text-white/70 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteWebhook(webhook.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
