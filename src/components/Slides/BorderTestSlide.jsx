import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BorderTestSlide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-card shadow-lg p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-brand-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Tillbaka</span>
        </button>

        <h1 className="text-page-title text-brand-900 mb-6">
          Border-test för PEP-box
        </h1>
        <p className="text-sm text-brand-600 mb-8">
          Jämför de 4 olika border-stilarna nedan. Välj den som känns mest "viktig" och professionell.
        </p>

        <div className="space-y-8">
          {/* VARIANT 1: Enkel tjock vänsterrand (nuvarande) */}
          <div>
            <h2 className="text-section-title text-brand-800 mb-3">
              Variant 1: Enkel tjock vänsterrand (nuvarande design)
            </h2>
            <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded-box">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <div>
                  <span className="block text-section-title text-brand-900">
                    Är du eller någon i företaget en PEP?
                  </span>
                  <span className="text-xs text-brand-700">
                    Personer som innehar eller har innehaft höga offentliga ämbeten.
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-600 mt-2 italic">
              Subtil, professionell, låter innehållet tala
            </p>
          </div>

          {/* VARIANT 2: Dubbel border (grön + gul) */}
          <div>
            <h2 className="text-section-title text-brand-800 mb-3">
              Variant 2: Dubbel vänsterrand (grön 4px + gul 2px inset)
            </h2>
            <div className="relative bg-brand-50 border-l-4 border-brand-500 p-4 rounded-box">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow-400 ml-1"></div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <div>
                  <span className="block text-section-title text-brand-900">
                    Är du eller någon i företaget en PEP?
                  </span>
                  <span className="text-xs text-brand-700">
                    Personer som innehar eller har innehaft höga offentliga ämbeten.
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-600 mt-2 italic">
              Mer uppmärksamhet, men riskerar "kaka på kaka"
            </p>
          </div>

          {/* VARIANT 3: Trippel border (grön + gul + röd) */}
          <div>
            <h2 className="text-section-title text-brand-800 mb-3">
              Variant 3: Trippel vänsterrand (grön 4px + gul 2px + röd 1px)
            </h2>
            <div className="relative bg-brand-50 border-l-4 border-brand-500 p-4 rounded-box">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-yellow-400 via-yellow-400 to-red-500 ml-1"></div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <div>
                  <span className="block text-section-title text-brand-900">
                    Är du eller någon i företaget en PEP?
                  </span>
                  <span className="text-xs text-brand-700">
                    Personer som innehar eller har innehaft höga offentliga ämbeten.
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-600 mt-2 italic">
              Mycket uppmärksamhet, men riskerar "för mycket"
            </p>
          </div>

          {/* VARIANT 4: Hel border runt hela boxen */}
          <div>
            <h2 className="text-section-title text-brand-800 mb-3">
              Variant 4: Hel border runt hela boxen (2px grön)
            </h2>
            <div className="bg-brand-50 border-2 border-brand-500 p-4 rounded-box">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                />
                <div>
                  <span className="block text-section-title text-brand-900">
                    Är du eller någon i företaget en PEP?
                  </span>
                  <span className="text-xs text-brand-700">
                    Personer som innehar eller har innehaft höga offentliga ämbeten.
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-600 mt-2 italic">
              Tydlig avgränsning, men mindre "riktad uppmärksamhet" än vänsterrand
            </p>
          </div>

          {/* VARIANT 5: Alla rutor med subtil border */}
          <div>
            <h2 className="text-section-title text-brand-800 mb-3">
              Variant 5: Alla input-rutor med subtil border
            </h2>
            <div className="space-y-3">
              <div className="bg-white border border-brand-200 p-4 rounded-box hover:border-brand-300 transition-colors">
                <label className="block text-section-title text-brand-800 mb-2">Företagsnamn *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-brand-300 rounded-box-sm focus:ring-2 focus:ring-brand-500 text-sm"
                  placeholder="AB Exempel"
                />
              </div>
              <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded-box">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 text-brand-600 border-brand-300 rounded focus:ring-brand-500"
                  />
                  <div>
                    <span className="block text-section-title text-brand-900">
                      Är du eller någon i företaget en PEP?
                    </span>
                    <span className="text-xs text-brand-700">
                      Personer som innehar eller har innehaft höga offentliga ämbeten.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-600 mt-2 italic">
              Alla rutor får struktur, PEP-boxen sticker fortfarande ut med grön vänsterrand
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-box">
          <h3 className="text-section-title text-blue-900 mb-2">Min rekommendation</h3>
          <p className="text-sm text-blue-800">
            <strong>Variant 1 eller 5</strong> — Fortnox-stilen handlar om subtila detaljer som inte skriker, 
            utan guidar ögat diskret. Vänsterranden säger "viktigt" utan att vara påträngande. 
            Variant 5 ger alla rutor lite struktur, vilket gör PEP-boxen ännu mer framträdande i kontrast.
          </p>
          <p className="text-sm text-blue-800 mt-2">
            <strong>Undvik Variant 2-3</strong> — Flera färger riskerar att se ut som "klistermärken" 
            istället för professionell design. En färg i olika nyanser är mer sofistikerat.
          </p>
        </div>
      </div>
    </div>
  );
}
