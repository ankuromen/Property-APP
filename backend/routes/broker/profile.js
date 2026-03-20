const express = require('express');
const { protectBroker } = require('../../middleware/auth');
const profileController = require('../../controllers/broker/profileController');

const router = express.Router();

router.use(protectBroker);

router.get('/', profileController.getProfile);
router.get('/subscription', profileController.getSubscriptionStatus);
router.put('/', profileController.updateProfile);
router.put('/password', profileController.updatePassword);

module.exports = router;
