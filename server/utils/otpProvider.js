const crypto = require('crypto');
const AuthOtp = require('../models/AuthOtp');

const MSG91_BASE = 'https://api.msg91.com/api/v5/otp';

function hasMsg91() {
  return Boolean(process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID);
}

function isDevelopment() {
  return String(process.env.NODE_ENV || '').toLowerCase() === 'development';
}

async function msg91SendOtp(phone10) {
  const authkey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  const mobile = `91${phone10}`;

  const url = new URL(MSG91_BASE);
  url.searchParams.set('template_id', templateId);
  url.searchParams.set('mobile', mobile);
  url.searchParams.set('authkey', authkey);

  const res = await fetch(url.toString(), { method: 'GET' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || data?.type || 'Failed to send OTP';
    throw new Error(msg);
  }
  return data;
}

async function msg91VerifyOtp(phone10, otp) {
  const authkey = process.env.MSG91_AUTH_KEY;
  const mobile = `91${phone10}`;

  const url = new URL(`${MSG91_BASE}/verify`);
  url.searchParams.set('mobile', mobile);
  url.searchParams.set('otp', String(otp));
  url.searchParams.set('authkey', authkey);

  const res = await fetch(url.toString(), { method: 'GET' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || data?.type || 'Invalid or expired OTP';
    throw new Error(msg);
  }
  // MSG91 returns { type: "success", message: ... } on success (varies).
  return data;
}

async function devSendOtp(phone10, purpose) {
  const code = String(crypto.randomInt(100000, 999999));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await AuthOtp.deleteMany({ phone: phone10, purpose });
  await AuthOtp.create({ phone: phone10, purpose, code, expiresAt });
  console.info(`[auth OTP][${purpose}] ${phone10} code: ${code}`);
  return { type: 'success', message: 'OTP sent', expiresInSeconds: 600 };
}

async function devVerifyOtp(phone10, purpose, otp) {
  const doc = await AuthOtp.findOne({ phone: phone10, purpose }).lean();
  if (!doc) throw new Error('Invalid or expired OTP');
  if (new Date() > new Date(doc.expiresAt)) {
    await AuthOtp.deleteOne({ _id: doc._id });
    throw new Error('OTP expired');
  }
  if (String(doc.code) !== String(otp).trim()) throw new Error('Invalid or expired OTP');
  await AuthOtp.deleteOne({ _id: doc._id });
  return { type: 'success', message: 'OTP verified' };
}

async function sendOtp(phone10, purpose) {
  // Never send paid SMS in local development.
  if (isDevelopment()) return devSendOtp(phone10, purpose);
  if (hasMsg91()) return msg91SendOtp(phone10);
  return devSendOtp(phone10, purpose);
}

async function verifyOtp(phone10, purpose, otp) {
  // In local development, verify only against locally stored OTPs.
  if (isDevelopment()) return devVerifyOtp(phone10, purpose, otp);
  if (hasMsg91()) return msg91VerifyOtp(phone10, otp);
  return devVerifyOtp(phone10, purpose, otp);
}

module.exports = { sendOtp, verifyOtp, hasMsg91 };

