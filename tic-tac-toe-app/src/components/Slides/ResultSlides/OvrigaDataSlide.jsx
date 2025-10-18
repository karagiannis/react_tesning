import React from 'react';
import { mockRoaringData } from '../../../data/mockRoaringData';

export default function OvrigaDataSlide({ onNext, onBack }) {
  const propertyData = mockRoaringData.propertyInformation;
  const engagementsData = mockRoaringData.companyEngagements;
  const caseData = mockRoaringData.companyCaseRegister;
  const financialData = mockRoaringData.financialInformation;
  const establishmentsData = mockRoaringData.establishments;
  const shareData = mockRoaringData.shareFacts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Övriga datapunkter
          </h1>
          <p className="text-gray-600">
            Kompletterande information om fastigheter, uppdrag, ärenden och finansiella data
          </p>
        </div>

        {/* Ekonomisk översikt */}
        <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ekonomisk information ({financialData.latestYear})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Omsättning</div>
              <div className="text-2xl font-bold text-gray-800">
                {(financialData.revenue / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500">{financialData.currency}</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Rörelseresultat</div>
              <div className="text-2xl font-bold text-green-600">
                {(financialData.operatingProfit / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-gray-500">{financialData.currency}</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Resultat efter skatt</div>
              <div className="text-2xl font-bold text-green-600">
                {(financialData.profitAfterTax / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-gray-500">{financialData.currency}</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Eget kapital</div>
              <div className="text-2xl font-bold text-gray-800">
                {(financialData.equity / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500">{financialData.currency}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-white rounded-lg border border-green-200 text-center">
              <div className="text-xs text-gray-600 mb-1">Vinstmarginal</div>
              <div className="text-xl font-bold text-gray-800">{financialData.profitMargin}%</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-green-200 text-center">
              <div className="text-xs text-gray-600 mb-1">Soliditet</div>
              <div className="text-xl font-bold text-gray-800">{financialData.equityRatio}%</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-green-200 text-center">
              <div className="text-xs text-gray-600 mb-1">Avkastning EK</div>
              <div className="text-xl font-bold text-gray-800">{financialData.returnOnEquity}%</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-green-200 text-center">
              <div className="text-xs text-gray-600 mb-1">Anställda</div>
              <div className="text-xl font-bold text-gray-800">{financialData.numberOfEmployees}</div>
            </div>
          </div>
        </div>

        {/* Fastighetsinnehav */}
        {propertyData.properties.length > 0 && (
          <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Fastighetsinnehav ({propertyData.properties.length})
            </h2>
            <div className="space-y-3">
              {propertyData.properties.map((property, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{property.propertyId}</div>
                      <div className="text-sm text-gray-600">{property.address}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        {(property.taxAssessedValue / 1000000).toFixed(1)}M SEK
                      </div>
                      <div className="text-xs text-gray-500">Taxeringsvärde</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Ägarandel: {property.ownershipPercent}%</span>
                    <span>Förvärvsdatum: {property.acquisitionDate}</span>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-blue-100 rounded-lg border border-blue-300 text-center">
                <span className="text-gray-700 font-medium">Totalt taxeringsvärde: </span>
                <span className="text-xl font-bold text-blue-700">
                  {(propertyData.totalTaxAssessedValue / 1000000).toFixed(1)}M SEK
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Styrelseuppdrag */}
        <div className="mb-6 p-6 bg-purple-50 rounded-xl border border-purple-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Styrelseuppdrag
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-white rounded-lg border border-purple-200 text-center">
              <div className="text-3xl font-bold text-purple-600">{engagementsData.currentEngagements}</div>
              <div className="text-sm text-gray-600">Nuvarande uppdrag</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-200 text-center">
              <div className="text-3xl font-bold text-gray-600">{engagementsData.historicalEngagements}</div>
              <div className="text-sm text-gray-600">Historiska uppdrag</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-200 text-center">
              <div className="text-3xl font-bold text-gray-800">
                {engagementsData.currentEngagements + engagementsData.historicalEngagements}
              </div>
              <div className="text-sm text-gray-600">Totalt</div>
            </div>
          </div>
          {engagementsData.engagements.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm">Aktuella uppdrag:</h3>
              {engagementsData.engagements.filter(e => e.status === 'Active').map((engagement, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-purple-200 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">{engagement.companyName}</div>
                    <div className="text-xs text-gray-500">{engagement.organizationNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {engagement.role}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Sedan {engagement.from}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bolagsverket ärenden */}
        <div className="mb-6 p-6 bg-amber-50 rounded-xl border border-amber-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Bolagsverket ärendehistorik
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-white rounded-lg border border-amber-200 text-center">
              <div className="text-3xl font-bold text-amber-600">{caseData.openCases}</div>
              <div className="text-sm text-gray-600">Öppna ärenden</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-amber-200 text-center">
              <div className="text-3xl font-bold text-gray-600">{caseData.closedCases}</div>
              <div className="text-sm text-gray-600">Avslutade ärenden</div>
            </div>
          </div>
          {caseData.cases.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm">Senaste ärenden:</h3>
              {caseData.cases.map((caseItem, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-amber-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{caseItem.caseType}</div>
                      <div className="text-xs text-gray-500">Ärende: {caseItem.caseNumber}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      caseItem.status === 'Closed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {caseItem.status}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Registrerad: {caseItem.registrationDate}
                    {caseItem.closedDate && ` • Avslutad: ${caseItem.closedDate}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aktiekapital */}
        <div className="mb-8 p-6 bg-indigo-50 rounded-xl border border-indigo-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Aktiekapital och andelar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="p-4 bg-white rounded-lg border border-indigo-200 text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {(shareData.shareCapital / 1000).toFixed(0)}k
              </div>
              <div className="text-sm text-gray-600">Aktiekapital (SEK)</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-indigo-200 text-center">
              <div className="text-2xl font-bold text-gray-800">{shareData.numberOfShares.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Antal aktier</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-indigo-200 text-center">
              <div className="text-2xl font-bold text-gray-800">{shareData.shareValue}</div>
              <div className="text-sm text-gray-600">Kvotvärde (SEK)</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-indigo-200 text-center">
              <div className="text-2xl font-bold text-gray-800">{shareData.shareClasses.length}</div>
              <div className="text-sm text-gray-600">Aktieklasser</div>
            </div>
          </div>
          {shareData.shareClasses.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm">Aktieklasser:</h3>
              {shareData.shareClasses.map((shareClass, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-indigo-200 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-800">Klass {shareClass.class}</span>
                    <span className="text-sm text-gray-600 ml-3">{shareClass.shares.toLocaleString()} aktier</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {shareClass.votesPerShare} röst{shareClass.votesPerShare !== 1 ? 'er' : ''} per aktie
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Etableringar */}
        {establishmentsData.length > 0 && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Etableringar ({establishmentsData.length})
            </h2>
            <div className="space-y-2">
              {establishmentsData.map((establishment, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{establishment.name}</div>
                      <div className="text-sm text-gray-600">
                        {establishment.address.street}, {establishment.address.postalCode} {establishment.address.city}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {establishment.establishmentType}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Anställda: {establishment.numberOfEmployees}</span>
                    <span>Etableringsnr: {establishment.establishmentNumber}</span>
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
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tillbaka
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors font-medium flex items-center"
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
