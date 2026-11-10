<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/logo-dark.png">
  <img src="docs/assets/logo-light.png" alt="SAB: Something About Books" width="220">
</picture>

# Something About Books

Encontre livros, organize suas estantes e crie o hábito de ler com o Pomodoro.

[![CI](https://github.com/luzonni/somethingaboutbooks/actions/workflows/ci.yml/badge.svg)](https://github.com/luzonni/somethingaboutbooks/actions/workflows/ci.yml)
[![CodeQL](https://github.com/luzonni/somethingaboutbooks/actions/workflows/codeql.yml/badge.svg)](https://github.com/luzonni/somethingaboutbooks/actions/workflows/codeql.yml)
[![Deploy](https://github.com/luzonni/somethingaboutbooks/actions/workflows/deploy.yml/badge.svg)](https://github.com/luzonni/somethingaboutbooks/actions/workflows/deploy.yml)
[![Licença](https://img.shields.io/github/license/luzonni/somethingaboutbooks)](LICENSE)

Projeto de Engenharia de Software da turma de Ciência da Computação da Unima Afya (AL).

**[Funcionalidades](#-funcionalidades)** ·
**[Tecnologias](#-tecnologias)** ·
**[Como rodar](#-como-rodar)** ·
**[Arquitetura](#-arquitetura)** ·
**[CI/CD](#-cicd)** ·
**[Documentação](#-documentação)** ·
**[Sobre o projeto](#-sobre-o-projeto)** ·
**[Equipe](#-equipe)**

</div>

---

## ✨ Funcionalidades

- **Busca de livros** por título, autor ou assunto, com filtro por gênero e URL compartilhável
- **Sugestões na busca**: livros aparecem enquanto você digita, junto com as buscas recentes
- **Página do livro** com sinopse, autor, notas e assuntos
- **Estantes**: Lendo, Quero ler e Lido, além de favoritos
- **Listas personalizadas** para organizar os livros
- **Reviews** com nota e comentário
- **Pomodoro** ligado ao livro em leitura, com ciclos, som e tempo acumulado
- **Perfil e conta**: estatísticas, edição de dados, troca de senha e exclusão da conta
- **Página do autor** com biografia, links e obras sem repetições
- **Meta anual** de leitura, gráfico dos últimos 7 dias e sequência de dias lendo
- **Progresso por páginas** nos livros em leitura
- **Backup**: exportar e importar a biblioteca em JSON
- **Tema claro e escuro**, avisos na tela e modo offline
- **Atalhos de teclado**, com a lista completa ao apertar `?`
- **App instalável** (PWA)
- **Layout responsivo**, com navbar para desktop e menu lateral para mobile

---

## 🧰 Tecnologias

| Área | Ferramentas |
| --- | --- |
| Interface | React 18, Vite, React Router e styled-components |
| Dados de livros | [Open Library API](https://openlibrary.org/developers/api), aberta e sem chave |
| Dados do usuário | `localStorage` do navegador (back-end com Firebase planejado) |
| Testes | Vitest, Testing Library, Playwright e axe-core |
| Qualidade | ESLint, GitHub Actions, CodeQL e Dependabot |

---

## 🚀 Como rodar

Requer Node.js 22.12 ou superior (veja `.nvmrc`).

```bash
npm install
npm run dev
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve a versão de produção localmente |
| `npm test` | Roda os testes unitários |
| `npm run test:coverage` | Testes unitários com relatório de cobertura em `coverage/` |
| `npm run test:e2e` | Testes ponta a ponta e de acessibilidade com Playwright |
| `npm run test:lighthouse` | Lighthouse no build de produção (rode `npm run build` antes) |
| `npm run lint` | Verifica o código com ESLint |
| `npm run check` | Lint e testes unitários, o que o CI exige |

Não é preciso configurar chaves: a API usada é aberta.

Como o site usa rotas no navegador, a hospedagem precisa redirecionar todas as URLs para o `index.html`.
O repositório já traz essa configuração para Vercel (`vercel.json`), Netlify (`public/_redirects`) e GitHub Pages
(`404.html` gerado no deploy).

---

## 🧱 Arquitetura

| Pasta | Conteúdo |
| --- | --- |
| `src/api` | Cliente da [Open Library](https://openlibrary.org/developers/api), com cache e tratamento de erros |
| `src/services` | Contas, biblioteca e acesso ao `localStorage` |
| `src/context` | Estado global: autenticação, biblioteca, Pomodoro, tema e avisos |
| `src/hooks` | Hooks reutilizáveis |
| `src/utils` | Regras puras: validação, timer e formatação de texto |
| `src/components` | Componentes compartilhados |
| `src/pages` | Páginas da aplicação |
| `public/sw.js` | Service worker: guarda capas e arquivos do site para abrir offline |
| `e2e` | Testes ponta a ponta com a Open Library simulada |

### Armazenamento local

Ainda não há back-end: contas, estantes, reviews e sessões ficam no `localStorage` do navegador. Por isso os dados não acompanham o usuário entre aparelhos e as reviews não são compartilhadas com outras pessoas. As senhas são guardadas como hash (PBKDF2), mas isso não substitui uma autenticação real em servidor.

`src/services/authService.js` e `src/services/library.js` concentram esse acesso, para facilitar a troca por um back-end como o Firebase.

---

## 🔁 CI/CD

Tudo roda com recursos gratuitos do GitHub:

| Workflow | Quando | O que faz |
| --- | --- | --- |
| **CI** | Toda PR e push na `main` | Lint, testes com piso de cobertura, build, testes E2E com acessibilidade, Lighthouse e auditoria de dependências |
| **Deploy** | Depois que o CI passa na `main` | Publica no GitHub Pages em `/<repositório>/` |
| **CodeQL** | PRs, `main` e toda segunda | Análise de segurança do código |
| **Dependabot** | Toda segunda | PRs agrupadas de atualização de pacotes e actions |

Para ativar o deploy, alguém com acesso de admin precisa abrir **Settings > Pages** uma vez e escolher
**Source: GitHub Actions**. Antes disso, o workflow de deploy só registra um aviso.

---

## 📋 Documentação

- [Relatório de QA](docs/QA.md): o que foi testado, bugs corrigidos e pendências
- [Roadmap](docs/ROADMAP.md): aprimoramentos futuros
- [Como contribuir](CONTRIBUTING.md) e [Segurança](SECURITY.md)

---

## 🎯 Sobre o projeto

O SAB nasceu como um site responsivo para leitores organizarem suas leituras e descobrirem novos livros,
funcionando como uma rede social de leitura. A proposta parte de uma observação do educador Pierluigi Piazzi:
a prática da leitura tem diminuído com a modernização, e uma ferramenta simples de acompanhamento ajuda a
criar e manter o hábito.

| | |
| --- | --- |
| **O quê** | Site web responsivo para buscar, organizar e comentar livros |
| **Por quê** | Incentivar o hábito de leitura com estantes, metas e Pomodoro |
| **Para quem** | Leitores em geral que querem organizar leituras e descobrir livros |
| **Onde** | Navegador, no computador ou no celular (iOS e Android), e instalável como app |
| **Quando** | Primeira versão entregue em novembro de 2024, com melhorias contínuas desde então |
| **Como** | React no front-end e Open Library como fonte de dados; back-end com Firebase planejado |
| **Quanto** | Gratuito, usando apenas serviços com plano grátis |

---

## 👥 Equipe

| Pessoa | Frente |
| --- | --- |
| Lucas Zonzini | Front-end |
| Caio Renato | Front-end |
| Caio Gabriel | Back-end |
| Murilo Barros | Back-end |
| Francisco | Colaboração geral |

## 📄 Licença

Distribuído sob a [licença MIT](LICENSE).
