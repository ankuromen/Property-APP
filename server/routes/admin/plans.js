const express = require('express');
const planController = require('../../controllers/admin/planController');

const router = express.Router();

router.get('/', planController.list);
router.post('/', planController.create);
router.get('/:id', planController.get);
router.patch('/:id', planController.update);
router.delete('/:id', planController.remove);

module.exports = router;
