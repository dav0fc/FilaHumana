import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState, ErrorState, LoadingState } from '@/components/states';
import { useAlerts } from '@/hooks/use-alerts';
import { relativeTime } from '@/utils/queue-level';
import { Colors, Fonts, Spacing, TouchTarget } from '@/utils/theme';

export default function AlertsScreen() {
  const { alerts, loading, error, reload, cancel, locationName } = useAlerts();

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingState label="Carregando seus alertas…" />
      </SafeAreaView>
    );
  }

  if (error && alerts.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState message={error} onRetry={reload} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardBody}>
              <Text style={styles.alertLocation}>
                {locationName(item.locationId) ?? 'Local removido'}
              </Text>
              <Text style={styles.alertCondition}>Avisar quando a fila estiver tranquila</Text>
              <Text style={styles.alertCreated}>Criado {relativeTime(item.createdAt)}</Text>
            </View>
            <Pressable
              style={styles.cancelButton}
              onPress={() => void cancel(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Cancelar o aviso de ${locationName(item.locationId) ?? 'local removido'}`}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <Text style={styles.limitation}>
            Os avisos chegam como notificação do próprio aparelho enquanto o app estiver
            aberto. Nesta demonstração não há servidor por trás, então mudanças que
            acontecem com o app fechado não disparam aviso.
          </Text>
        }
        ListEmptyComponent={
          <EmptyState
            title="Nenhum alerta ativo"
            hint="Escolha um local e peça para ser avisado quando a fila estiver tranquila."
            actionLabel="Escolher local"
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardBody: {
    flex: 1,
    padding: Spacing.four,
    gap: 2,
  },
  alertLocation: {
    fontSize: Fonts.emphasis,
    fontWeight: '700',
    color: Colors.text,
  },
  alertCondition: {
    fontSize: Fonts.body,
    color: Colors.textSecondary,
  },
  alertCreated: {
    fontSize: Fonts.small,
    color: Colors.textSecondary,
  },
  cancelButton: {
    minHeight: TouchTarget,
    margin: Spacing.three,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  cancelText: {
    color: Colors.danger,
    fontSize: Fonts.body,
    fontWeight: '700',
  },
  separator: {
    height: Spacing.three,
  },
  limitation: {
    marginTop: Spacing.five,
    fontSize: Fonts.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
