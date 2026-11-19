import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
 * Card de local: cabeçalho sempre visível (situação, favorito e alerta)
 * e corpo que EXPANDE no lugar com os detalhes do local — a lista é a
 * própria tela de informação.
 */
export function LocationCard({
  entry,
  isFavorite,
  hasAlert,
  expanded,
  onToggleExpand,
  onToggleFavorite,
  onToggleAlert,
  expandedContent,
}: {
  entry: LocationWithStatus;
  isFavorite: boolean;
  hasAlert: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleFavorite: () => void;
  onToggleAlert: () => void;
  /** Conteúdo do corpo expandido (histórico, etc.). */
  expandedContent: ReactNode;
}) {
  const { status } = entry;
  const situation = status ? LEVEL_LABEL[status.level] : 'sem informação';

  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
        onPress={onToggleExpand}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${entry.name}, ${categoryLabel(entry.category)}, ${entry.address}. Fila ${situation}. ${expanded ? 'Toque para fechar os detalhes.' : 'Toque para ver os detalhes.'}`}
      >
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={2}>
            {entry.name}
          </Text>
          <Pressable
            style={styles.iconButton}
            hitSlop={12}
            onPress={onToggleFavorite}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite
                ? `Remover ${entry.name} dos favoritos`
                : `Adicionar ${entry.name} aos favoritos`
            }
          >
            <Text style={[styles.iconGlyph, isFavorite && styles.starActive]}>
              {isFavorite ? '★' : '☆'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.iconButton}
            hitSlop={12}
            onPress={onToggleAlert}
            accessibilityRole="button"
            accessibilityState={{ selected: hasAlert }}
            accessibilityLabel={
              hasAlert
                ? `Cancelar o aviso de fila tranquila de ${entry.name}`
                : `Avisar-me quando a fila de ${entry.name} estiver tranquila`
            }
            accessibilityHint="O aviso chega como notificação enquanto o app estiver aberto"
          >
            {/* sino estilo YouTube: mudo e esmaecido desligado, cheio e
                destacado no círculo azul quando ativo */}
            <View style={[styles.bellWrap, hasAlert && styles.bellWrapActive]}>
              <Text style={[styles.iconGlyph, !hasAlert && styles.iconDim]}>
                {hasAlert ? '🔔' : '🔕'}
              </Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{categoryLabel(entry.category)}</Text>
        </View>
        <Text style={styles.address} numberOfLines={1}>
          {entry.address}
        </Text>
        <View style={styles.statusRow}>
          <QueueStatusBadge level={status ? status.level : 'unknown'} />
          {status ? (
            <Text style={styles.wait}>{waitLabel(status.estimatedWaitMinutes)}</Text>
          ) : null}
        </View>
        {status ? (
          <Text style={styles.updated}>
            {hasAlert ? '🔔 Aviso de fila tranquila ativo · ' : ''}
            Atualizado {relativeTime(status.updatedAt)}
          </Text>
        ) : null}
        <Text style={styles.expandHint}>{expanded ? '▲ Fechar detalhes' : '▼ Ver detalhes'}</Text>
      </Pressable>

      {expanded ? (
        <View style={styles.body}>{expandedContent}</View>
      ) : null}
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
  header: {
    padding: Spacing.four,
    paddingBottom: Spacing.three,
  },
  pressed: {
    backgroundColor: Colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  name: {
    flex: 1,
    fontSize: Fonts.emphasis,
    fontWeight: '700',
    color: Colors.text,
  },
  iconButton: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    fontSize: Math.round(Fonts.title + 2),
    color: Colors.textSecondary,
  },
  iconDim: {
    opacity: 0.5,
  },
  starActive: {
    // âmbar escurecido: 6.3:1 sobre o card (AA para qualquer tamanho)
    color: '#8A5300',
  },
  bellWrap: {
    width: TouchTarget - 8,
    height: TouchTarget - 8,
    borderRadius: (TouchTarget - 8) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellWrapActive: {
    backgroundColor: Colors.primarySoft,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  categoryChip: {
    marginTop: Spacing.one,
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
    marginTop: Spacing.two,
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
  expandHint: {
    marginTop: Spacing.two,
    fontSize: Fonts.small,
    fontWeight: '700',
    color: Colors.primary,
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.four,
    backgroundColor: Colors.surface,
  },
});
