const User = require('../../models/User');
const { planBadgeLabel } = require('../../utils/planBadge');

exports.getProfile = async (req, res) => {
  try {
    const vendor = await User.findById(req.vendor._id).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Broker not found' });
    const o = vendor.toObject();
    res.json({ ...o, planBadge: planBadgeLabel(o.subscriptionPlanId) });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const vendor = await User.findById(req.vendor._id);
    if (!vendor) return res.status(404).json({ message: 'Broker not found' });

    const { name, email, phone, consultationFee } = req.body;
    if (name !== undefined) vendor.name = name.trim();
    if (phone !== undefined) vendor.phone = phone.trim();
    if (consultationFee !== undefined) {
      const fee = Number(consultationFee);
      if (Number.isNaN(fee) || fee < 0) return res.status(400).json({ message: 'consultationFee must be a non-negative number' });
      vendor.consultationFee = fee;
    }
    if (email !== undefined && email.trim() !== vendor.email) {
      const existing = await User.findOne({ email: email.trim().toLowerCase() });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
      vendor.email = email.trim().toLowerCase();
    }
    await vendor.save();

    const updated = await User.findById(vendor._id).select('-password');
    const o = updated.toObject();
    res.json({ ...o, planBadge: planBadgeLabel(o.subscriptionPlanId) });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update profile' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current password and new password' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const vendor = await User.findById(req.vendor._id).select('+password');
    if (!vendor) return res.status(404).json({ message: 'Broker not found' });

    const match = await vendor.matchPassword(currentPassword);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

    vendor.password = newPassword;
    await vendor.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update password' });
  }
};

exports.getSubscriptionStatus = async (req, res) => {
  try {
    const vendor = await User.findById(req.vendor._id).select(
      'subscriptionStatus subscriptionPlanId subscriptionStartAt subscriptionEndsAt'
    );
    if (!vendor) return res.status(404).json({ message: 'Broker not found' });

    const now = new Date();
    const isSubscriptionActive =
      vendor.subscriptionStatus === 'active' &&
      vendor.subscriptionEndsAt &&
      new Date(vendor.subscriptionEndsAt).getTime() >= now.getTime();

    res.json({
      subscriptionStatus: vendor.subscriptionStatus || 'free',
      subscriptionPlanId: vendor.subscriptionPlanId || null,
      subscriptionStartAt: vendor.subscriptionStartAt || null,
      subscriptionEndsAt: vendor.subscriptionEndsAt || null,
      isSubscriptionActive,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get subscription status' });
  }
};
