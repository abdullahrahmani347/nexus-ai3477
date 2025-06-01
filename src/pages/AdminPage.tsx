
import React from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user } = useAuth();

  // Simple admin check - in production, this would check user roles from database
  const isAdmin = user?.email === 'admin@nexusai.com' || user?.user_metadata?.role === 'admin';

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminPage;
