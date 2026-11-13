import type { Preferences } from '../../preferences/PreferencesProvider';

export type SearchOutcome = 'success' | 'empty' | 'error' | 'cancelled' | 'inconclusive';

export function planCompletion(outcome: SearchOutcome, preferences: Preferences, offerCount = 0) {
  const succeeded = outcome === 'success' && offerCount > 0;
  return {
    showMessage: succeeded,
    playSound: succeeded && preferences.soundEnabled,
    triggerHaptics: false,
  };
}
export class CompletionGate {
  private consumed = new Set<string>();
  claim(id: string, outcome: SearchOutcome, preferences: Preferences, offerCount: number) {
    if (this.consumed.has(id)) return null;
    const plan = planCompletion(outcome, preferences, offerCount);
    if (!plan.showMessage) return null;
    // Registrar antes da tentativa impede repetição mesmo se o áudio for bloqueado.
    this.consumed.add(id);
    return plan;
  }
}
export const completionExperience = {
  message: 'Encontrou!',
  animationDurationMs: 600,
  sound: { targetDurationMs: 800, usesProvidedFile: true },
} as const;
