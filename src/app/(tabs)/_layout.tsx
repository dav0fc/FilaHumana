import { Text, TextStyle } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors, Fonts } from '@/utils/theme';

const tabIconStyle: TextStyle = { fontSize: 22 };

/**
 * Ícone das abas: glifo Unicode (emoji) renderizado em qualquer
 * plataforma sem dependência de fonte externa — e altamente
 * reconhecível para o público-alvo.
 */
function TabSymbol({ glyph }: { glyph: string }) {
  return <Text style={tabIconStyle}>{glyph}</Text>;
}

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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: () => <TabSymbol glyph="🏠" />,
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: () => <TabSymbol glyph="⭐" />,
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          tabBarIcon: () => <TabSymbol glyph="🔔" />,
        }}
      />
    </Tabs>
  );
}
