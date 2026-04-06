const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    // Legacy broker pointer; kept for compatibility with existing queries.
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    // New broker destination pointer.
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    destinationType: { type: String, enum: ['broker', 'owner'], required: true, default: 'broker' },
    ownerContactSnapshot: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
    },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
