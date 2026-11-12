# Instruções para Codex — Onde Comprar?

Leia `docs/PRODUCT.md`, `docs/ARCHITECTURE.md` e `docs/MVP_PLAN.md` antes de propor alterações.

## Regras
- Responder em português brasileiro; código e nomes técnicos podem usar inglês.
- Primeiro apresentar plano incremental e critérios de aceite; só implementar após aprovação do usuário.
- Não presumir APIs de catálogo, preços ou estoque disponíveis. Usar adaptadores e mocks até comprovar acesso a fontes reais e suas condições de uso.
- Não fazer scraping sem análise de termos de uso, limites e conformidade.
- Separar resultado exato de produto semelhante; não inventar preço, estoque ou disponibilidade.
- Manter nome e identidade visual configuráveis: `Onde Comprar?` é nome de trabalho, ainda sem validação jurídica definitiva.
- Priorizar simplicidade, testes, acessibilidade, privacidade e custo baixo para MVP.
- Nunca commitar chaves, tokens ou dados pessoais. Usar `.env.example`.
- Não criar microsserviços no MVP. Preferir monólito modular.
- Não executar deploy, criar serviços pagos ou publicar em lojas sem autorização explícita.
- Antes de editar, verificar estado do Git; após cada etapa, explicar arquivos alterados e como testar.
