export default function PositioningSection() {
  return (
    <section className="relative bg-white px-4 py-20 md:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-200/80 to-transparent" />
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          What this platform is
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          A <strong className="font-semibold text-slate-800">marketplace</strong>: we list supply, route
          interest to the right party, and may charge for software—plans, visibility, and platform fees. We don&apos;t
          sell property advice; viewings and deals stay{' '}
          <strong className="font-semibold text-slate-800">between you and the buyer</strong>.
        </p>
      </div>
    </section>
  );
}

