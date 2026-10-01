import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CyberBackground } from './components/CyberBackground';
import { ProtectedRoute } from './components/ProtectedRoute';

// Admin Pages
import { AdminLogin } from './pages/AdminLogin';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#FF1A1A] selection:text-white relative">
          <CyberBackground />
          <div className="flex-1 relative z-10">
            <Routes>
              {/* Login Entry Point */}
              <Route path="/login" element={<AdminLogin />} />

              {/* Protected Administration Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members"
                element={
                  <ProtectedRoute>
                    <Members />
                  </ProtectedRoute>
                }
              />

              {/* Default Redirect to Dashboard (or Login if unauthenticated) */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
