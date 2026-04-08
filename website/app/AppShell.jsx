'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from './components/SiteHeader';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const hideChrome =
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname?.startsWith('/account') ||
    pathname?.startsWith('/sign-in') ||
    pathname?.startsWith('/sign-up');

  return (
    <>
      {!hideChrome && <SiteHeader />}
      {children}
    </>
  );
}
