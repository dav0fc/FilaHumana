import { HourlyStat, QueueLocation } from '@/types/location';
import { QueueLevel, QueueStatus } from '@/types/queue';
import { QueueRepository } from './queue-repository';

/**
 * Mock de dados de fila, determinístico (PRNG com semente fixa), para a
 * demonstração acadêmica. Simula o sensor mudando a fila a cada
 * UPDATE_INTERVAL_MS e avisa os inscritos das atualizações.
 */

const UPDATE_INTERVAL_MS = 30_000;
const MAX_PEOPLE = 20;
const MINUTES_PER_PERSON = 5;

/** PRNG determinístico (mulberry32) — a demonstração é previsível. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LOCATIONS: QueueLocation[] = [
  {
    id: 'ubs-central',
    name: 'UBS Central',
    category: 'ubs',
    address: 'Rua das Acácias, 120 — Centro',
  },
  {
    id: 'ubs-jardim',
    name: 'UBS Jardim das Flores',
    category: 'ubs',
    address: 'Avenida Brasil, 2450 — Jardim das Flores',
  },
  {
    id: 'ubs-vila-nova',
    name: 'UBS Vila Nova',
    category: 'ubs',
    address: 'Rua do Ipê Amarelo, 88 — Vila Nova',
  },
  {
    id: 'poupatempo-centro',
    name: 'Poupatempo Centro',
    category: 'poupatempo',
    address: 'Praça da Estação, s/n — Centro',
    // Sem base de tempo de atendimento: aparece sem estimativa de espera.
    description: 'Aqui a espera exata varia muito por tipo de serviço.',
  },
  {
    id: 'poupatempo-sul',
    name: 'Poupatempo Zona Sul',
    category: 'poupatempo',
    address: 'Avenida das Nações, 1500 — Zona Sul',
  },
  {
    id: 'ubs-santa-rita',
    name: 'UBS Santa Rita',
    category: 'ubs',
    address: 'Travessa do Mercado, 12 — Santa Rita',
    // Sensor desligado no momento: nível desconhecido, sem contagem.
    description: 'O contador de pessoas deste local está desligado no momento.',
  },
];

// Ponto de partida da simulação (pessoas na fila). Santa Rita não entra: offline.
const INITIAL_PEOPLE: Record<string, number> = {
  'ubs-central': 4,
  'ubs-jardim': 9,
  'ubs-vila-nova': 15,
  'poupatempo-centro': 5,
  'poupatempo-sul': 11,
};

const OFFLINE_LOCATION_IDS = new Set<string>(['ubs-santa-rita']);
const NO_WAIT_ESTIMATE_IDS = new Set<string>(['poupatempo-centro']);

function levelForPeople(people: number): QueueLevel {
  const ratio = people / MAX_PEOPLE;
  if (ratio < 0.3) return 'low';
  if (ratio < 0.65) return 'moderate';
  return 'high';
}

function statusFor(
  locationId: string,
  people: number | undefined,
  updatedAt: string
): QueueStatus {
  if (people === undefined) {
    return { locationId, level: 'unknown', updatedAt, source: 'mock' };
  }
  const status: QueueStatus = {
    locationId,
    level: levelForPeople(people),
    peopleCount: people,
    updatedAt,
    source: 'mock',
  };
  if (!NO_WAIT_ESTIMATE_IDS.has(locationId)) {
    status.estimatedWaitMinutes = people * MINUTES_PER_PERSON;
  }
  return status;
}

/** Curva de ocupação típica por local; gera o histórico 7h–19h. */
function buildHistory(rng: () => number, locationId: string): HourlyStat[] {
  const isUbs = locationId.startsWith('ubs');
  const stats: HourlyStat[] = [];
  for (let hour = 7; hour <= 19; hour++) {
    let base: number;
    if (isUbs) {
      // UBS: picos da manhã (10h) e fim da tarde (16h)
      base =
        8 +
        26 * Math.exp(-((hour - 10) ** 2) / 3.5) +
        20 * Math.exp(-((hour - 16) ** 2) / 3);
    } else {
      // Poupatempo: pico no meio da manhã
      base = 6 + 32 * Math.exp(-((hour - 11) ** 2) / 4);
    }
    stats.push({ hour, avgWaitMinutes: Math.max(0, Math.round(base + rng() * 8)) });
  }
  return stats;
}

type Listener = (statuses: Record<string, QueueStatus>) => void;

export function createMockQueueRepository(): QueueRepository {
  const rng = mulberry32(20261119);

  const people: Record<string, number | undefined> = { ...INITIAL_PEOPLE };
  const history: Record<string, HourlyStat[]> = {};
  for (const location of LOCATIONS) {
    // Santa Rita (offline) não tem histórico confiável: demonstra o estado
    // "sem dados suficientes".
    if (!OFFLINE_LOCATION_IDS.has(location.id)) {
      history[location.id] = buildHistory(rng, location.id);
    }
  }

  let statuses: Record<string, QueueStatus> = buildStatuses(new Date().toISOString());
  const listeners = new Set<Listener>();
  let timer: ReturnType<typeof setInterval> | null = null;

  function buildStatuses(now: string): Record<string, QueueStatus> {
    const result: Record<string, QueueStatus> = {};
    for (const location of LOCATIONS) {
      result[location.id] = statusFor(location.id, people[location.id], now);
    }
    return result;
  }

  function tick() {
    for (const id of Object.keys(people)) {
      const current = people[id];
      if (current === undefined) continue;
      const delta = Math.round((rng() - 0.5) * 5);
      people[id] = Math.min(MAX_PEOPLE, Math.max(0, current + delta));
    }
    statuses = buildStatuses(new Date().toISOString());
    for (const listener of listeners) {
      listener(statuses);
    }
  }

  function ensureTimer() {
    if (timer === null) {
      timer = setInterval(tick, UPDATE_INTERVAL_MS);
    }
  }

  // Latência curta simulada para os estados de carregamento aparecerem.
  const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

  return {
    source: 'mock',

    async getLocations(): Promise<QueueLocation[]> {
      return LOCATIONS;
    },

    async getLocationById(id: string): Promise<QueueLocation | null> {
      return LOCATIONS.find((location) => location.id === id) ?? null;
    },

    async getAllStatuses(): Promise<Record<string, QueueStatus>> {
      await delay(350);
      ensureTimer();
      return statuses;
    },

    async getQueueStatus(locationId: string): Promise<QueueStatus | null> {
      await delay(250);
      ensureTimer();
      return statuses[locationId] ?? null;
    },

    async getHourlyHistory(locationId: string): Promise<HourlyStat[] | null> {
      await delay(250);
      return history[locationId] ?? null;
    },

    async refresh(): Promise<Record<string, QueueStatus>> {
      tick();
      return statuses;
    },

    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      ensureTimer();
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
