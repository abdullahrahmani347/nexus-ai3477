
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Users, Upload, Search, Monitor, BarChart3 } from 'lucide-react';
import { PersistentMemory } from '@/components/advanced/PersistentMemory';
import { TeamWorkspace } from '@/components/advanced/TeamWorkspace';
import { FileProcessor } from '@/components/advanced/FileProcessor';
import { SemanticSearch } from '@/components/advanced/SemanticSearch';
import { ErrorMonitoring } from '@/components/monitoring/ErrorMonitoring';
import { UserAnalytics } from '@/components/UserAnalytics';

export const AdvancedFeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Advanced Features
          </h1>
          <p className="text-white/60 text-lg">
            Unlock the full potential of NexusAI with advanced capabilities
          </p>
        </div>

        <Tabs defaultValue="memory" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black/20 border border-white/10">
            <TabsTrigger value="memory" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Files
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="memory" className="mt-6">
            <PersistentMemory />
          </TabsContent>

          <TabsContent value="teams" className="mt-6">
            <TeamWorkspace />
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <FileProcessor />
          </TabsContent>

          <TabsContent value="search" className="mt-6">
            <SemanticSearch />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <ErrorMonitoring />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <UserAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
