const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

/**
 * Protect vendor routes: verify Bearer token and set req.vendor.
 * Use on any route that requires a logged-in vendor.
 */
exports.protectVendor = async (req, res, next) => {
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
      return res.status(401).json({ message: 'Vendor not found.' });
    }
    req.vendor = vendor;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized. Invalid or expired token.' });
  }
};
