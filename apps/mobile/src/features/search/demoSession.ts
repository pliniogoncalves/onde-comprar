import type { Offer, Product } from '../../domain/contracts';
import { createDemoAdapters, normalizeProduct } from '../../adapters/mock/demoAdapters';
import { demoImageRef, type DemoScenario } from '../../fixtures/demo';
import { CompletionGate } from './completion/completion';
import { demoTiming, type DemoTiming } from '../../config/demoTiming';
import { waitForDemo } from './demoSequencer';
import { ConfirmationController } from './completion/confirmationController';

export type Phase = 'idle' | 'review' | 'analyzing' | 'recognizing' | 'identify' | 'searching' | 'organizing' | 'complete' | 'results' | 'empty' | 'error' | 'inconclusive' | 'cancelled';
export type Operation = 'analysis' | 'recognition' | 'offers' | 'organization';
export type DemoState = { phase: Phase; scenario: DemoScenario; product: Product | null; offers: Offer[]; completionId?: string; failedOperation?: Operation };
type AdapterFactory = typeof createDemoAdapters;

export class DemoSession {
  private state: DemoState = { phase: 'idle', scenario: 'success', product: null, offers: [] };
  private listeners = new Set<() => void>();
  private request?: AbortController;
  private revision = 0;
  readonly completion = new CompletionGate();
  readonly confirmation = new ConfirmationController();
  constructor(private readonly adapters: AdapterFactory = createDemoAdapters, private readonly timing: DemoTiming = demoTiming) {}
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private set(next: Partial<DemoState>) { this.state = { ...this.state, ...next }; this.listeners.forEach(fn => fn()); }
  start(scenario: DemoScenario) {
    this.request?.abort(); this.revision++;
    this.confirmation.reset();
    this.set({ phase: 'review', scenario, product: null, offers: [], completionId: undefined, failedOperation: undefined });
  }
  private begin() { this.request?.abort(); this.request = new AbortController(); return { signal: this.request.signal, revision: ++this.revision }; }
  async recognize() {
    if (this.state.phase !== 'review') return;
    const { signal, revision } = this.begin();
    this.set({ phase: 'analyzing' });
    try {
      await waitForDemo(this.timing.analysisMs, signal);
      if (signal.aborted || revision !== this.revision) return;
      this.set({ phase: 'recognizing' });
      await waitForDemo(this.timing.recognitionMs, signal);
      const result = await this.adapters(this.state.scenario).recognition.recognize(demoImageRef, signal);
      if (signal.aborted || revision !== this.revision) return;
      this.set({ product: result.product, phase: result.product ? 'identify' : 'inconclusive' });
    } catch { if (!signal.aborted && revision === this.revision) this.set({ phase: 'error', failedOperation: this.getSnapshot().phase === 'analyzing' ? 'analysis' : 'recognition' }); }
  }
  async confirm(input: Product) {
    if (!['identify', 'inconclusive'].includes(this.state.phase)) return;
    const product = normalizeProduct(input);
    if (!product.name) throw new Error('Informe o nome do produto.');
    const { signal, revision } = this.begin();
    this.set({ phase: 'searching', product, offers: [], completionId: undefined });
    try {
      await waitForDemo(this.timing.offersMs, signal);
      const offers = await this.adapters(this.state.scenario).offers.search(product, signal);
      if (signal.aborted || revision !== this.revision) return;
      if (!offers.length) { this.set({ phase: 'empty' }); return; }
      this.set({ phase: 'organizing' });
      await waitForDemo(this.timing.organizationMs, signal);
      if (signal.aborted || revision !== this.revision) return;
      const valid = offers.filter(offer => offer.id && offer.merchant && offer.product.name && ['exact', 'similar'].includes(offer.matchType) && (!offer.price || (Number.isFinite(offer.price.amountMinor) && offer.price.amountMinor >= 0 && offer.price.currency)));
      this.set({ offers: valid, phase: valid.length ? 'complete' : 'empty', completionId: valid.length ? `completion-${revision}` : undefined });
    } catch { if (!signal.aborted && revision === this.revision) this.set({ phase: 'error', failedOperation: this.state.phase === 'organizing' ? 'organization' : 'offers' }); }
  }
  cancel() { this.request?.abort(); this.confirmation.reset(); this.revision++; this.set({ phase: 'cancelled', offers: [], completionId: undefined }); }
  results(id?: string) { if (this.state.phase === 'complete' && (!id || id === this.state.completionId)) this.set({ phase: 'results' }); }
  edit() { if (['results', 'empty'].includes(this.state.phase)) this.set({ phase: 'identify', offers: [], completionId: undefined }); }
}
