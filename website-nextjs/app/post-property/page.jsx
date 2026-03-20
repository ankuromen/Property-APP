import { siteUrl } from '@/lib/api';

export const metadata = {
  title: 'Post Property',
  description: 'Submit your property for review and publication.',
  alternates: { canonical: `${siteUrl()}/post-property` },
};

export default function PostPropertyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Post Your Property</h1>
      <form action={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/website/properties/submit`} method="post" className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5">
        <input name="title" placeholder="Property title" required className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="propertyType" placeholder="Property type" required className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="price" type="number" placeholder="Price" required className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="ownerName" placeholder="Your name" required className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="ownerPhone" placeholder="Phone" required className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="ownerEmail" placeholder="Email (optional)" className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="city" placeholder="City" className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="locality" placeholder="Locality" className="rounded-md border border-slate-300 px-3 py-2" />
        <textarea name="description" placeholder="Property description" rows={4} className="rounded-md border border-slate-300 px-3 py-2" />
        <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
        <button className="rounded-md bg-slate-900 px-4 py-2 font-semibold text-white">Submit for review</button>
      </form>
    </main>
  );
}
