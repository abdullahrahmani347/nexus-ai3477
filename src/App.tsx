
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { useErrorLogging } from '@/hooks/useErrorLogging';
import ChatPage from '@/pages/ChatPage';

const queryClient = new QueryClient();

function AppContent() {
  useErrorLogging();
  
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <ChatPage />
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="nexus-ui-theme">
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
