import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PreferencesProvider } from '../features/preferences/PreferencesProvider';
import { DemoProvider } from '../features/search/DemoProvider';

export default function RootLayout() {
  const pathname = usePathname();
  return <SafeAreaProvider>
    <PreferencesProvider>
      <DemoProvider>
      <StatusBar style={pathname === '/' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
      </DemoProvider>
    </PreferencesProvider>
  </SafeAreaProvider>;
}
