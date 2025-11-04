import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAttachmentsForVoucher } from '../data/mockVoucherAttachments';

/**
 * Verifikationsvy i separat fönster
 * URL: /voucher/:voucherId
 * 
 * Öppnas via window.open() från huvudapplikationen
 */
function VoucherDetailPage() {
  const { voucherId } = useParams();
  const navigate = useNavigate();
  const [attachmentPanelOpen, setAttachmentPanelOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  
  // Mock voucher data (i produktion: hämta från API)
  const voucherData = getMockVoucherData(voucherId);
  const attachments = getAttachmentsForVoucher(voucherId);
  
  if (!voucherData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Verifikation hittades inte</h1>
          <p className="text-gray-600 mb-4">Verifikation {voucherId} kunde inte laddas.</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            Stäng fönster
          </button>
        </div>
      </div>
    );
  }
  
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const getTotals = (rows) => {
    return rows.reduce((acc, row) => ({
      debit: acc.debit + row.debit,
      credit: acc.credit + row.credit
    }), { debit: 0, credit: 0 });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Verifikation {voucherId}</h1>
              <p className="text-gray-100 text-sm mt-1">
                {voucherData.date} • {voucherData.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAttachmentPanelOpen(!attachmentPanelOpen)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  attachmentPanelOpen
                    ? 'bg-white text-brand-600'
                    : 'bg-brand-700 hover:bg-brand-800 text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Underlag ({attachments.length})
              </button>
              <button
                onClick={() => window.close()}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-medium"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Vänster: Bokföringspost */}
          <div className={`transition-all ${attachmentPanelOpen ? 'w-1/2' : 'w-full'}`}>
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Varning om flaggad post */}
              {voucherData.status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold text-red-900 text-sm">Allvarlig avvikelse</div>
                      <div className="text-sm text-red-800 mt-1">{voucherData.flagReason}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Metadata */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Räkenskapsår:</span>
                    <span className="ml-2 font-semibold">{voucherData.fiscalYear}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Belopp:</span>
                    <span className="ml-2 font-semibold">{formatAmount(voucherData.amount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Skapad:</span>
                    <span className="ml-2">{voucherData.createdDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Skapad av:</span>
                    <span className="ml-2">{voucherData.createdBy}</span>
                  </div>
                </div>
              </div>
              
              {/* Bokföringstabell */}
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Konto</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Benämning</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Debet</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Kredit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {voucherData.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-sm">{row.account}</td>
                      <td className="px-4 py-2 text-sm">{row.accountName}</td>
                      <td className="px-4 py-2 text-sm text-right font-semibold">
                        {row.debit > 0 ? formatAmount(row.debit) : ''}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold">
                        {row.credit > 0 ? formatAmount(row.credit) : ''}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-4 py-2 text-sm" colSpan={2}>Summa</td>
                    <td className="px-4 py-2 text-sm text-right">
                      {formatAmount(getTotals(voucherData.rows).debit)}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {formatAmount(getTotals(voucherData.rows).credit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Höger: Underlagspanel (expanderbar) */}
          {attachmentPanelOpen && (
            <div className="w-1/2 bg-white rounded-lg shadow-lg p-6 animate-slide-in">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>Bifogade underlag ({attachments.length})</span>
                <button
                  onClick={() => setAttachmentPanelOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </h2>
              
              {/* Attachment grid */}
              <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      attachment.flagged ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-brand-400'
                    }`}
                    onClick={() => setSelectedAttachment(attachment)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Thumbnail */}
                      <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        {attachment.type === 'application/pdf' ? (
                          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">
                          {attachment.filename}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {(attachment.size / 1024).toFixed(1)} KB • {attachment.uploadDate}
                        </div>
                        <div className="mt-2 text-xs">
                          <div className="text-gray-700">
                            <strong>OCR:</strong> {formatAmount(attachment.ocrAmount)}
                          </div>
                          {attachment.ocrSupplier && (
                            <div className="text-gray-600">
                              {attachment.ocrSupplier}
                            </div>
                          )}
                          {attachment.matchConfidence && (
                            <div className="mt-1">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                attachment.matchConfidence > 0.9 ? 'bg-green-100 text-green-700' :
                                attachment.matchConfidence > 0.7 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                Match: {(attachment.matchConfidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                        {attachment.flagged && (
                          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-800">
                            <strong>Flaggad:</strong> {attachment.flagReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Drag & Drop yta */}
              <div className="mt-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-brand-400 hover:bg-gray-50 transition-all cursor-pointer">
                <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-600 mb-2">Dra och släpp filer här</p>
                <button className="px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700">
                  Välj fil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Mock data helper (senare ersätts med API-anrop)
 */
function getMockVoucherData(voucherId) {
  const vouchers = {
    A1: {
      id: "A1",
      date: "2024-01-15",
      fiscalYear: "2023-2024",
      description: "Ovanligt hög konsultkostnad",
      amount: 850000,
      status: "error",
      flagReason: "Belopp överstiger normalintervall med 340%",
      createdBy: "System Import",
      createdDate: "2024-01-15",
      rows: [
        { account: "4000", accountName: "Konsultkostnader", debit: 850000, credit: 0 },
        { account: "2440", accountName: "Leverantörsskulder", debit: 0, credit: 850000 }
      ]
    },
    A2: {
      id: "A2",
      date: "2024-03-22",
      fiscalYear: "2023-2024",
      description: "Kontantuttag utan kvitto",
      amount: 45000,
      status: "warning",
      flagReason: "Kontanthantering utan verifikation",
      createdBy: "Fredrik Andersson",
      createdDate: "2024-03-22",
      rows: [
        { account: "6570", accountName: "Diverse kostnader", debit: 45000, credit: 0 },
        { account: "1910", accountName: "Kassa", debit: 0, credit: 45000 }
      ]
    },
    A308: {
      id: "A308",
      date: "2025-03-15",
      fiscalYear: "2024-2025",
      description: "Varor och material Q1 (AGGREGERAD)",
      amount: 59780,
      status: "error",
      flagReason: "2 motorcykeldäck (10 090 SEK) i aggregerad post med 49 dokument",
      createdBy: "System Import",
      createdDate: "2025-03-15",
      rows: [
        { account: "5410", accountName: "Varor och material", debit: 47823, credit: 0 },
        { account: "2640", accountName: "Ingående moms", debit: 11957, credit: 0 },
        { account: "1930", accountName: "Företagskonto", debit: 0, credit: 59780 }
      ]
    },
    B156: {
      id: "B156",
      date: "2024-11-20",
      fiscalYear: "2024-2025",
      description: "Samlingsfaktura Q4",
      amount: 125400,
      status: "warning",
      flagReason: "23 affärshändelser i samma verifikation",
      createdBy: "System Import",
      createdDate: "2024-11-20",
      rows: [
        { account: "5410", accountName: "Varor och material", debit: 100320, credit: 0 },
        { account: "2640", accountName: "Ingående moms", debit: 25080, credit: 0 },
        { account: "2440", accountName: "Leverantörsskulder", debit: 0, credit: 125400 }
      ]
    }
  };
  
  return vouchers[voucherId];
}

export default VoucherDetailPage;
