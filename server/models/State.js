const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema(
  {
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

stateSchema.index({ countryId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('State', stateSchema);
