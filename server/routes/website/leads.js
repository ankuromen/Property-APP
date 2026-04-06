const express = require('express');
const leadController = require('../../controllers/website/leadController');
const publicSubmitRateLimit = require('../../middleware/publicSubmitRateLimit');

const router = express.Router();

router.post('/send-otp', publicSubmitRateLimit, leadController.sendOtp);
router.post('/', publicSubmitRateLimit, leadController.create);

module.exports = router;
