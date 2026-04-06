const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

async function resolveActor(req, res, next, actorKey) {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Token required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await Vendor.findById(decoded.id).select('-password');
    if (!vendor) {
      return res.status(401).json({ message: 'Account not found.' });
    }

    // Backward compatible assignment for existing controllers.
    req.vendor = vendor;
    if (actorKey) req[actorKey] = vendor;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized. Invalid or expired token.' });
  }
}

// Legacy middleware name used by existing vendor routes.
exports.protectVendor = async (req, res, next) => resolveActor(req, res, next, null);

// New product-facing middleware alias used by broker routes.
exports.protectBroker = async (req, res, next) => resolveActor(req, res, next, 'broker');
