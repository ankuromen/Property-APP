const Lead = require('../../models/Lead');
const Vendor = require('../../models/Vendor');

function isActiveSubscriber(vendor) {
  if (!vendor) return false;
  if (vendor.subscriptionStatus !== 'active') return false;
  if (!vendor.subscriptionEndsAt) return false;
  return new Date(vendor.subscriptionEndsAt).getTime() >= Date.now();
}

/**
 * GET /api/broker/leads — list all leads for the logged-in broker.
 * SPAM leads are always shown in full with isSpam flag; they do not consume the free daily non-spam visibility slots.
 */
exports.list = async (req, res) => {
  try {
    const broker = await Vendor.findById(req.vendor._id).select(
      'subscriptionStatus subscriptionEndsAt'
    );
    const subscribed = isActiveSubscriber(broker);

    const leads = await Lead.find({
      destinationType: 'broker',
      $or: [{ brokerId: req.vendor._id }, { vendorId: req.vendor._id }],
    })
      .populate('propertyId', 'title propertyType city locality price')
      .sort({ createdAt: -1 })
      .lean();

    if (subscribed) {
      return res.json({
        leads,
        leadAccess: {
          subscribed: true,
          freeDailyLimit: 5,
          visibleToday: null,
          totalToday: null,
        },
      });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    let visibleNonSpamToday = 0;
    let totalNonSpamToday = 0;

    const maskedLeads = leads.map((lead) => {
      const createdAt = new Date(lead.createdAt);
      const isToday = createdAt >= start && createdAt < end;

      if (lead.isSpam) {
        return { ...lead, isSpam: true };
      }

      if (!isToday) return lead;

      totalNonSpamToday += 1;
      if (visibleNonSpamToday < 5) {
        visibleNonSpamToday += 1;
        return lead;
      }

      return {
        ...lead,
        customerName: 'Upgrade to unlock',
        customerPhone: '🔒 Upgrade to unlock',
        masked: true,
      };
    });

    return res.json({
      leads: maskedLeads,
      leadAccess: {
        subscribed: false,
        freeDailyLimit: 5,
        visibleToday: visibleNonSpamToday,
        totalToday: totalNonSpamToday,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list leads' });
  }
};
