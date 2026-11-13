import type { OffersAdapter, Product, RecognitionAdapter } from '../../domain/contracts';
import { demoOffers, demoProduct, type DemoScenario } from '../../fixtures/demo';

export function normalizeProduct(product: Product): Product {
  return { name: product.name.trim(), brand: product.brand?.trim(), model: product.model?.trim() };
}
export function matchesDemo(product: Product) {
  const clean = (value?: string) => value?.trim().toLocaleLowerCase('pt-BR');
  return (['name', 'brand', 'model'] as const).every(key => clean(product[key]) === clean(demoProduct[key]));
}
export function createDemoAdapters(scenario: DemoScenario): { recognition: RecognitionAdapter; offers: OffersAdapter } {
  return {
    recognition: { async recognize(_image, signal) {
      if (signal.aborted) throw new Error('cancelled');
      return { product: scenario === 'inconclusive' ? null : { ...demoProduct }, needsConfirmation: true };
    } },
    offers: { async search(product, signal) {
      if (signal.aborted) throw new Error('cancelled');
      if (scenario === 'error') throw new Error('Falha demonstrativa na consulta de ofertas.');
      if (scenario === 'empty' || !matchesDemo(product)) return [];
      return demoOffers(new Date().toISOString());
    } },
  };
}
