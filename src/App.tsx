
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthGuard } from '@/components/AuthGuard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useErrorLogging } from '@/hooks/useErrorLogging';
import ChatPage from '@/pages/ChatPage';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  // Initialize error logging
  useErrorLogging();

  return (
    <ErrorBoundary>
      <Router>
        <AuthGuard>
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </AuthGuard>
        <Toaster position="top-right" />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
