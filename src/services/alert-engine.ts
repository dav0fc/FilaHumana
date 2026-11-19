import { listAlerts } from '@/database/alerts';
import { cancelAlert } from '@/store/alerts-store';
import { QueueStatus } from '@/types/queue';
import { showLocalNotification, ensureNotificationPermission } from './notification-service';
import { getQueueRepository } from './queue-repository';

let started = false;

/**
 * Motor de alertas: toda vez que o app recebe uma atualização de fila
 * (ou ao abrir), confere os alertas criados e dispara a notificação
 * local do primeiro alerta satisfeito, removendo-o (dispara uma vez).
 *
 * Limitação documentada: sem backend, a conferência só acontece com o
 * app aberto — o usuário não é avisado de mudanças que ocorrem com o
 * app fechado.
 */
export function startAlertEngine(): void {
  if (started) return;
  started = true;

  void ensureNotificationPermission();

  const checkAlerts = async (statuses: Record<string, QueueStatus>) => {
    try {
      const alerts = await listAlerts();
      if (alerts.length === 0) return;
      const locations = await getQueueRepository().getLocations();
      for (const alert of alerts) {
        const status = statuses[alert.locationId];
        if (!status || status.level !== alert.condition) continue;
        const location = locations.find((loc) => loc.id === alert.locationId);
        await showLocalNotification(
          'Fila tranquila',
          `${location?.name ?? 'O local que você escolheu'} está com a fila tranquila agora. É um bom momento para ir.`
        );
        await cancelAlert(alert.id);
        break; // uma notificação por atualização, para não encher a tela
      }
    } catch (error) {
      console.warn('Falha ao verificar alertas:', error);
    }
  };

  const repository = getQueueRepository();
  void repository
    .getAllStatuses()
    .then(checkAlerts)
    .catch((error) => console.warn('Falha ao iniciar o motor de alertas:', error));
  repository.subscribe(checkAlerts);
}
