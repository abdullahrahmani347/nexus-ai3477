
import React, { useState } from 'react';
import { IntegratedSidebar } from '@/components/navigation/IntegratedSidebar';
import { APIPage } from '@/components/pages/APIPage';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const APIPageWrapper: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <IntegratedSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex-shrink-0 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <APIPage />
        </div>
      </div>
    </div>
  );
};

export default APIPageWrapper;
