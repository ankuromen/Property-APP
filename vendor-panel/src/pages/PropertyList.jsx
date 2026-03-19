import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    api('/api/vendor/properties')
      .then(setProperties)
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id) {
    if (!window.confirm('Delete this property?')) return;
    setDeleteId(id);
    api(`/api/vendor/properties/${id}`, { method: 'DELETE' })
      .then(() => setProperties((prev) => prev.filter((p) => p._id !== id)))
      .catch((err) => alert(err.message || 'Delete failed'))
      .finally(() => setDeleteId(null));
  }

  function formatPrice(p) {
    if (p == null) return '—';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  }

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-800">My properties</h1>
      </header>

      <main className="flex-1 p-6 max-w-5xl">
        {loading ? (
          <p className="text-slate-600">Loading properties...</p>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <p className="text-slate-600">You have no properties yet. Use <strong>Add property</strong> in the sidebar to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-slate-900 truncate">{p.title}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {[p.locality, p.city, p.location].filter(Boolean).join(' · ') || '—'}
                  </p>
                  <p className="text-sm font-medium text-slate-700 mt-1">
                    {formatPrice(p.price)}
                    {p.transactionType && ` · ${p.transactionType}`}
                    {p.bhk && ` · ${p.bhk} BHK`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/properties/${p._id}/edit`}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(p._id)}
                    disabled={deleteId === p._id}
                    className="px-4 py-2 rounded-lg border border-red-200 text-red-700 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleteId === p._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
