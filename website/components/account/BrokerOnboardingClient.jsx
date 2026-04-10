'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/apiClient';

function toCityString(cities) {
  if (Array.isArray(cities)) return cities.join(', ');
  return '';
}

export default function BrokerOnboardingClient() {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('none');
  const [reviewNotes, setReviewNotes] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    companyName: '',
    experienceYears: '',
    operatingCities: '',
    reraNumber: '',
    bio: '',
  });

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  function load() {
    setLoading(true);
    setError('');
    apiClient('/api/broker/profile/onboarding')
      .then((data) => {
        setStatus(data.brokerProfileStatus || 'none');
        setReviewNotes(data.brokerProfileReviewNotes || '');
        setForm({
          fullName: data?.brokerProfile?.fullName || '',
          phone: data?.brokerProfile?.phone || '',
          email: data?.brokerProfile?.email || '',
          companyName: data?.brokerProfile?.companyName || '',
          experienceYears:
            data?.brokerProfile?.experienceYears === undefined || data?.brokerProfile?.experienceYears === null
              ? ''
              : String(data.brokerProfile.experienceYears),
          operatingCities: toCityString(data?.brokerProfile?.operatingCities),
          reraNumber: data?.brokerProfile?.reraNumber || '',
          bio: data?.brokerProfile?.bio || '',
        });
        updateUser({
          roles: data.roles,
          brokerProfileStatus: data.brokerProfileStatus,
        });
      })
      .catch((err) => setError(err.message || 'Failed to load broker profile'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function saveDraft(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const data = await apiClient('/api/broker/profile/onboarding', {
        method: 'PUT',
        body: JSON.stringify({
          ...form,
          experienceYears: form.experienceYears === '' ? undefined : Number(form.experienceYears),
          operatingCities: form.operatingCities,
        }),
      });
      setStatus(data.brokerProfileStatus || 'draft');
      setMessage('Draft saved successfully.');
      updateUser({ roles: data.roles, brokerProfileStatus: data.brokerProfileStatus });
    } catch (err) {
      setError(err.message || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  }

  async function submitForApproval() {
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const data = await apiClient('/api/broker/profile/onboarding/submit', { method: 'POST', body: '{}' });
      setStatus(data.brokerProfileStatus || 'pending');
      setReviewNotes('');
      setMessage('Submitted for admin approval.');
      updateUser({ roles: data.roles, brokerProfileStatus: data.brokerProfileStatus });
    } catch (err) {
      setError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6 text-slate-600">Loading broker onboarding...</div>;

  const isApproved = status === 'approved';
  const isPending = status === 'pending';

  return (
    <>
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-800">Broker profile onboarding</h1>
      </header>

      <main className="max-w-3xl flex-1 space-y-6 p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">
            Status:{' '}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                isApproved
                  ? 'bg-emerald-100 text-emerald-800'
                  : isPending
                    ? 'bg-amber-100 text-amber-900'
                    : status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-slate-100 text-slate-700'
              }`}
            >
              {status}
            </span>
          </p>
          {status === 'rejected' && reviewNotes && (
            <p className="mt-2 text-sm text-red-700">
              <span className="font-medium">Admin note:</span> {reviewNotes}
            </p>
          )}
          {isApproved && (
            <p className="mt-2 text-sm text-emerald-700">
              Your broker profile is approved. You can now post as broker.
            </p>
          )}
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
        {message && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Profile details</h2>
          <form onSubmit={saveDraft} className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Full name *</span>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Phone *</span>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Company name *</span>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Experience (years) *</span>
              <input type="number" min="0" className="w-full rounded-xl border border-slate-200 px-4 py-2.5" value={form.experienceYears} onChange={(e) => set('experienceYears', e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">RERA number</span>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5" value={form.reraNumber} onChange={(e) => set('reraNumber', e.target.value)} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">Operating cities (comma-separated)</span>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5" value={form.operatingCities} onChange={(e) => set('operatingCities', e.target.value)} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">Bio *</span>
              <textarea rows={4} className="w-full rounded-xl border border-slate-200 px-4 py-2.5" value={form.bio} onChange={(e) => set('bio', e.target.value)} />
            </label>

            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <button type="submit" disabled={saving || isPending} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60">
                {saving ? 'Saving...' : 'Save draft'}
              </button>
              <button
                type="button"
                disabled={submitting || isPending || isApproved}
                onClick={submitForApproval}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : isApproved ? 'Approved' : 'Submit for approval'}
              </button>
              <Link href="/account/properties/new" className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Back to properties
              </Link>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

