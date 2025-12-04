/**
 * HeaderSimple.jsx
 * 
 * En enkel header som tar emot all data via props (tic-tac-toe mönster)
 * 
 * Props:
 *   @param {Object} user - Inloggad användare { name, email }
 *   @param {Object} activeCase - Aktivt case { companyName, orgnr }
 *   @param {boolean} isLoading - Om data laddas
 *   @param {string} loadingMessage - Vad som laddas
 *   @param {Function} onLogout - Logout callback
 */

import React, { useState } from 'react';
import { LogOut, User, ChevronDown, ChevronUp, Settings, HelpCircle } from 'lucide-react';

export default function HeaderSimple({ 
  user,
  activeCase,
  isLoading,
  loadingMessage,
  onLogout,
  isDraftMode 
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Logo/Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-brand-900">
            Onboarding
          </h1>
          
          {/* Company info if we have an active case */}
          {activeCase && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-gray-300">|</span>
              <span className="font-medium">{activeCase.companyName}</span>
              <span className="text-gray-400">({activeCase.orgnr})</span>
            </div>
          )}
          
          {/* Draft mode indicator */}
          {isDraftMode && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
              Utkast
            </span>
          )}
        </div>
        
        {/* Right side - Status + User menu */}
        <div className="flex items-center space-x-4">
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-600 mr-2"></div>
              <span>{loadingMessage || 'Laddar...'}</span>
            </div>
          )}
          
          {/* User dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-brand-600" />
                </div>
                <span className="hidden md:block">{user.name || user.email}</span>
                {showUserMenu ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      {user.email}
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Could add settings page
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Inställningar
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Could add help page
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Hjälp
                    </button>
                    
                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout && onLogout();
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logga ut
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
