/**
 * handleSidebarLock
 * Avgör om en slide ska vara låst i sidebar
 *
 * LOGIK:
 * 1. Alla slides är tillgängliga som standard
 * 2. FÖRETAGSDATA-slides (Verksamhet, Ägarstruktur, Styrelse, Övriga data) kräver betalning
 *    - Dessa låses upp när subscription.payment_confirmed_at finns
 *
 * FÖRKLARING:
 * Backend ansvarar för att hämta Roaring-data efter betalning och spara till metadata.json
 * under rätt slide-keys (verksamhet, agarstruktur, styrelse, ovriga-data).
 * Frontend behandlar dessa slides exakt som alla andra - via formData['slideKey'].
 * 
 * Sidebar-låsen baseras på BETALNINGSSTATUS, inte på om data finns.
 */
export const createHandleSidebarLock = ({ isPaymentConfirmed }) => {
  return (slideKey) => {
    // ─────────────────────────────────────────────────────────────────────
    // 🔒 FÖRETAGSDATA-SLIDES: Kräver bekräftad betalning
    // ─────────────────────────────────────────────────────────────────────
    const PAYMENT_REQUIRED_SLIDES = ['verksamhet', 'agarstruktur', 'styrelse', 'ovriga-data'];

    if (PAYMENT_REQUIRED_SLIDES.includes(slideKey)) {
      // Om betalning INTE är bekräftad → LÅST
      return !isPaymentConfirmed;
    }

    // Alla andra slides är ALLTID tillgängliga
    return false;
  };
};
