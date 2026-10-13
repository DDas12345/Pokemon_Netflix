const express = require('express');
const watchlistController = require('../controllers/watchlistController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all watchlist routes
router.use(authMiddleware);

router.get('/', watchlistController.getWatchlist);
router.post('/', watchlistController.addToWatchlist);
router.delete('/:pokemonId', watchlistController.removeFromWatchlist);
router.get('/check/:pokemonId', watchlistController.checkWatchlist);

module.exports = router;
