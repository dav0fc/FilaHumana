import { getDatabase } from './database';

export async function getFavoriteLocationIds(): Promise<string[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ location_id: string }>(
    'SELECT location_id FROM favorites'
  );
  return rows.map((row) => row.location_id);
}

export async function isFavoriteLocation(locationId: string): Promise<boolean> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ n: number }>(
    'SELECT COUNT(*) AS n FROM favorites WHERE location_id = ?',
    locationId
  );
  return (row?.n ?? 0) > 0;
}

export async function addFavorite(locationId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('INSERT OR IGNORE INTO favorites (location_id) VALUES (?)', locationId);
}

export async function removeFavorite(locationId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM favorites WHERE location_id = ?', locationId);
}
