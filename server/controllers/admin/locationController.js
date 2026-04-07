const mongoose = require('mongoose');
const Country = require('../../models/Country');
const State = require('../../models/State');
const City = require('../../models/City');
const Locality = require('../../models/Locality');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;

function dupMessage(err) {
  if (err && err.code === 11000) return 'A record with this name already exists at this level';
  return err.message || 'Operation failed';
}

function parseLatLng(latitude, longitude) {
  const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude);
  const lng = typeof longitude === 'number' ? longitude : parseFloat(longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return { error: 'latitude and longitude must be valid numbers' };
  }
  if (lat < -90 || lat > 90) return { error: 'latitude must be between -90 and 90' };
  if (lng < -180 || lng > 180) return { error: 'longitude must be between -180 and 180' };
  return { lat, lng };
}

// —— Countries ——
exports.listCountries = async (req, res) => {
  try {
    const items = await Country.find().sort({ name: 1 }).lean();
    res.json({ countries: items });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list countries' });
  }
};

exports.createCountry = async (req, res) => {
  try {
    const name = req.body.name != null ? String(req.body.name).trim() : '';
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const doc = await Country.create({ name });
    res.status(201).json({ country: doc });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: dupMessage(err) });
    res.status(500).json({ message: err.message || 'Failed to create country' });
  }
};

exports.getCountry = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await Country.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Country not found' });
    res.json({ country: doc });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load country' });
  }
};

exports.updateCountry = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const name = req.body.name != null ? String(req.body.name).trim() : '';
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const doc = await Country.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Country not found' });
    res.json({ country: doc });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: dupMessage(err) });
    res.status(500).json({ message: err.message || 'Failed to update country' });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const child = await State.exists({ countryId: req.params.id });
    if (child) return res.status(400).json({ message: 'Remove all states under this country first' });
    const doc = await Country.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Country not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete country' });
  }
};

// —— States ——
exports.listStates = async (req, res) => {
  try {
    const countryId = req.query.countryId;
    if (!countryId || !isValidId(countryId)) {
      return res.status(400).json({ message: 'Query countryId is required and must be valid' });
    }
    const items = await State.find({ countryId }).sort({ name: 1 }).lean();
    res.json({ states: items });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list states' });
  }
};

exports.createState = async (req, res) => {
  try {
    const countryId = req.body.countryId;
    const name = req.body.name != null ? String(req.body.name).trim() : '';
    if (!countryId || !isValidId(countryId)) return res.status(400).json({ message: 'countryId is required' });
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const parent = await Country.findById(countryId);
    if (!parent) return res.status(404).json({ message: 'Country not found' });
    const doc = await State.create({ countryId, name });
    res.status(201).json({ state: doc });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: dupMessage(err) });
    res.status(500).json({ message: err.message || 'Failed to create state' });
  }
};

exports.getState = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await State.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'State not found' });
    res.json({ state: doc });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load state' });
  }
};

exports.updateState = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const name = req.body.name != null ? String(req.body.name).trim() : '';
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const doc = await State.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'State not found' });
    res.json({ state: doc });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: dupMessage(err) });
    res.status(500).json({ message: err.message || 'Failed to update state' });
  }
};

exports.deleteState = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const child = await City.exists({ stateId: req.params.id });
    if (child) return res.status(400).json({ message: 'Remove all cities under this state first' });
    const doc = await State.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'State not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete state' });
  }
};

// —— Cities ——
exports.listCities = async (req, res) => {
  try {
    const stateId = req.query.stateId;
    if (!stateId || !isValidId(stateId)) {
      return res.status(400).json({ message: 'Query stateId is required and must be valid' });
    }
    const items = await City.find({ stateId }).sort({ name: 1 }).lean();
    res.json({ cities: items });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list cities' });
  }
};

exports.createCity = async (req, res) => {
  try {
    const stateId = req.body.stateId;
    const name = req.body.name != null ? String(req.body.name).trim() : '';
    if (!stateId || !isValidId(stateId)) return res.status(400).json({ message: 'stateId is required' });
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const coords = parseLatLng(req.body.latitude, req.body.longitude);
    if (coords.error) return res.status(400).json({ message: coords.error });
    const parent = await State.findById(stateId);
    if (!parent) return res.status(404).json({ message: 'State not found' });
    const doc = await City.create({
      stateId,
      name,
      latitude: coords.lat,
      longitude: coords.lng,
    });
    res.status(201).json({ city: doc });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: dupMessage(err) });
    res.status(500).json({ message: err.message || 'Failed to create city' });
  }
};

exports.getCity = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await City.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'City not found' });
    res.json({ city: doc });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load city' });
  }
};

exports.updateCity = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const name = req.body.name != null ? String(req.body.name).trim() : '';
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const coords = parseLatLng(req.body.latitude, req.body.longitude);
    if (coords.error) return res.status(400).json({ message: coords.error });
    const doc = await City.findByIdAndUpdate(
      req.params.id,
      { name, latitude: coords.lat, longitude: coords.lng },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'City not found' });
    res.json({ city: doc });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: dupMessage(err) });
    res.status(500).json({ message: err.message || 'Failed to update city' });
  }
};

exports.deleteCity = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const child = await Locality.exists({ cityId: req.params.id });
    if (child) return res.status(400).json({ message: 'Remove all localities under this city first' });
    const doc = await City.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'City not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete city' });
  }
};

// —— Localities ——
exports.listLocalities = async (req, res) => {
  try {
    const cityId = req.query.cityId;
    if (!cityId || !isValidId(cityId)) {
      return res.status(400).json({ message: 'Query cityId is required and must be valid' });
    }
    const items = await Locality.find({ cityId }).sort({ name: 1 }).lean();
    res.json({ localities: items });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list localities' });
  }
};

exports.createLocality = async (req, res) => {
  try {
    const cityId = req.body.cityId;
    const name = req.body.name != null ? String(req.body.name).trim() : '';
    if (!cityId || !isValidId(cityId)) return res.status(400).json({ message: 'cityId is required' });
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const coords = parseLatLng(req.body.latitude, req.body.longitude);
    if (coords.error) return res.status(400).json({ message: coords.error });
    const parent = await City.findById(cityId);
    if (!parent) return res.status(404).json({ message: 'City not found' });
    const doc = await Locality.create({
      cityId,
      name,
      latitude: coords.lat,
      longitude: coords.lng,
    });
    res.status(201).json({ locality: doc });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: dupMessage(err) });
    res.status(500).json({ message: err.message || 'Failed to create locality' });
  }
};

exports.getLocality = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await Locality.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Locality not found' });
    res.json({ locality: doc });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load locality' });
  }
};

exports.updateLocality = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const name = req.body.name != null ? String(req.body.name).trim() : '';
    if (!name) return res.status(400).json({ message: 'Name is required' });
    if (req.body.latitude === undefined || req.body.longitude === undefined) {
      return res.status(400).json({ message: 'latitude and longitude are required' });
    }
    const coords = parseLatLng(req.body.latitude, req.body.longitude);
    if (coords.error) return res.status(400).json({ message: coords.error });
    const doc = await Locality.findByIdAndUpdate(
      req.params.id,
      { name, latitude: coords.lat, longitude: coords.lng },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'Locality not found' });
    res.json({ locality: doc });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: dupMessage(err) });
    res.status(500).json({ message: err.message || 'Failed to update locality' });
  }
};

exports.deleteLocality = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await Locality.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Locality not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete locality' });
  }
};
