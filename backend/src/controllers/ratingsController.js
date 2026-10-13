const db = require('../db/database');

function getRating(req, res, next) {
  try {
    const userId = req.user.id;
    const pokemonId = Number(req.params.pokemonId);

    if (isNaN(pokemonId)) {
      return res.status(400).json({ error: 'Valid pokemonId is required' });
    }

    const rating = db
      .prepare('SELECT * FROM ratings WHERE user_id = ? AND pokemon_id = ?')
      .get(userId, pokemonId);

    return res.json({ rating: rating || null });
  } catch (error) {
    return next(error);
  }
}

function getAverageRating(req, res, next) {
  try {
    const pokemonId = Number(req.params.pokemonId);

    if (isNaN(pokemonId)) {
      return res.status(400).json({ error: 'Valid pokemonId is required' });
    }

    const stats = db
      .prepare('SELECT AVG(rating) AS averageRating, COUNT(id) AS totalRatings FROM ratings WHERE pokemon_id = ?')
      .get(pokemonId);

    const averageRating =
      stats && stats.averageRating !== null
        ? Number(Number(stats.averageRating).toFixed(1))
        : 0;

    return res.json({
      pokemon_id: pokemonId,
      averageRating,
      totalRatings: stats ? stats.totalRatings : 0,
    });
  } catch (error) {
    return next(error);
  }
}

function upsertRating(req, res, next) {
  try {
    const userId = req.user.id;
    const { pokemon_id, rating, review } = req.body;

    const pokemonId = Number(pokemon_id);
    const numericRating = Math.round(Number(rating));

    if (!pokemonId || isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        error: 'Valid pokemon_id and rating (integer between 1 and 5) are required',
      });
    }

    const reviewText = review ? String(review).trim() : null;

    const upsertStmt = db.prepare(`
      INSERT INTO ratings (user_id, pokemon_id, rating, review, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, pokemon_id) DO UPDATE SET
        rating = excluded.rating,
        review = excluded.review,
        created_at = CURRENT_TIMESTAMP
    `);

    upsertStmt.run(userId, pokemonId, numericRating, reviewText);

    const savedRating = db
      .prepare('SELECT * FROM ratings WHERE user_id = ? AND pokemon_id = ?')
      .get(userId, pokemonId);

    return res.json({
      message: 'Rating saved successfully',
      rating: savedRating,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getRating,
  getAverageRating,
  upsertRating,
};
