const User = require('../../models/User');

function sanitizeOut(user) {
  return {
    brokerProfileStatus: user.brokerProfileStatus || 'none',
    brokerProfile: user.brokerProfile || {},
    brokerProfileSubmittedAt: user.brokerProfileSubmittedAt || null,
    brokerProfileReviewedAt: user.brokerProfileReviewedAt || null,
    brokerProfileReviewNotes: user.brokerProfileReviewNotes || '',
    roles: Array.isArray(user.roles) ? user.roles : ['user'],
  };
}

function parseCities(raw) {
  if (Array.isArray(raw)) return raw.map((v) => String(v).trim()).filter(Boolean);
  if (typeof raw !== 'string') return [];
  return raw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.vendor._id).lean();
    if (!user) return res.status(404).json({ message: 'Account not found' });
    return res.json(sanitizeOut(user));
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to fetch broker profile' });
  }
};

exports.saveDraft = async (req, res) => {
  try {
    const user = await User.findById(req.vendor._id);
    if (!user) return res.status(404).json({ message: 'Account not found' });

    const body = req.body || {};
    user.brokerProfile = {
      fullName: String(body.fullName || user.name || '').trim(),
      phone: String(body.phone || user.phone || '').trim(),
      email: String(body.email || user.email || '').trim().toLowerCase(),
      companyName: String(body.companyName || '').trim(),
      experienceYears:
        body.experienceYears === '' || body.experienceYears == null ? undefined : Number(body.experienceYears),
      operatingCities: parseCities(body.operatingCities),
      reraNumber: String(body.reraNumber || '').trim(),
      bio: String(body.bio || '').trim(),
    };

    if (user.brokerProfileStatus !== 'approved') {
      user.brokerProfileStatus = 'draft';
    }
    await user.save();
    return res.json({ message: 'Broker profile draft saved', ...sanitizeOut(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to save broker profile' });
  }
};

exports.submit = async (req, res) => {
  try {
    const user = await User.findById(req.vendor._id);
    if (!user) return res.status(404).json({ message: 'Account not found' });

    const p = user.brokerProfile || {};
    if (!p.fullName || !p.phone || !p.companyName || !p.experienceYears || !p.bio) {
      return res.status(400).json({
        message: 'Please complete full name, phone, company name, experience, and bio before submit.',
      });
    }

    user.brokerProfileStatus = 'pending';
    user.brokerProfileSubmittedAt = new Date();
    user.brokerProfileReviewedAt = undefined;
    user.brokerProfileReviewedBy = undefined;
    user.brokerProfileReviewNotes = '';
    await user.save();

    return res.json({ message: 'Broker profile submitted for admin approval', ...sanitizeOut(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to submit broker profile' });
  }
};

