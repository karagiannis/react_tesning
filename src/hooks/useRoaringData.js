/**
 * useRoaringData Hook
 * 
 * SINGLE FETCH for all OUTPUT slides (5-9)
 * Fetches Roaring.io data from metadata.json once, then caches in localStorage
 * 
 * Usage:
 * ```jsx
 * const { data, loading, error } = useRoaringData();
 * const verksamhet = data?.verksamhet;
 * const agarstruktur = data?.agarstruktur;
 * ```
 */

import { useState, useEffect } from 'react';

/**
 * Helper: Get orgnr from localStorage
 */
function getOrgnrFromStorage() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    const userId = decoded.sub || decoded.user_id || decoded.email;
    return localStorage.getItem(`onboarding-${userId}-roaring-orgnr`) || null;
  } catch (e) {
    return null;
  }
}

/**
 * Helper: Get userId from JWT token
 */
function getUserIdFromToken() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || decoded.user_id || decoded.email;
  } catch (e) {
    return null;
  }
}

export default function useRoaringData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoaringData = async () => {
      setLoading(true);
      setError(null);

      try {
        const orgnr = getOrgnrFromStorage();
        if (!orgnr) {
          throw new Error('Organisationsnummer saknas i localStorage');
        }

        const userId = getUserIdFromToken();
        if (!userId) {
          throw new Error('Användar-ID saknas');
        }

        // Check if data exists in localStorage (cache)
        const cacheKey = `onboarding-${userId}-roaring-data`;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            // Check if cache is fresh (< 1 hour old)
            const cacheAge = Date.now() - new Date(parsed.cached_at).getTime();
            const ONE_HOUR = 60 * 60 * 1000;
            
            if (cacheAge < ONE_HOUR) {
              console.log('📦 Using cached Roaring.io data');
              setData(parsed.data);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn('⚠️ Failed to parse cached data:', e);
          }
        }

        // Fetch from backend
        const token = localStorage.getItem('accessToken');
        const response = await fetch(
          `https://celestial.se/tic-tac-toe-api/api/onboarding/${orgnr}/roaring-data`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Kunde inte hämta Roaring.io data');
        }

        const roaringData = await response.json();
        console.log('✅ Fetched Roaring.io data from server:', roaringData);

        // Cache in localStorage
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: roaringData,
            cached_at: new Date().toISOString(),
          })
        );

        setData(roaringData);
      } catch (err) {
        console.error('❌ useRoaringData error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoaringData();
  }, []); // Run once on mount

  return { data, loading, error };
}
