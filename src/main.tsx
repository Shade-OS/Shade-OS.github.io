import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import { App } from './App.tsx'
import './styles/global.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root bulunamadı')

const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Üretim derlemesinde HTML ön-render edilmiş olarak gelir → hydrate.
// Geliştirmede #root boştur → normal mount.
if (root.hasChildNodes()) {
  hydrateRoot(root, tree)
} else {
  createRoot(root).render(tree)
}
