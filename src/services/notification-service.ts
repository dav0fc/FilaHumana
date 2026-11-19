import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Notificações LOCAIS (o app não tem servidor de push no escopo atual).
 * Servem para avisar o cidadão quando um alerta criado por ele é
 * satisfeito por uma atualização recebida com o app aberto.
 */

export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.status === 'granted') return true;
    if (existing.status === 'denied') return false;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.status === 'granted';
  } catch (error) {
    console.warn('Não foi possível consultar permissão de notificação:', error);
    return false;
  }
}

export async function showLocalNotification(title: string, body: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
    },
  });
}
