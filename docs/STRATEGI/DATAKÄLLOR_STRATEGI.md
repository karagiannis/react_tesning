# Datakällor för KYC/AML-validering

**Uppdaterad:** 2025-10-21  
**Status:** Bolagsverket PROD API klar, Bankgirot väntar på svar, Roaring.io för dyr

---

## 🔍 1. Bolagsverket API och FIL

### ✅ **Värdefulla datamängder (GRATIS API)**
**URL:** https://www.bolagsverket.se/ff/foretagsformer/avtal/kundanmalan-1.83024

**Innehåll (enligt svaret från Bolagsverket 2025-10-20):**
- ✅ Organisationsnummer
- ✅ Företagsnamn
- ✅ Adress
- ✅ Verksamhetsbeskrivning (SNI-kod)
- ❌ **INTE styrelseuppgifter**
- ❌ **INTE ägarstruktur (verkliga huvudmän)**
- ❌ **INTE ekonomisk information**

**Användningsområde:**
- Validera att leverantör existerar
- Kontrollera verksamhetsbeskrivning (SNI-kod) mot fakturerad vara/tjänst
- Upptäcka avregistrerade företag
- **Test 4.2a:** Motorcykeldäck från motorcykelverkstad (SNI-kod validering)

**Kostnad:** 0 kr

---

### 🎉 **FILHÄMTNING "ALLT" (BILLIGT ALTERNATIV!)** ⭐ **NY UPPTÄCKT**
**Källa:** Linda Melin, Bolagsverket (2025-10-20)

**Innehåll:**
- ✅ Allt från "Värdefulla datamängder"
- ✅ **Styrelseuppgifter** 👥
- ✅ **Ägarstruktur (verkliga huvudmän)** 🔍
- ✅ Ekonomisk information
- ✅ **Dagliga uppdateringar** (avisering)

**Kostnad:**
- **600 kr** engångskostnad för baslyft (alla posttyper)
- **900 kr/år** för daglig avisering (uppdateringar)
- **= 1 500 kr första året, sedan 900 kr/år** (+ moms)

**Jämförelse med API:**
| Tjänst | Första året | Årlig kostnad |
|--------|-------------|---------------|
| API Företagsinformation | 17 000 kr | 12 000 kr |
| **Filhämtning "Allt"** | **1 500 kr** | **900 kr** |
| **BESPARING** | **15 500 kr** | **11 100 kr** |

**Status:** ✅ **PERFEKT FÖR OSS!**

**Teknisk implementation:**
- Ladda ner baslyftet (600 kr) och importera till lokal databas
- Prenumerera på daglig avisering (900 kr/år) för uppdateringar
- Bygg API-wrapper kring lokal databas för snabba uppslag
- Daglig synkronisering via cron-job

---

### ⚠️ **API Företagsinformation (ONÖDIGT DYR)**
**Kostnad:**
- **5 000 kr** grundavgift
- **1 000 kr/månad** för 500 transaktioner
- **= 17 000 kr första året** (+ moms)

**Dagliga uppdateringar:**
- Finns ej ännu
- Byggs nu, klar Q1 2026
- Kostnad okänd

**Status:** ⛔ **SKIPPA - Använd filhämtning istället**

---

## ✅ Vår egen datakällstrategi

### **1. Bolagsverket API (Värdefulla datamängder) - GRATIS MEN BEGRÄNSAD** ⚠️
**Status:** ✅ PROD API fungerar sedan 2025-10-20  
**Kostnad:** Gratis (öppna data, inga begränsningar på anrop)  
**Scope:** ⚠️ **"Värdefulla datamängder"** - BEGRÄNSAD åtkomst  
**Dokumentation:** `/docs/API_INTEGRATION/Bolagsverket/README.md`

**✅ VAD VI FÅR GRATIS (Värdefulla datamängder):**
- Företagsnamn
- Organisationsnummer
- Juridisk form (AB, HB, Enskild firma, etc.)
- Registreringsdatum
- Adress
- Verksamhetsbeskrivning (SNI-kod) ✅ **Detta räcker för Test 4.2a (motorcykeldäck)**
- Status (aktivt/avregistrerat)
- **Digitalt inkomna årsredovisningar** (från 2020 framåt, iXBRL-format, veckovis uppdatering)

**❌ VAD VI INTE FÅR (Kräver betalversion):**
- ❌ Styrelseledamöter
- ❌ Verkliga huvudmän (UBO/Beneficial Owners)
- ❌ Ägarstruktur
- ❌ Historiska händelser (fusioner, fissioner)
- ❌ Ekonomisk information (utöver årsredovisningar)

**✅ ALTERNATIV: Registreringsbevis från kunden (GRATIS för oss!):**
- Kunden laddar upp sitt registreringsbevis (standard vid onboarding)
- Innehåller: Styrelseledamöter, VD, suppleanter med personnummer
- Max 3 månader gammalt för att vara aktuellt
- Vi kan verifiera mot Bolagsverket GRATIS API (namn, org.nr, adress)

**Användning (begränsad):**
- ✅ Validera leverantörs/kundfakturor mot org.nr (namn, adress, status)
- ✅ Hämta verksamhetsbeskrivning (SNI-kod) för Test 4.2a (motorcykeldäck)
- ❌ Kontrollera styrelse och ägare för layering-analys → **KRÄVER BETALVERSION**
- ✅ **Obegränsat antal anrop** - men begränsad data per anrop

**Konsekvens för layering-analys:**
Vi **MÅSTE** komplettera med betalversion ELLER alternativ datakälla för ägardata.

---

### **2. Bankgirot API - Väntar på svar** ⏳
**Status:** ⏳ Påminnelse skickad 2025-10-20, väntar på svar  
**Förväntad kostnad:** Okänd (förmodligen avtal + årslicens)

**Behov:**
- **Bankgiro → Företags-ID lookup**
- Exempel: Bankgiro `123-4567` tillhör vilket org.nr?

**Alternativ om Bankgirot inte svarar:**
1. **Scraping från Bankgirot.se** (gray area, risk för blockering)
2. **Bankens API:er** (t.ex. Nordea Open Banking) - men kräver avtal per bank
3. **BGC (Bankernas Girocentralen)** - Köpa datadump (dyrt, men engångskostnad)
4. **Manual lookup** - Kunden anger själv Bankgiro → Org.nr-mappning

**Temporär lösning:**
- Kunden anger Bankgiro manuellt vid onboarding
- Systemet sparar mappning: Bankgiro → Org.nr
- Bygger upp egen databas över tid

---

### **5. Alternativ för ägardata (Styrelse & Verkliga huvudmän)** 🔍

Eftersom Bolagsverkets gratis-API **INTE** inkluderar styrelse/ägare måste vi välja:

#### **Alternativ A: Bolagsverket Betalversion** 💰
- **Kostnad:** Okänd (kontakta Bolagsverket för offert)
- **Data:** Styrelse, verkliga huvudmän, ekonomisk info
- **Fördel:** Officiell datakälla, alltid uppdaterad
- **Nackdel:** Månadskostnad + eventuell kostnad per anrop

#### **Alternativ B: Allabolag.se API** 💰
- **Kostnad:** ~500-2000 kr/månad (beroende på anropsmängd)
- **Data:** Styrelse, verkliga huvudmän, ekonomisk info, kreditupplysning
- **Fördel:** Etablerad tjänst, många använder den
- **Nackdel:** Månadskostnad, tredjepartsleverantör

#### **Alternativ C: UC (Upplysningscentralen) API** 💰
- **Kostnad:** Avtal krävs (förmodligen dyrare än Allabolag)
- **Data:** Företagsinformation, kreditupplysning, betalningsanmärkningar
- **Fördel:** Hög datakvalitet, officiell kreditupplysning
- **Nackdel:** Dyrare, kräver avtal

#### **Alternativ D: Scraping från Bolagsverket.se** ⚠️ (Gray area)
- **Kostnad:** Gratis (men tidskrävande att underhålla)
- **Data:** Allt som visas på bolagsverket.se (styrelse, verkliga huvudmän)
- **Fördel:** Gratis, uppdaterad data
- **Nackdel:** 
  - ⚠️ Kan strida mot användarvillkor
  - Risk för blockering (IP-ban)
  - Måste underhålla scraping-script vid HTML-ändringar
  - Långsamt (många HTTP-requests)

#### **Alternativ E: Manual input från kund** 👥
- **Kostnad:** Gratis
- **Data:** Kunden anger själv styrelse/ägare
- **Fördel:** Ingen API-kostnad
- **Nackdel:** 
  - Kunden kan ljuga/utelämna information
  - Kräver verifiering (t.ex. bifogad registreringsbevis från Bolagsverket)
  - Extra arbete för kunden

#### **Alternativ F: Roaring.io (trots allt?)** 💰
- **Kostnad:** 1 800 kr för 500 anrop = 3,60 kr/anrop
- **Data:** Företagsdata inkl. styrelse, verkliga huvudmän
- **Fördel:** Enkel integration, betala per användning
- **Nackdel:** 
  - Dyrt vid många leverantörer (100 leverantörer = 360 kr)
  - Saknar Bankgiro-lookup
  - Men för **ägardata på enstaka företag** kan det vara värt det

#### **Rekommendation:**

**För MVP/LIA-demo:**
- **Alternativ E (Manual input)** + verifiering via registreringsbevis
- Be kunden bifoga PDF från Bolagsverket som visar styrelse/ägare
- Spara som bilaga för revision

**För Production (v1.0):**
- **Alternativ B (Allabolag.se API)** om budget finns (~500-2000 kr/mån)
- **ELLER Alternativ F (Roaring.io)** för pay-as-you-go utan fast månadskostnad
- Beräkning: 
  - **Layering-analys:** 1 anrop per klient = 100 klienter × 3,60 kr = **360 kr/år** ✅
  - **Leverantörsvalidering:** 20 leverantörer/klient = 100 × 20 × 3,60 = **7 200 kr/år** ❌

**Slutsats om Roaring.io:**
- ✅ **Bra för layering-analys** (få anrop, billigt)
- ❌ **För dyrt för leverantörsvalidering** (många anrop)

**Hybrid-strategi:**
- Bolagsverket GRATIS för grunddata
- Roaring.io för ägardata (360 kr/år för 100 klienter)
- SPAR för make/maka-relationer (okänd kostnad, behöver offert)
- Manual input för barn/föräldrar/syskon

**Långsiktigt (v2.0):**
- **Alternativ A (Bolagsverket Betalversion)** om vi växer och behöver många anrop
- Förhandla volymrabatt med Bolagsverket

**ÅTGÄRD:** 
1. ✅ Kontakta SPAR och ansök om avtal som "compliance-företag för AML/KYC"
2. ✅ Begär offert för antal uppslag vi behöver (~100 klienter/år = 100 uppslag)
3. ⏳ Invänta svar från Skatteverket om "Grunddatadomän Person" (mer omfattande än SPAR)

---

### **3. Skatteverket API (OAuth2 ACG + BankID) - Sandlåda klar** 🔑
**Status:** 🔑 Sandlådenycklar erhållna, Enskild firma-registrering skickad 2025-10-21  
**Kostnad:** Gratis (öppna data)  
**Dokumentation:** `/Skatteverket/KOMPLETT_SETUP_GUIDE.md`

**Endpoints vi använder:**
- `GET /skattekonto` - Skattekonto-transaktioner (7 år tillbaka)
- `GET /inkomstdeklaration` - Inkomstdeklarationer (7 år tillbaka)

**OAuth2-flöde:**
- Användare loggar in med BankID (Skatteverket betalar)
- Ett enda godkännande för både Skattekonto + Deklarationer
- Scopes: `skattekonto:read inkomstdeklaration:read`

**Användning:**
- ✅ Test 3.3: Validera momsrapporter mot bokföring
- ✅ Test 3.4: Kontrollera fastighetsavgift
- ✅ Test 2.2: Jämföra preliminärskatt mot bokföring

---

### **4. Folkbokföringsregistret (Skatteverket) - Ej implementerat** ❌
**Status:** ❌ Ej sökt tillgång  
**Kostnad:** Okänd (förmodligen kostnadsfritt för AML-ändamål)

**Behov:**
- Kontrollera personnummer för Test 4.12 (fantomanställda)
- Verifiera närstående för layering-analys (make/maka, sambo, barn)

**Alternativ:**
- **Navet (Skatteverket)** - Kräver tillstånd från Skatteverket
- **SPAR (Statens personadressregister)** - Kräver avtal
- **Manual uppgift från kund** - Be kund ange närstående själv

---

### **5. Egen Bankgiro-databas - Byggstruktur** 🏗️
**Koncept:** Eftersom Bankgirot inte erbjuder öppen API, bygger vi vår egen databas.

**Implementation:**
```sql
CREATE TABLE bankgiro_mappning (
  bankgiro VARCHAR(10) PRIMARY KEY,  -- Format: 123-4567
  organisationsnummer VARCHAR(11),    -- Format: 556123-4567
  foretagsnamn VARCHAR(255),
  verifierad BOOLEAN DEFAULT FALSE,   -- Har kunden bekräftat mappningen?
  datum_sparad DATE,
  senast_uppdaterad DATE
);
```

**Datakällor för att bygga databasen:**
1. **Kund anger vid onboarding:** "Ditt Bankgiro 123-4567 tillhör vilket org.nr?"
2. **Scraping från Bolagsverket:** Vissa företag listar Bankgiro på sin bolagsverket.se-profil
3. **Scraping från företagshemsidor:** Många listar Bankgiro på "Kontakta oss"
4. **Crowdsourcing:** Dela data mellan bokföringsbyråer som använder vår tjänst

**Temporär lösning tills databasen är stor:**
- Vid första anrop för okänt Bankgiro → Be kund manuellt ange org.nr
- Spara i databasen för framtida användning
- Efter 100 klienter: Vi har ~2000-5000 Bankgiro-mappningar
- Efter 1 år: Vi har majoriteten av svenska företags Bankgiro

---

### **4. Folkbokföringsregistret (Skatteverket) - ENDAST FÖR MYNDIGHETER** 🏛️
**Status:** ❌ Kräver myndighets-/kommun-/regionstatus  
**Kostnad:** Gratis för myndigheter, avgiftsbelagt för kommuner/regioner  
**API:** "Folkbokföringsuppgifter för offentliga aktörer 3.0"

**✅ VAD API:ET GER (om vi vore myndighet):**
- Namn, personnummer/samordningsnummer
- Skyddade personuppgifter
- Kön, adress, födelse
- **Civilstånd** ✅
- **Familjerelationer** ✅ ← **DETTA BEHÖVER VI!**
- Medborgarskap, avregistrering

**❌ PROBLEMET:**
Vi är ett **programvaruföretag**, inte myndighet/kommun/region.  
Detta API är **"Riktat API (kräver lagstöd)"** - endast för offentliga aktörer.

**ALTERNATIV:**

#### **Alternativ A: SPAR (Statens personadressregister)** 💰 ✅ **MÖJLIGT!**
**Dokumentation:** `/Skatteverket/Persondata_Skatteverket_och_SPAR.txt`

- **Kräver:** Särskilt avtal med SPAR-nämnden
- **Kostnad:** Betaltjänst (okänd avgift, förmodligen per uppslag)
- **Tillgängligt för:** Företag, föreningar, organisationer (inte bara myndigheter)

**✅ VAD VI KAN FÅ:**
> "Uppgift om **vårdnadshavare, make, maka, registrerad partner** får endast lämnas ut till vissa namngivna branscher eller företag. Följande kan nämnas: myndigheter, **banker**, **kreditupplysningsföretag**, **försäkringsföretag**, läkemedelsföretag."

**VIKTIGT:** 
- Vi är ett **fintech/compliance-företag** som arbetar med AML/KYC
- Kan argumentera att vi behöver samma tillgång som **kreditupplysningsföretag**
- SPAR lämnar ut: Personnummer, namn, adress, **relationsperson (make/maka/vårdnadshavare)**

**BEGRÄNSNING:**
- ❌ **INTE barn** (endast vårdnadshavare åt andra hållet)
- ❌ **INTE föräldrar** (om kunden är vuxen)
- ❌ **INTE syskon**
- ✅ **Endast make/maka/partner**

**Detta räcker för:**
- ✅ Detektera layering via make/maka/sambo
- ❌ INTE via barn eller andra släktingar

#### **Alternativ B: Manual input från kund** 👥 ✅ **REKOMMENDERAD FÖR MVP**
- **Kostnad:** Gratis
- **Implementation:**
  ```
  "Ange dina närstående (för AML-kontroll):
  - Make/maka/sambo: [Personnummer]
  - Barn: [Personnummer, Personnummer]
  - Föräldrar: [Personnummer, Personnummer]
  - Syskon: [Personnummer, Personnummer]"
  ```
- **Fördel:** Inga API-kostnader, GDPR-compliant (kunden anger själv)
- **Nackdel:** Kunden kan ljuga/utelämna information
- **Lösning:** Be kunden signera med BankID att uppgifterna är korrekta

#### **Alternativ C: Grunddatadomän Person (öppen data-fil)** 📁
**Funnen i Utvecklarportalen:**
> "Avtal med Skatteverket krävs. Uppgifter om fysiska personer som endast är avsedda för myndigheter, kommuner och regioner är bland annat namn, personnummer/samordningsnummer, skyddade personuppgifter, kön, adress, födelse, civilstånd, **familjerelationer**, medborgarskap, avregistrering."

**Typ:** Öppet data som fil  
**Kategori:** Folkbokföring  
**Problem:** 
- ⚠️ "Endast avsedda för myndigheter, kommuner och regioner"
- ⚠️ Kräver avtal med Skatteverket
- ❓ Är detta endast för myndigheter eller kan företag ansöka?

**ÅTGÄRD:** Kontakta Skatteverket och fråga om:
1. Kan programvaruföretag få tillgång till "Grunddatadomän Person"?
2. Om ja, vilken kostnad och vilka villkor gäller?
3. Inkluderar det familjerelationer (make/maka, barn)?

---

## 💰 Kostnadsjämförelse (UPPDATERAD med SPAR och begränsad Bolagsverket-data)

### **Scenario: 100 klienter/år, 20 leverantörer per klient**

#### **Option 1: Bolagsverket FIL "Allt" (900 kr/år)** ✅ **BÄST FÖR PRODUKTION**
| Datakälla | Kostnad |
|---|---|
| Bolagsverket Baslyft (600 kr engångs) + Avisering (900 kr/år) | **Första året: 1 500 kr, sedan 900 kr/år** |
| - Grunddata (namn, adress, SNI) | Inkluderat ✅ |
| - Styrelseuppgifter | Inkluderat ✅ |
| - Ägarstruktur (verkliga huvudmän) | Inkluderat ✅ |
| - Ekonomisk information | Inkluderat ✅ |
| - Dagliga uppdateringar | Inkluderat ✅ |
| Bankgiro-lookup | **Gratis** (egen databas) |
| Skatteverket API | **Gratis** |
| **TOTALT första året** | **1 500 kr** 🎉 |
| **TOTALT löpande** | **900 kr/år** 🎉 |

**Sparat vs API:** 15 500 kr första året!  
**Sparat vs Roaring.io:** 6 660 kr/år!

#### **Option 2: Bolagsverket FIL + SPAR relationer** ✅ **REKOMMENDERAD FÖR FULL AUTOMATION**
| Datakälla | Kostnad |
|---|---|
| Bolagsverket Baslyft + Avisering | **900 kr/år** (efter första året) |
| SPAR make/maka-relationer | 100 klienter × ? kr = **500-2 000 kr/år** (offert behövs) |
| Bankgiro-lookup | **Gratis** (egen databas) |
| Skatteverket API | **Gratis** |
| **TOTALT/år** | **1 400-2 900 kr/år** |

**Sparat vs Roaring allt:** 4 660-6 160 kr/år ✅

#### **Option 3: Roaring.io för ALLT (ONÖDIGT)** ❌
| Datakälla | Kostnad |
|---|---|
| Bolagsverket-data (leverantörer) | 100 klienter × 20 leverantörer × 3,60 kr = **7 200 kr** |
| Ägardata (layering) | 100 klienter × 1 anrop × 3,60 kr = **360 kr** |
| Bankgiro-lookup | ❌ Saknas |
| Make/maka-relationer | ❌ Saknas |
| **TOTALT/år** | **7 560 kr + saknade tjänster** |

**Slutsats:** Bolagsverket FIL är 8x billigare och ger ALLT vi behöver!

#### **Option 4: Manual input för ALLT** 👥 ✅ **BILLIGAST (MVP)**
| Datakälla | Kostnad |
|---|---|
| Bolagsverket grunddata (leverantörer) | **GRATIS** ✅ |
| Manual input ägardata (kunden anger själv) | **GRATIS** ✅ |
| Manual input närstående (make/maka/barn) | **GRATIS** ✅ |
| BankID-signering på uppgifter | **GRATIS** ✅ |
| Bankgiro-lookup | **Gratis** (egen databas) |
| Skatteverket API | **Gratis** |
| **TOTALT/år** | **0 kr** 🎉 |

**Nackdel:** Kunden kan ljuga (men BankID-signering gör det straffrättsligt)  
**Fördel:** Perfekt för MVP/LIA-demo innan vi investerar i SPAR/Roaring

---

## 🔄 Uppdaterad Layering-analys flöde

### **Vår implementation (med begränsningar):**

```
1. BANKUTDRAG (från Fortnox/Visma/Bokio via OAuth2)
   ↓
2. EXTRAHERA BANKGIRO-TRANSAKTIONER
   - Regex: /\d{3,4}-\d{4}/
   - Identifiera in- och utbetalningar
   ↓
3. BANKGIRO → FÖRETAGS-ID LOOKUP
   - Kolla egen databas först
   - Om saknas: Be kund ange manuellt
   - Spara i databas för framtida användning
   ↓
4. BOLAGSVERKET GRATIS API: GRUNDDATA
   - Företagsnamn, adress, SNI-kod, status
   - ✅ Räcker för att validera att företaget finns
   ↓
5. ROARING.IO API: ÄGARDATA (1 anrop per klient)
   - Hämta styrelse och verkliga huvudmän
   - Kostnad: 3,60 kr per klient
   - ELLER: Manual input från kund (gratis)
   ↓
6. JÄMFÖR MOT KUNDS PERSONNUMMER
   - Är kunden styrelseledamot i mottagarföretaget?
   - Är kunden verklig huvudman?
   - Är kundens make/maka/barn (om folkbokföringsdata finns)?
   ↓
7. DETEKTERA CIRKULÄRA TRANSAKTIONER
   - Kund → Företag A → Företag B → Kund
   - Tidsfönster: 90 dagar
   ↓
8. FLAGGA MISSTÄNKT LAYERING
   - Låg risk: 1-2 träffar (dokumentera)
   - Medel risk: 3-5 träffar (begär förklaring)
   - Hög risk: >5 träffar (rapportera enligt AML-lag)
```

**Skillnad från tidigare:**
- ⚠️ Bolagsverket GRATIS ger endast grunddata (inte ägare/styrelse)
- ✅ Roaring.io används **endast** för ägardata (1 anrop/klient = billigt)
- ✅ Bolagsverket GRATIS för leverantörsvalidering (obegränsat)

---

## 🚀 Nästa steg

### **Prio 1: Bolagsverket API** ✅
- [x] Sandlåda testad
- [x] PROD API fungerar
- [x] Dokumentation klar

### **Prio 2: Bankgirot API** ⏳
- [x] Påminnelse skickad 2025-10-20
- [ ] Väntar på svar från Bankgirot
- [ ] Om inget svar inom 2 veckor: Bygg egen databas

### **Prio 3: Skatteverket API** 🔑
- [x] Sandlådenycklar erhållna
- [x] Enskild firma-ansökan skickad 2025-10-21
- [ ] Väntar på Bolagsverket-godkännande
- [ ] Testa OAuth2-flöde i sandlåda

### **Prio 4: Egen Bankgiro-databas** 🏗️
- [ ] Skapa databasschema
- [ ] Implementera manuell Bankgiro-input vid onboarding
- [ ] Bygga scraping-script för Bolagsverket/företagshemsidor
- [ ] Crowdsourcing-strategi för att dela data

---

## 📚 Relaterad dokumentation

- `/docs/VALIDATION_TESTS_NEW.md` - Test 4.1: Layering (Penningtvätt via närstående företag)
- `/docs/API_INTEGRATION/Bolagsverket/README.md` - Bolagsverket API setup
- `/Skatteverket/KOMPLETT_SETUP_GUIDE.md` - Skatteverket OAuth2 setup
- `/Skatteverket/LENA_UPPDATERING_2025-10-20.md` - Status från Lena på Skatteverket

---

## 🎯 Slutsats (UPPDATERAD med Bolagsverket FIL-pris)

**Bolagsverkets FIL-hämtning är PERFEKT för oss!**  
**600 kr baslyft + 900 kr/år = ALLT vi behöver för ägardata och styrelseuppgifter.**

**Vår uppdaterade strategi:**

### **För MVP/LIA-demo (0 kr/år):** 👥
1. ✅ **Bolagsverket Gratis API** - Grunddata (namn, adress, SNI-kod, status)
2. ✅ **Manual input från kund** - Ägardata och närstående
3. ✅ **BankID-signering** - Kunden bekräftar att uppgifterna är korrekta
4. ⏳ **Bankgirot API** - Väntar på svar, annars egen databas
5. 🔑 **Skatteverket API** - Gratis, väntar på Enskild firma-registrering

**Resultat:** 
- **0 kr/år** för MVP
- Kunden anger själva närstående och ägardata
- BankID-signering gör det straffrättsligt att ljuga
- Perfekt för LIA-demo och proof-of-concept

---

### **För Production v1.0 (900 kr/år):** 🚀 **UPPDATERAD - BILLIGARE!**
1. ✅ **Bolagsverket FIL "Allt"** - Baslyft (600 kr) + Avisering (900 kr/år)
   - Grunddata ✅
   - Styrelseuppgifter ✅
   - Ägarstruktur (verkliga huvudmän) ✅
   - Dagliga uppdateringar ✅
2. 👥 **Manual input** - Make/maka/barn (SPAR-alternativ för v2.0)
3. 🏗️ **Egen Bankgiro-databas** - Byggs över tid
4. 🔑 **Skatteverket API** - Gratis

**Resultat:**
- **1 500 kr första året, sedan 900 kr/år** 🎉
- **Spara 15 500 kr/år** jämfört med API
- **Spara 6 660 kr/år** jämfört med Roaring.io
- Fullständig ägardata och styrelseuppgifter
- Manual input endast för närstående (familjerelationer)

---

### **För Production v2.0 (1 400-2 900 kr/år):** 💼 **FULL AUTOMATION**
1. ✅ **Bolagsverket FIL "Allt"** - 900 kr/år (efter första året)
2. ✅ **SPAR** - Make/maka-relationer (500-2 000 kr/år, offert behövs)
3. 👥 **Manual input** - Barn/föräldrar/syskon (SPAR ger inte detta)
4. 🏗️ **Egen Bankgiro-databas** - Omfattande efter 1-2 år
5. 🔑 **Skatteverket API** - Gratis

**Resultat:**
- **1 400-2 900 kr/år** total kostnad
- **Spara 4 660-6 160 kr/år** jämfört med Roaring.io
- Automatisk validering av make/maka via SPAR
- Manual input endast för barn/föräldrar/syskon

---

## 📋 Nästa steg

### **Prio 1: Teckna Bolagsverket FIL-avtal** ✅ **GÖR DETTA NU**
- [ ] Kontakta Linda Melin (api@bolagsverket.se)
- [ ] Beställ Baslyft "Allt" (600 kr)
- [ ] Teckna Avisering "Allt" (900 kr/år)
- [ ] Bygg import-script för att ladda data till lokal databas
- [ ] Bygg API-wrapper för snabba uppslag

### **Prio 2: MVP med manual input** ✅ **PARALLELLT**
- [x] Bolagsverket Gratis API fungerar
- [ ] Implementera manual input-formulär för närstående
- [ ] BankID-signering på uppgifter
- [ ] Bygg layering-analys med manuella uppgifter

### **Prio 3: Ansök om SPAR-avtal** 📝 **EFTER PRODUCTION v1.0**
- [ ] Kontakta SPAR-nämnden
- [ ] Förklara use case: AML/KYC-compliance enligt penningtvättslagen
- [ ] Argumentera som "compliance-företag" liknande kreditupplysningsföretag
- [ ] Begär offert för ~100 uppslag/år

### **Prio 4: Skippa Roaring.io** ✅ **ONÖDIGT NU**
- ~~Roaring.io~~ - Bolagsverket FIL är billigare och ger ALLT vi behöver!
- Eventuellt håll som backup/validering i framtiden

---

## 🎯 Rekommendation för dig just nu:

**GÖR DETTA:**
1. ✅ Kontakta Linda Melin och beställ Bolagsverket FIL
2. ✅ Slutför Enskild firma-registrering hos Bolagsverket
3. ✅ Testa Skatteverket Sandlåda när godkänd
4. ✅ Implementera manual input-formulär i React-appen
5. ✅ Lägg till BankID-signering på närstående-uppgifter
6. ✅ Bygg layering-analys med mock data för LIA-demo

**VÄNTA MED DETTA:**
- ⏸️ SPAR-ansökan (kan göras efter Production v1.0 fungerar)
- ⏸️ Roaring.io-köp (onödigt, Bolagsverket FIL är bättre och billigare)

**Total kostnad för MVP:** **0 kr** 🎉  
**Total kostnad för Production v1.0:** **1 500 kr första året, sedan 900 kr/år** 🎉
