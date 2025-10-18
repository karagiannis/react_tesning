// Mock data from Roaring.io API endpoints
// This data simulates real API responses for demonstration purposes

export const mockRoaringData = {
  // Company Activity API
  companyActivity: {
    organizationNumber: "556500-2465",
    companyName: "Celestial Redovisning AB",
    description: "Redovisningstjänster och skatterådgivning för små och medelstora företag",
    sniCodes: [
      {
        code: "69.20",
        description: "Redovisning och bokföring, skatterådgivning"
      },
      {
        code: "70.22",
        description: "Konsultverksamhet avseende företags organisation"
      }
    ],
    secondaryNames: ["Celestial Accounting", "Celestial Bokföring"],
    registrationDate: "2015-03-15",
    status: "Active"
  },

  // Owner Structure API
  ownerStructure: {
    owners: [
      {
        name: "Anna Svensson",
        personalNumber: "19800515-****",
        ownershipPercent: 60.0,
        type: "Individual"
      },
      {
        name: "Erik Johansson",
        personalNumber: "19750822-****",
        ownershipPercent: 40.0,
        type: "Individual"
      }
    ],
    totalShares: 50000,
    shareCapital: 500000
  },

  // Beneficial Owner API
  beneficialOwner: {
    beneficialOwners: [
      {
        name: "Anna Svensson",
        personalNumber: "19800515-****",
        ownershipPercent: 60.0,
        controlType: "Direct ownership"
      }
    ],
    alternativeBeneficialOwners: [
      {
        name: "Erik Johansson",
        personalNumber: "19750822-****",
        role: "CEO and Board Member",
        reason: "Controlling influence through position"
      }
    ]
  },

  // Board Members API
  boardMembers: {
    board: [
      {
        name: "Anna Svensson",
        personalNumber: "19800515-****",
        role: "Styrelseordförande",
        appointedDate: "2015-03-15",
        status: "Active"
      },
      {
        name: "Erik Johansson",
        personalNumber: "19750822-****",
        role: "Styrelseledamot",
        appointedDate: "2015-03-15",
        status: "Active"
      },
      {
        name: "Maria Andersson",
        personalNumber: "19851201-****",
        role: "Styrelseledamot",
        appointedDate: "2020-06-10",
        status: "Active"
      }
    ],
    ceo: {
      name: "Erik Johansson",
      personalNumber: "19750822-****",
      appointedDate: "2015-03-15"
    },
    auditor: {
      name: "PwC Öhrlings AB",
      organizationNumber: "556029-6740",
      auditorType: "Registered firm"
    }
  },

  // Signatories API
  signatories: {
    signingRules: "Styrelsen",
    authorizedSignatories: [
      {
        name: "Anna Svensson",
        personalNumber: "19800515-****",
        signingRight: "Two to sign"
      },
      {
        name: "Erik Johansson",
        personalNumber: "19750822-****",
        signingRight: "Two to sign"
      }
    ],
    signingCombinations: [
      "Anna Svensson + Erik Johansson",
      "Anna Svensson + Maria Andersson",
      "Erik Johansson + Maria Andersson"
    ]
  },

  // Business Prohibition API
  businessProhibition: {
    records: [],
    status: {
      code: 0,
      text: "No business prohibitions found"
    }
  },

  // Company Engagements API (board assignments history)
  companyEngagements: {
    currentEngagements: 3,
    historicalEngagements: 7,
    engagements: [
      {
        companyName: "Celestial Redovisning AB",
        organizationNumber: "556500-2465",
        role: "Styrelseordförande",
        from: "2015-03-15",
        to: null,
        status: "Active"
      },
      {
        companyName: "Tech Startup AB",
        organizationNumber: "559123-4567",
        role: "Styrelseledamot",
        from: "2018-01-10",
        to: null,
        status: "Active"
      }
    ]
  },

  // Risk Indicators API
  riskIndicators: {
    overallRiskScore: 12,
    riskLevel: "Low",
    indicators: [
      {
        category: "Financial",
        score: 3,
        status: "Green"
      },
      {
        category: "Legal",
        score: 0,
        status: "Green"
      },
      {
        category: "Ownership",
        score: 2,
        status: "Green"
      },
      {
        category: "Business Activity",
        score: 7,
        status: "Yellow"
      }
    ],
    alerts: [
      {
        type: "Info",
        message: "Company has been active for less than 10 years",
        severity: "Low"
      }
    ]
  },

  // Company Rating API
  companyRating: {
    creditRating: "AAA",
    creditScore: 92,
    paymentRemarks: 0,
    creditLimit: 500000,
    ratingDate: "2024-12-01"
  },

  // Sanctions Lists API
  sanctionsList: {
    euSanctions: { found: false, matches: [] },
    unSanctions: { found: false, matches: [] },
    ofacSanctions: { found: false, matches: [] },
    ukSanctions: { found: false, matches: [] },
    status: {
      code: 0,
      text: "No sanctions found"
    }
  },

  // PEP API
  politicallyExposedPerson: {
    isPEP: false,
    matches: [],
    boardMemberChecks: [
      {
        name: "Anna Svensson",
        isPEP: false
      },
      {
        name: "Erik Johansson",
        isPEP: false
      },
      {
        name: "Maria Andersson",
        isPEP: false
      }
    ],
    status: {
      code: 0,
      text: "No PEP matches found"
    }
  },

  // AML Registry API
  amlRegistry: {
    found: false,
    status: {
      code: 0,
      text: "No entries in AML registry"
    }
  },

  // Legal Information API
  legalInformation: {
    courtCases: [],
    legalRemarks: 0,
    bankruptcies: 0,
    status: "Clean record"
  },

  // Property Information API
  propertyInformation: {
    properties: [
      {
        propertyId: "STOCKHOLM NORRMALM 1:234",
        address: "Kungsgatan 45, 111 56 Stockholm",
        taxAssessedValue: 8500000,
        ownershipPercent: 100,
        acquisitionDate: "2018-06-15"
      }
    ],
    totalTaxAssessedValue: 8500000
  },

  // Company Case Register API
  companyCaseRegister: {
    openCases: 0,
    closedCases: 3,
    cases: [
      {
        caseNumber: "12345-2015",
        caseType: "Bolagsbildning",
        status: "Closed",
        registrationDate: "2015-03-15",
        closedDate: "2015-03-20"
      },
      {
        caseNumber: "67890-2020",
        caseType: "Ändring av styrelse",
        status: "Closed",
        registrationDate: "2020-06-01",
        closedDate: "2020-06-15"
      }
    ]
  },

  // Financial Information API (simplified)
  financialInformation: {
    latestYear: 2023,
    currency: "SEK",
    revenue: 4500000,
    operatingProfit: 850000,
    profitAfterTax: 650000,
    totalAssets: 2100000,
    equity: 1200000,
    numberOfEmployees: 8,
    profitMargin: 18.9,
    equityRatio: 57.1,
    returnOnEquity: 54.2
  },

  // Company Establishments API
  establishments: [
    {
      establishmentNumber: "16000001",
      name: "Huvudkontor",
      address: {
        street: "Kungsgatan 45",
        postalCode: "111 56",
        city: "Stockholm"
      },
      numberOfEmployees: 8,
      establishmentType: "Head office"
    }
  ],

  // Share Facts API
  shareFacts: {
    shareCapital: 500000,
    numberOfShares: 50000,
    shareValue: 10,
    shareClasses: [
      {
        class: "A",
        shares: 50000,
        votesPerShare: 1
      }
    ],
    newIssues: []
  }
};

// Helper function to simulate API delay
export const simulateApiDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to get mock data with simulated delay
export const getMockRoaringData = async (endpoint) => {
  await simulateApiDelay(500);
  return mockRoaringData[endpoint];
};
