/**
 * ExampleSlide_v2.jsx
 * 
 * EXEMPEL: Så här ser en "dum" slide ut i tic-tac-toe arkitekturen
 * 
 * REGLER:
 * 1. INGEN useState för data (bara för lokal UI som dropdown open/closed)
 * 2. INGEN useEffect för API-anrop
 * 3. INGEN navigate() direkt
 * 4. INGEN localStorage
 * 5. ALLA klick → actions.xxx()
 */

import { useMasterContext } from '../../context/MasterStateContext_v2';

export default function ExampleSlide_v2() {
  // Hämta state och actions från context
  const { state, actions } = useMasterContext();
  
  // Hämta data för denna slide
  const slideData = actions.getSlideData('example');
  
  // Slide är helt "dum" - den renderar bara baserat på state
  // och anropar actions vid interaktion
  
  return (
    <div className="min-h-screen bg-brand-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-card shadow-lg p-8">
        
        <h1 className="text-2xl font-bold text-brand-900 mb-6">
          Exempel Slide (v2 - Dum komponent)
        </h1>
        
        {/* Loading state - hanteras centralt */}
        {state.isLoading && (
          <div className="text-center py-4">
            <span className="animate-spin">⏳</span> {state.loadingMessage}
          </div>
        )}
        
        {/* Error state - hanteras centralt */}
        {state.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {state.error}
          </div>
        )}
        
        {/* Form fields - onChange anropar actions.updateField */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Företagsnamn
            </label>
            <input
              type="text"
              value={slideData.company_name || ''}
              onChange={(e) => actions.updateField('example', 'company_name', e.target.value)}
              className="w-full px-4 py-2 border rounded-box focus:ring-2 focus:ring-brand-500"
              placeholder="Ange företagsnamn"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organisationsnummer
            </label>
            <input
              type="text"
              value={slideData.orgnr || ''}
              onChange={(e) => actions.updateField('example', 'orgnr', e.target.value)}
              className="w-full px-4 py-2 border rounded-box focus:ring-2 focus:ring-brand-500"
              placeholder="XXXXXX-XXXX"
            />
          </div>
          
          {/* Checkbox group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tjänster
            </label>
            <div className="space-y-2">
              {['Bokföring', 'Revision', 'Rådgivning'].map((service) => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={slideData.services?.includes(service) || false}
                    onChange={(e) => {
                      const currentServices = slideData.services || [];
                      const newServices = e.target.checked
                        ? [...currentServices, service]
                        : currentServices.filter(s => s !== service);
                      actions.updateField('example', 'services', newServices);
                    }}
                    className="mr-2"
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Navigation buttons - onClick anropar actions.back/next */}
        <div className="flex justify-between mt-8">
          <button
            onClick={actions.back}
            className="px-6 py-3 border border-gray-300 rounded-box hover:bg-gray-50"
          >
            ← Tillbaka
          </button>
          
          <button
            onClick={actions.next}
            className="px-6 py-3 bg-brand-600 text-white rounded-box hover:bg-brand-700"
          >
            Nästa →
          </button>
        </div>
        
        {/* Debug info (ta bort i produktion) */}
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-xs">
            <strong>Debug:</strong>
            <pre>{JSON.stringify({ slideData, current_slide: state.currentSlideKey }, null, 2)}</pre>
          </div>
        )}
        
      </div>
    </div>
  );
}
