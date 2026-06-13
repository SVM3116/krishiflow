const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/:district', weatherController.getWeatherByDistrict);

module.exports = router;
