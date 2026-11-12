import type { Offer, Product } from '../../domain/contracts';
import { createDemoAdapters, normalizeProduct } from '../../adapters/mock/demoAdapters';
import { demoImageRef, type DemoScenario } from '../../fixtures/demo';
import { CompletionGate } from './completion/completion';

export type Phase = 'idle' | 'review' | 'recognizing' | 'identify' | 'searching' | 'complete' | 'results' | 'empty' | 'error' | 'inconclusive' | 'cancelled';
export type DemoState = { phase: Phase; scenario: DemoScenario; product: Product | null; offers: Offer[]; completionId?: string; failedOperation?: 'recognition' | 'offers' };
type AdapterFactory = typeof createDemoAdapters;

export class DemoSession {
  private state: DemoState = { phase: 'idle', scenario: 'success', product: null, offers: [] };
  private listeners = new Set<() => void>();
  private request?: AbortController;
  private revision = 0;
  readonly completion = new CompletionGate();
  constructor(private readonly adapters: AdapterFactory = createDemoAdapters) {}
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private set(next: Partial<DemoState>) { this.state = { ...this.state, ...next }; this.listeners.forEach(fn => fn()); }
  start(scenario: DemoScenario) {
    this.request?.abort(); this.revision++;
    this.set({ phase: 'review', scenario, product: null, offers: [], completionId: undefined, failedOperation: undefined });
  }
  private begin() { this.request?.abort(); this.request = new AbortController(); return { signal: this.request.signal, revision: ++this.revision }; }
  async recognize() {
    if (this.state.phase !== 'review') return;
    const { signal, revision } = this.begin();
    this.set({ phase: 'recognizing' });
    try {
      const result = await this.adapters(this.state.scenario).recognition.recognize(demoImageRef, signal);
      if (signal.aborted || revision !== this.revision) return;
      this.set({ product: result.product, phase: result.product ? 'identify' : 'inconclusive' });
    } catch { if (!signal.aborted && revision === this.revision) this.set({ phase: 'error', failedOperation: 'recognition' }); }
  }
  async confirm(input: Product) {
    if (!['identify', 'inconclusive'].includes(this.state.phase)) return;
    const product = normalizeProduct(input);
    if (!product.name) throw new Error('Informe o nome do produto.');
    const { signal, revision } = this.begin();
    this.set({ phase: 'searching', product, offers: [], completionId: undefined });
    try {
      const offers = await this.adapters(this.state.scenario).offers.search(product, signal);
      if (signal.aborted || revision !== this.revision) return;
      this.set({ offers, phase: offers.length ? 'complete' : 'empty', completionId: offers.length ? `completion-${revision}` : undefined });
    } catch { if (!signal.aborted && revision === this.revision) this.set({ phase: 'error', failedOperation: 'offers' }); }
  }
  cancel() { this.request?.abort(); this.revision++; this.set({ phase: 'cancelled', offers: [], completionId: undefined }); }
  results() { if (this.state.phase === 'complete') this.set({ phase: 'results' }); }
  edit() { if (['results', 'empty'].includes(this.state.phase)) this.set({ phase: 'identify', offers: [], completionId: undefined }); }
}
