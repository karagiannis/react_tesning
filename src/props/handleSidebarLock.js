/**
 * handleSidebarLock
 * Avgör om en slide ska vara låst i sidebar
 *
 * LOGIK:
 * 1. Alla slides är tillgängliga
 * 2. ENDAST FÖRETAGSDATA-slides är låsta - dessa kräver roaringData
 *    (användaren måste ha betalat för extern API-anrop till Skatteverket/Bolagsverket)
 *
 * FÖRKLARING:
 * Tidigare var slides låsta tills föregående slide var klar. Detta ändrades
 * för att ge användaren frihet att hoppa mellan sektioner. Bara extern data
 * (som kostar pengar att hämta) kräver betalning först.
 */
export const createHandleSidebarLock = ({ roaringData }) => {
  return (slideKey) => {
    // ─────────────────────────────────────────────────────────────────────
    // 🔒 ENDAST FÖRETAGSDATA-SLIDES: Kräver roaringData (betalat API-anrop)
    // ─────────────────────────────────────────────────────────────────────
    const ROARING_DEPENDENT_SLIDES = ['verksamhet', 'agarstruktur', 'styrelse', 'ovriga-data'];

    if (ROARING_DEPENDENT_SLIDES.includes(slideKey)) {
      // Om roaringData saknas → LÅST
      return !roaringData;
    }

    // Alla andra slides är ALLTID tillgängliga
    return false;
  };
};
