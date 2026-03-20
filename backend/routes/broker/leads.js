const express = require('express');
const { protectBroker } = require('../../middleware/auth');
const leadController = require('../../controllers/broker/leadController');

const router = express.Router();

router.use(protectBroker);
router.get('/', leadController.list);

module.exports = router;
