import React, { useEffect, useState } from "react";
import styles from "./AllBooksPage.module.css";

// Função para buscar livros
const fetchBooks = async (page, query = "") => {
  try {
    console.log(`Buscando livros com a query: "${query}", página: ${page}`);
    
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${query}&page=${page}`
    );
    const data = await response.json();
    
    console.log("Resposta da API:", data); // Verifique a resposta

    // Verifica se 'docs' existem na resposta da API
    if (data.docs && data.docs.length > 0) {
      return data.docs.map((book) => ({
        id: book.key,
        title: book.title,
        cover: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : "", // URL da capa
        author: book.author_name?.[0] || "Autor desconhecido",
      }));
    } else {
      return []; // Caso não encontre livros
    }
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
    return [];
  }
};

function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [visibleBooks, setVisibleBooks] = useState(20);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para armazenar a consulta de pesquisa
  const [loading, setLoading] = useState(false); // Estado de carregamento

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      const data = await fetchBooks(page, searchQuery);
      setBooks((prevBooks) => [...prevBooks, ...data]); // Adiciona livros ao estado
      setLoading(false);
    }
    if (searchQuery) {
      loadBooks(); // Só faz a busca se houver uma consulta
    }
  }, [page, searchQuery]); // Recarregar quando mudar a página ou a pesquisa

  // Função para lidar com a pesquisa ao apertar Enter
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      setPage(1); // Reinicia a página ao pressionar Enter
      setBooks([]); // Limpa os livros atuais
      setLoading(true);
      fetchBooks(1, searchQuery).then((data) => {
        setBooks(data); // Atualiza os livros com o resultado da busca
        setLoading(false);
      });
    }
  };

  // Função para atualizar o estado da pesquisa ao digitar
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const loadMoreBooks = () => {
    setVisibleBooks((prevVisibleBooks) => prevVisibleBooks + 20);
    setPage((prevPage) => prevPage + 3); // Avança 3 páginas por vez
  };

  // Dividir livros visíveis em linhas de 5 para o layout de prateleira(shelf)
  const rows = [];
  for (let i = 0; i < visibleBooks && i < books.length; i += 5) {
    rows.push(books.slice(i, i + 5));
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Livros</h2>

      {/* Campo de Pesquisa */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Pesquise por livros..."
          value={searchQuery}
          onChange={handleSearchChange} // Atualiza o valor da pesquisa enquanto digita
          onKeyDown={handleSearchKeyDown} // Só pesquisa ao apertar Enter
          className={styles.searchInput}
        />
      </div>

      {/* Exibição de Livros */}
      {loading ? (
        <div className={styles.spinner}></div> // Exibe o spinner enquanto carrega
      ) : rows.length > 0 ? (
        rows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.shelf}>
            {row.map((book) => (
              <div key={book.id} className={styles.card}>
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className={styles.cover}
                    loading="lazy" // Lazy load das imagens
                  />
                ) : (
                  <div className={styles.coverPlaceholder}></div>
                )}
                <p className={styles.bookTitle}>{book.title}</p>
                <p className={styles.bookAuthor}>{book.author}</p>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>Nenhum livro encontrado</p>
      )}

      {/* Botão de Carregar Mais */}
      <button onClick={loadMoreBooks} className={styles.loadMoreButton}>
        Carregar Mais
      </button>
    </div>
  );
}

export default AllBooksPage;
