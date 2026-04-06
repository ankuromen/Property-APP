import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const KEY = import.meta.env.VITE_ADMIN_API_KEY || '';

async function adminFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Admin-Key': KEY,
    ...options.headers,
  };
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data;
}

export default function App() {
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
      .catch((e) => setErr(e.message))
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

  if (!KEY) {
    return (
      <div className="app" style={{ padding: 24, fontFamily: 'system-ui' }}>
        <h1>Admin — moderation</h1>
        <p style={{ color: 'crimson' }}>
          Set <code>VITE_ADMIN_API_KEY</code> in <code>admin-panel/.env</code> to match{' '}
          <code>ADMIN_API_KEY</code> on the server.
        </p>
      </div>
    );
  }

  const items = data?.properties || [];

  return (
    <div className="app" style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 960 }}>
      <h1>Listings moderation</h1>
      <p style={{ color: '#555' }}>Private tool — requires server ADMIN_API_KEY.</p>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <label>
          Status:{' '}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>{' '}
        <button type="button" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      {loading && <p>Loading…</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((p) => (
          <li
            key={p._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <strong>{p.title}</strong>{' '}
            <span style={{ fontSize: 12, color: '#666' }}>({p.status})</span>
            <div style={{ fontSize: 14, marginTop: 4 }}>
              {p.city || '—'} · ₹{p.price?.toLocaleString?.('en-IN') ?? p.price}
            </div>
            {p.reviewNotes && (
              <div style={{ marginTop: 8, fontSize: 13, color: '#333' }}>
                <em>Notes:</em> {p.reviewNotes}
              </div>
            )}
            {p.status === 'Pending' && (
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <button type="button" onClick={() => approve(p._id)}>
                  Approve
                </button>
                <button type="button" onClick={() => requestVerification(p._id)}>
                  Request verification
                </button>
                <button type="button" onClick={() => reject(p._id)}>
                  Reject
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {!loading && items.length === 0 && <p>No listings in this filter.</p>}
    </div>
  );
}
