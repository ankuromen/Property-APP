const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Account not found.' });
    }

    // Backward compatible assignment for existing controllers.
    req.vendor = user;
    if (actorKey) req[actorKey] = user;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized. Invalid or expired token.' });
  }
}

// Legacy middleware name used by existing vendor routes.
exports.protectVendor = async (req, res, next) => resolveActor(req, res, next, null);

// New product-facing middleware alias used by broker routes.
exports.protectBroker = async (req, res, next) => resolveActor(req, res, next, 'broker');
