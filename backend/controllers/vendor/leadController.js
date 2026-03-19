const Lead = require('../../models/Lead');

/**
 * GET /api/vendor/leads — list all leads for the logged-in vendor (full access for now; daily limit later).
 */
exports.list = async (req, res) => {
  try {
    const leads = await Lead.find({ vendorId: req.vendor._id })
      .populate('propertyId', 'title propertyType city locality price')
      .sort({ createdAt: -1 })
      .lean();

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list leads' });
  }
};
