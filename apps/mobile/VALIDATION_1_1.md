# Etapa 1.1 — Refinamento visual e layout

## Revisão da composição do Início — aguardando revisão visual do usuário

O Início foi recomposto com cabeçalho verde escuro de largura total, ícone de busca visual centralizado, nome branco, slogan menta, divisória discreta e descrição branca. O nome e slogan continuam configuráveis. A descrição fica inteira em uma única linha conforme a orientação adicional do usuário, com ajuste de fonte baseado na largura medida do texto e do espaço disponível (componente React Native, sem CSS específico da web).

Abaixo ficam ilustração menor de sacola/câmera, um único incentivo, aviso de captura em breve e os dois botões explicitamente desabilitados com Pressable. O card verde promocional foi removido. O cabeçalho mede aproximadamente 213 px nas viewports verificadas, sem altura fixa. O componente Screen aceita uma seção superior de largura total; Histórico e Preferências mantêm a composição anterior. A barra de status usa ícones claros no Início e escuros nas demais telas.

Arquivos desta revisão: novos `src/components/BrandHeader.tsx` e `AutoFitLine.tsx`; alterações em `src/components/Screen.tsx`, `src/features/home/HomeScreen.tsx`, `src/app/_layout.tsx`, `e2e/layout.spec.ts`, `README.md` do mobile e este registro. Nenhuma dependência adicionada nesta revisão e nenhuma alteração à Tab Bar.

Novas capturas do viewport inicial: `artifacts/home-brand-393x852.png` e `artifacts/home-brand-360x800.png`, ambas inspecionadas visualmente. Os dois testes Playwright passaram, incluindo largura total/altura compacta do cabeçalho, descrição completa em uma única linha, botões desabilitados e as verificações anteriores de navegação, rolagem e persistência. Os 7 testes Jest passaram em execução isolada; uma tentativa anterior com múltiplas verificações simultâneas atingiu o timeout do teste de persistência.

A revisão permanece na Etapa 1.1, aguardando avaliação visual do usuário. Nenhuma funcionalidade da Etapa 2 foi iniciada. As limitações de testes em aparelhos físicos descritas abaixo permanecem.

Verificação final desta revisão: `npm run typecheck`, `npm run lint` (sem avisos), `npm test` (7 testes), `npm run test:web` (2 viewports) e `npm run export:web` aprovados.

## Investigação e correção

Problema reproduzido no Chrome headless com React Native Web em 393 × 852 e 360 × 800 CSS px, antes das alterações visuais. As três abas apresentavam caixas de rótulo com apenas 10 px de altura para fonte de 12 px, cortadas por `overflow: hidden`. Na viewport de 852 px, os itens da barra ocupavam y=804 até y=852. A barra estava dentro do viewport; o texto era comprimido dentro do item.

Foram inspecionados o meta viewport (`width=device-width, initial-scale=1, shrink-to-fit=no`), `innerHeight`, `visualViewport.height`, largura/altura do documento e a cadeia de ancestrais até html/body. Os tamanhos do documento coincidiam com as viewports, sem deslocamento externo ou overflow horizontal. O `overflow: hidden` do body faz parte da estrutura padrão do Expo Web, com rolagem interna; não foi removido para mascarar o corte.

A Tab Bar agora usa altura automática, mínimo calculado pelo espaço do ícone + linha de texto escalada + padding dos itens, somado ao inset inferior do dispositivo. Os rótulos têm line-height explícito e não encolhem. O React Navigation continua responsável pelos insets e por reservar espaço para a barra no fluxo, sem posicionamento absoluto ou margens compensatórias nas telas. Cada aba recebeu nome acessível explícito, evitando incluir os caracteres dos ícones no nome anunciado.

Após a correção, os rótulos medem 16 px e os itens 54 px com fontScale=1/inset=0 nessas viewports. Esses valores são resultados da composição, não alturas fixas impostas à barra. Em 393 × 852, os itens ocupam y=798 até y=852; em 360 × 800, y=746 até y=800.

## Refinamento visual

- Paleta com fundo #F5F7F5, superfícies brancas, verde escuro #102B25 e menta #7CE4AE.
- Conteúdo centralizado com largura máxima, espaçamentos e tipografia revistos.
- Início com composição de fotografia/produto e futuras ações desativadas, sem captura.
- Histórico com ícone, contador vazio e espaço preparado para pesquisas futuras.
- Preferências agrupadas, com ícones e explicações menores. A lógica de persistência não foi alterada.
- Ícones existentes e componentes React Native; nenhuma biblioteca visual adicionada. Playwright foi adicionado apenas para desenvolvimento. expo-font/expo-asset foram declarados explicitamente nas versões compatíveis com SDK 54.

## Verificações

- `npm run typecheck` e `npm run lint`: aprovados na verificação final, sem erros ou avisos do lint.
- Jest: 2 suítes, 7 testes aprovados. Inclui preferências ausentes/inválidas, persistência e política de efeitos de conclusão.
- Playwright: 2 testes aprovados, um por viewport. Cada teste navega pelas três abas, verifica a caixa e o conteúdo textual dos rótulos, limites da barra, ausência de overflow horizontal e acesso ao fim de cada tela acima da barra. Também verifica os dois switches inicialmente desligados e ambos ligados após recarregar.
- `npm run export:web`: bundle de produção web gerado localmente.
- `npm run export:check -- --output-dir dist/native`: bundles Android e iOS gerados localmente, sem publicação. Isso verifica o empacotamento, não a execução em aparelhos.
- A primeira execução encontrou nomes acessíveis contaminados por ícones e dependência de fontes não resolvida pelo Jest. Ambos foram corrigidos. O teste unitário isola o carregamento nativo de fontes; a renderização real dos ícones foi verificada no Chrome.

Relatórios locais: `artifacts/before-layout.json`, `after-layout.json` e capturas `before-*.png`, `after-*.png`, `mobile-393-*.png` e `mobile-360-*.png`. Os arquivos são ignorados no Git. As capturas foram inspecionadas visualmente, além das asserções geométricas.

## Arquivos envolvidos

- `.gitignore`: ignora artefatos de validação.
- `src/theme/index.ts`: paleta e métricas de navegação.
- `src/app/(tabs)/_layout.tsx`: dimensionamento e acessibilidade da barra.
- `src/components/Screen.tsx`, `Card.tsx`, novo `IconBadge.tsx`: layout responsivo e elementos compartilhados.
- `src/features/home/HomeScreen.tsx`, `history/HistoryScreen.tsx`, `preferences/PreferencesScreen.tsx`: refinamento das três telas.
- `src/features/preferences/PreferencesProvider.test.tsx`, `src/test/setup.ts`: cobertura de preferências ausentes e isolamento de fontes no teste.
- `package.json`, `package-lock.json`: dependências e comandos de verificação; `eslint.config.js`: exclusão dos artefatos gerados da análise.
- Novos `playwright.config.ts`, `e2e/layout.spec.ts`, `scripts/inspect-layout.cjs`: regressão e diagnóstico no navegador.
- `README.md` do mobile e este registro: execução e resultados.

## Limitações

As viewports são emulações no Chrome, não execução em iOS/Android físicos. Não houve teste em Safari, de gestos/notches reais, TalkBack/VoiceOver ou aumento de fonte do sistema. Os insets reais continuam pendentes de validação nos dispositivos. Portanto, o corte está reproduzido e corrigido no ambiente web testado; a validação nativa não está concluída.

A auditoria npm continua com 33 vulnerabilidades (8 baixas, 20 moderadas e 5 altas). Não foi aplicada atualização forçada do SDK nem correção de segurança fora do escopo desta etapa.

As alterações preexistentes do README da raiz foram preservadas. Nenhuma funcionalidade da Etapa 2, backend, IA, oferta real, reprodução de som ou háptica foi implementada.
