const express = require('express');
const propertyRoutes = require('./properties');
const leadRoutes = require('./leads');
const bookingRoutes = require('./bookings');
const brokerRoutes = require('./brokers');
const planRoutes = require('./plans');

const router = express.Router();

router.use('/properties', propertyRoutes);
router.use('/leads', leadRoutes);
router.use('/bookings', bookingRoutes);
router.use('/brokers', brokerRoutes);
router.use('/plans', planRoutes);

module.exports = router;
