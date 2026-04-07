const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

countrySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Country', countrySchema);
