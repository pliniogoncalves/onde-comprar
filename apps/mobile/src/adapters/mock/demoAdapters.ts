import type { OffersAdapter, Product, RecognitionAdapter } from '../../domain/contracts';
import { demoOffers, demoProduct, type DemoScenario } from '../../fixtures/demo';

function pause(signal: AbortSignal, ms: number) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(new Error('cancelled')); return; }
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, ms);
    function abort() { clearTimeout(timer); reject(new Error('cancelled')); }
    signal.addEventListener('abort', abort, { once: true });
  });
}
export function normalizeProduct(product: Product): Product {
  return { name: product.name.trim(), brand: product.brand?.trim(), model: product.model?.trim() };
}
export function matchesDemo(product: Product) {
  const clean = (value?: string) => value?.trim().toLocaleLowerCase('pt-BR');
  return (['name', 'brand', 'model'] as const).every(key => clean(product[key]) === clean(demoProduct[key]));
}
export function createDemoAdapters(scenario: DemoScenario, latency = 650): { recognition: RecognitionAdapter; offers: OffersAdapter } {
  return {
    recognition: { async recognize(_image, signal) {
      await pause(signal, latency);
      return { product: scenario === 'inconclusive' ? null : { ...demoProduct }, needsConfirmation: true };
    } },
    offers: { async search(product, signal) {
      await pause(signal, latency);
      if (scenario === 'error') throw new Error('Falha demonstrativa na consulta de ofertas.');
      if (scenario === 'empty' || !matchesDemo(product)) return [];
      return demoOffers(new Date().toISOString());
    } },
  };
}
