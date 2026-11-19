import { useCallback, useEffect, useMemo, useState } from 'react';
import { getQueueRepository } from '@/services/queue-repository';
import { QueueLocation } from '@/types/location';
import { QueueStatus } from '@/types/queue';

export type LocationWithStatus = QueueLocation & { status: QueueStatus | undefined };

const LOAD_ERROR =
  'Não foi possível carregar a situação das filas. Verifique sua conexão e tente de novo.';

/**
 * Carrega locais + situação atual das filas e mantém a situação
 * atualizada por assinatura do repositório.
 */
export function useQueue() {
  const [locations, setLocations] = useState<QueueLocation[]>([]);
  const [statuses, setStatuses] = useState<Record<string, QueueStatus>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const repository = getQueueRepository();
        const [fetchedLocations, fetchedStatuses] = await Promise.all([
          repository.getLocations(),
          repository.getAllStatuses(),
        ]);
        if (!active) return;
        setLocations(fetchedLocations);
        setStatuses(fetchedStatuses);
        setError(null);
      } catch {
        if (active) setError(LOAD_ERROR);
      } finally {
        if (active) setLoading(false);
      }
    })();
    const unsubscribe = getQueueRepository().subscribe(setStatuses);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Botão "Atualizar": força uma nova leitura do repositório.
  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const repository = getQueueRepository();
      const [fetchedLocations, fetchedStatuses] = await Promise.all([
        repository.getLocations(),
        repository.refresh(),
      ]);
      setLocations(fetchedLocations);
      setStatuses(fetchedStatuses);
    } catch {
      setError(LOAD_ERROR);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const entries = useMemo<LocationWithStatus[]>(
    () => locations.map((location) => ({ ...location, status: statuses[location.id] })),
    [locations, statuses]
  );

  return { entries, loading, refreshing, error, refresh };
}
