
import React from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PageLayout } from '@/components/layout/PageLayout';

export const AdminPage: React.FC = () => {
  return (
    <PageLayout 
      title="Admin Dashboard" 
      subtitle="Manage users, settings, and platform configuration"
    >
      <div className="container-brand py-8">
        <AdminDashboard />
      </div>
    </PageLayout>
  );
};
