import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useLibrary } from "./LibraryContext"
import { readJson, writeJson } from "../services/storage"
import { setTitlePrefix } from "../utils/documentTitle"
import {
    DEFAULT_SETTINGS,
    MODES,
    createTimer,
    formatTime,
    playChime,
    showStageNotification,
    timerReducer,
} from "../utils/pomodoro"

const TIMER_KEY = "sab:pomodoro:timer"
const SETTINGS_KEY = "sab:pomodoro:settings"

const PomodoroContext = createContext(null)

export const PomodoroProvider = ({ children }) => {
    const { canSave, getEntry, logSession } = useLibrary()

    const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...readJson(SETTINGS_KEY, {}) }))
    const [timer, setTimer] = useState(() => readJson(TIMER_KEY, null) ?? createTimer(settings))
    const timerRef = useRef(timer)
    const settingsRef = useRef(settings)
    const libraryRef = useRef()
    libraryRef.current = { canSave, getEntry, logSession }

    const dispatch = useCallback((action) => {
        const previous = timerRef.current
        const next = timerReducer(previous, { ...action, settings: settingsRef.current })
        if (next === previous) return

        timerRef.current = next
        setTimer(next)
        writeJson(TIMER_KEY, next)

        const stageFinished = action.type === "TICK" && next.mode !== previous.mode
        if (!stageFinished) return

        if (settingsRef.current.sound) playChime()
        if (settingsRef.current.notify) showStageNotification(previous.mode, next.mode)

        const library = libraryRef.current
        if (previous.mode === "focus" && library.canSave) {
            library.logSession({
                id: crypto.randomUUID(),
                bookId: library.getEntry(previous.bookId) ? previous.bookId : null,
                minutes: Math.round(previous.duration / 60),
                completedAt: new Date().toISOString(),
            })
        }
    }, [])

    const isRunning = timer.status === "running"

    useEffect(() => {
        if (!isRunning) return undefined
        const tick = () => dispatch({ type: "TICK" })
        tick()
        const interval = setInterval(tick, 500)
        document.addEventListener("visibilitychange", tick)
        return () => {
            clearInterval(interval)
            document.removeEventListener("visibilitychange", tick)
        }
    }, [isRunning, dispatch])

    useEffect(() => {
        setTitlePrefix(isRunning ? `${formatTime(timer.remaining)} ${MODES[timer.mode]}` : "")
    }, [isRunning, timer.remaining, timer.mode])

    const updateSettings = useCallback(
        (changes) => {
            const next = { ...settingsRef.current, ...changes }
            settingsRef.current = next
            setSettings(next)
            writeJson(SETTINGS_KEY, next)
            dispatch({ type: "APPLY_SETTINGS" })
        },
        [dispatch]
    )

    const value = useMemo(
        () => ({
            timer,
            settings,
            updateSettings,
            start: () => dispatch({ type: "START" }),
            pause: () => dispatch({ type: "PAUSE" }),
            reset: () => dispatch({ type: "RESET" }),
            skip: () => dispatch({ type: "SKIP" }),
            setMode: (mode) => dispatch({ type: "SET_MODE", mode }),
            setBook: (bookId) => dispatch({ type: "SET_BOOK", bookId }),
        }),
        [timer, settings, updateSettings, dispatch]
    )

    return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
}

export const usePomodoro = () => useContext(PomodoroContext)
