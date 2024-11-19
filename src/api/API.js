

export const fetchBooks = async (page, query = "") => {
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