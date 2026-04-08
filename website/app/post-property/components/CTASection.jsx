import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 px-4 py-16 text-center md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(251,191,36,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to list?</h2>
        <p className="mt-3 text-lg text-slate-300">
          Create an account and add your first property—we’ll review it before buyers see it in search.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/sign-in?from=/account/properties/new"
            className="inline-flex rounded-2xl bg-amber-400 px-8 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300"
          >
            Get started
          </Link>
          <Link
            href="/sign-in?from=/account/properties/new"
            className="inline-flex rounded-2xl border border-white/30 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            Already registered — log in
          </Link>
        </div>
      </div>
    </section>
  );
}

