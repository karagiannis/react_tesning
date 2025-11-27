/**
 * Auth utilities for token management and auto-refresh
 * 
 * Fixes:
 * - Bug #1: Token expiration after 15 min (auto-refresh interceptor)
 * - Bug #2: Reload logout (auto-login via refreshToken)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://celestial.se/tic-tac-toe-api';

/**
 * Check if JWT token is expired or will expire soon
 * @param {string} token - JWT access token
 * @param {number} bufferSeconds - Refresh before expiry (default 60s)
 * @returns {boolean} - True if token is expired or will expire soon
 */
export function isTokenExpired(token, bufferSeconds = 60) {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const bufferTime = bufferSeconds * 1000;
    
    // Return true if token expires within buffer time
    return now >= (expirationTime - bufferTime);
  } catch (e) {
    console.error('❌ Failed to parse token:', e);
    return true; // Treat invalid tokens as expired
  }
}

/**
 * Refresh access token using refresh token
 * @returns {Promise<string>} - New access token
 * @throws {Error} - If refresh fails
 */
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  console.log('🔄 Refreshing access token...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to refresh token');
    }
    
    const data = await response.json();
    
    // Update tokens in localStorage
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    
    console.log('✅ Access token refreshed successfully');
    
    return data.access_token;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    
    // Clear invalid tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    throw error;
  }
}

/**
 * Fetch with automatic token refresh
 * Interceptor that checks token expiry before each request
 * 
 * @param {string} url - Request URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem('accessToken');
  
  // Check if token is expired or will expire soon
  if (isTokenExpired(token)) {
    console.log('⏰ Token expired or expiring soon - auto-refreshing...');
    try {
      token = await refreshAccessToken();
    } catch (error) {
      console.error('❌ Auto-refresh failed - user must re-login');
      // Redirect to login if refresh fails
      window.location.href = '/login';
      throw error;
    }
  }
  
  // Add Authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };
  
  // Make request with refreshed token
  return fetch(url, { ...options, headers });
}

/**
 * Initialize auth state on app mount
 * Checks for refreshToken and auto-logs in if valid
 * 
 * @param {function} setIsLoggedIn - Callback to set login state
 * @returns {Promise<boolean>} - True if auto-login successful
 */
export async function initAuth(setIsLoggedIn) {
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');
  
  // No refresh token - user is logged out
  if (!refreshToken) {
    console.log('🔓 No refresh token - user logged out');
    setIsLoggedIn(false);
    return false;
  }
  
  // Access token still valid - user is logged in
  if (accessToken && !isTokenExpired(accessToken)) {
    console.log('✅ Access token valid - user logged in');
    setIsLoggedIn(true);
    return true;
  }
  
  // Access token expired - try to refresh
  console.log('🔄 Access token expired - attempting auto-login via refresh token...');
  
  try {
    await refreshAccessToken();
    setIsLoggedIn(true);
    console.log('✅ Auto-login successful');
    return true;
  } catch (error) {
    console.error('❌ Auto-login failed:', error);
    setIsLoggedIn(false);
    return false;
  }
}
