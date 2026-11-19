import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { DemoBanner } from '@/components/demo-banner';
import { EmptyState, ErrorState, LoadingState } from '@/components/states';
import { LocationCard } from '@/components/location-card';
import { LocationDetails } from '@/components/location-details';
import { useQueue } from '@/hooks/use-queue';
import { useAlerts } from '@/store/alerts-store';
import { useFavorites } from '@/store/favorites-store';
import { Colors, Fonts, Spacing } from '@/utils/theme';

export default function FavoritesScreen() {
  const { entries, loading, error, refresh } = useQueue();
  const { favoriteIds, isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const { alerts, createAlert, cancel } = useAlerts();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const favorites = entries.filter((entry) => favoriteIds.has(entry.id));

  const toggleExpand = useCallback((locationId: string) => {
    setExpandedId((current) => (current === locationId ? null : locationId));
  }, []);

  const toggleAlert = useCallback(
    async (locationId: string) => {
      const existing = alerts.find((alert) => alert.locationId === locationId);
      if (existing) {
        await cancel(existing.id);
      } else {
        await createAlert(locationId);
      }
    },
    [alerts, cancel, createAlert]
  );

  if (loading || favoritesLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <DemoBanner />
        <LoadingState label="Carregando seus favoritos…" />
      </SafeAreaView>
    );
  }

  if (error && entries.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <DemoBanner />
        <ErrorState message={error} onRetry={refresh} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <LocationCard
            entry={item}
            isFavorite={isFavorite(item.id)}
            hasAlert={alerts.some((alert) => alert.locationId === item.id)}
            expanded={expandedId === item.id}
            onToggleExpand={() => toggleExpand(item.id)}
            onToggleFavorite={() => void toggleFavorite(item.id)}
            onToggleAlert={() => void toggleAlert(item.id)}
            expandedContent={<LocationDetails entry={item} />}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <>
            <DemoBanner />
            <Text style={styles.hint}>
              Locais que você guardou para consultar com facilidade. Toque em um para abrir os detalhes.
            </Text>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            title="Você ainda não tem favoritos"
            hint="Toque na estrela de um local para guardá-lo aqui."
            actionLabel="Ver locais"
            onAction={() => router.navigate('/')}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  hint: {
    fontSize: Fonts.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.three,
  },
  separator: {
    height: Spacing.three,
  },
});
