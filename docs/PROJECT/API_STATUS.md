# API-status för Onboarding App

**Uppdaterad:** 2025-10-20

---

## 📊 Översikt API-integrationer

| API | Status | Kostnad | Nästa steg |
|-----|--------|---------|------------|
| **Bolagsverket** | ✅ **PROD KLART** | GRATIS | Backend-integration |
| **Skatteverket** | 🔄 Väntar på Lena | GRATIS API | Test när nycklar klara |
| **Bankgirot** | ⏳ Väntar på svar | ??? kr | Påminnelse skickad 2025-10-20 |
| **Klarna Open Banking** | ❌ Avvisad | N/A | Ingen åtgärd |

---

## ✅ Bolagsverket - Värdefulla datamängder

### Status: **PRODUCTION READY** 🎉

**Credentials:**
- Client ID: `EJ2Z7mTfXwSfwceewkfCGjI9rToa`
- Client Secret: `qVTWmiuF1Rxfykt9MUX0OOZLVmQa`
- Token endpoint: `https://portal.api.bolagsverket.se/oauth2/token`

**Test-resultat:**
- ✅ Token-hämtning fungerar
- ✅ Bearer token-type
- ✅ 3600s expiry (1 timme)

**Data som tillhandahålls:**
- ✅ Organisationsnummer
- ✅ Företagsnamn
- ✅ Adress
- ✅ Verksamhetsbeskrivning

**Data som INTE ingår (betalversion 5000 kr + 1000 kr/mån):**
- ❌ Ägarstruktur
- ❌ Styrelseuppgifter
- ❌ Dagliga uppdateringar

**Lösning:**
- Använd gratis API för grunddata
- Manuell input för ägarstruktur/styrelse (realistiskt ändå pga PML)

**Nästa steg:**
1. Skapa backend-service för API-anrop
2. Implementera token-caching
3. Skapa endpoint för org.nr-sökning
4. Integrera med frontend

**Dokumentation:**
- `/Bolagsverket/README.md`
- `/Bolagsverket/API_TEST_RESULTS.md`
- `/Bolagsverket/CREDENTIALS_STATUS.md`

---

## ✅ Skatteverket - Skattekonto API

### Status: **FULLSTÄNDIGT FUNGERANDE!** 🎉🎉🎉 (2025-10-20)

**Test-credentials:**
- OAuth2 Client ID: ✅ 11a90b8849a912ea045b97597701cead83bd69f7b8a7df68
- OAuth2 Client Secret: ✅ 5d4b7894e65653d223d14ba12219e4361eb40ed528a7cead83bd69f7b8a7df68
- APIgw Client ID: ✅ ed6e1114-0e19-4103-b518-035ae5ef8eed
- APIgw Client Secret: ✅ 45e8647d-f61d-4a4b-ab2f-4781f2224435
- Test-certifikat: ✅ 68e28fae0d034.p12 (Bolag A, PIN: 6323251803413456)

**Test-resultat (2025-10-20):**
- ✅ **Token-hämtning:** SUCCESS (Bearer token, 3600s)
- ✅ **API-anrop:** SUCCESS (202 Accepted)
- ✅ **Certifikat-auth:** Fungerar perfekt
- ✅ **Correlation ID:** Fungerar
- ✅ **APIgw credentials:** Verifierade

**Lena's uppdateringar:**
- **Datum:** 2025-10-20 (IDAG!)
- **Från:** Lena Erlandsson, Skatteverket
- **Aktiverat:** 
  - ✅ Skattekonto API (skahmst scope)
  - ✅ Redirect-URI:er (ACG möjligt!)
  - ✅ Access utökat: sysorg, org, per
  - ✅ Scopes utökade: ska, skahmst

**Fungerande test-skript:**
- ✅ `test_tax_ccg_FIXED.py` ⭐ **ANVÄND DENNA!**
  - Token-hämtning med certifikat ✅
  - API-anrop med certifikat ✅
  - Timeout-hantering ✅
  - Tydlig output ✅

**Viktigt tekniskt:**
- ⚠️ **Certifikat MÅSTE användas för ALLA anrop** (token + API)
- ⚠️ Original-skripten saknade certifikat för API-anrop → timeout
- ✅ test_tax_ccg_FIXED.py löser detta med persistent session

**Nästa steg:**
1. ✅ ~~TESTA CCG~~ - KLART!
2. ✅ ~~Dokumentera resultat~~ - KLART!
3. 🔄 Testa /hamta endpoint (hämta faktisk data)
4. 💡 Utforska ACG-implementation för BankID-login
5. 📧 Beställ prod-certifikat från Expisoft (~1800 kr)
6. 📝 Ansök om prod-nycklar när certifikat levererat

**Dokumentation:**
- `/Skatteverket/KOMPLETT_SETUP_GUIDE.md` ⭐ **LÄSMATERIAL!**
  - Allt du behöver veta om Skatteverket API
  - Teknisk implementation
  - Felsökning
  - Best practices
- `/Skatteverket/TEST_RESULTAT_2025-10-20.md`
- `/Skatteverket/LENA_UPPDATERING_2025-10-20.md`
- `/Skatteverket/AGC.txt` (225 rader)
- `/Skatteverket/CCG.txt` (396 rader)
- `/Skatteverket/BESTÄLL_PROD_CERTIFIKAT.md`
- `/Skatteverket/ANSÖK_PROD_NYCKLAR.md`

---

## ⏳ Bankgirot - Bankgironummer på fil

### Status: **VÄNTAR PÅ SVAR** (påminnelse skickad)

**Kontaktperson:**
- Simon @ Bankgirot

**Senaste kontakt:**
- **Första förfrågan:** ~2025-10-08 (12 dagar sedan)
- **Påminnelse skickad:** 2025-10-20 13:41

**Tjänst av intresse:**
```
Bankgironummer på fil
- Grundladdningsfil med alla publika bankgironummer
- Namn, adress, OCR-koppling, etc.
- Uppdateringsfiler varje bankdag (senaste 24h ändringar)
- Håller register uppdaterat
```

**Frågor till Bankgirot:**
1. Vad kostar tjänsten?
2. Hur beställer man?
3. Format på filerna? (JSON, CSV, XML?)
4. API-access eller filöverföring?
5. Uppdateringsfrekvens?

**Användningsområde i appen:**
- Validera bankgironummer vid onboarding
- Kontrollera att bankgiro är aktivt
- Automatisk ifyllning av företagsnamn från bankgiro

**Alternativ om för dyrt:**
- Manuell input av bankgironummer
- Använd endast Bolagsverket för företagsdata
- Låt kund själv verifiera bankgiro

**Nästa steg:**
1. ⏳ Vänta på Simons svar (påminnelse skickad)
2. 💰 Utvärdera kostnad vs nytta
3. 🤔 Beslut om implementation

---

## ❌ Klarna Open Banking

### Status: **EJ AKTUELLT**

**Resultat:**
- Kräver Payment Service Provider (PSP) licens
- INTE tillgängligt för enskild firma/hobbyverksamhet
- Komplex compliance-process

**Beslut:**
- Ingen åtgärd
- Fokusera på Bolagsverket + Skatteverket istället

**Alternativ för framtiden:**
- Om app blir kommersiell produkt
- Partnership med etablerad PSP
- Eller använd tredjepartstjänst

---

## 🎯 Prioritering

### HÖG PRIORITET (behövs för LIA):
1. ✅ **Bolagsverket** - KLART! Integrera i backend nu
2. 🔄 **Skatteverket** - Vänta på Lena, testa när klart

### MEDEL PRIORITET (nice-to-have):
3. ⏳ **Bankgirot** - Beror på kostnad

### LÅG PRIORITET:
4. ❌ **Klarna** - Ej aktuellt

---

## 📅 Tidsplan

### Denna vecka:
- [x] Påminnelse till Bankgirot
- [ ] Vänta på svar från Lena (Skatteverket)
- [ ] Börja backend-integration Bolagsverket

### Nästa vecka (om svar från Lena):
- [ ] Testa Skatteverket test-API
- [ ] Beställ prod-certifikat (Expisoft)
- [ ] Fortsätt frontend-slides

### Om 2-3 veckor:
- [ ] Prod-certifikat levererat
- [ ] Ansök prod-nycklar Skatteverket
- [ ] Komplett backend-integration

---

## 💡 Lessons Learned

### Vad fungerat bra:
- ✅ Bolagsverkets gratis API är perfekt för vårt användningsfall
- ✅ Tydlig dokumentation hjälper mycket
- ✅ Test-miljöer gör det säkert att utveckla

### Utmaningar:
- ⏳ Långa svarstider från myndigheter/leverantörer
- 💰 Oklara priser (måste fråga)
- 📧 Behöver ofta påminna för svar

### Tips för framtida API-integrationer:
1. Kolla ALLTID pris/villkor FÖRST
2. Testa i test-miljö innan prod-ansökan
3. Dokumentera ALLT (credentials, endpoints, resultat)
4. Följ upp kontakter om inget svar på 1 vecka
5. Ha backup-plan om API inte funkar/är för dyrt

---

## 📞 Kontakter

| Organisation | Person | E-post | Status | Senaste kontakt |
|--------------|--------|--------|--------|-----------------|
| Bolagsverket | - | - | ✅ Funkar | Credentials mottagna |
| Skatteverket | Lena Erlandsson | api@skatteverket.se | ✅ Klart | 2025-10-20 aktivering |
| Bankgirot | Simon | simon@bankgirot.se | ⏳ Påmind | 2025-10-20 13:41 |
| Expisoft | Support | support@expisoft.se, 08-446 47 00 | � Ringde | 2025-10-20 |
| Klarna Kosma | Developer Support | - | 📧 Väntar | Registrering påbörjad |

---

## 🚀 När allt är klart

**MVP (Minimum Viable Product):**
- ✅ Bolagsverket API
- ⏳ Skatteverket test-API
- Frontend med riktiga API-anrop
- = **Bra nog för LIA-presentation!**

**Full produktion:**
- ✅ Bolagsverket prod
- 🔄 Skatteverket prod (certifikat + ansökan)
- ⏳ Bankgirot (om pris OK)
- = **Redo för riktiga kunder!**

---

*Dokumentet uppdateras löpande när status ändras.*
