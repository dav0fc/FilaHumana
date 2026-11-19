import { useCallback, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HourlyBars } from '@/components/hourly-bars';
import { QueueStatusBadge } from '@/components/queue-status-badge';
import { ErrorState, LoadingState } from '@/components/states';
import { useAlerts } from '@/hooks/use-alerts';
import { useFavorites } from '@/hooks/use-favorites';
import { NOT_FOUND_ERROR, useLocationDetails } from '@/hooks/use-location-details';
import {
  LEVEL_LABEL,
  categoryLabel,
  relativeTime,
  waitLabel,
} from '@/utils/queue-level';
import { bestHourLabel, bestHourWindow } from '@/utils/queue-compare';
import { Colors, Fonts, Spacing, TouchTarget } from '@/utils/theme';

export default function LocationDetailsScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { location, status, history, loading, error, reload } = useLocationDetails(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { alerts, createAlert, cancel } = useAlerts();
  const [busyAction, setBusyAction] = useState<'favorite' | 'alert' | null>(null);

  const locationAlert = alerts.find((alert) => alert.locationId === id);
  const bestWindow = bestHourWindow(history ?? []);

  const handleFavorite = useCallback(async () => {
    if (!location) return;
    setBusyAction('favorite');
    await toggleFavorite(location.id);
    setBusyAction(null);
  }, [location, toggleFavorite]);

  const handleAlert = useCallback(async () => {
    if (!location) return;
    setBusyAction('alert');
    try {
      if (locationAlert) {
        await cancel(locationAlert.id);
      } else {
        await createAlert(location.id);
      }
    } finally {
      setBusyAction(null);
    }
  }, [location, locationAlert, createAlert, cancel]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingState label="Carregando o local…" />
      </SafeAreaView>
    );
  }

  if (error || !location) {
    const notFound = error === NOT_FOUND_ERROR;
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState
          message={error ?? NOT_FOUND_ERROR}
          onRetry={() => {
            if (notFound) {
              router.back();
            } else {
              void reload();
            }
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{location.name}</Text>
          <Pressable
            style={styles.favoriteButton}
            onPress={handleFavorite}
            disabled={busyAction === 'favorite'}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite(location.id)
                ? `Remover ${location.name} dos favoritos`
                : `Adicionar ${location.name} aos favoritos`
            }
          >
            <Text style={[styles.favoriteStar, isFavorite(location.id) && styles.favoriteStarActive]}>
              {isFavorite(location.id) ? '★ Favorito' : '☆ Favoritar'}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.meta}>
          {categoryLabel(location.category)} · {location.address}
        </Text>
        {location.description ? <Text style={styles.description}>{location.description}</Text> : null}

        <View style={styles.statusCard}>
          <Text style={styles.sectionTitle}>Situação agora</Text>
          {status ? (
            <>
              <QueueStatusBadge level={status.level} large />
              <Text style={styles.statusLine}>{waitLabel(status.estimatedWaitMinutes)}</Text>
              {status.peopleCount !== undefined ? (
                <Text style={styles.statusLine}>
                  Pessoas na fila agora: {status.peopleCount}
                </Text>
              ) : null}
              <Text style={styles.updated}>
                Atualizado {relativeTime(status.updatedAt)} · dados simulados
              </Text>
            </>
          ) : (
            <>
              <QueueStatusBadge level="unknown" large />
              <Text style={styles.statusLine}>
                Não há informação da fila neste local no momento.
              </Text>
            </>
          )}
        </View>

        {history ? (
          <View style={styles.statusCard}>
            <Text style={styles.sectionTitle}>Espera média por horário</Text>
            <Text style={styles.historyNote}>
              Média dos últimos dias, em minutos (dados simulados).
            </Text>
            <HourlyBars stats={history} />
            {bestWindow ? (
              <View style={styles.bestHourBox}>
                <Text style={styles.bestHourText}>
                  Melhor horário para ir: {bestHourLabel(bestWindow)} (fila mais curta em média)
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.statusCard}>
            <Text style={styles.sectionTitle}>Espera média por horário</Text>
            <Text style={styles.statusLine}>
              Ainda não há histórico suficiente para sugerir um melhor horário neste local.
            </Text>
          </View>
        )}

        <Pressable
          style={[styles.alertButton, locationAlert && styles.alertButtonActive]}
          onPress={handleAlert}
          disabled={busyAction === 'alert'}
          accessibilityRole="button"
          accessibilityLabel={
            locationAlert
              ? 'Cancelar o aviso de fila tranquila'
              : `Avisar-me quando a fila de ${location.name} estiver tranquila`
          }
        >
          <Text style={[styles.alertButtonText, locationAlert && styles.alertButtonTextActive]}>
            {locationAlert
              ? '✓ Aviso criado — cancelar aviso'
              : '🔔 Avisar-me quando a fila estiver tranquila'}
          </Text>
        </Pressable>
        {locationAlert ? (
          <Text style={styles.alertNote}>
            Você será avisado por notificação quando a fila estiver {LEVEL_LABEL.low},
            enquanto o app estiver aberto.
          </Text>
        ) : (
          <Text style={styles.alertNote}>
            O aviso funciona enquanto o app estiver aberto, pois a demonstração não tem
            servidor por trás.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.five,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
    fontSize: Fonts.largeTitle,
    fontWeight: '800',
    color: Colors.text,
  },
  favoriteButton: {
    minHeight: TouchTarget,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  favoriteStar: {
    fontSize: Fonts.body,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  favoriteStarActive: {
    color: '#8A5300',
  },
  meta: {
    marginTop: -Spacing.three,
    fontSize: Fonts.body,
    color: Colors.textSecondary,
  },
  description: {
    marginTop: -Spacing.two,
    fontSize: Fonts.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: Fonts.emphasis,
    fontWeight: '700',
    color: Colors.text,
  },
  statusLine: {
    fontSize: Fonts.body,
    color: Colors.text,
  },
  updated: {
    fontSize: Fonts.small,
    color: Colors.textSecondary,
  },
  historyNote: {
    fontSize: Fonts.small,
    color: Colors.textSecondary,
  },
  bestHourBox: {
    backgroundColor: Colors.primarySoft,
    borderRadius: 10,
    padding: Spacing.three,
  },
  bestHourText: {
    fontSize: Fonts.body,
    fontWeight: '700',
    color: Colors.primary,
  },
  alertButton: {
    minHeight: TouchTarget + 8,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
  },
  alertButtonActive: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  alertButtonText: {
    color: Colors.onPrimary,
    fontSize: Fonts.body,
    fontWeight: '700',
    textAlign: 'center',
  },
  alertButtonTextActive: {
    color: Colors.primary,
  },
  alertNote: {
    marginTop: -Spacing.two,
    fontSize: Fonts.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
