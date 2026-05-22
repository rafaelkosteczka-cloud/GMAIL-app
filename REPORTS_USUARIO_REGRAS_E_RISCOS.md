# Reports do Usuario - Regras, Arquivamento e Riscos de UX

> Documento de apoio para produto, UX e apresentacao do APP-Gmail.
>
> Atualizado em: 2026-05-12

---

## Objetivo

Consolidar os relatos reais de uso para orientar:

- a politica de arquivamento
- os criterios da planilha
- a logica de regras
- os limites do Gmail nativo
- as hipoteses que precisam ser testadas antes de transformar isso em produto

---

## Resumo executivo

O problema principal nao e "criar etiquetas".

O problema principal e:

- aplicar a etiqueta certa com o criterio certo
- sem esconder respostas importantes da caixa de entrada
- e sem transformar a inbox em um lugar caotico de novo

Frase-guia do produto:

`Assunto organiza. Remetente automatiza. Cliente permanece visivel.`

---

## Base teorica enxuta

### 1. Inbox Zero

A ideia de `Inbox Zero`, popularizada por Merlin Mann, nao e sobre "deixar a caixa bonita".
Ela parte do principio de que a inbox deve ser um lugar de processamento e decisao, nao de armazenamento caotico.

Leitura util para o produto:

- inbox e zona de triagem
- etiqueta e arquivo entram depois da decisao
- se a automacao esconde a mensagem antes da triagem, ela rompe a logica do metodo

### 2. GTD - Capture, Clarify, Organize

Na linha do GTD, o trabalho com email faz mais sentido quando segue uma sequencia:

- capturar
- esclarecer o que aquilo significa
- organizar no lugar certo

Leitura util para o produto:

- o email sozinho nao diz o que fazer
- a pessoa precisa decidir se aquilo e acao, referencia, espera ou rotina
- so depois vale automatizar parte desse fluxo

### 3. Email overload

A literatura sobre `email overload` reforca que o problema nao e apenas o volume de mensagens.
Tambem pesa a falta de criterio compartilhado sobre o que e critico, o que pode esperar e o que deveria ser tratado automaticamente.

Leitura util para o produto:

- regras claras reduzem sobrecarga
- classificacao ruim gera interrupcao, perda de contexto e stress
- automacao sem politica explicita tende a ampliar o problema em vez de resolver

### Sintese para usar na apresentacao

`Processar antes de esconder. Automatizar depois de entender.`

---

## Reports reais do usuario

### 1. Etiqueta por nome do cliente estava arquivando coisa demais

**Relato**

- A etiqueta estava pelo nome do cliente e marcada para arquivar.
- Varios assuntos com o nome do cliente iam direto para essa etiqueta.
- Exemplo: email de cotacao MCP sem etiqueta especifica apareceu como se fosse do cliente e nao voltou para a inbox.

**Problema**

- O criterio ficou amplo demais.
- O nome do cliente virou um "guarda-chuva" que engoliu assuntos diferentes.

**Risco de UX**

- O usuario perde o contexto do que exige acao.
- O sistema parece "inteligente", mas esconde trabalho relevante.

**Decisao recomendada**

- Nao usar nome de cliente como criterio amplo com arquivamento automatico.
- Quando houver cliente humano, priorizar visibilidade.
- Separar:
  - criterio por cliente
  - criterio por assunto operacional
  - criterio por automacao

---

### 2. Etiqueta por assunto pode esconder resposta do cliente

**Relato**

- Quando existe regra por assunto e alguem responde no mesmo thread, a conversa pode nao voltar para a caixa de entrada.

**Problema**

- O assunto da resposta normalmente herda o tema original.
- Se o filtro continua batendo no mesmo assunto, a nova mensagem tambem pode ser arquivada.

**Risco de UX**

- Mensagem importante fica invisivel.
- O usuario perde confianca no sistema.

**Decisao recomendada**

- Regra por assunto nao deve arquivar por padrao.
- Regra por assunto deve ser usada para:
  - etiquetar
  - destacar
  - priorizar
- Em V1, assunto deve ser considerado criterio de classificacao, nao de ocultacao.

---

### 3. Nem toda rotina deve ser arquivada

**Relato**

- Algumas rotinas podem ser arquivadas.
- Outras nao.

**Problema**

- "Rotina" nao e uma categoria unica.
- Existem rotinas silenciosas e rotinas que geram resposta, tratativa ou excecao.

**Risco de UX**

- Se o produto prometer "rotina = arquiva", ele vai falhar nos casos cinzentos.

**Decisao recomendada**

- Separar rotina em subtipos:
  - rotina automatica silenciosa
  - rotina operacional com possivel resposta
  - rotina sensivel com acompanhamento humano

**Exemplo pratico**

- Nota automatica de sistema: pode arquivar.
- Solicitacao recorrente com chance de resposta humana: melhor manter visivel.

---

### 4. Usuario precisa entender as implicacoes do criterio escolhido

**Relato**

- Se quiser criar etiqueta por assunto, o usuario precisa saber o que isso implica.
- Se alguem responder, ele quer entender antes o impacto dessa decisao.

**Problema**

- Hoje a regra tecnica existe, mas a implicacao nao fica explicita para o usuario final.

**Risco de UX**

- O usuario acha que esta so "organizando", mas na pratica esta mudando a visibilidade da conversa.

**Decisao recomendada**

- A planilha e a apresentacao precisam mostrar uma matriz simples:
  - criterio
  - quando usar
  - risco
  - pode arquivar?
  - implicacao se houver resposta

---

### 5. Caso de NF recebimento: pode ser automatico, mas e se houver resposta?

**Relato**

- NF recebimento parece um bom caso de automacao.
- Mas se o cliente responder, a logica por remetente pode nao ser suficiente.

**Problema**

- O fluxo pode comecar automatico e virar conversa humana.
- Um criterio que era seguro no inicio pode deixar de ser seguro depois.

**Risco de UX**

- O sistema trata o thread como "rotina silenciosa" quando ele ja virou "conversa ativa".

**Hipotese de produto**

- Precisamos diferenciar:
  - email inicial automatizavel
  - thread que virou interacao humana

**Direcao recomendada**

- Para V1, tratar esse caso como excecao importante e nao confiar apenas na regra fixa.
- Criar algum mecanismo de revisao para threads que ganharam resposta.

---

### 6. Ideia de usar o numero de mensagens no thread como sinal de resposta

**Relato**

- O usuario percebeu o numero ao lado do assunto na conversa, como `2` ou `3`.
- Isso poderia indicar resposta e ajudar a evitar sumico.

**Interpretacao**

- O numero da interface representa a quantidade de mensagens na conversa.
- Se for maior que `1`, houve continuidade no thread.

**Valor da ideia**

- E um excelente sinal de "isso deixou de ser email isolado e virou conversa".

**Pergunta central**

- Esse sinal pode ser usado nativamente pelo Gmail para filtro?

**Resposta curta**

- Nativamente no Gmail, nao encontramos operador oficial de filtro por quantidade de respostas ou tamanho da conversa.
- Ou seja: e uma boa heuristica de produto, mas nao parece ser um criterio nativo de filtro/importacao de XML.

---

### 7. Se a conversa tiver 2 ou 3 mensagens, ela ficaria presa para sempre na inbox?

**Relato**

- Se a logica considerar `> 1` como sinal de resposta, o usuario teme que a conversa volte sempre para a caixa de entrada e nunca mais saia.

**Problema**

- Uma regra simples demais pode resolver o sumico, mas piorar a sobrecarga visual.

**Risco de UX**

- O sistema troca um problema por outro:
  - antes escondia demais
  - depois reaparece demais

**Hipotese correta**

- O gatilho nao deveria ser "thread tem mais de 1 mensagem".
- O gatilho deveria ser algo mais proximo de:
  - "houve nova mensagem relevante depois do ultimo tratamento"

**Conclusao de produto**

- Contagem do thread sozinha e sinal fraco.
- Ela ajuda na auditoria e no alerta.
- Sozinha nao resolve a regra final de inbox.

---

## Criterios e implicacoes

### Leitura mais madura

Agora a matriz precisa separar duas coisas:

- criterio de contexto: ajuda a classificar e etiquetar
- criterio de automacao restrita: decide quando pode arquivar com mais seguranca

### Matriz atualizada

| Criterio | Quando usar | Pode arquivar? | Implicacao se houver resposta | Recomendacao |
| --- | --- | --- | --- | --- |
| Assunto | Padroes recorrentes de operacao | Nao por padrao | A resposta pode herdar o mesmo assunto e continuar oculta | Etiquetar e destacar |
| Remetente | Sistemas, fornecedores previsiveis, automacoes | Sim, se for rotina silenciosa | Se a resposta vier de outro endereco, a regra pode nao pegar | Bom para automacao |
| Dominio | Empresas, bancos, grupos de remetentes | Depende | Pode misturar cliente humano com automacao | Usar junto com classificacao de tipo |
| hasTheWord de cliente | Relacionar email ao cliente, UC, numero, historico e contexto | Nao por padrao | E amplo demais e pode puxar assuntos diferentes para a mesma etiqueta | Usar para etiquetar e salvar contexto |
| Cliente humano | Atendimento, comercial, tratativa | Nao | Esconder isso gera perda real | Manter visivel |
| Rotina automatica | Alertas, recibos, comprovantes, monitoramento | Sim | Baixo risco se nao houver conversa humana | Pode arquivar |
| Rotina operacional | Casos repetitivos que podem gerar resposta | Depende | Pode virar thread vivo | Exige mais cuidado |
| Regra combinada `from + subject` | Quando existe um emissor previsivel e um assunto operacional estavel | Sim, e o melhor caso de automacao segura | Se alguem responder com outro remetente, a resposta tende a voltar para a inbox | Ideal para `etiquetar + arquivar` sem esconder a tratativa humana |
| Regra combinada `hasTheWord + from` | Quando o cliente precisa manter contexto, mas o arquivamento deve valer so para um emissor especifico | Sim, em casos selecionados | O contexto continua salvo, mas o arquivo so acontece quando o remetente confirma a natureza da rotina | Boa ponte entre memoria do cliente e automacao segura |

---

## Hipoteses de produto para testar

### Hipotese 1

**Se a regra for so por assunto, ela nao deve arquivar automaticamente.**

Motivo:

- protege contra resposta no mesmo thread
- reduz perda de assunto importante

---

### Hipotese 2

**Cliente humano deve ser uma categoria protegida.**

Motivo:

- cliente pede visibilidade
- a inbox precisa continuar sendo lugar de decisao

---

### Hipotese 3

**A planilha precisa explicitar o risco do criterio, nao so a regra.**

Motivo:

- o usuario nao deve decidir "cego"
- a experiencia melhora quando cada criterio mostra sua implicacao

---

### Hipotese 4

**Contagem de mensagens na conversa pode virar um alerta, mas nao deve ser a regra principal de arquivamento.**

Motivo:

- bom para detectar conversa ativa
- fraco para decidir sozinho o destino final da thread

---

### Hipotese 5

**A melhor automacao para rotina sensivel tende a estar em regras combinadas, principalmente `from + subject`.**

Motivo:

- reduz falso positivo
- protege contra arquivamento amplo demais
- permite arquivar o envio operacional sem esconder a resposta humana

---

## Bateria inicial de testes

### Teste 1 - `from + subject` para rotina operacional

**Exemplo**

- `from:operacao@sionenergia.com.br`
- `subject:DEVEC`

**Acao sugerida**

- etiquetar
- arquivar

**O que validar**

- o envio de rotina sai da inbox
- a etiqueta correta permanece no thread
- se alguem responder com outro remetente, a resposta reaparece na inbox

**Prioridade**

- alta

---

### Teste 2 - `hasTheWord` de cliente como memoria, sem arquivamento

**Exemplo**

- email do cliente
- UC
- CNPJ
- numero operacional

**Acao sugerida**

- somente etiquetar

**O que validar**

- o contexto fica salvo na etiqueta do cliente
- assuntos diferentes nao deixam de aparecer na inbox
- o usuario consegue localizar historico sem perder visibilidade

**Prioridade**

- alta

---

### Teste 3 - `hasTheWord + from` para rotina fiscal do cliente

**Exemplo**

- `hasTheWord:Cliente XPTO`
- `from:nfe@cliente.com.br`

**Acao sugerida**

- etiquetar
- arquivar apenas o fluxo operacional daquele emissor

**O que validar**

- a regra nao captura conversa humana ampla demais
- apenas os emails realmente operacionais sao arquivados
- o contexto continua salvo na etiqueta do cliente

**Prioridade**

- media-alta

---

### Teste 4 - `subject` puro apenas para organizacao

**Exemplo**

- `subject:DEVEC`
- `subject:MCP`
- `subject:NF recebimento`

**Acao sugerida**

- etiquetar
- destacar visualmente
- nao arquivar em V1

**O que validar**

- a regra ajuda a agrupar a rotina
- a resposta continua visivel
- o usuario entende a implicacao do criterio

**Prioridade**

- alta

---

## O que o Gmail faz nativamente vs o que exigiria Apps Script

### O que o Gmail nativo faz bem

- filtrar por `from:`
- filtrar por `subject:`
- aplicar etiqueta
- arquivar
- marcar como lido
- encaminhar
- importar filtros por XML

### O que o Gmail nativo nao parece oferecer como criterio oficial

- filtrar por quantidade de respostas na conversa
- filtrar por "thread com 2 ou 3 mensagens"
- tratar de forma diferente a conversa so porque ela ficou maior

### O que daria para explorar via Apps Script

- ler a quantidade de mensagens de um thread
- sinalizar thread com conversa ativa
- gerar auditoria de risco antes da exportacao
- marcar certos casos como "nao arquivar"
- criar uma logica de revisao assistida antes de consolidar regra

### Limitacao importante

Mesmo que o Apps Script identifique melhor os casos, o filtro importado no Gmail continua obedecendo criterios nativos.  
Ou seja:

- auditoria inteligente via script: sim
- filtro nativo por contagem de respostas: nao parece disponivel

---

## Diagnostico do XML atual de filtros

Arquivo analisado:

- `C:\Users\sione\Downloads\mailFilters (6).xml`

Data da leitura:

- `2026-05-12`

### Resumo numerico

- Total de filtros: `268`
- Filtros com `shouldArchive=true`: `267`
- Filtros sem arquivamento explicito: `1`
- Filtros com criterio unico `from`: `18`
- Filtros com criterio unico `subject`: `23`
- Filtros com criterio unico `hasTheWord`: `226`
- Filtros com criterio unico `to`: `1`
- Filtros combinando `from + subject` ou outros criterios no mesmo `entry`: `0`

### Leitura de produto

O XML atual mostra um padrao muito importante:

- quase tudo arquiva
- quase nada combina criterios
- a maior parte dos clientes esta em `hasTheWord`

### Por que isso e sensivel

`hasTheWord` e um criterio mais amplo do que `from`.

Na pratica, ele pode capturar:

- email
- dominio
- numero
- texto presente na mensagem
- outros elementos da busca livre

Isso explica bem o report do usuario:

- regras de cliente podem estar "largas demais"
- um assunto ou contexto relacionado pode cair na etiqueta do cliente
- como o filtro tambem arquiva, o email some da visao principal

### Conclusao tecnica

Hoje o problema nao parece ser falta de filtro.  
O problema parece ser:

- filtro amplo demais
- com arquivamento quase sempre ligado
- e sem combinacao defensiva de criterios

### Direcao recomendada

- reduzir dependencia de `hasTheWord` para clientes
- usar combinacao de criterio quando fizer sentido
- nao arquivar cliente humano por padrao
- bloquear arquivamento por assunto em V1

---

## Politica V1 recomendada

### Segura

- assunto: etiqueta, mas nao arquiva
- cliente humano: etiqueta, mas nao arquiva
- rotina automatica clara: etiqueta + arquiva
- `hasTheWord` de cliente: etiqueta e contexto, sem arquivamento por padrao
- `from + subject` operacional: forte candidato a `etiquetar + arquivar`

### Cautelosa

- base interna: separar humano de automatizado
- dominio corporativo: nao assumir que todo dominio pode arquivar

### Evolucao futura

- criar auditoria de risco
- criar score de confianca da regra
- estudar sinal de thread ativo como ajuda para revisao

---

## Perguntas abertas para o produto

1. Como distinguir "rotina silenciosa" de "rotina com chance de resposta" sem complicar a planilha?
2. Vale ter uma aba de "contatos protegidos" que nunca podem ser arquivados?
3. Vale ter um campo simples na planilha:
   - `se responder, manter visivel`
4. A regra por assunto deve ser bloqueada para arquivamento ou apenas alertada?
5. O sistema deve auditar regras antigas e sinalizar riscos antes de gerar XML?

---

## Fontes tecnicas consultadas

Consultado em `2026-05-12`.

- Gmail Help - operadores de busca do Gmail: https://support.google.com/mail/answer/7190?hl=en
- Gmail Help - criacao de filtros: https://support.google.com/mail/answer/6579?hl=en-EN
- Gmail Help - conversation view: https://support.google.com/mail/answer/5900?co=GENIE.Platform%3DDesktop&hl=en

### Leitura tecnica consolidada

- O Google informa que uma resposta so sera filtrada novamente se ela atender ao mesmo criterio de busca do filtro.
- A lista oficial de operadores apresentada pelo Gmail nao mostra operador para quantidade de respostas ou tamanho da conversa.
- O Gmail agrupa respostas em conversas e uma conversa se separa quando o assunto muda ou quando passa de 100 emails.

---

## Frase final para usar no material

`O APP-Gmail nao deve apenas organizar. Ele precisa organizar sem esconder o que importa.`
