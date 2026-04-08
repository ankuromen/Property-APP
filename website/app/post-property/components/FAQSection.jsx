'use client';

import Image from 'next/image';
import { useState } from 'react';
import { IMG } from '../assets';

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
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
              <Image src={IMG.quote} alt="Decorative portrait placeholder" width={56} height={56} className="object-cover" />
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
  );
}

