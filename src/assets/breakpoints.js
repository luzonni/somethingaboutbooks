// Pontos de quebra padrão do site (roadmap: "Padronizar o layout entre celular e desktop").
// Telas novas e reformadas usam estes valores; as antigas migram aos poucos.
export const BREAKPOINTS = {
    celular: 640,
    tablet: 900,
}

// Para styled-components: `${media.celular} { ... }`.
export const media = {
    celular: `@media (max-width: ${BREAKPOINTS.celular}px)`,
    tablet: `@media (max-width: ${BREAKPOINTS.tablet - 1}px)`,
}
