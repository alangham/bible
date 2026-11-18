import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// The fonts of the site: Inrond, docs/DESIGN.md section 16, and Lora, section 7.3.
import './fonts/inrond.css'
import '@fontsource/lora/400.css'
import '@fontsource/lora/400-italic.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
