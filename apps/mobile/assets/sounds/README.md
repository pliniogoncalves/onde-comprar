# Som de conclusão (reservado)

Na Etapa 2.1, a duração foi medida por decodificação local: 0,8 s. O primeiro sinal acima de -50 dBFS ocorre perto de 8 ms. O player é preparado antecipadamente e a tentativa de play coincide com o marco visual da confirmação exclusiva. O período padrão de 1,8 s após o marco comporta o arquivo atual; durações maiores usam margem limitada, sem aguardar áudio indefinidamente. Consulte `../../VALIDATION_2_1.md` para medições e limitações.

`sucesso.mp3` foi fornecido pelo usuário e é preservado sem edição. Sua reprodução foi autorizada na Etapa 2 exclusivamente para testes internos do MVP, sem distribuição comercial nesta fase.

O arquivo fornecido é reproduzido como está, sem novo recorte. A referência original era um efeito de aproximadamente 0,8 segundo. A política em `src/features/search/completion/` permite uma única tentativa de som por conclusão bem-sucedida com ofertas e preferência habilitada. Som começa desativado; háptica não é executada nesta etapa.

A animação respeita movimento reduzido. O identificador de conclusão é consumido antes da tentativa de reprodução; bloqueio de autoplay, retorno à tela ou mudança de preferência não repetem o som. A confirmação visual independe da reprodução. Android/iOS usam expo-audio ~1.1.1; Web usa HTMLAudioElement com rejeição de play() tratada, pois o player web dessa versão do SDK descarta a Promise. Não há uso de microfone, áudio em segundo plano ou hardware háptico.
