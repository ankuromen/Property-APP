import Link from 'next/link';
import { api, siteUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const revalidate = 120;

export const metadata = {
  title: 'Brokers Directory',
  description: 'Find active brokers by location and listing strength.',
  alternates: { canonical: `${siteUrl()}/brokers` },
};

export default async function BrokersPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const city = params?.city || '';
  const qs = new URLSearchParams({ page: String(page), limit: '12' });
  if (city) qs.set('city', city);

  const data = await api(`/api/website/brokers?${qs.toString()}`);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Top Brokers</h1>
      <form className="mb-4 flex gap-2">
        <input name="city" defaultValue={city} placeholder="Filter by city" className="rounded-md border border-slate-300 px-3 py-2" />
        <button className="rounded-md bg-slate-900 px-3 py-2 text-white">Filter</button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.brokers?.map((b) => (
          <Link key={b._id} href={`/brokers/${b._id}`} className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow">
            <h2 className="font-semibold">{b.name}</h2>
            <p className="text-sm text-slate-600">{b.primaryLocality ? `${b.primaryLocality}, ${b.primaryCity || ''}` : b.primaryCity || 'India'}</p>
            <p className="mt-1 text-sm">Listings: {b.listingsCount}</p>
            <p className="text-sm">Consultation fee: Rs {b.consultationFee}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
