const express = require('express');
const bookingController = require('../../controllers/website/bookingController');

const router = express.Router();

router.post('/create-order', bookingController.createOrder);
router.post('/verify-payment', bookingController.verifyPayment);
router.post('/confirm', bookingController.confirmBooking);

module.exports = router;
