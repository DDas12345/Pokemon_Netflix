const express = require('express');
const historyController = require('../controllers/historyController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all history routes
router.use(authMiddleware);

router.get('/', historyController.getHistory);
router.post('/', historyController.updateHistory);

module.exports = router;
