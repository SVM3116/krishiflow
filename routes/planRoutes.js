const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const requireAuth = require('../middleware/authMiddleware');

// Mounted on /api/plans
router.get('/', requireAuth, planController.getPlans);
router.get('/:planId', requireAuth, planController.getPlanById);

module.exports = router;
