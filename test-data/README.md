# Test Data - Övningsunderlag & Mock Attachments

Detta är **TEST-DATA** som **INTE deployeras** till produktion.

## 📂 Struktur

```
test-data/
├── ovningsunderlag/           # Mock bokföringsunderlag (PDF-filer)
│   ├── Noas_Nävertråd/        # 68 skannade dokument
│   └── Mandolin/              # 14 fakturor
│
└── mock-attachments/          # Mock attachments för demo
    └── thumbnails/
```

---

## 🎯 Syfte

### 1. **Lokal testning**
Ladda upp via browser för att testa:
- Bokföringsunderlag-slide
- PDF preview
- Multi-file upload
- Thumbnail generation

### 2. **Verifikationslista-mapping**
Vissa bokföringsposter ska ha **flera** underlag:
- Faktura på flera sidor → `Document1.pdf`, `Document2.pdf`, `Document3.pdf`
- Kompletterande kommentarer → `Document_comment.pdf`

**Exempel:**
```json
{
  "vernr": "A123",
  "bokföringsunderlag": [
    "Scanned Document10.pdf",
    "Scanned Document11.pdf",
    "Scanned Document12.pdf"  // Faktura 3 sidor + kommentar
  ]
}
```

### 3. **Cloud storage upload**
Dessa filer ska laddas upp till:
- **OneDrive** (test-konto)
- **Google Drive** (test-konto)
- **Dropbox** (test-konto)

För att simulera klient som delar rotmapp via cloud-länk.

---

## ⚠️ Viktigt

### Deployment
- **INTE i `public/`** → Detta skulle kopiera allt till `dist/` (45+ MB)
- **ENDAST i `test-data/`** → Exkluderad från production build
- **Rsync skippar denna mapp** → Snabbare deployment (6 KB vs 400+ KB)

### Användning i kod
Om du behöver referera till test-data i kod:
```javascript
// ❌ FELAKTIGT (funkar inte i produktion)
const testFile = '/ovningsunderlag/Noas_Nävertråd/Scanned Document1.pdf';

// ✅ KORREKT (mock i development, backend i produktion)
const testFile = import.meta.env.DEV 
  ? '/test-data/ovningsunderlag/...' 
  : await fetchFromBackend();
```

---

## 📊 Statistik

**Noas_Nävertråd:** 68 PDFs (~25 MB)
**Mandolin:** 14 PDFs (~5 MB)
**Mock attachments:** ~1 MB

**Total storlek:** ~31 MB (därför utanför `public/`)

---

## 🔄 När lägga till fler testfiler?

1. Skapa ny undermapp: `test-data/ovningsunderlag/Nytt_Företag/`
2. Lägg till PDFs
3. **Commit INTE om filerna är stora** (använd `.gitignore` eller LFS)
4. För lokal testning räcker det att ha filerna lokalt

---

**Senast uppdaterad:** 2025-11-22
