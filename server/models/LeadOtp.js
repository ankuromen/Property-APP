const mongoose = require('mongoose');

/** Short-lived OTP for lead phone verification; Mongo TTL removes expired docs. */
const leadOtpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, index: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

leadOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('LeadOtp', leadOtpSchema);
