# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Something About Books (SAB): a React 18 + Vite SPA for finding books, organizing shelves and reading with a Pomodoro timer. Class project (Ciência da Computação, Unima Afya). All UI text, code comments, docs and commit messages are in Brazilian Portuguese; keep it that way.

## Commands

Node 22.12+ (`.nvmrc`).

```bash
npm run dev            # http://localhost:5173 (port matters: the Google Books key is restricted to it)
npm run check          # lint + unit tests: what CI requires
npm test               # Vitest, all unit tests
npx vitest run src/api/openLibrary.test.js          # one file
npx vitest run -t "prefere a edição em português"   # one test by name
npm run test:coverage  # floors in vite.config.js: lines/statements 62, functions 57, branches 53
npm run test:e2e       # Playwright: builds, serves on :4173, uses the installed Chrome locally
npx playwright test e2e/book.spec.js --project=desktop  # one e2e file (mobile.spec.js runs only in project "mobile")
npm run build && npm run test:lighthouse
```

## Architecture

**No back-end.** Accounts, shelves, reviews, Pomodoro sessions and goals live in `localStorage` under `sab:*` keys. `src/services/storage.js` (`readJson`/`writeJson`, never throw) is the only raw access. `authService.js` (PBKDF2 password hashes) and `library.js` concentrate persistence behind async APIs so a planned Firebase back-end can replace just those files. React state is exposed via contexts in `src/context` (Auth, Library, Pomodoro, Theme, Toast), all mounted in `src/Routes.jsx`, where pages are lazy-loaded and preloaded on idle.

**Book data comes from two APIs, chosen in `src/api/books.js`:**
- `googleBooks.js`: text search, search suggestions, book page and "Mais de <autor>". It's active only when `VITE_GOOGLE_BOOKS_KEY` is set in `.env.local` (gitignored; template in `.env.example`). Google book ids are prefixed `g-` (`isGoogleId`), so routes like `/books/g-abc` coexist with Open Library ids like `/books/OL123W`.
- `openLibrary.js`: home lists (trending, genres, top rated), genre filters, "Mais lidos"/"Melhor avaliados" sorts, author pages, and the fallback whenever Google is missing or fails (e.g. quota). Also holds shared helpers (`dedupeBooks`, `rankBooks`, `cleanText`, `cleanTags`, `cleanTitle`, `ApiError`).
- Pages and components import search/book functions from `books.js`, not from the clients directly. For a Google book, `getBookExtras` looks the author up by name in Open Library to get bio and photo.
- The deployed site has no key yet, so production is Open Library only. User-facing texts that name the data source (footer, `/sobre`, `/termos`, `/privacidade`, `/suporte` in `src/pages/Info`) switch on `hasGoogleBooks()`. Keep them truthful when sources change, since the privacy page says where search terms are sent.
- Both clients keep a 5-minute in-memory cache. Home lists are also cached in `localStorage` for 12h (`listSource`; changing what a list returns requires changing its cache key).

**Data quality is the recurring problem.** Open Library stores translations as separate works, often lacks Brazilian editions and has user-uploaded junk covers. Google Books returns summaries, bonus chapters and knock-offs. The cleanup pipeline (prefer the `lang=pt` edition, `rankBooks` by query match → cover → known author, `dedupeBooks` by normalized title+author keeping the version with a cover, junk filters in `googleBooks.js`) should be extended, not bypassed. Check changes against the live APIs, not just mocks.

**Book page** (`src/pages/BookPreview`) renders immediately from the card's data passed in router `state.book` (or the saved library entry), then fills in `getWork`/`getBookExtras`. Anything that links to a book should pass `state: { book }`.

**Theming:** colors come from `src/assets/Colors.jsx`, which points to CSS variables defined in `src/components/Reset`. No loose hex colors in components (breaks the dark theme). Styling mixes styled-components and CSS modules. `--shadow-soft` is only a color: write the full `box-shadow`. Display headings use `var(--font-display)` (Lora, loaded with Roboto in `index.html`).

**Breakpoints:** new and reworked screens use `media.celular` (640 px) and `media.tablet` (below 900 px) from `src/assets/breakpoints.js`. Older screens still have ad hoc values (roadmap item). 900 px is also where the header hides "Criar conta" and switches to the mobile menu.

**Home LCP:** on mobile, the shelf strip at the bottom of the home hero (`public/imgs/hero-shelf.svg`) is the LCP element on purpose. Without it, the first "Em alta" cover, which waits on two API calls, becomes LCP and Lighthouse drops from ~98 to ~81. Low-detail images (e.g. `hero-pattern.svg`) are ignored for LCP by Chrome. Re-measure with Lighthouse after changing the hero.

**Service worker** (`public/sw.js`): registered with `?mode=covers` in dev (caches only `covers.openlibrary.org`) and `?mode=app` in prod (offline app shell).

**Base path:** GitHub Pages serves the site under `/<repo>/` via `BASE_PATH`. Use `asset()` / `routerBasename` from `src/utils/asset.js` for public files and routing.

## Testing notes

- Unit tests sit next to the code (`*.test.js[x]`) and run in jsdom. `src/test/setup.js` clears storage after each test. Use `src/test/renderWithProviders.jsx` for components that need contexts.
- API tests stub `fetch` (see the `mockFetch` helper in `src/api/*.test.js`). `vite.config.js` forces `VITE_GOOGLE_BOOKS_KEY=''` for Vitest, and `playwright.config.js` does the same for e2e, so tests never hit Google. To test Google paths, use `vi.stubEnv` (auto-restored).
- E2E mocks Open Library with fixed data in `e2e/fixtures.js`. `a11y.spec.js` runs axe on 9 pages in both themes.

## Conventions

- One commit per change, `tipo(escopo): descrição` in Portuguese. Types: `feat`, `fix`, `perf`, `refactor`, `style`, `test`, `docs`, `ci`, `cd`, `build`, `chore`.
- PR checklist (`.github/pull_request_template.md`): `npm run check`, `npm run test:e2e` for UI changes, light and dark themes, mobile without horizontal scroll.
- CI (`.github/workflows/ci.yml`) runs lint, coverage floors, build, e2e + axe, Lighthouse and `npm audit`. Deploy to GitHub Pages runs after CI passes on `main`.
- `docs/QA.md` (test report, known risks) and `docs/ROADMAP.md` (prioritized improvements) are kept up to date with each feature branch.
