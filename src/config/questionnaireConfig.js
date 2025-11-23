/**
 * CREATED: 2025-11-23
 * PURPOSE: Centralized questionnaire configuration for all onboarding slides
 * BENEFITS: Generic form handling, i18n-ready, maintainable
 * REF: CHANGELOG_2025-11-23.md - Problem 5
 */

export const QUESTIONNAIRE_CONFIG = {
  riskfragor_steg2: {
    slideTitle: "Riskfrågor - Steg 2",
    slideDescription: "Ytterligare frågor för riskbedömning",
    questions: {
      q5: {
        id: "q5",
        text: "Har företaget kunder i högriskländer?",
        helpText: "Länder med hög risk för penningtvätt enligt FATF (Financial Action Task Force)",
        type: "single-choice",
        options: [
          { value: "ja_regelbundet", label: "Ja, regelbundet", hasExpansion: false },
          { value: "ja_ibland", label: "Ja, ibland", hasExpansion: false },
          { value: "nej", label: "Nej", hasExpansion: false }
        ],
        required: true,
        expansionConfig: null
      },
      q6: {
        id: "q6",
        text: "Förekommer överföringar till/från utländska bankkonton?",
        helpText: "Transaktioner med bankkonton utanför Sverige",
        type: "single-choice",
        options: [
          { 
            value: "ja_regelbundet", 
            label: "Ja, regelbundet", 
            hasExpansion: true,
            expansionConfig: {
              type: "multi-select",
              key: "lander",
              label: "Vilka länder förekommer?",
              placeholder: "Välj ett eller flera länder",
              options: [
                "USA",
                "Storbritannien", 
                "Tyskland",
                "Norge",
                "Danmark",
                "Finland",
                "Frankrike",
                "Spanien",
                "Italien",
                "Polen",
                "Kina",
                "Indien",
                "Annat"
              ],
              required: true
            }
          },
          { 
            value: "ja_ibland", 
            label: "Ja, ibland", 
            hasExpansion: true,
            expansionConfig: {
              type: "multi-select",
              key: "lander",
              label: "Vilka länder förekommer?",
              placeholder: "Välj ett eller flera länder",
              options: [
                "USA",
                "Storbritannien",
                "Tyskland",
                "Norge",
                "Danmark",
                "Finland",
                "Frankrike",
                "Spanien",
                "Italien",
                "Polen",
                "Kina",
                "Indien",
                "Annat"
              ],
              required: true
            }
          },
          { value: "nej", label: "Nej", hasExpansion: false }
        ],
        required: true
      },
      q7: {
        id: "q7",
        text: "Hanterar företaget kontanta betalningar över 50 000 kr?",
        helpText: "Enligt penningtvättslagen måste företag rapportera kontanttransaktioner över detta belopp",
        type: "single-choice",
        options: [
          { value: "ja", label: "Ja", hasExpansion: false },
          { value: "nej", label: "Nej", hasExpansion: false }
        ],
        required: true,
        expansionConfig: null
      }
    },
    slideOrder: ["q5", "q6", "q7"]
  },
  
  // TODO: Add other slides (riskfragor_steg1, riskfragor_steg3, uppdragsval, etc.)
  // Template for simple slides without expansion:
  /*
  uppdragsval: {
    slideTitle: "Välj uppdrag",
    slideDescription: "Välj de tjänster du vill ha",
    questions: {
      q1: {
        id: "q1",
        text: "Bokföring",
        helpText: "Löpande bokföring av företagets transaktioner",
        type: "checkbox",
        options: [
          { value: "bokforing", label: "Bokföring", hasExpansion: false }
        ],
        required: false
      },
      // ... more services
    },
    slideOrder: ["q1", "q2", "q3"]
  }
  */
};

export default QUESTIONNAIRE_CONFIG;
