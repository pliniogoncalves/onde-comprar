import { DemoSession } from './demoSession';
import { createDemoAdapters, matchesDemo } from '../../adapters/mock/demoAdapters';
import { demoProduct, demoOffers, type DemoScenario } from '../../fixtures/demo';
import type { RecognitionResult } from '../../domain/contracts';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());
async function identify(session: DemoSession, scenario: DemoScenario = 'success') {
  session.start(scenario);
  const pending = session.recognize();
  expect(session.getSnapshot().phase).toBe('analyzing');
  await jest.advanceTimersByTimeAsync(2700);
  await pending;
}
async function confirm(session: DemoSession) {
  const pending = session.confirm(demoProduct);
  await jest.advanceTimersByTimeAsync(3300);
  await pending;
}
it('requires review and confirmation before searching, then groups exact and similar offers', async () => {
  const session = new DemoSession();
  await session.confirm(demoProduct);
  expect(session.getSnapshot().phase).toBe('idle');
  await identify(session);
  expect(session.getSnapshot().phase).toBe('identify');
  await confirm(session);
  expect(session.getSnapshot().phase).toBe('complete');
  expect(session.getSnapshot().offers.filter(item => item.matchType === 'exact')).toHaveLength(2);
  expect(session.getSnapshot().offers.filter(item => item.matchType === 'similar')).toHaveLength(1);
  session.results();
  session.edit();
  expect(session.getSnapshot().phase).toBe('identify');
  expect(session.getSnapshot().completionId).toBeUndefined();
});
it.each([['empty', 'empty'], ['error', 'error']] as const)('handles %s without completion', async (scenario, expected) => {
  const session = new DemoSession();
  await identify(session, scenario);
  await confirm(session);
  expect(session.getSnapshot().phase).toBe(expected);
  expect(session.getSnapshot().completionId).toBeUndefined();
  expect(session.getSnapshot().offers).toHaveLength(0);
});
it('permits manual identification after an inconclusive result', async () => {
  const session = new DemoSession();
  await identify(session, 'inconclusive');
  expect(session.getSnapshot().phase).toBe('inconclusive');
  expect(session.getSnapshot().product).toBeNull();
  await confirm(session);
  expect(session.getSnapshot().phase).toBe('complete');
});
it('validates names and does not label unrelated corrections as exact matches', async () => {
  const session = new DemoSession();
  await identify(session);
  await expect(session.confirm({ name: '   ' })).rejects.toThrow('Informe');
  const pending = session.confirm({ ...demoProduct, model: 'Outro' });
  await jest.advanceTimersByTimeAsync(3300); await pending;
  expect(session.getSnapshot().phase).toBe('empty');
  expect(matchesDemo({ name: ' Fone de ouvido ', brand: 'aurora', model: 'a1' })).toBe(true);
});
it('cancels pending operations without producing results or completion', async () => {
  const session = new DemoSession();
  session.start('success');
  const pending = session.recognize();
  session.cancel();
  await jest.advanceTimersByTimeAsync(1000); await pending;
  expect(session.getSnapshot().phase).toBe('cancelled');
  expect(session.getSnapshot().completionId).toBeUndefined();
});
it('cancels an offer search without permitting a late completion', async () => {
  const session = new DemoSession();
  await identify(session);
  const pending = session.confirm(demoProduct);
  session.cancel();
  await jest.advanceTimersByTimeAsync(1000); await pending;
  expect(session.getSnapshot().phase).toBe('cancelled');
  expect(session.getSnapshot().offers).toHaveLength(0);
  expect(session.getSnapshot().completionId).toBeUndefined();
});
it('ignores stale adapter responses even when the adapter ignores cancellation', async () => {
  let resolve!: (value: RecognitionResult) => void;
  const session = new DemoSession(() => ({ ...createDemoAdapters('success'), recognition: { recognize: () => new Promise(done => { resolve = done; }) } }));
  session.start('success'); const pending = session.recognize();
  await jest.advanceTimersByTimeAsync(2700);
  session.start('empty'); resolve({ product: demoProduct, needsConfirmation: true }); await pending;
  expect(session.getSnapshot().phase).toBe('review');
  expect(session.getSnapshot().scenario).toBe('empty');
  expect(session.getSnapshot().product).toBeNull();
});
it('ignores duplicate confirmations while a search is pending', async () => {
  const session = new DemoSession();
  await identify(session);
  const first = session.confirm(demoProduct);
  const second = session.confirm({ name: 'Outro produto' });
  await jest.advanceTimersByTimeAsync(3300); await Promise.all([first, second]);
  expect(session.getSnapshot().product).toEqual(demoProduct);
  expect(session.getSnapshot().phase).toBe('complete');
});
it('uses injected demo durations and never finishes a stage early', async () => {
  const session = new DemoSession(createDemoAdapters, { analysisMs: 12, recognitionMs: 15, offersMs: 20, organizationMs: 13 });
  session.start('success'); const recognition = session.recognize();
  await jest.advanceTimersByTimeAsync(11); expect(session.getSnapshot().phase).toBe('analyzing');
  await jest.advanceTimersByTimeAsync(1); expect(session.getSnapshot().phase).toBe('recognizing');
  await jest.advanceTimersByTimeAsync(14); expect(session.getSnapshot().phase).toBe('recognizing');
  await jest.advanceTimersByTimeAsync(1); await recognition; expect(session.getSnapshot().phase).toBe('identify');
  const search = session.confirm(demoProduct);
  await jest.advanceTimersByTimeAsync(19); expect(session.getSnapshot().phase).toBe('searching');
  await jest.advanceTimersByTimeAsync(1); expect(session.getSnapshot().phase).toBe('organizing');
  expect(session.getSnapshot().completionId).toBeUndefined();
  await jest.advanceTimersByTimeAsync(12); expect(session.getSnapshot().phase).toBe('organizing');
  await jest.advanceTimersByTimeAsync(1); await search; expect(session.getSnapshot().phase).toBe('complete');
});
it('cancels organization timers and invalidates confirmation callbacks on a new demo', async () => {
  const session = new DemoSession();
  await identify(session);
  const search = session.confirm(demoProduct);
  await jest.advanceTimersByTimeAsync(2000);
  expect(session.getSnapshot().phase).toBe('organizing');
  session.start('empty'); await search;
  await jest.advanceTimersByTimeAsync(10000);
  expect(session.getSnapshot().phase).toBe('review');
  expect(jest.getTimerCount()).toBe(0);
});
it('does not open confirmation if organizing returns no valid offers', async () => {
  const session = new DemoSession(() => ({ ...createDemoAdapters('success'), offers: { async search() {
    return demoOffers(new Date().toISOString()).map(offer => ({ ...offer, merchant: '' }));
  } } }));
  await identify(session); await confirm(session);
  expect(session.getSnapshot().phase).toBe('empty');
  expect(session.getSnapshot().completionId).toBeUndefined();
});
it('starts a fresh demonstration after success and rejects the previous confirmation callback', async () => {
  const session = new DemoSession();
  await identify(session); await confirm(session);
  const previousId = session.getSnapshot().completionId!;
  session.confirmation.attach(previousId, true, 800, () => {}, () => session.results(previousId));
  session.start('success');
  await jest.advanceTimersByTimeAsync(10000);
  expect(session.getSnapshot().phase).toBe('review');
  const recognition = session.recognize(); await jest.advanceTimersByTimeAsync(2700); await recognition;
  await confirm(session);
  expect(session.getSnapshot().completionId).not.toBe(previousId);
  session.results(previousId);
  expect(session.getSnapshot().phase).toBe('complete');
});
