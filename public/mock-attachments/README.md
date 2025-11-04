# Mock Attachments för Bokföringsanalys

## Katalogstruktur

Lägg dina fejkfakturor och kvitton från bokföringsövningar här:

```
mock-attachments/
├── faktura_konsult_acme_850000.pdf
├── kvitto_kontant_45000.jpg
├── faktura_motorcykeldack_michelin_5200.pdf
├── faktura_motorcykeldack_pirelli_4890.pdf
├── faktura_kontorsmaterial_staples_1234.pdf
├── faktura_frakt_dhl_850.pdf
├── faktura_webhotell_loopia_299.pdf
├── samlingsfaktura_q4_leverantor_a.pdf
├── README.md (denna fil)
└── thumbnails/
    ├── faktura_konsult_acme_850000.jpg (150x200px)
    ├── kvitto_kontant_45000.jpg (150x200px)
    └── ... (thumbnails för övriga filer)
```

## Filnamnskonvention

Använd följande format för bästa kompatibilitet:

- **Fakturor**: `faktura_<beskrivning>_<leverantör>_<belopp>.pdf`
- **Kvitton**: `kvitto_<beskrivning>_<belopp>.jpg` eller `.png`
- **Samlingsfakturor**: `samlingsfaktura_<period>_<leverantör>.pdf`

Exempel:
- `faktura_konsult_acme_850000.pdf`
- `faktura_motorcykeldack_michelin_5200.pdf`
- `kvitto_kontant_lunch_450.jpg`

## Generera Thumbnails

### Alternativ 1: ImageMagick (kommandorad)

```bash
cd public/mock-attachments
for file in *.pdf; do
  convert "$file[0]" -thumbnail 150x200 "thumbnails/${file%.pdf}.jpg"
done

for file in *.{jpg,png}; do
  convert "$file" -thumbnail 150x200 "thumbnails/$file"
done
```

### Alternativ 2: Online-verktyg

- https://www.ilovepdf.com/pdf_to_jpg
- https://www.iloveimg.com/resize-image

Ladda upp PDF:er, konvertera till JPG, ändra storlek till 150x200px.

### Alternativ 3: Python-script

```python
from pdf2image import convert_from_path
from PIL import Image

def create_thumbnail(pdf_path, output_path):
    images = convert_from_path(pdf_path, first_page=1, last_page=1)
    thumbnail = images[0].resize((150, 200))
    thumbnail.save(output_path, 'JPEG')

# Exempel:
create_thumbnail('faktura_konsult_acme_850000.pdf', 
                 'thumbnails/faktura_konsult_acme_850000.jpg')
```

## OCR-Data (valfritt)

Om du vill extrahera OCR-data automatiskt, installera Tesseract.js:

```bash
npm install tesseract.js
```

Exempel på OCR-användning:

```javascript
import Tesseract from 'tesseract.js';

async function extractOCRData(imageUrl) {
  const { data: { text } } = await Tesseract.recognize(imageUrl, 'swe');
  
  // Extrahera belopp (regex)
  const amountMatch = text.match(/(\d[\s\d]*[,.]?\d{2})\s*kr/i);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/\s/g, '').replace(',', '.')) : null;
  
  // Extrahera leverantör (första raden ofta)
  const supplierMatch = text.match(/^(.+?)$/m);
  const supplier = supplierMatch ? supplierMatch[1].trim() : null;
  
  return { amount, supplier, rawText: text };
}
```

## Verifikationer som behöver underlag

Enligt `mockVoucherAttachments.js`:

- **A1**: `faktura_konsult_acme_850000.pdf` (1 fil)
- **A2**: `kvitto_kontant_45000.jpg` (1 fil)
- **A308**: 49 dokument (2 motorcykeldäck + 47 legitima fakturor)
  - `faktura_motorcykeldack_michelin_5200.pdf`
  - `faktura_motorcykeldack_pirelli_4890.pdf`
  - `faktura_kontorsmaterial_staples_1234.pdf`
  - `faktura_frakt_dhl_850.pdf`
  - `faktura_webhotell_loopia_299.pdf`
  - ... (44 ytterligare fakturor)
- **B156**: `samlingsfaktura_q4_leverantor_a.pdf` (1 fil, 23 affärshändelser)

## Tips

1. **Realistiska belopp**: Använd belopp från dina verkliga bokföringsövningar
2. **Blandade format**: Inkludera både PDF och JPG för variation
3. **Olika kvalitet**: Ha några låg-kvalitets skanningar (70% OCR-confidence)
4. **Metadata**: Om du har EXIF-data (datum, kamera) kan du bevara den för realism

## Test

När du lagt till filer, testa i webbläsaren:

```
http://localhost:5173/accounting-analysis
```

Klicka på verifikation A308 → Öppnas i separat fönster → Klicka "Underlag" → Se bifogade dokument.
