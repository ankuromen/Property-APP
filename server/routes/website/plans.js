const express = require('express');
const planController = require('../../controllers/website/planController');

const router = express.Router();

router.get('/', planController.listPublic);

module.exports = router;
