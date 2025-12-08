/**
 * PaymentSuccessSlide - Visas efter lyckad Stripe-betalning
 * 
 * TIC-TAC-TOE PATTERN:
 * Detta är en "dumb component" som bara visar UI baserat på props.
 * INGA API-anrop görs här - allt sker i AuthenticatedApp state machine.
 * 
 * FLÖDE:
 * 1. AuthenticatedApp ser att URL är /payment-success
 * 2. State machine går till VERIFYING_PAYMENT state
 * 3. State machine anropar /subscription/status endpoint
 * 4. State machine sätter paymentVerificationStatus
 * 5. Denna component renderar baserat på status
 * 6. Användaren klickar "OK" → onPaymentConfirmed() callback
 * 
 * PROPS:
 * - status: 'verifying' | 'success' | 'error'
 * - message: Felmeddelande (om error)
 * - onPaymentConfirmed: Callback när användaren klickar OK
 * - onRetry: Callback när användaren klickar Försök igen
 */
export default function PaymentSuccessSlide({ 
  status = 'verifying',
  message = '',
  onPaymentConfirmed,
  onRetry
}) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-card shadow-2xl p-8 text-center">
        
        {status === 'verifying' && (
          <>
            <div className="mb-6">
              <svg className="animate-spin h-16 w-16 text-brand-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-brand-900 mb-2">
              Bekräftar betalning...
            </h1>
            <p className="text-gray-600">
              Vänligen vänta medan vi verifierar din betalning
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="mb-6">
              <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              Betalning genomförd! ✅
            </h1>
            <p className="text-gray-600 mb-4">
              Din prenumeration är nu aktiv.
            </p>
            
            <p className="text-sm text-gray-600 mb-6">
              Företagsdata hämtas i bakgrunden och kommer vara tillgänglig när du navigerar till Verksamhet-sliden.
            </p>
            
            <button
              onClick={() => onPaymentConfirmed()}
              className="w-full px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
            >
              OK, fortsätt till Riskfrågor Steg 2 →
            </button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="mb-6">
              <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-700 mb-2">
              Något gick fel
            </h1>
            <p className="text-gray-600 mb-4">
              {message || 'Kunde inte bekräfta betalning'}
            </p>
            
            <button
              onClick={() => onRetry()}
              className="w-full px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
            >
              Försök igen
            </button>
          </>
        )}
        
      </div>
    </div>
  );
}
