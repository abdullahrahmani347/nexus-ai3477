
import React from 'react';
import { SemanticSearch } from '@/components/advanced/SemanticSearch';
import { PageLayout } from '@/components/layout/PageLayout';

export const SearchPage: React.FC = () => {
  return (
    <PageLayout 
      title="Semantic Search" 
      subtitle="Find information across all your conversations and documents"
    >
      <div className="container-brand py-8">
        <SemanticSearch />
      </div>
    </PageLayout>
  );
};
