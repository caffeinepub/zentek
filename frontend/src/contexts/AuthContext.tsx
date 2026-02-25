import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'zentek_user';
const TOKEN_KEY = 'zentek_auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const stored = localStorage.getItem(USER_KEY);
      if (token && stored) {
        const parsed = JSON.parse(stored);
        return { name: parsed.name, email: parsed.email };
      }
    } catch {
      // ignore
    }
    return null;
  });

  const signup = useCallback((name: string, email: string, password: string): boolean => {
    if (!name || !email || !password) return false;
    const userData = { name, email, password };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, `mock_jwt_${Date.now()}`);
    setUser({ name, email });
    return true;
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (!stored) return false;
      const parsed = JSON.parse(stored);
      if (parsed.email === email && parsed.password === password) {
        localStorage.setItem(TOKEN_KEY, `mock_jwt_${Date.now()}`);
        setUser({ name: parsed.name, email: parsed.email });
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
