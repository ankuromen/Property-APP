const express = require('express');
const propertyController = require('../../controllers/website/propertyController');
const publicSubmitRateLimit = require('../../middleware/publicSubmitRateLimit');

const router = express.Router();

router.get('/', propertyController.list);
router.post('/submit', publicSubmitRateLimit, propertyController.submit);
router.get('/:id', propertyController.getById);

module.exports = router;
