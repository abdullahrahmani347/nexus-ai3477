
import React from 'react';
import { DeveloperAPI } from '@/components/api/DeveloperAPI';

export const APIPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Developer API
          </h1>
          <p className="text-white/60 text-lg">
            Integrate NexusAI into your applications with our powerful API
          </p>
        </div>
        <DeveloperAPI />
      </div>
    </div>
  );
};
