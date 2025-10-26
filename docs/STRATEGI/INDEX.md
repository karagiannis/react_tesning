# STRATEGI - INDEX

**Princip:** Det som inte finns i detta index FINNS INTE!
**Skapad:** 2025-10-26
**Senast uppdaterad:** 2025-10-26 02:48

---

## Översikt

Denna mapp innehåller strategiska dokument för Celestial Onboarding App - långsiktiga beslut om teknologi, datakällor, arkitektur och affärsmodell.

---

## Strategidokument

### 1. BANKGIRO_UPPFÖLJNING_UTKAST.md

**Skapad:** 2025-10-26
**Status:** UTKAST - Mejl till Bankgirot (väntar på att skickas)

**Bakgrund:**
- 3 mejl skickade till Bankgirot utan svar på prisfrågor
- Första mejlet: ✅ Bekräftelse om bulknedladdning + veckovisa uppdateringar
- Andra mejlet: ❌ Prisfråga (obesvarat)
- Tredje mejlet: ❌ Påminnelse "Du har glömt mig" (obesvarat)

**Innehåll:**
- 3 mejl-utkast med olika toner:
  - **Utkast 1:** Professionell och tålmodig (REKOMMENDERAD)
  - **Utkast 2:** Kort och direkt
  - **Utkast 3:** Diplomatisk avslutning med deadline
- Plan B: Implementera egen Bankgiro-databas om inget svar
- Nästa steg beroende på Bankgirot-svar

**Nästa åtgärd:**
- Välj utkast och skicka uppföljning
- Om inget svar: Implementera egen databas enligt DATAKÄLLOR_STRATEGI.md

---

### 2. DATAKÄLLOR_STRATEGI.md

**Skapad:** 2025-10-21
**Status:** REFERENSDOKUMENT - Vissa delar föråldrade efter beslut om betallösning

**Innehåll:**
- Jämförelse mellan datakällor för KYC/AML
- Bolagsverket: Gratis API vs FIL-hämtning (600 kr + 900 kr/år)
- Roaring.io kostnadsjämförelse (7 560 kr/år)
- SPAR (make/maka-relationer) strategi
- Bankgiro-databas implementation
- Skatteverket API information
- Layering-analys flöde
- Kostnadsscenarier: MVP (0 kr), v1.0 (900 kr/år), v2.0 (1 400-2 900 kr/år)

**Relevans idag:**
- ✅ Teknisk information om API:er fortfarande giltig
- ✅ Layering-analys flöde relevant
- ⚠️ Kostnadsjämförelser mindre viktiga efter beslut om betallösning
- ⚠️ Användare betalar nu fast låg kostnad + per API-anrop

**Öppna frågor:**
- ❓ Bankgirot svarar inte på prisfrågor (3 mejl skickade, inget svar)
  - Första mejl: Bekräftelse om bulknedladdning + veckovisa uppdateringar
  - Andra mejl: Prisfråga (obesvarat)
  - Tredje mejl: Påminnelse "Du har glömt mig" (obesvarat)
- ❓ Ska vi ge upp Bankgirot och bygga egen databas istället?

**Användning:**
- Referens för tekniska implementationer
- Bakgrund till strategiska beslut
- Kostnadsanalys för framtida förhandlingar

---

## Framtida strategidokument

När nya strategiska beslut tas, dokumentera här:

- **PRISMODELL_STRATEGI.md** (planerad) - Beslut om användare betalar per API-anrop
- **SKALNINGS_STRATEGI.md** (planerad) - Hur vi skalar från 10 → 100 → 1000 kunder
- **DATA_RETENTION_STRATEGI.md** (planerad) - GDPR-compliant datalagring
- **API_PROVIDER_STRATEGI.md** (planerad) - När använda Roaring vs Bolagsverket vs SCB
- **BANKGIRO_STRATEGI.md** (planerad) - Om Bankgirot fortsätter att inte svara

---

## Relaterad dokumentation

- [../compliance/INDEX.md](../compliance/INDEX.md) - KYC/AML compliance krav
- [../specifications/INDEX.md](../specifications/INDEX.md) - Tekniska specifikationer
- [../PROJECT/](../PROJECT/) - Roadmap och projektplanering
- [../../external_apis/INDEX.md](../../external_apis/INDEX.md) - API-integrationer

---

**Det som inte finns i detta index FINNS INTE i STRATEGI-mappen!**
