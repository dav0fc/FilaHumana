import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { startAlertEngine } from '@/services/alert-engine';
import { Colors } from '@/utils/theme';

export default function RootLayout() {
  // O motor de alertas fica vivo enquanto o app estiver aberto.
  useEffect(() => {
    startAlertEngine();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { color: Colors.text },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="local/[id]" options={{ title: 'Local de atendimento' }} />
      </Stack>
    </>
  );
}
