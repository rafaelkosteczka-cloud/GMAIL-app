# PROMPT — Decisões de Produto: APP-Gmail / Gmail Redondo

> **Contexto:** O APP-Gmail já está funcional com OAuth, varredura, IA, aprovação e geração de XML. Agora precisamos finalizar a lógica de etiquetas/arquivamento e preparar a experiência de customização para o produto ser escalável.
>
> **Por favor, responda cada bloco abaixo. Pode ser direto — sim/não com justificativa curta ou escolha entre as opções.**

---

## BLOCO 1 — Política de Arquivamento (a dúvida do DEVEC)

### Contexto técnico
Hoje o sistema seta "Ignorar a caixa de entrada" = TRUE para **todas** as regras. O problema:

- **Filtro por remetente (from:)** → Quando o cliente responde, o email dele vem de OUTRO endereço, então **NÃO bate no filtro**. A resposta aparece na inbox. ✅ Seguro arquivar.
- **Filtro por assunto (subject:)** → Quando o cliente responde "Re: DEVEC...", o filtro **BATE** porque o assunto ainda contém "DEVEC". A resposta fica **oculta**. ⛔ Perigoso.

### Perguntas

**1.1** Concorda com a regra: "filtros por assunto NUNCA devem arquivar automaticamente, apenas etiquetar"?
- [ ] Sim, nunca arquivar por assunto
- [ ] Não, em alguns casos posso querer (quais?)
- [ ] Outro: ___

**1.2** Para filtros por remetente, qual o comportamento padrão?
- [ ] Sempre arquivar (rotina fica fora da inbox)
- [ ] Apenas etiquetar (tudo aparece na inbox, mas organizado)
- [ ] Depende do tipo de remetente (sistema vs. pessoa)

**1.3** O que fazer com emails de CLIENTES especificamente?
- [ ] Nunca arquivar, apenas etiquetar (mais seguro)
- [ ] Etiquetar + arquivar se for rotina conhecida
- [ ] Depende do cliente (lista customizável)

---

## BLOCO 2 — Customização na Planilha

### Contexto
Se isso vira produto, o cliente final precisa customizar sem editar código. Hoje a customização é feita editando diretamente as abas "Regras" e "Marcadores Manuais".

### Perguntas

**2.1** Quer uma aba "Configurações" dedicada na planilha com dropdowns editáveis?
- [ ] Sim, com políticas de arquivamento (o que arquivar / o que manter)
- [ ] Não, a aba "Regras" já serve para isso
- [ ] Sim, mas simplificada (quais campos?)

**2.2** Quer uma seção "Base de Clientes" onde o usuário lista domínios que NUNCA devem ser arquivados?
- [ ] Sim, na mesma aba Configurações
- [ ] Sim, em aba separada
- [ ] Não precisa — o usuário controla direto na aba Regras
- [ ] Já tenho uma lista de domínios em outro lugar (onde?)

**2.3** As abas atuais estão claras para um cliente final? O que renomear?
- [ ] Estão boas como estão
- [ ] Renomear (sugestões):
  - "Centro de treinamento" → ___
  - "BD Legado" → ___
  - "Marcadores Manuais" → ___
  - "Memória Sistema" → ___

---

## BLOCO 3 — Experiência do Usuário (UX)

### Contexto
A tela de boas-vindas (Welcome.html) e o console lateral (Console.html) já existem. A questão é como melhorá-los para o produto.

### Perguntas

**3.1** O Welcome.html deve mostrar informações sobre a política de arquivamento (from: vs subject:)?
- [ ] Sim, com diagrama visual e cenários (DEVEC, NF-e, Newsletter)
- [ ] Sim, mas resumido (2-3 frases)
- [ ] Não, isso fica só na aba Configurações

**3.2** O Console lateral deve ser reformulado com linguagem de produto?
- [ ] Sim agora (trocar RPD/RPM/TPM por "e-mails analisados" etc.)
- [ ] Depois (v2)
- [ ] Manter como está (técnico é ok para o público atual)

**3.3** Antes de gerar os XMLs, quer um "resumo de auditoria" mostrando as regras?
- [ ] Sim, um dialog HTML com contadores e alertas
- [ ] Sim, mas só um alert simples ("X regras por email, Y por assunto")
- [ ] Não, confia no que está na aba Regras

**3.4** O menu atual tem 10 itens. Quer adicionar novos?
- [ ] Sim, "Configurar política de inbox" (abre aba Configurações)
- [ ] Sim, "Auditar regras" (verifica problemas antes de exportar)
- [ ] Manter como está
- [ ] Outros: ___

---

## BLOCO 4 — Escopo de Entrega

### Perguntas

**4.1** O que entra na entrega AGORA?
- [ ] Só a correção da lógica (P1 — nunca arquivar por assunto)
- [ ] P1 + aba Configurações com políticas editáveis
- [ ] P1 + P2 + auditoria visual + Welcome atualizado (pacote completo)
- [ ] Outro: ___

**4.2** As regras que JÁ EXISTEM na planilha precisam ser corrigidas?
- [ ] Sim, auditar e corrigir automaticamente as que estão erradas
- [ ] Sim, mas mostrar um relatório antes de corrigir
- [ ] Não, só aplicar a lógica correta nas próximas regras geradas

**4.3** Precisa testar na planilha real antes de implementar?
- [ ] Sim, acesse a planilha pelo browser e me mostre o estado atual
- [ ] Não, pode implementar direto que eu testo depois
- [ ] Preciso ver um mockup/protótipo antes

---

## BLOCO 5 — Validação e Produto

### Perguntas

**5.1** A planilha atual (ID: `1C_NFuRciBI3sfGEZLqqMqui9nvEyqhhoVdiRZnczqOM`) é a planilha de produção ou de desenvolvimento?
- [ ] Produção (já está em uso)
- [ ] Desenvolvimento (posso mexer à vontade)
- [ ] Tenho as duas (qual é qual?)

**5.2** O `clasp push` já está configurado e funcionando?
- [ ] Sim, posso fazer push direto
- [ ] Preciso configurar
- [ ] Não uso clasp, edito direto no editor do Apps Script

**5.3** Para o produto vendável, qual é a prioridade?
- [ ] Primeiro: lógica de arquivamento perfeita
- [ ] Primeiro: experiência visual da planilha (configurações, Welcome)
- [ ] Primeiro: landing page e materiais de venda
- [ ] Tudo junto, mas com entregas incrementais

---

## Como responder

Pode responder direto neste documento marcando as opções com `[x]` ou escrever por extenso. Quando estiver pronto, me envie de volta que eu executo com base nas suas decisões.

> **Lembrete:** nenhum código foi alterado ainda. Tudo está exatamente como estava. Só vou mexer depois das suas respostas.
