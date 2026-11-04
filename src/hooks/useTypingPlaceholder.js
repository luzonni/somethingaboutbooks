import { useEffect, useState } from "react"

const TYPE_DELAY = 70
const DELETE_DELAY = 35
const HOLD_DELAY = 1600
const NEXT_DELAY = 300

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false

// Digita e apaga sugestões no placeholder enquanto o campo está vazio e sem foco.
export const useTypingPlaceholder = (phrases, { active, fallback }) => {
    const [text, setText] = useState("")
    const enabled = active && !prefersReducedMotion()

    useEffect(() => {
        if (!enabled) return undefined

        let phraseIndex = 0
        let length = 0
        let deleting = false
        let timer

        const step = () => {
            const phrase = phrases[phraseIndex]
            length += deleting ? -1 : 1
            setText(phrase.slice(0, length))

            let delay = deleting ? DELETE_DELAY : TYPE_DELAY
            if (!deleting && length === phrase.length) {
                deleting = true
                delay = HOLD_DELAY
            } else if (deleting && length === 0) {
                deleting = false
                phraseIndex = (phraseIndex + 1) % phrases.length
                delay = NEXT_DELAY
            }
            timer = setTimeout(step, delay)
        }

        timer = setTimeout(step, NEXT_DELAY)
        return () => clearTimeout(timer)
    }, [enabled, phrases])

    return enabled ? `${text}|` : fallback
}
