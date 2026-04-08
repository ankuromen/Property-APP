'use client';

import { useAuth } from '../../context/AuthContext';

export default function AuthenticatedHeader() {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    const ok = window.confirm('Are you sure you want to sign out?');
    if (!ok) return;
    logout();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-end px-4 py-3">
        <nav className="flex items-center gap-2 text-sm sm:gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-3 py-1.5 font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            title={user?.name || 'Sign out'}
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}

