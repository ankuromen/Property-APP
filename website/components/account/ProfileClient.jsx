'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/apiClient';

export default function ProfileClient() {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    apiClient('/api/broker/profile')
      .then((data) => {
        setProfile({ name: data.name || '', email: data.email || '', phone: data.phone || '' });
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  function handleProfileSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    apiClient('/api/broker/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    })
      .then((data) => {
        updateUser(data);
        setMessage('Profile updated successfully.');
      })
      .catch((err) => setError(err.message || 'Update failed'))
      .finally(() => setSaving(false));
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError('');
    if (password.newPassword !== password.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordSaving(true);
    apiClient('/api/broker/profile/password', {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      }),
    })
      .then(() => {
        setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordError('');
        setMessage('Password updated successfully.');
      })
      .catch((err) => setPasswordError(err.message || 'Failed to update password'))
      .finally(() => setPasswordSaving(false));
  }

  if (loading) {
    return (
      <>
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="text-xl font-semibold text-slate-800">Profile</h1>
        </header>
        <main className="flex-1 p-6">
          <p className="text-slate-600">Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-800">Profile</h1>
      </header>
      <main className="max-w-xl flex-1 space-y-8 p-6">
        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
          </div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Account details</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                required
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                required
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Phone</span>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                required
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Change password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {passwordError}
              </div>
            )}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Current password</span>
              <input
                type="password"
                value={password.currentPassword}
                onChange={(e) => setPassword((p) => ({ ...p, currentPassword: e.target.value }))}
                required
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">New password (min 6 characters)</span>
              <input
                type="password"
                value={password.newPassword}
                onChange={(e) => setPassword((p) => ({ ...p, newPassword: e.target.value }))}
                required
                minLength={6}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Confirm new password</span>
              <input
                type="password"
                value={password.confirmPassword}
                onChange={(e) => setPassword((p) => ({ ...p, confirmPassword: e.target.value }))}
                required
                minLength={6}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <button
              type="submit"
              disabled={passwordSaving}
              className="rounded-xl bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {passwordSaving ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
