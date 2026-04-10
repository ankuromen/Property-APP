import Link from 'next/link';
import { api, formatPrice, siteUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'Browse Properties',
    description: 'Explore active properties with city, budget and type filters.',
    alternates: { canonical: `${siteUrl()}/browse` },
  };
}

export default async function BrowsePage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const city = params?.city || '';
  const propertyType = params?.propertyType || '';
  const minPrice = params?.minPrice || '';
  const maxPrice = params?.maxPrice || '';

  const qs = new URLSearchParams({ page: String(page), limit: '12', sort: 'createdAt', order: 'desc' });
  if (city) qs.set('city', city);
  if (propertyType) qs.set('propertyType', propertyType);
  if (minPrice) qs.set('minPrice', minPrice);
  if (maxPrice) qs.set('maxPrice', maxPrice);

  const data = await api(`/api/website/properties?${qs.toString()}`);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Browse Properties</h1>
      <form className="mb-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-5">
        <input name="city" defaultValue={city} placeholder="City" className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="propertyType" defaultValue={propertyType} placeholder="Property Type" className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="minPrice" defaultValue={minPrice} placeholder="Min Price" className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="maxPrice" defaultValue={maxPrice} placeholder="Max Price" className="rounded-md border border-slate-300 px-3 py-2" />
        <button className="rounded-md bg-slate-900 px-3 py-2 font-medium text-white">Apply</button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.properties?.map((p) => (
          <Link key={p._id} href={`/property/${p._id}`} className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-sm text-slate-500">{[p.locality, p.city].filter(Boolean).join(', ') || 'Location not set'}</p>
            <p className="mt-2 font-medium">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <span>
          Page {data.pagination?.page || 1} of {data.pagination?.totalPages || 1}
        </span>
        <div className="flex gap-2">
          {(data.pagination?.page || 1) > 1 && (
            <Link href={`/browse?${new URLSearchParams({ ...Object.fromEntries(qs.entries()), page: String(page - 1) }).toString()}`} className="rounded border px-3 py-1">
              Prev
            </Link>
          )}
          {(data.pagination?.page || 1) < (data.pagination?.totalPages || 1) && (
            <Link href={`/browse?${new URLSearchParams({ ...Object.fromEntries(qs.entries()), page: String(page + 1) }).toString()}`} className="rounded border px-3 py-1">
              Next
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
