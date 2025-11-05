import { useState } from 'react';

export default function FortnoxPackageSlide({ onNext, onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('single'); // 'single' eller 'employees'
  const [showStartupInfo, setShowStartupInfo] = useState(false);

  // Paket för enmansföretagare
  const singlePackages = [
    {
      name: 'Mini',
      price: 189,
      recommended: false,
      forWho: 'För dig som bara vill bokföra',
      features: [
        { name: 'Bokför med automatik', included: true },
        { name: 'Koppla till bank- & skattekonto', included: true },
        { name: 'Företagskort', included: true },
        { name: 'Fakturera dina kunder', included: true },
        { name: 'Ta ut lön till dig själv', included: false },
        { name: 'Integrera system', included: false },
        { name: 'Skapa avancerade rapporter', included: false }
      ]
    },
    {
      name: 'Liten',
      price: 319,
      recommended: true,
      label: 'Mest köpt!',
      forWho: 'Populärt för enskild firma',
      features: [
        { name: 'Bokför med automatik', included: true },
        { name: 'Koppla till bank- & skattekonto', included: true },
        { name: 'Företagskort', included: true },
        { name: 'Fakturera dina kunder', included: true },
        { name: 'Ta ut lön till dig själv', included: true },
        { name: 'Integrera system', included: true },
        { name: 'Skapa avancerade rapporter', included: false }
      ]
    },
    {
      name: 'Mellan',
      price: 489,
      recommended: true,
      label: 'Rekommenderat av oss',
      forWho: 'Populärt för aktiebolag',
      features: [
        { name: 'Bokför med automatik', included: true },
        { name: 'Koppla till bank- & skattekonto', included: true },
        { name: 'Företagskort', included: true },
        { name: 'Fakturera dina kunder', included: true },
        { name: 'Ta ut lön till dig själv', included: true },
        { name: 'Integrera system', included: true },
        { name: 'Skapa avancerade rapporter', included: true }
      ]
    },
    {
      name: 'Stor',
      price: 709,
      recommended: false,
      forWho: 'Om du vill ha stenkoll',
      features: [
        { name: 'Bokför med automatik', included: true },
        { name: 'Koppla till bank- & skattekonto', included: true },
        { name: 'Företagskort', included: true },
        { name: 'Fakturera dina kunder', included: true },
        { name: 'Ta ut lön till dig själv', included: true },
        { name: 'Integrera system', included: true },
        { name: 'Skapa avancerade rapporter', included: true }
      ]
    }
  ];

  // Paket för företag med anställda
  const employeePackages = [
    {
      name: 'Mini+',
      price: 329,
      recommended: false,
      features: [
        { name: 'Bokför med automatik', included: true },
        { name: 'Koppla till bank- & skattekonto', included: true },
        { name: 'Företagskort', included: true },
        { name: 'Integrera system', included: true },
        { name: 'Fakturera dina kunder', included: true },
        { name: 'Hantera löner i Fortnox', included: true },
        { name: 'Attestera fakturor', included: true },
        { name: 'Anläggningsregister', included: true },
        { name: 'Skapa avancerade rapporter', included: false }
      ]
    },
    {
      name: 'Liten+',
      price: 439,
      recommended: false,
      features: [
        { name: 'Bokför med automatik', included: true },
        { name: 'Koppla till bank- & skattekonto', included: true },
        { name: 'Företagskort', included: true },
        { name: 'Integrera system', included: true },
        { name: 'Fakturera dina kunder', included: true },
        { name: 'Hantera löner i Fortnox', included: true },
        { name: 'Attestera fakturor', included: true },
        { name: 'Anläggningsregister', included: true },
        { name: 'Skapa avancerade rapporter', included: false }
      ]
    },
    {
      name: 'Mellan+',
      price: 589,
      recommended: true,
      label: 'Populärt!',
      features: [
        { name: 'Bokför med automatik', included: true },
        { name: 'Koppla till bank- & skattekonto', included: true },
        { name: 'Företagskort', included: true },
        { name: 'Integrera system', included: true },
        { name: 'Fakturera dina kunder', included: true },
        { name: 'Hantera löner i Fortnox', included: true },
        { name: 'Attestera fakturor', included: true },
        { name: 'Anläggningsregister', included: true },
        { name: 'Skapa avancerade rapporter', included: true }
      ]
    },
    {
      name: 'Stor+',
      price: 839,
      recommended: false,
      features: [
        { name: 'Bokför med automatik', included: true },
        { name: 'Koppla till bank- & skattekonto', included: true },
        { name: 'Företagskort', included: true },
        { name: 'Integrera system', included: true },
        { name: 'Fakturera dina kunder', included: true },
        { name: 'Hantera löner i Fortnox', included: true },
        { name: 'Attestera fakturor', included: true },
        { name: 'Anläggningsregister', included: true },
        { name: 'Skapa avancerade rapporter', included: true }
      ]
    }
  ];

  const packages = selectedCategory === 'single' ? singlePackages : employeePackages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-7xl w-full bg-white rounded-card shadow-2xl p-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Koppling till Fortnox
          </h1>
          <p className="text-brand-700 text-lg">
            Vi använder Fortnox som bokföringsprogram. Du behöver ett eget abonnemang.
          </p>
          <div className="mt-3 p-4 bg-brand-50 rounded-box border-l-4 border-brand-600">
            <p className="text-sm text-brand-800 italic">
              💬 <strong>Din redovisningskonsult:</strong> "Vi rekommenderar våra klienter att köpa <strong>Mini</strong> eller <strong>Mellan</strong>. 
              Om du gör beställningen med en gång kan jag koppla upp dig direkt till vårt företagskonto."
            </p>
          </div>
        </div>

        {/* Category Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedCategory('single')}
            className={`flex-1 py-3 px-6 rounded-box font-semibold transition-all ${
              selectedCategory === 'single'
                ? 'bg-brand-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            För enmansföretagare
          </button>
          <button
            onClick={() => setSelectedCategory('employees')}
            className={`flex-1 py-3 px-6 rounded-box font-semibold transition-all ${
              selectedCategory === 'employees'
                ? 'bg-brand-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            För dig med anställda
          </button>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative border-2 rounded-card p-5 transition-all hover:shadow-xl ${
                pkg.recommended
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Label */}
              {pkg.label && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                  {pkg.label}
                </div>
              )}

              {/* Package Name */}
              <h3 className="text-page-title text-brand-900 mb-2">{pkg.name}</h3>
              
              {/* For Who */}
              {pkg.forWho && (
                <p className="text-xs text-gray-600 mb-3">{pkg.forWho}</p>
              )}

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-brand-800">{pkg.price}</span>
                <span className="text-gray-600 ml-2">kr/mån</span>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-5">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    {feature.included ? (
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={feature.included ? 'text-gray-800' : 'text-gray-400 line-through'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Order Button */}
              <a
                href="https://www.fortnox.se/paket"
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-2 px-4 rounded-box text-center font-semibold transition-all ${
                  pkg.recommended
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Beställ
              </a>
            </div>
          ))}
        </div>

        {/* Startup Offer */}
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-box">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="flex-1">
              <h4 className="font-bold text-yellow-900 mb-1">Erbjudande för nystartade företag 🎉</h4>
              <p className="text-sm text-yellow-800">
                Använd koden <strong className="font-mono bg-yellow-200 px-2 py-1 rounded">NYSTARTAD</strong> och få valfritt paket kostnadsfritt i 6 månader!
              </p>
              <button
                onClick={() => setShowStartupInfo(!showStartupInfo)}
                className="text-xs text-yellow-700 underline mt-1 hover:text-yellow-900"
              >
                {showStartupInfo ? 'Dölj villkor' : 'Visa villkor'}
              </button>
              {showStartupInfo && (
                <p className="text-xs text-yellow-700 mt-2">
                  Gäller endast för företag startade inom senaste 3 månaderna, räknat från beställningstillfället.
                  Efter den kostnadsfria perioden gäller ordinarie pris.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-brand-50 rounded-box">
            <h4 className="font-semibold text-brand-900 mb-2">✓ 30 dagar öppet köp</h4>
            <p className="text-sm text-brand-700">Testa utan risk</p>
          </div>
          <div className="p-4 bg-brand-50 rounded-box">
            <h4 className="font-semibold text-brand-900 mb-2">✓ Fri support</h4>
            <p className="text-sm text-brand-700">Via telefon och chatt</p>
          </div>
          <div className="p-4 bg-brand-50 rounded-box">
            <h4 className="font-semibold text-brand-900 mb-2">✓ Trygg i molnet</h4>
            <p className="text-sm text-brand-700">Alltid uppdaterad</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-box hover:bg-gray-300 transition-all font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka
          </button>

          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-box hover:bg-brand-700 transition-all font-semibold shadow-lg"
          >
            Nästa: Bankkoppling
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
