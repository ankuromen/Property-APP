const Plan = require('../../models/Plan');

/**
 * Public list for marketing / pricing UI (website).
 */
exports.listPublic = async (req, res) => {
  try {
    const items = await Plan.find({ isActive: true, showOnWebsite: true })
      .sort({ sortOrder: 1, name: 1 })
      .select(
        'code name description priceAmount billingCycle leadCapPerListing profileQuota sortOrder'
      )
      .lean();
    res.json({ plans: items });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list plans' });
  }
};
