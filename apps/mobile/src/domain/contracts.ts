// Fronteiras substituíveis: a Etapa 2 usa apenas adaptadores mock locais.
export type Product = { name: string; brand?: string; model?: string };
export type RecognitionResult = { product: Product | null; needsConfirmation: boolean };
export type Offer = {
  id: string;
  product: Product;
  merchant: string;
  matchType: 'exact' | 'similar';
  matchReason: string;
  price?: { amountMinor: number; currency: string };
  capturedAt: string;
  source: 'mock';
};
export interface RecognitionAdapter { recognize(imageUri: string, signal: AbortSignal): Promise<RecognitionResult> }
export interface OffersAdapter { search(product: Product, signal: AbortSignal): Promise<Offer[]> }
