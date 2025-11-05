import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { openVoucherWindow, openWindowWithCheck } from '../utils/windowManager';

/**
 * Bokföringsanalys Multi-stage Wizard
 * 5 steg: Bokföringsanalys → Rapportarkiv → Moms → Deklaration → Årsredovisning
 */
function AccountingAnalysisWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(() => {
    // Återställ från localStorage
    return parseInt(localStorage.getItem('analysisWizardStep') || '1');
  });
  
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('analysisWizardCompleted');
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
    localStorage.setItem('analysisWizardStep', currentStep.toString());
  }, [currentStep]);
  
  useEffect(() => {
    localStorage.setItem('analysisWizardCompleted', JSON.stringify(completedSteps));
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
    markStepCompleted(currentStep);
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const resetWizard = () => {
    localStorage.removeItem('analysisWizardStep');
    localStorage.removeItem('analysisWizardCompleted');
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
                  disabled={step.id > currentStep && !completedSteps.includes(step.id)}
                  className={`w-full px-3 py-2 rounded-box font-medium transition-all text-sm ${
                    step.id === currentStep
                      ? 'bg-brand-600 text-white shadow-md'
                      : completedSteps.includes(step.id)
                      ? 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                      : step.id < currentStep
                      ? 'bg-brand-100 text-gray-600 hover:bg-brand-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="text-left w-full">
                    <div className={`text-xs font-normal mb-0.5 ${
                      step.id === currentStep ? 'text-white opacity-90' : 'opacity-75'
                    }`}>
                      Steg {step.id}
                    </div>
                    <div className={`font-semibold flex items-center justify-between ${
                      step.id === currentStep ? 'text-white' : ''
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
          {currentStep === 1 && <Step1_FraudDetection onNext={nextStep} />}
          {currentStep === 2 && <Step2_ReportArchive onNext={nextStep} onBack={previousStep} />}
          {currentStep === 3 && <Step3_VATComparison onNext={nextStep} onBack={previousStep} />}
          {currentStep === 4 && <Step4_TaxComparison onNext={nextStep} onBack={previousStep} />}
          {currentStep === 5 && <Step5_AnnualReportComparison onBack={previousStep} onFinish={() => navigate('/penningflodes')} />}
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
      createdBy: "System Import",
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
      createdBy: "Fredrik Andersson",
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
      createdBy: "System Import",
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
      createdBy: "System Import",
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
      createdBy: "System Import",
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
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-box">
          <div className="text-stat-value text-gray-800">{totalScanned.toLocaleString('sv-SE')}</div>
          <div className="text-sm text-gray-600 mt-1">Verifikationer granskade</div>
          <div className="text-xs text-gray-500 mt-1">{fiscalYears.length} räkenskapsår</div>
        </div>
        
        <div className="p-4 bg-red-50 border border-red-200 rounded-box">
          <div className="text-stat-value text-red-600">{summary.errors}</div>
          <div className="text-sm text-red-700 mt-1">Allvarliga avvikelser</div>
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-box">
          <div className="text-stat-value text-yellow-600">{summary.warnings}</div>
          <div className="text-sm text-yellow-700 mt-1">Varningar</div>
        </div>
        
        <div className="p-4 bg-green-50 border border-green-200 rounded-box">
          <div className="text-stat-value text-green-600">{summary.ok.toLocaleString('sv-SE')}</div>
          <div className="text-sm text-green-700 mt-1">Godkända poster</div>
        </div>
      </div>
      
      {/* Flaggade poster tabell - Med pagination */}
      <div className="border border-gray-200 rounded-box overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-12">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-24">Vernr</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-28">Datum</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-32">Räkenskapsår</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Beskrivning</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 w-32">Belopp</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 w-32">Åtgärd</th>
            </tr>
          </thead>
          <tbody>
            {currentVouchers.map((voucher) => (
              <tr
                key={voucher.id}
                className={`border-b border-gray-100 transition-all cursor-pointer hover:shadow-sm ${getStatusColor(voucher.status)}`}
                onClick={() => openWindowWithCheck(() => openVoucherWindow(voucher.id))}
              >
                <td className="px-4 py-3">
                  {getStatusIcon(voucher.status)}
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-sm">{voucher.id}</td>
                <td className="px-4 py-3 text-sm">{voucher.date}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{voucher.fiscalYear}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-sm">{voucher.description}</div>
                  <div className="text-xs text-gray-600 mt-1">{voucher.flagReason}</div>
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold">{formatAmount(voucher.amount)}</td>
                <td className="px-4 py-3 text-center">
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
                <div>Skapad av: {selectedVoucher.createdBy}</div>
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
 * STEG 2: Rapportarkiv (Placeholder)
 */
function Step2_ReportArchive({ onNext, onBack }) {
  return (
    <div className="p-10">
      <h1 className="text-page-title text-brand-900 mb-2 flex items-center gap-3">
        <svg className="w-icon-md h-icon-md text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Rapportarkiv per Räkenskapsår
      </h1>
      <p className="text-brand-700 mb-8">
        Expanderbar trädstruktur med Balansrapport, Resultatrapport, Huvudbok, Verifikationslista.
      </p>
      <p className="text-sm text-gray-500 bg-gray-50 p-compact-md rounded-fortnox mb-compact-lg">
        <strong>TODO:</strong> Implementera expanderbar mappstruktur med window.open() för PDF-rapporter.
      </p>
      <div className="flex justify-between mt-compact-lg">
        <button onClick={onBack} className="px-compact-md py-compact-sm bg-gray-200 text-gray-700 font-medium rounded-fortnox hover:bg-gray-300 shadow-md transition-colors">
          ← Föregående
        </button>
        <button onClick={onNext} className="px-compact-md py-compact-sm bg-brand-600 text-white font-medium rounded-fortnox hover:bg-brand-700 shadow-md transition-colors">
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
