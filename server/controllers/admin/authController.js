const jwt = require('jsonwebtoken');
const AdminUser = require('../../models/AdminUser');

/**
 * POST /api/admin/auth/login
 * body: { loginId, password } — loginId is the super admin email
 */
exports.login = async (req, res) => {
  try {
    const { loginId, password } = req.body || {};
    if (!loginId || !password) {
      return res.status(400).json({ message: 'Login ID and password are required' });
    }

    const email = String(loginId).trim().toLowerCase();
    const admin = await AdminUser.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({ message: 'Invalid login ID or password' });
    }

    const match = await admin.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid login ID or password' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    const token = jwt.sign(
      {
        admin: true,
        role: admin.role,
        sub: String(admin._id),
      },
      secret,
      { expiresIn: '8h' }
    );

    res.json({ token, expiresIn: 28800 });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed' });
  }
};
