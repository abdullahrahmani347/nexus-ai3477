
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileProcessor } from '@/components/advanced/FileProcessor';
import { RealtimeSync } from '@/components/advanced/RealtimeSync';
import { TeamWorkspace } from '@/components/advanced/TeamWorkspace';
import { SemanticSearch } from '@/components/advanced/SemanticSearch';
import { PersistentMemory } from '@/components/advanced/PersistentMemory';
import { ErrorMonitoring } from '@/components/monitoring/ErrorMonitoring';
import { PluginSystem } from '@/components/api/PluginSystem';
import { TestingSuite } from '@/components/testing/TestingSuite';
import { WebhookIntegration } from '@/components/advanced/WebhookIntegration';
import SessionSidebar from '@/components/SessionSidebar';
import { UserMenu } from '@/components/navigation/UserMenu';
import { NexusBranding } from '@/components/ui/nexus-branding';
import { Button } from '@/components/ui/button';

export const AdvancedFeaturesPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="flex h-screen relative z-10">
        <SessionSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  ☰
                </Button>
                
                <NexusBranding 
                  size="md"
                  subtitle="Advanced Features"
                  showStatus={true}
                  showBadge={true}
                />
              </div>
              
              <UserMenu />
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <Tabs defaultValue="file-processing" className="space-y-6">
                <TabsList className="grid w-full grid-cols-9 bg-black/20 backdrop-blur-xl border border-white/10">
                  <TabsTrigger value="file-processing" className="text-xs">Files</TabsTrigger>
                  <TabsTrigger value="realtime-sync" className="text-xs">Sync</TabsTrigger>
                  <TabsTrigger value="team-workspace" className="text-xs">Teams</TabsTrigger>
                  <TabsTrigger value="semantic-search" className="text-xs">Search</TabsTrigger>
                  <TabsTrigger value="persistent-memory" className="text-xs">Memory</TabsTrigger>
                  <TabsTrigger value="error-monitoring" className="text-xs">Monitoring</TabsTrigger>
                  <TabsTrigger value="plugin-system" className="text-xs">Plugins</TabsTrigger>
                  <TabsTrigger value="webhooks" className="text-xs">Webhooks</TabsTrigger>
                  <TabsTrigger value="testing" className="text-xs">Testing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="file-processing">
                  <FileProcessor />
                </TabsContent>
                
                <TabsContent value="realtime-sync">
                  <RealtimeSync />
                </TabsContent>
                
                <TabsContent value="team-workspace">
                  <TeamWorkspace />
                </TabsContent>
                
                <TabsContent value="semantic-search">
                  <SemanticSearch />
                </TabsContent>
                
                <TabsContent value="persistent-memory">
                  <PersistentMemory />
                </TabsContent>
                
                <TabsContent value="error-monitoring">
                  <ErrorMonitoring />
                </TabsContent>
                
                <TabsContent value="plugin-system">
                  <PluginSystem />
                </TabsContent>
                
                <TabsContent value="webhooks">
                  <WebhookIntegration />
                </TabsContent>
                
                <TabsContent value="testing">
                  <TestingSuite />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
