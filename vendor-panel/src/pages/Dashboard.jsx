import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
      </header>
      <main className="flex-1 p-6 max-w-3xl">
        <p className="text-slate-600 mb-6">
          Welcome! Manage your property listings from the dashboard.
        </p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 shadow-sm"
        >
          View & manage properties →
        </Link>
      </main>
    </>
  );
}
