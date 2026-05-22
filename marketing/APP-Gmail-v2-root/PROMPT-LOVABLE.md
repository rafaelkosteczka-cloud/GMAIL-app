# Prompt para Lovable — ELEVE Gmail Redondo

> Cole tudo abaixo no Lovable como mensagem inicial. O prompt está em pt-BR mas traz nomes técnicos em inglês porque é assim que o Lovable melhor parseia.

---

## 🎯 Briefing do projeto

Construa uma **landing page premium em português brasileiro** para um produto digital chamado **"ELEVE Gmail Redondo"**.

**O que é o produto:** método guiado de 1 dia para organizar uma caixa de Gmail caótica usando uma planilha inteligente, IA, etiquetas e filtros automáticos. Preço: R$119 (acesso único, sem mensalidade).

**Para quem:** profissionais e pequenos times que sofrem com Gmail bagunçado mas não querem aprender automação do zero. Tom acessível ("vou te guiar"), nada de infoproduto agressivo.

**Sensação visual de referência:** Apple product page (scroll narrativo) + Linear/Stripe (limpeza, microinterações premium) + Superhuman Mail (produtividade premium) + Notion/Arc (calorosamente moderno). **Nunca** estilo "venda agressiva" com gradientes berrantes, contadores piscando ou setas vermelhas.

**Diferencial central da página:** scroll storytelling cinemático. A pessoa entra, sente visualmente o caos da caixa, e ao rolar a página o caos vai sendo transformado em sistema organizado.

---

## 🛠 Stack técnica

- **React 18 + Vite + TypeScript**
- **Tailwind CSS** (tokens customizados — paleta abaixo)
- **Framer Motion** para scroll animations, parallax e microinterações
- **GSAP + ScrollTrigger** para sequências de scroll storytelling complexas (hero pinning, timeline)
- **Three.js + @react-three/fiber + @react-three/drei** para a cena 3D do hero (opcional — ver "Hero" abaixo)
- **Lucide React** para ícones
- **Lenis** para smooth scroll (opcional, mas recomendado)
- **shadcn/ui** apenas se for usar slider/accordion — caso contrário componentes próprios
- **next/font ou @fontsource** para Inter e Instrument Serif

Preferência: **single page** (`/`). Sem roteamento. Componentes em `src/components/sections/`.

---

## 🎨 Design system

### Paleta (configurar no `tailwind.config.ts` como `theme.extend.colors`)

```ts
colors: {
  bg:         '#fbfaf7',  // fundo claro quente
  'bg-2':     '#f3f1ec',  // fundo alternativo
  ink:        '#15171a',  // tinta escura (texto principal)
  'ink-soft': '#4a4d54',  // texto secundário
  'ink-mute': '#8a8d94',  // texto terciário/labels
  teal:       '#0f766e',  // primária
  'teal-dark':'#0a544e',
  mint:       '#d7f8ed',  // acento suave
  coral:      '#ef6f61',  // urgência
  amber:      '#f5b942',  // financeiro
  blue:       '#2563eb',  // info
  lavender:   '#e7ddff',  // IA/follow-up
}
```

### Tipografia

- **Sans (UI):** Inter (400, 500, 600, 700, 800)
- **Serif editorial (headlines):** Instrument Serif (400, 400 italic)
- Aplique a serif em **todos os títulos de seção** e em palavras-chave dentro deles via `<em>` (que herda italic do Instrument Serif).

### Tokens visuais

- `border-radius`: padrão 8px, cards grandes 16px, oferta principal 20px
- Sombras: `sm` (1px 2px subtle), `md` (8px 24px), `lg` (24px 60px)
- Espaçamento de seção: `py-32` em desktop, `py-20` em mobile
- Container: `max-w-[1200px] mx-auto px-6`

### Estilo geral

- Bordas finas (`border-black/8`)
- **Sem gradientes pesados.** Apenas sutilezas (radial glow no card de oferta).
- Microinterações em **todos** os botões e cards (hover translate-y, scale, shadow).
- Tipografia **forte e clara**, sem letra decorativa.

---

## 🧱 Estrutura da página (top → bottom)

1. **Header sticky** (glass blur, logo + CTA)
2. **Hero** — scroll storytelling cinemático
3. **Dor / Caos** — cards de e-mail caóticos
4. **Calculadora do Caos** — interativa, fundo escuro
5. **Método em 5 passos** — pipeline de etapas
6. **Produto / Kit** — o que recebe + mockup de planilha
7. **Antes & Depois** — slider drag interativo
8. **Oferta** — card premium com preço, fundo escuro
9. **FAQ** — acordeão custom
10. **Footer**

---

## 🧩 Logo / símbolo

Crie um SVG inline simples e original:
- Envelope estilizado em **teal `#0f766e`** com a tampa formando V
- Etiqueta dobrada (ribbon) em **coral `#ef6f61`** no canto superior direito
- **NÃO copiar o logo oficial do Gmail.** Sem M, sem cores RGB do Google.
- Reutilizar como favicon (data-URI) e no footer.

---

## 🪜 Hero — DUAS opções, escolha a A como padrão

### 🅰️ Opção A — Hero cinemático com IMAGEM (recomendado, mais robusto)

A landing começa com **uma imagem fotorrealística** ocupando viewport inteira:
- Cena: profissional brasileiro de ~30 anos sentado num home office aconchegante, vendo um laptop com expressão tensa. Luz dourada lateral, ambiente warm minimalist.
- A imagem deve ser tratada como **layer base**.

Quando rolar:
1. **0–35%** do scroll: a imagem dá um **zoom-in lento** (CSS `transform: scale()` controlado por Framer Motion `useScroll` + `useTransform`) focando a tela do laptop. A pessoa some do quadro. Headline e CTA fade-out.
2. **35–60%** do scroll: cross-fade para uma **segunda imagem** mostrando close da tela com Gmail caótico (34.218 e-mails, sem etiquetas). Sobrepor headline tensa: *"E se o problema não for você?"*. Contador animado 34.218 sobe rápido em pulse.
3. **60–85%** do scroll: **etiquetas coloridas SVG animadas** começam a aparecer sobre a tela, simulando a IA classificando os e-mails. Cada etiqueta entra com `motion.div` com `animate={{ scale: [0, 1.1, 1], opacity: [0, 1] }}`. Stagger 0.08s.
4. **85–100%** do scroll: cross-fade para **terceira imagem** mostrando Gmail organizado (etiquetas Urgente/Clientes/Financeiro/Follow-up/Diretoria, painel de progresso ✓ 100%). Headline final + CTA principal.

Use `position: sticky` ou GSAP ScrollTrigger pin para travar o hero e fazer o storytelling acontecer durante 300% de scroll.

**Importante:** as 3 imagens vão ser fornecidas depois pelo usuário. Por enquanto, use placeholders (`/hero-1.jpg`, `/hero-2.jpg`, `/hero-3.jpg`) com aspectos 3:2 para a primeira e 16:9 para as outras.

### 🅱️ Opção B — Hero 3D com Three.js (bonus, se a A for limitante)

Cena **react-three-fiber** ocupando hero inteiro, controlada por scroll:

1. **Estado inicial:** envelope custom em teal+coral central (BoxGeometry + ExtrudeGeometry para tampa e etiqueta), com 60+ planos representando cards de e-mail (texturas geradas via Canvas com remetente/assunto fictícios) orbitando.
2. **Scroll 0–25%:** câmera dolly-in. Mais cards "chovem" do topo (estilo *Devil's Advocate*). Contador 0→34.218.
3. **Scroll 25–50%:** envelope vibra e **estilhaça em ~56 fragmentos** (Box geometries pequenas) com física simulada (queda + rotação).
4. **Scroll 50–75%:** fragmentos fadeam. Cards começam a **cascata estilo Solitaire do Windows**: cada card é lançado de uma posição alta off-screen e arc-bounce até pousar em sua posição final, com 3 quicadas de amplitude decrescente (100% → 42% → 15%). Stagger de até 40% no tempo total.
5. **Scroll 75–100%:** todos os cards organizados em grade limpa atrás do conteúdo final do hero.

Implemente o bounce com função custom:
```ts
function solitaireBounce(t: number, origin: Vec3, target: Vec3, peak: number) {
  const ease = 1 - Math.pow(1 - t, 3);
  const x = origin.x + (target.x - origin.x) * ease;
  const z = origin.z + (target.z - origin.z) * ease;
  let y;
  if (t < 0.55) {
    const lt = t / 0.55;
    y = origin.y + (target.y - origin.y) * lt + Math.sin(lt * Math.PI) * peak;
  } else if (t < 0.80) {
    const lt = (t - 0.55) / 0.25;
    y = target.y + Math.sin(lt * Math.PI) * peak * 0.42;
  } else if (t < 0.94) {
    const lt = (t - 0.80) / 0.14;
    y = target.y + Math.sin(lt * Math.PI) * peak * 0.15;
  } else y = target.y;
  return { x, y, z };
}
```

**Performance:** texturas reusadas via pool (10 únicas para 70 cards), `dpr=[1, 2]`, `frameloop="demand"` quando possível, fallback estático para `prefers-reduced-motion`.

---

## 📋 Conteúdo de cada seção (COPY EXATA — usar como está)

### Header
- Logo: símbolo + "ELEVE Gmail Redondo"
- CTA primário direita: **"Quero organizar meu Gmail"** (linka pra `#oferta`)

### Hero (texto sobreposto)
- Tag pill (com dot animando pulse): `método guiado · 1 dia`
- H1 (Instrument Serif): **"Sua caixa cheia pode virar um *sistema* em 1 dia."** (palavra "sistema" em italic teal)
- Subhead: "Mapeie seus e-mails, crie etiquetas inteligentes e gere filtros que deixam o Gmail trabalhando por você. Sem virar especialista em automação."
- CTA primário: **"Quero organizar meu Gmail"**
- CTA secundário ghost: **"Ver o método →"**
- Bottom-right: contador "34.218" + label "e-mails na sua caixa" (muda para "0" e "organizado" no fim do scroll storytelling)

### Seção 2 — Dor

- Eyebrow: `o caos é familiar`
- H2: **"Você abre o Gmail, sente um aperto e *fecha de novo*."**
- Lead: "Caixa lotada não é falta de organização — é falta de método. Enquanto você procura o e-mail certo, coisas importantes ficam invisíveis."
- 6 cards de e-mail caóticos em grid responsivo (auto-fit minmax 280px). Cada card tem leve rotação aleatória (-0.6deg / +0.4deg) que zera no hover. Cada card mostra:
  - Badge no canto superior direito: `urgent` (coral), `unread` (azul) ou `lost` (cinza)
  - Linha pequena: remetente
  - Bold: assunto
  - Preview de 2 linhas

Cards (use exatamente esses):
1. `cliente.mendes@empresa.com` · "Re: Proposta enviada quinta" · "Voltei aqui pra cobrar… vocês conseguem revisar até hoje?" · badge **Urgente**
2. `banco@instituicao.com.br` · "Sua fatura vence em 2 dias" · "Evite juros — boleto disponível na área logada." · badge **Não lido**
3. `newsletter@medium.com` · "5 hábitos de pessoas produtivas" · "Esta semana, separamos os artigos mais lidos…" · badge **Distração**
4. `NF-e Sistema` · "Sua nota fiscal nº 28.341" · "Segue em anexo o XML e o PDF…" · badge **Sem etiqueta**
5. `rh@empresa.com` · "URGENTE: aprovar férias da Maria" · "O prazo termina hoje. Por favor, responder…" · badge **Quase perdido**
6. `LinkedIn` · "12 novas conexões esta semana" · "Você apareceu em 47 buscas. Veja quem está olhando…" · badge **Distração**

Animação: cards aparecem com fade+slide-up, stagger 60ms, `whileInView`.

### Seção 3 — Calculadora do Caos (FUNDO ESCURO `#15171a`)

- Eyebrow (amber): `calculadora do caos`
- H2 (cor `bg`): **"Quanto a sua caixa desorganizada *custa por ano*?"** (italic em amber)
- Lead: "Ajuste os controles e descubra o prejuízo anual. Os números costumam assustar."
- Layout grid 2 colunas (1 col em mobile):
  - Esquerda: 3 sliders custom
    1. "Salário médio mensal por pessoa" — range R$2.000 a R$40.000, step 500, default 8.000
    2. "Pessoas afetadas pela bagunça" — range 1 a 50, default 3
    3. "Minutos perdidos por dia procurando e-mail" — range 5 a 180, step 5, default 35
    - Estilo dos sliders: track `bg-white/15`, thumb `bg-amber` 22px com ring `bg-amber/20`
  - Direita: card de resultado em `bg-white/5` border `border-white/10` rounded-2xl p-10
    - Label uppercase: "Prejuízo anual estimado"
    - Big number (Instrument Serif, cor amber, ~88px): valor R$ formatado pt-BR
    - Subtexto: "Considera 220 dias úteis e 8h por dia de trabalho."
    - HR fina
    - Breakdown 2 col: "Horas perdidas/ano" + "Por pessoa/mês"

**Fórmula:**
```ts
const horasPessoaAno = (minutos / 60) * 220;
const custoHora = salario / 220 / 8;
const totalAnual = horasPessoaAno * custoHora * pessoas;
const porPessoaMes = (horasPessoaAno * custoHora) / 12;
```

Big number anima com tween (Framer Motion `animate` ou `useSpring`) ao mudar slider. Formato: `R$ XX.XXX` (sem decimais).

### Seção 4 — Método em 5 passos

- Eyebrow: `método em 5 passos`
- H2: **"Da bagunça ao sistema — sem aprender *automação*."**
- Lead: "Cada etapa é guiada por uma planilha inteligente e um menu no Apps Script. Você aprova; a IA executa."
- 5 cards horizontais (vertical em mobile), conectados por linha gradiente teal sutil entre eles
- Cada card: número em círculo (mint→teal quando ativo), título, descrição curta
- Animação: `IntersectionObserver` adiciona classe `active` quando card entra no viewport (translate-y -6, border teal, shadow-lg, número escala 1.08)

Conteúdo:
1. **Escanear a caixa** — "Um script lê remetentes e assuntos dos últimos meses e devolve uma planilha pronta."
2. **Agrupar remetentes** — "Você vê padrões: faturas, clientes, notificações. Marca o que é o quê."
3. **Refinar com IA** — "A IA sugere etiquetas, prioridades e regras. Você só aprova ou ajusta."
4. **Aprovar etiquetas** — "Revisa o conjunto final na própria planilha — com cores e categorias."
5. **Aplicar no Gmail** — "O Apps Script gera filtros, cria etiquetas e organiza tudo de uma vez."

### Seção 5 — Produto / Kit (FUNDO `bg-2`)

- Eyebrow: `o que você recebe`
- H2: **"Um *kit completo* para sair do zero — em uma tarde."**
- Lead: "Tudo já configurado. Você abre, segue o passo a passo e termina o dia com Gmail organizado."
- Grid 3 col (1 em mobile) com 6 itens. Cada item: ícone Lucide em quadrado mint, título, descrição:
  1. **Planilha inteligente** (icon `Table`) — "Estrutura pronta com colunas, fórmulas e validações. Só preencher."
  2. **Apps Script com menu** (icon `Code2`) — "Botões prontos no menu da planilha — sem editar código."
  3. **Painel de progresso** (icon `LineChart`) — "Veja em tempo real quantos e-mails já foram organizados."
  4. **Gerador de filtros** (icon `Filter`) — "Os filtros do Gmail são criados automaticamente, com regras claras."
  5. **Implantação em 1 dia** (icon `Clock`) — "Roteiro de 6h para sair do caos e ter tudo no ar até o fim do expediente."
  6. **Checklist semanal** (icon `CheckCheck`) — "Rotina simples para a caixa não voltar ao caos. Toma 10 minutos."

Abaixo do grid, **mockup de planilha**: card grande com header estilo macOS (3 dots vermelho/amarelo/verde + "ELEVE_Gmail_Redondo · Mapeamento"), tabela com 5 colunas (Remetente, Grupo, Prioridade, Etiqueta, Status). Linhas se preenchem progressivamente (fade-in + stagger 180ms) quando entra no viewport.

Rows da tabela:
- `cliente.mendes@empresa.com` | Clientes | Alta | pill **Clientes** (teal) | ✓
- `banco@instituicao.com.br` | Financeiro | Média | pill **Financeiro** (amber) | ✓
- `rh@empresa.com` | Equipe | Alta | pill **Urgente** (coral) | ✓
- `NF-e Sistema` | Documentos | Baixa | pill **Financeiro** | ✓
- `newsletter@medium.com` | Conteúdo | Baixa | pill **Follow-up** (lavender) | ✓
- `diretoria@empresa.com` | Diretoria | Alta | pill **Diretoria** (azul) | ✓

### Seção 6 — Antes & Depois

- Eyebrow: `antes & depois`
- H2: **"Mesma caixa. *Outra cabeça.*"**
- Lead: "Arraste para comparar. À esquerda, o caos atual. À direita, sua caixa depois do método."
- Componente custom **before/after slider**: dois divs `position:absolute inset-0`, o "depois" com `clip-path: inset(0 0 0 X%)`. Handle arrastável (mouse + touch) com círculo preto `52px` e ícone `⇆`.
- Auto-demo wiggle no primeiro entry no viewport (slider vai 50→25→50, easing `power2.inOut`).

**Lado "Antes":**
- Background: gradient warm cream→bege
- Label superior esquerdo "Antes" (preto)
- Lista de e-mails com ícones de tensão:
  - ⚠️ Urgente: aprovar férias da Maria
  - Newsletter — 5 hábitos produtivos
  - NF-e #28341 (escondido entre spams)
  - ⚠️ Boleto vence amanhã
  - Re: proposta enviada (sem resposta)
  - LinkedIn: 12 novas conexões
  - Spam: oferta imperdível...
  - Re: reagendar call?
- Stats canto inferior esquerdo: "34.218 e-mails · 0 etiquetas"

**Lado "Depois":**
- Background: white→mint
- Label superior direito "Depois" (teal)
- Linha de pills coloridas no topo: ● Urgente (12) · ● Clientes (84) · ● Financeiro (37) · ● Follow-up (21) · ● Diretoria (8)
- E-mails categorizados (cada um com pill + assunto):
  - 🔴 Aprovar férias — Maria · RH
  - 🟢 Mendes — proposta revisada
  - 🟡 Boleto · vencimento 12/05
  - 🟢 Lara — reagendar call
  - 🟣 Notas da reunião 3a
  - 🔵 Reunião com diretoria
- Stats canto inferior direito: "organizado · 6 etiquetas ativas" (teal-dark, bold)

### Seção 7 — Oferta (FUNDO ESCURO `#15171a`)

- Eyebrow (amber): `acesso único`
- H2 (cor `bg`): **"Pronto para deixar o Gmail *trabalhando por você*?"** (italic em mint)
- Lead: "Feito para quem quer organizar o Gmail sem aprender automação do zero."
- **Card central** (`max-w-[720px] mx-auto`, padding 14, rounded-3xl, gradient `from-[#1d2024] to-[#0e1013]`, border `white/10`):
  - **Glow radial sutil** no topo: `bg-radial-gradient(circle, rgba(15,118,110,0.5), transparent)` blur-3xl
  - Tag superior: pill teal/mint com texto "ELEVE Gmail Redondo"
  - Preço: `<span>R$</span><span>119</span>` (Instrument Serif, R$ menor, 119 enorme ~96px)
  - Subtexto: "acesso único · sem mensalidade"
  - CTA grande (cor inversa: bg branco texto preto, hover mint): **"Quero entrar no lançamento"**
  - Lista com check ✓ teal:
    - Planilha inteligente pronta
    - Apps Script com menu guiado
    - Painel de progresso visual
    - Gerador de filtros do Gmail
    - Roteiro de implantação em 1 dia
    - Checklist de manutenção semanal

### Seção 8 — FAQ

- Eyebrow: `perguntas frequentes`
- H2: **"Antes de comprar, é justo *perguntar*."**
- Acordeão custom (não shadcn). Cada item: `<button>` full-width com pergunta esquerda + sinal "+" direita (rotaciona 45° quando aberto). Resposta tem `max-height` transition de 400ms.

Perguntas + respostas:

1. **Preciso saber programar?**
   "Não. Tudo é guiado por uma planilha com menu próprio. Você clica em botões e revisa o que a IA sugere — em nenhum momento precisa abrir ou editar código."

2. **Funciona em qualquer Gmail?**
   "Funciona em contas Gmail pessoais e contas Google Workspace (corporativas). Em algumas empresas o admin pode restringir Apps Script — nesse caso o time de TI libera com 1 clique."

3. **A IA lê meus e-mails?**
   "A IA recebe apenas remetentes e assuntos (não o corpo dos e-mails) para sugerir agrupamentos e etiquetas. Tudo roda na sua conta — nenhum dado vai para servidores externos sem sua autorização."

4. **Posso adaptar para minha empresa?**
   "Sim. As categorias, etiquetas e regras são totalmente customizáveis na própria planilha. Você pode rodar a mesma metodologia para você, para seu time ou para clientes."

5. **Quanto tempo demora?**
   "O método foi pensado para 1 dia: 2-3h de scan e agrupamento, 1h de IA + revisão, 1h de aplicação. Caixa muito grande pode virar 2 tardes."

6. **Isso substitui o Gmail?**
   "Não — pelo contrário. O método configura o próprio Gmail (etiquetas e filtros nativos) para que ele trabalhe melhor pra você. Você continua usando o Gmail, só que organizado."

### Footer

- Background `ink`, texto `white/55`
- Logo + "ELEVE Gmail Redondo"
- Copy: "© 2026 · Feito para quem quer Gmail redondo."

---

## ✨ Animações e microinterações (resumo)

- **Header:** glass blur estático
- **Hero:** scroll storytelling (3 imagens cross-fade OU cena Three.js, ver opções)
- **Cards de caos:** fade+slide-up com stagger ao entrar no viewport, hover lift+rotate-zero
- **Calculadora:** valor numérico tween suave ao mudar slider
- **Método:** card "ativa" (border, lift, shadow) ao entrar no viewport
- **Mockup de planilha:** linhas fadeam progressivamente
- **Antes/Depois:** drag handle + auto-demo wiggle inicial
- **Oferta:** card respira sutilmente em loop infinito (scale 1 → 1.005), CTA pulsa no hover
- **FAQ:** + rotaciona 45° ao abrir, altura anima

---

## 📐 Responsividade

- Mobile-first
- Hero: em mobile, alturas e fontes reduzem; o storytelling 3D pode degradar para versão estática (imagem única) em viewports < 768px
- Calculadora: vira 1 coluna < 900px
- Método: vira 1 coluna < 900px (linha gradiente some)
- Antes/Depois: altura reduz para 520px em mobile

## ♿ Acessibilidade

- `prefers-reduced-motion: reduce` desliga toda animação não-essencial (storytelling vira fade simples)
- Contraste mínimo AA em todos os textos
- Botões com `aria-label` claro
- FAQ usa `<button>` com `aria-expanded`
- Slider antes/depois com keyboard support (setas)

## 🚀 Performance

- Lazy-load imagens do hero com `loading="lazy"` exceto a primeira
- Three.js (se usado): `dpr=[1, 2]`, geometria simples, texturas pool de 10
- Fonte Inter via `font-display: swap`

---

## ❌ NÃO fazer

- Não usar logo oficial do Gmail
- Não usar gradientes berrantes ou glow radioativo
- Não usar emojis dentro do produto/UI (só nos exemplos de e-mail)
- Não usar setas grandes amarelas, contadores piscando, "ESCASSEZ" e estética infoproduto
- Não usar shadcn/Card padrão — criar componentes próprios para que o look fique custom
- Não fazer pop-up de "saída"
- Não usar fontes "manuscritas" ou decorativas

---

## 🎁 Bônus se sobrar tempo

- Cursor custom no hero (círculo pequeno teal que cresce em elementos interativos)
- Som sutil ao arrastar o slider antes/depois (opcional, mute por default)
- Easter egg: console.log com mensagem amigável para devs curiosos

---

## ✅ Entrega

- 1 página `/` completa, responsiva, com tudo acima
- Componentes em `src/components/sections/Hero.tsx`, `Pain.tsx`, `Calculator.tsx`, `Method.tsx`, `Product.tsx`, `BeforeAfter.tsx`, `Offer.tsx`, `Faq.tsx`, `Header.tsx`, `Footer.tsx`
- Tokens de design no `tailwind.config.ts`
- Sem `console.error`/warnings no build

Comece pelo design system + header + hero (opção A com placeholders). Depois desça pelas seções na ordem listada.
