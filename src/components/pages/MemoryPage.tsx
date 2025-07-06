
import React from 'react';
import { PersistentMemory } from '@/components/advanced/PersistentMemory';
import { PageLayout } from '@/components/layout/PageLayout';

export const MemoryPage: React.FC = () => {
  return (
    <PageLayout 
      title="AI Memory System" 
      subtitle="Manage persistent memory and knowledge retention"
    >
      <div className="container-brand py-8">
        <PersistentMemory />
      </div>
    </PageLayout>
  );
};
