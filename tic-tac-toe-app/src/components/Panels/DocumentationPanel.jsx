export default function DocumentationPanel({ onClose }) {
  return (
    <aside className="fixed right-0 top-0 h-full w-96 bg-white border-l border-amber-300 shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-orange-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📚</span>
          <h2 className="text-lg font-bold">Dokumentation</h2>
        </div>
        <button
          onClick={onClose}
          className="text-2xl hover:bg-orange-700 rounded px-2 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-amber-50">
        <h3 className="text-lg font-bold text-amber-900 mb-4">Hur programmet används</h3>
        
        <div className="space-y-4">
          <section>
            <h4 className="font-semibold text-amber-800 mb-2">📋 Onboarding-processen</h4>
            <p className="text-sm text-amber-700">
              Programmet vägleder dig genom alla steg som krävs enligt penningtvättslagen (2017:630) 
              och Länsstyrelsen Stockholms författningssamling 01FS 2024-20.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-amber-800 mb-2">🔍 Automatiska tester</h4>
            <ul className="text-sm text-amber-700 space-y-2 list-disc list-inside">
              <li>Sanktionslistor (PEP, EU, UN)</li>
              <li>Bolagsverket-kontroller</li>
              <li>Ägarstruktur och verklig huvudman</li>
              <li>Riskindikatorer</li>
              <li>Layering-analys (penningtvättsdetektering)</li>
              <li>Likviditetsanalys</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-amber-800 mb-2">📊 Datakällor</h4>
            <ul className="text-sm text-amber-700 space-y-2 list-disc list-inside">
              <li>Bolagsverket</li>
              <li>Roaring.io API</li>
              <li>Open Banking (med samtycke)</li>
              <li>Penningtvättsregistret</li>
              <li>UC Företagsinformation</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-amber-800 mb-2">⚖️ Lagkrav</h4>
            <p className="text-sm text-amber-700">
              All dokumentation sparas i minst 5 år enligt 4 kap. 1 § penningtvättslagen. 
              Riskbedömningar måste vara objektiva och dokumenterade för att undvika sanktionsavgifter.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-amber-800 mb-2">🔐 Säkerhet och GDPR</h4>
            <p className="text-sm text-amber-700">
              All data krypteras och hanteras enligt GDPR. Personuppgifter behandlas endast för 
              AML-compliance och lagras säkert med åtkomstkontroll.
            </p>
          </section>
        </div>
      </div>
    </aside>
  );
}
