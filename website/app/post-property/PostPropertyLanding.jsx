'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/api';

const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function billingSuffix(cycle) {
  const m = {
    monthly: ' / month',
    quarterly: ' / quarter',
    half_yearly: ' / 6 months',
    yearly: ' / year',
  };
  return m[cycle] || '';
}

/** Curated Unsplash — architecture & marketplace mood (hotlink allowed per Unsplash guidelines) */
const IMG = {
  heroMain:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=1100&fit=crop&q=82',
  heroTop:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=450&fit=crop&q=82',
  heroBottom:
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=450&fit=crop&q=82',
  bento1:
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=640&h=480&fit=crop&q=82',
  bento2:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=640&h=480&fit=crop&q=82',
  bento3:
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=640&h=480&fit=crop&q=82',
  quote:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=82',
};

function HeroGridPattern() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.2]" aria-hidden>
      <defs>
        <pattern id="pp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.12" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pp-grid)" />
    </svg>
  );
}

function HeroCollage({ heroMain, heroTop, heroBottom }) {
  const tileRing = 'ring-1 ring-white/15';
  return (
    <div className="relative flex w-full flex-col gap-3 sm:gap-4 lg:h-[min(30rem,calc(100vh-9rem))] lg:min-h-[20rem] lg:flex-row lg:items-stretch lg:gap-4">
      {/* Main — mobile: aspect box; desktop: fills column height next to stack */}
      <div
        className={`relative w-full shrink-0 overflow-hidden rounded-2xl ${tileRing} transition hover:ring-teal-400/35 aspect-[4/5] min-[480px]:aspect-[5/6] lg:min-h-0 lg:flex-[1.15] lg:basis-0 lg:aspect-auto`}
      >
        <Image
          src={heroMain}
          alt="Modern residential architecture at dusk"
          fill
          className="object-cover transition duration-700 hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 42vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
        <p className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-10 text-sm font-medium leading-snug text-white drop-shadow-md">
          Curated inventory buyers actually trust
        </p>
      </div>

      {/* Right stack: mobile = 2-up grid; lg = column of two equal flex rows (matches main image height) */}
      <div className="grid min-h-0 w-full grid-cols-2 gap-3 sm:gap-4 lg:flex lg:h-full lg:min-h-0 lg:flex-[0.85] lg:basis-0 lg:flex-col lg:gap-4">
        <div
          className={`relative aspect-[4/3] min-h-0 w-full overflow-hidden rounded-xl ${tileRing} transition hover:ring-amber-300/35 lg:flex-1 lg:aspect-auto lg:rounded-2xl`}
        >
          <Image
            src={heroTop}
            alt="Bright contemporary interior living space"
            fill
            className="object-cover transition duration-500 hover:scale-[1.02]"
            sizes="(max-width: 1024px) 50vw, 28vw"
          />
        </div>
        <div
          className={`relative aspect-[4/3] min-h-0 w-full overflow-hidden rounded-xl ${tileRing} transition hover:ring-teal-300/35 lg:flex-1 lg:aspect-auto lg:rounded-2xl`}
        >
          <Image
            src={heroBottom}
            alt="Minimal modern living room with natural light"
            fill
            className="object-cover transition duration-500 hover:scale-[1.02]"
            sizes="(max-width: 1024px) 50vw, 28vw"
          />
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p>
      )}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-slate-600">{subtitle}</p>}
    </div>
  );
}

export default function PostPropertyLanding() {
  const [audience, setAudience] = useState('broker');
  const [openFaq, setOpenFaq] = useState(0);
  const [stickyCta, setStickyCta] = useState(false);
  const [publicPlans, setPublicPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setPlansLoading(true);
    fetch(`${PUBLIC_API}/api/website/plans`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setPublicPlans(Array.isArray(d.plans) ? d.plans : []);
      })
      .catch(() => {
        if (!cancelled) setPublicPlans([]);
      })
      .finally(() => {
        if (!cancelled) setPlansLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const nearBottom = y + window.innerHeight > doc.scrollHeight - 280;
      setStickyCta(y > 420 && !nearBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <main className={`overflow-hidden transition-[padding] duration-300 ${stickyCta ? 'pb-24 md:pb-28' : ''}`}>
        {/* Hero */}
        <section className="relative border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_85%_-15%,rgba(251,191,36,0.22),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_5%_90%,rgba(45,212,191,0.14),transparent_50%)]" />
          <HeroGridPattern />

          <div className="relative mx-auto grid max-w-6xl items-start gap-12 px-4 py-16 md:gap-16 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-teal-200/95 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
                </span>
                Brokers & property owners
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.15rem]">
                List on a marketplace built for{' '}
                <span className="bg-gradient-to-r from-amber-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                  trust & clarity
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                Publish listings, receive OTP-verified leads, and grow with plans that scale—one polished experience for
                brokers and owners.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/account/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 px-7 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/30 active:scale-[0.98]"
                >
                  Create free account
                  <span className="transition group-hover:translate-x-0.5" aria-hidden>
                    →
                  </span>
                </Link>
                <Link
                  href="/account/login?from=/account/properties/new"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/15"
                >
                  Log in to list
                </Link>
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center rounded-2xl px-5 py-3.5 text-base font-medium text-slate-400 underline-offset-4 transition hover:text-white hover:underline"
                >
                  Browse listings
                </Link>
              </div>

              <dl className="mt-14 grid gap-6 sm:grid-cols-3">
                {[
                  { k: 'Reviewed', v: 'Every listing checked before it goes live.' },
                  { k: 'Verified leads', v: 'OTP before a contact hits your quota.' },
                  { k: 'One home, one ad', v: 'No duplicate clutter in search.' },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm transition hover:border-teal-400/30 hover:bg-white/[0.09]"
                  >
                    <dt className="text-sm font-semibold text-white">{row.k}</dt>
                    <dd className="mt-1.5 text-xs leading-relaxed text-slate-400">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Image collage — mobile: stack + 2-up; lg: 2×2 grid with equal right column rows */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-teal-500/20 blur-3xl md:h-56 md:w-56" />
              <div className="absolute -bottom-8 -left-4 h-36 w-36 rounded-full bg-amber-500/15 blur-3xl md:h-48 md:w-48" />

              <HeroCollage
                heroMain={IMG.heroMain}
                heroTop={IMG.heroTop}
                heroBottom={IMG.heroBottom}
              />
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section className="relative bg-white px-4 py-20 md:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-200/80 to-transparent" />
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">What this platform is</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              A <strong className="font-semibold text-slate-800">marketplace</strong>: we list supply, route interest to
              the right party, and may charge for software—plans, visibility, and platform fees. We don&apos;t sell
              property advice; viewings and deals stay{' '}
              <strong className="font-semibold text-slate-800">between you and the buyer</strong>.
            </p>
          </div>
        </section>

        {/* Interactive audience */}
        <section className="border-y border-slate-200/90 bg-gradient-to-b from-slate-50 to-white px-4 py-20 md:py-24">
          <SectionHeading
            eyebrow="Choose your path"
            title="Built for how you work"
            subtitle="Tap a profile—we highlight what matters most for brokers vs. owners. Same account, same tools."
          />

          <div className="mx-auto mt-12 max-w-3xl">
            <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-sm">
              {[
                { id: 'broker', label: 'I’m a broker' },
                { id: 'owner', label: 'I’m an owner' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setAudience(t.id)}
                  className={`relative flex-1 min-w-[140px] rounded-xl px-6 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                    audience === t.id
                      ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-600/25'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div
              className="mt-10 overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.15)] md:p-10"
              role="region"
              aria-live="polite"
            >
              {audience === 'broker' ? (
                <div className="transition-opacity duration-300">
                  <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Brokers</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">Scale mandates without losing control</h3>
                  <ul className="mt-6 space-y-4 text-slate-600">
                    {[
                      'Directory presence so buyers discover you beyond a single listing.',
                      'Many listings under one account—lead caps apply per listing under your plan tier.',
                      'When owners join a home you listed first, visibility follows clear consent rules.',
                    ].map((line) => (
                      <li key={line} className="flex gap-3 text-base leading-relaxed">
                        <span
                          className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800"
                          aria-hidden
                        >
                          ✓
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="transition-opacity duration-300">
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-800">Property owners</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">Own your narrative on the marketplace</h3>
                  <ul className="mt-6 space-y-4 text-slate-600">
                    {[
                      'List with the same account experience—no anonymous posting.',
                      'You decide how brokers appear and whether they receive leads on a shared listing.',
                      'Ownership claims go through our team when the flow requires verification.',
                    ].map((line) => (
                      <li key={line} className="flex gap-3 text-base leading-relaxed">
                        <span
                          className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900"
                          aria-hidden
                        >
                          ✓
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bento + images */}
        <section className="bg-white px-4 py-20 md:py-24">
          <SectionHeading
            eyebrow="What we offer"
            title="Everything in one place"
            subtitle="Admin review, fair plans, and serious buyer intent—wrapped in a UI your clients will feel."
          />

          {/* md+: flex row so left & right share one height; images use fill + object-cover (no empty band) */}
          <div className="mx-auto mt-14 flex max-w-5xl flex-col gap-5 md:min-h-[min(28rem,52vh)] md:flex-row md:items-stretch md:gap-6">
            <article className="group relative min-h-0 overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-900 aspect-[16/11] md:aspect-auto md:flex-[1.65] md:basis-0">
              <div className="absolute inset-0">
                <Image
                  src={IMG.bento1}
                  alt="Handing over keys — symbolic of a property transaction"
                  fill
                  className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 64vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent md:bg-gradient-to-r" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:max-w-[90%] md:p-8">
                  <h3 className="text-xl font-bold text-white md:text-2xl">Admin-reviewed listings</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                    Quality-checked before search and listing pages—buyers see approved inventory only.
                  </p>
                </div>
              </div>
            </article>

            <div className="flex min-h-0 flex-col gap-5 md:flex-1 md:basis-0 md:gap-6">
              <article className="group relative min-h-0 flex-1 overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-900 aspect-[4/3] md:aspect-auto">
                <div className="absolute inset-0">
                  <Image
                    src={IMG.bento2}
                    alt="Urban skyline representing reach and discovery"
                    fill
                    className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 32vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-bold text-white">Broker directory</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-200">
                      Profile quota & discovery beyond one ad.
                    </p>
                  </div>
                </div>
              </article>

              <article className="group relative min-h-0 flex-1 overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-900 aspect-[4/3] md:aspect-auto">
                <div className="absolute inset-0">
                  <Image
                    src={IMG.bento3}
                    alt="Modern family home exterior"
                    fill
                    className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 32vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-bold text-white">One listing per home</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-200">No duplicate clutter in search results.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: 'Starter → Gold plans', d: 'Free Starter with per-listing lead limits; higher tiers unlock more on every listing.' },
              { t: 'OTP-verified leads', d: 'Buyers verify phone before a lead counts—stronger intent for you.' },
              { t: 'Spam handled fairly', d: 'Suspicious contacts can be marked without burning your limits the same way.' },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/80 p-6 shadow-sm transition hover:border-teal-200/80 hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-900">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps — interactive cards */}
        <section className="border-t border-slate-200 bg-slate-50 px-4 py-20 md:py-24">
          <SectionHeading
            eyebrow="Flow"
            title="From sign-up to live listing"
            subtitle="Guests can’t post—sign in, then add your property from your account."
          />

          <ol className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              { step: '01', title: 'Register & open account', body: 'One login for profile, listings, and leads.' },
              { step: '02', title: 'Create your listing', body: 'Add details and submit—track status in your dashboard.' },
              { step: '03', title: 'We approve or follow up', body: 'Approve, request verification, or reject with a clear reason.' },
            ].map((item, i) => (
              <li
                key={item.step}
                className="group relative rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-teal-200/90 hover:shadow-lg"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-teal-500 text-sm font-bold text-white shadow-md shadow-teal-600/30">
                  {item.step}
                </span>
                {i < 2 && (
                  <span
                    className="absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-teal-300 to-transparent md:block"
                    aria-hidden
                  />
                )}
                <h3 className="mt-5 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Quote + FAQ */}
        <section className="bg-white px-4 py-20 md:py-24">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <figure className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-8 text-white shadow-xl md:p-10">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-400/20 blur-3xl" />
              <blockquote className="relative text-lg font-medium leading-relaxed md:text-xl">
                “We wanted discovery that feels{' '}
                <span className="text-teal-200">premium</span>—not a spreadsheet of duplicate flats.”
              </blockquote>
              <figcaption className="relative mt-8 flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-white/20">
                  <Image
                  src={IMG.quote}
                  alt="Decorative portrait placeholder"
                  width={56}
                  height={56}
                  className="object-cover"
                />
                </div>
                <div>
                  <p className="font-semibold">Platform design note</p>
                  <p className="text-sm text-slate-400">Built for serious listers & buyers</p>
                </div>
              </figcaption>
            </figure>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">Quick answers</h2>
              <p className="mt-2 text-slate-600">Tap to expand—everything you need before you sign up.</p>
              <ul className="mt-8 space-y-2">
                {[
                  {
                    q: 'Can guests post a listing?',
                    a: 'No. Listing creation is available after you register and sign in—this keeps inventory tied to real accounts.',
                  },
                  {
                    q: 'How long does review take?',
                    a: 'It depends on queue and completeness of your submission. You’ll see status updates in your account.',
                  },
                  {
                    q: 'How are payments handled?',
                    a: 'Paid tiers use Razorpay on monthly or longer cycles. Fees are for platform use—not consultancy.',
                  },
                ].map((faq, idx) => (
                  <li key={faq.q} className="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/80">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-white"
                      aria-expanded={openFaq === idx}
                    >
                      {faq.q}
                      <span
                        className={`text-lg text-teal-600 transition ${openFaq === idx ? 'rotate-45' : ''}`}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        openFaq === idx ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Plans — loaded from admin-published plans */}
        <section className="border-t border-slate-200 bg-slate-50 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-xl font-bold text-slate-900 md:text-2xl">Plans & billing</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-slate-600">
              Plans below are managed in the admin console. Paid tiers renew on the billing cycle shown. Payments are
              processed via <strong className="font-semibold text-slate-800">Razorpay</strong>; if a renewal lapses, there
              is a short grace window before the account returns to Starter. Fees are for the platform—not for acting as
              your property consultant.
            </p>

            {plansLoading && (
              <p className="mt-10 text-center text-sm text-slate-500">Loading plans…</p>
            )}

            {!plansLoading && publicPlans.length > 0 && (
              <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {publicPlans.map((p) => {
                  const free = p.billingCycle === 'none' || !p.priceAmount;
                  return (
                    <li
                      key={p.code}
                      className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-sm transition hover:border-teal-200/80 hover:shadow-md"
                    >
                      <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                      <p className="mt-2 text-2xl font-semibold tabular-nums text-teal-800">
                        {free ? (
                          'Free'
                        ) : (
                          <>
                            {formatPrice(p.priceAmount)}
                            <span className="block text-sm font-normal text-slate-600">
                              {billingSuffix(p.billingCycle).trim()}
                            </span>
                          </>
                        )}
                      </p>
                      {p.description && (
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{p.description}</p>
                      )}
                      <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
                        <li>
                          <span className="font-medium text-slate-700">Leads per listing:</span>{' '}
                          {p.leadCapPerListing === -1 ? 'Unlimited' : p.leadCapPerListing}
                        </li>
                        {p.profileQuota > 0 && (
                          <li>
                            <span className="font-medium text-slate-700">Profile quota:</span> {p.profileQuota}
                          </li>
                        )}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            )}

            {!plansLoading && publicPlans.length === 0 && (
              <p className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">
                No plans are published for the website yet. Add plans in the admin under <strong>Plans</strong> and enable
                &quot;Show on website&quot;, or run <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">npm run seed:plans</code> in the API server folder.
              </p>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 px-4 py-16 text-center md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(251,191,36,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to list?</h2>
            <p className="mt-3 text-lg text-slate-300">
              Create an account and add your first property—we’ll review it before buyers see it in search.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/account/register"
                className="inline-flex rounded-2xl bg-amber-400 px-8 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300"
              >
                Create account
              </Link>
              <Link
                href="/account/login?from=/account/properties/new"
                className="inline-flex rounded-2xl border border-white/30 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Already registered — log in
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky mobile / desktop CTA */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 px-4 py-3 shadow-[0_-8px_40px_rgba(0,0,0,0.35)] backdrop-blur-lg transition-transform duration-300 md:py-4 ${
          stickyCta ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!stickyCta}
      >
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-300">
            <span className="text-white">List your property</span> — start free, upgrade when you scale.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/account/register"
              className="inline-flex rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
            >
              Get started
            </Link>
            <Link
              href="/account/login?from=/account/properties/new"
              className="inline-flex rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
