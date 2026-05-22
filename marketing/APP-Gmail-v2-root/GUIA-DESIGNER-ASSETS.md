# 🎨 Guia de Sobrevivência do Designer (Inbox Fighter)

> **Contexto:** Este é o manual definitivo para a criação dos assets 2D do mini-game "Inbox Fighter". Siga as dimensões e paletas estritamente para o código funcionar perfeitamente.

---

## 🛠 O "Atalho" em SVG (Comece por aqui!)

Sabemos que reproduzir a cara do Boss e a cabeça do personagem do zero pode ser chato. Para te ajudar, **eu programei as formas base em SVG**!

1. Abra o arquivo `designer-base-svgs.html` (que está nesta mesma pasta) no seu navegador (Chrome/Safari).
2. Você verá as cabeças, o Boss e os VFX renderizados.
3. Você pode arrastar os ícones direto pro Figma, ou usar o atalho `Copiar Elemento (Copy OuterHTML)` inspecionando o SVG e colar no Figma.
4. **Use essas cabeças como base!** A partir delas, você só precisa desenhar o corpinho palito (stickman) e os bracinhos nas posições corretas para gerar a sua animação.

---

## 📐 Especificações Técnicas de Exportação

- **Canvas do Jogo:** 700 × 420px
- **Formato:** PNG com fundo transparente ou SVG puro.
- **Tamanho de Entrega:** O dev precisa dos arquivos em **@2x** (o dobro da resolução original).
  - *Exemplo:* Se o Boss mede originalmente `200x155px` em tela, você deve exportar o PNG com `400x310px`.

## 🎨 Paleta de Cores Oficial

| Elemento | Cor / Hex | Aplicação |
| :--- | :--- | :--- |
| **Fundo Escuro** | `#07090f` ou `#0d1420` | Cenário, céu da arena. |
| **Acento Teal** | `#0f766e` | Linha do chão da arena, aura de vitória. |
| **Vermelho Gmail** | `#EA4335` | O "M" do herói, UI normal. |
| **Vermelho Corrompido** | `#8B0000` | O "M" escuro do Boss. |
| **Dourado SSJ** | `#fbbf24` / `#f59e0b` | Aura do herói transformado, cabelo. |
| **Azul SSJ2** | `#93c5fd` / `#3b82f6` | Ataque Kamehameha, aura alternativa. |
| **Roxo Boss** | `#7c3aed` / `#a855f7` | Aura do Boss "Goku Black". |
| **Corpo do Boss** | `#06020E` | Envelope negro do boss e minions. |

---

## 🦸‍♂️ Lista de Assets: O Herói (Stickman Gmail)

**Conceito:** Corpo palito (DBZ style) e cabeça de Envelope.
- *Base Cabeça:* ~40x30px
- *Altura total (com corpo):* ~90px (Exportar 180px @2x)

### Poses Requeridas (Fundo Transparente)
- `char-idle.png` : Parado, braços levemente flexionados. Aura sutil branca/cinza.
- `char-run-1.png` : Perna esquerda à frente.
- `char-run-2.png` : Perna direita à frente.
- `char-attack.png` : Soco, braço estendido, corpo inclinado pra frente.
- `char-jump.png` : No ar, posição lateral.
- `char-ssj.png` : Aura dourada, "M" fica dourado, olhos verdes.
- `char-ssj-blue.png` : Aura azul elétrica, "M" azul.
- `char-kameha-charge.png` : Mãos na lateral carregando esfera de energia.
- `char-kameha-fire.png` : Braços esticados atirando feixe.
- `char-win.png` : Braços pro alto, vitória, olhos felizes (`^ ^`).

---

## 👹 Lista de Assets: O Chefe (Boss Goku Black)

**Conceito:** O envelope de e-mail numa versão dark, enorme e furiosa. Estilo vilão anime.
- *Tamanho:* 200x155px (Exportar 400x310px @2x)

### Poses Requeridas
- `boss-idle.png` : Fundo #06020E, "999+" no peito, olhos laranjas raivosos, sorriso sarcástico.
- `boss-idle-rage.png` : Cracks (rachaduras) vermelhas, "666+", olhos sangrentos, aura vermelha.
- `boss-hit.png` : Corpo com flash branco/distorcido, expressão de dano.
- `boss-kneel.png` : Envelope inclinado (25º), olhos cansados, aura fraca.
- `boss-happy.png` : (INBOX ZERO!) Envelope branco, limpo, M vermelho normal, sorriso amigável, estrelinhas.

---

## 👾 Inimigos Menores e Projéteis

**Email Normal (Tipo A):**
- *Tamanho:* 70x48px (Exportar 140x96px @2x)
- *Visual:* Card de email flat moderno (fundo branco, avatar, remetente "Bradesco", "Omie").
- `email-normal.png`

**Email Minion (Tipo B):**
- *Tamanho:* 60x42px (Exportar 120x84px @2x)
- *Visual:* Versão mini do Boss (escuro, aura roxa).
- `email-minion.png`

**Projétil Boss:**
- *Tamanho:* 36x24px (Exportar 72x48px @2x)
- *Visual:* Cartão atirado em alta velocidade (com trail de movimento).
- `email-projectile.png`

---

## 🌌 Cenário (Background)

- *Tamanho:* 700x420px (Exportar 1400x840px @2x)
- `bg-arena.png`: Céu azul noturno (gradiente), 15 estrelas, linha do chão levemente iluminada (Teal #0f766e).
- `bg-arena-rage.png`: Versão vermelha/roxa do céu com linha do chão vermelha (quando o boss fica bravo).

---

## 💥 Efeitos Visuais (VFX) - Bônus

*Crie shapes transparentes e orgânicos, o dev anima via código!*
- `vfx-hit-spark.png` : Explosão de impacto mangá (50x50px).
- `vfx-aura-ssj.png` : Shape de aura dourada em chamas.
- `vfx-aura-blue.png` : Aura elétrica azul.
- `vfx-kameha-beam.png` : Feixe retangular de energia.
- `vfx-boss-aura.png` : Aura escura redonda borrada.
