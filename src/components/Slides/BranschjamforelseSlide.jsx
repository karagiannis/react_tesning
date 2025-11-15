import { mockIndustryComparison } from '../../data/mockEconomicData';

export default function BranschjamforelseSlide({ onNext, onBack }) {
  const { sniCode, industryName, metrics, percentilePosition, strengths, improvements } = mockIndustryComparison;

  // Bestäm statusfärg baserat på jämförelse
  const getStatusColor = (companyValue, avgValue, metric) => {
    const diff = ((companyValue - avgValue) / avgValue) * 100;
    
    // För soliditet, likviditet, kassalikviditet: högre = bättre
    if (['soliditet', 'likviditet', 'kassalikviditet'].includes(metric)) {
      if (diff > 10) return 'bg-brand-100 text-brand-800 border-brand-300';
      if (diff < -10) return 'bg-red-100 text-red-800 border-red-300';
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    
    // För marginaler: högre = bättre
    if (['rörelsemarginal', 'nettomarginal'].includes(metric)) {
      if (diff > 5) return 'bg-brand-100 text-brand-800 border-brand-300';
      if (diff < -5) return 'bg-red-100 text-red-800 border-red-300';
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    
    // För omsättning: högre = bättre
    if (metric === 'omsättning') {
      if (diff > 20) return 'bg-brand-100 text-brand-800 border-brand-300';
      if (diff < -20) return 'bg-red-100 text-red-800 border-red-300';
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    
    // För skuldsättningsgrad: lägre = bättre
    if (metric === 'skuldsättningsgrad') {
      if (diff < -20) return 'bg-brand-100 text-brand-800 border-brand-300';
      if (diff > 20) return 'bg-red-100 text-red-800 border-red-300';
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Bestäm ikon baserat på jämförelse
  const getStatusIcon = (companyValue, avgValue, metric) => {
    const diff = ((companyValue - avgValue) / avgValue) * 100;
    
    if (['soliditet', 'likviditet', 'kassalikviditet', 'rörelsemarginal', 'nettomarginal', 'omsättning'].includes(metric)) {
      if (diff > 10 || (metric.includes('marginal') && diff > 5) || (metric === 'omsättning' && diff > 20)) {
        return (
          <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      }
      if (diff < -10 || (metric.includes('marginal') && diff < -5) || (metric === 'omsättning' && diff < -20)) {
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      }
    }
    
    if (metric === 'skuldsättningsgrad') {
      if (diff < -20) {
        return (
          <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      }
      if (diff > 20) {
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      }
    }
    
    return (
      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    );
  };

  // Formatera nyckeltal
  const formatMetricValue = (name, value) => {
    if (name.toLowerCase().includes('marginal')) return `${value.toFixed(1)}%`;
    if (name.toLowerCase().includes('soliditet')) return `${value.toFixed(1)}%`;
    if (name.toLowerCase().includes('likviditet')) return value.toFixed(2);
    if (name.toLowerCase().includes('grad')) return `${value.toFixed(1)}%`;
    if (name.toLowerCase().includes('omsättning')) {
      return `${(value / 1000000).toFixed(1)} MSEK`;
    }
    return value.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full bg-white rounded-card shadow-2xl p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Branschjämförelse
          </h1>
          <p className="text-brand-700">
            Företagets nyckeltal jämfört med branschgenomsnittet för <strong>{industryName}</strong> (SNI {sniCode}).
          </p>
        </div>

        {/* Percentile Position */}
        <div className="mb-8 p-6 bg-brand-50 rounded-card border-l-4 border-brand-500">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-brand-900 mb-1">Övergripande Position</h3>
              <p className="text-sm text-brand-700">Baserat på SCB:s statistik för branschen</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-900">{percentilePosition}:e</div>
              <div className="text-sm text-brand-700">percentilen</div>
            </div>
          </div>
          <div className="bg-white/60 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-600 h-1.5 transition-all duration-500"
              style={{ width: `${percentilePosition}%` }}
            />
          </div>
        </div>

        {/* Jämförelsetabell */}
        <div className="mb-8 overflow-hidden border border-brand-200 rounded-card">
          <table className="w-full">
            <thead className="bg-brand-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nyckeltal</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Företaget</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Branschsnitt</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => {
                const statusColor = getStatusColor(metric.companyValue, metric.industryAverage, metric.name.toLowerCase());
                const statusIcon = getStatusIcon(metric.companyValue, metric.industryAverage, metric.name.toLowerCase());
                
                return (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 hover:bg-brand-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{metric.name}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-brand-600">
                      {formatMetricValue(metric.name, metric.companyValue)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">
                      {formatMetricValue(metric.name, metric.industryAverage)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${statusColor}`}>
                        {statusIcon}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Styrkor och Förbättringsområden */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Styrkor */}
          <div className="p-6 bg-brand-50 rounded-card border border-brand-200">
            <h3 className="text-lg font-semibold text-brand-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Styrkor
            </h3>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="text-sm text-brand-800 flex items-start gap-2">
                  <span className="text-brand-600 mt-1 font-bold">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Förbättringsområden */}
          <div className="p-6 bg-yellow-50 rounded-card border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Förbättringsområden
            </h3>
            <ul className="space-y-2">
              {improvements.map((improvement, index) => (
                <li key={index} className="text-sm text-yellow-800 flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 font-bold">!</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sammanfattning */}
        <div className="mb-8 p-6 bg-brand-50 rounded-card border-l-4 border-brand-500">
          <h3 className="text-lg font-semibold text-brand-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Sammanfattning
          </h3>
          <p className="text-sm text-brand-800 mb-2">
            Företaget presterar <strong>över branschgenomsnittet</strong> på flera viktiga områden, särskilt 
            vad gäller soliditet och likviditet. Detta tyder på en stabil finansiell position med god 
            förmåga att hantera kortfristiga skulder.
          </p>
          <p className="text-sm text-brand-800 mb-2">
            Rörelseresultatet ligger något <strong>under branschsnittet</strong>, vilket kan indikera 
            utrymme för optimering av kostnadsstrukturen eller möjligheter att förbättra prissättningen.
          </p>
          <p className="text-sm text-brand-800">
            Sammantaget visar företaget en <strong>solid profil</strong> med goda förutsättningar för 
            fortsatt tillväxt och utveckling inom branschen.
          </p>
          <p className="text-xs text-brand-700 mt-3 italic">
            Källa: SCB:s företagsstatistik för SNI {sniCode} ({industryName})
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="w-1/3 px-8 py-3 bg-gray-200 text-gray-700 rounded-box hover:bg-gray-300 transition-colors font-semibold"
          >
            Tillbaka
          </button>
          <button
            onClick={onNext}
            className="w-2/3 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-box font-semibold transition-all"
          >
            Nästa: Bokföringsanalys
          </button>
        </div>
      </div>
    </div>
  );
}
