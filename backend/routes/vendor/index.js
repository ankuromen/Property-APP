const express = require('express');
const authRoutes = require('./auth');
const propertyRoutes = require('./properties');
const profileRoutes = require('./profile');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
