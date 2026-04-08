const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    bookingType: { type: String, enum: ['consultation', 'visit'], default: 'consultation' },
    consultationFee: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ['pending', 'verified', 'failed', 'refunded'], default: 'pending' },
    status: {
      type: String,
      enum: ['pending_payment', 'confirmed', 'cancelled', 'refund_requested', 'refunded'],
      default: 'pending_payment',
    },
    paymentRef: { type: String, trim: true },
    notes: { type: String, trim: true },
    scheduledAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
