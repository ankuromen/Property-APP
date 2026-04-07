const express = require('express');
const authController = require('../../controllers/admin/authController');
const { requireAdmin } = require('../../middleware/adminAuth');
const propertyRoutes = require('./properties');
const locationRoutes = require('./locations');
const planRoutes = require('./plans');

const router = express.Router();

router.post('/auth/login', authController.login);

router.use(requireAdmin);
router.use('/properties', propertyRoutes);
router.use('/locations', locationRoutes);
router.use('/plans', planRoutes);

module.exports = router;
