import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminFetch } from '../api/adminClient';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function PropertiesPage() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [status, setStatus] = useState('Pending');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  function load() {
    setLoading(true);
    setErr('');
    const q = status ? `?status=${encodeURIComponent(status)}&limit=50` : '?limit=50';
    adminFetch(`/api/admin/properties${q}`)
      .then(setData)
      .catch((e) => {
        if (e.status === 401) {
          logout();
          navigate('/login', { replace: true });
          return;
        }
        setErr(e.message);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [status]);

  async function approve(id) {
    if (!window.confirm('Approve this listing?')) return;
    await adminFetch(`/api/admin/properties/${id}/approve`, { method: 'PATCH', body: '{}' });
    load();
  }

  async function reject(id) {
    const reason = window.prompt('Rejection reason (shown to lister):');
    if (!reason || !reason.trim()) return;
    await adminFetch(`/api/admin/properties/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason: reason.trim() }),
    });
    load();
  }

  async function requestVerification(id) {
    const message = window.prompt('What should the lister provide or fix?');
    if (!message || !message.trim()) return;
    await adminFetch(`/api/admin/properties/${id}/request-verification`, {
      method: 'PATCH',
      body: JSON.stringify({ message: message.trim() }),
    });
    load();
  }

  const items = data?.properties || [];

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Properties</h1>
        <p className="mt-1 text-slate-600">Review listings before they go live. Approve, ask for more detail, or reject.</p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <span className="font-medium">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {err}
        </div>
      )}

      {loading && <p className="text-slate-600">Loading…</p>}

      <ul className="space-y-4">
        {items.map((p) => (
          <li
            key={p._id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">{p.title}</h2>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-900'
                      : p.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {p.status}
                </span>
                <p className="mt-2 text-sm text-slate-600">
                  {p.city || '—'} · ₹{p.price?.toLocaleString?.('en-IN') ?? p.price}
                </p>
                {p.reviewNotes && (
                  <p className="mt-3 text-sm text-slate-700">
                    <span className="font-medium text-slate-500">Notes: </span>
                    {p.reviewNotes}
                  </p>
                )}
              </div>
            </div>

            {p.status === 'Pending' && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => approve(p._id)}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => requestVerification(p._id)}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
                >
                  Request verification
                </button>
                <button
                  type="button"
                  onClick={() => reject(p._id)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
                >
                  Reject
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {!loading && items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 py-12 text-center text-slate-600">
          No listings in this filter.
        </p>
      )}
    </div>
  );
}
