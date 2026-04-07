/**
 * Upserts default subscription plans (admin-editable later).
 * Usage (from `server/`): `npm run seed:plans`
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Plan = require('../models/Plan');

const DEFAULTS = [
  {
    code: 'starter',
    name: 'Starter',
    description: 'Free tier with per-listing lead limits. Upgrade anytime.',
    priceAmount: 0,
    billingCycle: 'none',
    leadCapPerListing: 5,
    profileQuota: 3,
    sortOrder: 0,
    isActive: true,
    showOnWebsite: true,
  },
  {
    code: 'bronze',
    name: 'Bronze',
    description: 'Higher per-listing lead caps and profile quota for growing brokers.',
    priceAmount: 999,
    billingCycle: 'monthly',
    leadCapPerListing: 10,
    profileQuota: 15,
    sortOrder: 1,
    isActive: true,
    showOnWebsite: true,
  },
  {
    code: 'silver',
    name: 'Silver',
    description: 'Strong limits for active listers.',
    priceAmount: 2499,
    billingCycle: 'monthly',
    leadCapPerListing: 50,
    profileQuota: 40,
    sortOrder: 2,
    isActive: true,
    showOnWebsite: true,
  },
  {
    code: 'gold',
    name: 'Gold',
    description: 'Unlimited leads per listing and maximum profile quota.',
    priceAmount: 4999,
    billingCycle: 'monthly',
    leadCapPerListing: -1,
    profileQuota: 100,
    sortOrder: 3,
    isActive: true,
    showOnWebsite: true,
  },
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
  }
  await mongoose.connect(uri);
  for (const row of DEFAULTS) {
    await Plan.findOneAndUpdate({ code: row.code }, { $set: row }, { upsert: true, new: true });
    console.log('Plan:', row.code);
  }
  console.log('Done.');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
