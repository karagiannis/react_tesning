import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './style.css'

// =============================================================================
// TOGGLE: Byt mellan arkitekturversioner
// =============================================================================
// 
// VERSION 1 (App.jsx):     Gammal arkitektur, monolitisk
// VERSION 2 (App_v2.jsx):  MasterStateProvider + AuthenticatedApp_v2
// VERSION 3 (App_v3.jsx):  Tic-tac-toe pattern, AuthenticatedApp_v3 med state machine
//
const APP_VERSION = 3;  // Ändra till 1, 2, eller 3

// Dynamisk import baserat på version
let AppComponent;
switch (APP_VERSION) {
  case 1:
    AppComponent = (await import('./App.jsx')).default;
    break;
  case 2:
    AppComponent = (await import('./App_v2.jsx')).default;
    break;
  case 3:
  default:
    AppComponent = (await import('./App_v3.jsx')).default;
    break;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  </StrictMode>
)
