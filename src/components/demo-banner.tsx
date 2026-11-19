import { StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts, Spacing } from '@/utils/theme';

/**
 * Aviso permanente de que os dados são simulados (demo acadêmica).
 */
export function DemoBanner() {
  return (
    <View
      style={styles.banner}
      accessibilityRole="text"
      accessibilityLabel="Aviso: os dados exibidos são simulados, apenas para demonstração."
    >
      <Text style={styles.text}>Dados de demonstração — valores simulados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.demoBackground,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.three,
  },
  text: {
    fontSize: Fonts.small,
    fontWeight: '600',
    color: Colors.demoText,
  },
});
