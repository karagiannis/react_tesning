/**
 * MasterStateContext
 * 
 * Central context för app-level state distribution.
 * Skapad av useMasterState i App.jsx, konsumeras av alla komponenter.
 * 
 * @see /docs/CHANGELOG_2025-12-03.md för arkitektur-dokumentation
 */

import { createContext, useContext } from 'react';

/**
 * Context som håller master state för hela applikationen.
 * Värdet sätts av useMasterState hook i App.jsx.
 */
export const MasterStateContext = createContext(null);

/**
 * Consumer hook för att läsa master state.
 * Kastar error om använd utanför MasterStateContext.Provider.
 * 
 * @example
 * function Sidebar() {
 *   const { hasRoaringData, companyName } = useMasterStateContext();
 *   return <div>...</div>;
 * }
 * 
 * @returns {Object} Master state och actions
 */
export function useMasterStateContext() {
  const context = useContext(MasterStateContext);
  
  if (!context) {
    throw new Error(
      'useMasterStateContext must be used within MasterStateContext.Provider. ' +
      'Make sure App.jsx wraps the component tree with the provider.'
    );
  }
  
  return context;
}

/**
 * Type definition för TypeScript/JSDoc
 * @typedef {Object} MasterState
 * @property {string|null} userId - Inloggad användares ID
 * @property {string|null} companyId - Aktivt företags ID (orgnr_hash)
 * @property {string|null} caseId - Aktivt onboarding case ID
 * @property {boolean} isLoggedIn - Om användaren är inloggad
 * @property {boolean} hasActiveCase - Om det finns ett aktivt case
 * @property {boolean} hasRoaringData - Om roaring_data finns (unlocks Result-slides)
 * @property {boolean} hasPaid - Om betalning är bekräftad
 * @property {'none'|'fetching'|'ready'|'error'} roaringStatus - Status för roaring-fetch
 * @property {Object|null} caseMetadata - Full case metadata från server
 * @property {string|null} companyName - Företagsnamn
 * @property {string|null} orgnr - Organisationsnummer
 * @property {string|null} currentStep - Nuvarande steg i onboarding
 * @property {boolean} showResumeModal - Om resume-dialogen ska visas
 * @property {Array} pendingOnboardings - Lista på pågående onboardings
 * @property {boolean} isInitializing - Om state initialiseras
 * 
 * @property {Function} refreshFromServer - Hämta senaste state från server
 * @property {Function} setActiveCase - Sätt aktivt case (companyId, caseId)
 * @property {Function} confirmPaymentAndFetchRoaring - Bekräfta betalning och starta roaring-fetch
 * @property {Function} clearSession - Logga ut och rensa state
 * @property {Function} setShowResumeModal - Visa/dölj resume-dialogen
 * @property {Function} refreshPendingOnboardings - Hämta listan över pågående onboardings igen
 * @property {Function} deleteOnboarding - Radera en onboarding
 * @property {Function} handleLogin - Hantera login
 */

export default MasterStateContext;
