import { HourlyStat, QueueLocation } from '@/types/location';
import { QueueSource, QueueStatus } from '@/types/queue';
import { createMockQueueRepository } from './mock-queue';

/**
 * Contrato único de dados de fila do app. Telas e hooks falam apenas com
 * esta interface; quando a API da equipe de IoT/controle existir, basta
 * trocar a implementação em `getQueueRepository()` sem mexer na interface.
 */
export interface QueueRepository {
  source: QueueSource;
  getLocations(): Promise<QueueLocation[]>;
  getLocationById(id: string): Promise<QueueLocation | null>;
  getAllStatuses(): Promise<Record<string, QueueStatus>>;
  getQueueStatus(locationId: string): Promise<QueueStatus | null>;
  getHourlyHistory(locationId: string): Promise<HourlyStat[] | null>;
  /** Força uma nova leitura (botão "Atualizar"). */
  refresh(): Promise<Record<string, QueueStatus>>;
  /**
   * Assina atualizações de fila (novas medições/estados). Retorna a
   * função de desinscrição.
   */
  subscribe(listener: (statuses: Record<string, QueueStatus>) => void): () => void;
}

let repository: QueueRepository | null = null;

/**
 * Ponto único de troca de fonte de dados. Hoje: mock de demonstração.
 * Quando o contrato da API real for definido, criar um
 * `api-queue.ts` implementando `QueueRepository` e trocar aqui.
 */
export function getQueueRepository(): QueueRepository {
  if (!repository) {
    repository = createMockQueueRepository();
  }
  return repository;
}
