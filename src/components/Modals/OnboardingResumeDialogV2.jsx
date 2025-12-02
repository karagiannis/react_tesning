import { useState, useEffect, useCallback } from 'react';
import { Trash2, ArrowRight, Plus, Clock, TrendingUp, X } from 'lucide-react';

/**
 * OnboardingResumeDialog - Modal som visas om pågående onboardings finns
 * 
 * REFAKTORERAD: 2025-11-30
 * ─────────────────────────────────────────────────────────────────────
 * TIDIGARE: Hooken gjorde egen fetch av /api/onboarding/list
 * NU: Får data från MASTER (useOnboardingSession) via props
 * 
 * Denna komponent är nu en "dumb" presentationskomponent.
 * All logik för fetch/delete/select hanteras av MASTER hook.
 * ─────────────────────────────────────────────────────────────────────
 * 
 * Features:
 * - Lista alla företag med progress bar
 * - "Fortsätt"-knapp → Kallar onSelect callback
 * - "Radera"-knapp → Kallar onDelete callback
 * - "Ny Onboarding Session"-knapp → Kallar onNewSession callback
 * 
 * Props:
 * - companies: Array - Lista av pågående onboardings från MASTER
 * - onSelect: (company) => void - User vill fortsätta denna onboarding
 * - onDelete: (company) => Promise<void> - User vill radera denna onboarding
 * - onNewSession: () => void - User vill starta ny session
 * - onClearSubscription: () => void - Callback för att rensa subscription (optional)
 * - onClose: () => void - Callback för att stänga modalen utan val (optional)
 */
export default function OnboardingResumeDialog({ 
  companies = [],
  onSelect,
  onDelete,
  onNewSession,
  onClearSubscription,
  onClose
}) {
  const [deletingId, setDeletingId] = useState(null);

  // ESC-tangent stänger modalen
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDelete = async (company) => {
    const companyName = company.company_name || 'detta företag';
    
    if (!confirm(`Är du säker på att du vill radera onboarding för ${companyName}?\n\nDetta kommer att permanent radera all data för detta företag.`)) {
      return;
    }

    try {
      setDeletingId(company.company_id);
      await onDelete(company);
      
      // Om inga företag kvar efter delete, gå direkt till ny session
      // (MASTER hook hanterar detta automatiskt)
    } catch (err) {
      console.error('Error deleting onboarding:', err);
      alert(`Kunde inte radera onboarding: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleContinue = (company) => {
    onSelect(company);
  };

  const handleNewSession = () => {
    // Rensa subscription om callback finns
    if (onClearSubscription) {
      onClearSubscription();
    }
    onNewSession();
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

  // Om inga företag, visa inte modalen alls
  // (MASTER hook borde ha gått direkt till 'ready' state)
  if (companies.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-brand-50 to-brand-100 relative">
          {/* Stäng-knapp (X) */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-lg transition-colors"
              title="Stäng (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          )}
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
                key={`${company.company_id}-${company.case_id || company.onboardingId}`}
                className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                {/* Företagsinfo */}
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {company.company_name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Org.nr: {company.orgnr_formatted || company.orgnr}
                  </p>
                  
                  {/* Metadata: Last modified + current step */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(company.last_modified)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="capitalize">{company.current_step?.replace('-', ' ') || 'uppdragsval'}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{company.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          (company.progress || 0) < 30 
                            ? 'bg-red-500' 
                            : (company.progress || 0) < 70 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${company.progress || 0}%` }}
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
                      disabled={deletingId === company.company_id}
                      className={`p-2 rounded-lg transition-colors ${
                        deletingId === company.company_id
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title="Radera onboarding"
                    >
                      {deletingId === company.company_id ? (
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
            onClick={handleNewSession}
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
