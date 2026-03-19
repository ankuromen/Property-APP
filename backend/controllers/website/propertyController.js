const mongoose = require('mongoose');
const Property = require('../../models/Property');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;

/**
 * GET /api/website/properties — list public properties (no auth).
 * Query: page, limit, sort, city, propertyType, minPrice, maxPrice, transactionType, etc.
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
      Property.find(filter).sort(sortOpt).skip(skip).limit(limit).lean(),
      Property.countDocuments(filter),
    ]);

    res.json({
      properties,
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

    const property = await Property.findOne({
      _id: req.params.id,
      status: 'Active',
      visibility: 'Public',
    }).lean();

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get property' });
  }
};
