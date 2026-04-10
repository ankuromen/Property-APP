const mongoose = require('mongoose');
const Property = require('../../models/Property');
const User = require('../../models/User');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;

/**
 * GET /api/admin/properties — list properties for moderation (query: status, page, limit).
 */
exports.list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = {};
    if (status && ['Pending', 'Active', 'Rejected'].includes(String(status))) {
      filter.status = status;
    }

    const [items, total] = await Promise.all([
      Property.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('vendorId', 'name email phone')
        .populate('postedById', 'name email phone')
        .lean(),
      Property.countDocuments(filter),
    ]);

    res.json({
      properties: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list properties' });
  }
};

/**
 * PATCH /api/admin/properties/:id/approve
 */
exports.approve = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.status = 'Active';
    property.reviewedAt = new Date();
    property.reviewNotes = undefined;
    await property.save();

    // Owner role is granted after first approved owner listing.
    if (property.postedByType === 'owner' && property.postedById) {
      await User.updateOne(
        { _id: property.postedById, roles: { $ne: 'owner' } },
        { $addToSet: { roles: 'owner' } }
      );
    }

    res.json({ message: 'Listing approved', property });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to approve' });
  }
};

/**
 * PATCH /api/admin/properties/:id/reject
 * body: { reason: string }
 */
exports.reject = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const reason = req.body.reason != null ? String(req.body.reason).trim() : '';
    if (!reason) {
      return res.status(400).json({ message: 'Please provide a rejection reason' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.status = 'Rejected';
    property.reviewNotes = reason;
    property.reviewedAt = new Date();
    await property.save();

    res.json({ message: 'Listing rejected', property });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to reject' });
  }
};

/**
 * PATCH /api/admin/properties/:id/request-verification
 * body: { message: string } — listing stays Pending; lister sees what to fix.
 */
exports.requestVerification = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const message = req.body.message != null ? String(req.body.message).trim() : '';
    if (!message) {
      return res.status(400).json({ message: 'Please provide a message for the lister' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.status = 'Pending';
    property.reviewNotes = message;
    property.reviewedAt = new Date();
    await property.save();

    res.json({ message: 'Verification requested', property });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update' });
  }
};
