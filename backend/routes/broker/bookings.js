const express = require('express');
const { protectBroker } = require('../../middleware/auth');
const bookingController = require('../../controllers/broker/bookingController');

const router = express.Router();

router.use(protectBroker);
router.get('/', bookingController.listMine);
router.patch('/:id/status', bookingController.updateStatus);

module.exports = router;
