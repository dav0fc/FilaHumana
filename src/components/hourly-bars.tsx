import { StyleSheet, Text, View } from 'react-native';
import { HourlyStat } from '@/types/location';
import { Colors, Fonts, Spacing } from '@/utils/theme';

const BAR_AREA_HEIGHT = 96;

function barColor(ratio: number): string {
  if (ratio < 0.4) return '#3E9B4F';
  if (ratio < 0.75) return '#E0A83C';
  return '#D64541';
}

/**
 * Barras da espera média por horário (dados simulados, identificados
 * pelo título da seção). Sem biblioteca de gráficos: só Views.
 */
export function HourlyBars({ stats }: { stats: HourlyStat[] }) {
  const max = Math.max(...stats.map((stat) => stat.avgWaitMinutes), 1);
  return (
    <View style={styles.wrap} accessibilityRole="group" accessibilityLabel="Espera média por horário, em barras">
      <View style={styles.bars}>
        {stats.map((stat) => (
          <View key={stat.hour} style={styles.column}>
            <View style={styles.barArea}>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(6, (stat.avgWaitMinutes / max) * BAR_AREA_HEIGHT),
                    backgroundColor: barColor(stat.avgWaitMinutes / max),
                  },
                ]}
              />
            </View>
            <Text style={styles.hourLabel}>{stat.hour % 3 === 1 ? `${stat.hour}h` : ' '}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: Spacing.three,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  barArea: {
    height: BAR_AREA_HEIGHT,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  hourLabel: {
    marginTop: Spacing.one,
    fontSize: Fonts.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
