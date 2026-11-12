import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PreferencesProvider } from '../features/preferences/PreferencesProvider';

export default function RootLayout() {
  const pathname = usePathname();
  return <SafeAreaProvider>
    <PreferencesProvider>
      <StatusBar style={pathname === '/' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </PreferencesProvider>
  </SafeAreaProvider>;
}
