import { createContext, useContext, useState } from 'react';

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

  const value = {
    platformAgreement,
    setPlatformAgreement,
    oneTimeAgreement,
    setOneTimeAgreement,
    hasAnyAgreement
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
