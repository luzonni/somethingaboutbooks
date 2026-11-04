export const MODES = {
    focus: "Foco",
    short: "Pausa curta",
    long: "Pausa longa",
}

export const DEFAULT_SETTINGS = {
    focus: 25,
    short: 5,
    long: 15,
    longEvery: 4,
    autoStart: false,
    sound: true,
}

export const durationOf = (mode, settings) => settings[mode] * 60

export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
}

export const nextMode = (mode, completedFocus, settings) => {
    if (mode !== "focus") return "focus"
    return completedFocus % settings.longEvery === 0 ? "long" : "short"
}

export const createTimer = (settings) => {
    const duration = durationOf("focus", settings)
    return {
        mode: "focus",
        status: "idle",
        duration,
        remaining: duration,
        endsAt: null,
        completedFocus: 0,
        bookId: "",
    }
}

const enterMode = (state, mode, settings) => {
    const duration = durationOf(mode, settings)
    return { ...state, mode, status: "idle", duration, remaining: duration, endsAt: null }
}

const secondsLeft = (endsAt, now) => Math.max(Math.ceil((endsAt - now) / 1000), 0)

const finish = (state, { settings, now }) => {
    const completedFocus = state.completedFocus + (state.mode === "focus" ? 1 : 0)
    const next = enterMode({ ...state, completedFocus }, nextMode(state.mode, completedFocus, settings), settings)
    return settings.autoStart
        ? { ...next, status: "running", endsAt: now + next.duration * 1000 }
        : next
}

export const timerReducer = (state, action) => {
    const { type, settings, now = Date.now() } = action

    switch (type) {
        case "START":
            if (state.status === "running") return state
            return { ...state, status: "running", endsAt: now + state.remaining * 1000 }
        case "PAUSE":
            if (state.status !== "running") return state
            return { ...state, status: "paused", remaining: secondsLeft(state.endsAt, now), endsAt: null }
        case "RESET":
            return enterMode(state, state.mode, settings)
        case "TICK": {
            if (state.status !== "running") return state
            const remaining = secondsLeft(state.endsAt, now)
            if (remaining <= 0) return finish(state, { settings, now })
            return remaining === state.remaining ? state : { ...state, remaining }
        }
        case "SKIP":
            return enterMode(state, nextMode(state.mode, state.completedFocus + 1, settings), settings)
        case "SET_MODE":
            return enterMode(state, action.mode, settings)
        case "SET_BOOK":
            return { ...state, bookId: action.bookId }
        case "APPLY_SETTINGS":
            return state.status === "idle" ? enterMode(state, state.mode, settings) : state
        default:
            return state
    }
}

export const cycleProgress = ({ completedFocus, mode }, { longEvery }) => {
    const done = completedFocus % longEvery
    return { total: longEvery, done: done === 0 && completedFocus > 0 && mode === "long" ? longEvery : done }
}

export const sanitizeMinutes = (value, fallback) => {
    const minutes = Math.round(Number(value))
    if (!Number.isFinite(minutes) || minutes < 1) return fallback
    return Math.min(minutes, 180)
}

export const playChime = () => {
    try {
        const AudioContextClass = window.AudioContext ?? window.webkitAudioContext
        const context = new AudioContextClass()
        ;[660, 880].forEach((frequency, index) => {
            const oscillator = context.createOscillator()
            const gain = context.createGain()
            const start = context.currentTime + index * 0.25
            oscillator.frequency.value = frequency
            gain.gain.setValueAtTime(0.2, start)
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4)
            oscillator.connect(gain).connect(context.destination)
            oscillator.start(start)
            oscillator.stop(start + 0.4)
        })
        setTimeout(() => context.close(), 1000)
    } catch {
        // Som indisponível neste navegador: o aviso visual continua funcionando.
    }
}
