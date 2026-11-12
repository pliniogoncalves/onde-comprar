import type { DemoState, Operation } from './demoSession';

export type OperationStatus = 'pending' | 'running' | 'done' | 'error';
const operations = [
  { id: 'analysis', label: 'Analisando a imagem', phase: 'analyzing' },
  { id: 'recognition', label: 'Identificando o produto', phase: 'recognizing' },
  { id: 'offers', label: 'Buscando lojas e ofertas', phase: 'searching' },
  { id: 'organization', label: 'Organizando os resultados', phase: 'organizing' },
] as const;
export function processingSteps(state: DemoState): { id: Operation; label: string; status: OperationStatus }[] {
  const active = operations.findIndex(step => step.phase === state.phase);
  const failed = operations.findIndex(step => step.id === state.failedOperation);
  return operations.map((step, index) => {
    let status: OperationStatus = 'pending';
    if (state.phase === 'error') status = index === failed ? 'error' : index < failed ? 'done' : 'pending';
    else if (active >= 0) status = index === active ? 'running' : index < active ? 'done' : 'pending';
    else if (['identify', 'inconclusive'].includes(state.phase)) status = index < 2 ? 'done' : 'pending';
    else if (state.phase === 'empty') status = index < 3 ? 'done' : 'pending';
    else if (['complete', 'results'].includes(state.phase)) status = 'done';
    return { id: step.id, label: step.label, status };
  });
}
