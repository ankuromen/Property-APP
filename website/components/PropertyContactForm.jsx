'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PropertyContactForm({ propertyId }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function sendOtp(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/website/leads/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerPhone, propertyId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      setMessage('We sent a 6-digit code to your phone. Enter it below.');
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function submitLead(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/website/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          propertyId,
          otp,
          notes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Could not submit');
      setMessage('Your interest was sent. The lister may contact you soon.');
      setStep('done');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'done') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
        <p className="font-medium">{message}</p>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <form onSubmit={submitLead} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-600">{message}</p>
        <div>
          <label className="block text-sm font-medium text-slate-700">6-digit OTP</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Enter OTP"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="rounded-md bg-slate-900 px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Submitting…' : 'Submit'}
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-4 py-2 text-slate-700"
            onClick={() => {
              setStep('form');
              setOtp('');
              setMessage('');
              setError('');
            }}
          >
            Back
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={sendOtp} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">Interested? Leave your details</h2>
      <p className="text-sm text-slate-600">We’ll send an OTP to verify your mobile number.</p>
      <div>
        <label className="block text-sm font-medium text-slate-700">Your name</label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Mobile (10 digits)</label>
        <input
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          inputMode="numeric"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Message (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || customerPhone.replace(/\D/g, '').length !== 10}
        className="rounded-md bg-slate-900 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {loading ? 'Sending OTP…' : 'Send OTP'}
      </button>
    </form>
  );
}
