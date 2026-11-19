import { HourlyStat } from '@/types/location';
import { QueueLevel } from '@/types/queue';
import { LEVEL_ORDER } from './queue-level';

/**
 * Menor janela de 3 horas consecutivas com a menor soma de espera média.
 * Vira o "melhor horário para ir" sugerido no detalhe.
 */
export function bestHourWindow(stats: HourlyStat[]): HourlyStat[] | null {
  if (stats.length < 3) {
    return stats.length > 0 ? stats : null;
  }
  let best: HourlyStat[] = stats.slice(0, 3);
  let bestSum = windowSum(best);
  for (let i = 1; i + 2 < stats.length + 1; i++) {
    const window = stats.slice(i, i + 3);
    const sum = windowSum(window);
    if (sum < bestSum) {
      bestSum = sum;
      best = window;
    }
  }
  return best;
}

function windowSum(window: HourlyStat[]): number {
  return window.reduce((acc, stat) => acc + stat.avgWaitMinutes, 0);
}

export function bestHourLabel(window: HourlyStat[]): string {
  const first = window[0];
  const last = window[window.length - 1];
  return `${first.hour}h às ${last.hour}h`;
}

/**
 * Compara dois locais para "mais tranquilos primeiro". Filas com
 * `unknown` vão por último; empate resolve pela menor espera estimada
 * (sem estimativa vai por último dentro do nível).
 */
export function compareCalmest(
  a: { level: QueueLevel; estimatedWaitMinutes?: number },
  b: { level: QueueLevel; estimatedWaitMinutes?: number }
): number {
  const orderA = LEVEL_ORDER[a.level];
  const orderB = LEVEL_ORDER[b.level];
  if (orderA !== orderB) return orderA - orderB;
  const waitA = a.estimatedWaitMinutes ?? Number.MAX_SAFE_INTEGER;
  const waitB = b.estimatedWaitMinutes ?? Number.MAX_SAFE_INTEGER;
  return waitA - waitB;
}
