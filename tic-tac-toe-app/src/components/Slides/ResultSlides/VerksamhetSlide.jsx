import React from 'react';
import { mockRoaringData } from '../../../data/mockRoaringData';

export default function VerksamhetSlide({ onNext, onBack, hideNavigation = false }) {
  const data = mockRoaringData.companyActivity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Verksamhetsbeskrivning
          </h1>
          <p className="text-gray-600">
            Information om företagets verksamhet och branschklassificering
          </p>
        </div>

        {/* Företagsinformation */}
        <div className="mb-6 p-6 bg-gradient-to-r from-brand-50 to-brand-50 rounded-xl border border-brand-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Företagsinformation
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Företagsnamn:</span>
              <span className="text-gray-800 font-semibold text-right">{data.companyName}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Organisationsnummer:</span>
              <span className="text-gray-800 font-mono text-right">{data.organizationNumber}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Registreringsdatum:</span>
              <span className="text-gray-800 text-right">{data.registrationDate}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Status:</span>
              <span className="text-green-600 font-semibold text-right">{data.status}</span>
            </div>
          </div>
        </div>

        {/* Verksamhetsbeskrivning */}
        <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Verksamhet
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* SNI-klassificering */}
        <div className="mb-8 p-6 bg-green-50 rounded-xl border border-green-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            SNI-klassificering
          </h2>
          <div className="space-y-4">
            {data.sniCodes && data.sniCodes.map((sni, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">SNI-kod:</span>
                  <span className="text-gray-800 font-mono text-lg font-bold">{sni.code}</span>
                </div>
                <p className="text-gray-700">{sni.description}</p>
              </div>
            ))}
            {data.secondaryNames && data.secondaryNames.length > 0 && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <span className="text-gray-600 font-medium block mb-2">Alternativa namn:</span>
                <div className="flex flex-wrap gap-2">Identitetskontroll – sammanfattande tabell
                  {data.secondaryNames.map((name, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation - only show if not in tab container */}
        {!hideNavigation && (
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 mb-20">
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
              className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-500 text-white rounded-lg hover:from-brand-600 hover:to-brand-600 transition-colors font-medium flex items-center"
            >
              Nästa: Ägarstruktur
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
