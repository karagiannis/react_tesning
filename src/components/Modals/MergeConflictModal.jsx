/**
 * MergeConflictModal.jsx
 * 
 * Modal som visas när det finns en konflikt mellan lokal och server-data
 * (Optimistic locking - "pull before push")
 * 
 * Designad som VS Code git merge conflict view
 */

import React from 'react';

// Hjälpfunktion för att formatera tjänstenamn
const SERVICE_LABELS = {
  'lopande_bokforing': 'Löpande bokföring',
  'arsbokslut': 'Årsbokslut',
  'deklarationer': 'Deklarationer',
  'loneadministration': 'Löneadministration',
  'ekonomisk_radgivning': 'Ekonomisk rådgivning',
  'foretagsregistrering': 'Företagsregistrering',
  'finansiell_rapportering': 'Finansiell rapportering',
  'foretagsforsaljning': 'Företagsförsäljning/succession',
};

const formatServiceName = (key) => SERVICE_LABELS[key] || key;

const formatServices = (services) => {
  if (!services || !Array.isArray(services) || services.length === 0) {
    return ['(Inga tjänster valda)'];
  }
  return services.map(formatServiceName);
};

export default function MergeConflictModal({ 
  data, 
  onKeepTheirs, 
  onKeepMine, 
  onMerge, 
  onClose 
}) {
  if (!data) return null;

  const serverServices = formatServices(data.server_services);
  const localServices = formatServices(data.localData?.selected_services);
  
  // Hitta skillnader
  const serverSet = new Set(data.server_services || []);
  const localSet = new Set(data.localData?.selected_services || []);
  
  const onlyOnServer = [...serverSet].filter(s => !localSet.has(s));
  const onlyLocal = [...localSet].filter(s => !serverSet.has(s));
  const inBoth = [...serverSet].filter(s => localSet.has(s));
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-brand-200">
        {/* Header - Brand colors */}
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
                Ärendet har ändrats av en annan användare
              </p>
            </div>
          </div>
        </div>
        
        {/* Git-style conflict explanation */}
        <div className="bg-brand-50 border-b border-brand-100 px-6 py-3">
          <p className="text-sm text-brand-800">
            <span className="font-mono bg-brand-100 px-1.5 py-0.5 rounded text-xs mr-2">KONFLIKT</span>
            Dina ändringar kan inte sparas automatiskt eftersom serverdatan har uppdaterats.
            Välj vilken version som ska behållas.
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Meta info */}
          <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Ändrad av: <strong className="text-gray-900">{data.modified_by?.slice(0, 8) || 'Okänd'}...</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Version: <strong className="font-mono text-gray-900">v{data.server_version}</strong></span>
            </div>
          </div>
          
          {/* VS Code style diff view */}
          <div className="border border-gray-200 rounded-lg overflow-hidden font-mono text-sm">
            {/* Diff header */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
              <span className="text-gray-600 text-xs">uppdragsval / selected_services</span>
              <span className="text-xs text-gray-500">
                {onlyOnServer.length + onlyLocal.length} ändringar
              </span>
            </div>
            
            {/* Conflict markers - like git */}
            <div className="divide-y divide-gray-100">
              {/* Server version (THEIRS) */}
              <div className="bg-blue-50/50">
                <div className="bg-blue-100 px-4 py-1.5 text-xs text-blue-700 flex items-center gap-2 border-l-4 border-blue-500">
                  <span className="font-bold">{'<<<<<<< SERVER (DERAS)'}</span>
                  <span className="text-blue-500">v{data.server_version}</span>
                </div>
                <div className="px-4 py-3 space-y-1">
                  {serverServices.map((service, i) => {
                    const key = data.server_services?.[i];
                    const isOnlyOnServer = key && onlyOnServer.includes(key);
                    return (
                      <div key={i} className={`flex items-center gap-2 ${isOnlyOnServer ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
                        {isOnlyOnServer && <span className="text-blue-500 text-xs">+</span>}
                        <span>{service}</span>
                        {isOnlyOnServer && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">endast server</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Separator */}
              <div className="bg-gray-200 px-4 py-1 text-xs text-gray-500 text-center font-bold">
                {'======='}
              </div>
              
              {/* Local version (MINE) */}
              <div className="bg-green-50/50">
                <div className="px-4 py-3 space-y-1">
                  {localServices.map((service, i) => {
                    const key = data.localData?.selected_services?.[i];
                    const isOnlyLocal = key && onlyLocal.includes(key);
                    return (
                      <div key={i} className={`flex items-center gap-2 ${isOnlyLocal ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                        {isOnlyLocal && <span className="text-green-500 text-xs">+</span>}
                        <span>{service}</span>
                        {isOnlyLocal && <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">din ändring</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="bg-green-100 px-4 py-1.5 text-xs text-green-700 flex items-center gap-2 border-l-4 border-green-500">
                  <span className="font-bold">{'>>>>>>> LOKAL (DIN)'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Summary */}
          {(onlyOnServer.length > 0 || onlyLocal.length > 0) && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-medium text-amber-800 mb-2">Sammanfattning av skillnader:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                {onlyOnServer.length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">●</span>
                    <span><strong>Server har:</strong> {onlyOnServer.map(formatServiceName).join(', ')}</span>
                  </li>
                )}
                {onlyLocal.length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">●</span>
                    <span><strong>Du har lagt till:</strong> {onlyLocal.map(formatServiceName).join(', ')}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        {/* Actions */}
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
