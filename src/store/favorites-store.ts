import { useSyncExternalStore } from 'react';
import {
  addFavorite,
  getFavoriteLocationIds,
  removeFavorite,
} from '@/database/favorites';

/**
 * Estado global de favoritos, compartilhado entre todas as telas por
 * useSyncExternalStore: favoritar em qualquer lugar atualiza todas as
 * outras na hora. A persistência em SQLite fica em database/favorites.
 */

export type FavoritesSnapshot = {
  ids: ReadonlySet<string>;
  ready: boolean;
};

let snapshot: FavoritesSnapshot = { ids: new Set(), ready: false };
const listeners = new Set<() => void>();

function publish(next: FavoritesSnapshot) {
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

function getSnapshot(): FavoritesSnapshot {
  return snapshot;
}

// Carrega os favoritos gravados uma vez, ao abrir o app.
void (async () => {
  try {
    const ids = new Set(await getFavoriteLocationIds());
    publish({ ids, ready: true });
  } catch (error) {
    console.warn('Falha ao carregar favoritos:', error);
    publish({ ids: new Set(), ready: true });
  }
})();

export async function toggleFavorite(locationId: string): Promise<void> {
  const exists = snapshot.ids.has(locationId);
  try {
    if (exists) {
      await removeFavorite(locationId);
    } else {
      await addFavorite(locationId);
    }
    const ids = new Set(snapshot.ids);
    if (exists) {
      ids.delete(locationId);
    } else {
      ids.add(locationId);
    }
    publish({ ...snapshot, ids });
  } catch (error) {
    console.warn('Falha ao alterar favoritos:', error);
  }
}

export function useFavorites() {
  const snap = useSyncExternalStore(subscribe, getSnapshot);
  return {
    favoriteIds: snap.ids,
    loading: !snap.ready,
    isFavorite: (locationId: string) => snap.ids.has(locationId),
    toggleFavorite,
  };
}
