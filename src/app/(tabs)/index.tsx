import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DemoBanner } from '@/components/demo-banner';
import { LocationCard } from '@/components/location-card';
import { LocationDetails } from '@/components/location-details';
import { EmptyState, ErrorState, LoadingState } from '@/components/states';
import { useQueue } from '@/hooks/use-queue';
import { useAlerts } from '@/store/alerts-store';
import { useFavorites } from '@/store/favorites-store';
import { PREFERENCE_SORT_MODE, getPreference, setPreference } from '@/database/preferences';
import { compareCalmest } from '@/utils/queue-compare';
import { Colors, Fonts, Spacing, TouchTarget } from '@/utils/theme';

type SortMode = 'calmest' | 'name';

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'calmest', label: 'Mais tranquilos' },
  { value: 'name', label: 'Nome A–Z' },
];

export default function HomeScreen() {
  const { entries, loading, refreshing, error, refresh } = useQueue();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { alerts, createAlert, cancel } = useAlerts();
  const [sortMode, setSortMode] = useState<SortMode>('calmest');
  // Um card expandido por vez: a lista é a tela de informações.
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getPreference(PREFERENCE_SORT_MODE)
      .then((value) => {
        if (value === 'calmest' || value === 'name') setSortMode(value);
      })
      .catch((err) => console.warn('Falha ao carregar preferência de ordenação:', err));
  }, []);

  const changeSortMode = useCallback((mode: SortMode) => {
    setSortMode(mode);
    void setPreference(PREFERENCE_SORT_MODE, mode);
  }, []);

  const visible = useMemo(() => {
    const list = [...entries];
    if (sortMode === 'calmest') {
      list.sort((a, b) => compareCalmest(a.status ?? { level: 'unknown' }, b.status ?? { level: 'unknown' }));
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    }
    return list;
  }, [entries, sortMode]);

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

  if (loading && entries.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header refreshing={false} onRefresh={refresh} />
        <LoadingState label="Carregando os locais…" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {error && entries.length === 0 ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={visible}
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
              <Header refreshing={refreshing} onRefresh={refresh} />
              <DemoBanner />
              <View style={styles.sortRow} accessibilityRole="radiogroup" accessibilityLabel="Ordenar lista">
                {SORT_OPTIONS.map((option) => {
                  const selected = sortMode === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      style={[styles.sortOption, selected && styles.sortOptionSelected]}
                      onPress={() => changeSortMode(option.value)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`Ordenar por ${option.label}`}
                    >
                      <Text style={[styles.sortText, selected && styles.sortTextSelected]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.listHint}>
                {sortMode === 'calmest'
                  ? 'Os locais com fila mais curta aparecem primeiro. Toque em um local para abrir os detalhes.'
                  : 'Locais em ordem alfabética. Toque em um local para abrir os detalhes.'}
              </Text>
            </>
          }
          ListEmptyComponent={() =>
            entries.length === 0 ? (
              <EmptyState
                title="Nenhum local cadastrado"
                hint="Assim que os locais de atendimento forem cadastrados, eles aparecerão aqui."
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

function Header({ refreshing, onRefresh }: { refreshing: boolean; onRefresh: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Fila Humana</Text>
      <Text style={styles.subtitle}>Veja onde a fila está mais curta agora</Text>
      <Pressable
        style={[styles.refreshButton, refreshing && styles.refreshingDisabled]}
        onPress={onRefresh}
        disabled={refreshing}
        accessibilityRole="button"
        accessibilityLabel="Atualizar a situação das filas"
        accessibilityHint="Recarrega a fila de todos os locais"
      >
        {refreshing ? (
          <ActivityIndicator color={Colors.onPrimary} />
        ) : (
          <Text style={styles.refreshText}>Atualizar</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.one,
  },
  title: {
    fontSize: Fonts.largeTitle,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: Fonts.body,
    color: Colors.textSecondary,
  },
  refreshButton: {
    marginTop: Spacing.two,
    minHeight: TouchTarget,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.five,
  },
  refreshingDisabled: {
    opacity: 0.7,
  },
  refreshText: {
    color: Colors.onPrimary,
    fontSize: Fonts.body,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  sortRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  sortOption: {
    minHeight: TouchTarget,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  sortOptionSelected: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },
  sortText: {
    fontSize: Fonts.body,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sortTextSelected: {
    color: Colors.primary,
  },
  listHint: {
    fontSize: Fonts.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.three,
  },
  separator: {
    height: Spacing.three,
  },
});
