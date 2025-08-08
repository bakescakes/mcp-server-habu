import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Debug from './Debug.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Debug />
  </StrictMode>,
)
