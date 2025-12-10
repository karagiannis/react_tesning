import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BokforingsanalysSlide({ onNext, onBack }) {
  const navigate = useNavigate();
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Mock-data för verifikationer (baserat på SIE-format)
  // Visar endast flaggade poster (errors och warnings)
  const vouchers = [
    {
      id: "A1",
      date: "2024-01-15",
      description: "Ovanligt hög konsultkostnad",
      amount: 850000,
      status: "error",
      flagReason: "Belopp överstiger normalintervall med 340%",
      created_by: "System Import",
      createdDate: "2024-01-15",
      rows: [
        { account: "4000", accountName: "Konsultkostnader", debit: 850000, credit: 0 },
        { account: "2440", accountName: "Leverantörsskulder", debit: 0, credit: 850000 }
      ]
    },
    {
      id: "A2",
      date: "2024-03-22",
      description: "Kontantuttag utan kvitto",
      amount: 45000,
      status: "warning",
      flagReason: "Kontanthantering utan verifikation",
      created_by: "Fredrik Andersson",
      createdDate: "2024-03-22",
      rows: [
        { account: "6570", accountName: "Diverse kostnader", debit: 45000, credit: 0 },
        { account: "1910", accountName: "Kassa", debit: 0, credit: 45000 }
      ]
    },
    {
      id: "A5",
      date: "2024-09-20",
      description: "Reseersättning kontant",
      amount: 8500,
      status: "warning",
      flagReason: "Kontantutlägg utan original kvitto",
      created_by: "Fredrik Andersson",
      createdDate: "2024-09-20",
      rows: [
        { account: "5410", accountName: "Reseersättningar", debit: 8500, credit: 0 },
        { account: "1910", accountName: "Kassa", debit: 0, credit: 8500 }
      ]
    },
    {
      id: "A6",
      date: "2024-10-12",
      description: "Konsulttjänster från Cypern",
      amount: 320000,
      status: "error",
      flagReason: "Utlandsbetalning till skatteparadis utan F-skatt",
      created_by: "System Import",
      createdDate: "2024-10-12",
      rows: [
        { account: "4000", accountName: "Konsultkostnader", debit: 320000, credit: 0 },
        { account: "2440", accountName: "Leverantörsskulder", debit: 0, credit: 320000 }
      ]
    }
  ];

  // Formatera belopp
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Status-ikon och färg
  const getStatusIcon = (status) => {
    switch (status) {
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'error':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      default:
        return 'bg-white hover:bg-brand-50';
    }
  };

  // Öppna modal
  const openModal = (voucher) => {
    setSelectedVoucher(voucher);
  };

  // Stäng modal
  const closeModal = () => {
    setSelectedVoucher(null);
  };

  // Beräkna totaler för modal
  const getTotals = (rows) => {
    return rows.reduce((acc, row) => ({
      debit: acc.debit + row.debit,
      credit: acc.credit + row.credit
    }), { debit: 0, credit: 0 });
  };

  // Sammanfattning
  const summary = {
    total: 4, // Endast flaggade poster visas
    errors: vouchers.filter(v => v.status === 'error').length,
    warnings: vouchers.filter(v => v.status === 'warning').length,
    ok: 25732 // Realistiskt antal godkända poster från AI-granskning
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-7xl w-full bg-white rounded-card shadow-2xl p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Bokföringsanalys
          </h1>
          <p className="text-brand-700">
            AI-baserad granskning av verifikationer från SIE-filen. Flaggade poster kräver verifiering.
          </p>
        </div>

        {/* Sammanfattning */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-gray-50 rounded-box border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">{summary.total}</div>
            <div className="text-xs text-gray-600">Flaggade poster</div>
          </div>
          <div className="p-3 bg-red-50 rounded-box border border-red-200">
            <div className="text-2xl font-bold text-red-800">{summary.errors}</div>
            <div className="text-xs text-red-600">Allvarliga avvikelser</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-box border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-800">{summary.warnings}</div>
            <div className="text-xs text-yellow-600">Varningar</div>
          </div>
          <div className="p-3 bg-brand-50 rounded-box border border-brand-200">
            <div className="text-2xl font-bold text-brand-800">{summary.ok.toLocaleString('sv-SE')}</div>
            <div className="text-xs text-brand-600">Godkända</div>
          </div>
        </div>

        {/* Verifikationstabell */}
        <div className="mb-8 overflow-hidden border border-brand-200 rounded-card">
          <table className="w-full">
            <thead className="bg-brand-100">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-semibold text-brand-900 uppercase tracking-wider w-12">
                  Status
                </th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-brand-900 uppercase tracking-wider w-20">
                  Ver.nr
                </th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-brand-900 uppercase tracking-wider w-28">
                  Datum
                </th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-brand-900 uppercase tracking-wider">
                  Beskrivning
                </th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-brand-900 uppercase tracking-wider w-32">
                  Belopp
                </th>
                <th className="py-2 px-3 text-center text-xs font-semibold text-brand-900 uppercase tracking-wider w-20">
                  Skapad
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vouchers.map((voucher) => (
                <tr 
                  key={voucher.id}
                  onClick={() => openModal(voucher)}
                  className={`
                    ${getStatusColor(voucher.status)}
                    transition-all cursor-pointer hover:shadow-md
                  `}
                >
                  <td className="py-2 px-3">
                    {getStatusIcon(voucher.status)}
                  </td>
                  <td className="py-2 px-3 text-sm font-semibold text-gray-800">
                    {voucher.id}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-700">
                    {voucher.date}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-800">
                    {voucher.description}
                  </td>
                  <td className="py-2 px-3 text-sm text-right font-semibold text-gray-800">
                    {formatAmount(voucher.amount)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal för verifikationsdetaljer */}
        {selectedVoucher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
            <div className="bg-white rounded-card shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-page-title text-gray-900">
                    Verifikation {selectedVoucher.id}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Bokföringsdatum: {selectedVoucher.date}
                  </p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Status och beskrivning */}
                <div className={`p-4 rounded-box mb-6 ${
                  selectedVoucher.status === 'error' ? 'bg-red-50 border border-red-200' :
                  selectedVoucher.status === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(selectedVoucher.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {selectedVoucher.description}
                      </h3>
                      {selectedVoucher.flagReason && (
                        <p className={`text-sm ${
                          selectedVoucher.status === 'error' ? 'text-red-700' : 'text-yellow-700'
                        }`}>
                          {selectedVoucher.flagReason}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-2">
                        Skapad: {selectedVoucher.createdDate} av {selectedVoucher.created_by}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Konteringsrader */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Konteringsrader</h3>
                <div className="border border-gray-200 rounded-box overflow-hidden mb-4">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Konto</th>
                        <th className="py-2 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Kontonamn</th>
                        <th className="py-2 px-4 text-right text-xs font-semibold text-gray-700 uppercase">Debet</th>
                        <th className="py-2 px-4 text-right text-xs font-semibold text-gray-700 uppercase">Kredit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedVoucher.rows.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-2 px-4 text-sm font-mono text-gray-800">{row.account}</td>
                          <td className="py-2 px-4 text-sm text-gray-700">{row.accountName}</td>
                          <td className="py-2 px-4 text-sm text-right font-semibold text-gray-800">
                            {row.debit > 0 ? formatAmount(row.debit) : '-'}
                          </td>
                          <td className="py-2 px-4 text-sm text-right font-semibold text-gray-800">
                            {row.credit > 0 ? formatAmount(row.credit) : '-'}
                          </td>
                        </tr>
                      ))}
                      {/* Totaler */}
                      <tr className="bg-brand-50 font-bold">
                        <td colSpan="2" className="py-2 px-4 text-sm text-gray-900">Totalt:</td>
                        <td className="py-2 px-4 text-sm text-right text-gray-900">
                          {formatAmount(getTotals(selectedVoucher.rows).debit)}
                        </td>
                        <td className="py-2 px-4 text-sm text-right text-gray-900">
                          {formatAmount(getTotals(selectedVoucher.rows).credit)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Kommentarer */}
                {selectedVoucher.status !== 'ok' && (
                  <div className="bg-brand-50 border border-brand-200 rounded-box p-4">
                    <h4 className="font-semibold text-brand-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Åtgärdsförslag
                    </h4>
                    <p className="text-sm text-brand-800">
                      {selectedVoucher.status === 'error' 
                        ? 'Kontakta kunden för kompletterande dokumentation. Denna verifikation kräver godkännande från byråchef innan fortsatt hantering.'
                        : 'Begär in originalkvitto eller annan verifikation för att säkerställa bokföringens riktighet.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-box hover:bg-gray-300 transition-colors font-semibold"
                >
                  Stäng
                </button>
                {selectedVoucher.status !== 'ok' && (
                  <button
                    onClick={() => alert('Markera för granskning-funktionen är inte implementerad än')}
                    className="px-6 py-2 bg-brand-600 text-white rounded-box hover:bg-brand-700 transition-colors font-semibold"
                  >
                    Markera för granskning
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rekommendation */}
        <div className="mb-8 p-6 bg-red-50 rounded-card border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Kritiska avvikelser identifierade
          </h3>
          <p className="text-sm text-red-800 mb-2">
            AI-analysen har identifierat <strong>{summary.errors} allvarliga avvikelser</strong> och <strong>{summary.warnings} varningar</strong> i bokföringen.
            Dessa poster kräver verifiering innan företaget kan godkännas som kund.
          </p>
          <p className="text-sm text-red-800">
            Klicka på en rad för att se fullständig verifikation och åtgärdsförslag.
          </p>
        </div>

        {/* Navigation */}
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
            Nästa: Riskbedömning
          </button>
        </div>
      </div>
    </div>
  );
}
