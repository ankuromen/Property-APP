import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { adminLogin, getAdminToken, setAdminToken } from '../api/adminClient';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => getAdminToken());

  const login = useCallback(async (loginId, password) => {
    const data = await adminLogin(loginId, password);
    if (!data?.token) throw new Error('No token returned');
    setAdminToken(data.token);
    setToken(data.token);
  }, []);

  const logout = useCallback(() => {
    setAdminToken(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}
