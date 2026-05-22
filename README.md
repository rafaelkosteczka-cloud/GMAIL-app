# APP-Gmail

**Tipo:** Google Apps Script + Google Sheets + Gmail API  
**Status:** produto em estruturacao  
**Origem:** evolucao do antigo `Projetos/APP-SCRIPT`

## Proposta

Transformar uma planilha/script de organizacao de Gmail em um produto simples, guiado e vendavel para pessoas que estao com a caixa de entrada desorganizada.

O produto nao deve parecer uma ferramenta tecnica. A promessa central e:

> Organizar o Gmail com inteligencia, etiquetas e filtros em poucas horas, mesmo para quem nao e de TI.

## Publico inicial

- Gestores novos que assumiram uma caixa cheia.
- Profissionais administrativos/financeiros que perdem e-mails importantes.
- Pequenas equipes que precisam separar clientes, fornecedores, cobrancas, faturas e assuntos recorrentes.
- Pessoas desorganizadas que querem um metodo pronto, rapido e visual.

## Oferta v1

Produto unico entre R$97 e R$119:

- Planilha inteligente com menu guiado.
- Script Apps Script conectado ao Gmail.
- Guia de boas-vindas e implantacao em 1 dia.
- Kit de etiquetas/filtros sugeridos.
- Console de acompanhamento da organizacao.
- Bonus: calculadora do caos e checklist de manutencao semanal.

Possivel assinatura futura:

- Atualizacoes de regras por IA.
- Novos modelos de organizacao por profissao.
- Suporte/configuracao assistida.
- Monitoramento mensal da caixa e melhoria de filtros.

## Experiencia desejada

1. A pessoa abre a planilha e ve uma tela de boas-vindas.
2. Um menu simples orienta o passo a passo.
3. Ela roda a varredura dos e-mails.
4. O sistema sugere grupos, remetentes e etiquetas.
5. A pessoa aprova/ajusta.
6. O script gera a entrega para aplicar no Gmail.
7. Um console mostra progresso, pendencias, regras criadas e proximas acoes.

## Estrutura do projeto

| Caminho | Funcao |
|---|---|
| `1_Código.js` | menu principal, travas, logs e orquestracao |
| `2_Tratamento.js` | varredura, inteligencia local, IA e treinamento |
| `3_Dashboards.js` | console lateral, estatisticas e dashboard |
| `4_API.js` | integracao com Gemini |
| `5_GerarXML.js` | geracao de filtros/estrutura para entrega Gmail |
| `6_Auxiliares.js` | utilitarios e funcoes legadas |
| `7_ManualMarca.js` | manual de marca atual |
| `Console.html` | painel lateral de acompanhamento |
| `landing.html` | landing page estatica do produto |
| `marketing/prototipos/` | prototipos HTML vindos de `Downloads/etiqueta` |
| `marketing/BRIEF_LOVABLE_BUILDER.md` | briefing para recriar/evoluir a pagina em Lovable ou Builder |
| `marketing/DIRECAO_VISUAL.md` | direcao de marca, logo e visual |

## Decisoes de produto

- O nome de trabalho atual e **APP-Gmail**. A marca comercial pode continuar como **ELEVE** ou evoluir para outro nome.
- O diferencial contra uma aula comum de filtros e a combinacao de metodo, planilha, IA, console e entrega pronta.
- O produto deve vender clareza e alivio, nao apenas automacao.
- O primeiro material pos-compra precisa ser um guia guiado, nao documentacao tecnica.

## Inspiracao externa

Referencia analisada: Superhuman Mail. O que vale absorver:

- Promessa quantificada de tempo economizado.
- Narrativa forte sobre e-mail ser um problema escondido.
- Foco em triagem automatica, follow-up e responder ao que importa.
- Interface bonita como prova de valor, nao como enfeite.

O APP-Gmail deve ficar mais acessivel: menos "email premium para times" e mais "organizador pratico para quem precisa sair do caos agora".

## Proximos passos

1. Renomear textos internos de "Sion IA" para linguagem de produto, mantendo Sion apenas como bastidor se fizer sentido.
2. Criar tela de boas-vindas dentro do Apps Script.
3. Reformular `Console.html` para linguagem amigavel e menos tecnica.
4. Corrigir encoding dos prototipos HTML antes de publicar.
5. Criar um guia pos-compra com checklist de implantacao.
6. Separar o funil em: landing page, calculadora gratuita, checkout, guia, planilha/script.
7. Testar com 1 cliente real e medir antes/depois: e-mails nao lidos, tempo de busca, regras criadas e confianca do usuario.
