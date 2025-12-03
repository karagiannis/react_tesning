/**
 * MergeConflictModal.jsx
 * 
 * Modal som visas när det finns en konflikt mellan lokal och server-data
 * (Optimistic locking - "pull before push")
 */

import React from 'react';

export default function MergeConflictModal({ 
  data, 
  onKeepTheirs, 
  onKeepMine, 
  onMerge, 
  onClose 
}) {
  if (!data) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h2 className="text-lg font-semibold text-yellow-800">
                Konflikt upptäckt
              </h2>
              <p className="text-sm text-yellow-600">
                Någon annan har ändrat detta ärende medan du arbetade
              </p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Meta info */}
          <div className="mb-6 text-sm text-gray-600">
            <p>Ändrad av: <strong>{data.updatedBy || 'Okänd'}</strong></p>
            <p>Tid: <strong>{data.updatedAt ? new Date(data.updatedAt).toLocaleString('sv-SE') : 'Okänd'}</strong></p>
          </div>
          
          {/* Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Server version */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-medium text-blue-800 mb-2">Deras version (server)</h3>
              <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(data.serverData, null, 2)}
              </pre>
            </div>
            
            {/* Local version */}
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="font-medium text-green-800 mb-2">Din version (lokal)</h3>
              <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(data.localData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Avbryt
            </button>
            <button
              onClick={onKeepTheirs}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Behåll deras
            </button>
            <button
              onClick={onKeepMine}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
            >
              Behåll min
            </button>
            <button
              onClick={onMerge}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
            >
              Slå ihop manuellt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
