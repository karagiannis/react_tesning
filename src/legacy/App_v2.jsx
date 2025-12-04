/**
 * App_v2.jsx
 * 
 * TIC-TAC-TOE ARKITEKTUR
 * 
 * Pre-auth slides (Hero, Login, Register, etc.) hanterar sig själva.
 * Efter login tar MasterStateProvider över och kontrollerar allt.
 * 
 * STRUKTUR:
 * - Pre-auth routes: Inga providers, slides hanterar sig själva
 * - Post-auth routes: MasterStateProvider wrapppar allt
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// =============================================================================
// PRE-AUTH SLIDES (hanterar sig själva)
// =============================================================================
import HeroSlide from './components/Slides/HeroSlide';
import LoginSlide from './components/Slides/LoginSlide';
import RegisterSlide from './components/Slides/RegisterSlide';
import VerifySlide from './components/Slides/VerifySlide';
import ForgotPasswordSlide from './components/Slides/ForgotPasswordSlide';
import ResetPasswordSlide from './components/Slides/ResetPasswordSlide';

// =============================================================================
// POST-AUTH - MasterStateProvider
// =============================================================================
import { MasterStateProvider } from './context/MasterStateContext_v2';
import AuthenticatedApp from './AuthenticatedApp_v2';

// =============================================================================
// SIMPLE AUTH CHECK
// =============================================================================
function isAuthenticated() {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
}

// =============================================================================
// PROTECTED ROUTE WRAPPER
// =============================================================================
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// =============================================================================
// MAIN APP
// =============================================================================
export default function App_v2() {
  return (
    <Routes>
      {/* ================================================================== */}
      {/* PRE-AUTH ROUTES - Slides hanterar sig själva                       */}
      {/* ================================================================== */}
      
      <Route 
        path="/" 
        element={
          <HeroSlide 
            onLogin={() => window.location.href = '/login'}
            onRegister={() => window.location.href = '/register'}
            onNext={() => window.location.href = '/login'}
            onDemo={() => window.location.href = '/register'}
          />
        } 
      />
      
      <Route 
        path="/login" 
        element={
          <LoginSlide 
            onNext={() => window.location.href = '/uppdragsval'}
            onRegister={() => window.location.href = '/register'}
          />
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <RegisterSlide 
            onLogin={() => window.location.href = '/login'}
            onNext={() => window.location.href = '/verify'}
          />
        } 
      />
      
      <Route 
        path="/verify" 
        element={
          <VerifySlide 
            onNext={() => window.location.href = '/login'}
          />
        } 
      />
      
      <Route 
        path="/forgot-password" 
        element={
          <ForgotPasswordSlide 
            onLogin={() => window.location.href = '/login'}
          />
        } 
      />
      
      <Route 
        path="/reset-password" 
        element={
          <ResetPasswordSlide 
            onLogin={() => window.location.href = '/login'}
          />
        } 
      />
      
      {/* ================================================================== */}
      {/* POST-AUTH ROUTES - MasterStateProvider tar över                    */}
      {/* ================================================================== */}
      
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <MasterStateProvider>
              <AuthenticatedApp />
            </MasterStateProvider>
          </ProtectedRoute>
        } 
      />
      
    </Routes>
  );
}
