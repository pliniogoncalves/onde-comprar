import { createContext, useContext, useEffect, useState, useSyncExternalStore, type PropsWithChildren } from 'react';
import { DemoSession } from './demoSession';
import { useCompletionSound } from './completion/useCompletionSound';
import { usePreferences } from '../preferences/PreferencesProvider';

type DemoContext = { session: DemoSession; sound: ReturnType<typeof useCompletionSound> };
const Context = createContext<DemoContext | null>(null);
export function DemoProvider({ children }: PropsWithChildren) {
  const [session] = useState(() => new DemoSession());
  const sound = useCompletionSound();
  const { preferences } = usePreferences();
  useEffect(() => { if (!preferences.soundEnabled) sound.stop(); }, [preferences.soundEnabled, sound]);
  return <Context.Provider value={{ session, sound }}>{children}</Context.Provider>;
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error('DemoProvider is required');
  const state = useSyncExternalStore(value.session.subscribe, value.session.getSnapshot, value.session.getSnapshot);
  return { ...value, state };
}
