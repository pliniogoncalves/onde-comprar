import type { DemoState } from './demoSession';

export type OperationStatus = 'pending' | 'running' | 'done' | 'error';
export function processingSteps(state: DemoState): { id: string; label: string; status: OperationStatus }[] {
  const recognition: OperationStatus = state.phase === 'recognizing' ? 'running'
    : state.phase === 'error' && state.failedOperation === 'recognition' ? 'error'
    : ['identify', 'inconclusive', 'searching', 'complete', 'results', 'empty', 'error'].includes(state.phase) ? 'done' : 'pending';
  const offers: OperationStatus = state.phase === 'searching' ? 'running'
    : state.phase === 'error' && state.failedOperation === 'offers' ? 'error'
    : ['complete', 'results', 'empty'].includes(state.phase) ? 'done' : 'pending';
  return [
    { id: 'image', label: 'Imagem de exemplo recebida', status: 'done' },
    { id: 'recognition', label: 'Identificação simulada do produto', status: recognition },
    { id: 'offers', label: 'Busca de ofertas fictícias', status: offers },
  ];
}
