import Image from 'next/image';
import { api, formatPrice, siteUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  try {
    const property = await api(`/api/website/properties/${params.id}`);
    const title = `${property.title} in ${property.city || 'India'}`;
    const description = property.description || `${property.propertyType} listed at ${formatPrice(property.price)}.`;
    return {
      title,
      description,
      alternates: { canonical: `${siteUrl()}/property/${params.id}` },
      openGraph: { title, description, url: `/property/${params.id}` },
      twitter: { card: 'summary_large_image', title, description },
    };
  } catch {
    return { title: 'Property not found' };
  }
}

export default async function PropertyDetailPage({ params }) {
  const property = await api(`/api/website/properties/${params.id}`);
  const image = property.images?.[0] || null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description || property.title,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: property.price,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.locality || property.city,
      addressRegion: property.state,
      postalCode: property.pincode,
      addressCountry: property.country || 'IN',
    },
    url: `${siteUrl()}/property/${property._id}`,
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl font-bold">{property.title}</h1>
      <p className="mt-1 text-slate-600">{[property.locality, property.city, property.state].filter(Boolean).join(', ')}</p>
      <p className="mt-3 text-xl font-semibold">{formatPrice(property.price)}</p>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {image ? (
          <Image src={image} alt={property.title} width={1200} height={640} className="h-auto w-full object-cover" priority={false} />
        ) : (
          <div className="p-10 text-center text-slate-500">No image available</div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Property details</h2>
        <p className="mt-2 text-sm text-slate-700">Type: {property.propertyType || 'N/A'}</p>
        <p className="mt-1 text-sm text-slate-700">Transaction: {property.transactionType || 'N/A'}</p>
        <p className="mt-1 text-sm text-slate-700">BHK: {property.bhk || 'N/A'}</p>
        <p className="mt-3 text-slate-700">{property.description || 'No description added.'}</p>
      </div>
    </main>
  );
}
