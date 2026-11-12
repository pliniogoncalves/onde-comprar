# Plano incremental de MVP

## Etapa 2.1 — experiência aprovada, integração pendente

Manter a branch da Etapa 2, sem commit/push/merge automático. A demonstração distribui aproximadamente 6 segundos em análise (1,2 s), identificação (1,5 s), busca (2 s) e organização (1,3 s), com pausa para confirmação manual entre identificação e busca. Valores centralizados, operações canceláveis e nenhum atraso artificial no backend real futuro.

Após ofertas válidas, uma rota fora das abas apresenta confirmação exclusiva com identidade verde escuro/menta. Um marco visual dispara no máximo uma tentativa de som, se habilitado, com player preparado antecipadamente. A permanência padrão é 1,8 s após o marco, configurável e limitada ao considerar duração de áudio; depois, resultados automáticos com Tab Bar restaurada. Áudio não bloqueia o fluxo. Respeitar movimento reduzido e manter háptica fora do escopo.

A experiência visual e funcional da Etapa 2.1 foi aprovada pelo usuário. A permanência de aproximadamente 1,8 s foi validada manualmente e será mantida. Commit e push da feature autorizados; a integração na main aguarda revisão final do Pull Request. Não realizar merge nem iniciar Etapa 3 sem autorização.

## Escopo aprovado — Etapa 2: Jornada demonstrativa

A Etapa 1.1 foi aprovada no ambiente web. A Etapa 2 corrente implementa somente a jornada mobile/web com imagem local, identificação corrigível, ofertas fictícias, confirmação visual e efeito sonoro opcional (uso interno). Não inclui NestJS, IA real, marketplaces, câmera/galeria ou histórico persistente. A descrição histórica da Fase 2 abaixo é um roteiro futuro, não autorização para implementar backend nesta etapa.

O som é inicialmente desativado, permitido uma vez por conclusão com ofertas e falhas de reprodução não impedem a experiência visual. Háptica permanece sem implementação. A sessão demonstrativa existe apenas em memória.

Versionamento: desenvolvimento em `feature/etapa-2-jornada-demonstrativa`. Commits, pushes e merges dependem de autorização explícita. Ao concluir a implementação e validação, apresentar resumo e orientação de Pull Request para revisão. Não avançar para a Etapa 3 sem autorização.

## Decisões registradas e backlog

Conforme decisão de 12/11/2026, fotografia é a entrada principal e galeria é a alternativa por imagem, ambas sem login obrigatório. O histórico será local e independente de autenticação. Busca independente por texto, conta e sincronização são possibilidades futuras secundárias/opcionais. A correção textual de nome, marca e modelo já pertence à Etapa 2 e não constitui uma nova modalidade de busca.

O [BACKLOG.md](BACKLOG.md) separa o escopo atual dos itens futuros. Câmera, galeria, histórico persistente, busca independente por texto, login e sincronização não serão implementados na Etapa 2. Cada etapa futura exige planejamento e autorização próprios; este registro não autoriza iniciar a Etapa 3.

## Fase 0 — Planejamento e protótipo
- Definir telas: boas-vindas/home, câmera/galeria, processamento, confirmação do produto, resultados, detalhes/ofertas, histórico, estados vazios/erro.
- Criar protótipo navegável com dados fictícios explicitamente rotulados.
- Validar fluxo e usabilidade antes de integrar serviços externos.

## Fase 1 — Fundação mobile
- Inicializar Expo TypeScript + Expo Router.
- Criar tema, navegação, componentes reutilizáveis e testes básicos.
- Implementar câmera/galeria com tratamento de permissões.

## Fase 2 — Backend simulado
- Inicializar NestJS; endpoint de busca mockado e contrato tipado.
- Mostrar progresso real das etapas disponíveis.
- Implementar histórico e reexecução com dados simulados.

## Fase 3 — Reconhecimento real
- Integrar IA multimodal no servidor.
- Pedir confirmação do produto quando necessário.
- Adicionar limites de custo, timeout, logs sem imagens sensíveis e testes.

## Fase 4 — Ofertas reais
- Pesquisar fontes permitidas, custos, cobertura e condições de uso.
- Implementar primeiro adaptador real e medir qualidade do matching.
- Mostrar data da consulta; diferenciar ofertas exatas e similares.

## Critérios de aceite do primeiro protótipo
- Rodar no Android e iOS via ambiente Expo compatível.
- Fluxo completo de telas navegável, inclusive erro e nenhum resultado.
- Dados fictícios não são apresentados como preços reais.
- Usuário consegue voltar ao histórico e repetir uma busca simulada.
- Sem dependência de serviços pagos para visualizar o protótipo.

## Primeira tarefa para Codex
1. Ler toda a documentação e propor plano de pastas, dependências e telas.
2. Identificar decisões em aberto e riscos.
3. Não gerar código antes da aprovação.
4. Depois de aprovado, criar primeiro o protótipo mobile navegável com mocks.
