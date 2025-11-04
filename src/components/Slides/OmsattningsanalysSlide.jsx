import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { mockRevenueData } from '../../data/mockEconomicData';

export default function OmsattningsanalysSlide({ onNext, onBack }) {
  const { yearlyData, summary, analysis } = mockRevenueData;

  // Formatera belopp till SEK med tusentalsavgränsare
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Formatera belopp till MSEK
  const formatMSEK = (amount) => {
    return (amount / 1000000).toFixed(1) + ' MSEK';
  };

  // Färger för staplar (gradient från ljusare till mörkare grön)
  const barColors = ['#8BC34A', '#7CB342', '#689F38', '#558B2F', '#3C8C4A'];

  // Custom tooltip för grafen
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-brand-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{data.year}</p>
          <p className="text-brand-600">
            <strong>Omsättning:</strong> {formatCurrency(data.revenue)}
          </p>
          {data.growth !== null && (
            <p className={`text-sm ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Tillväxt: {data.growth > 0 ? '+' : ''}{data.growth.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-900 mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Omsättningsanalys
          </h1>
          <p className="text-brand-700">
            Från bokföringens resultatrapporter kan vi se hur omsättningen utvecklats över åren.
          </p>
        </div>

        {/* Graf */}
        <div className="mb-8 p-6 bg-brand-50 rounded-xl border border-brand-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Omsättning per räkenskapsår
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="year" 
                stroke="#666"
                style={{ fontSize: '14px', fontWeight: '500' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="revenue" 
                name="Omsättning (SEK)"
                radius={[8, 8, 0, 0]}
              >
                {yearlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sammanfattning och Analys */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sammanfattning */}
          <div className="p-6 bg-white rounded-xl border border-brand-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Nyckeltal
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Omsättning 2024:</span>
                <span className="font-bold text-gray-800">{formatMSEK(summary.currentYearRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Omsättning 2023:</span>
                <span className="font-semibold text-gray-800">{formatMSEK(summary.previousYearRevenue)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">Tillväxt (YoY):</span>
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    +{summary.yoyGrowth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">CAGR (5 år):</span>
                  <span className="font-bold text-brand-600">+{summary.cagr5Years.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total tillväxt:</span>
                  <span className="font-bold text-brand-600">+{summary.totalGrowth5Years.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analys */}
          <div className="p-6 bg-white rounded-xl border border-brand-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analys
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-xl mt-0.5">✅</span>
                <div>
                  <p className="text-sm text-gray-800 font-medium">Stabil tillväxt</p>
                  <p className="text-xs text-gray-600">Konsekvent ökning varje år</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl mt-0.5">✅</span>
                <div>
                  <p className="text-sm text-gray-800 font-medium">Inga ovanliga hopp</p>
                  <p className="text-xs text-gray-600">Naturlig utvecklingskurva</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl mt-0.5">ℹ️</span>
                <div>
                  <p className="text-sm text-gray-800 font-medium">Avtagande tillväxttakt</p>
                  <p className="text-xs text-gray-600">Normalt för mogna företag</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detaljerade noteringar */}
        {analysis.notes && analysis.notes.length > 0 && (
          <div className="mb-8 p-6 bg-brand-50 rounded-xl border border-brand-200">
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
        <div className="mb-8 p-6 bg-brand-50 rounded-xl border-l-4 border-brand-500">
          <h3 className="text-lg font-semibold text-brand-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Rekommendation
          </h3>
          <p className="text-sm text-brand-800">
            Omsättningstillväxten är sund och följer en naturlig kurva. Den höga tillväxttakten i början 
            (2020-2021) har stabiliserats till en mer hållbar nivå. Fortsätt fokusera på tillväxtstrategier 
            som bibehåller denna positiva trend.
          </p>
          <p className="text-xs text-brand-700 mt-3 italic">
            Byråchefen kan ge ytterligare kommentarer kring omsättningsutvecklingen och möjligheter till optimering.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="w-1/3 px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Tillbaka
          </button>
          <button
            onClick={onNext}
            className="w-2/3 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition-all"
          >
            Nästa: Resultatanalys
          </button>
        </div>
      </div>
    </div>
  );
}
