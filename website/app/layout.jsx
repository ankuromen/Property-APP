import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import AppShell from './AppShell';

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
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
