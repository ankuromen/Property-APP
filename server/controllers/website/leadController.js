const crypto = require('crypto');
const mongoose = require('mongoose');
const Lead = require('../../models/Lead');
const LeadOtp = require('../../models/LeadOtp');
const Property = require('../../models/Property');
const { isSpamLead } = require('../../utils/leadSpam');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
const PHONE_REGEX = /^[6-9]\d{9}$/;

function normalizePhone(raw) {
  return String(raw || '').replace(/\D/g, '').slice(-10);
}

/**
 * POST /api/website/leads/send-otp
 * body: { customerPhone, propertyId }
 */
exports.sendOtp = async (req, res) => {
  try {
    const { customerPhone, propertyId } = req.body;
    const normalizedPhone = normalizePhone(customerPhone);

    if (!propertyId || !isValidId(propertyId)) {
      return res.status(400).json({ message: 'Valid property ID is required' });
    }
    if (!PHONE_REGEX.test(normalizedPhone)) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit Indian mobile number' });
    }

    const property = await Property.findOne({
      _id: propertyId,
      status: 'Active',
      visibility: 'Public',
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or not available for contact' });
    }

    const code = String(crypto.randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await LeadOtp.deleteMany({ phone: normalizedPhone, propertyId: property._id });
    await LeadOtp.create({
      phone: normalizedPhone,
      propertyId: property._id,
      code,
      expiresAt,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.info(`[lead OTP] ${normalizedPhone} property ${property._id} code: ${code}`);
    }

    res.json({
      message: 'OTP sent',
      expiresInSeconds: 600,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to send OTP' });
  }
};

/**
 * POST /api/website/leads — create lead after OTP; body: customerName, customerPhone, propertyId, otp, notes?
 */
exports.create = async (req, res) => {
  try {
    const { customerName, customerPhone, propertyId, otp, notes } = req.body;
    const normalizedPhone = normalizePhone(customerPhone);

    if (!customerName || !customerPhone || !propertyId || !otp) {
      return res.status(400).json({
        message: 'Please provide name, phone, property ID, and OTP',
      });
    }

    if (!isValidId(propertyId)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }
    if (!PHONE_REGEX.test(normalizedPhone)) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit Indian mobile number' });
    }

    const property = await Property.findOne({
      _id: propertyId,
      status: 'Active',
      visibility: 'Public',
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or not available for contact' });
    }

    const otpDoc = await LeadOtp.findOne({
      phone: normalizedPhone,
      propertyId: property._id,
    }).sort({ createdAt: -1 });

    if (!otpDoc || otpDoc.code !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    if (new Date() > otpDoc.expiresAt) {
      await LeadOtp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }

    await LeadOtp.deleteOne({ _id: otpDoc._id });

    const nameStr = String(customerName).trim();
    const notesStr = notes != null ? String(notes).trim() : '';
    const spam = isSpamLead([nameStr, notesStr, normalizedPhone]);

    const destinationType = property.postedByType === 'owner' ? 'owner' : 'broker';
    const destinationBrokerId = property.postedById || property.vendorId || null;

    const lead = await Lead.create({
      customerName: nameStr,
      customerPhone: normalizedPhone,
      propertyId: property._id,
      destinationType,
      status: 'new',
      notes: notesStr || undefined,
      isSpam: spam,
      phoneVerified: true,
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
      isSpam: lead.isSpam,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to submit contact request' });
  }
};
