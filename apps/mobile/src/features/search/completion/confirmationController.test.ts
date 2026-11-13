import { ConfirmationController, confirmationHold } from './confirmationController';
import { confirmationTiming } from '../../../config/demoTiming';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());
it('reaches one visual cue, then finishes automatically after the configured hold', () => {
  const controller = new ConfirmationController(); const cue = jest.fn(); const finish = jest.fn();
  controller.attach('one', false, 800, cue, finish);
  expect(cue).toHaveBeenLastCalledWith(false);
  jest.advanceTimersByTime(179); expect(cue).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(1); expect(cue).toHaveBeenLastCalledWith(true);
  jest.advanceTimersByTime(1799); expect(finish).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1); expect(finish).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(10000); expect(finish).toHaveBeenCalledTimes(1);
});
it('pauses on blur, resumes without repeating the cue and preserves visible hold time', () => {
  const controller = new ConfirmationController(); const cue = jest.fn(); const finish = jest.fn();
  const detach = controller.attach('one', false, 800, cue, finish);
  jest.advanceTimersByTime(680); detach();
  jest.advanceTimersByTime(10000); expect(finish).not.toHaveBeenCalled();
  const resumed = jest.fn(); controller.attach('one', false, 800, resumed, finish);
  expect(resumed).toHaveBeenCalledWith(true);
  jest.advanceTimersByTime(1299); expect(finish).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1); expect(finish).toHaveBeenCalledTimes(1);
});
it('invalidates old callbacks on cancel and new session, including old cleanup', () => {
  const controller = new ConfirmationController(); const oldCue = jest.fn(); const oldFinish = jest.fn();
  const oldDetach = controller.attach('old', false, 800, oldCue, oldFinish);
  controller.reset();
  const finish = jest.fn(); controller.attach('new', true, 800, jest.fn(), finish);
  oldDetach(); jest.advanceTimersByTime(1800);
  expect(oldFinish).not.toHaveBeenCalled(); expect(oldCue).not.toHaveBeenCalledWith(true);
  expect(finish).toHaveBeenCalledTimes(1);
  expect(jest.getTimerCount()).toBe(0);
});
it('uses configurable timings and skips the intro for reduced motion', () => {
  const controller = new ConfirmationController({ ...confirmationTiming, holdMs: 40 });
  const finish = jest.fn(); const cue = jest.fn();
  controller.attach('one', true, 0, cue, finish);
  jest.advanceTimersByTime(0); expect(cue).toHaveBeenLastCalledWith(true);
  jest.advanceTimersByTime(40); expect(finish).toHaveBeenCalledTimes(1);
});
it('accounts for audio duration without unbounded waits', () => {
  expect(confirmationHold(800)).toBe(1800);
  expect(confirmationHold(2100)).toBe(2250);
  expect(confirmationHold(999999)).toBe(4000);
  expect(confirmationHold(Infinity)).toBe(1800);
  expect(confirmationHold(NaN)).toBe(1800);
});
it('does not create another timer if the visual callback closes the session', () => {
  const controller = new ConfirmationController(); const finish = jest.fn();
  controller.attach('one', true, 800, success => { if (success) controller.reset(); }, finish);
  jest.advanceTimersByTime(0);
  expect(jest.getTimerCount()).toBe(0);
  jest.advanceTimersByTime(10000); expect(finish).not.toHaveBeenCalled();
});
