import { useCallback, useEffect, useState } from 'react';
import { getQueueRepository } from '@/services/queue-repository';
import { HourlyStat, QueueLocation } from '@/types/location';
import { QueueStatus } from '@/types/queue';

export const NOT_FOUND_ERROR = 'Este local não existe ou não está mais disponível.';
const LOAD_ERROR = 'Não foi possível carregar os detalhes do local. Tente de novo.';

/**
 * Detalhes de um local: dados fixos, situação atual (mantida viva por
 * assinatura), histórico por horário.
 */
export function useLocationDetails(locationId: string) {
  const [location, setLocation] = useState<QueueLocation | null>(null);
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [history, setHistory] = useState<HourlyStat[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const repository = getQueueRepository();
        const [fetchedLocation, fetchedStatus] = await Promise.all([
          repository.getLocationById(locationId),
          repository.getQueueStatus(locationId),
        ]);
        if (!active) return;
        if (!fetchedLocation) {
          setError(NOT_FOUND_ERROR);
          setLoading(false);
          return;
        }
        setLocation(fetchedLocation);
        setStatus(fetchedStatus);
        setHistory(await repository.getHourlyHistory(locationId));
        setError(null);
      } catch {
        if (active) setError(LOAD_ERROR);
      } finally {
        if (active) setLoading(false);
      }
    })();
    const unsubscribe = getQueueRepository().subscribe((statuses) => {
      const current = statuses[locationId];
      if (current) setStatus(current);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [locationId]);

  // "Tentar novamente": recarrega tudo do zero.
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const repository = getQueueRepository();
      const [fetchedLocation, fetchedStatus] = await Promise.all([
        repository.getLocationById(locationId),
        repository.getQueueStatus(locationId),
      ]);
      if (!fetchedLocation) {
        setError(NOT_FOUND_ERROR);
        return;
      }
      setLocation(fetchedLocation);
      setStatus(fetchedStatus);
      setHistory(await repository.getHourlyHistory(locationId));
    } catch {
      setError(LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  return { location, status, history, loading, error, reload };
}
