const mongoose = require('mongoose');
const Property = require('../../models/Property');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;

// Keys that must not be set from req.body (server-controlled)
const PROTECTED_KEYS = [
  'vendorId',
  'postedByType',
  'postedById',
  'status',
  'reviewNotes',
  'reviewedBy',
  'reviewedAt',
  '_id',
  '__v',
  'createdAt',
  'updatedAt',
];

function getEditablePaths() {
  return Object.keys(Property.schema.paths).filter((k) => !PROTECTED_KEYS.includes(k));
}

function buildPropertyFromBody(body) {
  const paths = getEditablePaths();
  const doc = {};
  for (const key of paths) {
    if (body[key] === undefined) continue;
    const path = Property.schema.path(key);
    if (!path) continue;
    const val = body[key];
    if (path.instance === 'Number' && val !== '' && val !== null && !Number.isNaN(Number(val))) {
      doc[key] = Number(val);
    } else if (path.instance === 'Boolean') {
      doc[key] = val === true || val === 'true' || val === 1;
    } else if (path.instance === 'Date' && val) {
      doc[key] = new Date(val);
    } else if (path.instance === 'Array' || path.instance === 'Mixed') {
      doc[key] = Array.isArray(val) ? val : val;
    } else if (path.instance === 'ObjectID') {
      if (Array.isArray(val)) doc[key] = val.map((id) => (mongoose.Types.ObjectId.isValid(id) ? id : null)).filter(Boolean);
      else if (mongoose.Types.ObjectId.isValid(val)) doc[key] = val;
    } else {
      doc[key] = val;
    }
  }
  return doc;
}

exports.create = async (req, res) => {
  try {
    const body = { ...req.body };
    const title = body.title || body.type;
    const price = body.price !== undefined && body.price !== null ? Number(body.price) : null;
    const propertyType = body.propertyType || body.type;

    if (!title || !propertyType) {
      return res.status(400).json({
        message: 'Please provide title and property type',
      });
    }
    if (price === null || isNaN(price) || price < 0) {
      return res.status(400).json({
        message: 'Please provide a valid price',
      });
    }

    const doc = buildPropertyFromBody(body);
    const postingAs = String(body.postingAs || '').trim().toLowerCase();
    const requestedPostedByType = postingAs === 'broker' ? 'broker' : 'owner';
    const userRoles = Array.isArray(req.vendor?.roles) ? req.vendor.roles : [];

    if (requestedPostedByType === 'broker' && !userRoles.includes('broker')) {
      return res.status(403).json({
        message: 'Broker profile approval is required before posting as broker.',
      });
    }

    doc.title = String(doc.title || title).trim();
    doc.propertyType = String(doc.propertyType || propertyType).trim();
    doc.price = price;
    doc.vendorId = req.vendor._id;
    doc.postedByType = requestedPostedByType;
    doc.postedById = req.vendor._id;
    doc.status = 'Pending';
    if (requestedPostedByType === 'owner') {
      doc.ownerContact = {
        name: req.vendor?.name || undefined,
        phone: req.vendor?.phone || undefined,
        email: req.vendor?.email || undefined,
      };
    }
    if (doc.location === undefined && (body.locality || body.city)) {
      doc.location = [body.locality, body.city].filter(Boolean).join(', ');
    }
    if (!doc.type) doc.type = doc.propertyType;

    const property = await Property.create(doc);
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create property' });
  }
};

exports.listMine = async (req, res) => {
  try {
    const properties = await Property.find({ vendorId: req.vendor._id }).sort({
      createdAt: -1,
    });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list properties' });
  }
};

exports.getOne = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Property not found' });
    }
    const property = await Property.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id,
    });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get property' });
  }
};

exports.update = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Property not found' });
    }
    const property = await Property.findOne({
      _id: req.params.id,
      vendorId: req.vendor._id,
    });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const doc = buildPropertyFromBody(req.body);
    for (const [key, value] of Object.entries(doc)) {
      property[key] = value;
    }
    if (req.body.location !== undefined) property.location = req.body.location;
    else if (property.locality || property.city) {
      property.location = [property.locality, property.city].filter(Boolean).join(', ');
    }
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update property' });
  }
};

exports.remove = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Property not found' });
    }
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.vendor._id,
    });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete property' });
  }
};
