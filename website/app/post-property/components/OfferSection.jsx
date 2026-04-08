import Image from 'next/image';
import SectionHeading from './SectionHeading';
import { IMG } from '../assets';

export default function OfferSection() {
  return (
    <section className="bg-white px-4 py-20 md:py-24">
      <SectionHeading
        eyebrow="What we offer"
        title="Everything in one place"
        subtitle="Admin review, fair plans, and serious buyer intent—wrapped in a UI your clients will feel."
      />

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
                <p className="mt-1 text-xs leading-relaxed text-slate-200">Profile quota & discovery beyond one ad.</p>
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
  );
}

