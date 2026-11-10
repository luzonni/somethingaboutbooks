import { useEffect, useState } from "react"

// Devolve o valor só depois de `delay` ms sem mudanças: evita uma requisição a cada tecla.
export const useDebouncedValue = (value, delay = 300) => {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}
