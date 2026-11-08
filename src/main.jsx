import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './Routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
)

if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      const base = import.meta.env.BASE_URL
      navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
        // Sem service worker o site continua funcionando, só não abre offline.
      })
    })
  } else {
    // Em desenvolvimento o cache serviria código antigo: remove registros anteriores.
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister())
    })
  }
}
