'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from './components/SiteHeader';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const hideChrome =
    pathname === '/account/login' ||
    pathname === '/account/register' ||
    pathname?.startsWith('/account/login') ||
    pathname?.startsWith('/account/register');

  return (
    <>
      {!hideChrome && <SiteHeader />}
      {children}
    </>
  );
}
