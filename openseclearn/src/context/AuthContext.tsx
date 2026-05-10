'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  /** Convenience boolean — true when the logged-in user has the admin role */
  isAdmin: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoading: true,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('openseclearn-user');
      const storedToken = localStorage.getItem('openseclearn-token-val');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    // Store token in cookie for middleware access
    document.cookie = `openseclearn-token=${newToken}; path=/; max-age=${60 * 60}; SameSite=Strict`;
    // Also in localStorage for easy client-side reads
    localStorage.setItem('openseclearn-token-val', newToken);
    localStorage.setItem('openseclearn-user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    document.cookie = 'openseclearn-token=; path=/; max-age=0';
    localStorage.removeItem('openseclearn-token-val');
    localStorage.removeItem('openseclearn-user');
    setToken(null);
    setUser(null);
    window.location.href = '/auth/login';
  }, []);

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
