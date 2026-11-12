# Arquitetura proposta (não implementada)

## Stack
- Mobile: React Native + Expo + TypeScript + Expo Router.
- Dados mobile: TanStack Query; estado leve com Zustand quando necessário.
- Backend: NestJS + TypeScript, monólito modular, REST.
- Banco: PostgreSQL + Prisma (quando persistência remota for necessária).
- IA: provedor multimodal via interface desacoplada; manter chave somente no servidor.
- Imagens: armazenamento compatível com S3, após definir retenção e custos.
- Filas/cache: BullMQ/Redis apenas quando a complexidade/latência justificar.
- Progresso: inicialmente polling ou SSE conforme testes; não introduzir WebSocket sem necessidade.
- CI: Git; testes unitários e de integração; EAS para builds móveis quando necessário.

## Módulos sugeridos
- `search`: orquestra identificação, confirmação e busca.
- `recognition`: integrações de IA e interpretação estruturada.
- `catalog`: normalização e matching (GTIN/EAN, marca, modelo, atributos).
- `offers`: adaptadores de fontes autorizadas e resultados.
- `history`: consultas anteriores e reexecução.
- `users`: somente se cadastro for adotado.

## Modelo inicial conceitual
- `Search`: id, createdAt, imageRef, query, status, recognizedProduct, confidence/uncertainty.
- `Product`: id, name, brand, model, gtin?, attributes.
- `Offer`: id, productId, merchant, url, price, currency, capturedAt, matchType.
- `SearchResult`: searchId, offerId, rank, reason.

## Limites
- Google Places localiza estabelecimentos, não comprova estoque.
- Não supor que Google Shopping tenha API geral pública e irrestrita.
- Comparação de preços só será real após integração com fonte licenciada/autorizada.
- Custos de IA, armazenamento e consultas precisam de limites por usuário.
