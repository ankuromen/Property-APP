import Link from 'next/link';
import { api, formatPrice, siteUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const revalidate = 120;

export async function generateMetadata() {
  return {
    title: 'Find Properties in India',
    alternates: { canonical: `${siteUrl()}/` },
  };
}

export default async function HomePage() {
  const data = await api('/api/website/properties?limit=6&sort=createdAt&order=desc');
  const properties = data.properties || [];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="mb-10 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white">
        <h1 className="text-3xl font-bold">Find your next property with confidence</h1>
        <p className="mt-2 text-slate-200">
          Browse active listings, connect with brokers or owners, and book paid consultations for serious property visits.
        </p>
        <div className="mt-5 flex gap-3">
          <Link href="/browse" className="rounded-lg bg-white px-4 py-2 font-semibold text-slate-900">
            Browse Listings
          </Link>
          <Link href="/post-property" className="rounded-lg border border-white/40 px-4 py-2 font-semibold">
            Post Property
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Latest Active Properties</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <Link key={p._id} href={`/property/${p._id}`} className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow">
              <div className="text-lg font-semibold text-slate-900">{p.title}</div>
              <div className="text-sm text-slate-500">{[p.locality, p.city].filter(Boolean).join(', ') || 'Location not set'}</div>
              <div className="mt-2 text-sm font-medium text-slate-700">{formatPrice(p.price)}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
