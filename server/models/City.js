const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    name: { type: String, required: true, trim: true },
    /** WGS84 — city centroid or representative point for maps */
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

citySchema.index({ stateId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('City', citySchema);
