import { FiBookmark, FiBookOpen, FiClock, FiHome } from "react-icons/fi"

export const NAV_ITEMS = [
    { to: "/", label: "Início", icon: FiHome, end: true },
    { to: "/books", label: "Livros", icon: FiBookOpen },
    { to: "/pomodoro", label: "Pomodoro", icon: FiClock },
    { to: "/readinghistorylist", label: "Minhas leituras", icon: FiBookmark, requiresAuth: true },
]

export const visibleNavItems = (user) => NAV_ITEMS.filter((item) => !item.requiresAuth || user)

export const accountLinks = (user) => [
    { to: `/user/${user.username}`, label: "Meu perfil" },
    { to: "/preuserconfigs", label: "Minha conta" },
    { to: "/userconfig", label: "Configurações" },
]
