import { LocationCategory } from '@/types/location';
import { QueueLevel } from '@/types/queue';

/**
 * Rótulos e cores dos estados de fila. O estado é SEMPRE apresentado
 * com texto; cor e glifo são reforço, nunca a informação única.
 */
export const LEVEL_LABEL: Record<QueueLevel, string> = {
  low: 'Tranquila',
  moderate: 'Moderada',
  high: 'Cheia',
  unknown: 'Sem informação',
};

export const LEVEL_GLYPH: Record<QueueLevel, string> = {
  low: '✓',
  moderate: '~',
  high: '✕',
  unknown: '?',
};

/** Ordem para "mais tranquilos primeiro" (desconhecido por último). */
export const LEVEL_ORDER: Record<QueueLevel, number> = {
  low: 0,
  moderate: 1,
  high: 2,
  unknown: 3,
};

/**
 * Fundos em gradiente de luminosidade (tranquila mais claro, cheia mais
 * escuro): para daltonismo, o estado continua legível sem depender do matiz.
 * Todos os pares têm contraste WCAG AA+ (6:1 ou mais).
 */
export function levelColors(level: QueueLevel): { background: string; text: string } {
  switch (level) {
    case 'low':
      return { background: '#E7F5EA', text: '#14532D' };
    case 'moderate':
      return { background: '#FAECCB', text: '#7A4E04' };
    case 'high':
      return { background: '#F7D9D3', text: '#8A1F18' };
    case 'unknown':
      return { background: '#ECEEF1', text: '#454C57' };
  }
}

export function categoryLabel(category: LocationCategory): string {
  switch (category) {
    case 'ubs':
      return 'Posto de saúde (UBS)';
    case 'poupatempo':
      return 'Poupatempo';
    case 'other':
      return 'Atendimento';
  }
}

/** "atualizado há 2 min" em linguagem simples. */
export function relativeTime(iso: string, now: number = Date.now()): string {
  const diffMinutes = Math.round((now - new Date(iso).getTime()) / 60_000);
  if (diffMinutes < 1) return 'agora mesmo';
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `há ${hours} h`;
  return `há ${Math.floor(hours / 24)} dias`;
}

export function waitLabel(estimatedWaitMinutes?: number): string {
  if (estimatedWaitMinutes === undefined) return 'Sem estimativa de espera';
  if (estimatedWaitMinutes === 0) return 'Sem espera no momento';
  return `Espera estimada: cerca de ${estimatedWaitMinutes} min`;
}
