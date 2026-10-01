import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CyberBackground } from './components/CyberBackground';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Success } from './pages/Success';
import { AdminLogin } from './pages/AdminLogin';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHiddenDashboard =
    location.pathname.startsWith('/hacker/dashboard') ||
    location.pathname.startsWith('/hacker/members');

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#FF1A1A] selection:text-white relative">
      <CyberBackground />
      {!isHiddenDashboard && <Navbar />}
      <div className="flex-1 relative z-10">{children}</div>
      {!isHiddenDashboard && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Public Community Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<Success />} />

            {/* Custom Hidden Admin Entry Point */}
            <Route path="/hacker" element={<AdminLogin />} />

            {/* Protected Hidden Dashboard Routes */}
            <Route
              path="/hacker/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hacker/members"
              element={
                <ProtectedRoute>
                  <Members />
                </ProtectedRoute>
              }
            />

            {/* Automatically redirect any attempts to access common admin URLs to Home */}
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="/admin-login" element={<Navigate to="/" replace />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
};

export default App;
