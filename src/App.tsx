
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary, ErrorBoundaryProvider } from "@/components/ErrorBoundary";
import { AuthGuard } from "@/components/AuthGuard";
import { SettingsIntegration } from "@/components/SettingsIntegration";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TeamSpacesPage from "./pages/TeamSpacesPage";
import DeveloperAPIPage from "./pages/DeveloperAPIPage";
import SemanticSearchPage from "./pages/SemanticSearchPage";
import PersistentMemoryPage from "./pages/PersistentMemoryPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundaryProvider>
          <ErrorBoundary>
            <TooltipProvider>
              <BrowserRouter>
                <AuthGuard>
                  <SettingsIntegration>
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="/teams" element={<TeamSpacesPage />} />
                        <Route path="/api" element={<DeveloperAPIPage />} />
                        <Route path="/search" element={<SemanticSearchPage />} />
                        <Route path="/memory" element={<PersistentMemoryPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </SettingsIntegration>
                </AuthGuard>
                <Toaster />
              </BrowserRouter>
            </TooltipProvider>
          </ErrorBoundary>
        </ErrorBoundaryProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
