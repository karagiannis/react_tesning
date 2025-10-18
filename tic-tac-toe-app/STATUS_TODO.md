# 📋 Status & TODO - Onboarding App

**Senast uppdaterad:** 2025-10-18 06:45

---

## ✅ KLART (80%)

### 1. LaTeX-dokumentation
- [x] Slides 1-9: Kunddata (befintliga)
- [x] Slide 10: IBAN + SIE-fil combined (uppdaterad)
- [x] Slide 11: Verifikationsfel (ny)
- [x] Slide 12: Likviditetsanalys + layering (uppdaterad)
- [x] Slide 13: Riskbedömning (befintlig)
- [x] **Slide 17-20: POST-KONTRAKT (NYA!)**
  - Slide 17: Bankläsrättigheter (Open Banking)
  - Slide 18: Skatteverket deklarationsombud + API-verifiering
  - Slide 19: Scan to Dropbox/Email setup
  - Slide 19b: Scannerguider per märke
  - Slide 20: Välkommen som kund! 🎉
- [x] Kompilerad PDF (31 sidor)

### 2. Backend (FastAPI)
- [x] `main.py` med 5 mock endpoints:
  - `GET /api/v1/companies/{id}/sie` - SIE-filer
  - `GET /api/v1/companies/{id}/vouchers` - Verifikationsfel
  - `GET /api/v1/companies/{id}/accounts` - Kontoplan
  - `GET /api/v1/companies/{id}/balance` - Likviditetshistorik
  - `POST /api/v1/onboarding/assess-risk` - Riskbedömning
- [x] Mock data för 5 verifikationer med fel
- [x] Mock data för 9 konton
- [x] Dynamisk likviditetsgeneration (12 mån)
- [x] Algoritmisk riskbedömning (PDF-metod)
- [x] Branschkatalog med 17 branscher + hotnivåer
- [x] CORS konfigurerad för localhost + Vercel
- [x] `requirements.txt`
- [x] `Procfile` (för Railway/Render)
- [x] `README.md` med API-dokumentation
- [x] `test_api.sh` test-script

### 3. Dokumentation
- [x] DEPLOYMENT_GUIDE.md
- [x] Backend README med exempel
- [x] Email-template för Fortnox
- [x] Checklista för måndag

### 4. Färgschema
- [x] Grön brand-palett i tailwind.config.js
- [x] Alla amber/orange → brand (verifierat)

---

## ⏳ ÅTERSTÅR (20%)

### React Frontend Implementation

#### **PRIO 1: Slides 10-13 (Kritiskt för demo)**

**Slide 10: Bokföringsdata (IBAN + SIE)**
```jsx
// Skapa: src/components/Slides/BokforingsSlide.jsx
- [x] Layoutmall (left: IBAN, right: SIE)
- [ ] IBAN input field + bank dropdown
- [ ] "Hämta bankdata" knapp (placeholder)
- [ ] "Hämta från Fortnox" knapp
  - onClick: fetch(`${API_URL}/companies/${orgNr}/sie?years=7`)
- [ ] Drop zone för SIE-filer (react-dropzone)
- [ ] Info block om config.json (antal år)
- [ ] State: sieFiles, loading, error
```

**Slide 11: Verifikationsfel**
```jsx
// Skapa: src/components/Slides/VerifikationsfelSlide.jsx
- [ ] Status indicator (loading/complete)
- [ ] Tabell med kolumner: Ver.nr, Datum, Belopp, Beskrivning
- [ ] Clickable rows → modal öppnas
- [ ] Modal med full verifikationsdetalj
- [ ] API-call: fetch(`${API_URL}/companies/${orgNr}/vouchers`)
- [ ] State: vouchers, selectedVoucher, modalOpen
```

**Slide 12: Likviditetsanalys**
```jsx
// Skapa: src/components/Slides/LikviditetsSlide.jsx
- [ ] Recharts eller Chart.js integration
- [ ] Line chart för likviditet över tid
- [ ] Key metrics display (genomsnitt, max, min)
- [ ] Layering-analys (hidden för kund)
- [ ] API-call: fetch(`${API_URL}/companies/${orgNr}/balance`)
- [ ] State: balanceData, keyMetrics, layeringResults
```

**Slide 13: Riskbedömning**
```jsx
// Skapa: src/components/Slides/RiskbedömningSlide.jsx
- [ ] Branch selector dropdown (17 branscher)
- [ ] Checkboxes för risk factors:
  - [ ] PEP
  - [ ] Nyetablerad
  - [ ] Högriskland
  - [ ] Komplex struktur
  - [ ] Negativ media
- [ ] "Beräkna risk" knapp
- [ ] Visual risk indicator (green/yellow/red)
- [ ] Calculation breakdown display
- [ ] Decision display (ACCEPTERA/FÖRDJUPAD/AVSLÅ)
- [ ] API-call: POST to /assess-risk
- [ ] State: branchCode, riskFactors, riskResult
```

---

#### **PRIO 2: Post-kontrakt slides (Nice to have)**

**Slide 17-20** (kan mockas med statisk text först)
- [ ] BankrattighetSlide.jsx
- [ ] SkatteverketOmbudSlide.jsx
- [ ] DokumenthanteringSlide.jsx
- [ ] VälkommenSlide.jsx

---

#### **PRIO 3: API Integration Setup**

```jsx
// Skapa: src/services/fortnoxApi.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fortnoxApi = {
  getSieFiles: (companyId, years) => {...},
  getVouchers: (companyId) => {...},
  getAccounts: (companyId) => {...},
  getBalance: (companyId) => {...},
  assessRisk: (data) => {...}
};
```

```bash
# .env.development
VITE_API_URL=http://localhost:8000

# .env.production
VITE_API_URL=https://tic-tac-toe-server-production.up.railway.app
```

---

#### **PRIO 4: State Management**

```jsx
// Uppdatera: src/machines/onboardingMachine.js
- [ ] Lägg till states för slides 10-13
- [ ] Context för API data
- [ ] Error handling states
```

---

## 📅 TIDSPLAN

### **IDAG (Lördag 18 okt - 6 timmar kvar)**
- [x] LaTeX klart ✅
- [x] Backend mock API klart ✅
- [ ] React Slide 10: BokforingsSlide.jsx (1h)
- [ ] React Slide 11: VerifikationsfelSlide.jsx (1.5h)
- [ ] React Slide 12: LikviditetsSlide.jsx (1.5h)
- [ ] React Slide 13: RiskbedömningSlide.jsx (1h)
- [ ] Test lokalt: Frontend ↔ Backend (30 min)

**Mål kl 13:00:** Alla 4 slides fungerar mot mock API

---

### **IMORGON (Söndag 19 okt)**
- [ ] Deploy backend till Railway (30 min)
- [ ] Deploy frontend till Vercel (30 min)
- [ ] Testa live deployment (30 min)
- [ ] Screen recording (1h - flera takes)
- [ ] Upload video till Loom/YouTube (15 min)
- [ ] Skriv email med video-länk (30 min)

**Mål kl 18:00:** Allt live, video klar, email redo att skickas

---

### **MÅNDAG (20 okt - Fortnox-dag!)**
- [ ] 08:00 - Ring Fortnox Support
- [ ] Om de ber om mail: Skicka direkt med video
- [ ] 14:00 - Följ upp med mail om ingen svarade
- [ ] Fortsätt bygga post-kontrakt slides medan du väntar

---

## 🎯 DEFINITION OF DONE

App är "Demo-Ready" när:
- [ ] Slide 10 kan anropa mock SIE endpoint och visa resultat
- [ ] Slide 11 kan visa tabell med verifikationsfel + modal
- [ ] Slide 12 kan visa likviditetsgraf från mock data
- [ ] Slide 13 kan beräkna risk och visa färgkodad indikator
- [ ] Backend deployed och tillgänglig via HTTPS
- [ ] Frontend deployed och tillgänglig via HTTPS
- [ ] Video-demo inspelad (2 min, bra kvalitet)
- [ ] Email skriven med video-länk

---

## 📞 Fortnox Contact Info

**Support (för developer-licens):**
- Tel: 0775-39 00 00
- Chatt: fortnox.se (när inloggad)
- Öppet: Helgfria vardagar 08:00-17:00

**Partnerships (backup):**
- partners@fortnox.se
- Formulär: fortnox.se/integrationer/bli-partner

---

## 💡 Quick Wins

Om tiden är knapp, prioritera:
1. **Slide 13 (Riskbedömning)** - Mest imponerande algoritmiskt
2. **Slide 11 (Verifikationsfel)** - Visar konkret värde för byråer
3. **Slide 12 (Likviditet)** - Visuellt tilltalande
4. **Slide 10 (SIE)** - Visar Fortnox-integration

---

## 🚨 Blockers?

**Om Fortnox säger nej:**
- [ ] Plan B: Bygg Visma integration istället
- [ ] Plan C: Använd endast SIE-fil upload (ingen API)
- [ ] Plan D: Kontakta mindre bokföringsprogram (Speedledger, Bokio)

**Men med färdig demo är chansen 80% att de säger JA!** 🎯

---

**Status update när du är klar med varje steg!** 
Lycka till - du är nästan i mål! 🏁
