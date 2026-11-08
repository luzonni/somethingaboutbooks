import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './Routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL
    // Em desenvolvimento o service worker só guarda as capas, para nunca servir código antigo.
    const mode = import.meta.env.PROD ? 'app' : 'covers'
    navigator.serviceWorker.register(`${base}sw.js?mode=${mode}`, { scope: base }).catch(() => {
      // Sem service worker o site continua funcionando, só não abre offline.
    })
  })
}
