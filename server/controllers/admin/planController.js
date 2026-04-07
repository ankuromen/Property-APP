const mongoose = require('mongoose');
const Plan = require('../../models/Plan');
const Vendor = require('../../models/Vendor');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;

const ALLOWED_CYCLES = ['none', 'monthly', 'quarterly', 'half_yearly', 'yearly'];

function normalizeBody(body, partial) {
  const out = {};
  if (!partial || body.code !== undefined) {
    const code = body.code != null ? String(body.code).trim().toLowerCase() : '';
    out.code = code;
  }
  if (!partial || body.name !== undefined) {
    out.name = body.name != null ? String(body.name).trim() : '';
  }
  if (!partial || body.description !== undefined) {
    out.description = body.description != null ? String(body.description).trim() : '';
  }
  if (!partial || body.priceAmount !== undefined) {
    const n = Number(body.priceAmount);
    out.priceAmount = Number.isFinite(n) && n >= 0 ? n : 0;
  }
  if (!partial || body.billingCycle !== undefined) {
    const c = String(body.billingCycle || '').toLowerCase();
    out.billingCycle = ALLOWED_CYCLES.includes(c) ? c : 'monthly';
  }
  if (!partial || body.leadCapPerListing !== undefined) {
    const n = parseInt(body.leadCapPerListing, 10);
    out.leadCapPerListing = Number.isFinite(n) ? n : 5;
  }
  if (!partial || body.profileQuota !== undefined) {
    const n = parseInt(body.profileQuota, 10);
    out.profileQuota = Number.isFinite(n) && n >= 0 ? n : 0;
  }
  if (!partial || body.sortOrder !== undefined) {
    const n = parseInt(body.sortOrder, 10);
    out.sortOrder = Number.isFinite(n) ? n : 0;
  }
  if (!partial || body.isActive !== undefined) {
    out.isActive = Boolean(body.isActive);
  }
  if (!partial || body.showOnWebsite !== undefined) {
    out.showOnWebsite = Boolean(body.showOnWebsite);
  }
  return out;
}

exports.list = async (req, res) => {
  try {
    const items = await Plan.find().sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ plans: items });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list plans' });
  }
};

exports.get = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await Plan.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Plan not found' });
    res.json({ plan: doc });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load plan' });
  }
};

exports.create = async (req, res) => {
  try {
    const data = normalizeBody(req.body, false);
    if (!data.code) return res.status(400).json({ message: 'code is required' });
    if (!data.name) return res.status(400).json({ message: 'name is required' });
    if (data.billingCycle === 'none') {
      data.priceAmount = 0;
    }
    const doc = await Plan.create(data);
    res.status(201).json({ plan: doc });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'A plan with this code already exists' });
    res.status(500).json({ message: err.message || 'Failed to create plan' });
  }
};

exports.update = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const data = normalizeBody(req.body, true);
    if (data.name === '') return res.status(400).json({ message: 'name cannot be empty' });
    if (data.code === '') return res.status(400).json({ message: 'code cannot be empty' });
    const existing = await Plan.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Plan not found' });
    if (data.code && data.code !== existing.code) {
      const clash = await Plan.findOne({ code: data.code, _id: { $ne: req.params.id } });
      if (clash) return res.status(409).json({ message: 'Another plan already uses this code' });
    }
    if (data.billingCycle === 'none') data.priceAmount = 0;
    Object.assign(existing, data);
    await existing.save();
    res.json({ plan: existing });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Duplicate code' });
    res.status(500).json({ message: err.message || 'Failed to update plan' });
  }
};

exports.remove = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    const escaped = plan.code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const inUse = await Vendor.exists({ subscriptionPlanId: new RegExp(`^${escaped}$`, 'i') });
    if (inUse) {
      return res.status(400).json({
        message: 'Cannot delete: accounts reference this plan. Deactivate it or reassign subscribers first.',
      });
    }
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete plan' });
  }
};
