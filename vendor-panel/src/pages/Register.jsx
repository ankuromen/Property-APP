import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api('/api/vendor/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password }),
      });
      login(data.user, data.token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans antialiased">
      {/* Left: Branding panel */}
      <div className="relative hidden lg:flex lg:w-[48%] xl:w-[52%] min-h-screen flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 xl:p-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(251,191,36,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-sm font-medium text-amber-400/90">
            Vendor Portal
          </div>
          <h2 className="mt-16 text-3xl xl:text-4xl font-bold tracking-tight text-white">
            Start listing
            <br />
            <span className="text-amber-400">in minutes.</span>
          </h2>
          <p className="mt-6 max-w-sm text-base text-slate-400 leading-relaxed">
            Create your vendor account, add properties, and receive qualified leads. No subscription required to get started.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-6 text-sm text-slate-500">
          <span>Free to list</span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span>Upgrade when you grow</span>
        </div>
      </div>

      {/* Right: Form */}
      <div className="relative flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20 bg-slate-50/80 overflow-y-auto">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="lg:hidden mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs font-medium text-amber-700">
              Vendor Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Create account
          </h1>
          <p className="mt-2 text-slate-600">
            Join as a vendor to list properties and receive leads.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {error}
              </div>
            )}
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="John Doe"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1.5">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                placeholder="+91 98765 43210"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1.5">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/25 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
