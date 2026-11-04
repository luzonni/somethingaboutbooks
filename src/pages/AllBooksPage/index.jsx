import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./AllBooksPage.module.css";
import { GENRES, getTrendingBooks, searchBooks } from "../../api/openLibrary";
import { CardBook } from "../../components/CardBook";
import { EmptyState, ErrorState, Spinner } from "../../components/Feedback";
import Search from "../../components/Search";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const dedupe = (books) => [...new Map(books.map((book) => [book.id, book])).values()];

const genreLink = (query, slug) => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (slug) params.set("genero", slug);
  const search = params.toString();
  return search ? `/books?${search}` : "/books";
};

function Results({ query, genre }) {
  const isBrowsing = !query && !genre;
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [results, setResults] = useState({ books: [], total: 0, hasMore: false });
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setStatus({ loading: true, error: null });

    const load = isBrowsing
      ? getTrendingBooks({ limit: 24, signal }).then((books) => ({
          books,
          total: books.length,
          hasMore: false,
        }))
      : searchBooks({ query, genre, page, signal });

    load
      .then((data) => {
        if (signal.aborted) return;
        setResults((previous) => ({
          ...data,
          books: dedupe([...(page === 1 ? [] : previous.books), ...data.books]),
        }));
        setStatus({ loading: false, error: null });
      })
      .catch((error) => {
        if (!signal.aborted) setStatus({ loading: false, error });
      });

    return () => controller.abort();
  }, [query, genre, page, isBrowsing, attempt]);

  const { books, total, hasMore } = results;
  const { loading, error } = status;

  if (!loading && !error && books.length === 0) {
    return (
      <EmptyState
        title="Nenhum livro encontrado"
        description="Confira a ortografia ou tente buscar pelo nome do autor."
      />
    );
  }

  return (
    <>
      <p className={styles.summary} aria-live="polite">
        {isBrowsing
          ? "Em alta nesta semana"
          : books.length > 0 && `${total.toLocaleString("pt-BR")} resultados`}
      </p>

      {books.length > 0 && (
        <div className={styles.grid}>
          {books.map((book) => (
            <CardBook key={book.id} book={book} />
          ))}
        </div>
      )}

      {loading && <Spinner label="Buscando livros" />}
      {error && (
        <ErrorState message={error.message} onRetry={() => setAttempt((value) => value + 1)} />
      )}

      {hasMore && !loading && !error && (
        <button
          type="button"
          onClick={() => setPage((value) => value + 1)}
          className={styles.loadMoreButton}
        >
          Carregar mais
        </button>
      )}
    </>
  );
}

function AllBooksPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const genre = searchParams.get("genero") ?? "";
  const genreLabel = GENRES.find((item) => item.slug === genre)?.label;

  useDocumentTitle(query ? `Busca: ${query}` : genreLabel ?? "Livros");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{genreLabel ?? "Livros"}</h1>

      <Search key={query} initialValue={query} extraParams={genre ? `genero=${genre}` : ""} />

      <nav className={styles.genres} aria-label="Filtrar por gênero">
        <Link
          to={genreLink(query, "")}
          className={`${styles.genre} ${!genre ? styles.genreActive : ""}`}
          aria-current={!genre ? "true" : undefined}
        >
          Todos
        </Link>
        {GENRES.map((item) => (
          <Link
            key={item.slug}
            to={genreLink(query, item.slug)}
            className={`${styles.genre} ${genre === item.slug ? styles.genreActive : ""}`}
            aria-current={genre === item.slug ? "true" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Results key={`${query}|${genre}`} query={query} genre={genre} />
    </div>
  );
}

export default AllBooksPage;
