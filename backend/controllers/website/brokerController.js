const mongoose = require('mongoose');
const Vendor = require('../../models/Vendor');
const Property = require('../../models/Property');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;

exports.list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;

    const match = { postedByType: 'broker', status: 'Active', visibility: 'Public' };
    if (req.query.city) match.city = new RegExp(req.query.city.trim(), 'i');

    const grouped = await Property.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $ifNull: ['$postedById', '$vendorId'] },
          listingsCount: { $sum: 1 },
          citySample: { $first: '$city' },
          localitySample: { $first: '$locality' },
        },
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { listingsCount: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const brokerIds = grouped.map((g) => g._id);
    const brokers = await Vendor.find({ _id: { $in: brokerIds } }).select('name phone consultationFee subscriptionStatus subscriptionEndsAt').lean();
    const brokerMap = new Map(brokers.map((b) => [String(b._id), b]));

    const items = grouped
      .map((g) => {
        const b = brokerMap.get(String(g._id));
        if (!b) return null;
        return {
          _id: b._id,
          name: b.name,
          phone: b.phone,
          consultationFee: b.consultationFee,
          subscriptionStatus: b.subscriptionStatus,
          subscriptionEndsAt: b.subscriptionEndsAt,
          listingsCount: g.listingsCount,
          primaryCity: g.citySample || null,
          primaryLocality: g.localitySample || null,
        };
      })
      .filter(Boolean);

    const totalGroups = await Property.aggregate([
      { $match: match },
      { $group: { _id: { $ifNull: ['$postedById', '$vendorId'] } } },
      { $match: { _id: { $ne: null } } },
      { $count: 'total' },
    ]);
    const total = totalGroups[0]?.total || 0;

    res.json({
      brokers: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list brokers' });
  }
};

exports.getById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Broker not found' });

    const broker = await Vendor.findById(req.params.id).select('name phone consultationFee subscriptionStatus subscriptionEndsAt').lean();
    if (!broker) return res.status(404).json({ message: 'Broker not found' });

    const properties = await Property.find(
      {
        postedByType: 'broker',
        status: 'Active',
        visibility: 'Public',
        $or: [{ postedById: broker._id }, { vendorId: broker._id }],
      },
      { title: 1, city: 1, locality: 1, price: 1, propertyType: 1, images: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ ...broker, properties });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get broker profile' });
  }
};
