// Caminho de um arquivo da pasta public respeitando o subcaminho do deploy (ex.: GitHub Pages).
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`

// Basename do React Router: "/" localmente, "/somethingaboutbooks" no GitHub Pages.
export const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/"
