const express = require('express');
const { protectVendor } = require('../../middleware/auth');
const propertyController = require('../../controllers/vendor/propertyController');

const router = express.Router();

router.use(protectVendor);

router.post('/', propertyController.create);
router.get('/', propertyController.listMine);
router.get('/:id', propertyController.getOne);
router.put('/:id', propertyController.update);
router.delete('/:id', propertyController.remove);

module.exports = router;
