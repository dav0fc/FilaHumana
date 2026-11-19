import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, Fonts, Spacing, TouchTarget } from '@/utils/theme';

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.six,
    gap: Spacing.three,
  },
  title: {
    fontSize: Fonts.emphasis,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  body: {
    fontSize: Fonts.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

/**
 * Botão do app (Pressable em vez de <Button>): área de toque grande e
 * aparência idêntica em iOS/Android. O <Button> nativo do RN mudou a
 * API de estilos e tem visual diferente por plataforma.
 */
export function ActionButton({
  label,
  onPress,
  variant = 'primary',
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  accessibilityHint?: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyles.button,
        variant === 'primary' ? buttonStyles.buttonPrimary : buttonStyles.buttonOutline,
        pressed && buttonStyles.buttonPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
    >
      <Text
        style={[
          buttonStyles.buttonText,
          variant === 'primary' ? buttonStyles.buttonTextPrimary : buttonStyles.buttonTextOutline,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  button: {
    minHeight: TouchTarget,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    alignSelf: 'stretch',
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  buttonOutline: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: Fonts.body,
    fontWeight: '700',
  },
  buttonTextPrimary: {
    color: Colors.onPrimary,
  },
  buttonTextOutline: {
    color: Colors.primary,
  },
});

export function LoadingState({ label = 'Carregando…' }: { label?: string }) {
  return (
    <View
      style={styles.wrap}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.body}>{label}</Text>
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.wrap} accessibilityRole="alert" accessibilityLabel="Erro ao carregar">
      <Text style={styles.title}>Não conseguimos carregar os dados</Text>
      <Text style={styles.body}>{message}</Text>
      <ActionButton label="Tentar novamente" onPress={onRetry} accessibilityHint="Carrega os dados da tela novamente" />
    </View>
  );
}

export function EmptyState({
  title,
  hint,
  actionLabel,
  onAction,
}: {
  title: string;
  hint: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.wrap} accessibilityLabel={title}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{hint}</Text>
      {actionLabel && onAction ? (
        <ActionButton label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}
