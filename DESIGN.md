---
name: Something About Books
description: Encontre livros, organize suas estantes e crie o hábito de ler com o Pomodoro.
colors:
  vinho-encadernado: "#620000"
  vinho-encadernado-hover: "#7a0000"
  coral-marcador: "#E36065"
  papel: "#ffffff"
  papel-suave: "#faf9f4"
  creme-estante: "#f0eee2"
  creme-hover: "#e5e2d2"
  borda-linho: "#d9d5c7"
  borda-suave: "#ebe8dc"
  tinta: "#292929"
  tinta-esmaecida: "#6b6b6b"
  cinza: "#dddddd"
  texto-sobre-marca: "#f5f5f5"
  perigo: "#b3261e"
  sucesso: "#2e7d4f"
typography:
  display:
    fontFamily: "Lora, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "Lora, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.25rem, 3vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.25
  body:
    fontFamily: "Roboto, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  eyebrow:
    fontFamily: "Roboto, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.12em"
rounded:
  selo: "4px"
  capa: "6px"
  campo: "8px"
  painel: "18px"
  hero: "24px"
  pilula: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  2xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.vinho-encadernado}"
    textColor: "{colors.texto-sobre-marca}"
    rounded: "{rounded.pilula}"
    padding: "0.625rem 1.25rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.vinho-encadernado-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pilula}"
    padding: "0.625rem 1.25rem"
    height: "2.75rem"
  button-form:
    backgroundColor: "{colors.vinho-encadernado}"
    textColor: "{colors.texto-sobre-marca}"
    rounded: "{rounded.campo}"
    padding: "0 1rem"
    height: "2.875rem"
  input-text:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.campo}"
    padding: "0 0.75rem"
    height: "2.75rem"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pilula}"
    padding: "0.5rem 1rem"
  chip-selected:
    backgroundColor: "{colors.vinho-encadernado}"
    textColor: "{colors.texto-sobre-marca}"
  card-badge:
    backgroundColor: "{colors.coral-marcador}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.selo}"
    padding: "0.125rem 0.5rem"
  card-row:
    backgroundColor: "{colors.creme-estante}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.capa}"
    padding: "1rem"
  header:
    backgroundColor: "{colors.creme-estante}"
    textColor: "{colors.tinta}"
    height: "4.25rem"
  hero:
    backgroundColor: "{colors.creme-estante}"
    rounded: "{rounded.hero}"
    padding: "3rem"
---

# Design System: Something About Books

## Overview

**Creative North Star: "A Estante de Casa"**

O SAB tem que parecer a estante de quem lê: papel creme, vinho de capa encadernada, livros que se destacam
pela própria capa. Não é livraria nem vitrine. É um lugar pessoal e acolhedor, que convida a pegar o livro de volta.
As capas são o conteúdo principal; a interface fica em volta delas, em tons de papel, e cede o protagonismo.

A densidade é média: carrosséis de capas, um destaque (hero) por página e listas com bastante respiro. Os títulos
de destaque em Lora dão o tom de livro; todo o resto (navegação, rótulos, formulários) é Roboto, funcional e
discreto. As formas são macias (pílulas e cantos de 8px), as sombras são quentes e baixas, e só as capas "levantam"
da página.

Existem dois temas, claro e escuro, com os mesmos papéis de cor. O escuro troca o papel por madeira escura
(`#171312`) e clareia o vinho para manter o contraste. Fica de fora: cara de SaaS genérico (gradientes roxo-azul,
cards de vidro, dashboard frio) e cara de loja (preços, selos de oferta, vitrine de e-commerce).

**Key Characteristics:**
- Capas como protagonistas, com sombra quente e elevação no hover.
- Fundo creme de papel, nunca branco frio em áreas grandes de destaque.
- Vinho como única cor de ação; coral só como marcador (foco, progresso, selos).
- Lora só em títulos de destaque; Roboto em todo o resto.
- Formas macias: pílulas para ações e filtros, 8px para campos, 24px para o hero.
- Prateleira de lombadas (`public/imgs/hero-shelf.svg`) como assinatura da home.

## Colors

Paleta de papel e couro: neutros creme quentes, um vinho profundo para ação e um coral para marcar.

### Primary
- **Vinho Encadernado** (`--color-brand`): botões principais, chip selecionado, sublinhado da navegação ativa,
  pílula do Pomodoro no cabeçalho. No tema escuro vira `#c2454b`. O hover usa o tom mais vivo
  (`--color-brand-hover`; `#d4565c` no escuro). Para texto e links use `--color-link` (`BrandText`), que no
  escuro clareia para `#f0898d` e passa no contraste; o vinho de fundo, não.

### Secondary
- **Coral Marcador** (`#E36065`, fixo nos dois temas): anel de foco (`:focus-visible`), preenchimento da barra de
  progresso, selo do card ("Lendo"), barra de rolagem. Funciona como a fita marcadora do livro: aponta onde você
  está, nunca é botão.

### Neutral
- **Papel** (`--color-surface`): fundo da página e dos campos. Escuro: `#171312`.
- **Papel Suave** (`--color-surface-soft`): fundos levemente destacados. Escuro: `#1e1917`.
- **Creme de Estante** (`--color-surface-muted`): cabeçalho, hero, cards em linha, skeleton, trilho da barra de
  progresso. Escuro: `#2a2321`.
- **Creme Hover** (`--color-surface-hover`): hover sobre superfícies creme. Escuro: `#362d2a`.
- **Borda de Linho** (`--color-border`): contorno de campos, chips e botões secundários. Escuro: `#3d3431`.
- **Borda Suave** (`--color-border-soft`): divisórias discretas. Escuro: `#2f2826`.
- **Tinta** (`--color-text`): texto principal. Escuro: `#ece7e2`.
- **Tinta Esmaecida** (`--color-text-muted`): autor, legendas, dicas. Escuro: `#a9a19b`.
- **Cinza** (`--color-gray`): elementos inativos. Escuro: `#4a4240`.
- **Perigo / Sucesso** (`--color-danger`, `--color-success`): erros de campo e toasts. Escuro: `#f2786f` / `#5cc48a`.

As cores fixas `White`, `Sand`, `Ink`, `Coral` e `Night` de `src/assets/Colors.jsx` servem só para texto sobre
fundos que não mudam com o tema (vinho, coral, capas).

### Named Rules
**A Regra da Variável.** Componentes usam as cores de `src/assets/Colors.jsx` (que apontam para as variáveis de
`src/components/Reset`) ou `var(--color-*)` nos CSS modules. Hex solto em componente quebra o tema escuro. Cor nova
entra nos dois blocos do Reset, e o teste `Reset.test.jsx` confere isso.

**A Regra da Única Ação.** O vinho é a única cor de ação. Coral marca posição e estado, nunca é botão ou link.

## Typography

**Display Font:** Lora (com Georgia e Times New Roman), pesos 600 e 700, via `var(--font-display)`
**Body Font:** Roboto (com sans-serif), pesos 300, 400, 500 e 700

**Character:** Lora traz a voz de livro impresso aos títulos; Roboto mantém a interface neutra e legível, sem
competir com as capas.

### Hierarchy
- **Display** (Lora 700, `clamp(2rem, 4vw, 3rem)`, 1.1): h1 do hero e das páginas principais.
- **Headline** (Lora 700, `clamp(1.25rem, 3vw, 1.75rem)`, 1.2): títulos de seção ("Em alta", gêneros, listas).
  O título do livro em leitura no hero usa Lora 700 a 1.25rem.
- **Title** (Roboto 500, 1rem, 1.25): título no card de livro, cortado em duas linhas. No card em linha, 700 a 1.125rem.
- **Body** (Roboto 400, 0.9375rem, 1.5): texto corrido, chips, campos. Subtítulo do hero até 34rem de largura.
- **Label** (Roboto 500, 0.875rem): rótulos de formulário, autor no card (400, esmaecido), pílula do Pomodoro.
- **Eyebrow** (Roboto 700, 0.8125rem, 0.12em, maiúsculas, cor de link): chamada acima do h1 do hero.

### Named Rules
**A Regra da Lora Rara.** Lora só em h1, títulos de seção e no título do livro em leitura. Nunca em botões,
rótulos, navegação ou parágrafos.

## Layout

Conteúdo centralizado em um contêiner de até 80rem, com 1rem de margem lateral. O hero é uma grade de duas colunas
(`1.2fr` texto, `1fr` livro em leitura ou leque de capas) com 3rem de respiro interno e uma prateleira de lombadas
de 6rem encostada na base. Listas de livros são carrosséis horizontais de cards de capa ou grades de cards em linha.

O ritmo de espaçamento usa a escala de `0.25rem`: `0.5rem` entre itens próximos (o valor mais usado), `1rem`
entre blocos, `1.5rem` entre seções do hero, `2rem` no fim da página.

Pontos de quebra oficiais em `src/assets/breakpoints.js`: **celular** (até 640px, `media.celular`) e **tablet**
(até 899px, `media.tablet`). Em 900px o cabeçalho esconde os links e a busca e mostra o menu lateral. Fileiras de
chips rolam de lado dentro de si mesmas no celular, nunca a página.

### Named Rules
**A Regra dos Dois Cortes.** Telas novas e reformadas usam só `media.celular` e `media.tablet`. Nenhum valor de
breakpoint novo. Os valores antigos estão listados no `docs/ROADMAP.md` para migração.

**A Regra do LCP da Prateleira.** No celular, a prateleira de lombadas do hero é o LCP de propósito. Mudou o hero,
mede de novo com Lighthouse.

## Elevation & Depth

Sistema quase plano, com profundidade por camadas de tom (papel sobre creme) e sombras quentes reservadas a capas
e painéis flutuantes. As sombras levam o marrom da madeira (`rgba(41, 20, 16, …)`) e não o preto puro, exceto em
capas sobre fundo creme, que precisam de mais peso. `--shadow-soft` é só uma cor: escreva o `box-shadow` inteiro.

### Shadow Vocabulary
- **Capa em repouso** (`box-shadow: 0 6px 14px rgba(41, 20, 16, 0.18)`): capa no card de livro.
- **Capa levantada** (`box-shadow: 0 14px 28px rgba(41, 20, 16, 0.26)` + `translateY(-4px)`): hover do card.
- **Capa em destaque** (`box-shadow: 0 16px 32px rgba(0, 0, 0, 0.28)`): capas do leque e do livro em leitura no hero.
- **Painel** (`box-shadow: 0 8px 24px rgba(41, 20, 16, 0.08)`): card do livro em leitura dentro do hero.
- **Cabeçalho rolado** (`box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12)`): aparece quando a página rola mais de 8px.
- **Suave** (`box-shadow: 0 2px 10px var(--shadow-soft)`): elementos pequenos que precisam se descolar do fundo.

### Named Rules
**A Regra da Capa que Levanta.** Só a capa sobe no hover. Cards, chips e botões mudam cor ou borda, nunca posição.

## Shapes

Formas macias e previsíveis. Pílula (999px) para tudo que é ação ou filtro: botões do hero, chips de gênero,
pílula do Pomodoro, barra de progresso. Cantos de 8px para campos, botões de formulário e áreas clicáveis do card.
Capas e cards em linha com 6px, que é o canto de um livro de verdade. Selos com 4px. Painéis com 18px e o hero
com 24px. O anel de foco é coral, 3px, afastado 2px do elemento (no card, 2px vinho afastado 4px).

## Components

### Buttons
- **Shape:** pílula (999px) nas ações de página; 8px nos botões de formulário.
- **Primary:** fundo vinho, texto `--color-on-brand`, peso 500, altura mínima 2.75rem, padding `0.625rem 1.25rem`.
- **Hover / Focus:** fundo vai para `--color-brand-hover` em 150ms; foco com anel coral global.
- **Secondary:** fundo transparente, borda de linho, texto tinta; no hover só a borda fica vinho.
- **Form (`.done_button`):** retângulo de 8px, altura 2.875rem, largura total; desabilitado com opacidade 0.7.

### Chips
- **Style:** pílula transparente com borda de linho, texto tinta 0.9375rem, padding `0.5rem 1rem`.
- **State:** hover deixa a borda vinho (home) ou o fundo creme (catálogo). Selecionado (`aria-pressed="true"`
  ou link ativo) vira fundo vinho com texto claro.

### Cards / Containers
- **Card de capa (`CardBook`):** sem moldura nem fundo. A capa com sombra é o card; título (2 linhas) e autor
  (1 linha, esmaecido) ficam embaixo. No hover a capa levanta e o título fica vinho. Selo coral no canto superior
  esquerdo; barra de progresso coral sob a capa quando o livro está em leitura.
- **Card em linha (`RowCardBook`):** fundo creme, cantos de 6px, capa de 6rem colada à esquerda sem canto nem
  sombra, conteúdo com 1rem de padding. Hover troca o fundo para papel.
- **Hero:** fundo creme com padrão em SVG à direita, cantos de 24px, prateleira de lombadas na base.

### Inputs / Fields
- **Style:** fundo papel, borda de linho de 1px, cantos de 8px, altura 2.75rem, texto 0.9375rem. Rótulo acima em
  Roboto 500, 0.875rem.
- **Focus:** borda vinho e halo `0 0 0 3px rgba(98, 0, 0, 0.15)`, sem outline.
- **Error:** borda `--color-danger` com `aria-invalid="true"`.

### Navigation
- **Cabeçalho:** fixo no topo, creme a 90% com desfoque (vidro fosco), borda inferior de linho, altura 4.25rem
  (3.75rem abaixo de 900px). Links em Roboto 500, cor tinta; hover e ativo ficam vinho com uma barra de 3px que
  cresce do centro na base. Abaixo de 900px vira grade de três colunas (menu, logo, conta) com menu lateral.
- **Pílula do Pomodoro:** vinho com relógio e tempo em números tabulares; aparece no cabeçalho só com o timer ativo.

### Prateleira de lombadas
Assinatura da home: faixa de 6rem com lombadas em SVG repetidas na base do hero. É identidade e também o LCP no
celular; não remover nem trocar por imagem remota.

### Barra de progresso
Trilho creme em pílula, preenchimento coral, altura padrão 0.375rem, com percentual opcional ao lado.

## Do's and Don'ts

### Do:
- **Do** pegar cores de `src/assets/Colors.jsx` ou `var(--color-*)` e conferir os dois temas.
- **Do** usar Lora 700 só em h1 e títulos de seção, via `var(--font-display)`.
- **Do** usar pílula (999px) em ações e filtros e 8px em campos e botões de formulário.
- **Do** deixar a capa ser o destaque do card, com a sombra quente de repouso e de hover.
- **Do** usar `media.celular` e `media.tablet` em telas novas e reformadas.
- **Do** escrever o `box-shadow` inteiro com `var(--shadow-soft)` como cor.
- **Do** passar `state: { book }` em todo link para livro.

### Don't:
- **Don't** usar hex solto em componente (só as cores fixas de `Colors.jsx` sobre fundos fixos).
- **Don't** usar coral como botão ou link; ele é marcador de foco, progresso e selo.
- **Don't** usar vinho de fundo (`--color-brand`) como cor de texto; use `--color-link`.
- **Don't** criar breakpoint novo.
- **Don't** colocar moldura, borda ou fundo no card de capa.
- **Don't** deixar com cara de SaaS genérico: gradientes roxo-azul, cards de vidro, dashboard frio.
- **Don't** deixar com cara de loja: preços, selos de oferta ou vitrine de e-commerce.
