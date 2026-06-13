const express = require('express');
const router = express.Router();
const pestController = require('../controllers/pestController');

router.post('/', pestController.detectPest);

module.exports = router;
