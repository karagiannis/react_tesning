import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

/**
 * LegalTextExpansion - Expanderbar lagtext-komponent
 * 
 * Visar lagtext i en alert-box med expansion-knapp
 * Används i riskfrågor-wizarden för att visa juridisk grund
 * 
 * @param {Array} legalTexts - Array med lagtext-objekt från legalTexts.js
 * @param {string} explanation - Förklarande text ("Varför frågar vi detta?")
 */
export default function LegalTextExpansion({ legalTexts = [], explanation = '' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!legalTexts || legalTexts.length === 0) return null;

  return (
    <div className="mt-3 border border-brand-300 bg-brand-50 rounded-lg overflow-hidden">
      {/* Expansion knapp - SMALARE */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-brand-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-700" />
          <span className="text-xs font-medium text-brand-900">
            Varför frågar vi detta? (Lagtext)
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-brand-700" />
        ) : (
          <ChevronDown className="w-4 h-4 text-brand-700" />
        )}
      </button>

      {/* Expanderat innehåll */}
      {isExpanded && (
        <div className="px-4 py-3 border-t border-brand-200 bg-white">
          {/* Förklaring */}
          {explanation && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-brand-900 mb-1">
                Varför frågar vi detta?
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                {explanation}
              </p>
            </div>
          )}

          {/* Lagtexter */}
          <div className="space-y-3">
            {legalTexts.map((legalText, index) => (
              <div key={index} className="border-l-2 border-brand-400 pl-3">
                <p className="text-xs font-bold text-gray-900 mb-1">
                  {legalText.law}
                  {legalText.title && ` - ${legalText.title}`}
                </p>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {legalText.fullText}
                </p>
                {legalText.url && (
                  <a
                    href={legalText.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-600 hover:text-brand-700 underline mt-1 inline-block"
                  >
                    Läs mer på riksdagen.se →
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Referens-ID för PDF */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <span className="font-semibold">Referenser:</span>{' '}
              {legalTexts.map(t => t.id).join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
