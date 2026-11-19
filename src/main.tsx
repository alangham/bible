import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// The fonts of the site: Inrond, docs/DESIGN.md section 16, and Lora, section 7.3.
import './fonts/inrond.css'
import '@fontsource/lora/400.css'
import '@fontsource/lora/400-italic.css'
import './index.css'
import App from './App.tsx'
import { groupColorsCss } from './data/books.ts'
import { followDevice } from './data/darkMode.ts'

// The names of the ten group colors on the root element, before the first render: docs/TASKS.md Task 44.
// The other colors have their names in src/index.css.
const groupColors = document.createElement('style')
groupColors.id = 'group-colors'
groupColors.textContent = groupColorsCss()
document.head.append(groupColors)

// With no stored value, each page follows a change of the device: docs/TASKS.md Task 46 step 3.
followDevice()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
