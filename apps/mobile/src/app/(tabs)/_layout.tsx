import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '../../theme';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const { fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { iconSlot, labelLineHeight, itemPadding } = theme.navigation;
  // Conteúdo e escala de fonte definem o mínimo; os insets vêm do dispositivo.
  const itemHeight = iconSlot + labelLineHeight * Math.max(1, fontScale) + itemPadding * 2;
  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.muted,
    tabBarStyle: {
      backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border,
      height: 'auto', minHeight: itemHeight + insets.bottom, flexShrink: 0, elevation: 0,
    },
    tabBarLabelPosition: 'below-icon',
    tabBarItemStyle: { minHeight: itemHeight },
    tabBarLabelStyle: { fontSize: 12, lineHeight: labelLineHeight, flexShrink: 0, fontWeight: '600' },
  }}>
    <Tabs.Screen name="index" options={{ title: 'Início', tabBarAccessibilityLabel: 'Início', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
    <Tabs.Screen name="history" options={{ title: 'Histórico', tabBarAccessibilityLabel: 'Histórico', tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} /> }} />
    <Tabs.Screen name="preferences" options={{ title: 'Preferências', tabBarAccessibilityLabel: 'Preferências', tabBarIcon: ({ color, size }) => <Ionicons name="options-outline" size={size} color={color} /> }} />
  </Tabs>;
}
