import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { LocationWithStatus } from '@/hooks/use-queue';
import { QueueStatusBadge } from '@/components/queue-status-badge';
import {
  LEVEL_LABEL,
  categoryLabel,
  relativeTime,
  waitLabel,
} from '@/utils/queue-level';
import { Colors, Fonts, Spacing, TouchTarget } from '@/utils/theme';

/**
 * Card de local na lista: leva ao detalhe; a estrela favorita fica
 * fora da área de navegação para um toque não abrir o local por engano.
 */
export function LocationCard({
  entry,
  isFavorite,
  onToggleFavorite,
}: {
  entry: LocationWithStatus;
  isFavorite: boolean;
  onToggleFavorite: (locationId: string) => void;
}) {
  const { status } = entry;
  const situation = status ? LEVEL_LABEL[status.level] : 'sem informação';

  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.cardBody, pressed && styles.pressed]}
        onPress={() => router.push({ pathname: '/local/[id]', params: { id: entry.id } })}
        accessibilityRole="button"
        accessibilityLabel={`${entry.name}, ${categoryLabel(entry.category)}, ${entry.address}. Fila ${situation}. Toque para ver detalhes.`}
      >
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={2}>
            {entry.name}
          </Text>
          <Pressable
            style={styles.starButton}
            hitSlop={12}
            onPress={() => onToggleFavorite(entry.id)}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite
                ? `Remover ${entry.name} dos favoritos`
                : `Adicionar ${entry.name} aos favoritos`
            }
          >
            <Text style={[styles.star, isFavorite && styles.starActive]}>
              {isFavorite ? '★' : '☆'}
            </Text>
          </Pressable>
        </View>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{categoryLabel(entry.category)}</Text>
        </View>
        <Text style={styles.address} numberOfLines={1}>
          {entry.address}
        </Text>
        <View style={styles.statusRow}>
          {status ? (
            <QueueStatusBadge level={status.level} />
          ) : (
            <QueueStatusBadge level="unknown" />
          )}
          {status ? <Text style={styles.wait}>{waitLabel(status.estimatedWaitMinutes)}</Text> : null}
        </View>
        {status ? (
          <Text style={styles.updated}>
            Atualizado {relativeTime(status.updatedAt)}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardBody: {
    padding: Spacing.four,
  },
  pressed: {
    backgroundColor: Colors.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
    fontSize: Fonts.emphasis,
    fontWeight: '700',
    color: Colors.text,
  },
  starButton: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    fontSize: Math.round(Fonts.title + 4),
    color: Colors.textSecondary,
  },
  starActive: {
    color: '#B7791F',
  },
  categoryChip: {
    marginTop: Spacing.two,
    backgroundColor: Colors.primarySoft,
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: Fonts.small,
    fontWeight: '600',
    color: Colors.primary,
  },
  address: {
    marginTop: Spacing.one,
    fontSize: Fonts.body,
    color: Colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  wait: {
    flex: 1,
    fontSize: Fonts.body,
    color: Colors.text,
  },
  updated: {
    marginTop: Spacing.two,
    fontSize: Fonts.small,
    color: Colors.textSecondary,
  },
});
