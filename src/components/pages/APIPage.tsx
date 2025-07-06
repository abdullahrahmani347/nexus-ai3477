
import React from 'react';
import { DeveloperAPI } from '@/components/api/DeveloperAPI';
import { PageLayout } from '@/components/layout/PageLayout';

export const APIPage: React.FC = () => {
  return (
    <PageLayout 
      title="Developer API Hub" 
      subtitle="Integrate Nexus AI into your applications with our powerful API"
    >
      <div className="container-brand py-8">
        <DeveloperAPI />
      </div>
    </PageLayout>
  );
};
