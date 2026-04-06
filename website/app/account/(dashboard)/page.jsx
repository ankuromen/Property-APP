import Link from 'next/link';

export default function AccountDashboardPage() {
  return (
    <>
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
      </header>
      <main className="max-w-3xl flex-1 p-6">
        <p className="mb-6 text-slate-600">
          Welcome. Post properties as a broker or owner, complete your profile, and manage leads — all from this site.
        </p>
        <Link
          href="/account/properties"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          View & manage properties →
        </Link>
      </main>
    </>
  );
}
