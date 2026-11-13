import { processingSteps } from './processingSteps';
import type { DemoState } from './demoSession';

const base: DemoState = { phase: 'review', scenario: 'success', product: null, offers: [] };
it('represents pending, running and completed operations from actual session phases', () => {
  expect(processingSteps(base).map(step => step.status)).toEqual(['pending', 'pending', 'pending', 'pending']);
  expect(processingSteps({ ...base, phase: 'analyzing' }).map(step => step.status)).toEqual(['running', 'pending', 'pending', 'pending']);
  expect(processingSteps({ ...base, phase: 'recognizing' }).map(step => step.status)).toEqual(['done', 'running', 'pending', 'pending']);
  expect(processingSteps({ ...base, phase: 'searching' }).map(step => step.status)).toEqual(['done', 'done', 'running', 'pending']);
  expect(processingSteps({ ...base, phase: 'organizing' }).map(step => step.status)).toEqual(['done', 'done', 'done', 'running']);
  expect(processingSteps({ ...base, phase: 'complete' }).map(step => step.status)).toEqual(['done', 'done', 'done', 'done']);
});
it.each(['recognition', 'offers'] as const)('shows error on the failed %s operation', failedOperation => {
  const steps = processingSteps({ ...base, phase: 'error', failedOperation });
  expect(steps.find(step => step.id === failedOperation)?.status).toBe('error');
  expect(steps.find(step => step.id === 'offers')?.status).toBe(failedOperation === 'recognition' ? 'pending' : 'error');
});
