
import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Smartphone, Monitor, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useChatStore } from '@/store/chatStore';

interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  lastSeen: Date;
  isActive: boolean;
}

interface SyncStatus {
  isConnected: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  devices: DeviceInfo[];
}

export const RealtimeSync: React.FC = () => {
  const { user } = useAuth();
  const { messages, sessions, currentSessionId } = useChatStore();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSync: null,
    pendingChanges: 0,
    devices: []
  });

  useEffect(() => {
    if (!user) return;

    // Subscribe to realtime changes
    const channel = supabase
      .channel('sync-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Realtime message update:', payload);
          setSyncStatus(prev => ({
            ...prev,
            lastSync: new Date(),
            pendingChanges: Math.max(0, prev.pendingChanges - 1)
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Realtime session update:', payload);
          setSyncStatus(prev => ({
            ...prev,
            lastSync: new Date()
          }));
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const devices = Object.entries(presenceState).map(([key, value]: [string, any]) => ({
          id: key,
          name: value[0]?.device_name || 'Unknown Device',
          type: value[0]?.device_type || 'desktop',
          lastSeen: new Date(value[0]?.last_seen || Date.now()),
          isActive: true
        }));
        
        setSyncStatus(prev => ({
          ...prev,
          devices,
          isConnected: true
        }));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track this device's presence
          await channel.track({
            device_name: getDeviceName(),
            device_type: getDeviceType(),
            last_seen: new Date().toISOString(),
            user_id: user.id
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getDeviceName = () => {
    const userAgent = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS Device';
    if (/Android/.test(userAgent)) return 'Android Device';
    if (/Windows/.test(userAgent)) return 'Windows PC';
    if (/Mac/.test(userAgent)) return 'Mac';
    return 'Unknown Device';
  };

  const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
    const userAgent = navigator.userAgent;
    if (/iPhone|iPod/.test(userAgent)) return 'mobile';
    if (/iPad/.test(userAgent)) return 'tablet';
    if (/Android/.test(userAgent)) {
      return /Mobile/.test(userAgent) ? 'mobile' : 'tablet';
    }
    return 'desktop';
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <Card className="nexus-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {syncStatus.isConnected ? (
            <Wifi className="w-5 h-5 text-green-400" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-400" />
          )}
          <h3 className="text-lg font-semibold text-white">Realtime Sync</h3>
        </div>
        <Badge 
          variant="secondary" 
          className={syncStatus.isConnected 
            ? 'bg-green-500/20 text-green-300' 
            : 'bg-red-500/20 text-red-300'
          }
        >
          {syncStatus.isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-3 rounded-lg">
            <div className="text-sm text-white/60">Last Sync</div>
            <div className="text-white font-medium">
              {syncStatus.lastSync 
                ? syncStatus.lastSync.toLocaleTimeString()
                : 'Never'
              }
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <div className="text-sm text-white/60">Pending Changes</div>
            <div className="text-white font-medium">{syncStatus.pendingChanges}</div>
          </div>
        </div>

        {syncStatus.devices.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-white/60" />
              <span className="text-sm font-medium text-white/80">Active Devices</span>
            </div>
            <div className="space-y-2">
              {syncStatus.devices.map((device) => (
                <div key={device.id} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                  {getDeviceIcon(device.type)}
                  <div className="flex-1">
                    <div className="text-sm text-white">{device.name}</div>
                    <div className="text-xs text-white/60">
                      Last seen: {device.lastSeen.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    device.isActive ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
