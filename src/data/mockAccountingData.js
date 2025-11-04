// Mock bokföringsdata för demonstation (Svenska BAS-kontoplanen)
// Används för att simulera Fortnox-stil rapporter

export const mockBalanceSheet2025 = {
  firmId: 'hyrupstars_ab',
  firmName: 'Hyrupstars AB',
  orgNr: '559327-2213',
  period: { from: '2025-01-01', to: '2025-12-31' },
  accounts: [
    // TILLGÅNGAR
    { number: '1510', name: 'Kundfordringar', balance: 245000, type: 'asset', clickable: true },
    { number: '1630', name: 'Avräkning för skatter och avgifter', balance: 12500, type: 'asset', clickable: true },
    { number: '1910', name: 'Kassa', balance: 5200, type: 'asset', clickable: true },
    { number: '1930', name: 'Företagskonto/checkkonto/affärskonto', balance: 187400, type: 'asset', clickable: true },
    
    // SKULDER & EGET KAPITAL
    { number: '2081', name: 'Aktiekapital', balance: -50000, type: 'equity', clickable: true },
    { number: '2440', name: 'Leverantörsskulder', balance: -125600, type: 'liability', clickable: true },
    { number: '2510', name: 'Skatteskulder', balance: -15400, type: 'liability', clickable: true },
    { number: '2710', name: 'Upplupna semesterlöner', balance: -48200, type: 'liability', clickable: true },
    
    // RESULTATRÄKNING (för balanseringen)
    { number: '2090', name: 'Balanserad vinst eller förlust', balance: -210900, type: 'equity', clickable: true },
  ],
  totals: {
    assets: 450100,
    liabilitiesAndEquity: -450100
  }
};

export const mockGeneralLedger2510 = {
  account: '2510',
  accountName: 'Skatteskulder',
  period: { from: '2025-01-01', to: '2025-12-31' },
  openingBalance: 0,
  transactions: [
    {
      series: 'A',
      number: 3,
      date: '2025-01-17',
      text: 'Debiterad preliminärskatt (skv2fnx)',
      debit: 0,
      credit: 1541,
      balance: -1541
    },
    {
      series: 'A',
      number: 8,
      date: '2025-02-15',
      text: 'Debiterad preliminärskatt februari',
      debit: 0,
      credit: 1541,
      balance: -3082
    },
    {
      series: 'A',
      number: 12,
      date: '2025-03-17',
      text: 'Debiterad preliminärskatt mars',
      debit: 0,
      credit: 1541,
      balance: -4623
    },
    {
      series: 'B',
      number: 45,
      date: '2025-03-31',
      text: 'Arbetsgivaravgifter Q1',
      debit: 0,
      credit: 8234,
      balance: -12857
    },
    {
      series: 'A',
      number: 18,
      date: '2025-04-15',
      text: 'Debiterad preliminärskatt april',
      debit: 0,
      credit: 1541,
      balance: -14398
    },
    {
      series: 'A',
      number: 23,
      date: '2025-05-15',
      text: 'Slutavräkning skatt 2024',
      debit: 3500,
      credit: 0,
      balance: -10898
    },
    {
      series: 'A',
      number: 27,
      date: '2025-06-17',
      text: 'Debiterad preliminärskatt juni',
      debit: 0,
      credit: 1541,
      balance: -12439
    },
    {
      series: 'B',
      number: 67,
      date: '2025-06-30',
      text: 'Arbetsgivaravgifter Q2',
      debit: 0,
      credit: 2961,
      balance: -15400
    }
  ],
  closingBalance: -15400
};

export const mockVoucherA3 = {
  series: 'A',
  number: 3,
  date: '2025-01-17',
  description: 'Debiterad preliminärskatt januari',
  lines: [
    { account: '2510', accountName: 'Skatteskulder', text: 'Preliminärskatt jan', credit: 1541, debit: 0 },
    { account: '1630', accountName: 'Avräkning skatter', text: 'Preliminärskatt jan', debit: 1541, credit: 0 }
  ],
  totalDebit: 1541,
  totalCredit: 1541,
  lastVoucherNumbers: { A: 3, B: 62, C: 15 },
  attachments: [
    {
      filename: 'skattebesked_januari_2025.pdf',
      uploadDate: '2025-01-17',
      size: 145600,
      ocrAmount: 1541,
      ocrSupplier: 'Skatteverket',
      matchConfidence: 0.98,
      flagged: false
    }
  ]
};

// Flera verifikationer för huvudbok 1510 (Kundfordringar)
export const mockGeneralLedger1510 = {
  account: '1510',
  accountName: 'Kundfordringar',
  period: { from: '2025-01-01', to: '2025-12-31' },
  openingBalance: 180000,
  transactions: [
    {
      series: 'A',
      number: 5,
      date: '2025-01-22',
      text: 'Faktura #2501 - Acme Corp',
      debit: 25000,
      credit: 0,
      balance: 205000
    },
    {
      series: 'A',
      number: 7,
      date: '2025-02-10',
      text: 'Inbetalning Acme Corp',
      debit: 0,
      credit: 25000,
      balance: 180000
    },
    {
      series: 'A',
      number: 11,
      date: '2025-03-05',
      text: 'Faktura #2503 - Beta Industries',
      debit: 87000,
      credit: 0,
      balance: 267000
    },
    {
      series: 'A',
      number: 14,
      date: '2025-03-15',
      text: 'Inbetalning Beta Industries',
      debit: 0,
      credit: 65000,
      balance: 202000
    },
    {
      series: 'A',
      number: 19,
      date: '2025-04-20',
      text: 'Faktura #2508 - Gamma Tech',
      debit: 43000,
      credit: 0,
      balance: 245000
    }
  ],
  closingBalance: 245000
};

// Fraud-exempel (många dokument i en post)
export const mockVoucherA308 = {
  series: 'A',
  number: 308,
  date: '2025-03-15',
  description: 'Varor och material Q1 (AGGREGERAD)',
  lines: [
    { account: '5410', accountName: 'Varor och material', text: 'Div. inköp Q1', debit: 47823, credit: 0 },
    { account: '2640', accountName: 'Ingående moms', text: 'Moms på inköp Q1', debit: 11957, credit: 0 },
    { account: '1930', accountName: 'Företagskonto', text: 'Utbetalningar Q1', credit: 59780, debit: 0 }
  ],
  totalDebit: 59780,
  totalCredit: 59780,
  lastVoucherNumbers: { A: 308, B: 62, C: 15 },
  attachments: [
    {
      filename: 'faktura_motorcykeldack_michelin.pdf',
      uploadDate: '2025-03-02',
      size: 234000,
      ocrAmount: 5200,
      ocrSupplier: 'MC-Däck Sverige AB',
      matchConfidence: 0.95,
      flagged: true,
      flagReason: 'Privat inköp misstänks (motorcykeldäck)'
    },
    {
      filename: 'faktura_motorcykeldack_pirelli.pdf',
      uploadDate: '2025-03-08',
      size: 198000,
      ocrAmount: 4890,
      ocrSupplier: 'Däckia AB',
      matchConfidence: 0.93,
      flagged: true,
      flagReason: 'Privat inköp misstänks (motorcykeldäck)'
    },
    // Mock: Ytterligare 47 legitima fakturor (bara 3 visas för brevity)
    {
      filename: 'faktura_kontorsmaterial_staples.pdf',
      uploadDate: '2025-01-15',
      size: 156000,
      ocrAmount: 2340,
      ocrSupplier: 'Staples Sverige AB',
      matchConfidence: 0.97,
      flagged: false
    },
    {
      filename: 'faktura_fraktkostnad_dhl.pdf',
      uploadDate: '2025-02-10',
      size: 89000,
      ocrAmount: 890,
      ocrSupplier: 'DHL Express',
      matchConfidence: 0.99,
      flagged: false
    },
    {
      filename: 'faktura_webhosting_loopia.pdf',
      uploadDate: '2025-03-01',
      size: 123000,
      ocrAmount: 1200,
      ocrSupplier: 'Loopia AB',
      matchConfidence: 0.98,
      flagged: false
    }
    // ... + 44 additional legitimate invoices (truncated in mock)
  ],
  forensicFlags: {
    multipleBusinessEvents: true,
    suspiciousItems: 2,
    totalAttachments: 49, // Actual count would be 49
    recommendation: 'Dela upp i separata verifikationer enligt god bokföringssed (BFL 4 kap. 2§)'
  }
};

// Helper function för att hämta data baserat på query
export function getMockReportData(params) {
  const { type, r, fromacct, toacct, s, i } = params;
  
  if (type === 'balance') {
    return mockBalanceSheet2025;
  }
  
  if (r === 'gledger') {
    if (fromacct === '2510') {
      return mockGeneralLedger2510;
    } else if (fromacct === '1510') {
      return mockGeneralLedger1510;
    }
    // Default
    return mockGeneralLedger2510;
  }
  
  if (r === 'voucher') {
    if (s === 'A' && i === 3) {
      return mockVoucherA3;
    } else if (s === 'A' && i === 308) {
      return mockVoucherA308;
    }
    // Default
    return mockVoucherA3;
  }
  
  return null;
}
