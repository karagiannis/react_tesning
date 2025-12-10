/**
 * createApi.js
 * 
 * Factory för API-objekt som hanterar alla HTTP-anrop.
 * 
 * REGEL: Slides får ALDRIG göra fetch() direkt!
 *        Allt går via detta api-objekt.
 * 
 * FÖRDELAR:
 * 1. Centraliserad autentisering (token läggs till automatiskt)
 * 2. Automatisk token refresh vid 401
 * 3. Konsekvent felhantering
 * 4. Lätt att mocka för tester
 */

import { API_URL } from '../config/api';

/**
 * Factory som skapar api-objekt med tillgång till storage.
 * 
 * @param {Object} storage - Storage-objekt för token-hantering
 * @returns {Object} - API-objekt med alla metoder
 */
export function createApi(storage) {
  const API_BASE = API_URL;
  
  const api = {
    // ─────────────────────────────────────────────────────────────────────
    // Generell fetch med autentisering + automatisk token refresh
    // ─────────────────────────────────────────────────────────────────────
    fetch: async (endpoint, options = {}) => {
      const token = storage.getToken();
      let response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers,
        },
      });
      
      // Om 401 Unauthorized → försök refresha token
      if (response.status === 401 && storage.getRefreshToken()) {
        console.log('[AUTH] Access token expired, refreshing...');
        
        const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: storage.getRefreshToken() })
        });
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          storage.setToken(data.access_token);
          if (data.refresh_token) {
            storage.setRefreshToken(data.refresh_token);
          }
          console.log('[AUTH] Token refreshed successfully');
          
          // Försök originalanropet igen med ny token
          response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.access_token}`,
              ...options.headers,
            },
          });
        } else {
          console.error('[AUTH] Refresh token invalid, logging out');
          storage.clearToken();
          storage.clearRefreshToken();
          window.location.href = '/login';
        }
      }
      
      return response;
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // POST shorthand
    // ─────────────────────────────────────────────────────────────────────
    post: async (endpoint, body) => {
      return api.fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Hämta användarinfo från JWT
    // ─────────────────────────────────────────────────────────────────────
    fetchMe: async () => {
      const response = await api.fetch('/me');
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Kunde inte hämta användarinfo');
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Central logging (audit trail)
    // ─────────────────────────────────────────────────────────────────────
    log: async (message, metadata = {}) => {
      try {
        await api.fetch('/logger', {
          method: 'POST',
          body: JSON.stringify({ message, metadata, timestamp: new Date().toISOString() }),
        });
      } catch (e) {
        console.error('Central logger error:', e);
      }
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Personal logging (user's folder)
    // ─────────────────────────────────────────────────────────────────────
    logPersonal: async (message, metadata = {}) => {
      try {
        await api.fetch('/logger/me', {
          method: 'POST',
          body: JSON.stringify({ message, metadata, timestamp: new Date().toISOString() }),
        });
      } catch (e) {
        console.error('Personal logger error:', e);
      }
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Hämta pågående onboardings
    // ─────────────────────────────────────────────────────────────────────
    fetchPendingOnboardings: async () => {
      console.log('[API] fetchPendingOnboardings: Starting...');
      console.log('[API] fetchPendingOnboardings: Calling /onboarding/active-cases');
      const response = await api.fetch('/onboarding/active-cases');
      console.log('[API] fetchPendingOnboardings: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[API] fetchPendingOnboardings: Data received:', data);
        const activeCases = data.active_cases || [];
        console.log('[API] fetchPendingOnboardings: Returning', activeCases.length, 'active cases');
        return activeCases.map(c => ({
          company_id: c.company_id,
          company_name: c.company_name,
          orgnr: c.orgnr,
          case_id: c.case_id,
          current_slide: c.current_slide,
          updated_at: c.updated_at,
          services: c.services,
        }));
      }
      console.log('[API] fetchPendingOnboardings: Response not OK, returning empty array');
      return [];
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Hämta metadata för specifikt ärende
    // ─────────────────────────────────────────────────────────────────────
    fetchMetadata: async (company_id, case_id) => {
      const response = await api.fetch(`/onboarding/resume/${company_id}?case_id=${case_id}`);
      if (response.ok) {
        return await response.json();
      }
      const error = new Error('Kunde inte hämta metadata');
      error.status = response.status;
      throw error;
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // Poll subscription status (för webhook-verifiering)
    // ─────────────────────────────────────────────────────────────────────
    getSubscriptionStatus: async (company_id, case_id) => {
      const response = await api.fetch(`/onboarding/${company_id}/subscription/status?case_id=${case_id}`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Kunde inte hämta betalningsstatus');
    },
  };
  
  return api;
}
