
import React from 'react';
import { UserAnalytics } from '@/components/UserAnalytics';
import { PageLayout } from '@/components/layout/PageLayout';

export const AnalyticsPage: React.FC = () => {
  return (
    <PageLayout 
      title="Analytics Dashboard" 
      subtitle="Track usage, performance, and insights"
    >
      <div className="container-brand py-8">
        <UserAnalytics />
      </div>
    </PageLayout>
  );
};
