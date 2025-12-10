import React from 'react';

// Helper för att formatera tal säkert
const formatNumber = (value, divisor = 1, decimals = 0, suffix = '') => {
  if (value === undefined || value === null || isNaN(value)) return 'N/A';
  return (value / divisor).toFixed(decimals) + suffix;
};

export default function OvrigaDataSlide({ onNext, onBack, formData = {} }) {
  // ═══════════════════════════════════════════════════════════════════════
  // DEFENSIVE: Early return om data inte finns (async loading pågår)
  // Samma mönster som VerksamhetSlide
  // ═══════════════════════════════════════════════════════════════════════
  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-card shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin h-12 w-12 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-brand-900">Laddar övriga data...</h2>
          <p className="text-sm text-brand-600 mt-2">Hämtar information från server</p>
        </div>
      </div>
    );
  }

  // Extrahera data med fallbacks
  const propertyData = formData.propertyInformation || {};
  const engagementsData = formData.companyEngagements || {};
  const caseData = formData.companyCaseRegister || {};
  const financialData = formData.financialInformation || {};
  const establishmentsData = formData.establishments || [];
  const shareData = formData.shareFacts || {};

  // Säkra arrayer (kan vara undefined)
  const properties = propertyData.properties || [];
  const engagements = engagementsData.engagements || [];
  const cases = caseData.cases || [];
  const shareClasses = shareData.shareClasses || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-card shadow-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-page-title text-brand-900 mb-2">
            Övriga datapunkter
          </h1>
          <p className="text-sm text-brand-700">
            Kompletterande information om fastigheter, uppdrag, ärenden och finansiella data
          </p>
        </div>

        {/* Ekonomisk översikt */}
        <div className="mb-6 p-6 bg-gradient-to-r from-brand-50 to-brand-50 rounded-card border-2 border-brand-200">
          <h2 className="text-section-title text-brand-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ekonomisk information ({financialData.latestYear || 'N/A'})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-box border border-brand-200">
              <div className="text-sm text-gray-600 mb-1">Omsättning</div>
              <div className="text-page-title text-gray-800">
                {formatNumber(financialData.revenue, 1000000, 1, 'M')}
              </div>
              <div className="text-xs text-gray-500">{financialData.currency || ''}</div>
            </div>
            <div className="p-4 bg-white rounded-box border border-brand-200">
              <div className="text-sm text-gray-600 mb-1">Rörelseresultat</div>
              <div className="text-page-title text-green-600">
                {formatNumber(financialData.operatingProfit, 1000, 0, 'k')}
              </div>
              <div className="text-xs text-gray-500">{financialData.currency || ''}</div>
            </div>
            <div className="p-4 bg-white rounded-box border border-brand-200">
              <div className="text-sm text-gray-600 mb-1">Resultat efter skatt</div>
              <div className="text-page-title text-green-600">
                {formatNumber(financialData.profitAfterTax, 1000, 0, 'k')}
              </div>
              <div className="text-xs text-gray-500">{financialData.currency || ''}</div>
            </div>
            <div className="p-4 bg-white rounded-box border border-brand-200">
              <div className="text-sm text-gray-600 mb-1">Eget kapital</div>
              <div className="text-page-title text-gray-800">
                {formatNumber(financialData.equity, 1000000, 1, 'M')}
              </div>
              <div className="text-xs text-gray-500">{financialData.currency || ''}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-white rounded-box border border-brand-200 text-center">
              <div className="text-xs text-gray-600 mb-1">Vinstmarginal</div>
              <div className="text-section-title text-gray-800">{financialData.profitMargin ?? 'N/A'}%</div>
            </div>
            <div className="p-3 bg-white rounded-box border border-brand-200 text-center">
              <div className="text-xs text-gray-600 mb-1">Soliditet</div>
              <div className="text-section-title text-gray-800">{financialData.equityRatio ?? 'N/A'}%</div>
            </div>
            <div className="p-3 bg-white rounded-box border border-brand-200 text-center">
              <div className="text-xs text-gray-600 mb-1">Avkastning EK</div>
              <div className="text-section-title text-gray-800">{financialData.returnOnEquity ?? 'N/A'}%</div>
            </div>
            <div className="p-3 bg-white rounded-box border border-brand-200 text-center">
              <div className="text-xs text-gray-600 mb-1">Anställda</div>
              <div className="text-section-title text-gray-800">{financialData.numberOfEmployees ?? 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Fastighetsinnehav - DEFENSIV: Använd säker array */}
        {properties.length > 0 && (
          <div className="mb-6 p-6 bg-brand-50 rounded-card border border-brand-200">
            <h2 className="text-subsection-title font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Fastighetsinnehav ({properties.length})
            </h2>
            <div className="space-y-3">
              {properties.map((property, index) => (
                <div key={index} className="p-4 bg-white rounded-box border border-brand-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{property.propertyId || 'N/A'}</div>
                      <div className="text-sm text-brand-700">{property.address || 'N/A'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-brand-600">
                        {formatNumber(property.taxAssessedValue, 1000000, 1, 'M SEK')}
                      </div>
                      <div className="text-xs text-gray-500">Taxeringsvärde</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-brand-700">
                    <span>Ägarandel: {property.ownershipPercent ?? 'N/A'}%</span>
                    <span>Förvärvsdatum: {property.acquisitionDate || 'N/A'}</span>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-brand-100 rounded-box border border-brand-300 text-center">
                <span className="text-gray-700 font-medium">Totalt taxeringsvärde: </span>
                <span className="text-section-title text-brand-700">
                  {formatNumber(propertyData.totalTaxAssessedValue, 1000000, 1, 'M SEK')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Styrelseuppdrag */}
        <div className="mb-6 p-6 bg-white rounded-card border border-brand-100">
          <h2 className="text-subsection-title font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Styrelseuppdrag
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-brand-50 rounded-box border border-brand-200 text-center">
              <div className="text-page-title text-brand-600">{engagementsData.currentEngagements ?? 0}</div>
              <div className="text-sm text-brand-700">Nuvarande uppdrag</div>
            </div>
            <div className="p-4 bg-brand-50 rounded-box border border-brand-200 text-center">
              <div className="text-page-title text-brand-700">{engagementsData.historicalEngagements ?? 0}</div>
              <div className="text-sm text-brand-700">Historiska uppdrag</div>
            </div>
            <div className="p-4 bg-brand-50 rounded-box border border-brand-200 text-center">
              <div className="text-page-title text-gray-800">
                {(engagementsData.currentEngagements ?? 0) + (engagementsData.historicalEngagements ?? 0)}
              </div>
              <div className="text-sm text-brand-700">Totalt</div>
            </div>
          </div>
          {engagements.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm">Aktuella uppdrag:</h3>
              {engagements.filter(e => e.status === 'Active').map((engagement, index) => (
                <div key={index} className="p-3 bg-white rounded-box border border-brand-200 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">{engagement.company_name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{engagement.organizationNumber || 'N/A'}</div>
                  </div>
                  <div className="text-right">
                    <div className="px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-sm font-medium">
                      {engagement.role || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Sedan {engagement.from || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bolagsverket ärenden */}
        <div className="mb-6 p-6 bg-brand-50 rounded-card border border-brand-200">
          <h2 className="text-subsection-title font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Bolagsverket ärendehistorik
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-white rounded-box border border-brand-200 text-center">
              <div className="text-page-title text-brand-600">{caseData.openCases ?? 0}</div>
              <div className="text-sm text-brand-700">Öppna ärenden</div>
            </div>
            <div className="p-4 bg-white rounded-box border border-brand-200 text-center">
              <div className="text-page-title text-brand-700">{caseData.closedCases ?? 0}</div>
              <div className="text-sm text-brand-700">Avslutade ärenden</div>
            </div>
          </div>
          {cases.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm">Senaste ärenden:</h3>
              {cases.map((caseItem, index) => (
                <div key={index} className="p-3 bg-white rounded-box border border-brand-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{caseItem.caseType || 'N/A'}</div>
                      <div className="text-xs text-gray-500">Ärende: {caseItem.caseNumber || 'N/A'}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      caseItem.status === 'Closed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {caseItem.status || 'N/A'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-brand-700">
                    Registrerad: {caseItem.registrationDate || 'N/A'}
                    {caseItem.closedDate && ` • Avslutad: ${caseItem.closedDate}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aktiekapital */}
        <div className="mb-8 p-6 bg-brand-50 rounded-card border border-brand-200">
          <h2 className="text-subsection-title font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Aktiekapital och andelar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="p-4 bg-white rounded-box border border-brand-200 text-center">
              <div className="text-page-title text-brand-600">
                {formatNumber(shareData.shareCapital, 1000, 0, 'k')}
              </div>
              <div className="text-sm text-brand-700">Aktiekapital (SEK)</div>
            </div>
            <div className="p-4 bg-white rounded-box border border-brand-200 text-center">
              <div className="text-page-title text-gray-800">{shareData.numberOfShares?.toLocaleString() ?? 'N/A'}</div>
              <div className="text-sm text-brand-700">Antal aktier</div>
            </div>
            <div className="p-4 bg-white rounded-box border border-brand-200 text-center">
              <div className="text-page-title text-gray-800">{shareData.shareValue ?? 'N/A'}</div>
              <div className="text-sm text-brand-700">Kvotvärde (SEK)</div>
            </div>
            <div className="p-4 bg-white rounded-box border border-brand-200 text-center">
              <div className="text-page-title text-gray-800">{shareClasses.length}</div>
              <div className="text-sm text-brand-700">Aktieklasser</div>
            </div>
          </div>
          {shareClasses.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm">Aktieklasser:</h3>
              {shareClasses.map((shareClass, index) => (
                <div key={index} className="p-3 bg-white rounded-box border border-brand-200 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-800">Klass {shareClass.class || 'N/A'}</span>
                    <span className="text-sm text-gray-600 ml-3">{shareClass.shares?.toLocaleString() ?? 'N/A'} aktier</span>
                  </div>
                  <div className="text-sm text-brand-700">
                    {shareClass.votesPerShare ?? 'N/A'} röst{shareClass.votesPerShare !== 1 ? 'er' : ''} per aktie
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Etableringar - DEFENSIV: Kontrollera att det är en array */}
        {Array.isArray(establishmentsData) && establishmentsData.length > 0 && (
          <div className="mb-8 p-6 bg-gray-50 rounded-card border border-gray-200">
            <h2 className="text-subsection-title font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Etableringar ({establishmentsData.length})
            </h2>
            <div className="space-y-2">
              {establishmentsData.map((establishment, index) => (
                <div key={index} className="p-4 bg-white rounded-box border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{establishment.name || 'N/A'}</div>
                      <div className="text-sm text-brand-700">
                        {establishment.address?.street || 'N/A'}, {establishment.address?.postalCode || ''} {establishment.address?.city || ''}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {establishment.establishmentType || 'N/A'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-brand-700">
                    <span>Anställda: {establishment.numberOfEmployees ?? 'N/A'}</span>
                    <span>Etableringsnr: {establishment.establishmentNumber || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-box hover:bg-gray-300 transition-colors font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-500 text-white rounded-box hover:from-brand-600 hover:to-brand-600 transition-colors font-medium flex items-center"
          >
            Fortsätt onboarding
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
