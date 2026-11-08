import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import styled, { keyframes } from "styled-components"
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi"
import { Coral, Ink, White } from "../assets/Colors"

const DURATION = 3500
const MAX_TOASTS = 3

const slideIn = keyframes`
    from { opacity: 0; transform: translateY(16px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
`

const shrink = keyframes`
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
`

const ToastStack = styled.div`
    position: fixed;
    right: 0;
    bottom: 1.25rem;
    left: 0;
    z-index: 60;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;
    pointer-events: none;
    .toast {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.625rem;
        width: min(26rem, 100%);
        padding: 0.75rem 0.75rem 0.875rem 1rem;
        overflow: hidden;
        border-radius: 12px;
        background-color: ${Ink};
        color: ${White};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        pointer-events: auto;
        animation: ${slideIn} 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .toast > svg {
        flex-shrink: 0;
        font-size: 1.25rem;
    }
    .toast--success > svg {
        color: #6fd39b;
    }
    .toast--error > svg {
        color: ${Coral};
    }
    .toast p {
        flex: 1;
        min-width: 0;
    }
    .toast button {
        display: flex;
        padding: 0.25rem;
        border: none;
        border-radius: 6px;
        background: none;
        color: inherit;
        opacity: 0.7;
    }
    .toast button:hover {
        opacity: 1;
    }
    .toast__timer {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 3px;
        background-color: ${Coral};
        transform-origin: left;
        animation: ${shrink} ${DURATION}ms linear both;
    }
    .toast:hover .toast__timer {
        animation-play-state: paused;
    }
`

const ICONS = { success: FiCheckCircle, error: FiAlertCircle, info: FiInfo }

const Toast = ({ toast, onClose }) => {
    const Icon = ICONS[toast.tone] ?? FiInfo
    const timer = useRef(null)
    const remaining = useRef(DURATION)
    const startedAt = useRef(0)

    const start = useCallback(() => {
        startedAt.current = Date.now()
        timer.current = setTimeout(() => onClose(toast.id), remaining.current)
    }, [onClose, toast.id])

    const pause = () => {
        clearTimeout(timer.current)
        remaining.current -= Date.now() - startedAt.current
    }

    useEffect(() => {
        start()
        return () => clearTimeout(timer.current)
    }, [start])

    return (
        <div className={`toast toast--${toast.tone}`} onMouseEnter={pause} onMouseLeave={start}>
            <Icon aria-hidden="true" />
            <p>{toast.message}</p>
            <button type="button" aria-label="Fechar aviso" onClick={() => onClose(toast.id)}>
                <FiX aria-hidden="true" />
            </button>
            <span className="toast__timer" aria-hidden="true" />
        </div>
    )
}

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])
    const nextId = useRef(0)

    const dismiss = useCallback((id) => setToasts((list) => list.filter((toast) => toast.id !== id)), [])

    const notify = useCallback((message, { tone = "success" } = {}) => {
        nextId.current += 1
        const toast = { id: nextId.current, message, tone }
        setToasts((list) => [...list, toast].slice(-MAX_TOASTS))
    }, [])

    const value = useMemo(() => ({ notify }), [notify])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastStack role="status" aria-live="polite">
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onClose={dismiss} />
                ))}
            </ToastStack>
        </ToastContext.Provider>
    )
}

// Fora do provider (como em testes isolados) os avisos são simplesmente ignorados.
const silent = { notify: () => {} }

export const useToast = () => useContext(ToastContext) ?? silent
