import { fireEvent, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PreferencesProvider, parsePreferences } from './PreferencesProvider';
import { PreferencesScreen } from './PreferencesScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

it('handles corrupt and incorrectly typed persisted preferences', () => {
  expect(parsePreferences(null)).toEqual({ soundEnabled: false, hapticsEnabled: false });
  expect(parsePreferences('{broken')).toEqual({ soundEnabled: false, hapticsEnabled: false });
  expect(parsePreferences('{"soundEnabled":"true","hapticsEnabled":true}'))
    .toEqual({ soundEnabled: false, hapticsEnabled: true });
});

it('restores a sound preference after remounting', async () => {
  await AsyncStorage.clear();
  const screen = () => <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, bottom: 0, left: 0, right: 0 } }}><PreferencesProvider><PreferencesScreen /></PreferencesProvider></SafeAreaProvider>;
  const first = render(screen());
  await waitFor(() => expect(first.getByLabelText('Som ao encontrar').props.disabled).toBe(false));
  fireEvent(first.getByLabelText('Som ao encontrar'), 'valueChange', true);
  await waitFor(async () => expect(await AsyncStorage.getItem('@onde-comprar/preferences/v1')).toContain('"soundEnabled":true'));
  first.unmount();
  const second = render(screen());
  await waitFor(() => expect(second.getByLabelText('Som ao encontrar').props.value).toBe(true));
});
