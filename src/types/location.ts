export type LocationCategory = 'ubs' | 'poupatempo' | 'other';

export interface QueueLocation {
  id: string;
  name: string;
  category: LocationCategory;
  address: string;
  description?: string;
}

/** Espera média de um horário, usada no histórico do detalhe. */
export interface HourlyStat {
  /** Hora do dia (ex.: 7 = 7h). */
  hour: number;
  avgWaitMinutes: number;
}
