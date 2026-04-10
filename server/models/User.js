const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User account model.
 * IMPORTANT: This model intentionally uses the existing "vendors" collection
 * so current data and ObjectIds remain valid after model rename.
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // Email is optional for phone-first auth. Kept unique when present.
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    // Default onboarding role. Later: upgrade to broker/owner.
    roles: { type: [String], default: ['user'] },
    brokerProfileStatus: {
      type: String,
      enum: ['none', 'draft', 'pending', 'approved', 'rejected'],
      default: 'none',
      index: true,
    },
    brokerProfile: {
      fullName: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      companyName: { type: String, trim: true },
      experienceYears: { type: Number, min: 0 },
      operatingCities: [{ type: String, trim: true }],
      reraNumber: { type: String, trim: true },
      bio: { type: String, trim: true },
    },
    brokerProfileSubmittedAt: { type: Date },
    brokerProfileReviewedAt: { type: Date },
    brokerProfileReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    brokerProfileReviewNotes: { type: String, trim: true },

    consultationFee: { type: Number, default: 100, min: 0 },
    subscriptionStatus: {
      type: String,
      enum: ['free', 'active', 'expired', 'cancelled'],
      default: 'free',
    },
    subscriptionPlanId: { type: String, trim: true },
    subscriptionStartAt: { type: Date },
    subscriptionEndsAt: { type: Date },

    // Password is optional (legacy email+password auth still supported for /api/vendor/*).
    password: { type: String, minlength: 6, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plainPassword) {
  if (!this.password) return false;
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema, 'vendors');

