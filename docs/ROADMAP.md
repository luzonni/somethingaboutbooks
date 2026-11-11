# Roadmap: aprimoramentos futuros

Ideias levantadas durante o desenvolvimento e o QA, ordenadas por impacto. Cada item diz o problema que resolve
e um caminho sugerido. Ao começar um item, abra uma issue com o modelo "Sugerir uma melhoria".

## Prioridade alta

### Back-end com contas reais
- **Problema:** contas, estantes e reviews ficam só no navegador. Não há recuperação de senha, os dados não
  passam de um aparelho para outro e as reviews não são vistas por outras pessoas.
- **Caminho:** Firebase (plano gratuito), com Authentication para login e Firestore para a biblioteca.
  `src/services/authService.js` e `src/services/library.js` já concentram esse acesso e têm API assíncrona,
  então a troca fica restrita a esses arquivos.
- **Depende disso:** recuperação de senha, login com Google e sincronização entre aparelhos.

### Pré-renderização para carregar mais rápido
- **Situação:** o Lighthouse mobile da home subiu de 63 para 98 depois de corrigir o LCP que o Chrome não conseguia
  medir e o CLS do rodapé. O site continua sendo uma SPA, então nada aparece antes de o JavaScript ser baixado.
- **Caminho:** pré-renderizar as páginas públicas no build (modo framework do React Router com `prerender`) e trocar o
  styled-components, que gera CSS em tempo de execução, por CSS modules, já usados em parte do projeto.
- **Meta:** manter LCP abaixo de 2,5 s em redes lentas também no primeiro acesso, sem cache.

### Padronizar o layout entre celular e desktop
- **Problema:** cada tela foi adaptada ao celular com um ponto de quebra próprio: hoje são 10 valores diferentes
  (420, 480, 640, 800, 860, 899/900, 960 e 1080 px). Telas vizinhas mudam de layout em larguras diferentes, e cada
  ajuste novo tende a criar mais um valor. O estilo também está dividido entre styled-components (32 arquivos) e
  CSS modules (6 arquivos), sem regra de qual usar.
- **Caminho:** definir de 2 a 3 pontos de quebra (por exemplo, celular, tablet e desktop) como constantes
  compartilhadas e migrar as telas para eles. Decidir junto se as telas novas e reformadas usam CSS modules, que
  também atende à pré-renderização abaixo. Registrar as decisões num guia de interface (`docs/UI.md`).
- **Quando:** antes ou junto do redesenho das telas, para não espalhar valores novos.
- **Andamento:** 640 px (celular) e 900 px (tablet) definidos em `src/assets/breakpoints.js` e usados na nova tela
  inicial. Faltam as outras telas e a decisão entre styled-components e CSS modules.

### Google Books no site publicado
- **Situação:** a busca e a página do livro usam o Google Books quando há chave no `.env.local`, o que traz as
  edições brasileiras com capa e sinopse em português. O deploy no GitHub Pages ainda não recebe chave, então o site
  publicado continua só com a Open Library.
- **Caminho:** criar uma chave restrita ao domínio do site e à Books API, guardá-la como segredo do repositório e
  passá-la ao `npm run build` no workflow de deploy. A chave fica visível no código do navegador; para escondê-la,
  a alternativa é uma função serverless (Vercel ou Firebase) servindo de intermediária.
- **Atenção:** a cota gratuita (1.000 consultas por dia por projeto) é dividida entre todos os visitantes.

### Agrupar edições e traduções da mesma obra
- **Situação:** resolvido em parte. Com o Google Books, a busca encontra o título em português e junta edições
  repetidas pelo título e autor. Sem chave, a Open Library usa a edição em português de cada obra quando existe.
- **Falta:** ligar o livro do Google à obra da Open Library (pelo ISBN ou pelo Wikidata), para mostrar também as
  notas dos leitores, que o Google raramente tem.

## Prioridade média

### Social
- Reviews públicas na página do livro e feed de leituras de quem a pessoa segue (depende do back-end).
- Perfil público com URL compartilhável e prévia bonita em redes sociais.

### Busca
- Filtros por idioma, ano de publicação e número de páginas.
- Esconder imitações no Google Books (livros de outros autores com o título de um sucesso, como "The Fourth Wing
  Book 4") e edições de Portugal quando houver a brasileira.
- Filtros de gênero e ordenações "Mais lidos" e "Melhor avaliados" também com o Google Books; hoje eles usam só a
  Open Library.

### Leitura
- Lembretes da meta anual e da sequência de dias com Web Push (service worker já existe).
- Histórico de páginas lidas por sessão do Pomodoro, para gráficos de ritmo de leitura.
- Sinopses em português para livros da Open Library (os do Google Books já vêm em português quando a edição é
  brasileira).
- Guardar também as capas do Google Books no service worker, para elas aparecerem sem internet.

### Qualidade
- Cobertura de testes unitários de 67% para 75%: faltam BookPreview, AuthorPage, UserProfile e ReadingHistoryList.
- Testes de regressão visual com capturas do Playwright, nos dois temas.
- Previews de deploy por pull request (Netlify ou Vercel gratuitos).

## Prioridade baixa

- Monitoramento de erros em produção (Sentry, plano gratuito) e coleta de Web Vitals reais.
- Internacionalização (inglês e espanhol), começando por extrair os textos da interface.
- Revisão com leitores de tela reais (NVDA e VoiceOver); a checagem automática do axe já passa.
- Atalhos de teclado configuráveis (a tela de ajuda com `?` já existe).
