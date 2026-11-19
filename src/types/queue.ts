/**
 * Estados de fila reconhecidos pelo app.
 * `unknown` é "sem informação" — diferente de fila vazia (0 pessoas).
 */
export type QueueLevel = 'low' | 'moderate' | 'high' | 'unknown';

export type QueueSource = 'api' | 'mock';

export interface QueueStatus {
  locationId: string;
  level: QueueLevel;
  /** Ausente quando o contador de pessoas não informa. */
  peopleCount?: number;
  /** Ausente quando não há base para estimar (ex.: tempo de atendimento desconhecido). */
  estimatedWaitMinutes?: number;
  /** ISO string da última atualização. */
  updatedAt: string;
  source: QueueSource;
}
