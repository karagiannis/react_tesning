# ⚠️ KONFIDENTIELLT - LÄS INNAN COMMIT ⚠️

## Demo-komponenter med verklig klientdata

Denna mapp innehåller demo-komponenter som **FÅR INTE** pushas till GitHub eller deployas till produktion.

### Filer som innehåller känslig data:

1. **FraudDetectionDemo.jsx**
   - Innehåller verklig klientdata från RS MekService
   - Verifikation A308 (motorcykeldäck)
   - LIA-handledarens klient
   - Identifierbara belopp och transaktioner

2. **../utils/fraudDetection.js**
   - Mock-data med `MOCK_A308_EXAMPLE`
   - Verkliga belopp: 8 000 kr + 2 000 kr moms
   - Leverantör: RS MekService AB

### Varför detta är känsligt:

- **GDPR**: Innehåller företagsdata utan samtycke
- **Professionell etik**: Exponerar handledarens klient
- **Revisorsnämnden**: Kan ses som brott mot sekretess

### Hur hantera:

✅ **OK för lokal utveckling:**
- Kör lokalt: `npm run dev`
- Visa för handledare vid LIA-redovisning
- Använd för intern utbildning

❌ **FÅR INTE:**
- Pusha till GitHub public repo
- Deploya till celestial.se
- Dela med personer utanför projektet
- Inkludera i portfolio utan anonymisering

### Innan commit:

```bash
# Kontrollera att routen är kommenterad:
grep -n "fraud-detection" src/App.jsx

# Ska visa:
# 36:// import FraudDetectionDemo from './components/Demo/FraudDetectionDemo'; // KOMMENTERAD
# 245:{/* <Route path="/demo/fraud-detection" element={<FraudDetectionDemo />} /> */}
```

### Anonymiserad version för produktion:

Om du vill visa Test 3.7 publikt, skapa anonymiserad version:
- Byt företagsnamn: "RS MekService" → "Firma X AB"
- Byt belopp: 8000/3000/5000 → andra värden
- Ta bort verkliga datum
- Generera fiktiva org.nr

---

**SKAPAD:** 2025-10-21  
**ANSVARIG:** Lasse Karagiannis  
**HANDLEDARE:** [Namn dolt av sekretesskäl]
