# BEAMER RISKFRÅGOR - STÄDNING KLAR

**Datum:** 2025-10-25  
**Fil:** Onboardin_app_ny.tex  
**Loop:** 1 (UI/UX Spec)

---

## ✅ GENOMFÖRDA ÄNDRINGAR

### 1. **Tog bort Steg 5/5 (PEP & Ägande)**
- **Varför:** Duplicerar "PEP-Kontroll" slide som kommer senare (efter Identitetskontroll + Kontrolltabell)
- **Verkliga huvudmän:** Hämtas automatiskt från Roaring.io i Steg 1
- **PEP-frågor:** Finns i dedikerad "PEP-Kontroll" slide senare i flödet

### 2. **Tog bort duplicerade frågor från Steg 2**
Steg 2 (Utländska transaktioner) hade tidigare:
- ❌ "Beskriv företagets huvudsakliga verksamhet" (finns i Steg 1, fråga 1)
- ❌ "SNI-kod" (hämtas automatiskt från Bolagsverket i Steg 1)
- ❌ "Har verksamheten ändrats de senaste 12 månaderna?" (finns i Steg 1, fråga 5)

**Behöll:**
- ✅ "Vilka länder har företaget affärspartners/kunder i?" (fördjupning)
- ✅ "Ungefär hur stor andel av omsättningen kommer från utländska kunder?"
- ✅ "Bedriver företaget verksamhet från fast driftställe?"

### 3. **Tog bort duplicerade frågor från Steg 3**
Steg 3 (Kunder & Affärspartners) hade tidigare:
- ❌ "Vilka typer av kunder har företaget?" (finns i Steg 1, fråga 2)
- ❌ "Geografisk marknad" (hanteras av Steg 1 + Steg 2)

**Behöll:**
- ✅ "Har företaget återkommande affärspartners utanför Sverige?"
- ✅ "Vilka är företagets tre största leverantörer?"
- ✅ "Vilka är företagets tre största kunder?"

### 4. **Uppdaterade Progress-indikatorer**
- Steg 1: Ingen progress (start)
- Steg 2: [●●○○] Steg 2/4
- Steg 3: [●●●○] Steg 3/4
- Steg 4: [●●●●] Steg 4/4

### 5. **Lade till dokumentation om dynamiska wizard-steg**
Efter Steg 4, innan API-sammanfattning:

```latex
% ========================================================================
% OBS: DYNAMISKA WIZARD-STEG
% ========================================================================
% Antal wizard-steg (2-4) är DYNAMISKT baserat på triggers från Steg 1
% Konfigureras via config.json i frontend
```

**Exempel config.json-struktur:**
```json
{
  "riskfragor": {
    "steg2": {
      "conditional": true,
      "trigger": "utlandskaPartners !== 'Nej'",
      "questions": [...]
    },
    "steg3": {
      "conditional": true,
      "trigger": "kundTyper.privatpersoner === true OR utlandskaPartners !== 'Nej'",
      "questions": [...]
    }
  }
}
```

### 6. **Lade till conditional rendering-notiser**
Varje steg 2-4 har nu tydlig notering:
```
\tiny \textit{Visas endast om: <trigger-condition>}
```

---

## 📋 NY STRUKTUR

### **Steg 1: Grundläggande information (ALLTID visas)**
- 8 grundfrågor
- Triggar ALLA externa API-anrop:
  * Bolagsverket (företagsinfo, VD, firmatecknare)
  * SPAR (personnummer, folkbokföring)
  * Roaring Beneficial Owners (verkliga huvudmän)
  * Roaring PEP/Sanctions/BusinessProhibition
- Backend beräknar triggers för Steg 2-4
- **Endpoint:** POST /api/onboarding/{id}/riskfragor/steg1

### **Steg 2: Utländska transaktioner (CONDITIONAL)**
- Visas OM: utlandskaPartners !== "Nej"
- 3 frågor om utländska affärspartners, omsättning, driftställe
- Inga API-anrop (ren KYC-data)

### **Steg 3: Kunder & Affärspartners (CONDITIONAL)**
- Visas OM: utlandskaPartners !== "Nej" OR kundTyper.privatpersoner === true
- 3 frågor om affärspartners, leverantörer, kunder
- Inga API-anrop (ren KYC-data)

### **Steg 4: Betalningar & Transaktioner (CONDITIONAL)**
- Visas OM: kundTyper.privatpersoner === true OR stora transaktioner
- 5 frågor om betalningsmetoder, kontanter, stora transaktioner
- Inga API-anrop (ren KYC-data)

**Backend endpoint för Steg 2-4:**
- POST /api/onboarding/{id}/riskfragor/steg2
- Sparar ALLA KYC-svar från Steg 2-N i en enda request (batch)

---

## 🎯 NÄSTA STEG

### **Återgå till Loop 2 (Backend API Spec)**
Nu när UI-specen är uppdaterad kan vi:

1. **Verifiera Sektion 2A** (Steg 1) - redan klar, matchar nu UI-specen
2. **Skapa Sektion 2B** (Steg 2-4) - ett enda POST endpoint för alla KYC-svar
3. **Dokumentera config.json-struktur** - hur dynamiska wizard-steg konfigureras

### **Eller fortsätt i Loop 1**
Om du vill se mer av UI-specen innan vi återgår till backend:
- Identitetskontroll (foto-baserad, INTE BankID)
- PEP-Kontroll (dedikerad slide)
- Kontrolltabell (jämförelse Bolagsverket vs Roaring)

---

## 📝 ARKITEKTUR-INSIKTER

### **Frontend-driven wizard:**
- React komponenter renderas conditional baserat på `triggers` från Steg 1
- `config.json` definierar vilka steg som finns och deras triggers
- Frontend skickar ALLA wizard-data i en enda batch till backend (Steg 2)

### **Backend:**
- **Steg 1:** Gör ALLA externa API-anrop, beräknar triggers
- **Steg 2:** Sparar KYC-data, ingen extern kommunikation
- Triggers styr vilka frågor som ställs (frontend) men backend sparar allt som skickas

### **Flexibilitet:**
- Nya KYC-frågor kan läggas till via `config.json` utan kodändringar
- Triggers kan justeras för olika branscher/risknivåer
- Antal wizard-steg kan öka/minska dynamiskt

---

## ✅ KVALITETSKONTROLL

- [x] Inga duplicerade frågor mellan Steg 1 och Steg 2-4
- [x] Steg 5/5 (PEP & Ägande) borttagen
- [x] Progress-indikatorer uppdaterade (4 steg, inte 5)
- [x] Conditional rendering dokumenterad
- [x] Dynamiska wizard-steg dokumenterade
- [x] config.json-exempel tillagt
- [x] Backend endpoints dokumenterade (1 för Steg 1, 1 för Steg 2-4)
