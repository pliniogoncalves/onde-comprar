import { planCompletion } from './completion';

describe('completion policy', () => {
  it.each(['empty', 'error', 'cancelled'] as const)('never celebrates %s', outcome => {
    expect(planCompletion(outcome, { soundEnabled: true, hapticsEnabled: true }))
      .toEqual({ showMessage: false, playSound: false, triggerHaptics: false });
  });
  it('keeps the visual confirmation when optional effects are disabled', () => {
    expect(planCompletion('success', { soundEnabled: false, hapticsEnabled: false }))
      .toEqual({ showMessage: true, playSound: false, triggerHaptics: false });
  });
  it('allows opted-in effects only on success', () => {
    expect(planCompletion('success', { soundEnabled: true, hapticsEnabled: true }))
      .toEqual({ showMessage: true, playSound: true, triggerHaptics: true });
  });
});
