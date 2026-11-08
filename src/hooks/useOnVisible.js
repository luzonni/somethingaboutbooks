import { useEffect, useRef } from "react"

// Chama o callback sempre que o elemento chega perto da área visível.
export const useOnVisible = (callback, { enabled = true, rootMargin = "600px" } = {}) => {
    const ref = useRef(null)
    const callbackRef = useRef(callback)
    callbackRef.current = callback

    useEffect(() => {
        if (!enabled || !ref.current || typeof IntersectionObserver === "undefined") return undefined
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) callbackRef.current()
            },
            { rootMargin }
        )
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [enabled, rootMargin])

    return ref
}
