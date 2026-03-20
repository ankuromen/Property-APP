import Link from 'next/link';
import { api, formatPrice, siteUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const revalidate = 120;

export async function generateMetadata({ params }) {
  try {
    const broker = await api(`/api/website/brokers/${params.id}`);
    return {
      title: `${broker.name} | Broker Profile`,
      description: `View listings by ${broker.name} and book consultation at Rs ${broker.consultationFee}.`,
      alternates: { canonical: `${siteUrl()}/brokers/${params.id}` },
    };
  } catch {
    return { title: 'Broker profile' };
  }
}

export default async function BrokerProfilePage({ params }) {
  const broker = await api(`/api/website/brokers/${params.id}`);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">{broker.name}</h1>
      <p className="mt-1 text-slate-600">Consultation fee: Rs {broker.consultationFee}</p>
      <p className="text-slate-600">Phone: {broker.phone}</p>

      <h2 className="mt-6 mb-3 text-xl font-semibold">Active Listings</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {broker.properties?.map((p) => (
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
