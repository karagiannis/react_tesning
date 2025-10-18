import { useState } from 'react';

export default function RiskFragorSlide({ onNext, onSkipPEP }) {
  const [formData, setFormData] = useState({
    affarsIde: '',
    kundTyper: {
      privatpersoner: false,
      foretag: false,
      offentligSektor: false,
    },
    utlandskaPartners: '',
    storaLeverantorer: '',
    verksamhetAndrad: '',
    organisationsnummer: '',
    personnummer: '',
    isPEP: false,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      kundTyper: { ...prev.kundTyper, [field]: checked }
    }));
  };

  const isFormValid = () => {
    return formData.affarsIde.trim() && 
           formData.organisationsnummer.trim() && 
           formData.personnummer.trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">
          Frågor som stödjer riskbedömning
        </h1>
        
        <p className="text-sm text-amber-700 mb-6">
          Flera av dessa frågor har lagstöd och hjälper oss att bedöma risken:
        </p>

        <div className="space-y-6">
          {/* Affärsidé */}
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Vad är företagets huvudsakliga affärsidé? *
            </label>
            <textarea
              value={formData.affarsIde}
              onChange={(e) => handleChange('affarsIde', e.target.value)}
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={3}
              placeholder="Beskriv kort företagets verksamhet..."
            />
          </div>

          {/* Kundtyper */}
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Vilka typer av kunder har företaget?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.kundTyper.privatpersoner}
                  onChange={(e) => handleCheckboxChange('privatpersoner', e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-amber-300 rounded focus:ring-amber-500"
                />
                <span className="text-amber-800">Privatpersoner</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.kundTyper.foretag}
                  onChange={(e) => handleCheckboxChange('foretag', e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-amber-300 rounded focus:ring-amber-500"
                />
                <span className="text-amber-800">Företag</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.kundTyper.offentligSektor}
                  onChange={(e) => handleCheckboxChange('offentligSektor', e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-amber-300 rounded focus:ring-amber-500"
                />
                <span className="text-amber-800">Offentlig sektor</span>
              </label>
            </div>
          </div>

          {/* Utländska partners */}
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Har företaget återkommande utländska affärspartners?
            </label>
            <textarea
              value={formData.utlandskaPartners}
              onChange={(e) => handleChange('utlandskaPartners', e.target.value)}
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={2}
              placeholder="Beskriv vilka länder och typ av samarbete..."
            />
          </div>

          {/* Största leverantörer */}
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Vilka är de största leverantörerna, och var är de etablerade?
            </label>
            <textarea
              value={formData.storaLeverantorer}
              onChange={(e) => handleChange('storaLeverantorer', e.target.value)}
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={2}
              placeholder="Lista de viktigaste leverantörerna..."
            />
          </div>

          {/* Verksamhetsändring */}
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Har verksamheten ändrats på senare tid?
            </label>
            <textarea
              value={formData.verksamhetAndrad}
              onChange={(e) => handleChange('verksamhetAndrad', e.target.value)}
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={2}
              placeholder="Beskriv eventuella förändringar..."
            />
          </div>

          {/* Organisationsnummer */}
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Organisationsnummer *
            </label>
            <input
              type="text"
              value={formData.organisationsnummer}
              onChange={(e) => handleChange('organisationsnummer', e.target.value)}
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="XXXXXX-XXXX"
            />
            <p className="text-xs text-amber-600 mt-1">
              Organisationsnumret används för att hämta officiell information från Bolagsverket eller Roaring.io.
            </p>
          </div>

          {/* Personnummer */}
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Personnummer *
            </label>
            <input
              type="text"
              value={formData.personnummer}
              onChange={(e) => handleChange('personnummer', e.target.value)}
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="YYYYMMDD-XXXX"
            />
            <p className="text-xs text-amber-600 mt-1">
              Personnumret används för att hämta officiell information från Bolagsverket eller Roaring.io.
            </p>
          </div>

          {/* PEP-fråga */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.isPEP}
                onChange={(e) => handleChange('isPEP', e.target.checked)}
                className="mt-1 w-5 h-5 text-orange-600 border-amber-300 rounded focus:ring-amber-500"
              />
              <div>
                <span className="block font-medium text-amber-900">
                  Är du eller någon i företaget en PEP (person i politiskt utsatt ställning)?
                </span>
                <span className="text-sm text-amber-700">
                  Detta inkluderar personer som innehar eller har innehaft höga offentliga ämbeten.
                </span>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={() => {
            if (formData.isPEP) {
              onNext();
            } else {
              onSkipPEP();
            }
          }}
          disabled={!isFormValid()}
          className={`w-full mt-8 px-8 py-3 rounded-lg font-semibold transition-all ${
            isFormValid()
              ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Nästa
        </button>
      </div>
    </div>
  );
}
