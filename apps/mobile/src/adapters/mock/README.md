# Adaptadores mock

Os contratos estão em `src/domain/contracts.ts`. `demoAdapters.ts` implementa identificação e busca locais, com cenários determinísticos em `src/fixtures/demo.ts`. Os atrasos ficam exclusivamente no sequenciador de `DemoSession`, conforme `src/config/demoTiming.ts`, com cancelamento por AbortSignal; não pertencem aos contratos/adaptadores reais futuros. Não há rede ou reconhecimento de imagem. Apenas o produto fictício Fone de ouvido / Aurora / A1 possui ofertas no cenário de sucesso; dados incompatíveis retornam vazio. Cada oferta declara origem mock e motivo do matching.
