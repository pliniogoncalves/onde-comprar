# Onde Comprar? — Protótipo mobile

React Native + Expo SDK 54 + TypeScript estrito + Expo Router. A identidade visual da Etapa 1.1 está aprovada no ambiente web. A Etapa 2 implementa a jornada demonstrativa com dados e imagem locais, sem backend, IA, marketplaces, câmera/galeria ou histórico persistente.

## Executar

Node 22.22.0 via nvm. A partir da raiz:

```powershell
nvm use 22.22.0
cd apps/mobile
npm ci
npm start
```

Android físico: use Expo Go compatível com SDK 54 em https://expo.dev/go?sdkVersion=54&platform=android&device=true. Computador e celular devem estar na mesma rede Wi-Fi. Escaneie o QR code no Expo Go. Não requer Android Studio ou serviço pago. Para Web: `npm start -- --web`.

A versão do Expo Go precisa corresponder ao SDK. O simulador iOS não executa no Windows; a execução e o áudio nativos exigem validação em dispositivos compatíveis. `expo-audio` está incluído no SDK/Expo Go correspondente. Não são solicitadas permissões de câmera ou microfone.

## Experimentar a jornada

1. No Início, escolha o cenário em **Cenário da demonstração** e toque em **Experimentar demonstração**.
2. Revise a imagem local e inicie a identificação simulada.
3. Confirme ou edite o produto: **Fone de ouvido / Aurora / A1** é o exemplo com ofertas. Nome é obrigatório; dados incompatíveis levam a nenhum resultado.
4. Após a consulta mock, veja “Encontrou!” e abra as ofertas fictícias, agrupadas em exatas e semelhantes.
5. Consulte os detalhes. Não há link comercial, estoque ou preço real.

Os cenários Sem resultados, Erro na busca e Identificação inconclusiva ficam disponíveis no mesmo seletor. O inconclusivo permite preenchimento manual. Operações de processamento são simuladas e canceláveis. A sessão não persiste: recarregar a página ou abrir diretamente uma rota da jornada sem sessão oferece reinício. Trocar de aba mantém a sessão em memória; uma busca em andamento pode terminar em segundo plano, mas som/animação só são iniciados com a conclusão em foco. Cancelar ou iniciar outra demonstração invalida respostas pendentes.

Durante o processamento, o card verde escuro apresenta spinner e sequência das operações com estados pendente, em andamento, concluída e erro. As mudanças seguem a execução dos adaptadores locais, sem percentuais. Movimento reduzido substitui spinners por ícones estáticos. A tela de erro indica qual operação falhou.

## Som e acessibilidade

Som começa desativado. Habilite **Som ao encontrar** em Preferências e conclua o cenário com ofertas. Uma única tentativa de reprodução é feita por conclusão, junto da animação. Não toca em erro, vazio, cancelamento ou identificação inconclusiva, nem ao reabrir a mesma conclusão. Desabilitar a preferência interrompe reprodução em andamento.

O arquivo fornecido `assets/sounds/sucesso.mp3` é usado sem edição, exclusivamente nos testes internos autorizados. Autoplay pode ser bloqueado pelo navegador, pela configuração de áudio ou pelo estado de carregamento: a conclusão visual continua normalmente, sem retentar a mesma conclusão. Android/iOS usam expo-audio; Web usa HTMLAudioElement com rejeição tratada. Não há háptica, mesmo que sua preferência esteja habilitada. Movimento reduzido desativa a animação, preservando mensagem e controles.

## Verificações

```powershell
npm run typecheck
npm run lint
npm test
npm run test:web
npm run export:web
npm run export:check
```

Playwright usa Google Chrome instalado e um perfil isolado. Inicia ou reutiliza Expo em `http://localhost:8091`. Verifica 393 × 852 e 360 × 800 CSS px. Capturas ficam em `artifacts/`, ignorado pelo Git. A compilação apenas gera bundles locais: não publica nem produz APK/IPA. Para inspecionar dimensões e ancestrais com o servidor na porta 8091: `npm run inspect:layout -- current`.

Testes manuais adicionais: TalkBack/VoiceOver, fonte ampliada, áudio ligado/desligado, movimento reduzido, cancelamento e navegação em aparelhos físicos. Testes automatizados de Web não substituem áudio e safe areas de Android/iOS reais. Falhas de carregamento de áudio não bloqueiam ofertas.

## Organização

- `src/app`: pilha da jornada dentro da aba Início; Histórico e Preferências preservados.
- `src/features/search`: sessão, processamento, composição de telas e conclusão.
- `src/features/recognition` e `offers`: formulário e apresentação de ofertas.
- `src/domain/contracts.ts`: interfaces de adaptadores.
- `src/adapters/mock` e `src/fixtures`: comportamento e dados demonstrativos.
- `assets/demo`: ilustração própria gerada localmente por `npm run demo:image`.
- `src/components`, `src/theme` e `src/config/brand.json`: componentes, identidade visual e marca configurável.

Somente preferências são persistidas. Não colocar segredos em `EXPO_PUBLIC_*`, pois são públicos no app. Histórico continua vazio. Esta etapa não inclui integrações externas.

Registros: `VALIDATION.md` (Etapa 1), `VALIDATION_1_1.md` e `VALIDATION_2.md`. Desenvolvimento na branch `feature/etapa-2-jornada-demonstrativa`; commit, push e merge dependem de autorização explícita. A Etapa 3 não está autorizada.
