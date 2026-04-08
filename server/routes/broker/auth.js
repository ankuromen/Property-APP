const express = require('express');
const otpAuthController = require('../../controllers/broker/otpAuthController');

const router = express.Router();

router.post('/check-phone', otpAuthController.checkPhone);
router.post('/login/verify-otp', otpAuthController.loginVerifyOtp);
router.post('/signup', otpAuthController.signup);
router.post('/signup/verify-otp', otpAuthController.signupVerifyOtp);

module.exports = router;
