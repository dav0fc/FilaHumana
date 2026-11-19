import { StyleSheet, Text, View } from 'react-native';
import { QueueLevel } from '@/types/queue';
import { LEVEL_GLYPH, LEVEL_LABEL, levelColors } from '@/utils/queue-level';
import { Fonts } from '@/utils/theme';

/**
 * Selo do estado da fila: glifo + TEXTO. Nunca apenas cor, para quem
 * tem baixa visão ou daltonismo.
 */
export function QueueStatusBadge({ level, large = false }: { level: QueueLevel; large?: boolean }) {
  const colors = levelColors(level);
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.background },
        large && styles.badgeLarge,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Situação da fila: ${LEVEL_LABEL[level]}`}
    >
      <Text style={[styles.glyph, { color: colors.text }, large && styles.glyphLarge]}>
        {LEVEL_GLYPH[level]}
      </Text>
      <Text style={[styles.label, { color: colors.text }, large && styles.labelLarge]}>
        {LEVEL_LABEL[level]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 12,
  },
  badgeLarge: {
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 16,
  },
  glyph: {
    fontSize: Fonts.body,
    fontWeight: '800',
    marginRight: 6,
  },
  glyphLarge: {
    fontSize: Fonts.emphasis,
    marginRight: 8,
  },
  label: {
    fontSize: Fonts.body,
    fontWeight: '700',
  },
  labelLarge: {
    fontSize: Fonts.emphasis,
  },
});
