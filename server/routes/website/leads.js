const express = require('express');
const leadController = require('../../controllers/website/leadController');

const router = express.Router();

router.post('/', leadController.create);

module.exports = router;
