# Onde Comprar? — Visão do produto

**Slogan:** Fotografou. Encontrou. Comparou.

## Problema
Pessoas veem um produto, mas não sabem seu nome exato nem onde encontrá-lo para comprar. A busca manual pode exigir identificar modelo, comparar ofertas e verificar lojas.

## Proposta
Aplicativo Android/iOS que permite fotografar ou selecionar imagem de um produto, confirmar a identificação e descobrir ofertas com links para compra. O usuário pode rever pesquisas e executar buscas novamente.

## Jornada principal
1. Abrir aplicativo e fotografar ou selecionar imagem.
2. Mostrar progresso real: analisando imagem, identificando produto, buscando ofertas, organizando resultados.
3. Se a identificação for incerta, pedir confirmação/correção.
4. Mostrar produto identificado e ofertas, distinguindo correspondências exatas de similares.
5. Ao concluir, exibir confirmação curta `Encontrou!` com som/háptica opcional e acessível.
6. Permitir reabrir uma pesquisa no histórico e atualizar as ofertas.

## MVP
- Captura por câmera e galeria.
- Identificação por modelo multimodal, com confirmação/correção pelo usuário.
- Busca de ofertas em fontes autorizadas (inicialmente mocks até confirmar integrações).
- Lista de resultados com fonte, preço, data da consulta e link externo.
- Filtros iniciais: ordenação por menor preço e opção online (se os dados permitirem).
- Histórico local ou autenticado, a decidir; pesquisar novamente deve atualizar preços.
- Estados de erro, carregamento, ausência de resultados e correspondência parcial.

## Fora do primeiro MVP
- Garantia de estoque físico em tempo real.
- Alertas de queda de preço, afiliados, anúncios, pagamentos no aplicativo, marketplace próprio.
- Busca geolocalizada de inventário sem integrações confiáveis.
- Lançamento internacional e registro definitivo da marca.

## Conceitos de UX
- Nome de trabalho: `Onde Comprar?`; slogan: `Fotografou. Encontrou. Comparou.`
- Histórico de pesquisas: nome funcional provisório `Histórico` ou `Pesquisar novamente` (não `Achei Depois`, que pertencia ao branding anterior).
- Confirmação: `Encontrou!` com áudio opcional, nunca obrigatório.
- Não simular progresso de processamento: estados devem refletir etapas reais.

## Privacidade
- Consentimento e informação clara sobre envio de imagens a terceiros de IA.
- Política de retenção e exclusão de imagens e histórico.
- Não exigir cadastro antes de demonstrar valor sem decisão explícita de produto.
