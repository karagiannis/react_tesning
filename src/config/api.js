/**
 * Central API Configuration
 * 
 * All API URLs should be imported from here.
 * Uses environment variables from .env (production) or .env.development (local dev)
 */

// Base URL for API calls (without /api suffix)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://celestial.se/tic-tac-toe-api';

// Full API URL (with /api suffix)
export const API_URL = import.meta.env.VITE_API_URL || `${API_BASE_URL}/api`;

// Helper to build API endpoints
export const apiEndpoint = (path) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/${cleanPath}`;
};

// For debugging
if (import.meta.env.DEV) {
  console.log('🔧 API Config:', { API_BASE_URL, API_URL });
}
