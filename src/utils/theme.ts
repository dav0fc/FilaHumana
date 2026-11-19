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
 * Tamanhos BASE em dp. O React Native já escala o texto automaticamente
 * com o ajuste de fonte do sistema (acessibilidade) — não multiplicar
 * aqui, porque resultaria em escala dupla e layout estourado. Os
 * layouts aguentam fontes grandes com quebra de linha e tamanhos
 * mínimos (ver components).
 */
export const Fonts = {
  small: 13,
  body: 15,
  emphasis: 17,
  title: 21,
  largeTitle: 26,
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
