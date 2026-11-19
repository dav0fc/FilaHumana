import { PixelRatio } from 'react-native';

/**
 * Paleta única (modo claro): contrastes escolhidos para leitura por
 * pessoas idosas. O app roda em modo claro de propósito (ver README).
 */
export const Colors = {
  text: '#1A1D23',
  textSecondary: '#575F6E',
  background: '#F4F5F7',
  surface: '#FFFFFF',
  border: '#DDE1E7',
  primary: '#1A56B0',
  primarySoft: '#E3ECF9',
  onPrimary: '#FFFFFF',
  danger: '#A32C25',
  demoBackground: '#EDF2FA',
  demoText: '#24487E',
} as const;

/**
 * Respeita o tamanho de fonte do sistema, limitado a 2x para o layout
 * não estourar em acessibilidade máxima.
 */
const fontScale = Math.min(PixelRatio.getFontScale(), 2);

export const Fonts = {
  small: Math.round(13 * fontScale),
  body: Math.round(15 * fontScale),
  emphasis: Math.round(17 * fontScale),
  title: Math.round(21 * fontScale),
  largeTitle: Math.round(26 * fontScale),
} as const;

export const Spacing = {
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
} as const;

/** Área de toque mínima (dp) recomendada para o público-alvo. */
export const TouchTarget = 48;
