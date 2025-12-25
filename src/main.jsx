import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { initGA } from './utils/analytics'
import './index.css'
import App from './App.jsx'

// 初始化 Google Analytics
if (typeof window !== 'undefined') {
  initGA()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
