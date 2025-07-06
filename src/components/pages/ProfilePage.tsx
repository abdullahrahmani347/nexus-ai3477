
import React from 'react';
import { ProfileManagement } from '@/components/profile/ProfileManagement';
import { PageLayout } from '@/components/layout/PageLayout';

export const ProfilePage: React.FC = () => {
  return (
    <PageLayout 
      title="Profile Settings" 
      subtitle="Manage your account and preferences"
    >
      <div className="container-brand py-8">
        <ProfileManagement />
      </div>
    </PageLayout>
  );
};
