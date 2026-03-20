import Link from 'next/link';
import { api, formatPrice, siteUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const city = decodeURIComponent(params.city);
  return {
    title: `Properties in ${city}`,
    description: `Browse active property listings in ${city}.`,
    alternates: { canonical: `${siteUrl()}/location/${params.city}` },
  };
}

export default async function CityPage({ params }) {
  const city = decodeURIComponent(params.city);
  const data = await api(`/api/website/properties?city=${encodeURIComponent(city)}&limit=20`);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Properties in {city}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.properties?.map((p) => (
          <Link key={p._id} href={`/property/${p._id}`} className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-slate-600">{[p.locality, p.city].filter(Boolean).join(', ')}</div>
            <div className="mt-1 text-sm">{formatPrice(p.price)}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
