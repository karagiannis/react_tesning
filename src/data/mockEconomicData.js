/**
 * Mock-data för ekonomisk rådgivning (Slides 11-14)
 * Används innan djupgranskning av bokföringen
 * 
 * OBS: Data finns även i db.json för json-server, men definieras här direkt
 * för att undvika Vite-import-problem
 */

// Slide 11: Likviditetsdata (från bankkonto)
export const mockLiquidityData = {
  monthlyData: [
    { month: "Jan 2024", balance: 200000, deposits: 450000, withdrawals: 420000 },
    { month: "Feb 2024", balance: 230000, deposits: 480000, withdrawals: 450000 },
    { month: "Mar 2024", balance: 180000, deposits: 420000, withdrawals: 470000 },
    { month: "Apr 2024", balance: 250000, deposits: 520000, withdrawals: 450000 },
    { month: "Maj 2024", balance: 280000, deposits: 530000, withdrawals: 500000 },
    { month: "Jun 2024", balance: 260000, deposits: 490000, withdrawals: 510000 },
    { month: "Jul 2024", balance: 240000, deposits: 450000, withdrawals: 470000 },
    { month: "Aug 2024", balance: 270000, deposits: 510000, withdrawals: 480000 },
    { month: "Sep 2024", balance: 290000, deposits: 540000, withdrawals: 520000 },
    { month: "Okt 2024", balance: 310000, deposits: 560000, withdrawals: 540000 },
    { month: "Nov 2024", balance: 320000, deposits: 570000, withdrawals: 560000 },
    { month: "Dec 2024", balance: 320000, deposits: 550000, withdrawals: 550000 }
  ],
  summary: {
    currentBalance: 320000,
    averageBalance: 250000,
    trend: "Positiv",
    trendPercentage: 28,
    highestBalance: 320000,
    lowestBalance: 180000
  },
  aiAnalysis: {
    layeringDetected: false,
    unusualTransactions: [
      {
        date: "2024-03-15",
        amount: 850000,
        type: "deposit",
        description: "Ovanligt stor insättning",
        severity: "warning"
      },
      {
        date: "2024-09-22",
        amount: 920000,
        type: "deposit",
        description: "Ovanligt stor insättning",
        severity: "warning"
      }
    ],
    normalTransactionSizes: true,
    flags: {
      layering: false,
      structuring: false,
      rapidMovement: false
    }
  },
  recommendations: [
    "Likviditetsutvecklingen är positiv och stabil.",
    "De två större insättningarna bör verifieras mot fakturor/kontrakt.",
    "Fortsätt med nuvarande kassaflödeshantering."
  ]
};

// Slide 12: Omsättningsdata (från SIE-filer)
export const mockRevenueData = {
  yearlyData: [
    { year: "2020", revenue: 1500000, growth: null },
    { year: "2021", revenue: 2000000, growth: 33.3 },
    { year: "2022", revenue: 2400000, growth: 20.0 },
    { year: "2023", revenue: 2800000, growth: 16.7 },
    { year: "2024", revenue: 3200000, growth: 14.3 }
  ],
  summary: {
    currentYearRevenue: 3200000,
    previousYearRevenue: 2800000,
    yoyGrowth: 14.3,
    cagr5Years: 16.4,
    totalGrowth5Years: 113.3
  },
  analysis: {
    trend: "Stabil tillväxt",
    flags: [],
    notes: [
      "Konsekvent tillväxt varje år",
      "Inga ovanliga hopp i omsättning",
      "Tillväxttakten avtar något (naturligt för mogna företag)"
    ]
  },
  industryAverage: {
    revenue: 2500000,
    growth: 8.5
  }
};

// Slide 13: Resultatdata (från balansrapporter)
export const mockProfitData = {
  yearlyData: [
    {
      year: "2020",
      result: 120000,
      revenue: 1500000,
      operatingMargin: 8.0,
      netMargin: 6.5
    },
    {
      year: "2021",
      result: 150000,
      revenue: 2000000,
      operatingMargin: 8.5,
      netMargin: 7.0
    },
    {
      year: "2022",
      result: 100000,
      revenue: 2400000,
      operatingMargin: 5.5,
      netMargin: 4.2
    },
    {
      year: "2023",
      result: 180000,
      revenue: 2800000,
      operatingMargin: 7.5,
      netMargin: 6.4
    },
    {
      year: "2024",
      result: 250000,
      revenue: 3200000,
      operatingMargin: 9.2,
      netMargin: 7.8
    }
  ],
  summary: {
    currentYearProfit: 250000,
    previousYearProfit: 180000,
    yoyGrowth: 38.9,
    operatingMargin: 7.8,
    trend: "Förbättras"
  },
  analysis: {
    profitability: "God",
    flags: [],
    notes: [
      "Positiva resultat alla år",
      "2022 hade lägre resultat (troligen högre kostnader eller investeringar)",
      "Stark återhämtning 2023-2024 med förbättrad marginaler"
    ]
  },
  costStructure: {
    personnelCosts: 0.45,
    materialCosts: 0.25,
    overheadCosts: 0.15,
    depreciation: 0.05,
    otherCosts: 0.02
  }
};

// Slide 14: Branschjämförelse (från SCB-statistik)
export const mockIndustryComparison = {
  sniCode: "62010",
  industryName: "Dataprogrammering",
  metrics: [
    {
      name: "Rörelsemarginal",
      companyValue: 7.8,
      industryAverage: 8.5
    },
    {
      name: "Nettomarginal",
      companyValue: 7.8,
      industryAverage: 6.5
    },
    {
      name: "Soliditet",
      companyValue: 42,
      industryAverage: 35
    },
    {
      name: "Likviditet",
      companyValue: 1.8,
      industryAverage: 1.5
    },
    {
      name: "Kassalikviditet",
      companyValue: 1.8,
      industryAverage: 1.5
    },
    {
      name: "Skuldsättningsgrad",
      companyValue: 1.4,
      industryAverage: 1.9
    },
    {
      name: "Omsättning",
      companyValue: 3200000,
      industryAverage: 2500000
    }
  ],
  percentilePosition: 68,
  strengths: [
    "Stark soliditet och kassalikviditet ger god finansiell stabilitet",
    "Låg skuldsättning minskar finansiell risk",
    "Hög produktivitet (omsättning/anställd)",
    "God räntabilitet på eget kapital",
    "Effektiv personalkostnadshantering"
  ],
  improvements: [
    "Rörelsemarginalen kan förbättras genom kostnadsoptimering",
    "Analysera varför marginalen ligger något under branschsnittet",
    "Överväg prisoptimering eller effektivisering"
  ]
};

// Exportera allt som en samling
export const mockEconomicData = {
  liquidity: mockLiquidityData,
  revenue: mockRevenueData,
  profit: mockProfitData,
  industry: mockIndustryComparison,
};

export default mockEconomicData;
