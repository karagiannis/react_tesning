/**
 * Company Search API Integration
 * Real Bolagsverket data from SQLite (2.9M companies)
 * Backend: /api/search/companies
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;

/**
 * Search companies by name or orgnr
 * @param {string} query - Search query (min 2 chars)
 * @param {number} limit - Max results (default 10)
 * @returns {Promise<Array>} Array of companies
 */
export async function searchCompanies(query, limit = 10) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      q: query.trim(),
      limit: limit.toString(),
      active_only: 'true'
    });

    const response = await fetch(`${API_BASE_URL}/search/companies?${params}`);
    
    if (!response.ok) {
      console.error('Company search failed:', response.status);
      return [];
    }

    const companies = await response.json();
    
    // Transform API response to match frontend format
    return companies.map(company => ({
      orgnr: company.orgnr,
      name: company.name,
      city: company.city || '',
      org_form: company.org_form || '',
      active: company.active
    }));
  } catch (error) {
    console.error('Error searching companies:', error);
    return [];
  }
}

/**
 * Get detailed company info by orgnr
 * @param {string} orgnr - Organisationsnummer (XXXXXX-XXXX or XXXXXXXXXX)
 * @returns {Promise<Object|null>} Company details or null if not found
 */
export async function getCompanyByOrgNr(orgnr) {
  if (!orgnr) return null;

  try {
    // Clean orgnr (remove spaces, keep dash optional)
    const cleanOrgnr = orgnr.replace(/\s/g, '');
    
    const response = await fetch(`${API_BASE_URL}/search/companies/${cleanOrgnr}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn('Company not found:', orgnr);
        return null;
      }
      console.error('Failed to fetch company:', response.status);
      return null;
    }

    const company = await response.json();
    
    return {
      orgnr: company.orgnr,
      name: company.name,
      city: company.city || '',
      org_form: company.org_form || '',
      address: company.address || '',
      registration_date: company.registration_date || '',
      active: company.active
    };
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}
