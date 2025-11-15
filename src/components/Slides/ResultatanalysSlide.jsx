import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockProfitData } from '../../data/mockEconomicData';
import BadgeIcon from '../Shared/BadgeIcon';

export default function ResultatanalysSlide({ onNext, onBack }) {
  const { yearlyData, summary, analysis } = mockProfitData;

  // Formatera belopp till SEK med tusentalsavgränsare
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Formatera belopp till KSEK
  const formatKSEK = (amount) => {
    return (amount / 1000).toFixed(0) + ' KSEK';
  };

  // Custom tooltip för grafen
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-brand-200 rounded-box shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{data.year}</p>
          <p className="text-brand-600">
            <strong>Resultat:</strong> {formatCurrency(data.result)}
          </p>
          <p className="text-sm text-gray-600">
            Omsättning: {formatCurrency(data.revenue)}
          </p>
          <p className="text-sm text-gray-600">
            Rörelsemarginal: {data.operatingMargin.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full bg-white rounded-card shadow-2xl p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Resultatanalys
          </h1>
          <p className="text-brand-700">
            Från balansrapporterna kan vi se lönsamhetsutvecklingen över tid.
          </p>
        </div>

        {/* Graf */}
        <div className="mb-8 p-6 bg-brand-50 rounded-card border border-brand-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Årets resultat per räkenskapsår
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={yearlyData}>
              <defs>
                <linearGradient id="colorResult" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3C8C4A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3C8C4A" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="year" 
                stroke="#666"
                style={{ fontSize: '14px', fontWeight: '500' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="result" 
                stroke="#3C8C4A" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorResult)"
                name="Resultat (SEK)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sammanfattning och Analys */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sammanfattning */}
          <div className="p-6 bg-brand-50 rounded-card border border-brand-200">
            <h3 className="text-lg font-semibold text-brand-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Nyckeltal
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-brand-700">Resultat 2024:</span>
                <span className="font-bold text-brand-900">{formatKSEK(summary.currentYearProfit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-700">Resultat 2023:</span>
                <span className="font-semibold text-brand-900">{formatKSEK(summary.previousYearProfit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-700">Rörelsemarginal:</span>
                <span className="font-semibold text-brand-900">{summary.operatingMargin.toFixed(1)}%</span>
              </div>
              <div className="pt-3 border-t border-brand-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-brand-700 font-medium">Tillväxt (YoY):</span>
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    +{summary.yoyGrowth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Trend:</span>
                  <span className="font-bold text-green-600">{summary.trend}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analys */}
          <div className="p-6 bg-brand-50 rounded-card border border-brand-200">
            <h3 className="text-lg font-semibold text-brand-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lönsamhet
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <BadgeIcon icon="check" variant="success" shape="square" size="md" />
                <div>
                  <p className="text-sm text-brand-800 font-medium">Positiva resultat alla år</p>
                  <p className="text-xs text-brand-600">Konsekvent lönsamhet</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BadgeIcon icon="info" variant="brand" shape="square" size="md" />
                <div>
                  <p className="text-sm text-brand-800 font-medium">Lägre 2022</p>
                  <p className="text-xs text-brand-600">Troligen högre kostnader eller investeringar</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BadgeIcon icon="check" variant="success" shape="square" size="md" />
                <div>
                  <p className="text-sm text-brand-800 font-medium">Stark återhämtning 2023-2024</p>
                  <p className="text-xs text-brand-600">Förbättrade marginaler</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marginalutveckling */}
        <div className="mb-8 p-6 bg-brand-50 rounded-card border border-brand-200">
          <h3 className="text-lg font-semibold text-brand-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Marginalutveckling
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">År</th>
                  <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Omsättning</th>
                  <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Resultat</th>
                  <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Rörelsemarginal</th>
                  <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Nettomarginal</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.map((data, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-brand-50 transition-colors">
                    <td className="py-2 px-3 text-sm font-medium text-gray-800">{data.year}</td>
                    <td className="py-2 px-3 text-sm text-right text-gray-700">{formatCurrency(data.revenue)}</td>
                    <td className="py-2 px-3 text-sm text-right font-semibold text-gray-800">{formatCurrency(data.result)}</td>
                    <td className="py-2 px-3 text-sm text-right text-brand-600">{data.operatingMargin.toFixed(1)}%</td>
                    <td className="py-2 px-3 text-sm text-right text-brand-600">{data.netMargin.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detaljerade noteringar */}
        {analysis.notes && analysis.notes.length > 0 && (
          <div className="mb-8 p-6 bg-brand-50 rounded-card border border-brand-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Observationer
            </h3>
            <ul className="space-y-2">
              {analysis.notes.map((note, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-brand-600 mt-1">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rekommendation */}
        <div className="mb-8 p-6 bg-brand-50 rounded-card border-l-4 border-brand-500">
          <h3 className="text-lg font-semibold text-brand-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Rekommendation
          </h3>
          <p className="text-sm text-brand-800 mb-2">
            Företaget är lönsamt och visar god utveckling. Den tillfälliga nedgången 2022 har följts av 
            en stark återhämtning med förbättrade marginaler 2023-2024.
          </p>
          <p className="text-sm text-brand-800">
            Överväg att optimera kostnadsstrukturen ytterligare för att bibehålla den positiva trenden 
            i rörelsemarginalen.
          </p>
          <p className="text-xs text-brand-700 mt-3 italic">
            Byråchefen kan ge ytterligare kommentarer kring lönsamhetsutvecklingen och kostnadsoptimering.
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
            Nästa: Branschjämförelse
          </button>
        </div>
      </div>
    </div>
  );
}
