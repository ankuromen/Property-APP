const express = require('express');
const { requireAdmin } = require('../../middleware/adminAuth');
const propertyRoutes = require('./properties');

const router = express.Router();

router.use(requireAdmin);
router.use('/properties', propertyRoutes);

module.exports = router;
