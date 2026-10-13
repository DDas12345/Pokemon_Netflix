const db = require('../db/database');

function getHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const history = db
      .prepare('SELECT * FROM watch_history WHERE user_id = ? ORDER BY last_watched DESC')
      .all(userId);

    return res.json({ history });
  } catch (error) {
    return next(error);
  }
}

function updateHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const { pokemon_id, pokemon_name, pokemon_image, progress } = req.body;

    const pokemonId = Number(pokemon_id);
    if (!pokemonId || !pokemon_name) {
      return res.status(400).json({ error: 'pokemon_id and pokemon_name are required' });
    }

    const progressVal = Number.isInteger(Number(progress)) ? Math.max(0, Number(progress)) : 0;

    const upsertStmt = db.prepare(`
      INSERT INTO watch_history (user_id, pokemon_id, pokemon_name, pokemon_image, progress, last_watched)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, pokemon_id) DO UPDATE SET
        pokemon_name = excluded.pokemon_name,
        pokemon_image = COALESCE(excluded.pokemon_image, watch_history.pokemon_image),
        progress = excluded.progress,
        last_watched = CURRENT_TIMESTAMP
    `);

    upsertStmt.run(
      userId,
      pokemonId,
      String(pokemon_name).trim(),
      pokemon_image || null,
      progressVal
    );

    const updatedItem = db
      .prepare('SELECT * FROM watch_history WHERE user_id = ? AND pokemon_id = ?')
      .get(userId, pokemonId);

    return res.json({
      message: 'Watch history updated',
      item: updatedItem,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getHistory,
  updateHistory,
};
