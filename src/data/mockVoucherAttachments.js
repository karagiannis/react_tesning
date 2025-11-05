/**
 * Mock Bokföringsunderlag - Attachments för verifikationer
 * 
 * Använder riktiga PDF:er från övningsunderlag (kursböcker):
 * - Mandolin: 14 PDFs (1.pdf - 14.pdf)
 * - Noas_Nävertråd: 68 PDFs (Scanned Document.pdf - Scanned Document68.pdf)
 * 
 * Placerade i: public/ovningsunderlag/
 */

export const mockVoucherAttachments = {
  // Verifikation A1: Hög konsultkostnad (850 000 kr)
  A1: [
    {
      id: 1,
      filename: '1.pdf',
      displayName: 'Konsultfaktura - 850 000 kr',
      type: 'application/pdf',
      size: 245600,
      uploadDate: '2024-01-15',
      ocrAmount: 850000,
      ocrSupplier: 'Acme Consulting AB',
      ocrInvoiceNumber: 'F-2024-001',
      matchConfidence: 0.99,
      flagged: false,
      previewUrl: '/ovningsunderlag/Mandolin/1.pdf',
      thumbnailUrl: null
    }
  ],

  // Verifikation A2: Kontantuttag utan kvitto (45 000 kr)
  A2: [
    {
      id: 2,
      filename: '2.pdf',
      displayName: 'Kontantkvitto - 45 000 kr',
      type: 'application/pdf',
      size: 145000,
      uploadDate: '2024-03-22',
      ocrAmount: 45000,
      ocrSupplier: 'Kontantkvitto',
      ocrInvoiceNumber: null,
      matchConfidence: 0.65, // Låg confidence - dålig kvalitet
      flagged: true,
      flagReason: 'Låg OCR-kvalitet, original kvitto saknas',
      previewUrl: '/ovningsunderlag/Mandolin/2.pdf',
      thumbnailUrl: null
    }
  ],

  // Verifikation A308: Diverse kontorskostnader
  A308: [
    {
      id: 1,
      filename: 'Scanned Document3.pdf',
      displayName: 'Kontorsmaterial - 2 340 kr',
      type: 'application/pdf',
      size: 156000,
      uploadDate: '2025-01-15',
      ocrAmount: 2340,
      ocrSupplier: 'Staples Sverige AB',
      ocrInvoiceNumber: 'ST-2025-1234',
      matchConfidence: 0.97,
      flagged: false,
      previewUrl: '/ovningsunderlag/Noas_Nävertråd/Scanned Document3.pdf',
      thumbnailUrl: null
    }
  ],

  // Verifikation B123: FRAUD EXAMPLE - Balkostymer misstänks (2 flaggade + 47 legitima = 49 totalt)
  B123: [
    // FLAGGADE: Balkostym och balklänning (privata inköp)
    {
      id: 1,
      filename: 'Scanned Document.pdf',
      displayName: 'Balkostym - 5 200 kr',
      type: 'application/pdf',
      size: 234000,
      uploadDate: '2025-03-02',
      ocrAmount: 5200,
      ocrSupplier: 'Dressman AB',
      ocrInvoiceNumber: 'DM-2025-045',
      matchConfidence: 0.95,
      flagged: true,
      flagReason: 'Privat inköp misstänks (festkläder)',
      previewUrl: '/ovningsunderlag/Noas_Nävertråd/Scanned Document.pdf',
      thumbnailUrl: null
    },
    {
      id: 2,
      filename: 'Scanned Document2.pdf',
      displayName: 'Balklänning - 4 890 kr',
      type: 'application/pdf',
      size: 198000,
      uploadDate: '2025-03-08',
      ocrAmount: 4890,
      ocrSupplier: 'Nelly Mode AB',
      ocrInvoiceNumber: 'NM-789456',
      matchConfidence: 0.93,
      flagged: true,
      flagReason: 'Privat inköp misstänks (festkläder)',
      previewUrl: '/ovningsunderlag/Noas_Nävertråd/Scanned Document2.pdf',
      thumbnailUrl: null
    },
    // LEGITIMA FAKTUROR (47 st - genereras programmatiskt)
    ...Array.from({ length: 47 }, (_, i) => ({
      id: 3 + i,
      filename: `Scanned Document${3 + i}.pdf`,
      displayName: `Faktura #${3 + i} - Legitimt underlag`,
      type: 'application/pdf',
      size: 150000 + Math.floor(Math.random() * 50000),
      uploadDate: '2025-01-01',
      ocrAmount: 1000 + Math.floor(Math.random() * 5000),
      ocrSupplier: `Leverantör ${String.fromCharCode(65 + (i % 26))}`, // A-Z rotation
      ocrInvoiceNumber: `INV-2025-${String(1000 + i).padStart(4, '0')}`,
      matchConfidence: 0.85 + Math.random() * 0.14, // 0.85-0.99
      flagged: false,
      previewUrl: `/ovningsunderlag/Noas_Nävertråd/Scanned Document${3 + i}.pdf`,
      thumbnailUrl: null
    }))
  ],

  // Verifikation B156: Samlingsfaktura med många dokument
  B156: [
    {
      id: 20,
      filename: '3.pdf',
      displayName: 'Samlingsfaktura Q4 - 23 affärshändelser',
      type: 'application/pdf',
      size: 345000,
      uploadDate: '2024-11-20',
      ocrAmount: 125400,
      ocrSupplier: 'Diverse leverantörer',
      ocrInvoiceNumber: 'SAMLING-Q4-2024',
      matchConfidence: 0.78, // Låg confidence pga många leverantörer
      flagged: true,
      flagReason: '23 affärshändelser aggregerade, bryter mot BFL 4 kap. 2§',
      previewUrl: '/ovningsunderlag/Mandolin/3.pdf',
      thumbnailUrl: null
    }
  ],
  
  // Verifikation C999: TESTPOST med många rader (scrolltest)
  C999: [
    {
      id: 1,
      filename: '4.pdf',
      displayName: 'Månadssammanställning Q1 - 567 890 kr',
      type: 'application/pdf',
      size: 456000,
      uploadDate: '2025-01-31',
      ocrAmount: 567890,
      ocrSupplier: 'Diverse leverantörer',
      ocrInvoiceNumber: 'SAMMANSTÄLLNING-Q1-2025',
      matchConfidence: 0.82,
      flagged: false,
      previewUrl: '/ovningsunderlag/Mandolin/4.pdf',
      thumbnailUrl: null
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
