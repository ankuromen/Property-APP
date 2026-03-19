import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4">
        Find your next property
      </h1>
      <p className="text-lg text-stone-600 mb-10 max-w-xl">
        Browse listings from verified vendors. No signup required — see a property you like? Contact the vendor directly.
      </p>
      <Link
        to="/browse"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition"
      >
        Browse properties
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </section>
  );
}
