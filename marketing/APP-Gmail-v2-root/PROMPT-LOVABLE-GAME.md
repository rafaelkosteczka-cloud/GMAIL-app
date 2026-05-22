# Prompt para Lovable — Mini-Game INBOX FIGHTER

> **Instruções para você (Usuário):** Copie todo o conteúdo abaixo e cole no Lovable (ou passe para o seu desenvolvedor). Ele contém toda a lógica, assets e regras do jogo em um formato estruturado que as IAs entendem perfeitamente.

---

## 🎯 Briefing do Projeto: "Gemail Fight"

Desenvolver um **Mini-Game Web 2D interativo e promocional** focado em conversão para o produto "ELEVE Gmail Redondo". 

A experiência deve simular uma batalha épica estilo mangá shounen/DBZ contra a ansiedade da caixa de entrada lotada. Ao vencer o chefe (INBOX 999+), o usuário recebe a oferta real para resolver o problema de vez.

**Estética e Direção de Arte:**
- 2D Vector Game Art (limpo, traços fortes, estilo HQ de ação).
- Cenário: Arena de batalha cósmica escura, chão de rocha rachada, estética DBZ.
- Efeitos visuais (VFX): Explosões de mangá, raios azuis, auras douradas e feixes de energia.
- Tons: Contraste alto (Fundo escuro, herói laranja/amarelo brilhante, chefe vermelho intenso).

---

## 🦸‍♂️ Personagens e Assets

### 1. O Herói: "Inbox Fighter"
- **Design:** Stickman clássico vestindo um *gi* laranja de luta (estilo Goku).
- **Cabeça:** É literalmente o ícone/envelope do Gmail.
- **Progresso Visual (Transformações):**
  - *Base:* Envelope normal (M vermelho).
  - *Super Saiyajin:* Aura dourada intensa. O "M" vermelho do envelope muda para **Amarelo Dourado**.
  - *Ultra Instinto:* Aura prateada etérea, "M" branco/prateado brilhante.

### 2. O Chefe (Boss): "INBOX 999+"
- **Design:** Um "Card" gigante branco de UI do Gmail, com braços e pernas de anatomia anime (músculos sombrios).
- **Rosto (Estilo Goku/Vilão DBZ):** A frente do card ganha feições marcantes de anime de luta (olhos rasgados de vilão, expressão de pura fúria e veias saltando), fundindo o layout da caixa do Gmail com a cara de um oponente nível DBZ.
- **Detalhe Principal:** Um texto gigante em vermelho sangrento pulsando: **"INBOX 999+"** estampado no centro.
- **Aura:** Fogo e energia vermelha ameaçadora constante.

---

## 🎮 Mecânicas e Fluxo de Jogo

O mini-game roda direto no navegador (Recomendação: React + HTML5 Canvas, Phaser.js ou Framer Motion pesadamente utilizado).

### UI (Interface do Usuário)
- **Top Left:** Health Bar do Herói (USER HP) + Avatar do Inbox Fighter.
- **Top Right:** Health Bar do Chefe (BOSS HP) com o nome "INBOX 999+".
- **Centro:** Arena de combate. Combo counter dinâmico ("50+ HIT!").
- **Bottom:** Painel de botões de habilidades (Soco, Dash, Genki Dama, Esquiva).

### Ciclo de Combate (Action Loop)
1. **Fase 1 (Spam Barrage):** O Boss joga centenas de ícones de e-mail pixelados na tela. O jogador deve clicar freneticamente no botão de "Soco/Dash" para destruí-los no ar.
2. **Golpes Trocados (Clash):** Se o jogador for bem sucedido, o herói avança. Efeito visual massivo de "Golpes Trocados" — múltiplos punhos borrados trocando golpes no centro da tela, ondas de choque radiais e texto "TATATATA!".
3. **Poder Especial (A Genki Dama de E-mails):** Quando o HP do Boss chegar a 20%, o botão "Ultimate" brilha. O herói ergue os braços e canaliza milhares de ícones de Gmail em uma esfera gigante brilhante.
4. **Finalização (Kamehameha):** Um feixe de energia azul desintegra o Boss, que derrete em pequenos ícones de "Lixeira" (trash bins) desaparecendo.

### Tela de Vitória (Conversão)
- O fundo escurece. O herói faz um "Joinha" (Thumbs up).
- **Texto Gigante:** "INBOX ZERO ALCANÇADA!"
- **Call to Action (CTA):** "Você venceu a batalha, mas e a guerra de amanhã? Domine seu Gmail na vida real com o método ELEVE Gmail Redondo."
- **Botão:** [Quero Organizar Meu Gmail de Verdade] (Leva para o checkout ou página de vendas).

---

## 🛠 Especificações Técnicas para o Desenvolvedor

- **Framework:** React com TypeScript.
- **Estratégia de Assets Visuais (CRÍTICO):**
  - **NÃO TENTE** desenhar a anatomia dos personagens (Herói e Boss) usando CSS ou SVG puro (os resultados ficam básicos demais e perdem a estética anime premium).
  - A engine do jogo deve ser inteiramente baseada no **uso de imagens Raster (PNG transparentes)**.
  - **O que você deve fazer agora (Placeholder Mode):** Construa toda a lógica do jogo, colisões, barras de vida e estados de animação apontando para imagens temporárias (ex: `https://via.placeholder.com/150/0000FF/808080?Text=Hero+Idle`). Assim que a lógica estiver pronta, o dono do projeto fará o upload (ou substituirá os links) pelos PNGs finais recortados da Arte Conceitual da IA.
- **Animações e Física:** 
  - Usar **Framer Motion** para animações de UI (barras de vida, botões, modais) e Screen Shakes (tremores de tela quando houver hit).
  - A animação dos personagens consiste apenas em alternar imagens renderizadas (ex: quando clicar em Atacar, trocar o `src` de `hero-idle.png` para `hero-attack.png` por 300ms).
- **VFX e Partículas:** Partículas simples (poeira, faíscas) podem ser feitas via código, mas golpes especiais pesados (O Kamehameha, Genki Dama) devem ser projetados esperando receber imagens PNG no futuro.
- **Performance:** O jogo deve ser perfeitamente responsivo no Mobile (botões grandes na parte inferior).
- **Áudio:** Incluir suporte básico a SFX (Soco, Explosão, Vitória) com toggle de Mute.

---

## 🔗 Referência Visual (Para o Artista/Dev)

As imagens de referência do projeto (Storyboards, Spritesheets, Poses de Transformação, Boss e FX) seguem o estilo Vetor Mangá/Comic com a paleta: Laranja (Herói), Vermelho/Cinza (Boss), Azul Eletrizante (VFX). *Certifique-se de aplicar o efeito de "Impact Lines" típicos de animes em todos os acertos críticos.*
