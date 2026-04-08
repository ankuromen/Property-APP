import Image from 'next/image';
import Link from 'next/link';
import { IMG } from '../assets';

function HeroGridPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.2]"
      aria-hidden
    >
      <defs>
        <pattern id="pp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.12"
          />
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

export default function HeroSection() {
  return (
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
            Publish listings, receive OTP-verified leads, and grow with plans that scale—one polished experience
            for brokers and owners.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/sign-in?from=/account/properties/new"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 px-7 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/30 active:scale-[0.98]"
            >
              Get started
              <span className="transition group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
            <Link
              href="/sign-in?from=/account/properties/new"
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

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-teal-500/20 blur-3xl md:h-56 md:w-56" />
          <div className="absolute -bottom-8 -left-4 h-36 w-36 rounded-full bg-amber-500/15 blur-3xl md:h-48 md:w-48" />

          <HeroCollage heroMain={IMG.heroMain} heroTop={IMG.heroTop} heroBottom={IMG.heroBottom} />
        </div>
      </div>
    </section>
  );
}

