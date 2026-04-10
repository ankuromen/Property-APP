const express = require('express');
const { protectBroker } = require('../../middleware/auth');
const profileController = require('../../controllers/broker/profileController');
const brokerOnboardingController = require('../../controllers/broker/brokerOnboardingController');

const router = express.Router();

router.use(protectBroker);

router.get('/', profileController.getProfile);
router.get('/subscription', profileController.getSubscriptionStatus);
router.put('/', profileController.updateProfile);
router.put('/password', profileController.updatePassword);
router.get('/onboarding', brokerOnboardingController.getMe);
router.put('/onboarding', brokerOnboardingController.saveDraft);
router.post('/onboarding/submit', brokerOnboardingController.submit);

module.exports = router;
