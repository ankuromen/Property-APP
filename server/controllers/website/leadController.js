const mongoose = require('mongoose');
const Lead = require('../../models/Lead');
const Property = require('../../models/Property');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;

/**
 * POST /api/website/leads — create lead (no auth).
 * Body: customerName, customerPhone, propertyId.
 * Validates property exists and is active/public.
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

    const destinationType = property.postedByType === 'owner' ? 'owner' : 'broker';
    const destinationBrokerId = property.postedById || property.vendorId || null;

    const lead = await Lead.create({
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      propertyId: property._id,
      destinationType,
      status: 'new',
      vendorId: destinationType === 'broker' ? destinationBrokerId : undefined,
      brokerId: destinationType === 'broker' ? destinationBrokerId : undefined,
      ownerContactSnapshot:
        destinationType === 'owner'
          ? {
              name: property.ownerContact?.name,
              phone: property.ownerContact?.phone,
              email: property.ownerContact?.email,
            }
          : undefined,
    });

    res.status(201).json({
      message: 'Thank you! The broker/owner will contact you soon.',
      leadId: lead._id,
      destinationType: lead.destinationType,
      status: lead.status,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to submit contact request' });
  }
};
