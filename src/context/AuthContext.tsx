import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthMode } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  loginDemo: () => Promise<void>;
  loginReal: (email: string, pass: string) => Promise<void>;
  signUpReal: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());

  useEffect(() => {
    // If no user set initially, auto-load demo mode user for instant ease of use
    if (!user) {
      authService.loginDemo().then(setUser);
    }
  }, []);

  const loginDemo = async () => {
    const u = await authService.loginDemo();
    setUser(u);
  };

  const loginReal = async (email: string, pass: string) => {
    const u = await authService.loginReal(email, pass);
    setUser(u);
  };

  const signUpReal = async (name: string, email: string, pass: string) => {
    const u = await authService.signUpReal(name, email, pass);
    setUser(u);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isDemo: Boolean(user?.isDemo),
        loginDemo,
        loginReal,
        signUpReal,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
