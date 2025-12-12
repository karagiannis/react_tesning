import { useState } from 'react';
import { Trash2, ArrowRight, Plus, Clock, TrendingUp } from 'lucide-react';

/**
 * OnboardingResumeDialog_v2 - Modal som visas vid login om pågående onboardings finns
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * SLAV-PATTERN: Denna komponent är en "dum" presentationskomponent
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * - GÖR INGEN EGEN FETCH
 * - Tar emot ALL data via props
 * - Anropar callbacks för alla actions (parent hanterar logik)
 * - Har endast lokal UI-state (t.ex. deletingId för spinner)
 * 
 * PROPS:
 * ──────────────────────────────────────────────────────────────────────────────
 * @param {Array} pendingOnboardings - Lista av pågående onboardings från parent
 *   Varje objekt innehåller:
 *   - company_id: string
 *   - case_id: string
 *   - company_name: string
 *   - orgnr: string
 *   - orgnr_formatted: string (t.ex. "556677-8899")
 *   - last_modified: ISO date string
 *   - current_step: string (t.ex. "riskfragor")
 *   - progress: number (0-100)
 *   - is_locked: boolean (orgnr låst - point of no return passerat)
 *   - is_completed: boolean (avtal signerat - kan ej raderas)
 * 
 * @param {boolean} isLoading - Visar loading spinner om true
 * @param {string|null} error - Visar felmeddelande om satt
 * 
 * CALLBACKS:
 * ──────────────────────────────────────────────────────────────────────────────
 * @param {Function} onResume - (company_id, case_id, company_name) => void
 *   Anropas när användaren klickar "Fortsätt" på en onboarding
 * 
 * @param {Function} onDelete - (company_id, case_id) => Promise<void>
 *   Anropas när användaren bekräftar radering
 *   Parent ansvarar för API-anrop och att uppdatera pendingOnboardings
 * 
 * @param {Function} onStartNew - () => void
 *   Anropas när användaren klickar "Ny Onboarding Session"
 * 
 * @param {Function} onRetry - () => void
 *   Anropas när användaren klickar "Försök igen" efter fel
 * 
 * FLÖDE I PARENT (AuthenticatedApp_v3):
 * ──────────────────────────────────────────────────────────────────────────────
 * 
 * CHECKING_PENDING:
 *   → fetchPendingOnboardings()
 *   → setPendingOnboardings(result)
 *   → setAppState(SHOWING_RESUME)
 * 
 * SHOWING_RESUME:
 *   → Renderar <OnboardingResumeDialog_v2 ... />
 *   → Väntar på callback
 * 
 * onResume(company_id, case_id, company_name):
 *   → setActiveCase({ company_id, case_id, company_name })
 *   → setAppState(RESUMING)
 * 
 * onDelete(company_id, case_id):
 *   → API: DELETE /onboarding/delete/{company_id}?case_id={case_id}
 *   → setPendingOnboardings(prev => prev.filter(...))
 *   → Om listan tom: onStartNew()
 * 
 * onStartNew():
 *   → Rensa state
 *   → setAppState(READY)
 * 
 */
export default function OnboardingResumeDialog_v2({
  // Data props
  pendingOnboardings = [],
  isLoading = false,
  error = null,
  
  // Callbacks
  onResume,
  onDelete,
  onStartNew,
  onRetry,
}) {
  // ─────────────────────────────────────────────────────────────────────────
  // LOKAL UI-STATE: Endast för visuell feedback
  // ─────────────────────────────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState(null);
  // deletingId = "company_id::case_id" när radering pågår
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleDelete - Visa confirm, anropa parent callback
  // ─────────────────────────────────────────────────────────────────────────
  const handleDelete = async (company) => {
    const confirmMessage = `Är du säker på att du vill radera onboarding för ${company.company_name}?\n\nDetta kommer att permanent radera all data för detta företag.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    const deleteKey = `${company.company_id}::${company.case_id}`;
    setDeletingId(deleteKey);
    
    try {
      // Parent hanterar API-anrop och uppdaterar pendingOnboardings
      await onDelete(company.company_id, company.case_id);
    } catch (err) {
      // Parent kan kasta fel - vi visar det
      alert(`Kunde inte radera onboarding: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // handleContinue - Anropa parent callback med valda IDs
  // ─────────────────────────────────────────────────────────────────────────
  const handleContinue = (company) => {
    const case_id = company.case_id;
    console.log('[OnboardingResumeDialog] 🚀 Resume clicked:', {
      company_id: company.company_id,
      case_id: case_id,
    });
    onResume(
      company.company_id,
      case_id,
      company.company_name
    );
  };
  
  // ─────────────────────────────────────────────────────────────────────────
  // formatDate - Formatera ISO-datum till läsbart format
  // ─────────────────────────────────────────────────────────────────────────
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

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Loading state
  // ═══════════════════════════════════════════════════════════════════════════
  if (isLoading) {
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

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Error state
  // ═══════════════════════════════════════════════════════════════════════════
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <h2 className="text-xl font-bold text-red-600 mb-3">Fel vid laddning</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Empty state - Inga pending onboardings
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // OBS: Detta borde normalt inte hända eftersom parent (CHECKING_PENDING)
  //      bara går till SHOWING_RESUME om pendingOnboardings.length > 0.
  //      Men vi hanterar det ändå för robusthet.
  //
  if (pendingOnboardings.length === 0) {
    // Anropa onStartNew direkt - ingen modal behövs
    onStartNew();
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Lista av pågående onboardings
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* ═══════════════════════════════════════════════════════════════════
            HEADER
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-brand-50 to-brand-100">
          <h2 className="text-2xl font-bold text-brand-900 mb-2">
            Pågående Onboarding
          </h2>
          <p className="text-gray-700">
            Du har {pendingOnboardings.length} pågående onboarding{pendingOnboardings.length > 1 ? 's' : ''}. 
            Vill du fortsätta eller starta en ny?
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            LISTA (scrollable)
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {pendingOnboardings.map((company) => {
              const deleteKey = `${company.company_id}::${company.case_id}`;
              const isDeleting = deletingId === deleteKey;
              
              return (
                <div
                  key={company.company_id + '::' + company.case_id}
                  className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {/* ─────────────────────────────────────────────────────────
                      Företagsinfo (vänster)
                      ───────────────────────────────────────────────────────── */}
                  <div className="flex-1 min-w-0 mr-4">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {company.company_name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Org.nr: {company.orgnr_formatted || company.orgnr}
                    </p>
                    
                    {/* Metadata: Last modified + current slide */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(company.last_modified)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="capitalize">
                          {company.current_slide?.replace(/-/g, ' ')}
                        </span>
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

                  {/* ─────────────────────────────────────────────────────────
                      Action buttons (höger)
                      ───────────────────────────────────────────────────────── */}
                  <div className="flex gap-2">
                    {/* Fortsätt-knapp */}
                    <button
                      onClick={() => handleContinue(company)}
                      disabled={isDeleting}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Fortsätt onboarding"
                    >
                      Fortsätt
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* ─────────────────────────────────────────────────────────
                        Radera-knapp
                        ─────────────────────────────────────────────────────────
                        
                        OBS: is_locked betyder att ORGNR är låst (point of no 
                        return passerat), INTE att man inte kan radera!
                        
                        Alla pending onboardings kan raderas (soft delete på 
                        servern sätter status='cancelled').
                        
                        Undantag: Om company.is_completed === true (avtal 
                        signerat) bör vi inte tillåta radering.
                    */}
                    {!company.is_completed && (
                      <button
                        onClick={() => handleDelete(company)}
                        disabled={isDeleting}
                        className={`p-2 rounded-lg transition-colors ${
                          isDeleting
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        title="Radera onboarding"
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            FOOTER: Ny Onboarding-knapp
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onStartNew}
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
