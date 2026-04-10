import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminFetch } from '../api/adminClient';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function BrokersPage() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [status, setStatus] = useState('pending');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  function load() {
    setLoading(true);
    setErr('');
    adminFetch(`/api/admin/brokers?status=${encodeURIComponent(status)}`)
      .then((d) => setItems(d.brokers || []))
      .catch((e) => {
        if (e.status === 401) {
          logout();
          navigate('/login', { replace: true });
          return;
        }
        setErr(e.message || 'Failed to load brokers');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [status]);

  async function approve(id) {
    await adminFetch(`/api/admin/brokers/${id}/approve`, { method: 'PATCH', body: '{}' });
    load();
  }

  async function reject(id) {
    const reason = window.prompt('Reason for rejection:');
    if (!reason || !reason.trim()) return;
    await adminFetch(`/api/admin/brokers/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason: reason.trim() }),
    });
    load();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Broker approvals</h1>
        <p className="mt-1 text-slate-600">Review broker profile submissions and approve or reject.</p>
      </header>

      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm text-slate-700">
          <span className="mr-2 font-medium">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <button
          type="button"
          onClick={load}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800"
        >
          Refresh
        </button>
      </div>

      {err && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</div>}
      {loading && <p className="text-slate-600">Loading...</p>}

      <ul className="space-y-4">
        {items.map((u) => (
          <li key={u._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">{u.brokerProfile?.fullName || u.name}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {u.brokerProfile?.companyName || '—'} · {u.brokerProfile?.phone || u.phone || '—'}
                </p>
                <p className="mt-1 text-sm text-slate-600">{u.brokerProfile?.email || u.email || '—'}</p>
                <p className="mt-2 text-sm text-slate-700">
                  <span className="font-medium">Cities:</span>{' '}
                  {Array.isArray(u.brokerProfile?.operatingCities) && u.brokerProfile.operatingCities.length
                    ? u.brokerProfile.operatingCities.join(', ')
                    : '—'}
                </p>
                {u.brokerProfile?.bio && (
                  <p className="mt-2 text-sm text-slate-700">
                    <span className="font-medium">Bio:</span> {u.brokerProfile.bio}
                  </p>
                )}
                {u.brokerProfileReviewNotes && (
                  <p className="mt-2 text-sm text-red-700">
                    <span className="font-medium">Review note:</span> {u.brokerProfileReviewNotes}
                  </p>
                )}
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                {u.brokerProfileStatus}
              </span>
            </div>

            {u.brokerProfileStatus === 'pending' && (
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => approve(u._id)}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => reject(u._id)}
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
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 py-10 text-center text-slate-600">
          No broker profiles found in this filter.
        </p>
      )}
    </div>
  );
}

