import { useEffect, useRef } from "react"

const isTyping = (target) =>
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))

// Espaço e Enter já ativam botões e links focados: o atalho não pode repetir o clique.
const isActivating = (event) =>
    (event.key === " " || event.key === "Enter") &&
    event.target instanceof HTMLElement &&
    Boolean(event.target.closest("button, a, summary, [role='button'], [role='tab']"))

// Atalho de teclado global que não dispara enquanto a pessoa digita em um campo.
export const useShortcut = (keys, handler, { enabled = true } = {}) => {
    const handlerRef = useRef(handler)
    handlerRef.current = handler
    const list = [].concat(keys).join("|")

    useEffect(() => {
        if (!enabled) return undefined
        const accepted = list.split("|")
        const onKeyDown = (event) => {
            if (event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target) || isActivating(event)) return
            if (!accepted.includes(event.key)) return
            event.preventDefault()
            handlerRef.current(event)
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [list, enabled])
}
