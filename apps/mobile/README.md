# Onde Comprar? — Fundação mobile

Etapa 1: Expo SDK 54, React Native, TypeScript estrito e Expo Router. Há três abas: Início, Histórico (vazio) e Preferências. Não há captura, busca, backend ou ofertas nesta etapa.

## Executar no Android com Expo Go

Requisito: Node 22.22.0 (arquivo `.nvmrc`). No PowerShell, a partir da raiz do repositório:

```powershell
nvm use 22.22.0
cd apps/mobile
npm ci
npm start
```

Instale no aparelho Android o Expo Go compatível com SDK 54, disponível em https://expo.dev/go?sdkVersion=54&platform=android&device=true. Conecte computador e celular à mesma rede Wi-Fi e escaneie o QR code no Expo Go. Se o Windows solicitar acesso à rede, permita apenas na rede privada de desenvolvimento. Não é necessário Android Studio para um aparelho físico.

Se a conexão falhar, confira a rede, VPN e firewall. `npm start -- --localhost` serve para emulador com encaminhamento apropriado, não para outro aparelho na rede. Não é necessário criar conta, fazer deploy ou contratar serviço.

O SDK foi fixado explicitamente para reprodutibilidade e compatibilidade com o Expo Go correspondente. Um Expo Go de outra versão pode exigir a versão indicada acima. O iOS exige aparelho/ambiente compatível; o simulador iOS não executa no Windows.

## Verificações

```powershell
npm run typecheck
npm run lint
npm test
npm run export:check
```

A exportação compila os bundles Android/iOS localmente, sem publicar e sem gerar APK/IPA. Não substitui teste no aparelho.

Teste manual: abra cada aba, altere som e feedback tátil, encerre e reabra o aplicativo e confirme a persistência. Nenhum som ou vibração deve acontecer. Confira fonte ampliada e navegação com TalkBack. O Histórico deve continuar vazio e a tela inicial não deve iniciar buscas.

## Organização

- `src/app`: rotas e layouts, sem regras de negócio.
- `src/features`: telas por funcionalidade, preferências e política de conclusão.
- `src/components`: componentes visuais compartilhados.
- `src/theme`: paleta verde escuro `#102B25`, verde claro `#7CE4AE` e neutros.
- `src/config/brand.json`: nome e slogan; o nome nativo também usa essa configuração, e `brand.ts` a exporta para as telas.
- `src/domain/contracts.ts`: interfaces para futuros adaptadores.
- `src/adapters/mock`: limite reservado para a Etapa 2, ainda sem execução.
- `assets/sounds`: áudio fornecido, preservado sem reprodução.

As preferências começam com som e háptica desativados. Apenas essas preferências são persistidas. A política de conclusão permite efeitos somente no sucesso. A animação “Encontrou!”, a reprodução de áudio e a háptica ainda não estão implementadas; seu texto e duração estão preparados em `completion.ts`. Nenhuma biblioteca de áudio ou acesso ao hardware foi adicionada.

Não colocar segredos em variáveis `EXPO_PUBLIC_*`: elas são incorporadas no aplicativo. Não há configuração de servidor necessária nesta etapa.

## Etapa 1.1 — Refinamento visual

O Início apresenta a marca e uma composição de fotografia/produto, com espaços para câmera e galeria explicitamente indisponíveis. Histórico permanece vazio. Preferências mantém persistência local e começa com os dois controles desativados em uma instalação sem dados salvos.

Para abrir no navegador: `npm start -- --web`. Para compilar sem publicar: `npm run export:web`.

Os testes de layout usam Playwright apenas no desenvolvimento, com Google Chrome instalado:

```powershell
npm run test:web
```

O comando inicia ou reutiliza o Expo em `http://localhost:8091` e verifica as viewports 393 × 852 e 360 × 800. Os testes usam um contexto isolado, sem acessar seu perfil pessoal do Chrome. Capturas ficam em `artifacts/` (ignorado pelo Git).

Para inspecionar viewport, ancestrais, overflow e dimensões dos rótulos, com o servidor nessa porta: `npm run inspect:layout -- current`. O relatório JSON e capturas também ficam em `artifacts/`.

A barra usa altura automática e tamanho mínimo calculado a partir do ícone, linha do rótulo, escala da fonte e insets. As telas rolam dentro do espaço reservado pelo navegador; a barra não usa posicionamento absoluto. A emulação no Chrome não substitui testes em Safari/iPhone e aparelhos Android com áreas seguras reais.

Detalhes da investigação, resultados e arquivos envolvidos: `VALIDATION_1_1.md`.

A composição revisada do Início usa um cabeçalho de largura total com marca centralizada e descrição em linha única ajustada ao espaço disponível. A área funcional clara mantém ilustração menor e botões desabilitados. As capturas atuais são `artifacts/home-brand-393x852.png` e `artifacts/home-brand-360x800.png`, geradas por `npm run test:web`. Esta revisão aguarda avaliação visual antes de encerrar a Etapa 1.1.
