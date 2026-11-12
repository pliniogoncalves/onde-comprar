// Fronteiras para a próxima etapa. Nenhum serviço é executado na fundação.
export type Product = { name: string; brand?: string; model?: string };
export type RecognitionResult = { product: Product; needsConfirmation: boolean };
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
export interface RecognitionAdapter { recognize(imageUri: string): Promise<RecognitionResult> }
export interface OffersAdapter { search(product: Product): Promise<Offer[]> }
