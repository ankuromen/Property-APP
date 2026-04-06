import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Property Platform | Buy, Rent, Post Properties',
    template: '%s | Property Platform',
  },
  description:
    'Browse verified property listings, connect with brokers or owners, and book paid consultations for high-intent property visits.',
  openGraph: {
    title: 'Property Platform',
    description: 'SEO-friendly property marketplace built for buyers, owners, and brokers.',
    url: '/',
    siteName: 'Property Platform',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Property Platform',
    description: 'Find properties and book serious consultation visits.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold text-slate-900">
              Property Platform
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              <Link href="/browse" className="hover:text-slate-900">
                Browse
              </Link>
              <Link href="/brokers" className="hover:text-slate-900">
                Brokers
              </Link>
              <Link href="/post-property" className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white">
                Post Property
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
