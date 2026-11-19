import { useCallback, useEffect, useState } from 'react';
import { addFavorite, getFavoriteLocationIds, removeFavorite } from '@/database/favorites';

/**
 * Favoritos persistidos em SQLite: carrega os ids uma vez e mantém o
 * conjunto em memória, atualizando-o a cada favoritar/desfavoritar.
 */
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getFavoriteLocationIds()
      .then((ids) => {
        if (active) setFavoriteIds(new Set(ids));
      })
      .catch((error) => console.warn('Falha ao carregar favoritos:', error))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const isFavorite = useCallback((locationId: string) => favoriteIds.has(locationId), [
    favoriteIds,
  ]);

  const toggleFavorite = useCallback(
    async (locationId: string) => {
      const exists = favoriteIds.has(locationId);
      try {
        if (exists) {
          await removeFavorite(locationId);
        } else {
          await addFavorite(locationId);
        }
        setFavoriteIds((previous) => {
          const next = new Set(previous);
          if (exists) {
            next.delete(locationId);
          } else {
            next.add(locationId);
          }
          return next;
        });
      } catch (error) {
        console.warn('Falha ao alterar favoritos:', error);
      }
    },
    [favoriteIds]
  );

  return { favoriteIds, loading, isFavorite, toggleFavorite };
}
