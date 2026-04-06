import Link from 'next/link';
import Image from 'next/image';
import { api, formatPrice, siteUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const revalidate = 120;

export async function generateMetadata() {
  return {
    title: 'Find homes & connect with trusted listers',
    alternates: { canonical: `${siteUrl()}/` },
  };
}

function HeroPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
      aria-hidden
    >
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

export default async function HomePage() {
  const data = await api('/api/website/properties?limit=6&sort=createdAt&order=desc');
  const properties = data.properties || [];

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[min(88vh,820px)]">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgba(251,191,36,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_10%_100%,rgba(45,212,191,0.12),transparent_45%)]" />
        <HeroPattern />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center px-4 pb-16 pt-20 md:min-h-[min(88vh,820px)] md:pb-24 md:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300/90">
            Property marketplace
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
            Curated listings.
            <span className="block bg-gradient-to-r from-amber-200 to-teal-200 bg-clip-text text-transparent">
              Real people. One place.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
            Browse homes that are reviewed before they go live. Reach brokers or owners directly—no noise, no duplicate
            ads for the same plot.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-300"
            >
              Explore listings
            </Link>
            <Link
              href="/brokers"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Meet brokers
            </Link>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { k: 'Every ad reviewed', d: 'Listings go live only after admin approval.' },
              { k: 'OTP on leads', d: 'Buyers verify their number before you get a lead.' },
              { k: 'One listing per home', d: 'Same property isn’t duplicated in search.' },
            ].map((item) => (
              <div
                key={item.k}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md"
              >
                <p className="font-semibold text-white">{item.k}</p>
                <p className="mt-1 text-sm leading-snug text-slate-400">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f8fafc] to-transparent" />
      </section>

      {/* Bento */}
      <section className="relative z-10 -mt-12 px-4 pb-16">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 md:gap-5">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:row-span-2 md:flex md:min-h-[280px] md:flex-col md:justify-between">
            <div>
              <span className="text-3xl font-bold text-teal-600">01</span>
              <h2 className="mt-3 text-xl font-bold text-slate-900">Search that stays readable</h2>
              <p className="mt-2 text-slate-600">
                Filters, location, and price—without clutter. Built for serious browsers, not endless scrolling traps.
              </p>
            </div>
            <Link
              href="/browse"
              className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              Open browse
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Broker directory</h2>
            <p className="mt-2 text-sm text-slate-600">
              Discover profiles by area and reach out—even before you pick a single listing.
            </p>
            <Link
              href="/brokers"
              className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View brokers
            </Link>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-slate-900 p-6 text-white shadow-sm">
            <h2 className="text-lg font-bold">List with clarity</h2>
            <p className="mt-2 text-sm text-slate-300">
              Sign in, add your property, and track status while our team reviews. No anonymous posting.
            </p>
            <Link
              href="/post-property"
              className="mt-4 inline-flex rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="border-t border-slate-200/80 bg-[#f8fafc] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Fresh on the map</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Latest listings</h2>
            </div>
            <Link
              href="/browse"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-400"
            >
              See all
            </Link>
          </div>

          {properties.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No listings yet—check back soon.
            </p>
          ) : (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => {
                const img = p.images?.[0];
                return (
                  <li key={p._id}>
                    <Link
                      href={`/property/${p._id}`}
                      className="group block overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:border-teal-200/80 hover:shadow-md"
                    >
                      <div className="relative aspect-[5/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                        {img ? (
                          <Image
                            src={img}
                            alt=""
                            fill
                            className="object-cover transition duration-300 group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
                            No photo
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-teal-800">
                          {p.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {[p.locality, p.city].filter(Boolean).join(' · ') || 'India'}
                        </p>
                        <p className="mt-2 text-lg font-bold text-slate-900">{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 md:text-3xl">How it works</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-slate-600">
            Three steps—from browse to conversation—without the platform pretending to be your advisor.
          </p>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Browse & shortlist',
                body: 'Use filters and listing detail pages to narrow down what actually fits.',
              },
              {
                step: '2',
                title: 'Verify & reach out',
                body: 'Submit interest with an OTP on your phone so listers get real, reachable leads.',
              },
              {
                step: '3',
                title: 'Talk directly',
                body: 'Connect with the broker or owner on the listing—viewings and deals happen between you.',
              },
            ].map((item) => (
              <li
                key={item.step}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 pt-10 shadow-sm"
              >
                <span className="absolute left-6 top-0 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white shadow-md">
                  {item.step}
                </span>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-slate-200 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 px-4 py-14 text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">Ready to look around?</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-300">
          Start with listings or meet brokers in your area—your next move is one click away.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/browse"
            className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-300"
          >
            Browse listings
          </Link>
          <Link
            href="/account/register"
            className="rounded-xl border border-white/25 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
