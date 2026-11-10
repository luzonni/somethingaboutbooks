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

### Agrupar edições e traduções da mesma obra
- **Problema:** a Open Library cadastra traduções como obras separadas ("Atomic Habits", "Hábitos Atômicos",
  "Atomowe nawyki"). Hoje removemos só títulos repetidos e escondemos obras sem capa.
- **Caminho:** usar o endpoint `/works/{id}/editions.json` para escolher a edição em português e agrupar obras pelo
  identificador do Wikidata, quando houver.

## Prioridade média

### Social
- Reviews públicas na página do livro e feed de leituras de quem a pessoa segue (depende do back-end).
- Perfil público com URL compartilhável e prévia bonita em redes sociais.

### Busca
- Filtros por idioma, ano de publicação e número de páginas.

### Leitura
- Lembretes da meta anual e da sequência de dias com Web Push (service worker já existe).
- Histórico de páginas lidas por sessão do Pomodoro, para gráficos de ritmo de leitura.
- Sinopses traduzidas para português quando a Open Library só tiver em inglês.

### Qualidade
- Cobertura de testes unitários de 66% para 75%: faltam BookPreview, AuthorPage, UserProfile e ReadingHistoryList.
- Testes de regressão visual com capturas do Playwright, nos dois temas.
- Previews de deploy por pull request (Netlify ou Vercel gratuitos).

## Prioridade baixa

- Monitoramento de erros em produção (Sentry, plano gratuito) e coleta de Web Vitals reais.
- Internacionalização (inglês e espanhol), começando por extrair os textos da interface.
- Revisão com leitores de tela reais (NVDA e VoiceOver); a checagem automática do axe já passa.
- Atalhos de teclado configuráveis (a tela de ajuda com `?` já existe).
