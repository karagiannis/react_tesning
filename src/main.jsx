import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './style.css'
import App from './App.jsx'

// =============================================================================
// ENTRY POINT
// =============================================================================
// 
// App.jsx är gatekeeper:
// - Pre-auth routes: Hero, Login, Register, Verify, ForgotPassword, ResetPassword
// - Post-auth routes: AuthenticatedApp (med state machine)
//
// Legacy-versioner finns i src/legacy/ om du behöver referera till dem.
//

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
