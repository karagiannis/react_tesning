/**
 * Header_v2.jsx
 * 
 * Enkel header som använder useMasterContext()
 */

import React from 'react';
import { useMasterContext } from '../../context/MasterStateContext_v2';

export default function Header_v2() {
  const { state, actions } = useMasterContext();
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo/Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-brand-900">
            Onboarding
          </h1>
          
          {state.activeCase && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>|</span>
              <span>{state.activeCase.companyName}</span>
              <span className="text-gray-400">({state.activeCase.orgnr})</span>
            </div>
          )}
        </div>
        
        {/* Right side - User menu */}
        <div className="flex items-center space-x-4">
          {/* Loading indicator */}
          {state.isLoading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-600 mr-2"></div>
              {state.loadingMessage}
            </div>
          )}
          
          {/* User info */}
          {state.user && (
            <span className="text-sm text-gray-600">
              {state.user.email}
            </span>
          )}
          
          {/* Logout button */}
          <button
            onClick={actions.logout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Logga ut
          </button>
        </div>
      </div>
    </header>
  );
}
