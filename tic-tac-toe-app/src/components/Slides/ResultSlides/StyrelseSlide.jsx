import React from 'react';
import { mockRoaringData } from '../../../data/mockRoaringData';

export default function StyrelseSlide({ onNext, onBack }) {
  const boardData = mockRoaringData.boardMembers;
  const signatoryData = mockRoaringData.signatories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Styrelse & Firmatecknare
          </h1>
          <p className="text-gray-600">
            Översikt över bolagets ledning och firmatecknare
          </p>
        </div>

        {/* VD */}
        {boardData.ceo && (
          <div className="mb-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Verkställande Direktör (VD)
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Namn:</span>
                <span className="text-gray-800 font-semibold text-right">{boardData.ceo.name}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Personnummer:</span>
                <span className="text-gray-800 font-mono text-right">{boardData.ceo.personalNumber}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Tillträde:</span>
                <span className="text-gray-800 text-right">{boardData.ceo.appointedDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Styrelse */}
        <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Styrelseledamöter
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-blue-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Namn</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Roll</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tillträde</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {boardData.board.map((member, index) => (
                  <tr key={index} className="border-b border-blue-100 hover:bg-blue-50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-gray-800">{member.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{member.personalNumber}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        member.role === 'Styrelseordförande' 
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{member.appointedDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        member.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revisor */}
        {boardData.auditor && (
          <div className="mb-6 p-6 bg-green-50 rounded-xl border border-green-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Revisor
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Namn:</span>
                <span className="text-gray-800 font-semibold text-right">{boardData.auditor.name}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Organisationsnummer:</span>
                <span className="text-gray-800 font-mono text-right">{boardData.auditor.organizationNumber}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Typ:</span>
                <span className="text-gray-800 text-right">{boardData.auditor.auditorType}</span>
              </div>
            </div>
          </div>
        )}

        {/* Firmatecknare */}
        <div className="mb-8 p-6 bg-amber-50 rounded-xl border border-amber-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Firmatecknare
          </h2>
          <div className="mb-4 p-4 bg-white rounded-lg border border-amber-200">
            <div className="flex items-center">
              <span className="text-gray-600 font-medium mr-2">Firmateckningsregler:</span>
              <span className="text-amber-800 font-bold text-lg">{signatoryData.signingRules}</span>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            {signatoryData.authorizedSignatories.map((signatory, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border border-amber-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800">{signatory.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{signatory.personalNumber}</div>
                  </div>
                  <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-sm font-medium">
                    {signatory.signingRight}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-amber-200">
            <h3 className="font-semibold text-gray-800 mb-2">Giltiga kombinationer:</h3>
            <ul className="space-y-2">
              {signatoryData.signingCombinations.map((combination, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {combination}
                </li>
              ))}
            </ul>
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
            Nästa: Riskindikatorer
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
