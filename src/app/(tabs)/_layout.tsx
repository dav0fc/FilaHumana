import { Tabs } from 'expo-router';
import { Colors, Fonts } from '@/utils/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { color: Colors.text, fontSize: Fonts.title, fontWeight: '700' },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: { fontSize: Fonts.small, fontWeight: '600' },
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
        sceneStyle: { backgroundColor: Colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
      <Tabs.Screen name="alertas" options={{ title: 'Alertas' }} />
    </Tabs>
  );
}
