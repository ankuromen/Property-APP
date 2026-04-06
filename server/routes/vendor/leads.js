const express = require('express');
const { protectVendor } = require('../../middleware/auth');
const leadController = require('../../controllers/vendor/leadController');

const router = express.Router();

router.use(protectVendor);
router.get('/', leadController.list);

module.exports = router;
