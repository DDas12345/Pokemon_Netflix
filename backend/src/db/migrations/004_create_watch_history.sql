CREATE TABLE IF NOT EXISTS watch_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  pokemon_id INTEGER NOT NULL,
  pokemon_name TEXT NOT NULL,
  pokemon_image TEXT,
  progress INTEGER DEFAULT 0,
  last_watched DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, pokemon_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
