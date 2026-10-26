import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types/index.ts';
import { api, authStorage } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: (role: 'student' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = authStorage.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch {
      authStorage.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    authStorage.setToken(data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    const data = await api.register({ name, email, password, confirmPassword });
    authStorage.setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    } finally {
      authStorage.clearToken();
      setUser(null);
    }
  };

  const demoLogin = async (role: 'student' | 'admin') => {
    const email = role === 'admin' ? 'admin@careerai.dev' : 'student@careerai.dev';
    const password = role === 'admin' ? 'Admin123!' : 'Student123!';
    await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        demoLogin,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
