
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import PublicCardPage from './pages/PublicCardPage';
import ScannerPage from './pages/ScannerPage';
import AuthPage from './pages/AuthPage';
import SettingsPage from './pages/SettingsPage';
import LuxeDropPage from './pages/LuxeDropPage';
import { authApi } from './services/auth';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900"></div>
      </div>
    );
  }

  const isStandalone = location.pathname === '/scan' || location.pathname === '/drop';
  const isPublicCard = location.pathname.startsWith('/card/');

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {!isStandalone && !isPublicCard && <Navbar user={user} onLogout={async () => {
        await authApi.signOut();
        setUser(null);
      }} />}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage onAuthSuccess={setUser} />} />
            <Route path="/scan" element={<ScannerPage />} />
            <Route path="/drop" element={<LuxeDropPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/auth" />} />
            <Route path="/editor" element={user ? <EditorPage /> : <Navigate to="/auth" />} />
            <Route path="/editor/:id" element={user ? <EditorPage /> : <Navigate to="/auth" />} />
            <Route path="/settings" element={user ? <SettingsPage user={user} onUpdate={setUser} /> : <Navigate to="/auth" />} />

            {/* Public Card Route */}
            <Route path="/card/:username" element={<PublicCardPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
