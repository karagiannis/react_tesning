/**
 * Window Manager Utility
 * 
 * Hanterar öppning av separata webbfönster för verifikationer och rapporter
 * enligt Fortnox-stil (fristående fönster med egen URL)
 */

/**
 * Öppnar verifikation i separat fönster
 * @param {string} voucherId - Verifikations-ID (t.ex. "A308")
 * @param {Object} options - Fönsterinställningar
 * @returns {Window} Referens till öppnat fönster
 */
export function openVoucherWindow(voucherId, options = {}) {
  const {
    width = 1400,
    height = 900,
    centered = true
  } = options;
  
  // Beräkna centrerad position
  const left = centered ? (screen.width - width) / 2 : 0;
  const top = centered ? (screen.height - height) / 2 : 0;
  
  const windowFeatures = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'resizable=yes',
    'scrollbars=yes',
    'status=yes',
    'menubar=no',
    'toolbar=no',
    'location=no'
  ].join(',');
  
  const url = `/voucher/${voucherId}`;
  const windowName = `Verifikation_${voucherId}`;
  
  return window.open(url, windowName, windowFeatures);
}

/**
 * Öppnar rapport i separat fönster
 * @param {string} reportType - Typ av rapport (balansrapport, resultatrapport, huvudbok, etc)
 * @param {string} fiscalYear - Räkenskapsår (t.ex. "2023-2024")
 * @param {Object} options - Fönsterinställningar
 * @returns {Window} Referens till öppnat fönster
 */
export function openReportWindow(reportType, fiscalYear, options = {}) {
  const {
    width = 1200,
    height = 1000,
    centered = true
  } = options;
  
  const left = centered ? (screen.width - width) / 2 : 0;
  const top = centered ? (screen.height - height) / 2 : 0;
  
  const windowFeatures = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'resizable=yes',
    'scrollbars=yes',
    'status=yes'
  ].join(',');
  
  const url = `/report/${reportType}?year=${encodeURIComponent(fiscalYear)}`;
  const windowName = `Rapport_${reportType}_${fiscalYear.replace(/[^0-9]/g, '')}`;
  
  return window.open(url, windowName, windowFeatures);
}

/**
 * Öppnar PDF-rapport i separat fönster
 * @param {string} pdfUrl - URL till PDF-filen
 * @param {string} title - Titel på rapporten
 * @param {Object} options - Fönsterinställningar
 * @returns {Window} Referens till öppnat fönster
 */
export function openPDFWindow(pdfUrl, title = 'Rapport', options = {}) {
  const {
    width = 1000,
    height = 1200,
    centered = true
  } = options;
  
  const left = centered ? (screen.width - width) / 2 : 0;
  const top = centered ? (screen.height - height) / 2 : 0;
  
  const windowFeatures = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'resizable=yes',
    'scrollbars=yes',
    'status=yes'
  ].join(',');
  
  const windowName = `PDF_${title.replace(/\s+/g, '_')}`;
  
  return window.open(pdfUrl, windowName, windowFeatures);
}

/**
 * Öppnar jämförelsevy i separat fönster (för moms/deklaration)
 * @param {string} comparisonType - Typ av jämförelse (vat, tax, annual)
 * @param {string} fiscalYear - Räkenskapsår
 * @param {Object} options - Fönsterinställningar
 * @returns {Window} Referens till öppnat fönster
 */
export function openComparisonWindow(comparisonType, fiscalYear, options = {}) {
  const {
    width = 1600,
    height = 1000,
    centered = true
  } = options;
  
  const left = centered ? (screen.width - width) / 2 : 0;
  const top = centered ? (screen.height - height) / 2 : 0;
  
  const windowFeatures = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'resizable=yes',
    'scrollbars=yes',
    'status=yes'
  ].join(',');
  
  const url = `/comparison/${comparisonType}?year=${encodeURIComponent(fiscalYear)}`;
  const windowName = `Comparison_${comparisonType}_${fiscalYear.replace(/[^0-9]/g, '')}`;
  
  return window.open(url, windowName, windowFeatures);
}

/**
 * Kontrollerar om popup-fönster är blockerade
 * @returns {boolean} True om popups är tillåtna
 */
export function checkPopupPermission() {
  const testWindow = window.open('', 'test', 'width=1,height=1');
  
  if (testWindow) {
    testWindow.close();
    return true;
  }
  
  return false;
}

/**
 * Visar meddelande om blockerade popups
 */
export function showPopupBlockedMessage() {
  alert(
    'Popup-fönster är blockerade i din webbläsare.\n\n' +
    'För att använda verifikationsvy i separata fönster:\n' +
    '1. Klicka på popup-ikonen i adressfältet\n' +
    '2. Tillåt popup-fönster för denna webbplats\n' +
    '3. Försök igen'
  );
}

/**
 * Öppnar fönster med popup-kontroll
 * @param {Function} openFunction - Funktion som öppnar fönstret
 * @returns {Window|null} Referens till öppnat fönster eller null om blockerat
 */
export function openWindowWithCheck(openFunction) {
  const newWindow = openFunction();
  
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    showPopupBlockedMessage();
    return null;
  }
  
  return newWindow;
}
