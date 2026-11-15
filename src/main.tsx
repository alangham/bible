import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// The fonts of the redesign, docs/DESIGN.md section 7.3. Task 17 removed the fonts of the first build.
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/lora/400.css'
import '@fontsource/lora/400-italic.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
