import { PixelRatio, StyleSheet, Text, View } from 'react-native';
import { HourlyStat } from '@/types/location';
import { Colors, Spacing } from '@/utils/theme';

/**
 * A altura do gráfico acompanha a fonte do sistema (limitada a 2x) para
 * manter proporção com o texto; os rótulos do eixo NÃO acompanham
 * (allowFontScaling=false) — assim não há sobreposição em nenhuma
 * fonte, do mínimo ao máximo de acessibilidade.
 */
const fontScale = Math.min(PixelRatio.getFontScale(), 2);
const BAR_AREA_HEIGHT = Math.round(96 * fontScale);

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
    <View
      style={styles.wrap}
      accessibilityRole="group"
      accessibilityLabel="Espera média por horário, em barras"
    >
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
            <Text style={styles.hourLabel} allowFontScaling={false} numberOfLines={1}>
              {stat.hour % 3 === 1 ? `${stat.hour}h` : ' '}
            </Text>
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
    minWidth: 14,
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
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
