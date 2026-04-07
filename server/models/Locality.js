const mongoose = require('mongoose');

const localitySchema = new mongoose.Schema(
  {
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    name: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

localitySchema.index({ cityId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Locality', localitySchema);
