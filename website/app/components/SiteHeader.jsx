'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function SiteHeader() {
  const { ready, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-slate-900">
          Property Platform
        </Link>
        <nav className="flex items-center gap-3 text-sm text-slate-600 sm:gap-4">
          <Link href="/browse" className="hover:text-slate-900">
            Browse
          </Link>
          <Link href="/brokers" className="hover:text-slate-900">
            Brokers
          </Link>
          <Link href="/post-property" className="hidden rounded-lg sm:inline-block sm:px-2 sm:py-1 sm:hover:bg-slate-100">
            Post property
          </Link>
          {ready && isAuthenticated ? (
            <>
              <Link
                href="/account"
                className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-900 hover:bg-slate-200"
              >
                My account
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="text-slate-500 hover:text-slate-900"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/account/login"
              className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
