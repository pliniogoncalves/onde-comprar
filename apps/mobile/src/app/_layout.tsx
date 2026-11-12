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
      <StatusBar style={pathname === '/' || pathname === '/demo-complete' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="demo-complete" options={{ animation: 'none', gestureEnabled: false }} />
      </Stack>
      </DemoProvider>
    </PreferencesProvider>
  </SafeAreaProvider>;
}
