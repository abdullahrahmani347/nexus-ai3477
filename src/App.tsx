
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ThemeProvider from "./components/ThemeProvider";
import { SettingsIntegration } from "./components/SettingsIntegration";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import TeamSpacesPage from "./pages/TeamSpacesPage";
import DeveloperAPIPage from "./pages/DeveloperAPIPage";
import WhiteLabelPage from "./pages/WhiteLabelPage";
import SemanticSearchPage from "./pages/SemanticSearchPage";
import PersistentMemoryPage from "./pages/PersistentMemoryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <SettingsIntegration>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/teams" element={<TeamSpacesPage />} />
                <Route path="/api" element={<DeveloperAPIPage />} />
                <Route path="/whitelabel" element={<WhiteLabelPage />} />
                <Route path="/search" element={<SemanticSearchPage />} />
                <Route path="/memory" element={<PersistentMemoryPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SettingsIntegration>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
