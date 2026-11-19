import { useSyncExternalStore } from 'react';
import {
  cancelAlert as persistCancel,
  createAlert as persistCreate,
  listAlerts,
} from '@/database/alerts';
import { getQueueRepository } from '@/services/queue-repository';
import { QueueAlert } from '@/types/alert';
import { QueueLocation } from '@/types/location';

export const ALERTS_LOAD_ERROR = 'Não foi possível carregar seus alertas. Tente de novo.';

/**
 * Estado global de alertas, compartilhado entre as telas por
 * useSyncExternalStore: criar/cancelar (ou o motor disparar) um alerta
 * atualiza a tela de Alertas e o detalhe do local na hora. A
 * persistência em SQLite fica em database/alerts.
 */

export type AlertsSnapshot = {
  alerts: QueueAlert[];
  locations: QueueLocation[];
  ready: boolean;
  error: string | null;
};

let snapshot: AlertsSnapshot = {
  alerts: [],
  locations: [],
  ready: false,
  error: null,
};
const listeners = new Set<() => void>();

function publish(next: AlertsSnapshot) {
  snapshot = next;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): AlertsSnapshot {
  return snapshot;
}

export async function refreshAlerts(): Promise<void> {
  try {
    const repository = getQueueRepository();
    const [fetchedAlerts, fetchedLocations] = await Promise.all([
      listAlerts(),
      repository.getLocations(),
    ]);
    publish({ alerts: fetchedAlerts, locations: fetchedLocations, ready: true, error: null });
  } catch {
    publish({ ...snapshot, ready: true, error: ALERTS_LOAD_ERROR });
  }
}

// Carrega os alertas gravados uma vez, ao abrir o app.
void refreshAlerts();

export async function createAlert(locationId: string): Promise<void> {
  await persistCreate(locationId, 'low');
  await refreshAlerts();
}

export async function cancelAlert(alertId: string): Promise<void> {
  await persistCancel(alertId);
  await refreshAlerts();
}

export function useAlerts() {
  const snap = useSyncExternalStore(subscribe, getSnapshot);
  return {
    alerts: snap.alerts,
    locations: snap.locations,
    loading: !snap.ready,
    error: snap.error,
    reload: refreshAlerts,
    createAlert,
    cancel: cancelAlert,
    locationName: (locationId: string) =>
      snap.locations.find((location) => location.id === locationId)?.name,
  };
}
