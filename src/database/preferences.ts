import { getDatabase } from './database';

export const PREFERENCE_SORT_MODE = 'sortMode';

export async function getPreference(key: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM preferences WHERE key = ?',
    key
  );
  return row?.value ?? null;
}

export async function setPreference(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)',
    key,
    value
  );
}
