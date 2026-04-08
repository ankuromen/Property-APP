const mongoose = require('mongoose');

/**
 * Pending signup data until OTP verification succeeds.
 * TTL expires after a short window to avoid stale records.
 */
const pendingSignupSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

pendingSignupSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PendingSignup', pendingSignupSchema);

