import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ExplorePage from './pages/ExplorePage';
import DashboardPage from './pages/DashboardPage';
import BotPage from './pages/BotPage';
import TemplatesPage from './pages/TemplatesPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AuthCallback from './pages/AuthCallback';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ParticlesBackground from './components/ui/ParticlesBackground';
import { Toast } from './components/ui/Toast';

function App() {
  const location = useLocation();
  const { loading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="w-10 h-10 border-4 border-hustle-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 noise-bg relative">
      <ParticlesBackground />
      <Toast />
      
      <AnimatePresence mode="wait">
        <ErrorBoundary>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            <Route element={<Layout />}>
              <Route path="/explore" element={<ExplorePage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/bot" element={<BotPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </AnimatePresence>
    </div>
  );
}

export default App;