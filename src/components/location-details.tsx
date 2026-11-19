import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HourlyBars } from '@/components/hourly-bars';
import { getQueueRepository } from '@/services/queue-repository';
import { HourlyStat } from '@/types/location';
import { bestHourLabel, bestHourWindow } from '@/utils/queue-compare';
import { Colors, Fonts, Spacing } from '@/utils/theme';

/**
 * Corpo expandido do card: situação extra, descrição e histórico por
 * horário com o melhor horário sugerido. O histórico só é carregado
 * quando o card é expandido.
 */
export function LocationDetails({ entry }: { entry: { id: string; description?: string } }) {
  const [history, setHistory] = useState<HourlyStat[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const fetched = await getQueueRepository().getHourlyHistory(entry.id);
        if (active) setHistory(fetched);
      } catch (error) {
        console.warn('Falha ao carregar histórico:', error);
        if (active) setHistory(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [entry.id]);

  const bestWindow = bestHourWindow(history ?? []);

  return (
    <View style={styles.wrap}>
      {entry.description ? <Text style={styles.description}>{entry.description}</Text> : null}

      <Text style={styles.sectionTitle}>Espera média por horário</Text>
      <Text style={styles.note}>
        Média dos últimos dias, em minutos (dados simulados).
      </Text>

      {loading ? (
        <Text style={styles.note}>Carregando histórico…</Text>
      ) : history ? (
        <>
          <HourlyBars stats={history} />
          {bestWindow ? (
            <View style={styles.bestHourBox}>
              <Text style={styles.bestHourText}>
                Melhor horário para ir: {bestHourLabel(bestWindow)} (fila mais curta em média)
              </Text>
            </View>
          ) : null}
        </>
      ) : (
        <Text style={styles.note}>
          Ainda não há histórico suficiente para sugerir um melhor horário neste local.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
  },
  description: {
    fontSize: Fonts.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: Fonts.emphasis,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.two,
  },
  note: {
    fontSize: Fonts.small,
    color: Colors.textSecondary,
  },
  bestHourBox: {
    backgroundColor: Colors.primarySoft,
    borderRadius: 10,
    padding: Spacing.three,
    marginTop: Spacing.two,
  },
  bestHourText: {
    fontSize: Fonts.body,
    fontWeight: '700',
    color: Colors.primary,
  },
});
