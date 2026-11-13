# Arquitetura proposta (não implementada)

## Fundação implementada e Etapa 2

Na Etapa 2.1, `demoTiming.ts` concentra os tempos da simulação e da confirmação. `demoSequencer.ts` contém espera abortável exclusiva de `DemoSession`; os adaptadores de identificação/ofertas não introduzem latência artificial. A sessão diferencia análise, identificação, busca e organização, sem concluir operações antes da resposta correspondente.

`demo-complete.tsx` é uma rota do Stack principal, fora das abas, com áreas seguras e sem Tab Bar. `ConfirmationController` coordena o marco visual, permanência limitada, pausa por perda de foco e avanço único. O estado da sessão decide a rota de resultados; não há dois comandos concorrentes de navegação. O áudio é preparado antes do marco e seu mecanismo de reprodução não controla a navegação. O arquivo original é preservado.

O mobile utiliza React Native, Expo SDK 54, Expo Router e TypeScript. A jornada demonstrativa roda inteiramente no app: `DemoSession` controla estados e cancelamento; Context/useSyncExternalStore conectam as telas; contratos de recognition/offers permitem substituir os adaptadores mock. A sessão fica em memória, sem histórico persistente. AsyncStorage continua restrito às preferências.

As rotas da jornada ficam numa pilha dentro da aba Início, preservando a Tab Bar. Contratos e mocks não dependem das telas. Matching exato exige nome, marca e modelo do exemplo; dados incompatíveis não recebem ofertas de outro produto.

Conclusões têm identificador próprio e uma política de consumo único, independente do mecanismo de áudio. Android/iOS utilizam `expo-audio` ~1.1.1; Web trata diretamente a Promise de HTMLAudioElement.play() para lidar com autoplay bloqueado na versão do SDK 54. Não há háptica ou gravação. A animação é opcional conforme movimento reduzido e o sucesso visual não depende de áudio.

A stack de backend descrita abaixo permanece futura. TanStack Query/Zustand não foram adicionados à sessão demonstrativa, pois não há consultas remotas ou necessidade de outro gerenciador de estado.

## Direção de produto registrada — sem implementação adicional

A jornada de fotografia/galeria e o histórico local devem funcionar sem autenticação. A persistência local do histórico será adicionada em etapa futura autorizada; na Etapa 2, apenas preferências são persistidas.

A correção de nome, marca e modelo pertence à confirmação da identificação na jornada atual. Uma entrada independente por texto, se aprovada futuramente, deverá reutilizar a orquestração de consulta de ofertas e seus adaptadores, mantendo a distinção entre exatos e semelhantes. Não será criado um segundo mecanismo de consulta apenas para essa entrada.

Conta e sincronização remota são capacidades opcionais futuras. O módulo `users` e a persistência remota não devem ser pré-requisitos da captura, seleção de imagem, descoberta de ofertas ou histórico local. Provedor de autenticação, modelo de sincronização e política de retenção das imagens continuam sem definição; nenhuma integração é autorizada por este registro. Consulte [BACKLOG.md](BACKLOG.md).

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
- `users`: somente se conta opcional e sincronização forem aprovadas; não condiciona a jornada principal nem o histórico local.

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
