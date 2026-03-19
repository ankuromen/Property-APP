const Vendor = require('../../models/Vendor');

exports.getProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor._id).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor._id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const { name, email, phone } = req.body;
    if (name !== undefined) vendor.name = name.trim();
    if (phone !== undefined) vendor.phone = phone.trim();
    if (email !== undefined && email.trim() !== vendor.email) {
      const existing = await Vendor.findOne({ email: email.trim().toLowerCase() });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
      vendor.email = email.trim().toLowerCase();
    }
    await vendor.save();

    const updated = await Vendor.findById(vendor._id).select('-password');
    res.json(updated);
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

    const vendor = await Vendor.findById(req.vendor._id).select('+password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const match = await vendor.matchPassword(currentPassword);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

    vendor.password = newPassword;
    await vendor.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update password' });
  }
};
