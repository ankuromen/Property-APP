'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/api';
import { billingSuffix } from '../assets';

const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function descriptionLines(description) {
  const text = String(description || '');
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function billingLabel(cycle) {
  const c = String(cycle || '').toLowerCase();
  if (c === 'none') return 'Free';
  if (c === 'monthly') return 'Monthly billing';
  if (c === 'quarterly') return 'Quarterly billing';
  if (c === 'half_yearly') return 'Half-yearly billing';
  if (c === 'yearly') return 'Yearly billing';
  return c ? `${c} billing` : '';
}

export default function PlansSection() {
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

  return (
    <section className="relative border-t border-slate-200 bg-gradient-to-b from-slate-50/60 to-white px-4 py-16 md:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(45,212,191,0.18),transparent_55%)]" />
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Plans & billing</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Plans below are managed in the admin console. Paid tiers renew on the billing cycle shown. Payments are
            processed via <strong className="font-semibold text-slate-800">Razorpay</strong>; if a renewal lapses, there
            is a short grace window before the account returns to Starter.
          </p>
        </div>

        {plansLoading && <p className="mt-10 text-center text-sm text-slate-500">Loading plans…</p>}

        {!plansLoading && publicPlans.length > 0 && (
          <ul
            className={[
              'mt-10 grid gap-4',
              publicPlans.length === 1 ? 'sm:grid-cols-1' : '',
              publicPlans.length === 2 ? 'sm:grid-cols-2 lg:grid-cols-2 max-w-2xl mx-auto' : '',
              publicPlans.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto' : '',
              publicPlans.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : '',
            ].join(' ')}
          >
            {publicPlans.map((p) => {
              const free = p.billingCycle === 'none' || !p.priceAmount;
              const descPoints = descriptionLines(p.description);

              const code = String(p.code || '').toLowerCase();
              const leadCap = p.leadCapPerListing === -1 ? 'Unlimited' : p.leadCapPerListing;
              const profileQuota = p.profileQuota > 0 ? p.profileQuota : null;

              // Highlight: prefer "gold" plan, otherwise highest lead cap.
              const gold = code.includes('gold');
              const maxLeadCap = publicPlans.reduce((acc, x) => {
                const c = String(x.code || '').toLowerCase();
                if (c.includes('gold')) return 'GOLD';
                const cap = x.leadCapPerListing === -1 ? Number.POSITIVE_INFINITY : Number(x.leadCapPerListing);
                return cap > acc ? cap : acc;
              }, -1);

              const isFeatured =
                gold ||
                (maxLeadCap !== 'GOLD' &&
                  (p.leadCapPerListing === -1 ? Number.POSITIVE_INFINITY : Number(p.leadCapPerListing)) === maxLeadCap);

              const accent =
                code.includes('gold')
                  ? 'amber'
                  : code.includes('bronze')
                    ? 'orange'
                    : code.includes('silver')
                      ? 'teal'
                      : 'teal';

              const badgeBg =
                accent === 'amber'
                  ? 'bg-amber-500/15 text-amber-800 border-amber-200/80'
                  : accent === 'orange'
                    ? 'bg-orange-500/15 text-orange-800 border-orange-200/80'
                    : 'bg-teal-500/15 text-teal-800 border-teal-200/80';

              const checkBg =
                accent === 'amber'
                  ? 'bg-amber-100 text-amber-800'
                  : accent === 'orange'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-teal-100 text-teal-800';

              return (
                <li
                  key={p.code}
                  className={[
                    'group relative flex min-h-[360px] flex-col overflow-hidden rounded-3xl border bg-white p-6 text-left shadow-sm transition',
                    'hover:-translate-y-0.5 hover:border-teal-200/70 hover:shadow-lg',
                    isFeatured ? 'border-teal-300/60 shadow-lg ring-1 ring-teal-400/20' : 'border-slate-200/90',
                  ].join(' ')}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        accent === 'amber'
                          ? 'linear-gradient(135deg, rgba(245,158,11,0.20), transparent 45%)'
                          : accent === 'orange'
                            ? 'linear-gradient(135deg, rgba(249,115,22,0.20), transparent 45%)'
                            : 'linear-gradient(135deg, rgba(20,184,166,0.18), transparent 45%)',
                    }}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeBg}`}>
                        {p.name}
                      </div>
                      {isFeatured && (
                        <div className="mt-2 inline-flex items-center rounded-full bg-teal-600/10 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-600/20">
                          Most popular
                        </div>
                      )}
                      <p className="mt-2 text-xs text-slate-500">
                        {free ? 'Starter plan' : billingLabel(p.billingCycle)}
                      </p>
                    </div>

                    <div className="text-right">
                      {free ? (
                        <p className="text-2xl font-extrabold tracking-tight text-teal-800">Free</p>
                      ) : (
                        <>
                          <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                            {formatPrice(p.priceAmount)}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">{billingSuffix(p.billingCycle).trim()}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      What you get
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                      {descPoints.map((line, idx) => (
                        <li key={`${p.code}-d-${idx}`} className="flex gap-2">
                          <span
                            className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ${checkBg}`}
                            aria-hidden
                          >
                            ✓
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}

                      <li className="flex gap-2">
                        <span
                          className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ${checkBg}`}
                          aria-hidden
                        >
                          ✓
                        </span>
                        <span>
                          Leads per listing: <span className="font-semibold">{leadCap}</span>
                        </span>
                      </li>

                      {profileQuota != null && (
                        <li className="flex gap-2">
                          <span
                            className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ${checkBg}`}
                            aria-hidden
                          >
                            ✓
                          </span>
                          <span>
                            Profile quota: <span className="font-semibold">{profileQuota}</span>
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/sign-in?from=/account/properties/new"
                      className={[
                        'inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
                        isFeatured
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20 hover:bg-teal-500'
                          : 'border border-slate-200 bg-white text-slate-800 hover:border-teal-200 hover:text-teal-700',
                      ].join(' ')}
                    >
                      {isFeatured ? 'Get started' : free ? 'Start free' : 'Upgrade now'}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

