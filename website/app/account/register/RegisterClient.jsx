'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../lib/apiClient';

function RegisterForm() {
  const [step, setStep] = useState('form'); // form | otp
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillPhone = searchParams.get('phone') || '';

  useEffect(() => {
    if (ready && isAuthenticated) router.replace('/account');
  }, [ready, isAuthenticated, router]);

  useEffect(() => {
    if (prefillPhone) setPhone(prefillPhone);
  }, [prefillPhone]);

  function normalizePhone(raw) {
    return String(raw || '').replace(/\D/g, '').slice(-10);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const normalized = normalizePhone(phone);
      await apiClient('/api/broker/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ fullName, phone: normalized, email: email || undefined }),
      });
      setStep('otp');
      setOtp('');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const normalized = normalizePhone(phone);
      const data = await apiClient('/api/broker/auth/signup/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone: normalized, otp: String(otp || '').trim() }),
      });
      login(data.user, data.token);
      router.replace('/account');
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">Loading...</div>
    );
  }
  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased lg:flex-row">
      <div className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 xl:p-16 lg:flex lg:w-[48%] xl:w-[52%]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(251,191,36,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-sm font-medium text-amber-400/90">
            Property Platform
          </div>
          <h2 className="mt-16 text-3xl font-bold tracking-tight text-white xl:text-4xl">
            Start listing
            <br />
            <span className="text-amber-400">in minutes.</span>
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-slate-400">
            Create an account to post as a broker or owner and manage leads from this site.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-6 text-sm text-slate-500">
          <span>Free to list</span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span>Upgrade when you grow</span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center overflow-y-auto bg-slate-50/80 px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="mb-8 lg:hidden">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs font-medium text-amber-700">
              Account
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {step === 'otp' ? 'Verify OTP' : 'Create account'}
          </h1>
          <p className="mt-2 text-slate-600">
            {step === 'otp'
              ? 'Enter the code sent to your phone to complete signup.'
              : 'Full name and phone are required. Email is optional.'}
          </p>

          <form onSubmit={step === 'otp' ? handleVerify : handleSubmit} className="mt-10 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {error}
              </div>
            )}
            {step === 'form' && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Full name</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="John Doe"
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Phone</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Email (optional)</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>
              </>
            )}

            {step === 'otp' && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Phone</span>
                  <input
                    type="tel"
                    value={phone}
                    disabled
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm disabled:bg-slate-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">OTP</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter OTP"
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setOtp('');
                    setError('');
                  }}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Edit details
                </button>
              </>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/25 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-lg"
            >
              {loading
                ? step === 'otp'
                  ? 'Verifying...'
                  : 'Sending OTP...'
                : step === 'otp'
                  ? 'Verify & create account'
                  : 'Continue'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-semibold text-amber-600 transition hover:text-amber-700">
              Sign in
            </Link>
          </p>
          <p className="mt-4 text-center text-sm">
            <Link href="/" className="text-slate-500 hover:text-slate-800">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterClient() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center text-slate-500">Loading...</div>}
    >
      <RegisterForm />
    </Suspense>
  );
}

