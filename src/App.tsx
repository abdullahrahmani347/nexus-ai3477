
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ThemeProvider from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { useErrorLogging } from '@/hooks/useErrorLogging';
import ChatPage from '@/pages/ChatPage';
import { AdvancedFeaturesPage } from '@/components/pages/AdvancedFeaturesPage';
import APIPageWrapper from '@/pages/APIPageWrapper';
import { TeamsPage } from '@/components/pages/TeamsPage';
import { AdminPage } from '@/components/pages/AdminPage';
import { SearchPage } from '@/components/pages/SearchPage';
import { MemoryPage } from '@/components/pages/MemoryPage';
import { AnalyticsPage } from '@/components/pages/AnalyticsPage';
import { ProfilePage } from '@/components/pages/ProfilePage';
import WhiteLabelPage from '@/pages/WhiteLabelPage';

const queryClient = new QueryClient();

function AppContent() {
  useErrorLogging();
  
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/advanced" element={<AdvancedFeaturesPage />} />
          <Route path="/api" element={<APIPageWrapper />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/whitelabel" element={<WhiteLabelPage />} />
          <Route path="/performance" element={<AdvancedFeaturesPage />} />
        </Routes>
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
