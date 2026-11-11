# Como contribuir

## Ambiente

Requer Node.js 22.12 ou superior (veja `.nvmrc`).

```bash
npm install
npm run dev
```

Opcional: com uma chave própria do Google Books no `.env.local`, a busca traz as edições brasileiras.
Veja "Chave do Google Books" no README. Cada pessoa usa a sua chave; nunca a coloque em arquivos versionados.

## Antes de abrir uma PR

```bash
npm run check      # lint e testes unitários
npm run test:e2e   # testes ponta a ponta e acessibilidade (usa o Chrome instalado)
```

- Um commit por mudança, com mensagem no padrão `tipo(escopo): descrição`, por exemplo `feat(busca): adiciona filtro por ano`.
  Tipos usados: `feat`, `fix`, `perf`, `refactor`, `style`, `test`, `docs`, `ci`, `cd`, `build`, `chore`.
- Cores vêm de `src/assets/Colors.jsx` (variáveis de tema). Não use hexadecimais soltos nos componentes,
  senão o tema escuro quebra.
- Textos da interface em português.

## Pipeline

Toda PR roda lint, testes com cobertura, build, testes E2E com acessibilidade, auditoria de dependências e CodeQL.
Ao entrar na `main`, o site é publicado no GitHub Pages.
