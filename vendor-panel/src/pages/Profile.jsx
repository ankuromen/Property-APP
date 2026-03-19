import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    api('/api/vendor/profile')
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
    api('/api/vendor/profile', {
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
    api('/api/vendor/profile/password', {
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
        <header className="bg-white border-b border-slate-200 px-6 py-4">
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
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-800">Profile</h1>
      </header>
      <main className="flex-1 p-6 max-w-xl space-y-8">
        {message && (
          <div className="rounded-xl bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Account details</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm">
                {error}
              </div>
            )}
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-1">Name</span>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                required
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-1">Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                required
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-1">Phone</span>
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
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Change password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm">
                {passwordError}
              </div>
            )}
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-1">Current password</span>
              <input
                type="password"
                value={password.currentPassword}
                onChange={(e) => setPassword((p) => ({ ...p, currentPassword: e.target.value }))}
                required
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-1">New password (min 6 characters)</span>
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
              <span className="block text-sm font-medium text-slate-700 mb-1">Confirm new password</span>
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
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-60"
            >
              {passwordSaving ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
