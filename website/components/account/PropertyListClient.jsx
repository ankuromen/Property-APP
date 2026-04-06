'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/apiClient';

export default function PropertyListClient() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    apiClient('/api/broker/properties')
      .then(setProperties)
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id) {
    if (!window.confirm('Delete this property?')) return;
    setDeleteId(id);
    apiClient(`/api/broker/properties/${id}`, { method: 'DELETE' })
      .then(() => setProperties((prev) => prev.filter((p) => p._id !== id)))
      .catch((err) => alert(err.message || 'Delete failed'))
      .finally(() => setDeleteId(null));
  }

  function formatPrice(p) {
    if (p == null) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(p);
  }

  return (
    <>
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-800">My properties</h1>
      </header>

      <main className="max-w-5xl flex-1 p-6">
        {loading ? (
          <p className="text-slate-600">Loading properties...</p>
        ) : properties.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              You have no properties yet. Use <strong>Add property</strong> in the sidebar to create one.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((p) => (
              <div
                key={p._id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-slate-900">{p.title}</h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {[p.locality, p.city, p.location].filter(Boolean).join(' · ') || '—'}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatPrice(p.price)}
                    {p.transactionType && ` · ${p.transactionType}`}
                    {p.bhk && ` · ${p.bhk} BHK`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/account/properties/${p._id}/edit`}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(p._id)}
                    disabled={deleteId === p._id}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
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
