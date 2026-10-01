import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser, onAdminAuthStateChanged, logoutAdmin } from '../firebase/auth';

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAdminAuthStateChanged((adminUser, isLoading) => {
      setAdmin(adminUser);
      setLoading(isLoading);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await logoutAdmin();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
