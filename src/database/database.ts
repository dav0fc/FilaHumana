import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'fila-humana';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Abre (uma única vez) o banco SQLite local e garante o schema.
 * Tudo que persiste no app passa por aqui.
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS favorites (
          location_id TEXT PRIMARY KEY NOT NULL
        );
        CREATE TABLE IF NOT EXISTS alerts (
          id TEXT PRIMARY KEY NOT NULL,
          location_id TEXT NOT NULL,
          condition TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS preferences (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}
