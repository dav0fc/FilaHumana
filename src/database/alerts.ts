import { AlertCondition, QueueAlert } from '@/types/alert';
import { getDatabase } from './database';

interface AlertRow {
  id: string;
  location_id: string;
  condition: string;
  created_at: string;
}

function rowToAlert(row: AlertRow): QueueAlert {
  // Só a condição 'low' é suportada; o valor gravado é validado na escrita.
  return {
    id: row.id,
    locationId: row.location_id,
    condition: 'low',
    createdAt: row.created_at,
  };
}

export async function listAlerts(): Promise<QueueAlert[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<AlertRow>(
    'SELECT id, location_id, condition, created_at FROM alerts ORDER BY created_at DESC'
  );
  return rows.map(rowToAlert);
}

export async function getAlertForLocation(locationId: string): Promise<QueueAlert | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<AlertRow>(
    'SELECT id, location_id, condition, created_at FROM alerts WHERE location_id = ?',
    locationId
  );
  return row ? rowToAlert(row) : null;
}

export async function createAlert(
  locationId: string,
  condition: AlertCondition
): Promise<QueueAlert> {
  const db = await getDatabase();
  // Um alerta por local: recriar substitui o anterior.
  await db.runAsync('DELETE FROM alerts WHERE location_id = ?', locationId);
  const id = `alert-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  await db.runAsync(
    'INSERT INTO alerts (id, location_id, condition, created_at) VALUES (?, ?, ?, ?)',
    id,
    locationId,
    condition,
    createdAt
  );
  return { id, locationId, condition, createdAt };
}

export async function cancelAlert(alertId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM alerts WHERE id = ?', alertId);
}
