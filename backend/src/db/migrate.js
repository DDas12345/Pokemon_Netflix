const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

function runMigrations(db) {
  // Ensure migrations tracking table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const migrationsDir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.warn(`[Migration] Migrations directory not found at: ${migrationsDir}`);
    return;
  }

  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const getAppliedMigrationsStmt = db.prepare('SELECT name FROM migrations');
  const appliedMigrations = new Set(
    getAppliedMigrationsStmt.all().map((row) => row.name)
  );

  const insertMigrationStmt = db.prepare('INSERT INTO migrations (name) VALUES (?)');

  let appliedCount = 0;

  for (const file of migrationFiles) {
    if (!appliedMigrations.has(file)) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      const executeMigration = db.transaction(() => {
        db.exec(sql);
        insertMigrationStmt.run(file);
      });

      executeMigration();
      console.log(`[Migration] Successfully applied: ${file}`);
      appliedCount++;
    }
  }

  if (appliedCount === 0) {
    console.log('[Migration] All migrations are already up to date.');
  } else {
    console.log(`[Migration] Applied ${appliedCount} migration(s).`);
  }
}

// Standalone execution support
if (require.main === module) {
  const dbPath = path.resolve(__dirname, '../../pokeflix.db');
  console.log(`[Migration] Running migrations against database: ${dbPath}`);
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  try {
    runMigrations(db);
    console.log('[Migration] Migration process completed successfully.');
  } catch (error) {
    console.error('[Migration] Migration failed:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

module.exports = { runMigrations };
