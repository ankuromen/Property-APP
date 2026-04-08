'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import ProtectedAccount from './ProtectedAccount';

export default function AccountLayout({ children }) {
  return (
    <ProtectedAccount>
      <AccountShell>{children}</AccountShell>
    </ProtectedAccount>
  );
}

function AccountShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function handleLogout() {
    setShowLogoutModal(true);
  }

  function confirmLogout() {
    setShowLogoutModal(false);
    logout();
    router.replace('/sign-in');
  }

  const cls = (href) => {
    const path = pathname || '';
    const active =
      href === '/account'
        ? path === '/account'
        : path === href || path.startsWith(`${href}/`);
    return `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      active ? 'bg-amber-500/10 text-amber-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <Link href="/" className="block text-lg font-bold text-slate-900">
            Property Platform
          </Link>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-sm font-semibold text-slate-800">
            My account
          </span>
          <p className="mt-2 text-xs text-slate-500">Broker or owner — listings & profile</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link href="/account" className={cls('/account')}>
            Dashboard
          </Link>
          <Link href="/account/properties" className={cls('/account/properties')}>
            My properties
          </Link>
          <Link href="/account/leads" className={cls('/account/leads')}>
            Leads
          </Link>
          <Link href="/account/profile" className={cls('/account/profile')}>
            Profile
          </Link>
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="truncate px-4 py-2 text-xs text-slate-500" title="Ankur Patel">
            Ankur Patel
          </div>
          <div className="truncate px-4 py-1 text-xs text-slate-400" title="techinnoverz@gmail.com">
            techinnoverz@gmail.com
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Confirm logout</h3>
            <p className="mt-2 text-sm text-slate-600">Do you really want to logout?</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
