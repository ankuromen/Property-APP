'use client';

import { useState } from 'react';
import SectionHeading from './SectionHeading';

export default function AudienceSection() {
  const [audience, setAudience] = useState('broker');

  return (
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
  );
}

