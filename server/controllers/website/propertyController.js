const mongoose = require('mongoose');
const Property = require('../../models/Property');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;

const PUBLIC_PROPERTY_PROJECTION = {
  reviewNotes: 0,
  reviewedBy: 0,
  reviewedAt: 0,
  ownerContact: 0,
  vendorId: 0,
  postedById: 0,
  __v: 0,
};

/**
 * POST /api/website/properties/submit — disabled: guests cannot post properties (account required).
 * Use POST /api/broker/properties when authenticated.
 */
exports.submit = async (req, res) => {
  res.status(403).json({
    message:
      'Posting a property requires an account. Register or log in, then create a listing from your account.',
  });
};

/**
 * GET /api/website/properties — list public properties (no auth).
 */
exports.list = async (req, res) => {
  try {
    const {
      page = '1',
      limit = '12',
      sort = 'createdAt',
      order = 'desc',
      city,
      locality,
      propertyType,
      transactionType,
      minPrice,
      maxPrice,
      bhk,
    } = req.query;

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.min(48, Math.max(1, parseInt(String(limit), 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const filter = { status: 'Active', visibility: 'Public' };

    if (city) filter.city = new RegExp(String(city).trim(), 'i');
    if (locality) filter.locality = new RegExp(String(locality).trim(), 'i');
    if (propertyType) filter.propertyType = new RegExp(String(propertyType).trim(), 'i');
    if (transactionType) filter.transactionType = String(transactionType).trim();

    if (minPrice !== undefined && minPrice !== '') {
      const n = Number(minPrice);
      if (!Number.isNaN(n)) filter.price = { ...filter.price, $gte: n };
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      const n = Number(maxPrice);
      if (!Number.isNaN(n)) filter.price = { ...filter.price, $lte: n };
    }
    if (bhk !== undefined && bhk !== '') {
      const n = Number(bhk);
      if (!Number.isNaN(n)) filter.bhk = n;
    }

    const sortKey = ['createdAt', 'price', 'builtUpAreaSqft'].includes(String(sort))
      ? String(sort)
      : 'createdAt';
    const sortDir = String(order).toLowerCase() === 'asc' ? 1 : -1;

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .select(PUBLIC_PROPERTY_PROJECTION)
        .sort({ [sortKey]: sortDir })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Property.countDocuments(filter),
    ]);

    const withBoost = properties.map((p) => {
      const boost =
        p.listedBy === 'Broker' && p.subscriptionPlanId && p.subscriptionPlanId !== 'starter'
          ? 1
          : 0;
      return { ...p, _boost: boost };
    });

    withBoost.sort((a, b) => {
      if (b._boost !== a._boost) return b._boost - a._boost;
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      if (sortDir === 1) return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });

    const propertiesPage = withBoost.slice(skip, skip + limitNum).map((p) => {
      const { _boost, ...rest } = p;
      return rest;
    });

    res.json({
      properties: propertiesPage,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list properties' });
  }
};

/**
 * GET /api/website/properties/:id — get single public property (no auth).
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid property id' });
    }

    const property = await Property.findOne({
      _id: id,
      status: 'Active',
      visibility: 'Public',
    })
      .select(PUBLIC_PROPERTY_PROJECTION)
      .lean();

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get property' });
  }
};
