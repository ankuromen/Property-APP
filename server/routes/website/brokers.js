const express = require('express');
const brokerController = require('../../controllers/website/brokerController');

const router = express.Router();

router.get('/', brokerController.list);
router.get('/:id', brokerController.getById);

module.exports = router;
