import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './style.css'

// =============================================================================
// TOGGLE: Byt mellan gammal och ny arkitektur
// =============================================================================
const USE_V2 = true;  // Sätt till false för att använda gamla App.jsx

// Dynamisk import baserat på toggle
const AppComponent = USE_V2 
  ? (await import('./App_v2.jsx')).default 
  : (await import('./App.jsx')).default;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  </StrictMode>
)
