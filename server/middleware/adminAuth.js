/**
 * Protects /api/admin/* with shared secret (private ops / admin-panel).
 * Header: X-Admin-Key: <ADMIN_API_KEY>
 */
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  const expected = process.env.ADMIN_API_KEY;
  if (!expected || !key || key !== expected) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

module.exports = { requireAdmin };
