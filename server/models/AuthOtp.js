const mongoose = require('mongoose');

/**
 * Short-lived OTP storage for auth flows (dev fallback).
 * TTL removes expired docs automatically.
 */
const authOtpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, index: true },
    purpose: { type: String, required: true, enum: ['login', 'signup'], index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

authOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
authOtpSchema.index({ phone: 1, purpose: 1 });

module.exports = mongoose.model('AuthOtp', authOtpSchema);

