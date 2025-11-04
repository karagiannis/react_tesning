/**
 * Mock Bokföringsunderlag - Attachments för verifikationer
 * 
 * Strukturera dina fejkfakturor enligt följande:
 * public/mock-attachments/
 *   ├── faktura_konsult_2024.pdf
 *   ├── kvitto_kontant_mars.jpg
 *   ├── faktura_motorcykeldack_michelin.pdf
 *   └── thumbnails/
 *       ├── faktura_konsult_2024.jpg (preview)
 *       └── ...
 */

export const mockVoucherAttachments = {
  // Verifikation A1: Hög konsultkostnad
  A1: [
    {
      id: 1,
      filename: 'faktura_konsult_acme_850000.pdf',
      type: 'application/pdf',
      size: 245600,
      uploadDate: '2024-01-15',
      ocrAmount: 850000,
      ocrSupplier: 'Acme Consulting AB',
      ocrInvoiceNumber: 'F-2024-001',
      matchConfidence: 0.99,
      flagged: false,
      previewUrl: '/mock-attachments/faktura_konsult_acme_850000.pdf',
      thumbnailUrl: '/mock-attachments/thumbnails/faktura_konsult_acme_850000.jpg'
    }
  ],

  // Verifikation A2: Kontantuttag utan kvitto
  A2: [
    {
      id: 2,
      filename: 'kvitto_kontant_45000.jpg',
      type: 'image/jpeg',
      size: 145000,
      uploadDate: '2024-03-22',
      ocrAmount: 45000,
      ocrSupplier: 'Kontantkvitto',
      ocrInvoiceNumber: null,
      matchConfidence: 0.65, // Låg confidence - dålig kvalitet
      flagged: true,
      flagReason: 'Låg OCR-kvalitet, original kvitto saknas',
      previewUrl: '/mock-attachments/kvitto_kontant_45000.jpg',
      thumbnailUrl: '/mock-attachments/thumbnails/kvitto_kontant_45000.jpg'
    }
  ],

  // Verifikation A308: FRAUD EXAMPLE - Motorcykeldäck + 47 legitima fakturor
  A308: [
    {
      id: 10,
      filename: 'faktura_motorcykeldack_michelin_5200.pdf',
      type: 'application/pdf',
      size: 234000,
      uploadDate: '2025-03-02',
      ocrAmount: 5200,
      ocrSupplier: 'MC-Däck Sverige AB',
      ocrInvoiceNumber: 'MC-2025-045',
      matchConfidence: 0.95,
      flagged: true,
      flagReason: 'Privat inköp misstänks (motorcykeldäck)',
      previewUrl: '/mock-attachments/faktura_motorcykeldack_michelin.pdf',
      thumbnailUrl: '/mock-attachments/thumbnails/faktura_motorcykeldack_michelin.jpg'
    },
    {
      id: 11,
      filename: 'faktura_motorcykeldack_pirelli_4890.pdf',
      type: 'application/pdf',
      size: 198000,
      uploadDate: '2025-03-08',
      ocrAmount: 4890,
      ocrSupplier: 'Däckia AB',
      ocrInvoiceNumber: 'D-789456',
      matchConfidence: 0.93,
      flagged: true,
      flagReason: 'Privat inköp misstänks (motorcykeldäck)',
      previewUrl: '/mock-attachments/faktura_motorcykeldack_pirelli.pdf',
      thumbnailUrl: '/mock-attachments/thumbnails/faktura_motorcykeldack_pirelli.jpg'
    },
    // Legitima fakturor (exempel 3 av 47)
    {
      id: 12,
      filename: 'faktura_kontorsmaterial_staples_2340.pdf',
      type: 'application/pdf',
      size: 156000,
      uploadDate: '2025-01-15',
      ocrAmount: 2340,
      ocrSupplier: 'Staples Sverige AB',
      ocrInvoiceNumber: 'ST-2025-1234',
      matchConfidence: 0.97,
      flagged: false,
      previewUrl: '/mock-attachments/faktura_kontorsmaterial_staples.pdf',
      thumbnailUrl: '/mock-attachments/thumbnails/faktura_kontorsmaterial_staples.jpg'
    },
    {
      id: 13,
      filename: 'faktura_frakt_dhl_890.pdf',
      type: 'application/pdf',
      size: 89000,
      uploadDate: '2025-02-10',
      ocrAmount: 890,
      ocrSupplier: 'DHL Express',
      ocrInvoiceNumber: 'DHL-20250210-45678',
      matchConfidence: 0.99,
      flagged: false,
      previewUrl: '/mock-attachments/faktura_frakt_dhl.pdf',
      thumbnailUrl: '/mock-attachments/thumbnails/faktura_frakt_dhl.jpg'
    },
    {
      id: 14,
      filename: 'faktura_webhosting_loopia_1200.pdf',
      type: 'application/pdf',
      size: 123000,
      uploadDate: '2025-03-01',
      ocrAmount: 1200,
      ocrSupplier: 'Loopia AB',
      ocrInvoiceNumber: 'LP-2025-03-001',
      matchConfidence: 0.98,
      flagged: false,
      previewUrl: '/mock-attachments/faktura_webhosting_loopia.pdf',
      thumbnailUrl: '/mock-attachments/thumbnails/faktura_webhosting_loopia.jpg'
    }
    // ... + 44 additional legitimate invoices (totalt 49)
  ],

  // Verifikation B156: Samlingsfaktura med många dokument
  B156: [
    {
      id: 20,
      filename: 'samlingsfaktura_q4_leverantor_a.pdf',
      type: 'application/pdf',
      size: 345000,
      uploadDate: '2024-11-20',
      ocrAmount: 125400,
      ocrSupplier: 'Diverse leverantörer',
      ocrInvoiceNumber: 'SAMLING-Q4-2024',
      matchConfidence: 0.78, // Låg confidence pga många leverantörer
      flagged: true,
      flagReason: '23 affärshändelser aggregerade, bryter mot BFL 4 kap. 2§',
      previewUrl: '/mock-attachments/samlingsfaktura_q4.pdf',
      thumbnailUrl: '/mock-attachments/thumbnails/samlingsfaktura_q4.jpg'
    }
  ]
};

/**
 * Helper: Hämta underlag för en specifik verifikation
 */
export function getAttachmentsForVoucher(voucherId) {
  return mockVoucherAttachments[voucherId] || [];
}

/**
 * Helper: Räkna flaggade dokument
 */
export function countFlaggedAttachments(voucherId) {
  const attachments = getAttachmentsForVoucher(voucherId);
  return attachments.filter(att => att.flagged).length;
}

/**
 * Helper: Beräkna total OCR-summa för verifikation
 */
export function calculateTotalOCRAmount(voucherId) {
  const attachments = getAttachmentsForVoucher(voucherId);
  return attachments.reduce((sum, att) => sum + att.ocrAmount, 0);
}

/**
 * Mock PDF-generator (senare ersätts med riktig backend)
 */
export function generateMockPDF(voucherId) {
  // I produktion: POST /api/voucher/${voucherId}/pdf
  // För mock: returnera placeholder URL
  return `/mock-pdfs/verifikation_${voucherId}.pdf`;
}

/**
 * INSTRUKTIONER FÖR ATT LÄGGA TILL RIKTIGA FAKTUROR:
 * 
 * 1. Placera dina fejkfakturor i: 
 *    public/mock-attachments/
 * 
 * 2. Generera thumbnails (150x200px):
 *    public/mock-attachments/thumbnails/
 * 
 * 3. Uppdatera filnamn i previewUrl/thumbnailUrl ovan
 * 
 * 4. För OCR-data: antingen manuellt eller kör genom tesseract.js:
 *    npm install tesseract.js
 *    
 *    import Tesseract from 'tesseract.js';
 *    Tesseract.recognize(imageFile, 'swe').then(result => {
 *      console.log(result.data.text);
 *    });
 */
