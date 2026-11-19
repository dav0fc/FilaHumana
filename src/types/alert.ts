/**
 * Condições de disparo suportadas hoje. `low` = avisar quando a fila
 * estiver "tranquila".
 */
export type AlertCondition = 'low';

export interface QueueAlert {
  id: string;
  locationId: string;
  condition: AlertCondition;
  /** ISO string da criação. */
  createdAt: string;
}
