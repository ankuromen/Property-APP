const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    /** Stable id for subscriptions (e.g. starter, bronze, gold) — lowercase */
    code: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    /** INR per billing period (0 = free tier) */
    priceAmount: { type: Number, default: 0, min: 0 },
    billingCycle: {
      type: String,
      enum: ['none', 'monthly', 'quarterly', 'half_yearly', 'yearly'],
      default: 'monthly',
    },
    /** Max leads fully accessible per listing; -1 = unlimited */
    leadCapPerListing: { type: Number, default: 5 },
    /** Broker directory / profile-only contacts quota per period */
    profileQuota: { type: Number, default: 0, min: 0 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    /** Shown on marketing pages (e.g. /post-property) */
    showOnWebsite: { type: Boolean, default: true },
  },
  { timestamps: true }
);

planSchema.index({ sortOrder: 1, name: 1 });

module.exports = mongoose.model('Plan', planSchema);
