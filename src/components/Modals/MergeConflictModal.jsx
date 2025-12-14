/**
 * MergeConflictModal.jsx
 * 
 * 🎯 TIC-TAC-TOE PATTERN: DUM KOMPONENT
 * 
 * Denna modal gör INGEN logik - den renderar bara props och 
 * informerar parent om klick via callbacks.
 * 
 * VALUE PROPS (från parent via data):
 *   - slideDisplayName: string (färdigöversatt slide-namn)
 *   - serverVersion: number
 *   - modifiedByDisplay: string (färdigformaterat)
 *   - diffs: array (färdigberäknad med formaterade värden)
 *   - diffCount: number
 *   - message: string (valfritt meddelande)
 * 
 * EVENT CALLBACKS (informerar parent):
 *   - onKeepTheirs: () => void
 *   - onKeepMine: () => void  
 *   - onClose: () => void
 */

import React from 'react';

export default function MergeConflictModal({ 
  data, 
  onKeepTheirs, 
  onKeepMine, 
  onMerge, 
  onClose 
}) {
  // ═══════════════════════════════════════════════════════════════════════
  // GUARD: Ingen data = ingen modal
  // ═══════════════════════════════════════════════════════════════════════
  if (!data) return null;

  // ═══════════════════════════════════════════════════════════════════════
  // DESTRUKTURERA FÄRDIGBERÄKNADE PROPS (ingen logik här!)
  // ═══════════════════════════════════════════════════════════════════════
  const {
    slideDisplayName = 'Okänd sida',
    serverVersion = 0,
    modifiedByDisplay = 'Okänd',
    fullComparison = [],  // ALLA fält (som Git)
    sameFields = [],      // Fält som är lika
    differentFields = [], // Fält som skiljer (gamla "diffs")
    diffs = [],           // Bakåtkompatibilitet
    diffCount = 0,
  } = data;

  // Använd fullComparison om den finns, annars fallback till diffs
  const allFields = fullComparison.length > 0 ? fullComparison : diffs;
  const hasDifferences = differentFields.length > 0 || diffCount > 0;

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER - Bara JSX, ingen logik!
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-brand-200">
        
        {/* ─────────────────────────────────────────────────────────────────
            HEADER
        ───────────────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Merge-konflikt upptäckt
              </h2>
              <p className="text-sm text-brand-100">
                Sidan <strong>{slideDisplayName}</strong> har ändrats av en annan användare
              </p>
            </div>
          </div>
        </div>
        
        {/* ─────────────────────────────────────────────────────────────────
            CONFLICT EXPLANATION
        ───────────────────────────────────────────────────────────────── */}
        <div className="bg-brand-50 border-b border-brand-100 px-6 py-3">
          <p className="text-sm text-brand-800">
            <span className="font-mono bg-brand-100 px-1.5 py-0.5 rounded text-xs mr-2">KONFLIKT</span>
            Dina ändringar kan inte sparas automatiskt eftersom serverdatan har uppdaterats.
            Välj vilken version som ska behållas.
          </p>
        </div>
        
        {/* ─────────────────────────────────────────────────────────────────
            CONTENT
        ───────────────────────────────────────────────────────────────── */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          
          {/* Meta info */}
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Ändrad av: <strong className="text-gray-900">{modifiedByDisplay}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Server-version: <strong className="font-mono text-gray-900">v{serverVersion}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Sida: <strong className="text-gray-900">{slideDisplayName}</strong></span>
            </div>
          </div>
          
          {/* ─────────────────────────────────────────────────────────────
              FULL COMPARISON TABLE (som Git - visar ALLA fält)
          ───────────────────────────────────────────────────────────── */}
          {allFields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Inga fält att jämföra</p>
              <p className="text-xs mt-1">(Sidan har ingen data)</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Table header */}
              <div className="bg-gray-100 border-b border-gray-200 grid grid-cols-3 text-xs font-medium text-gray-600">
                <div className="px-4 py-2 border-r border-gray-200">Fält</div>
                <div className="px-4 py-2 border-r border-gray-200 bg-blue-50 text-blue-700">
                  <span className="flex items-center gap-1">
                    <span>↓</span> Server (deras)
                  </span>
                </div>
                <div className="px-4 py-2 bg-green-50 text-green-700">
                  <span className="flex items-center gap-1">
                    <span>↑</span> Lokal (din)
                  </span>
                </div>
              </div>
              
              {/* Alla rader - SKILLNADER FÖRST, sedan lika */}
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {/* Skillnader markerade */}
                {allFields
                  .filter(f => f.isDifferent)
                  .map((field, index) => (
                  <div key={`diff-${index}`} className="grid grid-cols-3 text-sm bg-amber-50/50">
                    {/* Path - markerad som skillnad */}
                    <div className="px-4 py-3 border-r border-gray-200 bg-amber-100/50">
                      <span className="font-mono text-xs text-amber-800 break-all flex items-center gap-1">
                        <span className="text-amber-600">≠</span>
                        {field.formattedPath}
                      </span>
                    </div>
                    
                    {/* Server value */}
                    <div className="px-4 py-3 border-r border-gray-200 bg-blue-50/50">
                      <pre className="whitespace-pre-wrap font-mono text-xs text-blue-800 break-all">
                        {field.formattedServerValue || '(tom)'}
                      </pre>
                    </div>
                    
                    {/* Local value */}
                    <div className="px-4 py-3 bg-green-50/50">
                      <pre className="whitespace-pre-wrap font-mono text-xs text-green-800 break-all">
                        {field.formattedLocalValue || '(tom)'}
                      </pre>
                    </div>
                  </div>
                ))}
                
                {/* Separator mellan skillnader och lika */}
                {allFields.filter(f => f.isDifferent).length > 0 && 
                 allFields.filter(f => !f.isDifferent).length > 0 && (
                  <div className="bg-gray-200 px-4 py-1 text-xs text-gray-500 text-center">
                    ── Lika värden ──
                  </div>
                )}
                
                {/* Lika värden (svagare styling) */}
                {allFields
                  .filter(f => !f.isDifferent)
                  .map((field, index) => (
                  <div key={`same-${index}`} className="grid grid-cols-3 text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {/* Path */}
                    <div className="px-4 py-2 border-r border-gray-200 bg-gray-50">
                      <span className="font-mono text-xs text-gray-500 break-all flex items-center gap-1">
                        <span className="text-green-500">✓</span>
                        {field.formattedPath}
                      </span>
                    </div>
                    
                    {/* Server value */}
                    <div className="px-4 py-2 border-r border-gray-200">
                      <pre className="whitespace-pre-wrap font-mono text-xs text-gray-500 break-all">
                        {field.formattedServerValue || '(tom)'}
                      </pre>
                    </div>
                    
                    {/* Local value */}
                    <div className="px-4 py-2">
                      <pre className="whitespace-pre-wrap font-mono text-xs text-gray-500 break-all">
                        {field.formattedLocalValue || '(tom)'}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Diff summary */}
          <div className={`mt-4 p-3 border rounded-lg ${
            hasDifferences 
              ? 'bg-amber-50 border-amber-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <h4 className={`text-sm font-medium mb-1 ${
              hasDifferences ? 'text-amber-800' : 'text-green-800'
            }`}>
              {hasDifferences 
                ? `${differentFields.length || diffCount} ${(differentFields.length || diffCount) === 1 ? 'skillnad' : 'skillnader'} hittades`
                : 'Alla värden är identiska'
              }
            </h4>
            <p className={`text-xs ${hasDifferences ? 'text-amber-700' : 'text-green-700'}`}>
              {hasDifferences
                ? 'Välj "Hämta server-version" för att använda den andra användarens ändringar, eller "Skriv över med min" för att behålla dina ändringar.'
                : 'Data är identisk. Versionskonflikt beror förmodligen på metadata.'
              }
            </p>
          </div>
        </div>
        
        {/* ─────────────────────────────────────────────────────────────────
            ACTIONS - Callbacks till parent
        ───────────────────────────────────────────────────────────────── */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              Avbryt
            </button>
            <div className="flex gap-3">
              <button
                onClick={onKeepTheirs}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Hämta server-version
              </button>
              <button
                onClick={onKeepMine}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Skriv över med min
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
