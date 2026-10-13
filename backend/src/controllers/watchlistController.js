const db = require('../db/database');

function parsePokemonTypes(types) {
  if (!types) return [];
  if (Array.isArray(types)) return types;
  try {
    const parsed = JSON.parse(types);
    if (Array.isArray(parsed)) return parsed;
    return [parsed];
  } catch (_) {
    return types.split(',').map((t) => t.trim()).filter(Boolean);
  }
}

function getWatchlist(req, res, next) {
  try {
    const userId = req.user.id;
    const items = db
      .prepare('SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC')
      .all(userId);

    const formattedList = items.map((item) => ({
      ...item,
      pokemon_types: parsePokemonTypes(item.pokemon_types),
    }));

    return res.json({ watchlist: formattedList });
  } catch (error) {
    return next(error);
  }
}

function addToWatchlist(req, res, next) {
  try {
    const userId = req.user.id;
    const { pokemon_id, pokemon_name, pokemon_image, pokemon_types } = req.body;

    const pokemonId = Number(pokemon_id);
    if (!pokemonId || !pokemon_name) {
      return res.status(400).json({ error: 'pokemon_id and pokemon_name are required' });
    }

    const typesString = Array.isArray(pokemon_types)
      ? JSON.stringify(pokemon_types)
      : typeof pokemon_types === 'object' && pokemon_types !== null
      ? JSON.stringify(pokemon_types)
      : pokemon_types || null;

    const upsertStmt = db.prepare(`
      INSERT INTO watchlist (user_id, pokemon_id, pokemon_name, pokemon_image, pokemon_types, added_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, pokemon_id) DO UPDATE SET
        pokemon_name = excluded.pokemon_name,
        pokemon_image = excluded.pokemon_image,
        pokemon_types = excluded.pokemon_types,
        added_at = CURRENT_TIMESTAMP
    `);

    upsertStmt.run(
      userId,
      pokemonId,
      String(pokemon_name).trim(),
      pokemon_image || null,
      typesString
    );

    const savedItem = db
      .prepare('SELECT * FROM watchlist WHERE user_id = ? AND pokemon_id = ?')
      .get(userId, pokemonId);

    return res.status(201).json({
      message: 'Added to watchlist',
      item: {
        ...savedItem,
        pokemon_types: parsePokemonTypes(savedItem.pokemon_types),
      },
    });
  } catch (error) {
    return next(error);
  }
}

function removeFromWatchlist(req, res, next) {
  try {
    const userId = req.user.id;
    const pokemonId = Number(req.params.pokemonId);

    if (isNaN(pokemonId)) {
      return res.status(400).json({ error: 'Valid pokemonId is required' });
    }

    const result = db
      .prepare('DELETE FROM watchlist WHERE user_id = ? AND pokemon_id = ?')
      .run(userId, pokemonId);

    return res.json({
      message: 'Removed from watchlist',
      deleted: result.changes > 0,
      pokemon_id: pokemonId,
    });
  } catch (error) {
    return next(error);
  }
}

function checkWatchlist(req, res, next) {
  try {
    const userId = req.user.id;
    const pokemonId = Number(req.params.pokemonId);

    if (isNaN(pokemonId)) {
      return res.status(400).json({ error: 'Valid pokemonId is required' });
    }

    const row = db
      .prepare('SELECT id FROM watchlist WHERE user_id = ? AND pokemon_id = ?')
      .get(userId, pokemonId);

    return res.json({
      pokemon_id: pokemonId,
      inWatchlist: Boolean(row),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist,
};
