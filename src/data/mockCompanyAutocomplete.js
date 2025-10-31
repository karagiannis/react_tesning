/**
 * Mock-data för företagsautocomplete
 * 
 * Simulerar data som servern hämtat från Bolagsverkets "värdefulla datamängder"
 * och lagrat lokalt på serverns hårddisk för snabb autocomplete.
 * 
 * I produktion: GET /api/companies/search?q={query}
 * Returnerar max 10 träffar sorterade på relevans
 */

export const mockCompanies = [
  {
    id: 1,
    name: "Redovisningsbyrån Stockholm AB",
    orgNr: "556123-4567",
    stad: "Stockholm",
    lan: "Stockholms län"
  },
  {
    id: 2,
    name: "Nordiska Byggentreprenader AB",
    orgNr: "556234-5678",
    stad: "Göteborg",
    lan: "Västra Götalands län"
  },
  {
    id: 3,
    name: "Tech Innovation Sweden AB",
    orgNr: "556345-6789",
    stad: "Stockholm",
    lan: "Stockholms län"
  },
  {
    id: 4,
    name: "Malmö Handelshus AB",
    orgNr: "556456-7890",
    stad: "Malmö",
    lan: "Skåne län"
  },
  {
    id: 5,
    name: "Uppsala Konsult & Revision AB",
    orgNr: "556567-8901",
    stad: "Uppsala",
    lan: "Uppsala län"
  },
  {
    id: 6,
    name: "Västkusten Logistik AB",
    orgNr: "556678-9012",
    stad: "Göteborg",
    lan: "Västra Götalands län"
  },
  {
    id: 7,
    name: "Norrlands Skogsbruk AB",
    orgNr: "556789-0123",
    stad: "Umeå",
    lan: "Västerbottens län"
  },
  {
    id: 8,
    name: "Stockholm Design Studio AB",
    orgNr: "556890-1234",
    stad: "Stockholm",
    lan: "Stockholms län"
  },
  {
    id: 9,
    name: "Växjö Tillverkning AB",
    orgNr: "556901-2345",
    stad: "Växjö",
    lan: "Kronobergs län"
  },
  {
    id: 10,
    name: "Linköping Tech Solutions AB",
    orgNr: "556012-3456",
    stad: "Linköping",
    lan: "Östergötlands län"
  },
  {
    id: 11,
    name: "Redovisning & Rådgivning i Lund AB",
    orgNr: "556123-9999",
    stad: "Lund",
    lan: "Skåne län"
  },
  {
    id: 12,
    name: "Nordic Food Import AB",
    orgNr: "556234-8888",
    stad: "Stockholm",
    lan: "Stockholms län"
  },
  {
    id: 13,
    name: "Byggmästaren i Örebro AB",
    orgNr: "556345-7777",
    stad: "Örebro",
    lan: "Örebro län"
  },
  {
    id: 14,
    name: "Redovisningskonsult Syd AB",
    orgNr: "556456-6666",
    stad: "Helsingborg",
    lan: "Skåne län"
  },
  {
    id: 15,
    name: "Tech Startup Stockholm AB",
    orgNr: "556567-5555",
    stad: "Stockholm",
    lan: "Stockholms län"
  }
];

/**
 * Simulerar server-endpoint för autocomplete
 * I produktion: Servern söker i lokal databas (nedladdad från Bolagsverket)
 * 
 * @param {string} query - Sökfråga från användaren
 * @returns {Array} Max 10 företag som matchar sökningen
 */
export const searchCompanies = (query) => {
  if (!query || query.length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  // Filtrera och sortera resultat
  const results = mockCompanies
    .filter(company => 
      company.name.toLowerCase().includes(normalizedQuery) ||
      company.orgNr.includes(normalizedQuery) ||
      company.stad.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 10); // Max 10 resultat för autocomplete

  return results;
};

/**
 * Hämtar fullständig företagsinformation baserat på organisationsnummer
 * I produktion: GET /api/companies/{orgNr}
 * 
 * @param {string} orgNr - Organisationsnummer
 * @returns {Object|null} Företagsinformation
 */
export const getCompanyByOrgNr = (orgNr) => {
  return mockCompanies.find(c => c.orgNr === orgNr) || null;
};
