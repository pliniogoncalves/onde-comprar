# Etapa 2 — Jornada demonstrativa

Status: implementada para revisão, sem commit, push ou merge. Branch: `feature/etapa-2-jornada-demonstrativa`. A Etapa 3 não foi iniciada.

## Entrega

O cabeçalho aprovado da Etapa 1.1 foi preservado. O Início oferece demonstração com imagem local e seletor dos cenários com ofertas, sem resultados, erro e identificação inconclusiva. Câmera e galeria continuam desativadas; Histórico permanece vazio.

Fluxo: revisão da imagem → identificação simulada → confirmação/correção → consulta simulada → “Encontrou!” → resultados agrupados → detalhes. A identificação inconclusiva aceita preenchimento manual. Nome é obrigatório. A comparação exata exige nome, marca e modelo do exemplo; uma correção incompatível retorna vazio. Todos os preços, lojas e produtos são fictícios, sem link de compra ou alegação de estoque.

O processamento apresenta card verde escuro com spinner geral e sequência de imagem recebida, identificação simulada e busca de ofertas fictícias. Cada operação indica pendente, em andamento com spinner, concluída com confirmação ou erro com ícone próprio. As transições derivam do estado dos adaptadores; não há percentuais ou etapas artificiais. Com movimento reduzido, indicadores estáticos substituem spinners e a animação de conclusão. A linha da operação que falhou permanece visível na tela de erro.

`DemoSession` mantém estados em memória, invalida respostas antigas e aceita cancelamento durante identificação e busca. Os adaptadores recebem AbortSignal. Não há backend, IA, marketplace, autenticação ou persistência do histórico. Recarregar uma rota da jornada sem sessão oferece retorno ao início. Trocar abas preserva a sessão; nenhum efeito de conclusão inicia enquanto sua tela não estiver em foco.

## Áudio e acessibilidade

- Preferência de som inicialmente desligada, persistida pelo mecanismo já existente.
- Som permitido apenas em conclusão bem-sucedida com ofertas. Um identificador é consumido antes da tentativa, impedindo repetição por render, retorno à tela ou mudança de preferência. Bloqueios não geram retentativa automática.
- Animação e tentativa de reprodução iniciam no mesmo evento de conclusão em foco; não há promessa de sincronização acústica exata entre dispositivos.
- Movimento reduzido mantém a confirmação visual e remove a animação. Háptica não é executada.
- Android/iOS usam `expo-audio` ~1.1.1, versão indicada pelo SDK 54. O plugin foi configurado sem permissões de gravação. Não há microfone, background playback ou serviço externo.
- Web usa HTMLAudioElement com rejeição de play() tratada; o player web do expo-audio dessa versão descarta a Promise. Bloqueio ou falha preservam o visual e os resultados, com mensagem informativa. Desligar som ou sair da conclusão interrompe a reprodução.
- `sucesso.mp3` é usado sem edição, apenas para os testes internos autorizados. Seu hash Git coincide com HEAD: `4c75a7c76d3141b15747c3e7155c71fe88866db0`.

Referências: [Expo Audio](https://docs.expo.dev/versions/v54.0.0/sdk/audio/), [autoplay nos navegadores](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay). O comportamento específico do SDK 54 também foi conferido nos fontes locais de expo-audio.

## Validação

- TypeScript aprovado.
- Lint aprovado sem avisos após remover duas diretivas desnecessárias.
- Jest: 22 testes aprovados em 4 suítes, cobrindo transições, cancelamento nas duas operações, respostas antigas, validação, matching, etapas visuais, consumo único de conclusão e preferências.
- Playwright: 18 testes aprovados na execução completa final, em 393 × 852 e 360 × 800 CSS px. Incluem jornada completa, formulário obrigatório/correção, grupos e detalhes, recuperação após reload, ausência de requisições HTTP externas, cenários alternativos, cancelamento, preservação da Tab Bar/rolagem (incluindo formulário em foco) e persistência de preferências. Verificam estados da sequência visual e erro na operação correta.
- Áudio no Chrome: reprodução real iniciada com preferência habilitada; nenhum play com preferência desligada; somente uma tentativa por conclusão. Bloqueio de autoplay simulado com NotAllowedError preserva o sucesso visual e não produz erro de página. Movimento reduzido mantém a escala do ícone sem animação. Retornar por outra aba não repete a tentativa.
- O primeiro teste de navegador atingiu 60 segundos durante a compilação inicial do Metro. O limite foi ajustado para 120 segundos; a repetição completa passou. Nenhuma asserção funcional foi removida.
- Exportação web aprovada, incluindo imagem local e MP3.
- Checagem Expo: dependências compatíveis com SDK 54.

Empacotamento nativo final aprovado: `npm run export:check -- --output-dir dist/native` gerou os bundles Android/iOS com a jornada, sequência de processamento e módulo de áudio. Isso não substitui a validação física dos dispositivos.

## Capturas para revisão

Capturas locais em `artifacts/`, ignorado pelo Git. Caminhos relativos a esta pasta:

| Tela | 393 × 852 | 360 × 800 |
|---|---|---|
| Início | [Abrir](artifacts/home-brand-393x852.png) | [Abrir](artifacts/home-brand-360x800.png) |
| Revisão | [Abrir](artifacts/demo-review-mobile-393.png) | [Abrir](artifacts/demo-review-mobile-360.png) |
| Processando identificação | [Abrir](artifacts/demo-processing-identify-mobile-393.png) | [Abrir](artifacts/demo-processing-identify-mobile-360.png) |
| Processando ofertas | [Abrir](artifacts/demo-processing-offers-mobile-393.png) | [Abrir](artifacts/demo-processing-offers-mobile-360.png) |
| Identificação | [Abrir](artifacts/demo-identify-mobile-393.png) | [Abrir](artifacts/demo-identify-mobile-360.png) |
| Encontrou! | [Abrir](artifacts/demo-complete-mobile-393.png) | [Abrir](artifacts/demo-complete-mobile-360.png) |
| Resultados | [Abrir](artifacts/demo-results-mobile-393.png) | [Abrir](artifacts/demo-results-mobile-360.png) |
| Detalhes | [Abrir](artifacts/demo-detail-mobile-393.png) | [Abrir](artifacts/demo-detail-mobile-360.png) |
| Áudio bloqueado | [Abrir](artifacts/demo-sound-blocked-mobile-393.png) | [Abrir](artifacts/demo-sound-blocked-mobile-360.png) |

As telas foram inspecionadas no Chrome. Algumas capturas refletem o ponto de rolagem da interação. Para rever desde o topo, inicie uma nova demonstração. O indicador de desenvolvimento do Expo pode aparecer sobreposto em algumas capturas; não faz parte do layout do produto.

As capturas de identificação retiram o foco do campo e retornam ao topo após verificar a presença/posição das três abas durante a edição. Isso normaliza o registro visual sem alterar o comportamento do aplicativo. A jornada completa foi repetida para gerar essas capturas nas duas resoluções.

## Arquivos principais

- `src/features/search`: sessão, provider, entrada, telas de processamento/estados e conclusão. `ProcessingTimeline.tsx` e `processingSteps.ts` apresentam as operações; o hook compartilhado `useReducedMotion.ts` controla a acessibilidade de movimento.
- `src/features/recognition/IdentificationForm.tsx` e `src/features/offers/OfferViews.tsx`: confirmação e ofertas.
- `src/adapters/mock/demoAdapters.ts`, `src/fixtures/demo.ts`, `src/domain/contracts.ts`: contratos e dados locais.
- `src/app/(tabs)/(home)`: pilha do Início e rotas da demonstração; substitui a rota index anterior da aba.
- `src/app/_layout.tsx`, `src/app/(tabs)/_layout.tsx`, `HomeScreen.tsx`, `PreferencesScreen.tsx`: integração com a base aprovada.
- `src/components/ActionButton.tsx` e `DemoNotice.tsx`: componentes reutilizáveis.
- `assets/demo`, `scripts/create-demo-image.cjs`: imagem fictícia criada localmente.
- `app.config.ts`, `package.json`, `package-lock.json`: módulo de áudio compatível e configuração sem gravação.
- Testes de sessão/conclusão e `e2e/demo.spec.ts`; `playwright.config.ts` com limite para compilação fria.
- `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/MVP_PLAN.md`, READMEs e este registro: fluxo Git, escopo atual e instruções.

## Limitações e próximo passo

Não houve execução física em Android/iOS ou Safari; audibilidade, latência, modo silencioso, safe areas, VoiceOver/TalkBack e fonte ampliada exigem validação em dispositivos. Bundles nativos não comprovam esses comportamentos. O navegador pode negar áudio apesar da preferência habilitada; não há workaround para contornar a política do usuário. A auditoria de dependências já tinha 33 ocorrências (5 altas); a instalação de expo-audio não alterou esse total e não foi aplicada atualização forçada.

Para testar: `npm ci`, `npm start -- --web`, escolha cenário e toque em Experimentar demonstração. Para ouvir, habilite Som ao encontrar em Preferências antes de começar. Não é necessário serviço pago.

Após revisão e autorização separada para commit/push, preparar PR da branch atual para main com escopo “Jornada demonstrativa com mocks locais e conclusão sonora opcional”, resultados de validação e limitações acima. Nenhum PR foi publicado nesta etapa. Merge somente após aprovação.
