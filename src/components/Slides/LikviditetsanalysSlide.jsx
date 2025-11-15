import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockLiquidityData } from '../../data/mockEconomicData';
import BadgeIcon from '../Shared/BadgeIcon';

export default function LikviditetsanalysSlide({ onNext, onBack }) {
  const { monthlyData, summary, aiAnalysis, recommendations } = mockLiquidityData;

  // Formatera belopp till SEK med tusentalsavgränsare
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Custom tooltip för grafen
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-brand-200 rounded-box shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.month}</p>
          <p className="text-brand-600">
            <strong>Saldo:</strong> {formatCurrency(payload[0].value)}
          </p>
          <p className="text-green-600 text-sm">
            Insättningar: {formatCurrency(payload[0].payload.deposits)}
          </p>
          <p className="text-red-600 text-sm">
            Uttag: {formatCurrency(payload[0].payload.withdrawals)}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Likviditetsanalys
          </h1>
          <p className="text-brand-700">
            Baserat på bankkontots transaktionshistorik kan vi ge en översikt av företagets likviditetsutveckling.
          </p>
        </div>

        {/* Graf */}
        <div className="mb-8 p-6 bg-brand-50 rounded-card border border-brand-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Likviditet över tid (12 månader)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3C8C4A" 
                strokeWidth={3}
                name="Saldo (SEK)"
                dot={{ fill: '#3C8C4A', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sammanfattning och AI-analys */}
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
                <span className="text-brand-700">Nuvarande likviditet:</span>
                <span className="font-bold text-brand-900">{formatCurrency(summary.currentBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-700">Genomsnitt (12 mån):</span>
                <span className="font-semibold text-brand-900">{formatCurrency(summary.averageBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-700">Högsta saldo:</span>
                <span className="font-semibold text-brand-800">{formatCurrency(summary.highestBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-700">Lägsta saldo:</span>
                <span className="font-semibold text-brand-800">{formatCurrency(summary.lowestBalance)}</span>
              </div>
              <div className="pt-3 border-t border-brand-200">
                <div className="flex justify-between items-center">
                  <span className="text-brand-700 font-medium">Trend:</span>
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    {summary.trend} (+{summary.trendPercentage}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI-analys */}
          <div className="p-6 bg-brand-50 rounded-card border border-brand-200">
            <h3 className="text-lg font-semibold text-brand-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI-analys
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <BadgeIcon icon="check" variant="success" shape="square" size="md" />
                <div>
                  <p className="text-sm text-brand-800 font-medium">Inga layering-mönster</p>
                  <p className="text-xs text-brand-600">Transaktionerna följer normala mönster</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BadgeIcon icon="check" variant="success" shape="square" size="md" />
                <div>
                  <p className="text-sm text-brand-800 font-medium">Normala transaktionsstorlekar</p>
                  <p className="text-xs text-brand-600">Inga tecken på strukturering</p>
                </div>
              </div>
              {aiAnalysis.unusualTransactions && aiAnalysis.unusualTransactions.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">
                      {aiAnalysis.unusualTransactions.length} ovanligt {aiAnalysis.unusualTransactions.length === 1 ? 'stor insättning' : 'stora insättningar'}
                    </p>
                    <p className="text-xs text-gray-600">Bör verifieras mot fakturor/kontrakt</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ovanliga transaktioner (om det finns några) */}
        {aiAnalysis.unusualTransactions && aiAnalysis.unusualTransactions.length > 0 && (
          <div className="mb-8 p-6 bg-yellow-50 rounded-card border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Flaggade transaktioner
            </h3>
            <div className="space-y-2">
              {aiAnalysis.unusualTransactions.map((transaction, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-box border border-yellow-200">
                  <div>
                    <p className="font-medium text-gray-800">{transaction.description}</p>
                    <p className="text-sm text-gray-600">Datum: {transaction.date}</p>
                  </div>
                  <span className="font-bold text-yellow-700">{formatCurrency(transaction.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rekommendationer */}
        <div className="mb-8 p-6 bg-brand-50 rounded-card border-l-4 border-brand-500">
          <h3 className="text-lg font-semibold text-brand-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Rekommendation
          </h3>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <p key={index} className="text-sm text-brand-800">• {rec}</p>
            ))}
          </div>
          <p className="text-xs text-brand-700 mt-3 italic">
            Byråchefen kan ge ytterligare kommentarer kring likviditetsutvecklingen och föreslå åtgärder vid behov.
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
            Nästa: Omsättningsanalys
          </button>
        </div>
      </div>
    </div>
  );
}
