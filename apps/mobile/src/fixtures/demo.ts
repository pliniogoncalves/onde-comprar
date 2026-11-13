import type { Offer, Product } from '../domain/contracts';

export const scenarios = [
  { id: 'success', label: 'Com ofertas' },
  { id: 'empty', label: 'Sem resultados' },
  { id: 'error', label: 'Erro na busca' },
  { id: 'inconclusive', label: 'Identificação inconclusiva' },
] as const;
export type DemoScenario = typeof scenarios[number]['id'];
export const demoProduct: Product = { name: 'Fone de ouvido', brand: 'Aurora', model: 'A1' };
export const demoImageRef = 'demo-headphones';
export const demoImage = require('../../assets/demo/headphones.png');

export function demoOffers(capturedAt: string): Offer[] {
  const offers: Omit<Offer, 'capturedAt' | 'source'>[] = [
    { id: 'exact-1', product: demoProduct, merchant: 'Loja Exemplo Verde', price: { amountMinor: 12990, currency: 'BRL' }, matchType: 'exact', matchReason: 'Marca e modelo iguais ao exemplo confirmado.' },
    { id: 'exact-2', product: demoProduct, merchant: 'Loja Exemplo Centro', price: { amountMinor: 14990, currency: 'BRL' }, matchType: 'exact', matchReason: 'Mesmo produto e mesma variante do exemplo.' },
    { id: 'similar-1', product: { ...demoProduct, model: 'A2' }, merchant: 'Loja Exemplo Menta', price: { amountMinor: 9990, currency: 'BRL' }, matchType: 'similar', matchReason: 'Mesma categoria, mas modelo diferente: A2.' },
  ];
  return offers.map(offer => ({ ...offer, capturedAt, source: 'mock' }));
}
