# Plano de melhorias: tela inicial

Plano para corrigir o que a crítica de design da tela inicial (`/impeccable critique`, 15/11/2026) encontrou. A
crítica deu **27/40 (Aceitável)**: o hero foi bem pensado para o produto, mas o hábito de leitura, que o
`PRODUCT.md` põe no centro do SAB, não aparece na home em nenhum estado.

As linhas citadas valem para o código de 15/11/2026. Se o arquivo mudou, procure pelo nome da função ou da classe.

## Como usar este documento

1. Siga as etapas na ordem: cada uma depende da anterior (a linha de hábito da etapa 1 substitui o subtítulo
   na etapa 2, e a etapa 4 valida tudo).
2. Uma PR por etapa, com commits no formato `tipo(escopo): descrição` e `npm run check` antes de abrir.
3. Atualize o **Status** da etapa e marque as caixas na mesma PR que a conclui.
4. Ao fechar a última etapa, registre o resultado em `docs/QA.md` e rode a crítica de novo para comparar a nota.

## Resumo

| Etapa | Problema da crítica | Prioridade | Status |
| --- | --- | --- | --- |
| 1. Onboard: hábito de leitura em destaque | O hábito não aparece na home | P1 | Não iniciada |
| 2. Layout: reorganização da tela inicial | Para quem lê, a busca vem antes do "Continuar lendo" | P1 | Não iniciada |
| 3. Colorize: cores e consistência visual | Botão coral, placeholder ilegível, hex solto, raios fora da escala | P2 | Não iniciada |
| 4. Polish: refinamento e validação final | Conferir tudo nos dois temas e tamanhos | - | Não iniciada |

Ficam fora deste plano, para uma rodada seguinte: reorganizar o bloco de gêneros (dois títulos e 8 chips), ajustar
os carrosséis no celular (2 capas sem indicação de rolagem) e trocar "Melhor avaliados" por "Mais bem avaliados" em
`src/api/openLibrary.js:26`.

---

## Etapa 1. Onboard: hábito de leitura em destaque

**Status:** Não iniciada

### Objetivo

Mostrar na home, para quem entrou na conta, o estado do hábito de leitura (sequência de dias, meta do ano e tempo
lido), e levar quem está entre livros para a própria lista "Quero ler" em vez do catálogo.

### Problemas identificados

- Quem entrou não vê sequência de dias, meta nem minutos lidos. Isso contradiz o Princípio 1 do `PRODUCT.md` ("toda
  tela deve levar de volta à leitura do livro atual") e o posicionamento ("hábito de leitura, não rede social").
- Quem está sem livro em leitura e tem livros em "Quero ler" vê esses livros no leque do hero, mas o leque tem
  `aria-hidden` e não é clicável (`CoverFan`, `src/pages/Home/index.jsx:375-395`).
- A `figcaption` do leque ("Na sua lista Quero ler" / "Entre os mais bem avaliados") é lida pelo leitor de tela,
  mas as capas que ela descreve estão escondidas dele (`index.jsx:384` e `391`).
- O visitante só conhece o diferencial do SAB por 6 palavras do subtítulo.

### Componentes e arquivos envolvidos

- `src/pages/Home/index.jsx`: `Hero`, `CoverFan`, estilos `.hero__*` e `.fan__*`.
- `src/utils/readingStats.js`: `readingStreak`, `minutesByDay` (já existem).
- `src/services/library.js`: `libraryStats` (meta do ano e livros lidos no ano), `SHELVES`.
- `src/context/LibraryContext`: `useLibrary` para ler sessões, metas e estantes.
- `src/components/GoalCard`: referência de como a meta já é exibida no Pomodoro e no histórico.
- `src/pages/Home/Home.test.jsx`.

### Alterações propostas

- [ ] Linha de hábito abaixo do h1 para quem entrou, montada com funções que já existem, sem cálculo novo. Exemplo:
  "4 dias seguidos · 3 de 12 livros em 2026 · 45 min nesta semana".
  - Mostrar só os itens que existem: sem meta definida, omitir a meta; sem sessões, um convite curto como
    "Comece sua sequência com uma sessão de leitura", com link para `/pomodoro`.
  - Texto simples, sem emoji, sem animação de números.
- [ ] Leque clicável quando vem da lista "Quero ler": cada capa vira link para o livro (`state: { book }`) com rótulo
  acessível, e um botão "Começar a ler" que leva ao primeiro livro da lista.
- [ ] Quando o leque vem dos mais bem avaliados (lista "Quero ler" vazia), manter decorativo e remover a
  `figcaption` do leitor de tela (ou tirar o `aria-hidden` das capas e dar a elas texto alternativo).
- [ ] Visitante: nenhuma mudança de dados (não há sessões). Avaliar na etapa 2 se o subtítulo cita o Pomodoro.

### Critérios de aceitação

- Com sessões registradas e meta definida, a home mostra sequência, meta e minutos da semana, com os mesmos números
  das telas do Pomodoro e do histórico.
- Sem meta, sem sessões ou sem nenhum dos dois, a linha se adapta e nunca mostra "0 de null" ou "0 min".
- Com "Quero ler" preenchida e nada em leitura, dá para abrir um livro da lista a partir do hero, com mouse,
  teclado e leitor de tela.
- Nenhum texto lido pelo leitor de tela descreve conteúdo escondido.
- Funciona nos temas claro e escuro, em 390 px e 1440 px, sem rolagem horizontal.

### Testes necessários

- `Home.test.jsx`:
  - linha de hábito com sessões em dias seguidos, meta e minutos (usar datas fixas);
  - sem meta; sem sessões (mostra o convite);
  - leque com "Quero ler": links com nome acessível e `state.book`;
  - leque com mais bem avaliados: sem `figcaption` exposta.
- `readingStats` já tem testes; acrescentar caso só se a linha usar uma combinação nova.
- e2e: `a11y.spec.js` continua sem violações na home nos dois temas.

---

## Etapa 2. Layout: reorganização da tela inicial

**Status:** Não iniciada

### Objetivo

Para quem tem livro em leitura, deixar "Continuar lendo" como primeira ação da página, sem texto repetido e sem
competir com a busca, principalmente no celular.

### Problemas identificados

- No celular, o botão "Continuar lendo" fica a cerca de 700 px do topo, abaixo de um subtítulo de 3 linhas e da
  busca, e o card do livro em leitura vem depois (captura em 390x844).
- O subtítulo "Você está lendo {título}. Que tal mais uma sessão de leitura hoje?" repete o título que o card ao lado
  já mostra (`Hero`, `index.jsx:402-404`).
- A busca aparece no hero em todos os estados (`index.jsx:412-413`), embora já exista no cabeçalho.
- Quem entrou sem livro em leitura recebe a chamada "Que tal um livro novo?" acima de "Boa leitura, {nome}!", e o
  subtítulo de venda do visitante ("Busque entre milhões de livros…").

### Componentes e arquivos envolvidos

- `src/pages/Home/index.jsx`: `Hero`, `ReadingCard`, estilos `.hero`, `.hero__text`, `.hero__search`,
  `.hero__actions`, `.reading`.
- `src/assets/breakpoints.js`: `media.celular`, `media.tablet`.
- `src/components/Search` (só para confirmar que o cabeçalho cobre a busca).
- `src/components/MyHeader` (a busca some do cabeçalho abaixo de 900 px).
- `src/pages/Home/Home.test.jsx`, `e2e/mobile.spec.js`.

### Alterações propostas

- [ ] Com livro em leitura: trocar o subtítulo pela linha de hábito da etapa 1 e tirar a busca do hero.
  - Abaixo de 900 px o cabeçalho esconde a busca, então nesse caso manter um acesso à busca (por exemplo o link
    "Explorar livros" para `/books`) para não deixar o celular sem busca.
- [ ] Ordem do hero no celular (`media.celular`) com livro em leitura: chamada, h1, card do livro em leitura,
  "Continuar lendo". O card passa a ficar antes dos botões.
- [ ] Sem livro em leitura e com conta: chamada e subtítulo próprios, coerentes com "Boa leitura" (por exemplo
  chamada "Escolha a próxima leitura" e subtítulo apontando para a lista "Quero ler" ou para a busca).
- [ ] Visitante: manter a busca no hero (é a ação principal de quem chega) e o layout atual.
- [ ] Não mexer na prateleira de lombadas (`.hero__shelf`): ela é o LCP da home no celular.

### Critérios de aceitação

- Com livro em leitura, em 390x844, o botão "Continuar lendo" aparece sem rolar a página.
- Nenhum texto do hero repete o título do livro mostrado no card.
- Quem está sem livro em leitura não recebe a frase de venda do visitante.
- O visitante continua vendo a busca no hero.
- No celular há sempre um caminho para buscar livros a partir da home.
- A prateleira de lombadas continua visível e continua sendo o LCP no celular.

### Testes necessários

- `Home.test.jsx`: textos e presença da busca por estado (visitante, com conta sem livro, lendo com e sem
  progresso); ajustar os testes atuais que verificam o subtítulo e a busca.
- e2e `mobile.spec.js`: com livro em leitura (estado salvo no `localStorage`), "Continuar lendo" visível na primeira
  tela, sem rolagem horizontal.
- Lighthouse mobile da home (`npm run build && npm run test:lighthouse`): LCP e nota sem queda em relação a ~98.

---

## Etapa 3. Colorize: cores e consistência visual

**Status:** Não iniciada

### Objetivo

Alinhar a busca e o cabeçalho às regras do `DESIGN.md`: vinho como única cor de ação, cores só por variável, raios
dentro da escala e placeholder legível nos dois temas.

### Problemas identificados

- O botão de enviar da busca é coral (`src/components/Search/index.jsx:50`). O `DESIGN.md` diz que o coral é
  marcador (foco, progresso, selo) e nunca botão ("A Regra da Única Ação"). Ele é o elemento mais saturado do hero
  e tira o foco do "Continuar lendo" e do "Explorar livros".
- O placeholder animado da busca não tem estilo `::placeholder` e usa o cinza padrão do Chrome (`#757575`):
  contraste de 4,0:1 no tema claro e 3,3:1 no escuro, abaixo de 4,5:1.
- Hex solto `#8a1616` em gradiente, fora da paleta e sem versão escura:
  `src/components/MyHeader/LoginTab/index.jsx:50` e `src/components/MyHeader/MobileMenu.jsx:120`.
- Raios fora da escala (4, 6, 8, 18, 24, 999 px): 12 px na busca (`Search/index.jsx:27, 40, 52, 82`), 10 px no
  `LoginTab` (`:123`), 3 px na busca (`:136`) e 2 px na capa gerada (`BookCover/index.jsx:65`).

### Componentes e arquivos envolvidos

- `src/components/Search/index.jsx`.
- `src/components/MyHeader/LoginTab/index.jsx`, `src/components/MyHeader/MobileMenu.jsx`.
- `src/components/BookCover/index.jsx` (só se o 2 px não for intencional).
- `src/assets/Colors.jsx` e `src/components/Reset/index.jsx`, se for preciso uma variável nova.
- `DESIGN.md` e `.impeccable/design.json`, se a escala de raios mudar.

### Alterações propostas

- [ ] Botão da busca com fundo `DarkRed` (`--color-brand`), texto `--color-on-brand` e hover
  `--color-brand-hover`, igual ao botão principal. Conferir o ícone nos dois temas.
- [ ] `::placeholder` da busca com `--color-text-muted` (`DarkGray`).
- [ ] Trocar `#8a1616` por uma cor da paleta. Se o gradiente for mantido, usar `--color-brand-hover` com
  `--color-brand`; se não, fundo vinho liso.
- [ ] Raios: 12 px e 10 px viram 8 px (campo). Revisar 3 px e 2 px: se forem detalhes intencionais (indicador e
  lombada da capa gerada), registrar a exceção no `DESIGN.md` em vez de mudar.
- [ ] Rodar `.claude/skills/impeccable/scripts/impeccable detect` nos arquivos alterados para confirmar que os
  avisos reais sumiram (os falsos positivos de sombra e fonte estão descritos na crítica).

### Critérios de aceitação

- Nenhum botão da home usa coral como fundo.
- O placeholder da busca tem contraste de pelo menos 4,5:1 nos temas claro e escuro.
- `grep -rn "#8a1616" src` não encontra nada.
- Os raios da busca, do `LoginTab` e do `MobileMenu` estão na escala do `DESIGN.md`, ou a exceção está documentada.
- A busca do cabeçalho (versão compacta) e a do hero continuam com a mesma aparência entre si.

### Testes necessários

- `Reset.test.jsx` continua passando (garante que toda variável existe nos dois temas), principalmente se uma cor
  nova for criada.
- `Search.test.jsx` continua passando; não há teste de cor para criar.
- e2e `a11y.spec.js`: axe sem violações de contraste na home, na busca e no menu nos dois temas.
- Conferência visual do cabeçalho (desktop e menu lateral do celular), da busca do hero e da busca compacta, nos dois
  temas.

---

## Etapa 4. Polish: refinamento e validação final

**Status:** Não iniciada

### Objetivo

Revisar o resultado das três etapas como um todo, corrigir detalhes e confirmar que a home não perdeu desempenho,
acessibilidade nem cobertura de testes.

### Problemas identificados

- As etapas 1 a 3 mexem no hero, que é a área mais sensível da home: concentra o LCP, os estados por usuário e as
  animações de entrada.
- Pontos da crítica que só foram vistos pelo código e precisam de conferência visual: estado de erro das listas,
  skeletons, dropdown de sugestões e o celular no tema escuro.

### Componentes e arquivos envolvidos

- Tudo o que as etapas 1 a 3 alteraram.
- `docs/QA.md`, `docs/ROADMAP.md`, `DESIGN.md` e `.impeccable/design.json` (se algum padrão novo surgir, como a linha
  de hábito).

### Alterações propostas

- [ ] Passada visual nos 4 estados (visitante, com conta sem livro, lendo sem progresso, lendo com progresso), nos
  dois temas, em 390 px e 1440 px.
- [ ] Conferir espaçamentos e alinhamentos do hero novo contra a escala do `DESIGN.md` (passos de 0,25 rem).
- [ ] Conferir as animações de entrada (`riseIn`, `fadeIn`) com os elementos novos e com `prefers-reduced-motion`.
- [ ] Se a linha de hábito virar padrão, documentar no `DESIGN.md` (componente) e no `design.json`.
- [ ] Registrar no `docs/QA.md` o que foi testado, a nota do Lighthouse e os riscos conhecidos.
- [ ] Rodar `/impeccable critique` na tela inicial de novo e registrar a nova nota ao lado de 27/40.

### Critérios de aceitação

- `npm run check` passa (lint e testes unitários).
- `npm run test:coverage` respeita os pisos de `vite.config.js`.
- `npm run test:e2e` passa, incluindo axe nos dois temas.
- Lighthouse mobile da home sem queda em relação a ~98 e LCP ainda na prateleira de lombadas.
- Sem rolagem horizontal em 390 px.
- A nova crítica não repete nenhum dos problemas P1 e P2 tratados neste plano.

### Testes necessários

- `npm run check`
- `npm run test:coverage`
- `npm run test:e2e`
- `npm run build && npm run test:lighthouse`
- Conferência manual nos 4 estados, nos dois temas e nos dois tamanhos.
