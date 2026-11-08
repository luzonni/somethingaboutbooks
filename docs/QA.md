# Relatório de QA

Data: 08/11/2026 · Branch: `feat/melhorias-v2`

## Resumo

| Área | Situação |
| --- | --- |
| Testes unitários e de componentes | ✅ 133 passando |
| Testes ponta a ponta (desktop e celular) | ✅ 39 passando |
| Acessibilidade automática (axe, WCAG A e AA, temas claro e escuro, 9 páginas) | ✅ sem problemas graves ou críticos |
| Lint | ✅ sem erros |
| Vulnerabilidades em dependências (`npm audit`) | ✅ 0 |
| Lighthouse mobile: acessibilidade / boas práticas / SEO | ✅ 100 / 100 / 92 |
| Lighthouse mobile: performance | ⚠️ 63 (ver Pendências) |

Aprovado para merge, com as pendências documentadas abaixo e no [roadmap](ROADMAP.md).

## Como foi testado

- **Unitários (Vitest + Testing Library):** regras de negócio (biblioteca, metas, sequência de dias, backup, Pomodoro,
  validações, limpeza de dados da API) e componentes com estado (navbar, tema, avisos, meta anual, gráfico,
  configurações da conta).
- **Ponta a ponta (Playwright):** a Open Library é simulada com dados fixos (`e2e/fixtures.js`), para os testes serem
  estáveis no CI. Os fluxos cobrem busca, ordenação, rolagem infinita, página do livro e do autor, cadastro, login,
  estantes, reviews, Pomodoro com atalhos, meta anual, listas, backup, tema, modo offline e menu mobile.
- **Acessibilidade:** axe-core em 9 páginas, nos dois temas.
- **Exploratório com a API real:** roteiros no navegador contra o build de produção, em desktop (1440 px) e celular
  (390 px), percorrendo todas as páginas e verificando erros de console e rolagem horizontal.
- **Performance:** Lighthouse mobile (4G simulado e CPU 4× mais lenta) no build de produção.

## Bugs encontrados e corrigidos

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

Os itens 2, 3 e 4 foram introduzidos durante o desenvolvimento desta branch e corrigidos antes do merge.

## Pendências e riscos conhecidos

- **Performance mobile 63, LCP 5,2 s:** limite da arquitetura SPA (nada aparece antes do JavaScript). FCP melhorou de
  1,7 s para 0,9 s nesta branch. Solução proposta no roadmap: pré-renderização.
- **Contas só no navegador:** não é autenticação real. Documentado em `SECURITY.md` e na política de privacidade.
- **Dados da Open Library:** sinopses muitas vezes em inglês e traduções cadastradas como obras diferentes.
- **GitHub Pages:** o deploy só roda depois que alguém com acesso de admin ativar o Pages
  (Settings > Pages > Source: GitHub Actions). Até lá o workflow apenas avisa e não falha.
- **Cobertura de testes unitários:** 53% das linhas. As páginas são cobertas principalmente pelos testes ponta a ponta.
