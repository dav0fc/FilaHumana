import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { DemoBanner } from '@/components/demo-banner';
import { EmptyState, ErrorState, LoadingState } from '@/components/states';
import { LocationCard } from '@/components/location-card';
import { useFavorites } from '@/store/favorites-store';
import { useQueue } from '@/hooks/use-queue';
import { Colors, Fonts, Spacing } from '@/utils/theme';

export default function FavoritesScreen() {
  const { entries, loading, error, refresh } = useQueue();
  const { favoriteIds, isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites();

  const favorites = entries.filter((entry) => favoriteIds.has(entry.id));

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
            onToggleFavorite={toggleFavorite}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <>
            <DemoBanner />
            <Text style={styles.hint}>Locais que você guardou para consultar com facilidade.</Text>
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
