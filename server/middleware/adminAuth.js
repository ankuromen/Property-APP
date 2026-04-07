const jwt = require('jsonwebtoken');

/**
 * Protects /api/admin/* after login routes.
 * Requires `Authorization: Bearer <token>` with JWT payload `{ admin: true }` from POST /api/admin/auth/login.
 */
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = auth.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'Server misconfiguration' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (decoded && decoded.admin === true) {
      req.adminAuth = 'jwt';
      req.admin = decoded;
      return next();
    }
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.status(401).json({ message: 'Unauthorized' });
}

module.exports = { requireAdmin };
