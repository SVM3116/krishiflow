const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');

router.get('/', cropController.getCropPairs);

module.exports = router;
