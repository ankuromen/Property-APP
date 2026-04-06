'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function ProtectedAccount({ children }) {
  const { isAuthenticated, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      const from = encodeURIComponent(pathname || '/account');
      router.replace(`/account/login?from=${from}`);
    }
  }, [ready, isAuthenticated, router, pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">Loading...</div>
    );
  }
  if (!isAuthenticated) return null;
  return children;
}
