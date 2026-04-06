const express = require('express');
const { protectBroker } = require('../../middleware/auth');
const propertyController = require('../../controllers/broker/propertyController');

const router = express.Router();

router.use(protectBroker);

router.post('/', propertyController.create);
router.get('/', propertyController.listMine);
router.get('/:id', propertyController.getOne);
router.put('/:id', propertyController.update);
router.delete('/:id', propertyController.remove);

module.exports = router;
