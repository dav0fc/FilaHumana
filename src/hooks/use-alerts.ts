import { useCallback, useEffect, useState } from 'react';
import { cancelAlert, createAlert as persistAlert, listAlerts } from '@/database/alerts';
import { getQueueRepository } from '@/services/queue-repository';
import { QueueAlert } from '@/types/alert';
import { QueueLocation } from '@/types/location';

const LOAD_ERROR = 'Não foi possível carregar seus alertas. Tente de novo.';

/**
 * Alertas persistidos em SQLite: listar, criar (um por local) e
 * cancelar. A conferência da condição fica no motor de alertas.
 */
export function useAlerts() {
  const [alerts, setAlerts] = useState<QueueAlert[]>([]);
  const [locations, setLocations] = useState<QueueLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const repository = getQueueRepository();
    const [fetchedAlerts, fetchedLocations] = await Promise.all([
      listAlerts(),
      repository.getLocations(),
    ]);
    setAlerts(fetchedAlerts);
    setLocations(fetchedLocations);
    setError(null);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await fetchAll();
      } catch {
        if (active) setError(LOAD_ERROR);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [fetchAll]);

  // Recarrega após ações do usuário (criar/cancelar alertas).
  const reload = useCallback(async () => {
    try {
      await fetchAll();
    } catch {
      setError(LOAD_ERROR);
    }
  }, [fetchAll]);

  const createAlert = useCallback(
    async (locationId: string) => {
      await persistAlert(locationId, 'low');
      await reload();
    },
    [reload]
  );

  const cancel = useCallback(
    async (alertId: string) => {
      await cancelAlert(alertId);
      await reload();
    },
    [reload]
  );

  const locationName = useCallback(
    (locationId: string) => locations.find((location) => location.id === locationId)?.name,
    [locations]
  );

  return { alerts, loading, error, reload, createAlert, cancel, locationName };
}
