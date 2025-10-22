# 📋 Onboarding UI Checklist - "Basic 1.0"

**Senast uppdaterad:** 2025-10-21  
**Status:** Förberedelse inför LIA2-demo

---

## 🎯 MÅLET: Komplett PTL-compliant onboarding flow

Denna checklist säkerställer att alla nödvändiga data samlas in för:
- ✅ Penningtvättslagens (PTL) krav på kundkännedom (KYC)
- ✅ Automated fraud detection (verksamhetskongruens, privatkonsumtion, etc.)
- ✅ Risk-scoring och compliance-rapportering

---

## ✅ NUVARANDE STATUS (implementerat)

### **Slide 1: VälkommenSlide.jsx** ✅
- Introduktion till onboarding-processen
- Förklaring av PTL och varför data behövs

### **Slide 2: ForetagsinformationSlide.jsx** ✅
- Organisationsnummer
- Företagsnamn
- Verksamhetsbeskrivning
- Kontaktperson

### **Slide 3: BokforingDataSlide.jsx** ✅
- Skatteverket OAuth2 integration (Skattekonto + Inkomstdeklarationer)
- Samtycke till datainsamling

### **Slide 4: RiskTestSlide.jsx** ✅
- Risk-frågor (bransch, omsättning, antal anställda)
- Styrelse/ägare-information (namn + personnummer)
- PEP-screening

### **Slide 5: SammanfattningSlide.jsx** ✅
- Sammanfattning av insamlad data
- BankID-signering

---

## ❌ VAD SOM SAKNAS (måste implementeras)

### **KRITISKT 🔴 (måste fixas innan LIA2-demo):**

#### **1. Företagsdokumentation-upload** ❌

**Var:** Ny sektion i `BokforingDataSlide.jsx` ELLER ny `ForetagsdokumentationSlide.jsx`

**Innehåll:**
```jsx
<div className="space-y-6">
  <h3 className="text-xl font-semibold">Företagsdokumentation</h3>
  
  {/* Registreringsbevis - OBLIGATORISKT */}
  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <FileText className="w-5 h-5" />
      Registreringsbevis från Bolagsverket *
    </label>
    <p className="text-sm text-gray-600 mb-4">
      Ladda upp aktuellt registreringsbevis (max 3 månader gammalt).
      Detta verifierar företagets existens och ger oss styrelseuppgifter.
    </p>
    <input
      type="file"
      accept=".pdf"
      onChange={handleRegistreringsbevisUpload}
      required
    />
    {registreringsbevisFile && (
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <CheckCircle className="inline w-5 h-5 text-green-600 mr-2" />
        <span className="text-sm text-green-700">
          {registreringsbevisFile.name} uppladdad
        </span>
      </div>
    )}
  </div>

  {/* Årsredovisning - VALFRITT */}
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <FileText className="w-5 h-5" />
      Senaste årsredovisning (valfritt)
    </label>
    <p className="text-sm text-gray-600 mb-4">
      Om tillgänglig, hjälper detta oss bedöma företagets ekonomiska hälsa.
    </p>
    <input
      type="file"
      accept=".pdf"
      onChange={handleArsredovisningUpload}
    />
  </div>
</div>
```

**Varför kritiskt:**
- ✅ Standard vid onboarding (din LIA-handledare har redan begärt detta!)
- ✅ Ger oss styrelsemedlemmar med personnummer (för närstående-check)
- ✅ Verifierar företagets existens mot Bolagsverket
- ✅ GRATIS för oss (kunden laddar ner från Bolagsverket själva)

---

#### **2. Bokföringsunderlag-upload** ❌

**Var:** Ny slide `BokforingsunderlagSlide.jsx` (efter BokforingDataSlide)

**Innehåll:**
```jsx
<div className="space-y-6">
  <h3 className="text-xl font-semibold">Bokföringsunderlag</h3>
  <p className="text-gray-600">
    Ladda upp fakturor och kvitton från de senaste 3-6 månaderna.
    Vi analyserar dessa för att säkerställa verksamhetskongruens.
  </p>

  {/* Leverantörsfakturor */}
  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <FileText className="w-5 h-5" />
      Leverantörsfakturor *
    </label>
    <p className="text-sm text-gray-600 mb-4">
      Fakturor från era leverantörer. Vi kontrollerar att inköpen matchar
      er verksamhetsbeskrivning.
    </p>
    <input
      type="file"
      accept=".pdf"
      multiple
      onChange={handleLeverantorsfakturorUpload}
      required
    />
    <p className="text-xs text-gray-500 mt-2">
      Tips: Välj flera filer samtidigt (Ctrl/Cmd + klick)
    </p>
  </div>

  {/* Kundfakturor */}
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <FileText className="w-5 h-5" />
      Kundfakturor (valfritt men rekommenderat)
    </label>
    <p className="text-sm text-gray-600 mb-4">
      Era utgående fakturor. Hjälper oss verifiera intäkter och affärsmodell.
    </p>
    <input
      type="file"
      accept=".pdf"
      multiple
      onChange={handleKundfakturorUpload}
    />
  </div>

  {/* Kvitton/Utlägg */}
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <Receipt className="w-5 h-5" />
      Kvitton och utlägg (valfritt)
    </label>
    <p className="text-sm text-gray-600 mb-4">
      Kvitton för kontantinköp och utlägg. Vi kontrollerar att dessa
      är affärsmässiga och inte privatkonsumtion.
    </p>
    <input
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      multiple
      onChange={handleKvittonUpload}
    />
  </div>
</div>
```

**Varför kritiskt:**
- ✅ **Motorcykeldäck-testet** kräver detta (vi analyserar faktiska fakturor!)
- ✅ Verksamhetskongruens-check (motorcykeldäck till blästringsföretag)
- ✅ Privatkonsumtion-check (ICA, H&M, Willys på företaget)
- ✅ Konkurskontroll (betalning till avregistrerade företag)

---

#### **3. Bankinformation-komplettering** ❌

**Var:** Ny sektion i `BokforingDataSlide.jsx` ELLER i `BokforingsunderlagSlide.jsx`

**Innehåll:**
```jsx
<div className="space-y-4">
  <h4 className="text-lg font-semibold">Bankinformation</h4>
  
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Företagets bankkontonummer *
    </label>
    <input
      type="text"
      placeholder="1234-56 789 01"
      value={bankkontonummer}
      onChange={(e) => setBankkontonummer(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Bankgiro (om finns)
    </label>
    <input
      type="text"
      placeholder="123-4567"
      value={bankgiro}
      onChange={(e) => setBankgiro(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Plusgiro (om finns)
    </label>
    <input
      type="text"
      placeholder="12 34 56-7"
      value={plusgiro}
      onChange={(e) => setPlusgiro(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg"
    />
  </div>

  {/* Kontoutdrag upload */}
  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <FileText className="w-5 h-5" />
      Kontoutdrag (senaste 3-6 månader) *
    </label>
    <p className="text-sm text-gray-600 mb-4">
      Vi analyserar transaktionshistoriken för att upptäcka
      misstänkta mönster och privatkonsumtion.
    </p>
    <input
      type="file"
      accept=".pdf"
      multiple
      onChange={handleKontoutdragUpload}
      required
    />
  </div>
</div>
```

**Varför kritiskt:**
- ✅ Bankgiro behövs för **Bankgiro → Företags-ID lookup** (egen databas)
- ✅ Kontoutdrag behövs för **transaktionsanalys** (motorcykeldäck-testet)

---

### **VIKTIGT 🟡 (bör fixas för professional look):**

#### **4. Bättre visualisering av uppladdade filer** ⚠️

**Var:** Alla upload-fält

**Innehåll:**
```jsx
{/* Efter varje file input */}
{uploadedFiles.length > 0 && (
  <div className="mt-4 space-y-2">
    <p className="text-sm font-medium text-gray-700">
      Uppladdade filer ({uploadedFiles.length}):
    </p>
    {uploadedFiles.map((file, index) => (
      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <button
          onClick={() => handleRemoveFile(index)}
          className="text-red-600 hover:text-red-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    ))}
  </div>
)}
```

---

#### **5. Progress indicator för onboarding** ⚠️

**Var:** Överst på varje slide

**Innehåll:**
```jsx
<div className="mb-8">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-gray-700">
      Steg {currentStep} av {totalSteps}
    </span>
    <span className="text-sm text-gray-500">
      {Math.round((currentStep / totalSteps) * 100)}% klart
    </span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
    />
  </div>
</div>
```

---

## 📝 IMPLEMENTATION PLAN

### **Fas 1: Kritiska ändringar (innan LIA2-demo)**

```bash
# Prioritet 1: Registreringsbevis
[ ] Skapa ForetagsdokumentationSlide.jsx
[ ] Lägg till PDF-upload för registreringsbevis
[ ] Lägg till valfri årsredovisning-upload
[ ] Integrera i onboarding-flowet (efter ForetagsinformationSlide)

# Prioritet 2: Bokföringsunderlag
[ ] Skapa BokforingsunderlagSlide.jsx
[ ] Lägg till multi-file upload för leverantörsfakturor
[ ] Lägg till multi-file upload för kundfakturor (valfritt)
[ ] Lägg till multi-file upload för kvitton (valfritt)
[ ] Integrera i onboarding-flowet (efter BokforingDataSlide)

# Prioritet 3: Bankinformation
[ ] Lägg till bankkontonummer i BokforingDataSlide
[ ] Lägg till Bankgiro-fält
[ ] Lägg till Plusgiro-fält
[ ] Lägg till kontoutdrag-upload
```

### **Fas 2: Förbättringar (efter LIA2-demo)**

```bash
# Nice-to-have
[ ] Bättre fil-visualisering med ta-bort-knapp
[ ] Progress indicator överst på varje slide
[ ] Drag-and-drop för fil-upload
[ ] Preview av uppladdade PDF:er
[ ] OCR/parsing av fakturor (visa extraherad data)
```

---

## 🎯 RESULTAT EFTER IMPLEMENTATION

**Med dessa ändringar kan vi:**

1. ✅ **Samla in ALLA data som krävs för PTL-compliance**
   - Företagsinformation (namn, org.nr, verksamhet)
   - Företagsdokumentation (registreringsbevis, årsredovisning)
   - Styrelse/ägare (från registreringsbevis)
   - Bankinformation (konto, bankgiro, plusgiro)
   - Bokföringsdata (Skatteverket OAuth2)
   - Bokföringsunderlag (fakturor, kvitton, kontoutdrag)

2. ✅ **Köra ALLA fraud detection-tester:**
   - Verksamhetskongruens (motorcykeldäck till blästringsföretag)
   - Privatkonsumtion (ICA, H&M, Willys på företaget)
   - Konkurskontroll (betalning till avregistrerade företag)
   - Leveransadress-validering (företag vs privatadress)
   - Cirkulära betalningar (delvis, utan ägardata)

3. ✅ **Visa en professionell demo för LIA2-handledare:**
   - Komplett onboarding-flow
   - Alla nödvändiga dokument samlas in
   - Realistisk data (RS MekService AB motorcykeldäck-case)
   - Automated fraud detection med faktiska varningar

---

## 📊 ESTIMERAD TID

| Task | Estimat | Prioritet |
|------|---------|-----------|
| ForetagsdokumentationSlide.jsx | 2-3h | 🔴 Kritisk |
| BokforingsunderlagSlide.jsx | 3-4h | 🔴 Kritisk |
| Bankinformation-komplettering | 1-2h | 🔴 Kritisk |
| Fil-visualisering | 2h | 🟡 Viktigt |
| Progress indicator | 1h | 🟡 Viktigt |
| **TOTALT** | **9-12h** | |

---

## ✅ DEFINITION OF DONE

Appen är klar för LIA2-demo när:

- [ ] Alla kritiska fält är implementerade
- [ ] RS MekService AB-testet går att köra end-to-end
- [ ] Motorcykeldäck-fakturor kan laddas upp
- [ ] Fraud detection flaggar motorcykeldäck som inkongruent
- [ ] Registreringsbevis kan laddas upp och verifieras
- [ ] LaTeX-dokumentationen är uppdaterad
- [ ] README.md har screenshots av nya slides

**Målsättning:** Klart innan LIA2-period börjar (Q1 2026?)
