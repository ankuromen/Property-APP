/**
 * Creates or updates the super admin user in MongoDB (password is hashed by the model).
 *
 * Usage (from `server/`): `npm run seed:admin`
 * Requires `MONGODB_URI` in `.env`.
 */
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const AdminUser = require(path.join(__dirname, '../models/AdminUser'));

const EMAIL = 'techinnoverz@gmail.com';
const PASSWORD = 'admin123';

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in environment.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  let admin = await AdminUser.findOne({ email: EMAIL });
  if (!admin) {
    admin = new AdminUser({
      email: EMAIL,
      password: PASSWORD,
      role: 'super_admin',
    });
  } else {
    admin.password = PASSWORD;
    admin.role = 'super_admin';
  }

  await admin.save();
  console.log('Super admin ready:', EMAIL, '(change password after first login in production)');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
