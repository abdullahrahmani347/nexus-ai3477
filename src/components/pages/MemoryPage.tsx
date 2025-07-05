
import React from 'react';
import { PersistentMemory } from '@/components/advanced/PersistentMemory';

export const MemoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent mb-2">
            AI Memory System
          </h1>
          <p className="text-white/60 text-lg">
            Manage persistent memory and knowledge retention
          </p>
        </div>
        <PersistentMemory />
      </div>
    </div>
  );
};
