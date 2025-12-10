/**
 * Debug Logger för Onboarding State Machine
 * 
 * AKTIVERAS via: VITE_DEBUG_MODE=true i .env.development
 * LOGFIL: tic-tac-toe-server/logs/debug_case_{id}.log
 * 
 * Loggar till fil via backend endpoint:
 * - State Controller "tankar" (stream of consciousness)
 * - metadata.json innehåll per slide
 * - localStorage innehåll per slide
 * - Network requests (POST/GET)
 * 
 * Användning:
 *   import { debugLog } from '@/utils/debugLogger';
 *   debugLog.thought('riskfragor_steg1', 'Triggered on new page');
 *   debugLog.thought('riskfragor_steg1', 'Checking server...', { url });
 *   debugLog.slideVisited('riskfragor_steg1', metadataContent, localStorageContent);
 *   debugLog.networkRequest('POST', '/api/onboarding/...', requestBody, response);
 */

import { API_URL } from '../config/api';

// Check if debug mode is enabled via environment variable
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

const isDebugEnabled = () => DEBUG_MODE;

// Format timestamp
const timestamp = () => new Date().toISOString();

// Get current case_id from localStorage (for case-specific log files)
const getCaseId = () => {
  try {
    return localStorage.getItem('case_id') || 'no_case';
  } catch {
    return 'no_case';
  }
};

// Collect ALL localStorage entries that belong to current case/onboarding
const collectCaseLocalStorage = () => {
  const result = {};
  const case_id = getCaseId();
  const company_id = localStorage.getItem('current_company_id');
  
  // Add key metadata
  result._case_id = case_id;
  result._company_id = company_id;
  
  // Collect all keys that might be relevant
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    // Include if key contains case_id, case_id, or company_id
    // Also include essential session keys
    const essentialKeys = ['case_id', 'current_company_id', 'accessToken', 'resume_mode', 'user_id'];
    const isEssential = essentialKeys.includes(key);
    const matchesCase = case_id && case_id !== 'no_case' && key.includes(case_id);
    const matchesCompany = company_id && key.includes(company_id);
    const isNamespacedKey = key.includes('::'); // Our namespaced keys use ::
    
    if (isEssential || matchesCase || matchesCompany || isNamespacedKey) {
      try {
        const value = localStorage.getItem(key);
        // Try to parse as JSON, otherwise keep as string
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value;
        }
      } catch (e) {
        result[key] = '[Error reading]';
      }
    }
  }
  
  return result;
};

// Send log to backend (fire and forget)
const sendToBackend = async (logEntry) => {
  if (!isDebugEnabled()) return;
  
  try {
    // Add case_id to every log entry for case-specific logging
    logEntry.case_id = getCaseId();
    
    // Log to console as well for immediate visibility
    console.log('[DEBUG]', logEntry);
    
    // Send to backend debug endpoint (use full API_URL, not relative)
    await fetch(`${API_URL}/debug/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry)
    }).catch(() => {
      // Ignore errors - debug logging should never break the app
    });
  } catch {
    // Silently fail
  }
};

// Format slide data for logging (truncate if too large)
const formatSlideData = (data) => {
  if (!data) return 'null';
  try {
    const str = JSON.stringify(data, null, 2);
    if (str.length > 2000) {
      return str.substring(0, 2000) + '\n... [TRUNCATED]';
    }
    return str;
  } catch {
    return '[Unable to serialize]';
  }
};

/**
 * Main debug logger object
 */
export const debugLog = {
  /**
   * Log a "thought" from the state controller - stream of consciousness
   * Used to trace the decision-making process step by step
   * @param {string} context - Where the thought occurred (e.g., 'riskfragor_steg1')
   * @param {string} thought - What the controller is "thinking"
   * @param {object} data - Optional data relevant to this thought
   */
  thought: (context, thought, data = null) => {
    if (!isDebugEnabled()) return;
    
    const logEntry = {
      type: 'THOUGHT',
      timestamp: timestamp(),
      context,
      thought,
      data
    };
    
    sendToBackend(logEntry);
  },

  /**
   * Log when a slide is visited
   * @param {string} slideId - The slide identifier (e.g., 'riskfragor_steg1')
   * @param {object} metadataContent - RAW content from server (unfiltered)
   * @param {object} localStorageContent - Optional: specific localStorage content. If null, collects all case-related localStorage
   */
  slideVisited: (slideId, metadataContent, localStorageContent = null) => {
    if (!isDebugEnabled()) return;
    
    // If no localStorage provided, collect ALL case-related entries
    const localData = localStorageContent !== null 
      ? localStorageContent 
      : collectCaseLocalStorage();
    
    // Send RAW data - no filtering! Backend formats for readability
    const logEntry = {
      type: 'SLIDE_VISITED',
      timestamp: timestamp(),
      slideId,
      // RAW server metadata - send as-is
      metadata_raw: metadataContent,
      // localStorage filtered by case/company, or specific data if provided
      localStorage_raw: localData
    };
    
    sendToBackend(logEntry);
  },

  /**
   * Log network requests
   * @param {string} method - HTTP method (GET, POST, PATCH, DELETE)
   * @param {string} url - Request URL
   * @param {object} requestBody - Request body (for POST/PATCH)
   * @param {object} response - Response data
   * @param {number} status - HTTP status code
   */
  networkRequest: (method, url, requestBody = null, response = null, status = null) => {
    if (!isDebugEnabled()) return;
    
    const logEntry = {
      type: 'NETWORK_REQUEST',
      timestamp: timestamp(),
      method,
      url,
      requestBody: requestBody ? formatSlideData(requestBody) : null,
      response: response ? formatSlideData(response) : null,
      status
    };
    
    sendToBackend(logEntry);
  },

  /**
   * Log state changes
   * @param {string} context - Where the state change occurred
   * @param {string} oldState - Previous state
   * @param {string} newState - New state
   * @param {object} additionalInfo - Any extra info
   */
  stateChange: (context, oldState, newState, additionalInfo = {}) => {
    if (!isDebugEnabled()) return;
    
    const logEntry = {
      type: 'STATE_CHANGE',
      timestamp: timestamp(),
      context,
      oldState,
      newState,
      additionalInfo
    };
    
    sendToBackend(logEntry);
  },

  /**
   * Log localStorage operations
   * @param {string} operation - 'get', 'set', 'remove'
   * @param {string} key - localStorage key
   * @param {any} value - The value (for set operations)
   */
  localStorageOp: (operation, key, value = null) => {
    if (!isDebugEnabled()) return;
    
    const logEntry = {
      type: 'LOCALSTORAGE_OP',
      timestamp: timestamp(),
      operation,
      key,
      value: value ? formatSlideData(value) : null
    };
    
    sendToBackend(logEntry);
  },

  /**
   * Log errors
   * @param {string} context - Where the error occurred
   * @param {Error|string} error - The error
   * @param {object} additionalInfo - Extra context
   */
  error: (context, error, additionalInfo = {}) => {
    if (!isDebugEnabled()) return;
    
    const logEntry = {
      type: 'ERROR',
      timestamp: timestamp(),
      context,
      error: error?.message || String(error),
      stack: error?.stack || null,
      additionalInfo
    };
    
    sendToBackend(logEntry);
  },

  /**
   * Log a custom message
   * @param {string} message - The message
   * @param {object} data - Additional data
   */
  log: (message, data = {}) => {
    if (!isDebugEnabled()) return;
    
    const logEntry = {
      type: 'INFO',
      timestamp: timestamp(),
      message,
      data
    };
    
    sendToBackend(logEntry);
  },

  /**
   * Check if debug mode is enabled (read-only, set via VITE_DEBUG_MODE)
   */
  isEnabled: isDebugEnabled,
  
  /**
   * Show debug status
   */
  status: () => {
    if (DEBUG_MODE) {
      console.log('🐛 Debug mode is ENABLED (VITE_DEBUG_MODE=true)');
      console.log('📁 Logs: tic-tac-toe-server/logs/debug_state_machine.log');
    } else {
      console.log('Debug mode is DISABLED');
      console.log('To enable: Set VITE_DEBUG_MODE=true in .env.development and restart dev server');
    }
    return DEBUG_MODE;
  }
};

// Export helper to wrap fetch with automatic logging
export const createDebugFetch = (originalFetch) => {
  return async (url, options = {}) => {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : null;
    
    // Log request
    debugLog.networkRequest(method, url, body, null, null);
    
    try {
      const response = await originalFetch(url, options);
      const clonedResponse = response.clone();
      
      try {
        const responseData = await clonedResponse.json();
        debugLog.networkRequest(method, url, null, responseData, response.status);
      } catch {
        debugLog.networkRequest(method, url, null, '[Non-JSON response]', response.status);
      }
      
      return response;
    } catch (error) {
      debugLog.error('fetch', error, { url, method });
      throw error;
    }
  };
};

// Make it globally available for easy console access
if (typeof window !== 'undefined') {
  window.debugLog = debugLog;
}

// Export helper to collect case-specific localStorage
export { collectCaseLocalStorage };

export default debugLog;
