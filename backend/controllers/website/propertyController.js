const mongoose = require('mongoose');
const Property = require('../../models/Property');
const Vendor = require('../../models/Vendor');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
const PHONE_REGEX = /^[6-9]\d{9}$/;

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
 * POST /api/website/properties/submit — submit owner listing (no auth).
 * New submissions are always stored as Pending.
 */
exports.submit = async (req, res) => {
  try {
    const {
      title,
      propertyType,
      price,
      ownerName,
      ownerPhone,
      ownerEmail,
      city,
      locality,
      description,
      addressLine1,
      transactionType,
      bhk,
      builtUpAreaSqft,
      website, // honeypot field: must stay empty
    } = req.body;

    if (website) {
      return res.status(400).json({ message: 'Invalid submission payload' });
    }

    if (!title || !propertyType || price === undefined || !ownerName || !ownerPhone) {
      return res.status(400).json({
        message: 'Please provide title, propertyType, price, ownerName and ownerPhone',
      });
    }

    const normalizedPhone = String(ownerPhone).replace(/\D/g, '');
    if (!PHONE_REGEX.test(normalizedPhone)) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit Indian mobile number' });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: 'Please provide a valid price greater than 0' });
    }

    const property = await Property.create({
      title: String(title).trim(),
      propertyType: String(propertyType).trim(),
      type: String(propertyType).trim(),
      price: numericPrice,
      city: city ? String(city).trim() : undefined,
      locality: locality ? String(locality).trim() : undefined,
      location: [locality, city].filter(Boolean).join(', ') || undefined,
      description: description ? String(description).trim() : '',
      addressLine1: addressLine1 ? String(addressLine1).trim() : undefined,
      transactionType: transactionType ? String(transactionType).trim() : undefined,
      bhk: bhk !== undefined && bhk !== '' ? Number(bhk) : undefined,
      builtUpAreaSqft: builtUpAreaSqft !== undefined && builtUpAreaSqft !== '' ? Number(builtUpAreaSqft) : undefined,
      postedByType: 'owner',
      ownerContact: {
        name: String(ownerName).trim(),
        phone: normalizedPhone,
        email: ownerEmail ? String(ownerEmail).trim().toLowerCase() : undefined,
      },
      status: 'Pending',
      visibility: 'Public',
      listedBy: 'Owner',
    });

    res.status(201).json({
      message: 'Property submitted successfully. It is under review.',
      trackingId: property._id,
      status: property.status,
      submittedAt: property.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to submit property' });
  }
};

/**
 * GET /api/website/properties — list public properties (no auth).
 */
exports.list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const sortBy = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    const sortOpt = { [sortBy]: order };
    if (sortBy !== 'createdAt') sortOpt.createdAt = -1;

    const filter = { status: 'Active', visibility: 'Public' };

    if (req.query.city) filter.city = new RegExp(req.query.city.trim(), 'i');
    if (req.query.locality) filter.locality = new RegExp(req.query.locality.trim(), 'i');
    if (req.query.propertyType) filter.propertyType = req.query.propertyType.trim();
    if (req.query.transactionType) filter.transactionType = req.query.transactionType.trim();
    if (req.query.minPrice != null && req.query.minPrice !== '') {
      filter.price = filter.price || {};
      filter.price.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice != null && req.query.maxPrice !== '') {
      filter.price = filter.price || {};
      filter.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.bhk != null && req.query.bhk !== '') {
      filter.bhk = Number(req.query.bhk);
    }

    const [properties, total] = await Promise.all([
      Property.find(filter, PUBLIC_PROPERTY_PROJECTION).lean(),
      Property.countDocuments(filter),
    ]);

    const brokerIds = [
      ...new Set(
        properties
          .map((p) => p.postedByType === 'broker' && (p.postedById || p.vendorId) && String(p.postedById || p.vendorId))
          .filter(Boolean)
      ),
    ];
    const brokers = brokerIds.length
      ? await Vendor.find({ _id: { $in: brokerIds } }).select('subscriptionStatus subscriptionEndsAt').lean()
      : [];
    const brokerMap = new Map(brokers.map((b) => [String(b._id), b]));

    const withBoost = properties.map((p) => {
      const brokerId = p.postedByType === 'broker' ? String(p.postedById || p.vendorId || '') : '';
      const broker = brokerMap.get(brokerId);
      const boost =
        broker &&
        broker.subscriptionStatus === 'active' &&
        broker.subscriptionEndsAt &&
        new Date(broker.subscriptionEndsAt).getTime() >= Date.now()
          ? 1
          : 0;
      return { ...p, _subscriptionBoost: boost };
    });

    withBoost.sort((a, b) => {
      if (b._subscriptionBoost !== a._subscriptionBoost) return b._subscriptionBoost - a._subscriptionBoost;
      const av = a[sortBy];
      const bv = b[sortBy];
      if (av === bv) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (order === 1) return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });

    const propertiesPage = withBoost.slice(skip, skip + limit).map((p) => {
      const { _subscriptionBoost, ...rest } = p;
      return rest;
    });

    res.json({
      properties: propertiesPage,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const property = await Property.findOne(
      {
        _id: req.params.id,
        status: 'Active',
        visibility: 'Public',
      },
      PUBLIC_PROPERTY_PROJECTION
    ).lean();

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get property' });
  }
};
