'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../lib/apiClient';

function LoginForm() {
  const [step, setStep] = useState('phone'); // phone | otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/account';
  const prefillPhone = searchParams.get('phone') || '';

  useEffect(() => {
    if (ready && isAuthenticated) {
      router.replace(from.startsWith('/') ? from : '/account');
    }
  }, [ready, isAuthenticated, router, from]);

  useEffect(() => {
    if (prefillPhone) {
      setPhone(prefillPhone);
    }
  }, [prefillPhone]);

  function normalizePhone(raw) {
    return String(raw || '').replace(/\D/g, '').slice(-10);
  }

  async function handlePhoneSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const normalized = normalizePhone(phone);
      const data = await apiClient('/api/broker/auth/check-phone', {
        method: 'POST',
        body: JSON.stringify({ phone: normalized }),
      });
      if (data.exists) {
        setStep('otp');
        setOtp('');
        setError('');
      } else {
        router.push(`/sign-up?phone=${encodeURIComponent(normalized)}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const normalized = normalizePhone(phone);
      const data = await apiClient('/api/broker/auth/login/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone: normalized, otp: String(otp || '').trim() }),
      });
      login(data.user, data.token);
      router.replace(from.startsWith('/') ? from : '/account');
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Loading...</div>;
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
            List properties.
            <br />
            <span className="text-amber-400">Find homes. Get leads.</span>
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-slate-400">
            For owners, brokers, and buyers — manage everything in one place.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-6 text-sm text-slate-500">
          <span>Secure &amp; reliable</span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span>One account for everything</span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center bg-slate-50/80 px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="mb-8 lg:hidden">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs font-medium text-amber-700">
              Property Platform
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {step === 'otp' ? (
              'Verify OTP'
            ) : (
              <>
                List properties. <span className="text-amber-600">Find homes. Get leads.</span>
              </>
            )}
          </h1>
          <p className="mt-2 text-slate-600">
            {step === 'otp'
              ? 'Enter the code sent to your phone to continue.'
              : 'For owners, brokers, and buyers — manage everything in one place.'}
          </p>
          <form onSubmit={step === 'otp' ? handleOtpSubmit : handlePhoneSubmit} className="mt-10 space-y-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {error}
              </div>
            )}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                placeholder="98765 43210"
                disabled={step === 'otp'}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
            {step === 'otp' && (
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
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/25 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-lg"
            >
              {loading
                ? step === 'otp'
                  ? 'Verifying...'
                  : 'Sending OTP...'
                : step === 'otp'
                  ? 'Verify & continue'
                  : 'Continue'}
            </button>
            {step === 'otp' && (
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setError('');
                  }}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Change number
                </button>
              </div>
            )}
          </form>

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

export default function LoginClient() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center text-slate-500">Loading...</div>}
    >
      <LoginForm />
    </Suspense>
  );
}

