import type { Preferences } from '../../preferences/PreferencesProvider';

export type SearchOutcome = 'success' | 'empty' | 'error' | 'cancelled';

// Apenas planejamento dos efeitos: não reproduz áudio nem aciona hardware.
export function planCompletion(outcome: SearchOutcome, preferences: Preferences) {
  const succeeded = outcome === 'success';
  return {
    showMessage: succeeded,
    playSound: succeeded && preferences.soundEnabled,
    triggerHaptics: succeeded && preferences.hapticsEnabled,
  };
}
export const completionExperience = {
  message: 'Encontrou!',
  animationDurationMs: 600,
  sound: { referenceStartMs: 7000, referenceEndMs: 7800, targetDurationMs: 800 },
} as const;
