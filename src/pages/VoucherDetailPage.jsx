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
  
  // Mock voucher data (i produktion: hämta från API)
  const voucherData = getMockVoucherData(voucherId);
  const attachments = getAttachmentsForVoucher(voucherId);
  
  // Auto-open attachment panel if attachments exist, with navigation
  const [attachmentPanelOpen, setAttachmentPanelOpen] = useState(attachments.length > 0);
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0);
  
  const currentAttachment = attachments[currentAttachmentIndex];
  
  const goToPreviousAttachment = () => {
    if (currentAttachmentIndex > 0) {
      setCurrentAttachmentIndex(currentAttachmentIndex - 1);
    }
  };
  
  const goToNextAttachment = () => {
    if (currentAttachmentIndex < attachments.length - 1) {
      setCurrentAttachmentIndex(currentAttachmentIndex + 1);
    }
  };
  
  if (!voucherData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-page-title text-red-600 mb-2">Verifikation hittades inte</h1>
          <p className="text-gray-600 mb-4">Verifikation {voucherId} kunde inte laddas.</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-brand-600 text-white rounded-box hover:bg-brand-700"
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
      {/* Header - Kompakt version */}
      <div className="bg-brand-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-section-title">Verifikation {voucherId}</h1>
              <p className="text-gray-100 text-xs mt-0.5">
                {voucherData.date} • {voucherData.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAttachmentPanelOpen(!attachmentPanelOpen)}
                className={`px-3 py-1.5 rounded-box text-sm font-medium transition-all flex items-center gap-2 ${
                  attachmentPanelOpen
                    ? 'bg-white text-brand-600'
                    : 'bg-brand-700 hover:bg-brand-800 text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Underlag ({attachments.length})
              </button>
              <button
                onClick={() => window.close()}
                className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-box text-sm font-medium"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content - Mer utrymme tack vare kompaktare header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 h-[calc(100vh-100px)]">
          {/* Vänster: Bokföringspost + Underlagsinformation */}
          <div className={`transition-all flex flex-col gap-6 overflow-y-auto ${attachmentPanelOpen ? 'w-1/2' : 'w-full'}`}>
            {/* Bokföringspost */}
            <div className="bg-white rounded-box shadow-lg p-6">
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
              <table className="w-full border border-gray-200 rounded-box overflow-hidden">
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
            
            {/* Underlagsinformation - Visas under bokföringsposten */}
            {attachmentPanelOpen && currentAttachment && (
              <div className="bg-white rounded-box shadow-lg p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">Aktuellt underlag</h3>
                <div className="space-y-4">
                  {/* File icon and name */}
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                    <div className="w-12 h-14 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 break-words">
                        {currentAttachment.displayName || currentAttachment.filename}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {(currentAttachment.size / 1024).toFixed(1)} KB • {currentAttachment.uploadDate}
                      </div>
                    </div>
                  </div>
                  
                  {/* OCR data */}
                  {currentAttachment.ocrAmount && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">OCR-Data</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Belopp:</span>
                          <span className="font-semibold text-gray-900">
                            {formatAmount(currentAttachment.ocrAmount)}
                          </span>
                        </div>
                        {currentAttachment.ocrSupplier && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Leverantör:</span>
                            <span className="text-gray-900">{currentAttachment.ocrSupplier}</span>
                          </div>
                        )}
                        {currentAttachment.ocrInvoiceNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fakturanr:</span>
                            <span className="text-gray-900">{currentAttachment.ocrInvoiceNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Match confidence */}
                  {currentAttachment.matchConfidence && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Matchning</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              currentAttachment.matchConfidence > 0.9 ? 'bg-green-500' :
                              currentAttachment.matchConfidence > 0.7 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${currentAttachment.matchConfidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                          {(currentAttachment.matchConfidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Flagged warning */}
                  {currentAttachment.flagged && (
                    <div className="bg-red-50 border border-red-300 rounded-box p-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-red-800 uppercase">Flaggad</div>
                          <div className="text-sm text-red-700 mt-1">{currentAttachment.flagReason}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Höger: Underlagspanel (always visible if attachments exist) */}
          {attachmentPanelOpen && attachments.length > 0 && (
            <div className="w-1/2 bg-white rounded-box shadow-lg flex flex-col animate-slide-in">
              {/* Kompakt header - en rad med navigation */}
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={goToPreviousAttachment}
                    disabled={currentAttachmentIndex === 0}
                    className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Föregående underlag"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <span className="text-sm font-semibold text-gray-800">
                    Bokföringsunderlag {currentAttachmentIndex + 1} / {attachments.length}
                  </span>
                  
                  <button
                    onClick={goToNextAttachment}
                    disabled={currentAttachmentIndex === attachments.length - 1}
                    className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Nästa underlag"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* PDF/Image Viewer - Full width */}
              <div className="flex-1 bg-gray-100 overflow-hidden">
                {currentAttachment && currentAttachment.previewUrl ? (
                  currentAttachment.type === 'application/pdf' ? (
                    // PDF Viewer
                    <iframe
                      src={currentAttachment.previewUrl}
                      className="w-full h-full border-0"
                      title={currentAttachment.filename}
                    />
                  ) : (
                    // Image Viewer (JPG, PNG, etc)
                    <div className="w-full h-full p-4 overflow-auto">
                      <img
                        src={currentAttachment.previewUrl}
                        alt={currentAttachment.displayName || currentAttachment.filename}
                        className="max-w-full h-auto rounded shadow-lg bg-white mx-auto"
                      />
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">Ingen förhandsvisning tillgänglig</p>
                    </div>
                  </div>
                )}
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
    B123: {
      id: "B123",
      date: "2025-03-15",
      fiscalYear: "2024-2025",
      description: "Diverse kostnader Q1 (AGGREGERAD)",
      amount: 59780,
      status: "error",
      flagReason: "2 festkläder (10 090 SEK) i aggregerad post med 49 dokument",
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
    },
    C999: {
      id: "C999",
      date: "2025-01-31",
      fiscalYear: "2024-2025",
      description: "TESTPOST - Många rader för scrolltest",
      amount: 567890,
      status: "warning",
      flagReason: "Ovanligt många kontorader - kontrollera uppdelning",
      createdBy: "Test Import",
      createdDate: "2025-01-31",
      rows: [
        { account: "1510", accountName: "Kundfordringar Sverige", debit: 125000, credit: 0 },
        { account: "3000", accountName: "Försäljning varor Sverige", debit: 0, credit: 100000 },
        { account: "2610", accountName: "Utgående moms 25%", debit: 0, credit: 25000 },
        { account: "4000", accountName: "Inköp av varor", debit: 45000, credit: 0 },
        { account: "2640", accountName: "Ingående moms 25%", debit: 11250, credit: 0 },
        { account: "5010", accountName: "Lokalhyra", debit: 35000, credit: 0 },
        { account: "5800", accountName: "Kontorsmaterial", debit: 8500, credit: 0 },
        { account: "6000", accountName: "Telekommunikation", debit: 3200, credit: 0 },
        { account: "6100", accountName: "Frakt och transport", debit: 12400, credit: 0 },
        { account: "6200", accountName: "Representation", debit: 6700, credit: 0 },
        { account: "6300", accountName: "Marknadsföring", debit: 28500, credit: 0 },
        { account: "6400", accountName: "Försäkringar", debit: 15600, credit: 0 },
        { account: "6500", accountName: "Övriga externa tjänster", debit: 22300, credit: 0 },
        { account: "7010", accountName: "Löner och arvoden", debit: 125000, credit: 0 },
        { account: "7210", accountName: "Arbetsgivaravgifter", debit: 39375, credit: 0 },
        { account: "7330", accountName: "Pensionskostnader", debit: 18750, credit: 0 },
        { account: "7510", accountName: "Lokalkostnader", debit: 9800, credit: 0 },
        { account: "7610", accountName: "Reparation och underhåll", debit: 14200, credit: 0 },
        { account: "7620", accountName: "IT-tjänster", debit: 31500, credit: 0 },
        { account: "7810", accountName: "Avskrivning inventarier", debit: 22340, credit: 0 },
        { account: "8300", accountName: "Ränteintäkter", debit: 0, credit: 2450 },
        { account: "8400", accountName: "Räntekostnader", debit: 5600, credit: 0 },
        { account: "2440", accountName: "Leverantörsskulder", debit: 0, credit: 245670 },
        { account: "2710", accountName: "Personalskatt", debit: 0, credit: 38750 },
        { account: "1930", accountName: "Företagskonto SEB", debit: 0, credit: 283470 }
      ]
    }
  };
  
  return vouchers[voucherId];
}

export default VoucherDetailPage;
