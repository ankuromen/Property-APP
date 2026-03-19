const express = require('express');
const propertyRoutes = require('./properties');
const leadRoutes = require('./leads');

const router = express.Router();

router.use('/properties', propertyRoutes);
router.use('/leads', leadRoutes);

module.exports = router;
