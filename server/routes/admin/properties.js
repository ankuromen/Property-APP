const express = require('express');
const propertyController = require('../../controllers/admin/propertyController');

const router = express.Router();

router.get('/', propertyController.list);
router.patch('/:id/approve', propertyController.approve);
router.patch('/:id/reject', propertyController.reject);
router.patch('/:id/request-verification', propertyController.requestVerification);

module.exports = router;
