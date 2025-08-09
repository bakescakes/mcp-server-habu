import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SimpleApp from './SimpleApp.tsx'

// Simple, working dashboard - no broken components or navigation
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleApp />
  </StrictMode>,
)
