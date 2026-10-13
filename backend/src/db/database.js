const path = require('path');
const Database = require('better-sqlite3');
const { runMigrations } = require('./migrate');

const dbPath = path.resolve(__dirname, '../../pokeflix.db');

const db = new Database(dbPath);

// Enable foreign key constraints and WAL mode for performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Run pending database migrations automatically on initialization
runMigrations(db);

module.exports = db;
