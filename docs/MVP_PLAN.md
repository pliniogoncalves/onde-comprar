# Plano incremental de MVP

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
