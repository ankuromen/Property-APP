const mongoose = require('mongoose');
const Lead = require('../../models/Lead');
const Property = require('../../models/Property');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;

/**
 * POST /api/website/leads — create lead (no auth).
 * Body: customerName, customerPhone, propertyId.
 * Validates property exists and is active (status === 'Active', visibility === 'Public').
 */
exports.create = async (req, res) => {
  try {
    const { customerName, customerPhone, propertyId } = req.body;

    if (!customerName || !customerPhone || !propertyId) {
      return res.status(400).json({
        message: 'Please provide customer name, phone, and property ID',
      });
    }

    if (!isValidId(propertyId)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }

    const property = await Property.findOne({
      _id: propertyId,
      status: 'Active',
      visibility: 'Public',
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or not available for contact' });
    }

    const lead = await Lead.create({
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      propertyId: property._id,
      vendorId: property.vendorId,
    });

    res.status(201).json({
      message: 'Thank you! The vendor will contact you soon.',
      leadId: lead._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to submit contact request' });
  }
};
