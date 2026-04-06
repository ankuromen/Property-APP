'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'property_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const t = localStorage.getItem('token');
    if (stored && t) {
      try {
        setUser(JSON.parse(stored));
        setToken(t);
      } catch (_) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('token');
      }
    }
    setReady(true);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    if (!userData) return;
    const data = {
      id: userData._id || userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    };
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const value = {
    user,
    token,
    login,
    logout,
    updateUser,
    ready,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
