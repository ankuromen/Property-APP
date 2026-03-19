import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProperty, createLead } from '../api/client';

function formatPrice(n) {
  if (n == null || n === undefined) return '—';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString()}`;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [form, setForm] = useState({ customerName: '', customerPhone: '' });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getProperty(id)
      .then(setProperty)
      .catch((e) => setError(e.message || 'Property not found'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    createLead({
      propertyId: id,
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
    })
      .then(() => setSubmitted(true))
      .catch((e) => setSubmitError(e.message || 'Failed to submit'))
      .finally(() => {});
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse rounded-xl bg-stone-200 h-80 mb-6" />
        <div className="space-y-2">
          <div className="h-8 bg-stone-200 rounded w-2/3" />
          <div className="h-4 bg-stone-100 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 mb-4">{error || 'Not found'}</div>
        <Link to="/browse" className="text-stone-600 hover:text-stone-900 font-medium">
          ← Back to browse
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/browse" className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 text-sm font-medium mb-6">
        ← Back to browse
      </Link>

      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden mb-8">
        <div className="h-72 sm:h-96 bg-stone-200 flex items-center justify-center text-stone-400">
          {property.images?.[0] ? (
            <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            'No image'
          )}
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-stone-900">{property.title || 'Property'}</h1>
          <p className="text-stone-500 mt-1">
            {[property.locality, property.city, property.state].filter(Boolean).join(', ') || property.location || '—'}
          </p>
          <p className="text-2xl font-bold text-stone-900 mt-4">{formatPrice(property.price)}</p>
          <p className="text-sm text-stone-500 mt-1">
            {property.propertyType}
            {property.bhk ? ` • ${property.bhk} BHK` : ''}
            {property.transactionType ? ` • ${property.transactionType}` : ''}
          </p>
          {property.description && (
            <div className="mt-6 pt-6 border-t border-stone-100">
              <h2 className="font-semibold text-stone-900 mb-2">Description</h2>
              <p className="text-stone-600 whitespace-pre-wrap">{property.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Contact Vendor</h2>
        {submitted ? (
          <div className="rounded-lg bg-emerald-50 text-emerald-800 px-4 py-3">
            Thank you! The vendor will contact you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
                Your name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900"
                placeholder="e.g. John"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={form.customerPhone}
                onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900"
                placeholder="e.g. 9876543210"
              />
            </div>
            {submitError && (
              <div className="text-sm text-red-600">{submitError}</div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition"
            >
              Send inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
