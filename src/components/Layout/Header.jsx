/**
 * Header.jsx
 * 
 * Huvudheader för Onboarding-appen (tic-tac-toe mönster)
 * All data kommer via props från AuthenticatedApp
 * 
 * Innehåller:
 * - Logo/titel
 * - LLM panel toggle
 * - Dokumentation panel toggle  
 * - Settings navigation
 * - User dropdown med logout + cancel
 * 
 * Props:
 *   @param {Object} user - Inloggad användare { email, role }
 *   @param {Object} activeCase - Aktivt case { companyName, orgnr }
 *   @param {boolean} isLoading - Om data laddas
 *   @param {string} loadingMessage - Vad som laddas
 *   @param {Function} onLogout - Logout callback
 *   @param {Function} onCancelAndReset - Avsluta och rensa callback (soft delete + logout)
 *   @param {boolean} isDraftMode - Om vi är i utkastläge
 *   @param {string} activePanel - Aktiv sidopanel ('llm' | 'documentation' | null)
 *   @param {Function} onPanelToggle - Callback för att toggla panel
 *   @param {string} syncStatus - 'idle' | 'saving' | 'saved' | 'conflict' | 'offline'
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  Trash2,
  Shield,
  FileText,
  MessageSquare,
  Building
} from 'lucide-react';

export default function Header({ 
  user,
  activeCase,
  isLoading,
  loadingMessage,
  onLogout,
  onCancelAndReset,
  isDraftMode,
  activePanel,
  onPanelToggle,
  syncStatus = 'idle'
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // Sync status indicator
  const getSyncStatusDisplay = () => {
    switch (syncStatus) {
      case 'saving':
        return (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-brand-600 mr-2"></div>
            <span>Sparar...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center text-sm text-green-600">
            <span>✓ Sparat</span>
          </div>
        );
      case 'conflict':
        return (
          <div className="flex items-center text-sm text-amber-600">
            <span>⚠ Konflikt</span>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center text-sm text-gray-400">
            <span>Offline</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Left side - Logo/Title + Company info */}
      <div className="flex items-center gap-3">
        <Building className="w-6 h-6 text-brand-600" />
        <h1 className="text-lg font-bold text-brand-900">Kundonboarding</h1>
        
        {/* Company info if we have an active case */}
        {activeCase && (
          <>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium text-gray-700">{activeCase.companyName}</span>
            <span className="text-sm text-gray-400">({activeCase.orgnr})</span>
          </>
        )}
        
        {/* Draft mode indicator */}
        {isDraftMode && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 ml-2">
            Utkast
          </span>
        )}
      </div>

      {/* Center/Right - Panel buttons + Status + User menu */}
      <div className="flex items-center gap-4">
        {/* Sync status */}
        {getSyncStatusDisplay()}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-600 mr-2"></div>
            <span>{loadingMessage || 'Laddar...'}</span>
          </div>
        )}

        {/* LLM Assistent Button */}
        <button
          onClick={() => onPanelToggle?.('llm')}
          className={`px-4 py-2 rounded-lg transition-all font-mono font-bold text-sm tracking-tight ${
            activePanel === 'llm'
              ? 'bg-brand-600 text-white'
              : 'bg-brand-100 text-brand-800 hover:bg-brand-200'
          }`}
          title="LLM Assistent - Få hjälp med frågor baserat på insamlad data"
        >
          LLM
        </button>

        {/* Documentation Button */}
        <button
          onClick={() => onPanelToggle?.('documentation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activePanel === 'documentation'
              ? 'bg-brand-600 text-white'
              : 'bg-brand-100 text-brand-800 hover:bg-brand-200'
          }`}
          title="Dokumentation - Hur programmet används och vilka tester som körs"
        >
          <FileText className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Dokumentation</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-lg bg-brand-100 text-brand-800 hover:bg-brand-200 transition-all"
          title="Inställningar - Firmakonfiguration, användare, prenumeration"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile Dropdown */}
        {user && (
          <div className="relative ml-2 border-l border-gray-200 pl-4">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold text-sm">
                {(user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{user.email}</div>
                {user.role === 'admin' && (
                  <div className="text-xs text-brand-600 font-semibold">Administratör</div>
                )}
              </div>
              {showUserMenu ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                {/* Backdrop to close menu */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {/* Profile */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profil
                  </button>
                  
                  {/* Admin Dashboard (if admin) */}
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/admin');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                  )}
                  
                  <hr className="my-1 border-gray-200" />
                  
                  {/* Cancel and Reset - Rensa all data och börja om */}
                  {/* ALLTID synlig - användaren ska alltid kunna starta om */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Bekräftelse innan soft delete
                      const caseName = activeCase?.companyName || 'pågående onboarding';
                      const confirmed = window.confirm(
                        `⚠️ Är du säker på att du vill avsluta och rensa?\n\n` +
                        `Detta kommer att:\n` +
                        `• Radera ${caseName}\n` +
                        `• Rensa all insamlad data\n` +
                        `• Logga ut dig från systemet\n\n` +
                        `OBS: ${activeCase ? 'Caset kan återställas av admin vid behov.' : 'Utkastet raderas permanent.'}`
                      );
                      if (confirmed) {
                        onCancelAndReset?.();
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Avsluta (rensa)
                  </button>
                  
                  {/* Logout */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout?.();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logga ut
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
