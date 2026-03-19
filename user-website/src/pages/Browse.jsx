import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listProperties } from '../api/client';

function formatPrice(n) {
  if (n == null || n === undefined) return '—';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString()}`;
}

export default function Browse() {
  const [data, setData] = useState({ properties: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    setLoading(true);
    setError(null);
    listProperties({ page, limit: 12, sort, order })
      .then(setData)
      .catch((e) => setError(e.message || 'Failed to load properties'))
      .finally(() => setLoading(false));
  }, [page, sort, order]);

  const { properties, pagination } = data;
  const totalPages = pagination.totalPages || 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Browse properties</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500">Sort:</span>
          <select
            value={`${sort}-${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split('-');
              setSort(s);
              setOrder(o);
              setPage(1);
            }}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white"
          >
            <option value="createdAt-desc">Newest first</option>
            <option value="createdAt-asc">Oldest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-stone-200 bg-white overflow-hidden animate-pulse">
              <div className="h-48 bg-stone-200" />
              <div className="p-4 space-y-2">
                <div className="h-5 bg-stone-200 rounded w-3/4" />
                <div className="h-4 bg-stone-100 rounded w-1/2" />
                <div className="h-4 bg-stone-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-stone-500">
          No properties found. Check back later.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <Link
                key={p._id}
                to={`/property/${p._id}`}
                className="rounded-xl border border-stone-200 bg-white overflow-hidden hover:shadow-lg hover:border-stone-300 transition"
              >
                <div className="h-48 bg-stone-200 flex items-center justify-center text-stone-400 text-sm">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    'No image'
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-stone-900 truncate">{p.title || 'Property'}</h2>
                  <p className="text-sm text-stone-500 mt-0.5">
                    {[p.locality, p.city].filter(Boolean).join(', ') || p.location || '—'}
                  </p>
                  <p className="text-lg font-semibold text-stone-900 mt-2">{formatPrice(p.price)}</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {p.propertyType}
                    {p.bhk ? ` • ${p.bhk} BHK` : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-stone-600">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
