const mongoose = require('mongoose');
const Booking = require('../../models/Booking');
const Property = require('../../models/Property');
const Vendor = require('../../models/Vendor');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;

exports.createOrder = async (req, res) => {
  try {
    const { propertyId, customerName, customerPhone, bookingType = 'consultation', notes, scheduledAt } = req.body;

    if (!propertyId || !customerName || !customerPhone) {
      return res.status(400).json({ message: 'Please provide propertyId, customerName and customerPhone' });
    }
    if (!isValidId(propertyId)) return res.status(400).json({ message: 'Invalid property ID' });

    const property = await Property.findOne({ _id: propertyId, status: 'Active', visibility: 'Public' }).lean();
    if (!property) return res.status(404).json({ message: 'Property not available for booking' });

    if (property.postedByType !== 'broker') {
      return res.status(400).json({ message: 'Consultation booking is currently available for broker listings only' });
    }

    const brokerId = property.postedById || property.vendorId;
    if (!brokerId) return res.status(400).json({ message: 'Broker mapping not found for this property' });

    const broker = await Vendor.findById(brokerId).select('consultationFee').lean();
    if (!broker) return res.status(404).json({ message: 'Broker not found' });

    const booking = await Booking.create({
      propertyId: property._id,
      brokerId,
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      bookingType,
      consultationFee: Number(broker.consultationFee ?? 100),
      paymentStatus: 'pending',
      status: 'pending_payment',
      notes: notes ? String(notes).trim() : undefined,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
    });

    res.status(201).json({
      message: 'Booking order created. Complete payment to confirm.',
      bookingId: booking._id,
      amount: booking.consultationFee,
      currency: 'INR',
      paymentStatus: booking.paymentStatus,
      status: booking.status,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create booking order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { bookingId, paymentRef } = req.body;
    if (!bookingId || !paymentRef) {
      return res.status(400).json({ message: 'Please provide bookingId and paymentRef' });
    }
    if (!isValidId(bookingId)) return res.status(400).json({ message: 'Invalid booking ID' });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.paymentRef = String(paymentRef).trim();
    booking.paymentStatus = 'verified';
    await booking.save();

    res.json({
      message: 'Payment verified successfully',
      bookingId: booking._id,
      paymentStatus: booking.paymentStatus,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to verify payment' });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ message: 'Please provide bookingId' });
    if (!isValidId(bookingId)) return res.status(400).json({ message: 'Invalid booking ID' });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.paymentStatus !== 'verified') {
      return res.status(400).json({ message: 'Booking cannot be confirmed before payment verification' });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.json({
      message: 'Booking confirmed successfully',
      bookingId: booking._id,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to confirm booking' });
  }
};
