# Onde Comprar? — Visão do produto

**Slogan:** Fotografou. Encontrou. Comparou.

## Problema
Pessoas veem um produto, mas não sabem seu nome exato nem onde encontrá-lo para comprar. A busca manual pode exigir identificar modelo, comparar ofertas e verificar lojas.

## Proposta
Aplicativo Android/iOS que permite fotografar ou selecionar imagem de um produto, confirmar a identificação e descobrir ofertas com links para compra. O usuário pode rever pesquisas e executar buscas novamente.

## Decisões de produto — 12/11/2026

- A experiência principal segue a referência de interação do Shazam: abrir o aplicativo, conceder as permissões necessárias, fotografar um produto e descobrir onde comprá-lo, sem login ou cadastro obrigatório. A referência é de simplicidade e acesso direto à função principal, sem promessa de identificação garantida.
- A busca por fotografia é a funcionalidade principal, acompanhada da seleção de imagens da galeria. Solicitar apenas permissões necessárias à ação escolhida.
- A correção textual de nome, marca e modelo integra a confirmação do produto e permanece no escopo da Etapa 2. Ela não representa uma busca independente por texto.
- Uma busca independente por texto é uma possibilidade futura e secundária, reutilizando o mecanismo de consulta de ofertas.
- O histórico será local, sem exigir autenticação. Login e sincronização entre dispositivos são possibilidades futuras e opcionais, sem se tornarem requisitos para fotografar, selecionar imagens, consultar ofertas ou usar o histórico local.

Estas decisões orientam o produto futuro e não ampliam a Etapa 2: ela continua demonstrativa, com imagem local e dados fictícios, sem câmera, galeria, histórico persistente ou autenticação. Itens previstos e critérios estão em [BACKLOG.md](BACKLOG.md).

## Jornada principal
1. Abrir aplicativo, conceder as permissões necessárias à ação escolhida e fotografar ou selecionar imagem, sem login ou cadastro obrigatório.
2. Mostrar progresso real: analisando imagem, identificando produto, buscando ofertas, organizando resultados.
3. Se a identificação for incerta, pedir confirmação/correção.
4. Após confirmar o produto, consultar ofertas e distinguir correspondências exatas de similares.
5. Se houver ofertas válidas, apresentar `Encontrou!` em confirmação exclusiva e depois abrir os resultados. O som é opcional; háptica continua futura.
6. Permitir reabrir uma pesquisa no histórico e atualizar as ofertas.

## MVP
- Captura por câmera e galeria.
- Identificação por modelo multimodal, com confirmação/correção pelo usuário.
- Busca de ofertas em fontes autorizadas (inicialmente mocks até confirmar integrações).
- Lista de resultados com fonte, preço, data da consulta e link externo.
- Filtros iniciais: ordenação por menor preço e opção online (se os dados permitirem).
- Histórico local sem autenticação; pesquisar novamente deve atualizar preços.
- Estados de erro, carregamento, ausência de resultados e correspondência parcial.

## Fora do primeiro MVP
- Garantia de estoque físico em tempo real.
- Alertas de queda de preço, afiliados, anúncios, pagamentos no aplicativo, marketplace próprio.
- Busca geolocalizada de inventário sem integrações confiáveis.
- Lançamento internacional e registro definitivo da marca.
- Busca independente por texto, como funcionalidade secundária futura.
- Login e sincronização entre dispositivos, como funcionalidades opcionais futuras.

## Conceitos de UX
- Nome de trabalho: `Onde Comprar?`; slogan: `Fotografou. Encontrou. Comparou.`
- Histórico de pesquisas: nome funcional provisório `Histórico` ou `Pesquisar novamente` (não `Achei Depois`, que pertencia ao branding anterior).
- Confirmação: `Encontrou!` com áudio opcional, nunca obrigatório.
- Não simular progresso de processamento: estados devem refletir etapas reais.
- Na jornada demonstrativa, tempos configuráveis pertencem exclusivamente às operações mock, explicitamente simuladas. Não aplicar esses atrasos ao processamento real futuro. A experiência da Etapa 2.1 foi aprovada pelo usuário, mantendo a confirmação de aproximadamente 1,8 s; a integração na main aguarda revisão final do Pull Request.

## Privacidade
- Consentimento e informação clara sobre envio de imagens a terceiros de IA.
- Política de retenção e exclusão de imagens e histórico.
- Não exigir login ou cadastro para a jornada principal nem para o histórico local. Eventual autenticação será opcional para funcionalidades futuras de conta e sincronização.
