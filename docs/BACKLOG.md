# Backlog de produto — Onde Comprar?

Decisões registradas em 12/11/2026. Este arquivo organiza trabalho previsto, sem autorizar implementação, alterar a jornada da Etapa 2 ou definir novas datas de entrega.

## Etapa 2 — escopo existente, em revisão

| ID | Item | Critérios e limites |
|---|---|---|
| DEMO-01 | Confirmar/corrigir nome, marca e modelo | Manter a correção textual dentro da jornada iniciada pela imagem de exemplo. Validar nome obrigatório e consultar os mocks com os dados confirmados. Não criar entrada independente por texto. |

A Etapa 2 permanece com imagem de exemplo e ofertas fictícias, sessão em memória e preferências locais. Nenhum dos itens abaixo entra nessa etapa.

## MVP planejado — implementação futura mediante aprovação

| ID | Item | Critérios de aceite previstos |
|---|---|---|
| MVP-01 | Busca por fotografia como função principal | Abrir o app e acessar a captura sem cadastro/login. Solicitar permissões necessárias à ação, tratar negação e cancelamento e encaminhar a imagem à jornada de identificação/confirmação e ofertas. A referência ao Shazam é de interação direta, sem garantia de reconhecimento. |
| MVP-02 | Seleção de imagem da galeria | Oferecer entrada por imagem da galeria sem autenticação, com tratamento de permissões e cancelamento, reutilizando a jornada de identificação e ofertas. |
| MVP-03 | Histórico local sem autenticação | Rever pesquisas no aparelho e executar nova consulta para atualizar as ofertas, sem apresentar preços antigos como atuais. Permitir exclusão local. Não exigir conta nem sincronização remota. |

O armazenamento ou retenção de fotos no histórico ainda precisa de definição explícita; histórico local não implica salvar automaticamente todas as imagens. As integrações reais continuam sujeitas a acesso autorizado às fontes, privacidade e controle de custo.

## Possibilidades futuras — secundárias e opcionais

| ID | Item | Critérios e dependências |
|---|---|---|
| FUT-01 | Busca independente por texto | Funcionalidade secundária, sem substituir o destaque de fotografia/galeria. Reutilizar a orquestração de consulta de ofertas e adaptadores existentes. Diferenciar essa entrada da correção textual da Etapa 2. |
| FUT-02 | Login/conta opcional | Adotar somente após aprovação de valor e escopo. Não bloquear captura, galeria, ofertas ou histórico local para quem não tem conta. Provedor de autenticação ainda não definido. |
| FUT-03 | Sincronização entre dispositivos | Capacidade opcional de conta, dependente de aprovação de persistência remota, privacidade, exclusão e regras de sincronização. Preservar o uso local sem login. |

## Restrições de execução

- Não implementar itens novos nem alterar a jornada aprovada sem autorização.
- Planejar cada etapa em branch própria, preservando `main` como referência estável.
- Não realizar commit, push, abertura de PR ou merge como consequência automática deste registro. Seguir as autorizações do usuário para cada ação.
- Não avançar para a Etapa 3 sem autorização.
