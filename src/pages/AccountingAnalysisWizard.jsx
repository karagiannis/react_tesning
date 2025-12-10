import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { openVoucherWindow, openWindowWithCheck } from '../utils/windowManager';

/**
 * Bokföringsanalys Multi-stage Wizard
 * 5 steg: Bokföringsanalys → Rapportarkiv → Moms → Deklaration → Årsredovisning
 */
function AccountingAnalysisWizard() {
  const navigate = useNavigate();
  const [current_step, setCurrentStep] = useState(() => {
    // Återställ från localStorage
    return parseInt(localStorage.getItem('analysis_wizard_step') || '1');
  });
  
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('analysis_wizard_completed');
    return saved ? JSON.parse(saved) : [];
  });
  
  const steps = [
    { id: 1, title: 'Bokföringsanalys' },
    { id: 2, title: 'Rapportarkiv' },
    { id: 3, title: 'Momsavstämning' },
    { id: 4, title: 'Deklaration' },
    { id: 5, title: 'Årsredovisning' }
  ];
  
  // Spara progress i localStorage
  useEffect(() => {
    localStorage.setItem('analysis_wizard_step', current_step.toString());
  }, [current_step]);
  
  useEffect(() => {
    localStorage.setItem('analysis_wizard_completed', JSON.stringify(completedSteps));
  }, [completedSteps]);
  
  const goToStep = (stepId) => {
    setCurrentStep(stepId);
  };
  
  const markStepCompleted = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };
  
  const nextStep = () => {
    markStepCompleted(current_step);
    if (current_step < 5) {
      setCurrentStep(current_step + 1);
    }
  };
  
  const previousStep = () => {
    if (current_step > 1) {
      setCurrentStep(current_step - 1);
    }
  };
  
  const resetWizard = () => {
    localStorage.removeItem('analysis_wizard_step');
    localStorage.removeItem('analysis_wizard_completed');
    setCurrentStep(1);
    setCompletedSteps([]);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-7xl w-full bg-white rounded-card shadow-2xl overflow-hidden">
      
        {/* Stepper Navigation */}
        <div className="bg-gray-50 border-b border-gray-200 px-10 py-4">
          <div className="flex items-center justify-between gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => goToStep(step.id)}
                  disabled={step.id > current_step && !completedSteps.includes(step.id)}
                  className={`w-full px-3 py-2 rounded-box font-medium transition-all text-sm ${
                    step.id === current_step
                      ? 'bg-brand-600 text-white shadow-md'
                      : completedSteps.includes(step.id)
                      ? 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                      : step.id < current_step
                      ? 'bg-brand-100 text-gray-600 hover:bg-brand-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="text-left w-full">
                    <div className={`text-xs font-normal mb-0.5 ${
                      step.id === current_step ? 'text-white opacity-90' : 'opacity-75'
                    }`}>
                      Steg {step.id}
                    </div>
                    <div className={`font-semibold flex items-center justify-between ${
                      step.id === current_step ? 'text-white' : ''
                    }`}>
                      <span>{step.title}</span>
                      {completedSteps.includes(step.id) && (
                        <span className="ml-2">✓</span>
                      )}
                    </div>
                  </div>
                </button>
                
                {index < steps.length - 1 && (
                  <div className={`w-4 h-0.5 mx-1 flex-shrink-0 ${
                    completedSteps.includes(step.id) ? 'bg-brand-400' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Content Area */}
        <div>
          {current_step === 1 && <Step1_FraudDetection onNext={nextStep} />}
          {current_step === 2 && <Step2_ReportArchive onNext={nextStep} onBack={previousStep} />}
          {current_step === 3 && <Step3_VATComparison onNext={nextStep} onBack={previousStep} />}
          {current_step === 4 && <Step4_TaxComparison onNext={nextStep} onBack={previousStep} />}
          {current_step === 5 && <Step5_AnnualReportComparison onBack={previousStep} onFinish={() => navigate('/penningflodes')} />}
        </div>
      </div>
    </div>
  );
}

/**
 * STEG 1: Bokföringsanalys - Forensisk Granskning (från contentslide)
 */
function Step1_FraudDetection({ onNext }) {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Antal poster per sida

  // Mock-data för verifikationer (från contentslide BokforingsanalysSlide.jsx)
  const vouchers = [
    {
      id: "A1",
      date: "2024-01-15",
      fiscalYear: "2023-2024",
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
      fiscalYear: "2023-2024",
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
      id: "B123",
      date: "2025-03-15",
      fiscalYear: "2024-2025",
      description: "Diverse kostnader Q1 (AGGREGERAD)",
      amount: 59780,
      status: "error",
      flagReason: "2 festkläder (10 090 SEK) i aggregerad post med 49 dokument",
      created_by: "System Import",
      createdDate: "2025-03-15",
      rows: [
        { account: "5410", accountName: "Varor och material", debit: 47823, credit: 0 },
        { account: "2640", accountName: "Ingående moms", debit: 11957, credit: 0 },
        { account: "1930", accountName: "Företagskonto", debit: 0, credit: 59780 }
      ]
    },
    {
      id: "B156",
      date: "2024-11-20",
      fiscalYear: "2024-2025",
      description: "Samlingsfaktura Q4",
      amount: 125400,
      status: "warning",
      flagReason: "23 affärshändelser i samma verifikation",
      created_by: "System Import",
      createdDate: "2024-11-20",
      rows: [
        { account: "5410", accountName: "Varor och material", debit: 100320, credit: 0 },
        { account: "2640", accountName: "Ingående moms", debit: 25080, credit: 0 },
        { account: "2440", accountName: "Leverantörsskulder", debit: 0, credit: 125400 }
      ]
    },
    {
      id: "C999",
      date: "2025-01-31",
      fiscalYear: "2024-2025",
      description: "TESTPOST - Många rader för scrolltest",
      amount: 567890,
      status: "warning",
      flagReason: "Ovanligt många kontorader - kontrollera uppdelning",
      created_by: "Test Import",
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
    },
    // Extra testposter för att visa pagination (11-20)
    ...Array.from({ length: 15 }, (_, i) => ({
      id: `D${100 + i}`,
      date: `2025-02-${String(10 + i).padStart(2, '0')}`,
      fiscalYear: "2024-2025",
      description: `Testpost ${i + 1} - Diverse kostnader`,
      amount: 15000 + Math.floor(Math.random() * 50000),
      status: i % 3 === 0 ? "error" : "warning",
      flagReason: i % 3 === 0 
        ? "Belopp avviker från normalintervall"
        : "Saknar fullständig dokumentation",
      created_by: "System Import",
      createdDate: `2025-02-${String(10 + i).padStart(2, '0')}`,
      rows: [
        { account: "6000", accountName: "Diverse kostnader", debit: 15000 + Math.floor(Math.random() * 50000), credit: 0 },
        { account: "1930", accountName: "Företagskonto", debit: 0, credit: 15000 + Math.floor(Math.random() * 50000) }
      ]
    }))
  ];
  
  // Pagination-beräkningar
  const totalPages = Math.ceil(vouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVouchers = vouchers.slice(startIndex, endIndex);
  
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  const totalScanned = 1247;
  const totalFlagged = vouchers.length;
  const totalOK = totalScanned - totalFlagged;
  
  const summary = {
    total: totalFlagged,
    errors: vouchers.filter(v => v.status === 'error').length,
    warnings: vouchers.filter(v => v.status === 'warning').length,
    ok: totalOK
  };
  
  const fiscalYears = ['2022-2023', '2023-2024', '2024-2025'];
  
  // Formatera belopp
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Status-ikon och färg
  const getStatusIcon = (status) => {
    switch (status) {
      case 'error':
        return (
          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'error':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };
  
  // Beräkna totaler för modal
  const getTotals = (rows) => {
    return rows.reduce((acc, row) => ({
      debit: acc.debit + row.debit,
      credit: acc.credit + row.credit
    }), { debit: 0, credit: 0 });
  };
  
  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
          <svg className="w-icon-md h-icon-md text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Bokföringsanalys
        </h1>
        <p className="text-brand-700">
          Automatisk granskning av verifikationer från SIE-filer. Flaggade poster kräver verifiering.
        </p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-box">
          <div className="text-2xl font-bold text-gray-800">{totalScanned.toLocaleString('sv-SE')}</div>
          <div className="text-xs text-gray-600 mt-1">Verifikationer granskade</div>
          <div className="text-xs text-gray-500 mt-1">{fiscalYears.length} räkenskapsår</div>
        </div>
        
        <div className="p-3 bg-red-50 border border-red-200 rounded-box">
          <div className="text-2xl font-bold text-red-800">{summary.errors}</div>
          <div className="text-xs text-red-600 mt-1">Allvarliga avvikelser</div>
        </div>
        
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-box">
          <div className="text-2xl font-bold text-yellow-800">{summary.warnings}</div>
          <div className="text-xs text-yellow-600 mt-1">Varningar</div>
        </div>
        
        <div className="p-3 bg-brand-50 border border-brand-200 rounded-box">
          <div className="text-2xl font-bold text-brand-800">{summary.ok.toLocaleString('sv-SE')}</div>
          <div className="text-xs text-brand-600 mt-1">Godkända poster</div>
        </div>
      </div>
      
      {/* Flaggade poster tabell - Med pagination */}
      <div className="border border-gray-200 rounded-box overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase w-12">Status</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase w-20">Vernr</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase w-28">Datum</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase w-28">Räkenskapsår</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Beskrivning</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase w-32">Belopp</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase w-28">Åtgärd</th>
            </tr>
          </thead>
          <tbody>
            {currentVouchers.map((voucher) => (
              <tr
                key={voucher.id}
                className={`border-b border-gray-100 transition-all cursor-pointer hover:shadow-sm ${getStatusColor(voucher.status)}`}
                onClick={() => openWindowWithCheck(() => openVoucherWindow(voucher.id))}
              >
                <td className="px-3 py-2">
                  {getStatusIcon(voucher.status)}
                </td>
                <td className="px-3 py-2 font-mono font-semibold text-xs">{voucher.id}</td>
                <td className="px-3 py-2 text-xs text-gray-700">{voucher.date}</td>
                <td className="px-3 py-2 text-xs text-gray-600">{voucher.fiscalYear}</td>
                <td className="px-3 py-2 text-xs text-gray-800">{voucher.description}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{formatAmount(voucher.amount)}</td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Förhindra dubbel-trigger av rad-klick
                      openWindowWithCheck(() => openVoucherWindow(voucher.id));
                    }}
                    className="px-3 py-1 bg-brand-600 text-white text-sm rounded hover:bg-brand-700 transition-colors"
                  >
                    Visa post
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Visar {startIndex + 1}-{Math.min(endIndex, vouchers.length)} av {vouchers.length} flaggade poster
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Föregående
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Visa alltid första, sista och närliggande sidor
                  if (
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-brand-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 || 
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Nästa →
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal för verifikationsdetaljer */}
      {selectedVoucher && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" 
          onClick={() => setSelectedVoucher(null)}
        >
          <div 
            className="bg-white rounded-card shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-page-title text-gray-900">
                  Verifikation {selectedVoucher.id}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedVoucher.date} • {selectedVoucher.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Varning */}
              {selectedVoucher.status === 'error' && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-box">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold text-red-900 text-sm">Allvarlig avvikelse</div>
                      <div className="text-sm text-red-800 mt-1">{selectedVoucher.flagReason}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bokföringsposter */}
              <table className="w-full border border-gray-200 rounded-box overflow-hidden mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Konto</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Benämning</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Debet</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Kredit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedVoucher.rows.map((row, idx) => (
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
                      {formatAmount(getTotals(selectedVoucher.rows).debit)}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {formatAmount(getTotals(selectedVoucher.rows).credit)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Metadata */}
              <div className="text-xs text-gray-500 space-y-1">
                <div>Skapad: {selectedVoucher.createdDate}</div>
                <div>Skapad av: {selectedVoucher.created_by}</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setSelectedVoucher(null)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-box hover:bg-gray-100 transition-colors font-medium"
              >
                Stäng
              </button>
              <button
                onClick={() => alert('TODO: Öppna underlagspanel')}
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-box hover:bg-brand-700 transition-colors font-medium"
              >
                Visa underlag
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          className="px-6 py-3 bg-brand-600 text-white font-medium rounded-box hover:bg-brand-700 transition-colors shadow-md"
        >
          Fortsätt till Rapportarkiv →
        </button>
      </div>
    </div>
  );
}

/**
 * STEG 2: Rapportarkiv
 * Visar expanderbar träd-struktur per räkenskapsår med två kolumner:
 * - "Vår korrekta bokföring" (AI-genererad, placeholder tills motor klar)
 * - "Kundens bokföring" (från SIE-filer via server endpoints)
 */
function Step2_ReportArchive({ onNext, onBack }) {
  const [expandedYears, setExpandedYears] = useState(new Set());
  const [expandedDeviations, setExpandedDeviations] = useState(new Set());
  const API_BASE = 'http://localhost:8000';
  
  // Mock fiscal year data med realistiska scenarion för forensisk revision
  const fiscalYears = [
    {
      year: '2024-2025',
      period: { from: '2024-05-01', to: '2025-04-30' },
      status: 'incomplete', // Pågående räkenskapsår - ofullständig
      statusNote: 'Bokföring stoppades vid verifikation A123 (augusti 2024)',
      ourReports: {
        balance: null, // AI-motor ej implementerad än
        income: null,
        ledger: null,
        vouchers: null
      },
      theirReports: {
        balance: { available: true, url: `${API_BASE}/3/reports/financial?type=balance&from=2024-05-01&to=2025-04-30&format=pdf` },
        income: { available: true, url: `${API_BASE}/3/reports/financial?type=income&from=2024-05-01&to=2025-04-30&format=pdf` },
        ledger: { available: true, url: `${API_BASE}/3/reports/ledger?from=2024-05-01&to=2025-04-30&format=pdf` },
        vouchers: { available: true, url: `${API_BASE}/3/vouchers?from=2024-05-01&to=2025-04-30&format=pdf` }
      },
      deviations: [
        {
          id: 1,
          type: 'critical',
          title: 'Bokföring avbruten - saknar verifikationsunderlag',
          description: 'Verifikation A123 (augusti 2024): Kontantinsättning 45 000 SEK via företagets bankgiro saknar faktura/kvitto.',
          details: [
            'Ägaren har kommenterat i bankutdraget: "Jag har tagit emot kontanter från kund som jag satte in via bankgiro"',
            'Detta är INTE acceptabelt verifikationsunderlag enligt BFL 5 kap',
            'Kontanthantering kräver: a) Kvitto/faktura till kund, b) Kassarapport, c) ID på kund vid belopp >15 000 SEK (penningtvättslagen)',
            'Liknande felaktig hantering gjordes av RS Mek vid ett tillfälle i augusti - samma problematik',
            'Bokföringen kan ej fortsätta förrän korrekt underlag erhålls eller verifikationen omarbetas med korrektioner'
          ],
          impact: 'Räkenskapsåret kan ej avslutas. Risk för avvisad deklaration.',
          recommendation: 'Begär in fullständigt underlag alternativt omarbeta verifikationen enligt BFL krav.'
        }
      ]
    },
    {
      year: '2023-2024',
      period: { from: '2023-05-01', to: '2024-04-30' },
      status: 'complete',
      statusNote: 'Avslutad - avvikelser identifierade',
      ourReports: {
        balance: null, // Kommer från AI-motor
        income: null,
        ledger: null,
        vouchers: null
      },
      theirReports: {
        balance: { available: true, url: `${API_BASE}/3/reports/financial?type=balance&from=2023-05-01&to=2024-04-30&format=pdf` },
        income: { available: true, url: `${API_BASE}/3/reports/financial?type=income&from=2023-05-01&to=2024-04-30&format=pdf` },
        ledger: { available: true, url: `${API_BASE}/3/reports/ledger?from=2023-05-01&to=2024-04-30&format=pdf` },
        vouchers: { available: true, url: `${API_BASE}/3/vouchers?from=2023-05-01&to=2024-04-30&format=pdf` }
      },
      deviations: [
        {
          id: 2,
          type: 'error',
          title: 'Felaktig kontering av konsultkostnader',
          description: 'Verifikation B247 (mars 2024): Konsultkostnad 850 000 SEK bokförd som löpande kostnad, borde varit aktiverad.',
          details: [
            'Kundens bokföring: Konto 4000 (Konsultkostnader) 850 000 SEK',
            'Korrekt kontering: Konto 1220 (Immateriella anläggningstillgångar) 850 000 SEK',
            'Påverkan balansräkning: Anläggningstillgångar +850 000 SEK, Resultat +850 000 SEK',
            'Påverkan deklaration: Avskrivningar ska ske över 5 år (170 000 SEK/år)'
          ],
          impact: 'Resultat överskattat med 680 000 SEK (850k - 170k avskrivning)',
          recommendation: 'Omklassificera till anläggningstillgång och justera avskrivningsplan.'
        },
        {
          id: 3,
          type: 'warning',
          title: 'Aggregerade verifikationer med felaktiga poster',
          description: 'Samlingsfaktura Q4 (verifikation B156) innehåller 23 affärshändelser, varav 2 festkläder (10 090 SEK).',
          details: [
            'Kundens bokföring: Allt bokfört på konto 5410 (Varor och material)',
            'Festkläder är EJ avdragsgilla enligt IL 16 kap 1 §',
            'Korrekt kontering: Konto 8999 (Ej avdragsgilla kostnader) 10 090 SEK',
            'Moms på festkläder ska återföras: 2 523 SEK'
          ],
          impact: 'Avdragsgilla kostnader överskattade med 10 090 SEK, moms felaktig',
          recommendation: 'Omklassificera festkläder och korrigera momsdeklaration.'
        }
      ]
    },
    {
      year: '2022-2023',
      period: { from: '2022-05-01', to: '2023-04-30' },
      status: 'complete',
      statusNote: 'Perfekt överensstämmelse mellan vår AI-bokföring och kundens bokföring',
      ourReports: {
        balance: null, // Kommer från AI-motor
        income: null,
        ledger: null,
        vouchers: null
      },
      theirReports: {
        balance: { available: true, url: `${API_BASE}/3/reports/financial?type=balance&from=2022-05-01&to=2023-04-30&format=pdf` },
        income: { available: true, url: `${API_BASE}/3/reports/financial?type=income&from=2022-05-01&to=2023-04-30&format=pdf` },
        ledger: { available: true, url: `${API_BASE}/3/reports/ledger?from=2022-05-01&to=2023-04-30&format=pdf` },
        vouchers: { available: true, url: `${API_BASE}/3/vouchers?from=2022-05-01&to=2023-04-30&format=pdf` }
      },
      deviations: [] // Inga avvikelser - perfekt överensstämmelse!
    }
  ];
  
  const toggleYear = (year) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };
  
  const toggleDeviation = (deviationId) => {
    const newExpanded = new Set(expandedDeviations);
    if (newExpanded.has(deviationId)) {
      newExpanded.delete(deviationId);
    } else {
      newExpanded.add(deviationId);
    }
    setExpandedDeviations(newExpanded);
  };
  
  const getStatusBadge = (status) => {
    const styles = {
      complete: 'bg-green-100 text-green-800 border-green-300',
      incomplete: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      missing: 'bg-red-100 text-red-800 border-red-300'
    };
    const labels = {
      complete: 'Komplett',
      incomplete: 'Ofullständig',
      missing: 'Saknas'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };
  
  const getDeviationIcon = (type) => {
    if (type === 'critical') {
      return (
        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    } else if (type === 'error') {
      return (
        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
  };
  
  const getDeviationStyle = (type) => {
    if (type === 'critical') return 'bg-red-50 border-l-4 border-red-500';
    if (type === 'error') return 'bg-orange-50 border-l-4 border-orange-500';
    return 'bg-yellow-50 border-l-4 border-yellow-500';
  };
  
  const openReport = (url) => {
    if (!url) {
      alert('Rapport ej tillgänglig ännu');
      return;
    }
    window.open(url, '_blank', 'width=1200,height=800');
  };
  
  const reportTypes = [
    { key: 'balance', label: 'Balansrapport' },
    { key: 'income', label: 'Resultatrapport' },
    { key: 'ledger', label: 'Huvudbok' },
    { key: 'vouchers', label: 'Verifikationslista' }
  ];
  
  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
          <svg className="w-icon-md h-icon-md text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Rapportarkiv per Räkenskapsår
        </h1>
        <p className="text-brand-700">
          Jämför vår AI-korrigerade bokföring med kundens ursprungliga rapporter från SIE-filer.
        </p>
      </div>
      
      {/* Info box */}
      <div className="mb-6 p-4 bg-brand-50 border border-brand-200 rounded-box">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm">
            <div className="font-semibold text-brand-900 mb-2">Forensisk Revision - Simulerat Scenario</div>
            <div className="text-brand-700 space-y-1">
              <div><strong>2022-2023:</strong> Perfekt överensstämmelse - inga avvikelser identifierade</div>
              <div><strong>2023-2024:</strong> Flera avvikelser funna (felaktig kontering, ej avdragsgilla kostnader)</div>
              <div><strong>2024-2025:</strong> Bokföring stoppad vid verifikation A123 - saknar godkänt underlag för kontantinsättning</div>
              <div className="mt-2 pt-2 border-t border-brand-200 text-xs italic">
                AI-bokföringsmotorn implementeras inom ~1 vecka. Just nu visas enbart kundens rapporter från SIE-filer.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fiscal Years Tree */}
      <div className="space-y-3">
        {fiscalYears.map((fy) => (
          <div key={fy.year} className="border border-gray-200 rounded-box overflow-hidden bg-white shadow-sm">
            {/* Year Header */}
            <button
              onClick={() => toggleYear(fy.year)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <svg 
                  className={`w-5 h-5 text-gray-600 transition-transform ${expandedYears.has(fy.year) ? 'rotate-90' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">{fy.year}</span>
                  <span className="text-sm text-gray-600">
                    ({fy.period.from} – {fy.period.to})
                  </span>
                  {getStatusBadge(fy.status)}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {expandedYears.has(fy.year) ? 'Dölj rapporter' : 'Visa rapporter'}
              </div>
            </button>
            
            {/* Expanded Content */}
            {expandedYears.has(fy.year) && (
              <div className="p-4 bg-gray-50">
                {/* Status Note */}
                {fy.statusNote && (
                  <div className={`mb-4 p-3 rounded-box border ${
                    fy.deviations && fy.deviations.length > 0 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {fy.deviations && fy.deviations.length > 0 ? (
                        <svg className="w-4 h-4 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`text-sm font-medium ${
                        fy.deviations && fy.deviations.length > 0 
                          ? 'text-yellow-900' 
                          : 'text-green-900'
                      }`}>
                        {fy.statusNote}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Deviations Section */}
                {fy.deviations && fy.deviations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Avvikelser identifierade ({fy.deviations.length})
                    </h3>
                    
                    <div className="space-y-3">
                      {fy.deviations.map((deviation) => (
                        <div key={deviation.id} className={`rounded-box overflow-hidden ${getDeviationStyle(deviation.type)}`}>
                          {/* Deviation Header */}
                          <button
                            onClick={() => toggleDeviation(deviation.id)}
                            className="w-full px-4 py-3 bg-white bg-opacity-50 hover:bg-opacity-75 transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              {getDeviationIcon(deviation.type)}
                              <div className="text-left">
                                <div className="font-semibold text-sm text-gray-900">{deviation.title}</div>
                                <div className="text-xs text-gray-700 mt-0.5">{deviation.description}</div>
                              </div>
                            </div>
                            <svg 
                              className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ${
                                expandedDeviations.has(deviation.id) ? 'rotate-90' : ''
                              }`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          
                          {/* Deviation Details */}
                          {expandedDeviations.has(deviation.id) && (
                            <div className="px-4 py-3 bg-white bg-opacity-30 border-t border-gray-200">
                              <div className="space-y-3">
                                {/* Details List */}
                                <div>
                                  <div className="text-xs font-semibold text-gray-700 mb-2">Detaljer:</div>
                                  <ul className="space-y-1.5 text-xs text-gray-800">
                                    {deviation.details.map((detail, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-gray-400 flex-shrink-0">•</span>
                                        <span>{detail}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {/* Impact */}
                                <div className="p-2 bg-red-100 bg-opacity-50 rounded border border-red-200">
                                  <div className="text-xs font-semibold text-red-900 mb-1">Påverkan:</div>
                                  <div className="text-xs text-red-800">{deviation.impact}</div>
                                </div>
                                
                                {/* Recommendation */}
                                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                                  <div className="text-xs font-semibold text-blue-900 mb-1">Rekommendation:</div>
                                  <div className="text-xs text-blue-800">{deviation.recommendation}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Reports Table */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Rapporter:</h3>
                  
                  {/* Header Row */}
                  <div className="grid grid-cols-3 gap-4 mb-3 pb-2 border-b border-gray-300">
                    <div className="text-xs font-semibold text-gray-700 uppercase">Rapport</div>
                    <div className="text-xs font-semibold text-gray-700 uppercase">Vår korrekta bokföring</div>
                    <div className="text-xs font-semibold text-gray-700 uppercase">Kundens bokföring</div>
                  </div>
                  
                  {/* Report Rows */}
                  {reportTypes.map((report) => (
                    <div key={report.key} className="grid grid-cols-3 gap-4 py-2 border-b border-gray-200 last:border-0 hover:bg-white transition-colors">
                      {/* Report Name */}
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <span>{report.label}</span>
                      </div>
                      
                      {/* Our Reports (AI - placeholder) */}
                      <div className="flex items-center">
                        {fy.ourReports[report.key] ? (
                          <button
                            onClick={() => openReport(fy.ourReports[report.key].url)}
                            className="px-3 py-1 bg-brand-600 text-white text-xs rounded hover:bg-brand-700 transition-colors"
                          >
                            Öppna PDF
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Väntar på AI-motor
                          </span>
                        )}
                      </div>
                      
                      {/* Their Reports (from SIE) */}
                      <div className="flex items-center">
                        {fy.theirReports[report.key]?.available ? (
                          <button
                            onClick={() => openReport(fy.theirReports[report.key].url)}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                          >
                            Öppna PDF
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Saknas
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button 
          onClick={onBack} 
          className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-box hover:bg-gray-300 shadow-md transition-colors"
        >
          ← Föregående
        </button>
        <button 
          onClick={onNext} 
          className="px-6 py-3 bg-brand-600 text-white font-medium rounded-box hover:bg-brand-700 shadow-md transition-colors"
        >
          Fortsätt till Momsavstämning →
        </button>
      </div>
    </div>
  );
}

/**
 * STEG 3: Momsavstämning (Placeholder)
 */
function Step3_VATComparison({ onNext, onBack }) {
  return (
    <div className="p-10">
      <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
        <svg className="w-icon-md h-icon-md text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Momsavstämning
      </h1>
      <p className="text-brand-700 mb-8">
        Jämför våra framräknade momsrapporter med företagets inlämnade till Skatteverket.
      </p>
      <p className="text-sm text-gray-500 bg-gray-50 p-compact-md rounded-fortnox mb-compact-lg">
        <strong>TODO:</strong> Avvikelsetabell, expanderbara mappar (våra/deras), PDF-öppning.
      </p>
      <div className="flex justify-between mt-compact-lg">
        <button onClick={onBack} className="px-compact-md py-compact-sm bg-gray-200 text-gray-700 font-medium rounded-fortnox hover:bg-gray-300 shadow-md transition-colors">
          ← Föregående
        </button>
        <button onClick={onNext} className="px-compact-md py-compact-sm bg-brand-600 text-white font-medium rounded-fortnox hover:bg-brand-700 shadow-md transition-colors">
          Fortsätt till Deklaration →
        </button>
      </div>
    </div>
  );
}

/**
 * STEG 4: Deklarationsjämförelse (Placeholder)
 */
function Step4_TaxComparison({ onNext, onBack }) {
  return (
    <div className="p-10">
      <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
        <svg className="w-icon-md h-icon-md text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Inkomstdeklaration
      </h1>
      <p className="text-brand-700 mb-8">
        Jämför våra framräknade INK2 (SRU-mappning) med företagets inlämnade deklarationer.
      </p>
      <p className="text-sm text-gray-500 bg-gray-50 p-compact-md rounded-fortnox mb-compact-lg">
        <strong>TODO:</strong> SRU-avvikelsetabell, side-by-side PDF-öppning.
      </p>
      <div className="flex justify-between mt-compact-lg">
        <button onClick={onBack} className="px-compact-md py-compact-sm bg-gray-200 text-gray-700 font-medium rounded-fortnox hover:bg-gray-300 shadow-md transition-colors">
          ← Föregående
        </button>
        <button onClick={onNext} className="px-compact-md py-compact-sm bg-brand-600 text-white font-medium rounded-fortnox hover:bg-brand-700 shadow-md transition-colors">
          Fortsätt till Årsredovisning →
        </button>
      </div>
    </div>
  );
}

/**
 * STEG 5: Årsredovisning (Placeholder)
 */
function Step5_AnnualReportComparison({ onBack, onFinish }) {
  return (
    <div className="p-10">
      <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
        <svg className="w-icon-md h-icon-md text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Årsredovisning
      </h1>
      <p className="text-brand-700 mb-8">
        Jämför våra framräknade balans-/resultatrapporter med Bolagsverkets årsredovisningar.
      </p>
      <p className="text-sm text-gray-500 bg-gray-50 p-compact-md rounded-fortnox mb-compact-lg">
        <strong>TODO:</strong> Avvikelser balansomslutning/årets resultat, PDF-öppning hela årsredovisningen.
      </p>
      <div className="flex justify-between mt-compact-lg">
        <button onClick={onBack} className="px-compact-md py-compact-sm bg-gray-200 text-gray-700 font-medium rounded-fortnox hover:bg-gray-300 shadow-md transition-colors">
          ← Föregående
        </button>
        <button onClick={onFinish} className="px-compact-md py-compact-sm bg-green-600 text-white font-medium rounded-fortnox hover:bg-green-700 shadow-md transition-colors">
          ✓ Slutför Analys
        </button>
      </div>
    </div>
  );
}

export default AccountingAnalysisWizard;
