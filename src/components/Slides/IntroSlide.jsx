export default function IntroSlide({ onNext }) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Rubrik */}
      <h1 className="text-3xl font-bold text-brand-900 mb-6">
        Inledning och bakgrund
      </h1>

      {/* Huvudtext */}
      <div className="bg-white rounded-lg shadow-sm border border-brand-200 p-6 mb-8">
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Denna onboarding säkerställer att byrån uppfyller <strong>penningtvättslagstiftningens krav</strong> vid 
            antagandet av nya kunder. Processen efterlever tillsynsmyndighetens krav där verksamhetsutövaren (byrån) 
            är skyldig att redovisa hur man säkerställt att byrån inte gör sig skyldig till penningtvätt.
          </p>

          <p>
            <strong>Länsstyrelserna</strong>, som ansvarar för tillsynen, har skärpt kraven på redovisningsbyråer 
            och utfärdar <span className="text-red-600 font-semibold">sanktionsavgifter på hundratusentals kronor</span> vid 
            bristande efterlevnad.
          </p>

          <p>
            Det är dessa <strong>myndighetskrav</strong> som tvingar oss att ställa specifika frågor och att 
            spara dokumentationen i minst <strong>fem år</strong>.
          </p>

          <p className="text-brand-700 font-medium">
            Processen är därmed en följd av myndighetskrav och syftar till att förebygga penningtvätt och 
            ekonomisk brottslighet.
          </p>
        </div>
      </div>

      {/* Info box - Varför dessa frågor? */}
      <div className="bg-white border-l-4 border-brand-500 p-4 mb-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Varför måste vi ställa dessa frågor?
        </h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>✓ <strong>Penningtvättslagen (PTL)</strong> kräver kundkännedom</li>
          <li>✓ <strong>Länsstyrelsen Stockholm</strong> utfärdar författningssamling 01FS 2024-20</li>
          <li>✓ <strong>Sanktionsavgifter</strong> vid bristande efterlevnad (100 000+ kr)</li>
          <li>✓ <strong>Dokumentation</strong> måste sparas i minst 5 år</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-md transition-colors"
        >
          Nästa →
        </button>
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Denna process följer <strong>Länsstyrelsens författningssamling 01FS 2024-20</strong>
        </p>
      </div>
    </div>
  );
}
