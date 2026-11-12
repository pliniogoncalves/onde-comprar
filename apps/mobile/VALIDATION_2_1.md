# Etapa 2.1 — Refinamento da experiência de busca e conclusão

Status: **experiência visual e funcional aprovada pelo usuário**. A duração de aproximadamente 1,8 s foi validada manualmente e permanece em 1.800 ms. Commit e push autorizados na branch `feature/etapa-2-jornada-demonstrativa`, baseada em `267c18b`. A integração aguarda revisão final do Pull Request; nenhum merge autorizado. `main` preservada em `d2169b4`. A Etapa 3 não foi iniciada.

## Experiência implementada

- Tempos exclusivos da demonstração em `src/config/demoTiming.ts`: análise 1.200 ms, identificação 1.500 ms, pausa para confirmação manual, busca 2.000 ms e organização 1.300 ms. Total de processamento: aproximadamente 6 s, fora o tempo do usuário e a confirmação final.
- `demoSequencer.ts` fornece espera abortável para a sessão demonstrativa. Os adaptadores não introduzem delays. Nenhuma integração real futura deve aplicar estes tempos artificiais.
- A operação atual fica em andamento até sua conclusão efetiva. Pendentes, andamento, concluídas e erro possuem indicação própria; mudanças de status recebem transição de 160 ms sem atrasar a lógica. Nenhum percentual artificial.
- Correção do produto reutiliza identificação confirmada e não repete análise desnecessariamente. Operações antigas e temporizadores são invalidados ao cancelar ou iniciar nova sessão.
- Ofertas válidas levam à rota exclusiva `/demo-complete`, fora das abas. Fundo #102B25, check e texto em #7CE4AE, sem botões, cards, preços ou Tab Bar. Após a experiência, resultados e Tab Bar aparecem automaticamente.
- Introdução de busca visual por 180 ms e confirmação por 1.800 ms após o marco visual. A duração da animação é 420 ms. Valores configuráveis; movimento reduzido remove a introdução animada e animações, preservando confirmação estática e navegação.
- O período de confirmação considera duração do áudio + 150 ms de margem quando maior que o padrão, com teto de 4.000 ms para essa extensão. O MP3 atual cabe no padrão de 1.800 ms. O fluxo não aguarda a Promise de áudio para navegar.
- Perda de foco/foreground pausa a contagem restante. Retorno não repete áudio. Há uma única autoridade de navegação: a sessão passa a resultados uma vez e a guarda de rota executa a substituição.
- Aviso demonstrativo mais compacto; rótulos de lojas/preços fictícios e explicações relevantes permanecem. Não houve redesenho do Início ou dos resultados aprovados.

## Investigação do áudio

Foi medido o código anterior antes de alterar seu comportamento, usando Chrome headless e o arquivo local original. Relatórios em `artifacts/audio-before-2-1.json` e `audio-after-2-1.json`, reproduzíveis com `npm run measure:audio -- current` e Expo na porta 8091.

### Evidências

- O player já existia no provider antes do sucesso, mas na web havia apenas a intenção de preload. Na medição inicial o readyState no play era 1 (metadados), sem dados suficientes para reprodução imediata.
- O sucesso visual era renderizado antes do efeito que disparava animação e áudio. Na medição inicial, play ocorreu cerca de 20,9 ms após o texto e o evento playing cerca de 41,2 ms após o texto.
- No nativo, o código anterior aguardava seekTo(0) dentro de play. Esse caminho foi removido do marco; o reposicionamento agora pertence à preparação antecipada. Isso é comprovado no código, mas a redução de latência nativa não foi medida fisicamente.
- A decodificação do arquivo mostrou duração de 0,800 s, primeiro sinal acima de -50 dBFS em aproximadamente 0,0081 s e pico aproximado de 0,55. Não foi encontrada uma longa faixa de silêncio inicial; o arquivo não foi editado.

### Ajustes e medição posterior

A web inicia carregamento explícito e acompanha canplay. Preparar um arquivo já em zero não provoca novo seek; o marco não carrega nem reposiciona o áudio. No nativo, o player observa carregamento e prepara o seek antes do marco. A prontidão é consultada sem bloquear o visual. O consumo único ocorre antes da tentativa.

Na medição posterior final, readyState era 4. Em relação ao marco visual observado por MutationObserver:

| Evento | Diferença aproximada |
|---|---:|
| Chamada de play | -4,9 ms (layout effect anterior à observação do DOM) |
| Evento playing | +1,0 ms |
| Evento ended | +845,6 ms |
| Resultados visíveis | +1.904,0 ms |

O áudio terminou cerca de 1.058 ms antes dos resultados nessa execução. Outra execução posterior observou playing cerca de 2 ms após o marco. São observações locais, não um benchmark estatístico ou garantia acústica: DOM/evento playing não medem o instante em que o som chega ao ouvido. Não foi adicionado timeout para mascarar latência, nem trilha sonora artificial às gravações.

Autoplay pode ser bloqueado, inclusive em Safari, ou o player pode estar indisponível. A tentativa é única e opcional; o visual e a navegação continuam. Não há háptica ou gravação de microfone.

## Validações

- Jest: 32 testes aprovados em 5 suítes, incluindo sequência/durações injetadas, cancelamento, ofertas inválidas, callbacks antigos, nova demonstração após sucesso, confirmação automática, pausa/retomada e consumo único de áudio. Temporizadores controlados, sem esperas reais de seis segundos.
- Playwright: 18 casos aprovados em 393 × 852 e 360 × 800. Relógio controlado nas operações e confirmação; a reprodução real do arquivo é observada separadamente. Inclui sucesso, vazio, erro, inconclusivo, cancelamento, nova sessão, preferências, áudio bloqueado, movimento reduzido, confirmação sem abas/botões, restauração da Tab Bar e resultados automáticos. Após centralizar a navegação, os 6 casos afetados foram repetidos e aprovados.
- TypeScript, lint (sem avisos), compatibilidade Expo e exportação web final aprovados.
- Bundles Android/iOS finais aprovados via `npm run export:check -- --output-dir dist/native`. Nenhum build remoto, deploy ou publicação foi executado.

## Capturas e gravações para revisão

Os arquivos ficam em `artifacts/`, ignorado pelo Git. As gravações são em tempo real, sem relógio acelerado. **Vídeos do Playwright são visuais e não possuem faixa de áudio**; os eventos do player e as medições acima verificam áudio separadamente. A sincronização perceptível deve ser confirmada manualmente no aplicativo.

| Registro | 393 × 852 | 360 × 800 |
|---|---|---|
| Vídeo da jornada | [Abrir](artifacts/jornada-2-1-393x852.webm) | [Abrir](artifacts/jornada-2-1-360x800.webm) |
| Análise | [Abrir](artifacts/2-1-analysis-mobile-393.png) | [Abrir](artifacts/2-1-analysis-mobile-360.png) |
| Identificação | [Abrir](artifacts/2-1-recognition-mobile-393.png) | [Abrir](artifacts/2-1-recognition-mobile-360.png) |
| Busca | [Abrir](artifacts/2-1-search-mobile-393.png) | [Abrir](artifacts/2-1-search-mobile-360.png) |
| Organização | [Abrir](artifacts/2-1-organize-mobile-393.png) | [Abrir](artifacts/2-1-organize-mobile-360.png) |
| Encontrou! exclusivo | [Abrir](artifacts/2-1-confirmation-mobile-393.png) | [Abrir](artifacts/2-1-confirmation-mobile-360.png) |
| Resultados | [Abrir](artifacts/2-1-results-mobile-393.png) | [Abrir](artifacts/2-1-results-mobile-360.png) |
| Movimento reduzido | [Abrir](artifacts/2-1-reduced-mobile-393.png) | [Abrir](artifacts/2-1-reduced-mobile-360.png) |

## Arquivos principais alterados/criados

- `src/config/demoTiming.ts`, `src/features/search/demoSequencer.ts`, `demoSession.ts`: tempos e execução demonstrativa.
- `processingSteps.ts`, `ProcessingTimeline.tsx`, `DemoScreen.tsx`, `src/components/DemoNotice.tsx`: estados e apresentação compacta.
- `src/app/demo-complete.tsx`, `src/app/_layout.tsx`, `completion/CompletionView.tsx`, `confirmationController.ts`: rota exclusiva, marco e navegação.
- `completion/useCompletionSound.ts`, `.web.ts`, `DemoProvider.tsx`: preparação antecipada e recursos por plataforma.
- Testes de sessão, etapas, novo controlador e `e2e/demo.spec.ts`: regressão funcional.
- `scripts/measure-completion.cjs`, `scripts/record-demo.cjs`, `package.json`: diagnóstico e gravação local. Nenhuma dependência de runtime adicionada; utilitário de vídeo instalado apenas no cache de desenvolvimento do Playwright.
- READMEs, `docs/PRODUCT.md`, `ARCHITECTURE.md`, `MVP_PLAN.md` e este registro: direção aprovada e evidências.

## Limitações e revisão pendente

Sem execução física Android/iOS ou Safari. Audibilidade, latência acústica, alto-falante/Bluetooth, modo silencioso, leitor de tela e áreas seguras reais continuam pendentes. A permanência padrão precisa de revisão de legibilidade, especialmente com leitor de tela. Nenhum contorno de autoplay é aplicado. A auditoria de dependências da etapa anterior não foi tratada nesta rodada; não houve atualização de bibliotecas.

Para testar: `npm start -- --web`, habilitar Som ao encontrar e executar Com ofertas. Conferir aproximadamente 2,7 s antes da confirmação manual, 3,3 s depois e a confirmação exclusiva antes dos resultados. A experiência da Etapa 2.1 foi aprovada pelo usuário, sem alteração do tempo validado. Aguardar revisão final do Pull Request antes de qualquer integração; não realizar merge ou iniciar Etapa 3 sem autorização.
