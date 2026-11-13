import { CompletionGate, planCompletion } from './completion';
const enabled = { soundEnabled: true, hapticsEnabled: true };

describe('completion policy', () => {
  it.each(['empty', 'error', 'cancelled', 'inconclusive'] as const)('never celebrates %s even with offers', outcome => {
    expect(planCompletion(outcome, enabled, 3)).toEqual({ showMessage: false, playSound: false, triggerHaptics: false });
  });
  it('does not celebrate success without offers', () => {
    expect(planCompletion('success', enabled, 0)).toEqual({ showMessage: false, playSound: false, triggerHaptics: false });
  });
  it('keeps visual confirmation when sound is disabled and never enables haptics', () => {
    expect(planCompletion('success', { ...enabled, soundEnabled: false }, 3)).toEqual({ showMessage: true, playSound: false, triggerHaptics: false });
  });
  it('consumes each completion before playback so failures and rerenders cannot retry', async () => {
    const gate = new CompletionGate();
    const play = jest.fn().mockRejectedValue(new Error('NotAllowedError'));
    const plan = gate.claim('first', 'success', enabled, 3);
    expect(plan?.playSound).toBe(true);
    if (plan?.playSound) await play().catch(() => false);
    expect(gate.claim('first', 'success', enabled, 3)).toBeNull();
    expect(play).toHaveBeenCalledTimes(1);
    expect(gate.claim('second', 'success', enabled, 3)?.playSound).toBe(true);
  });
  it('does not replay a previously muted completion when sound is later enabled', () => {
    const gate = new CompletionGate();
    expect(gate.claim('first', 'success', { ...enabled, soundEnabled: false }, 3)?.playSound).toBe(false);
    expect(gate.claim('first', 'success', enabled, 3)).toBeNull();
  });
});
