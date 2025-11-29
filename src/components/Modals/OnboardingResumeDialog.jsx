import { useState, useEffect } from 'react';
import { Trash2, ArrowRight, Plus, Clock, TrendingUp } from 'lucide-react';

/**
 * OnboardingResumeDialog - Modal som visas vid login om pågående onboardings finns
 * 
 * Features:
 * - Lista alla företag med progress bar
 * - "Fortsätt"-knapp → Laddar data och navigerar till currentStep
 * - "Radera"-knapp → DELETE endpoint, tar bort från lista
 * - "Ny Onboarding Session"-knapp → Stänger dialog, går till Uppdragsval
 * - Dynamisk lista (uppdateras när företag raderas)
 * 
 * Props:
 * - onResume: (data) => void - Callback när användare klickar "Fortsätt"
 * - onNewSession: () => void - Callback när användare klickar "Ny Onboarding Session"
 */
export default function OnboardingResumeDialog({ onResume, onNewSession }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingOrgnr, setDeletingOrgnr] = useState(null);

  useEffect(() => {
    fetchOnboardings();
  }, []);

  const fetchOnboardings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Ingen access token hittades');
      }

      const API_BASE = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;

      const response = await fetch(`${API_BASE}/onboarding/list`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (err) {
      console.error('Error fetching onboardings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (company) => {
    if (!confirm(`Är du säker på att du vill radera onboarding för ${company.companyName}?\n\nDetta kommer att permanent radera all data för detta företag.`)) {
      return;
    }

    try {
      setDeletingOrgnr(company.orgnr);
      
      const token = localStorage.getItem('accessToken');
      const API_BASE = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;

      const companyId = company.company_id;
      const caseId = company.case_id || company.onboardingId;

      if (!companyId || !caseId) {
        throw new Error('company_id eller case_id saknas');
      }

      const response = await fetch(`${API_BASE}/onboarding/delete/${companyId}?onboarding_id=${caseId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Ta bort från listan
      setCompanies(prev => prev.filter(c => c.orgnr !== company.orgnr));

      // Om inga företag kvar, gå direkt till ny session
      if (companies.length === 1) {
        onNewSession();
      }
    } catch (err) {
      console.error('Error deleting onboarding:', err);
      alert(`Kunde inte radera onboarding: ${err.message}`);
    } finally {
      setDeletingOrgnr(null);
    }
  };

  const handleContinue = async (company) => {
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL}/api`;

      const companyId = company.company_id;
      const caseId = company.case_id || company.onboardingId;

      if (!companyId || !caseId) {
        alert('company_id eller case_id saknas');
        return;
      }

      const response = await fetch(`${API_BASE}/onboarding/resume/${companyId}?onboarding_id=${caseId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      onResume(data);  // Callback till App.jsx
    } catch (err) {
      console.error('Error resuming onboarding:', err);
      alert(`Kunde inte ladda onboarding: ${err.message}`);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Okänt datum';
    
    try {
      const date = new Date(isoString);
      return date.toLocaleString('sv-SE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Okänt datum';
    }
  };

  // Om loading, visa spinner
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            <p className="mt-4 text-gray-600">Laddar pågående onboardings...</p>
          </div>
        </div>
      </div>
    );
  }

  // Om error, visa felmeddelande
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <h2 className="text-xl font-bold text-red-600 mb-3">Fel vid laddning</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => fetchOnboardings()}
            className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  // Om inga företag, gå direkt till ny session
  if (companies.length === 0) {
    onNewSession();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-brand-50 to-brand-100">
          <h2 className="text-2xl font-bold text-brand-900 mb-2">
            Pågående Onboarding
          </h2>
          <p className="text-gray-700">
            Du har {companies.length} pågående onboarding{companies.length > 1 ? 's' : ''}. 
            Vill du fortsätta eller starta en ny?
          </p>
        </div>

        {/* Lista över företag (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {companies.map((company) => (
              <div
                key={company.orgnr}
                className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                {/* Företagsinfo */}
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {company.companyName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Org.nr: {company.orgnr_formatted}
                  </p>
                  
                  {/* Metadata: Last modified + current step */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(company.lastModified)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="capitalize">{company.currentStep.replace('-', ' ')}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{company.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          company.progress < 30 
                            ? 'bg-red-500' 
                            : company.progress < 70 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${company.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  {/* Fortsätt-knapp */}
                  <button
                    onClick={() => handleContinue(company)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium shadow-sm"
                    title="Fortsätt onboarding"
                  >
                    Fortsätt
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Radera-knapp - ENDAST OM INTE LÅST */}
                  {!company.is_locked && (
                    <button
                      onClick={() => handleDelete(company)}
                      disabled={deletingOrgnr === company.orgnr}
                      className={`p-2 rounded-lg transition-colors ${
                        deletingOrgnr === company.orgnr
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title="Radera onboarding"
                    >
                      {deletingOrgnr === company.orgnr ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Ny Onboarding-knapp */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onNewSession}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
          >
            <Plus className="w-5 h-5" />
            Ny Onboarding Session
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Starta en ny onboarding för ett annat företag
          </p>
        </div>
      </div>
    </div>
  );
}
