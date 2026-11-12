import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';

export type Preferences = { soundEnabled: boolean; hapticsEnabled: boolean };
export const defaultPreferences: Preferences = { soundEnabled: false, hapticsEnabled: false };
const storageKey = '@onde-comprar/preferences/v1';

export function parsePreferences(raw: string | null): Preferences {
  try {
    const data: unknown = JSON.parse(raw ?? 'null');
    if (!data || typeof data !== 'object') return defaultPreferences;
    return {
      soundEnabled: 'soundEnabled' in data && data.soundEnabled === true,
      hapticsEnabled: 'hapticsEnabled' in data && data.hapticsEnabled === true,
    };
  } catch { return defaultPreferences; }
}

type PreferencesContextValue = {
  preferences: Preferences;
  ready: boolean;
  storageError: boolean;
  update: (key: keyof Preferences, value: boolean) => void;
};
const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const writeQueue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey)
      .then(raw => { if (active) setPreferences(parsePreferences(raw)); })
      .catch(() => { if (active) setStorageError(true); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!ready) return;
    writeQueue.current = writeQueue.current
      .then(() => AsyncStorage.setItem(storageKey, JSON.stringify(preferences)))
      .catch(() => setStorageError(true));
  }, [preferences, ready]);
  return <PreferencesContext.Provider value={{ preferences, ready, storageError, update: (key, value) => {
    if (ready) setPreferences(current => ({ ...current, [key]: value }));
  } }}>{children}</PreferencesContext.Provider>;
}
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('PreferencesProvider is required');
  return context;
}
