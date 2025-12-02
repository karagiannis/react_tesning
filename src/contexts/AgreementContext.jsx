import { createContext, useContext, useState, useCallback } from 'react';

const AgreementContext = createContext();

export function AgreementProvider({ children }) {
  // Företagsavtal (tecknas i Settings)
  const [platformAgreement, setPlatformAgreement] = useState({
    isSigned: false,
    agreementNumber: null,
    signedAt: null,
    signerName: null,
    signerPersonnr: null,
    monthlyFee: 1995,
    status: 'Ej signerat', // 'Ej signerat' | 'Under verifiering' | 'Godkänt'
    isSigningInProgress: false
  });

  // Engångsavtal (tecknas i RiskSlide popup)
  const [oneTimeAgreement, setOneTimeAgreement] = useState({
    isSigned: false,
    agreementNumber: null,
    signedAt: null,
    signerName: null,
    signerPersonnr: null,
    totalCost: 0, // Räknas ut efter API-anrop
    isSigningInProgress: false
  });

  // Helper: Kolla om NÅGOT avtal finns
  const hasAnyAgreement = () => {
    return platformAgreement.isSigned || oneTimeAgreement.isSigned;
  };

  // 🔄 Ladda subscription-status från server (vid resume)
  const loadSubscriptionFromServer = useCallback((subscription) => {
    if (subscription && subscription.type) {
      console.log('📥 AgreementContext: Laddar subscription från server:', subscription);
      
      // ⚠️ VIKTIGT: Endast bekräftad betalning = signerat avtal!
      // pending_payment betyder att användaren startade men inte slutförde
      const isConfirmed = subscription.status === 'confirmed' || subscription.status === 'active';
      
      if (subscription.type === 'trial' && isConfirmed) {
        setOneTimeAgreement({
          isSigned: true,
          agreementNumber: `EA-${Date.now()}`,
          signedAt: subscription.signed_at,
          signerName: null,  // Finns ej i backend än
          signerPersonnr: subscription.personnummer || null,
          totalCost: 2495,  // Fast pris för engångsavtal
          isSigningInProgress: false
        });
      } else if (subscription.type === 'enterprise' && isConfirmed) {
        setPlatformAgreement(prev => ({
          ...prev,
          isSigned: true,
          signedAt: subscription.signed_at,
          status: 'Godkänt'
        }));
      } else {
        // Om status är pending_payment eller annat, rensa för att tvinga ny betalning
        console.log('⚠️ Subscription finns men är inte bekräftad:', subscription.status);
      }
    }
  }, []);

  // 🗑️ Rensa subscription-status (vid logout eller case-byte)
  const clearSubscription = useCallback(() => {
    setOneTimeAgreement({
      isSigned: false,
      agreementNumber: null,
      signedAt: null,
      signerName: null,
      signerPersonnr: null,
      totalCost: 0,
      isSigningInProgress: false
    });
    setPlatformAgreement({
      isSigned: false,
      agreementNumber: null,
      signedAt: null,
      signerName: null,
      signerPersonnr: null,
      monthlyFee: 1995,
      status: 'Ej signerat',
      isSigningInProgress: false
    });
  }, []);

  const value = {
    platformAgreement,
    setPlatformAgreement,
    oneTimeAgreement,
    setOneTimeAgreement,
    hasAnyAgreement,
    loadSubscriptionFromServer,  // 🆕
    clearSubscription             // 🆕
  };

  return (
    <AgreementContext.Provider value={value}>
      {children}
    </AgreementContext.Provider>
  );
}

export function useAgreements() {
  const context = useContext(AgreementContext);
  if (!context) {
    throw new Error('useAgreements must be used within AgreementProvider');
  }
  return context;
}
