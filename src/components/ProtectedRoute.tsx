import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" text="INITIALIZING SECURITY SESSION..." />
      </div>
    );
  }

  // If unauthorized, redirect directly to home (/) to keep admin panel hidden
  if (!admin || !admin.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
