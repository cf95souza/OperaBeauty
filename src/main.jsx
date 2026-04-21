import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Atualização Automática do PWA
const updateSW = registerSW({
  onNeedRefresh() {
    // Quando detecta nova versão, recarrega para aplicar
    if (confirm('Nova versão disponível! Deseja atualizar agora?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App pronto para uso offline');
  },
})

// Verifica se há novas versões a cada 60 segundos (ajustável)
setInterval(() => {
  updateSW(true)
}, 60 * 1000)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
