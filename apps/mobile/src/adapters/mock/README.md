# Adaptadores mock

Os contratos estão em `src/domain/contracts.ts`. `demoAdapters.ts` implementa identificação e busca locais, com cenários determinísticos em `src/fixtures/demo.ts`. A latência é simulada e cancelável, sem rede ou reconhecimento de imagem. Apenas o produto fictício Fone de ouvido / Aurora / A1 possui ofertas no cenário de sucesso; dados incompatíveis retornam vazio. Cada oferta declara origem mock e motivo do matching.
