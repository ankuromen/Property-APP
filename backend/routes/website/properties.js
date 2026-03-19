const express = require('express');
const propertyController = require('../../controllers/website/propertyController');

const router = express.Router();

router.get('/', propertyController.list);
router.get('/:id', propertyController.getById);

module.exports = router;
