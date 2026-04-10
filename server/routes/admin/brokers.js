const express = require('express');
const brokerController = require('../../controllers/admin/brokerController');

const router = express.Router();

router.get('/', brokerController.list);
router.patch('/:id/approve', brokerController.approve);
router.patch('/:id/reject', brokerController.reject);

module.exports = router;

