/**
 * App_v3.jsx
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * TOP-LEVEL GATEKEEPER - Avgör om användaren ska se pre-auth eller post-auth
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * TIC-TAC-TOE ARKITEKTUR:
 * - Pre-auth slides (Hero, Login, Register, etc.) hanterar sig själva
 * - Post-auth → AuthenticatedApp_v3 tar över med sin state machine
 * 
 * FLÖDE:
 * 
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │                          App_v3.jsx                                 │
 *   │                         (Gatekeeper)                                │
 *   └──────────────────────────────┬──────────────────────────────────────┘
 *                                  │
 *           ┌──────────────────────┴──────────────────────┐
 *           │                                             │
 *           ▼                                             ▼
 *   ┌───────────────────┐                       ┌───────────────────────┐
 *   │  PRE-AUTH ROUTES  │                       │   POST-AUTH ROUTES    │
 *   │                   │                       │                       │
 *   │  /               │                       │  /* (allt annat)      │
 *   │  /login          │                       │                       │
 *   │  /register       │                       │  ProtectedRoute       │
 *   │  /verify         │                       │       ↓               │
 *   │  /forgot-password│                       │  AuthenticatedApp_v3  │
 *   │  /reset-password │                       │                       │
 *   │                   │                       │  (State machine)      │
 *   │  (Slides hanterar │                       │  (useMasterState)     │
 *   │   sig själva)     │                       │                       │
 *   └───────────────────┘                       └───────────────────────┘
 * 
 * VARFÖR DENNA STRUKTUR?
 * 
 * 1. SEPARATION OF CONCERNS
 *    - Pre-auth slides behöver ingen komplex state management
 *    - Post-auth slides får tillgång till centraliserad state via props
 * 
 * 2. SNABBARE INITIAL LADDNING
 *    - AuthenticatedApp_v3 laddas inte förrän användaren är inloggad
 *    - Pre-auth slides är lätta och snabba
 * 
 * 3. ENKEL DEBUGGING
 *    - Om något går fel i post-auth, vet vi att det är i AuthenticatedApp_v3
 *    - Pre-auth är helt oberoende
 * 
 */

import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// =============================================================================
// PRE-AUTH SLIDES
// =============================================================================
// Dessa slides hanterar sig själva - ingen central state behövs
//
import HeroSlide from './components/Slides/HeroSlide';
import LoginSlide from './components/Slides/LoginSlide';
import RegisterSlide from './components/Slides/RegisterSlide';
import VerifySlide from './components/Slides/VerifySlide';
import ForgotPasswordSlide from './components/Slides/ForgotPasswordSlide';
import ResetPasswordSlide from './components/Slides/ResetPasswordSlide';

// =============================================================================
// POST-AUTH - AuthenticatedApp_v3 (har sin egen state machine)
// =============================================================================
import AuthenticatedApp from './AuthenticatedApp';

// =============================================================================
// AUTH CHECK
// =============================================================================
//
// Kollar om användaren har en giltig JWT-token i localStorage.
// Returnerar true om token finns och inte har gått ut.
//
function isAuthenticated() {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  
  try {
    // Dekoda JWT payload (mittendelen av token)
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Kolla om token har gått ut
    return Date.now() < payload.exp * 1000;
  } catch {
    // Om något går fel, betrakta som utloggad
    return false;
  }
}

// =============================================================================
// PROTECTED ROUTE WRAPPER
// =============================================================================
//
// Wrapper-komponent som redirectar till /login om användaren inte är inloggad.
// Om inloggad, renderas children (AuthenticatedApp_v3).
//
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// =============================================================================
// PRE-AUTH ROUTE WRAPPERS
// =============================================================================
//
// Wrapper-komponenter för pre-auth slides som hanterar navigation.
// Använder useNavigate() för SPA-navigation (snabbare än window.location).
//

function HeroSlideWrapper() {
  const navigate = useNavigate();
  return (
    <HeroSlide 
      onLogin={() => navigate('/login')}
      onRegister={() => navigate('/register')}
      onNext={() => navigate('/login')}
      onDemo={() => navigate('/register')}
    />
  );
}

function LoginSlideWrapper() {
  const navigate = useNavigate();
  return (
    <LoginSlide 
      onNext={() => navigate('/uppdragsval')}
      onRegister={() => navigate('/register')}
      onForgotPassword={() => navigate('/forgot-password')}
    />
  );
}

function RegisterSlideWrapper() {
  const navigate = useNavigate();
  return (
    <RegisterSlide 
      onLogin={() => navigate('/login')}
      onNext={() => navigate('/verify')}
    />
  );
}

function VerifySlideWrapper() {
  const navigate = useNavigate();
  return (
    <VerifySlide 
      onNext={() => navigate('/uppdragsval')}
      onLogin={() => navigate('/login')}
    />
  );
}

function ForgotPasswordSlideWrapper() {
  const navigate = useNavigate();
  return (
    <ForgotPasswordSlide 
      onNext={() => navigate('/reset-password')}
      onBack={() => navigate('/login')}
    />
  );
}

function ResetPasswordSlideWrapper() {
  const navigate = useNavigate();
  return (
    <ResetPasswordSlide 
      onNext={() => navigate('/login')}
      onResendCode={() => navigate('/forgot-password')}
    />
  );
}

// =============================================================================
// MAIN APP
// =============================================================================
export default function App_v3() {
  return (
    <Routes>
      {/* ================================================================== */}
      {/* PRE-AUTH ROUTES                                                    */}
      {/* ================================================================== */}
      {/* Dessa routes är tillgängliga utan inloggning.                      */}
      {/* Slides hanterar sig själva - ingen central state behövs.           */}
      {/* ================================================================== */}
      
      <Route path="/" element={<HeroSlideWrapper />} />
      <Route path="/login" element={<LoginSlideWrapper />} />
      <Route path="/register" element={<RegisterSlideWrapper />} />
      <Route path="/verify" element={<VerifySlideWrapper />} />
      <Route path="/forgot-password" element={<ForgotPasswordSlideWrapper />} />
      <Route path="/reset-password" element={<ResetPasswordSlideWrapper />} />
      
      {/* ================================================================== */}
      {/* POST-AUTH ROUTES                                                   */}
      {/* ================================================================== */}
      {/* Alla andra routes kräver inloggning.                               */}
      {/* AuthenticatedApp_v3 tar över och hanterar:                         */}
      {/*   - State machine (INITIALIZING → READY → etc.)                    */}
      {/*   - Alla post-auth slides (Uppdragsval, Riskfrågor, etc.)          */}
      {/*   - localStorage/sessionStorage                                     */}
      {/*   - API-anrop                                                       */}
      {/* ================================================================== */}
      
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <AuthenticatedApp />
          </ProtectedRoute>
        } 
      />
      
    </Routes>
  );
}
