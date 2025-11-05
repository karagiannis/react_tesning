import { useState } from 'react';

export default function PEPSlide({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    medlensUrsprung: '',
    affarsverksamhet: '',
    ekonomiskaResurser: '',
    dokumentation: '',
    hogrisklander: '',
    andraOmstandigheter: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.medlensUrsprung.trim() && 
           formData.affarsverksamhet.trim() && 
           formData.ekonomiskaResurser.trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-card shadow-2xl p-10">
        <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded mb-6">
          <h1 className="text-page-title text-red-900 mb-2 flex items-center gap-2">
            ⚠️ Skärpt kundkännedom – PEP
          </h1>
          <p className="text-sm text-red-800">
            Eftersom du eller någon i företaget är en <strong>PEP (person i politiskt utsatt ställning)</strong> krävs 
            fördjupad kontroll enligt penningtvättslagen.
          </p>
        </div>

        <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded mb-6">
          <p className="text-sm text-brand-900">
            <strong>📋 Vad är en PEP?</strong><br />
            Personer som innehar eller har innehaft höga offentliga ämbeten (politiska uppdrag, domaruppdrag, 
            ledande militära befattningar, högre positioner i statliga företag eller internationella organisationer). 
            Detta inkluderar även familjemedlemmar och kända medarbetare till sådana personer.
          </p>
        </div>

        <p className="text-brand-800 mb-6">
          Vänligen besvara följande frågor så noggrant som möjligt:
        </p>

        <div className="space-y-6">
          {/* Medlens ursprung */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              1. Vad är ursprunget till de medel som ska användas i affärsförbindelsen? *
            </label>
            <textarea
              value={formData.medlensUrsprung}
              onChange={(e) => handleChange('medlensUrsprung', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              rows={3}
              placeholder="Beskriv tydligt varifrån medlen kommer (t.ex. lön, arv, företagsvinst, försäljning av tillgångar...)"
            />
          </div>

          {/* Affärsverksamhetens syfte */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              2. Beskriv affärsverksamhetens syfte och art *
            </label>
            <textarea
              value={formData.affarsverksamhet}
              onChange={(e) => handleChange('affarsverksamhet', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              rows={3}
              placeholder="Vad gör företaget? Vilka tjänster eller produkter erbjuds? Vilka är kunderna?"
            />
          </div>

          {/* Ekonomiska resurser */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              3. Vilka ekonomiska medel och resurser har företaget tillgång till? *
            </label>
            <textarea
              value={formData.ekonomiskaResurser}
              onChange={(e) => handleChange('ekonomiskaResurser', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              rows={3}
              placeholder="Beskriv företagets finansiella situation, kapitaltillgång, krediter, etc."
            />
          </div>

          {/* Dokumentation */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              4. Finns det ytterligare dokumentation som styrker medlens ursprung?
            </label>
            <textarea
              value={formData.dokumentation}
              onChange={(e) => handleChange('dokumentation', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              rows={2}
              placeholder="T.ex. kontoutdrag, arvsskiften, köpekontrakt, årsredovisningar..."
            />
            <p className="text-xs text-brand-600 mt-1">
              Dokumentation kan laddas upp senare eller skickas via e-post till din kontaktperson.
            </p>
          </div>

          {/* Högriskländer */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              5. Har du eller någon i företaget affärsrelationer med högriskländer?
            </label>
            <textarea
              value={formData.hogrisklander}
              onChange={(e) => handleChange('hogrisklander', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              rows={2}
              placeholder="Om ja, ange vilka länder och typen av affärsrelation..."
            />
            <p className="text-xs text-brand-600 mt-1">
              Högriskländer inkluderar enligt FATF: bl.a. Iran, Nordkorea, Myanmar, vissa afrikanska och mellanösternländer.
            </p>
          </div>

          {/* Andra omständigheter */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              6. Finns det andra omständigheter som kan påverka riskbedömningen?
            </label>
            <textarea
              value={formData.andraOmstandigheter}
              onChange={(e) => handleChange('andraOmstandigheter', e.target.value)}
              className="w-full px-4 py-2 border border-brand-300 rounded-box focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              rows={2}
              placeholder="T.ex. tidigare juridiska problem, ovanliga transaktionsmönster, etc."
            />
          </div>
        </div>

        {/* Legal info */}
        <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded mt-6 mb-6">
          <p className="text-xs text-brand-800">
            <strong>Lagstöd:</strong> Enligt penningtvättslagen 3 kap. 8-9 §§ ska fördjupad kundkännedom tillämpas 
            vid affärsförbindelser med PEP. Detta innebär bland annat att inhämta information om medlens ursprung och 
            syftet med affärsförbindelsen, samt förstärkt löpande uppföljning.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="w-1/3 px-8 py-3 bg-gray-200 text-gray-700 rounded-box hover:bg-gray-300 transition-colors font-semibold"
          >
            Tillbaka
          </button>
          <button
            onClick={onNext}
            disabled={!isFormValid()}
            className={`w-2/3 px-8 py-3 rounded-box font-semibold transition-all ${
              isFormValid()
                ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Nästa
          </button>
        </div>
        {!isFormValid() && (
          <p className="text-center text-sm text-brand-600 mt-2">
            Frågorna markerade med * måste besvaras för att fortsätta
          </p>
        )}
      </div>
    </div>
  );
}
