# ELEVE Gmail Redondo — Landing v2

Single-file HTML com cena 3D (Three.js), scroll storytelling (GSAP ScrollTrigger), smooth scroll (Lenis) e o efeito **cascata estilo Solitaire do Windows** na fase final do hero.

## Como abrir

Basta dar duplo-clique em `index.html`. Funciona offline (todas as libs vêm de CDN, então precisa de internet só na primeira carga).

## Como hospedar (free)

- **Vercel / Netlify**: arrasta a pasta `APP-Gmail-v2` na home deles. Deploy em 30 segundos.
- **GitHub Pages**: faz push da pasta num repo, ativa Pages.
- **Cloudflare Pages**: mesmo fluxo de drag-and-drop.

## A cena Three.js

1. **Top da página** — Envelope teal+coral central, e-mails orbitando em nuvem.
2. **Scroll 0–25%** — Câmera aproxima, e-mails começam a "chover" do topo (estilo *Devil's Advocate*).
3. **Scroll 25–50%** — Envelope vibra e se fragmenta em ~56 estilhaços coloridos.
4. **Scroll 50–75%** — Estilhaços fadeam, e-mails começam a cascata Solitaire.
5. **Scroll 75–100%** — E-mails terminam de pousar nos slots da grade organizada.

O efeito Solitaire foi implementado com a função `solitaireBounce(t, origin, target, peakHeight)` que combina:
- Easing cúbico no XZ (movimento suave em direção ao slot)
- Três quicadas em Y com amplitudes 100% / 42% / 15%
- Stagger de até 40% do tempo total para criar a cascata escalonada

## Customização rápida

Toda a paleta está em CSS variables no topo do `<style>`:

```css
:root {
  --bg: #fbfaf7;
  --teal: #0f766e;
  --coral: #ef6f61;
  --amber: #f5b942;
  /* ... */
}
```

Para mudar o número de e-mails na cena, ajuste `NUM_CARDS` no JS (linha começa com `const NUM_CARDS = ...`).

Para desativar o smooth scroll, comente o bloco `if (window.Lenis && !reduceMotion)`.

## Performance

- 70 cards × 10 texturas reaproveitadas (não 70 texturas únicas)
- 56 fragmentos com geometria simples
- DPR limitado a 2
- Versão reduzida (24 cards / 24 frags) automaticamente quando `prefers-reduced-motion: reduce`

## Estrutura

- `index.html` — a landing inteira (HTML + CSS + JS inline)
- `README.md` — este arquivo
