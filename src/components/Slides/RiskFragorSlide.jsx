/**
 * RiskFragorSlide.jsx (Steg 1)
 * 
 * 🎯 TIC-TAC-TOE PATTERN - DUM KOMPONENT
 * 
 * Denna komponent:
 * - Tar emot ALL data via props
 * - Har INGEN egen state (förutom UI-state som hover)
 * - Gör INGA API-anrop
 * - Läser INTE från localStorage
 * - Anropar bara callbacks (onNext, onFieldChange)
 * 
 * All logik finns i AuthenticatedApp.jsx
 */

import React from 'react';
import StepIndicator from '../Shared/StepIndicator';

/**
 * @param {Object} props
 * @param {Object} props.formData - Formulärdata { affarsIde, kundTyper, ... }
 * @param {Object} props.companyInfo - Företagsinfo { name, orgnr }
 * @param {Function} props.onFieldChange - (field, value) => void
 * @param {Function} props.onNext - () => void - Anropas vid klick på Nästa
 * @param {boolean} props.isValid - Om formuläret är giltigt
 * @param {boolean} props.isLoading - Om data sparas
 * @param {boolean} props.isLocked - Om slide är låst (t.ex. under Stripe redirect)
 * @param {string} props.error - Felmeddelande att visa
 * @param {string} props.syncStatus - 'idle' | 'saving' | 'saved' | 'conflict'
 */
export default function RiskFragorSlide({
  formData = {},
  companyInfo = {},
  onFieldChange,
  onNext,
  isValid = false,
  isLoading = false,
  isLocked = false,
  error = null,
  syncStatus = 'idle'
}) {
  // Merge med formData, säkerställ att kundTyper alltid finns
  const data = {
    affarsIde: '',
    utlandskaPartners: '',
    storaLeverantorer: '',
    verksamhetAndrad: '',
    personnummer: '',
    isPEP: false,
    ...formData,
    // kundTyper måste alltid ha alla fält
    kundTyper: {
      privatpersoner: false,
      foretag: false,
      offentligSektor: false,
      ...(formData?.kundTyper || {})
    }
  };

  // Helper för att uppdatera kundTyper
  const handleCheckboxChange = (field, checked) => {
    onFieldChange('kundTyper', {
      ...data.kundTyper,
      [field]: checked
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-brand-900 mb-4">
          Frågor som stödjer riskbedömning
        </h1>
        
        {/* Sync Status Indicator */}
        {syncStatus === 'saving' && (
          <div className="mb-4 p-3 bg-brand-50 border border-brand-200 rounded-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-brand-700">Sparar...</p>
          </div>
        )}
        
        {syncStatus === 'conflict' && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <span className="text-amber-600">⚠️</span>
            <p className="text-sm text-amber-700">Data har uppdaterats från servern</p>
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        {/* Step Indicator */}
        <StepIndicator currentStep={1} completedSteps={0} />
        
        {/* Company Info Display */}
        {companyInfo.name && (
          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Företag:</span> {companyInfo.name}
              {companyInfo.orgnr && <span className="ml-2 text-gray-400">({companyInfo.orgnr})</span>}
            </p>
          </div>
        )}
        
        <p className="text-sm text-brand-700 mb-6">
          Flera av dessa frågor har lagstöd och hjälper oss att bedöma risken:
        </p>

        <div className="space-y-4">
          {/* Q1: Affärsidé */}
          <div>
            <label className="block text-sm font-semibold text-brand-800 mb-2">
              Vad är företagets huvudsakliga affärsidé? *
            </label>
            <textarea
              value={data.affarsIde}
              onChange={(e) => onFieldChange('affarsIde', e.target.value)}
              disabled={isLocked}
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={3}
              placeholder="Beskriv kort företagets verksamhet (minst 10 tecken)..."
            />
          </div>

          {/* Q2: Kundtyper */}
          <div>
            <label className="block text-sm font-semibold text-brand-800 mb-2">
              Vilka typer av kunder har företaget?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.kundTyper.privatpersoner}
                  onChange={(e) => handleCheckboxChange('privatpersoner', e.target.checked)}
                  disabled={isLocked}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500 disabled:cursor-not-allowed"
                />
                <span className="text-brand-800">Privatpersoner</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.kundTyper.foretag}
                  onChange={(e) => handleCheckboxChange('foretag', e.target.checked)}
                  disabled={isLocked}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500 disabled:cursor-not-allowed"
                />
                <span className="text-brand-800">Företag</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.kundTyper.offentligSektor}
                  onChange={(e) => handleCheckboxChange('offentligSektor', e.target.checked)}
                  disabled={isLocked}
                  className="w-4 h-4 text-brand-600 border-brand-300 rounded focus:ring-brand-500 disabled:cursor-not-allowed"
                />
                <span className="text-brand-800">Offentlig sektor</span>
              </label>
            </div>
          </div>

          {/* Q3: Utländska partners */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              Har företaget återkommande utländska affärspartners?
            </label>
            <textarea
              value={data.utlandskaPartners}
              onChange={(e) => onFieldChange('utlandskaPartners', e.target.value)}
              disabled={isLocked}
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={2}
              placeholder="Beskriv vilka länder och typ av samarbete..."
            />
          </div>

          {/* Q4: Största leverantörer */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              Vilka är de största leverantörerna, och var är de etablerade?
            </label>
            <textarea
              value={data.storaLeverantorer}
              onChange={(e) => onFieldChange('storaLeverantorer', e.target.value)}
              disabled={isLocked}
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={2}
              placeholder="Lista de viktigaste leverantörerna..."
            />
          </div>

          {/* Q5: Verksamhetsändring */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              Har verksamheten ändrats på senare tid?
            </label>
            <textarea
              value={data.verksamhetAndrad}
              onChange={(e) => onFieldChange('verksamhetAndrad', e.target.value)}
              disabled={isLocked}
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={2}
              placeholder="Beskriv eventuella förändringar..."
            />
          </div>

          {/* Q6: Personnummer */}
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-2">
              Personnummer *
            </label>
            <input
              type="text"
              value={data.personnummer}
              onChange={(e) => onFieldChange('personnummer', e.target.value)}
              disabled={isLocked}
              className="w-full px-4 py-2 border border-brand-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="YYYYMMDD-XXXX"
            />
            <p className="text-xs text-brand-600 mt-1">
              Personnumret används för att hämta officiell information från Bolagsverket eller Roaring.io.
            </p>
          </div>

          {/* Q7: PEP-fråga */}
          <div className="bg-brand-50 border-l-4 border-brand-500 p-4 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.isPEP}
                onChange={(e) => onFieldChange('isPEP', e.target.checked)}
                disabled={isLocked}
                className="mt-1 w-5 h-5 text-brand-600 border-brand-300 rounded focus:ring-brand-500 disabled:cursor-not-allowed"
              />
              <div>
                <span className="block text-sm font-semibold text-brand-900">
                  Är du eller någon i företaget en PEP (person i politiskt utsatt ställning)?
                </span>
                <span className="text-xs text-brand-700">
                  Detta inkluderar personer som innehar eller har innehaft höga offentliga ämbeten.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onNext}
          disabled={!isValid || isLoading || isLocked}
          className={`w-full mt-8 px-4 py-3 rounded-lg font-semibold transition-all ${
            isValid && !isLoading && !isLocked
              ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sparar...
            </span>
          ) : (
            'Nästa'
          )}
        </button>
      </div>
      
      {/* 
        OBS: Ingen AgreementModal här!
        
        Modalen renderas av AuthenticatedApp och styrs via:
        - showAgreementModal state
        - handleSelectEngångsavtal callback
        
        Denna slide vet inte ens att modalen existerar.
      */}
    </div>
  );
}
