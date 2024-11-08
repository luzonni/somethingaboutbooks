import React, { useEffect, useState } from "react";
import styles from "./AllBooksPage.module.css";

const fetchBooks = async () => {
  // Simulated API response
  return [
    { id: 1, title: "O Hobbit", cover: "link-to-cover1.jpg" },
    { id: 2, title: "A Medida", cover: "link-to-cover2.jpg" },
    { id: 3, title: "A Hipótese do Amor", cover: "link-to-cover3.jpg" },
    { id: 4, title: "Livro 4", cover: "link-to-cover4.jpg" },
    { id: 5, title: "Livro 5", cover: "link-to-cover5.jpg" },
    { id: 6, title: "Livro 6", cover: "link-to-cover6.jpg" },
    { id: 7, title: "Livro 7", cover: "link-to-cover7.jpg" },
    { id: 8, title: "Livro 8", cover: "link-to-cover8.jpg" },
    { id: 8, title: "Livro 8", cover: "link-to-cover8.jpg" },
    { id: 8, title: "Livro 8", cover: "link-to-cover8.jpg" },

    // Add more book objects to simulate data
  ];
};

function AllBooksPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      const data = await fetchBooks();
      setBooks(data);
    }
    loadBooks();
  }, []);

  // Split books into rows of 5
  const rows = [];
  for (let i = 0; i < books.length; i += 5) {
    rows.push(books.slice(i, i + 5));
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Livros</h2>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.shelf}>
          {row.map((book) => (
            <div key={book.id} className={styles.card}>
              <img src={book.cover} alt={book.title} className={styles.cover} />
              <p className={styles.bookTitle}>{book.title}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default AllBooksPage;
