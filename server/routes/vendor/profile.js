const express = require('express');
const { protectVendor } = require('../../middleware/auth');
const profileController = require('../../controllers/vendor/profileController');

const router = express.Router();

router.use(protectVendor);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.put('/password', profileController.updatePassword);

module.exports = router;
