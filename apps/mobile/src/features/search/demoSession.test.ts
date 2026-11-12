import { DemoSession } from './demoSession';
import { createDemoAdapters, matchesDemo } from '../../adapters/mock/demoAdapters';
import { demoProduct, type DemoScenario } from '../../fixtures/demo';
import type { RecognitionResult } from '../../domain/contracts';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());
async function identify(session: DemoSession, scenario: DemoScenario = 'success') {
  session.start(scenario);
  const pending = session.recognize();
  expect(session.getSnapshot().phase).toBe('recognizing');
  await jest.advanceTimersByTimeAsync(650);
  await pending;
}
async function confirm(session: DemoSession) {
  const pending = session.confirm(demoProduct);
  await jest.advanceTimersByTimeAsync(650);
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
  await jest.advanceTimersByTimeAsync(650); await pending;
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
  await jest.advanceTimersByTimeAsync(650); await Promise.all([first, second]);
  expect(session.getSnapshot().product).toEqual(demoProduct);
  expect(session.getSnapshot().phase).toBe('complete');
});
