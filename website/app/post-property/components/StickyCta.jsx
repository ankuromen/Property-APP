import Link from 'next/link';

export default function StickyCta({ visible }) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 px-4 py-3 shadow-[0_-8px_40px_rgba(0,0,0,0.35)] backdrop-blur-lg transition-transform duration-300 md:py-4 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-300">
          <span className="text-white">List your property</span> — start free, upgrade when you scale.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/sign-in?from=/account/properties/new"
            className="inline-flex rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
          >
            Get started
          </Link>
          <Link
            href="/sign-in?from=/account/properties/new"
            className="inline-flex rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

