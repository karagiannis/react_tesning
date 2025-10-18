import React from 'react';
import { mockRoaringData } from '../../../data/mockRoaringData';

export default function AgarstrukturSlide({ onNext, onBack }) {
  const ownerData = mockRoaringData.ownerStructure;
  const beneficialOwnerData = mockRoaringData.beneficialOwner;
  
  // Get the primary beneficial owner
  const beneficialOwner = beneficialOwnerData.beneficialOwners && beneficialOwnerData.beneficialOwners[0] 
    ? beneficialOwnerData.beneficialOwners[0] 
    : null;
    
  const alternativeBeneficialOwners = beneficialOwnerData.alternativeBeneficialOwners || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Ägarstruktur
          </h1>
          <p className="text-gray-600">
            Översikt över företagets ägare och verklig huvudman
          </p>
        </div>

        {/* Verklig Huvudman */}
        {beneficialOwner && (
          <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verklig Huvudman
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Namn:</span>
                <span className="text-gray-800 font-semibold text-right">{beneficialOwner.name}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Personnummer:</span>
                <span className="text-gray-800 font-mono text-right">{beneficialOwner.personalNumber}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Ägarandel:</span>
                <span className="text-purple-700 font-bold text-xl text-right">{beneficialOwner.ownershipPercent}%</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Kontrollmekanism:</span>
                <span className="text-gray-800 text-right">{beneficialOwner.controlType}</span>
              </div>
            </div>
          </div>
        )}

        {/* Alla ägare */}
        <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Alla ägare
          </h2>
          <div className="space-y-4">
            {ownerData.owners.map((owner, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{owner.name}</span>
                  <span className="text-2xl font-bold text-blue-600">{owner.ownershipPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${owner.ownershipPercent}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Typ:</span> {owner.type}
                  {owner.personalNumber && (
                    <>
                      {' • '}
                      <span className="font-medium">Personnr:</span> {owner.personalNumber}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold">Totalt:</span>
              <span className="text-3xl font-bold text-blue-700">100%</span>
            </div>
          </div>
        </div>

        {/* Alternativ verklig huvudman */}
        {alternativeBeneficialOwners && alternativeBeneficialOwners.length > 0 && (
          <div className="mb-8 p-6 bg-brand-50 rounded-xl border border-brand-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Alternativ identifikation
            </h2>
            {alternativeBeneficialOwners.map((altOwner, index) => (
              <div key={index} className="mb-3">
                <p className="text-gray-700 text-sm mb-1">
                  <span className="font-semibold">{altOwner.name}</span> ({altOwner.role})
                </p>
                <p className="text-gray-600 text-sm">{altOwner.reason}</p>
              </div>
            ))}
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
            className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-500 text-white rounded-lg hover:from-brand-600 hover:to-brand-600 transition-colors font-medium flex items-center"
          >
            Nästa: Styrelse
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
