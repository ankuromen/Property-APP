const express = require('express');
const authRoutes = require('./auth');
const propertyRoutes = require('./properties');
const profileRoutes = require('./profile');
const leadRoutes = require('./leads');
const bookingRoutes = require('./bookings');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/profile', profileRoutes);
router.use('/leads', leadRoutes);
router.use('/bookings', bookingRoutes);

module.exports = router;
