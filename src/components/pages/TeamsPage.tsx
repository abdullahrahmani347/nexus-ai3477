
import React from 'react';
import { TeamWorkspace } from '@/components/advanced/TeamWorkspace';
import { PageLayout } from '@/components/layout/PageLayout';

export const TeamsPage: React.FC = () => {
  return (
    <PageLayout 
      title="Team Workspaces" 
      subtitle="Collaborate with your team in shared AI environments"
    >
      <div className="container-brand py-8">
        <TeamWorkspace />
      </div>
    </PageLayout>
  );
};
