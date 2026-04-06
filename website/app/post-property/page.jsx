import Link from 'next/link';
import { siteUrl } from '@/lib/api';

export const metadata = {
  title: 'Post Property',
  description: 'List your property after signing in — submissions are reviewed before going live.',
  alternates: { canonical: `${siteUrl()}/post-property` },
};

export default function PostPropertyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Post your property</h1>
      <p className="mb-6 text-slate-600">
        Create an account (broker or owner), then add a listing from your dashboard. Each listing is reviewed by our team
        before it appears on the site.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/account/register"
          className="rounded-md bg-slate-900 px-4 py-2 font-semibold text-white"
        >
          Create account
        </Link>
        <Link
          href="/account/login?from=/account/properties/new"
          className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-800"
        >
          Log in
        </Link>
      </div>
    </main>
  );
}
