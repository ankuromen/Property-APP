const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const PendingSignup = require('../../models/PendingSignup');
const { normalizePhone, validateIndianMobile } = require('../../utils/phone');
const { sendOtp, verifyOtp } = require('../../utils/otpProvider');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

function outUser(vendor) {
  return {
    id: vendor._id,
    name: vendor.name,
    email: vendor.email || null,
    phone: vendor.phone,
    roles: vendor.roles || ['user'],
  };
}

/**
 * POST /api/broker/auth/check-phone
 * body: { phone }
 * If phone exists -> send OTP and return { exists: true, message: "OTP sent successfully" }
 * Else -> { exists: false }
 */
exports.checkPhone = async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    if (!validateIndianMobile(phone)) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit Indian mobile number' });
    }

    const existing = await User.findOne({ phone }).lean();
    if (!existing) return res.json({ exists: false });

    await sendOtp(phone, 'login');
    return res.json({ exists: true, message: 'OTP sent successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to check phone' });
  }
};

/**
 * POST /api/broker/auth/login/verify-otp
 * body: { phone, otp }
 */
exports.loginVerifyOtp = async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const otp = String(req.body.otp || '').trim();
    if (!validateIndianMobile(phone)) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit Indian mobile number' });
    }
    if (!otp) return res.status(400).json({ message: 'OTP is required' });

    const vendor = await User.findOne({ phone });
    if (!vendor) return res.status(404).json({ message: 'Account not found' });

    await verifyOtp(phone, 'login', otp);

    const token = generateToken(vendor._id);
    return res.json({ user: outUser(vendor), token });
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Invalid or expired OTP' });
  }
};

/**
 * POST /api/broker/auth/signup
 * body: { fullName, phone, email? }
 * Creates pending signup + sends OTP.
 */
exports.signup = async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const fullName = req.body.fullName != null ? String(req.body.fullName).trim() : '';
    const email = req.body.email != null ? String(req.body.email).trim().toLowerCase() : '';

    if (!validateIndianMobile(phone)) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit Indian mobile number' });
    }
    if (!fullName) return res.status(400).json({ message: 'Full name is required' });

    const exists = await User.findOne({ phone }).lean();
    if (exists) return res.status(400).json({ message: 'Phone already registered. Please log in.' });

    if (email) {
      const emailOwner = await User.findOne({ email }).select('_id phone').lean();
      if (emailOwner && emailOwner.phone !== phone) {
        return res.status(400).json({ message: 'Email already in use. Please use a different email or leave it empty.' });
      }
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins window
    await PendingSignup.findOneAndUpdate(
      { phone },
      { $set: { phone, fullName, email: email || undefined, expiresAt } },
      { upsert: true, new: true }
    );

    await sendOtp(phone, 'signup');
    return res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to start signup' });
  }
};

/**
 * POST /api/broker/auth/signup/verify-otp
 * body: { phone, otp }
 * Verifies OTP then creates account (roles: ['user']) and logs in.
 */
exports.signupVerifyOtp = async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const otp = String(req.body.otp || '').trim();
    if (!validateIndianMobile(phone)) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit Indian mobile number' });
    }
    if (!otp) return res.status(400).json({ message: 'OTP is required' });

    const pending = await PendingSignup.findOne({ phone });
    if (!pending) return res.status(400).json({ message: 'Signup session expired. Please sign up again.' });
    if (new Date() > new Date(pending.expiresAt)) {
      await PendingSignup.deleteOne({ _id: pending._id });
      return res.status(400).json({ message: 'Signup session expired. Please sign up again.' });
    }

    await verifyOtp(phone, 'signup', otp);

    // Re-check uniqueness right before create to avoid race conditions.
    if (pending.email) {
      const emailOwner = await User.findOne({ email: pending.email }).select('_id phone').lean();
      if (emailOwner && emailOwner.phone !== phone) {
        return res.status(400).json({ message: 'Email already in use. Please sign up again with a different email.' });
      }
    }

    const vendor = await User.create({
      name: pending.fullName,
      phone,
      email: pending.email || undefined,
      roles: ['user'],
      subscriptionStatus: 'free',
    });

    await PendingSignup.deleteOne({ _id: pending._id });

    const token = generateToken(vendor._id);
    return res.status(201).json({ user: outUser(vendor), token });
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(400).json({ message: 'Email already in use. Please sign up again with a different email.' });
    }
    return res.status(400).json({ message: err.message || 'Invalid or expired OTP' });
  }
};

