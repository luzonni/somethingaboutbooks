# Relatório de QA

## Atualização: Google Books

Data: 11/11/2026 · Branch: `feat/google-books-api`

| Área | Situação |
| --- | --- |
| Testes unitários e de componentes | ✅ 193 passando, cobertura de 67% das linhas |
| Testes ponta a ponta (desktop e celular) | ✅ 45 passando, com o Google Books desligado |
| Lint | ✅ sem erros |
| Vulnerabilidades em dependências (`npm audit`) | ✅ 0 |
| Lighthouse | Não medido de novo: a home não mudou de fonte |

### Como foi testado

- **Unitários:** cliente do Google Books (filtros, capas, sinopse, edição sem capa), escolha da fonte em
  `src/api/books.js` (Google na busca, Open Library nos gêneros, volta para a Open Library se o Google falhar ou não
  houver chave), ordenação dos resultados e crédito das fontes no rodapé. Os testes nunca chamam o Google: a chave é forçada vazia no Vitest e no
  Playwright.
- **Exploratório com as APIs reais:** buscas em português e inglês ("Quarta Asa", "A hipótese do amor",
  "Corte de Espinhos e Rosas", "Os Sete Maridos de Evelyn Hugo", "The Great Gatsby", "Fourth Wing", "ali hazelwood"),
  página do livro, sugestões e "Mais de" um autor.
- **Segurança da chave:** chamada de outro site recusada (403), chave fora dos arquivos versionados e do `dist/`
  gerado pelos testes.

### Bugs encontrados e corrigidos

| # | Problema | Gravidade | Correção |
| --- | --- | --- | --- |
| 1 | Livros traduzidos recentemente não eram encontrados pelo título em português ("Quarta Asa"): a Open Library não tem essas edições | Alta | Google Books na busca e na página do livro |
| 2 | Página do livro aberta pela sugestão, recarregada ou por link mostrava título e capa em inglês | Média | Sugestão passa os dados do livro; a obra usa a edição em português |
| 3 | Edição em português na Open Library com foto pessoal no lugar da capa ("A hipótese do amor") | Média | Capas do Google Books, enviadas pelas editoras |
| 4 | Sugestões traziam cadastros sem capa, sem autor ou sem relação com a busca antes do livro certo | Média | Ordenação por correspondência com a busca, capa e autor |
| 5 | Lista "Em alta" com títulos em inglês | Baixa | Títulos e capas da edição em português, numa consulta a mais |

### Pendências e riscos conhecidos

- **Site publicado sem Google Books:** o deploy não recebe chave e continua só com a Open Library (ver
  [roadmap](ROADMAP.md)).
- **Cota diária:** cada chave tem 1.000 consultas por dia por projeto, divididas entre todos que a usam. Ao acabar,
  o app volta para a Open Library.
- **Dados do Google Books:** imitações de títulos famosos, edições de Portugal misturadas às brasileiras e poucas
  notas de leitores.
- **Offline:** o service worker guarda só as capas da Open Library.

## Versão anterior: melhorias v3

Data: 10/11/2026 · Branch: `feat/melhorias-v3` (atualiza o relatório da `feat/melhorias-v2`)

### Resumo

| Área | Situação |
| --- | --- |
| Testes unitários e de componentes | ✅ 171 passando, cobertura de 66% das linhas |
| Testes ponta a ponta (desktop e celular) | ✅ 45 passando |
| Acessibilidade automática (axe, WCAG A e AA, temas claro e escuro, 9 páginas, sugestões de busca e modal de atalhos) | ✅ sem problemas graves ou críticos |
| Lint | ✅ sem erros |
| Vulnerabilidades em dependências (`npm audit`) | ✅ 0 |
| Lighthouse mobile: acessibilidade / boas práticas / SEO | ✅ 100 / 100 / 92 |
| Lighthouse mobile: performance | ✅ home 98 (LCP 2,0 s) e /sobre 97 (CLS 0,001) |

Aprovado para merge, com as pendências documentadas abaixo e no [roadmap](ROADMAP.md).

### Como foi testado

- **Unitários (Vitest + Testing Library):** regras de negócio (biblioteca, metas, sequência de dias, backup, Pomodoro,
  validações, limpeza de dados da API) e componentes com estado (navbar, tema, avisos, meta anual, gráfico,
  configurações da conta).
- **Ponta a ponta (Playwright):** a Open Library é simulada com dados fixos (`e2e/fixtures.js`), para os testes serem
  estáveis no CI. Os fluxos cobrem busca, ordenação, rolagem infinita, página do livro e do autor, cadastro, login,
  estantes, reviews, Pomodoro com atalhos, meta anual, listas, backup, tema, modo offline e menu mobile.
- **Acessibilidade:** axe-core em 9 páginas, nos dois temas, e também com as sugestões de busca e o modal de atalhos
  abertos.
- **Exploratório com a API real:** roteiros no navegador contra o build de produção, em desktop (1440 px) e celular
  (390 px), percorrendo todas as páginas e verificando erros de console e rolagem horizontal.
- **Performance:** Lighthouse mobile (4G simulado e CPU 4× mais lenta) no build de produção, agora também no CI
  (`npm run test:lighthouse`). As causas do LCP ausente e do CLS foram confirmadas com `PerformanceObserver` no Chrome.

### Bugs encontrados e corrigidos

| # | Problema | Gravidade | Correção |
| --- | --- | --- | --- |
| 1 | `react-router-dom` com vulnerabilidade alta (open redirect) e Vitest com vulnerabilidade crítica | Alta | React Router 7, Vite 8 e Vitest 5; `npm audit` zerado |
| 2 | Tema claro sem as variáveis de cor: navbar transparente e bordas sumindo ao rolar | Alta | Variáveis restauradas e teste que confere todas as cores nos dois temas |
| 3 | Contraste insuficiente de links e botões no tema escuro (falha WCAG AA) | Média | Novo token `--color-link` para textos na cor da marca |
| 4 | Excluir a conta levava ao login, não à página inicial | Média | Saída voluntária registrada no `AuthContext`; teste de regressão |
| 5 | Capas baixadas de novo a cada recarga em desenvolvimento | Média | Service worker guarda as capas também no `npm run dev` |
| 6 | Obras repetidas e sem capa na página do autor e na busca | Média | Remoção de duplicatas pelo título; obras sem capa escondidas por padrão |
| 7 | Etiquetas técnicas como `series:Harry_Potter` e livros redirecionados que nunca carregavam | Média | Limpeza das etiquetas e suporte a redirecionamentos da API (PR #14) |
| 8 | Espaço disparava o atalho do Pomodoro duas vezes com um botão focado | Baixa | Atalhos ignoram teclas que já ativam botões |
| 9 | Animação da busca repintava a página a cada quadro | Baixa | Animação só com opacidade e escala; trabalho da thread principal caiu de 14,3 s para cerca de 5 s |
| 10 | Carrosséis da home impediam o Chrome de medir o LCP (`NO_LCP`): scroll-snap com `scroll-behavior: smooth` reajustava a rolagem quando os livros chegavam | Alta | Rolagem suave só no clique das setas; home mobile de 63 para 98 |
| 11 | Rodapé aparecia no meio da tela do celular enquanto a página carregava e era empurrado depois (CLS 0,385 em `/sobre`) | Média | `main` com altura mínima da tela; CLS 0,001 |
| 12 | `og:image` relativo: a prévia ao compartilhar o link não aparecia, e no GitHub Pages perdia o subcaminho | Baixa | URL absoluta gerada no build a partir de `SITE_URL` |

Os itens 2, 3 e 4 foram introduzidos durante o desenvolvimento da `feat/melhorias-v2` e corrigidos antes do merge. Os itens 10 e 11 foram
encontrados com o Lighthouse CI adicionado na `feat/melhorias-v3`.

### Pendências e riscos conhecidos

- **Performance:** medida localmente com a API real; no CI, performance e LCP só geram aviso, porque variam entre
  máquinas. A pré-renderização continua no roadmap para o primeiro acesso em redes lentas.
- **Contas só no navegador:** não é autenticação real. Documentado em `SECURITY.md` e na política de privacidade.
- **Dados da Open Library:** sinopses muitas vezes em inglês e traduções cadastradas como obras diferentes (atacado na atualização do Google Books, acima).
- **GitHub Pages:** o deploy só roda depois que alguém com acesso de admin ativar o Pages
  (Settings > Pages > Source: GitHub Actions). Até lá o workflow apenas avisa e não falha.
- **Cobertura de testes unitários:** 66% das linhas, com piso de 62% no Vitest. Ainda faltam BookPreview, AuthorPage,
  UserProfile e ReadingHistoryList, cobertas hoje pelos testes ponta a ponta.
