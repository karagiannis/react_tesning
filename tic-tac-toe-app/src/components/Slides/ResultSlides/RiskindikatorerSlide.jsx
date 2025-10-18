import React from 'react';
import { mockRoaringData } from '../../../data/mockRoaringData';

export default function RiskindikatorerSlide({ onNext, onBack }) {
  const riskData = mockRoaringData.riskIndicators;
  const ratingData = mockRoaringData.companyRating;
  const sanctionsData = mockRoaringData.sanctionsList;
  const pepData = mockRoaringData.politicallyExposedPerson;
  const amlData = mockRoaringData.amlRegistry;
  const legalData = mockRoaringData.legalInformation;
  const prohibitionData = mockRoaringData.businessProhibition;

  // Helper function för risk-färger
  const getRiskColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'green': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
      case 'yellow': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
      case 'red': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
    }
  };

  const getRiskLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'low':
      case 'låg':
        return 'text-green-600';
      case 'medium':
      case 'medel':
        return 'text-yellow-600';
      case 'high':
      case 'hög':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Riskindikatorer & Compliance
          </h1>
          <p className="text-gray-600">
            Sammanställning av riskbedömning, kreditvärdighet och efterlevnadskontroller
          </p>
        </div>

        {/* Övergripande riskbedömning */}
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Övergripande Riskbedömning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <div className="text-5xl font-bold text-blue-600 mb-2">{riskData.overallRiskScore}</div>
              <div className="text-sm text-gray-600">Riskpoäng (av 100)</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <div className={`text-3xl font-bold mb-2 ${getRiskLevelColor(riskData.riskLevel)}`}>
                {riskData.riskLevel}
              </div>
              <div className="text-sm text-gray-600">Risknivå</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <div className="text-5xl mb-2">
                {riskData.overallRiskScore < 30 ? '🟢' : riskData.overallRiskScore < 60 ? '🟡' : '🔴'}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>
        </div>

        {/* Detaljerade riskindikatorer */}
        <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Riskindelning per kategori</h2>
          <div className="space-y-3">
            {riskData.indicators.map((indicator, index) => {
              const colors = getRiskColor(indicator.status);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center flex-1">
                    <span className={`w-3 h-3 rounded-full mr-3 ${
                      indicator.status === 'Green' ? 'bg-green-500' :
                      indicator.status === 'Yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                    <span className="font-medium text-gray-800">{indicator.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-700">{indicator.score}</span>
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {indicator.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {riskData.alerts && riskData.alerts.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Notiser
              </h3>
              {riskData.alerts.map((alert, index) => (
                <div key={index} className="text-sm text-yellow-700 ml-7">
                  • {alert.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kreditbetyg */}
        <div className="mb-6 p-6 bg-green-50 rounded-xl border border-green-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kreditvärdighet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">{ratingData.creditRating}</div>
              <div className="text-sm text-gray-600">Kreditbetyg</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-gray-700 mb-2">{ratingData.creditScore}</div>
              <div className="text-sm text-gray-600">Kreditpoäng</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-gray-700 mb-2">{ratingData.paymentRemarks}</div>
              <div className="text-sm text-gray-600">Betalningsanmärkningar</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-gray-700 mb-2">{(ratingData.creditLimit / 1000).toFixed(0)}k SEK</div>
              <div className="text-sm text-gray-600">Kreditlimit</div>
            </div>
          </div>
        </div>

        {/* Compliance-kontroller */}
        <div className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Efterlevnadskontroller
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sanktionslistor */}
            <div className={`p-4 rounded-lg border-2 ${
              sanctionsData.euSanctions.found || sanctionsData.unSanctions.found || 
              sanctionsData.ofacSanctions.found || sanctionsData.ukSanctions.found
                ? 'bg-red-50 border-red-300'
                : 'bg-white border-green-300'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {sanctionsData.euSanctions.found || sanctionsData.unSanctions.found || 
                   sanctionsData.ofacSanctions.found || sanctionsData.ukSanctions.found ? '⛔' : '✅'}
                </div>
                <div className="font-semibold text-gray-800">Sanktionslistor</div>
                <div className="text-sm text-gray-600 mt-1">{sanctionsData.status.text}</div>
              </div>
            </div>

            {/* PEP */}
            <div className={`p-4 rounded-lg border-2 ${
              pepData.isPEP ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-green-300'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-2">{pepData.isPEP ? '⚠️' : '✅'}</div>
                <div className="font-semibold text-gray-800">PEP-kontroll</div>
                <div className="text-sm text-gray-600 mt-1">
                  {pepData.isPEP ? 'PEP identifierad' : 'Ingen PEP-koppling'}
                </div>
              </div>
            </div>

            {/* AML Register */}
            <div className={`p-4 rounded-lg border-2 ${
              amlData.found ? 'bg-red-50 border-red-300' : 'bg-white border-green-300'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-2">{amlData.found ? '🚨' : '✅'}</div>
                <div className="font-semibold text-gray-800">Penningtvättsregister</div>
                <div className="text-sm text-gray-600 mt-1">{amlData.status.text}</div>
              </div>
            </div>

            {/* Näringsförbud */}
            <div className={`p-4 rounded-lg border-2 ${
              prohibitionData.records.length > 0 ? 'bg-red-50 border-red-300' : 'bg-white border-green-300'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-2">{prohibitionData.records.length > 0 ? '🚫' : '✅'}</div>
                <div className="font-semibold text-gray-800">Näringsförbud</div>
                <div className="text-sm text-gray-600 mt-1">{prohibitionData.status.text}</div>
              </div>
            </div>
          </div>

          {/* Rättsliga ärenden */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">Rättsliga ärenden:</span>
              <span className={`font-bold text-lg ${
                legalData.courtCases.length > 0 || legalData.bankruptcies > 0
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}>
                {legalData.status}
              </span>
            </div>
            {(legalData.courtCases.length > 0 || legalData.bankruptcies > 0) && (
              <div className="mt-2 text-sm text-gray-600">
                <div>Rättegångar: {legalData.courtCases.length}</div>
                <div>Konkurser: {legalData.bankruptcies}</div>
              </div>
            )}
          </div>
        </div>

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
            Nästa: Övriga datapunkter
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
