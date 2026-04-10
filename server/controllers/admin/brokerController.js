const mongoose = require('mongoose');
const User = require('../../models/User');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;

exports.list = async (req, res) => {
  try {
    const status = String(req.query.status || 'pending').trim().toLowerCase();
    const allowed = ['pending', 'approved', 'rejected', 'draft', 'none'];
    const filter = allowed.includes(status)
      ? { brokerProfileStatus: status }
      : { brokerProfileStatus: { $in: ['pending', 'approved', 'rejected'] } };

    const users = await User.find(filter)
      .select(
        'name email phone roles brokerProfileStatus brokerProfile brokerProfileSubmittedAt brokerProfileReviewedAt brokerProfileReviewNotes'
      )
      .sort({ brokerProfileSubmittedAt: -1, updatedAt: -1 })
      .lean();

    return res.json({ brokers: users });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to list broker profiles' });
  }
};

exports.approve = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.brokerProfileStatus = 'approved';
    user.brokerProfileReviewedAt = new Date();
    user.brokerProfileReviewedBy = req.admin?.sub;
    user.brokerProfileReviewNotes = '';
    user.roles = Array.isArray(user.roles) ? user.roles : ['user'];
    if (!user.roles.includes('broker')) user.roles.push('broker');
    await user.save();

    return res.json({ message: 'Broker profile approved', userId: user._id });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to approve broker profile' });
  }
};

exports.reject = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const reason = String(req.body.reason || '').trim();
    if (!reason) return res.status(400).json({ message: 'Please provide rejection reason' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.brokerProfileStatus = 'rejected';
    user.brokerProfileReviewedAt = new Date();
    user.brokerProfileReviewedBy = req.admin?.sub;
    user.brokerProfileReviewNotes = reason;
    await user.save();

    return res.json({ message: 'Broker profile rejected', userId: user._id });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to reject broker profile' });
  }
};

