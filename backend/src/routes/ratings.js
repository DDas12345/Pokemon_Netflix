const express = require('express');
const ratingsController = require('../controllers/ratingsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all ratings routes
router.use(authMiddleware);

router.get('/:pokemonId/average', ratingsController.getAverageRating);
router.get('/:pokemonId', ratingsController.getRating);
router.post('/', ratingsController.upsertRating);

module.exports = router;
