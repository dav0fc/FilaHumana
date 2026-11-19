import { Platform } from 'react-native';
import {
  AndroidImportance,
  SchedulableTriggerInputTypes,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CHANNEL_ID = 'fila-humana-alertas';

/**
 * Notificações LOCAIS (o app não tem servidor de push no escopo atual).
 * Servem para avisar o cidadão quando um alerta criado por ele é
 * satisfeito por uma atualização recebida com o app aberto.
 */

// No Android, o canal precisa existir antes de qualquer coisa: sem ele
// o prompt de permissão nem aparece e o banner não é exibido.
async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Alertas de fila',
    importance: AndroidImportance.HIGH,
  });
}

export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    await ensureAndroidChannel();
    const existing = await getPermissionsAsync();
    if (existing.status === 'granted') return true;
    if (existing.status === 'denied') return false;
    const requested = await requestPermissionsAsync();
    return requested.status === 'granted';
  } catch (error) {
    console.warn('Não foi possível consultar permissão de notificação:', error);
    return false;
  }
}

export async function showLocalNotification(title: string, body: string): Promise<void> {
  await scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
      channelId: CHANNEL_ID,
    },
  });
}
