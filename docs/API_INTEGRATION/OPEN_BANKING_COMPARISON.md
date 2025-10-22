# Open Banking Leverantörer - Jämförelse för LIA-projekt

**Datum:** 2025-10-20  
**Syfte:** Välja rätt Open Banking-leverantör för Onboarding App  
**Användningsfall:** AML/KYC compliance - transaktionshistorik från företagskonton

---

## 📋 Kontaktade leverantörer

### ✅ Open Payments - "Build" Plan
**Status:** Kontaktbegäran skickad 2025-10-20

**Vad ingår i "Build":**
- ✅ Sandbox environment
- ✅ Production environment
- ✅ Use their license (ingen egen PSD2-licens behövs!)
- ✅ **100 FREE transactions in production** 🎉
- ✅ AIS (Account Information Service) - hämta kontoinformation
- ✅ PIS (Payment Initiation Service) - initiera betalningar
- ✅ Open Link accessibility
- ✅ **Corporate accounts** (företagskonton) ⭐
- ✅ Private accounts (privatkonton)
- ✅ Own UI/UX
- ✅ Start-up support

**Fördelar för ditt projekt:**
- 100 gratis transaktioner = perfekt för demo/MVP
- Corporate accounts = exakt vad du behöver
- Startup-support = hjälp att komma igång
- Egen licens = du behöver inte söka PSD2-licens själv

**Väntar på:**
- Pricing efter 100 transactions
- Detaljerad onboarding-process
- Svenska banker support
- API dokumentation access
- Kontakt från sales team

---

### ✅ Noda
**Status:** Email skickad 2025-10-20

**Mejl innehåll:**
- Presentation: Bokföringsstudent, begränsad budget
- Användningsfall: AML-compliance onboarding app
- Fråga: Pricing för startups/students
- Behov: Svenska företagskonton, transaktionsdata

**Vad vi vet om Noda:**
- EU/Nordisk licensierad
- PSD2-compliant
- Svenska banker
- Corporate account support
- Usage-based pricing (troligen)

**Väntar på:**
- Pricing information
- Free tier eller startup-rabatt?
- Onboarding process
- API access detaljer
- Svenska banker lista
- Sandbox tillgång

---

## 🔄 Andra alternativ (ej kontaktade än)

### Tink (Visa-ägd)
**Varför inte kontaktat:**
- Enterprise-fokus
- Troligen för dyrt för hobby/LIA
- Kräver ofta enterprise-avtal
- Overkill för MVP

**Om användbart:**
- Bäst tekniskt
- Alla svenska banker
- Mest etablerad i Norden
- Excellent dokumentation

**När kontakta:**
- Om Open Payments + Noda för dyra
- Om projektet växer till riktig produktion
- Om behov av enterprise-support

---

### Klarna Open Banking
**Status:** Klarna Kosma nedlagt 2023

**Varför inte prioriterat:**
- Klarna Kosma (brand) nedlagt 2023
- Open Banking nu del av Klarna huvudprodukt
- Mer konsument-fokus än B2B
- Osäkert om corporate accounts i fokus
- Andra leverantörer mer lämpliga

---

## 📊 Bedömningskriterier

### Kritiskt (Must-have):
- ✅ **Corporate accounts** (företagskonton) - Absolut nödvändigt
- ✅ **Svenska banker** (SEB, Handelsbanken, Swedbank, Nordea)
- ✅ **Transaktionshistorik** (för AML-kontroller)
- ✅ **PSD2-compliant** (Finansinspektionen-godkänd)
- ✅ **Rimligt pris** för hobby/LIA (under 500 kr/mån eller usage-based)

### Viktigt (Should-have):
- ✅ **Sandbox environment** (för development)
- ✅ **Free tier** eller startup-rabatt
- ✅ **Good documentation** (svenska eller engelska)
- ✅ **API-first approach**
- ✅ **Start-up support**

### Nice-to-have:
- Own UI/UX control
- PIS (Payment Initiation) - inte kritiskt för MVP
- Multi-country support - fokus Sverige först
- Advanced analytics - kan bygga själv

---

## 💰 Pris-uppskattningar (från research)

### Open Payments "Build"
**Känt:**
- 100 FREE transactions in production ✅
- Sandbox included ✅
- Startup support included ✅

**Okänt (väntar på svar):**
- Pris per transaktion efter 100?
- Månadskostnad (om någon)?
- Volymrabatter?

**Uppskattning baserat på marknad:**
- Troligen €0.10-0.50 per transaction efter free tier
- Eller fast pris ~€50-200/månad
- **Bedömning:** Sannolikt rimligt för hobby

---

### Noda
**Känt:**
- Usage-based pricing (från research)
- Nordisk fokus (troligen billigare än pan-EU)

**Okänt (väntar på svar):**
- Exakt pris per transaction?
- Free tier?
- Månadskostnad?
- Startup-rabatt?

**Uppskattning:**
- Troligen liknande Open Payments
- Kanske något billigare (nordisk specialisering)
- **Bedömning:** Förmodligen rimligt för hobby

---

### Tink (för jämförelse)
**Känt från research:**
- Enterprise-fokus
- Ofta fast pris från €500-1000+/månad
- Volymavtal nödvändiga
- Custom pricing

**Bedömning:** För dyrt för LIA/hobby ❌

---

## 🎯 Preliminär rekommendation (innan svar)

### Om Open Payments svarar först OCH pricing OK:
→ **Välj Open Payments** ⭐
- 100 free transactions perfekt för MVP
- Corporate accounts ✅
- Startup support ✅
- Etablerad EU-spelare
- Allt du behöver ingår

### Om Noda svarar först OCH erbjuder bättre deal:
→ **Välj Noda** ⭐
- Nordisk specialist
- Troligen mer personlig support
- Kanske billigare
- Svenska banker fokus

### Om båda dyra eller inte svarar:
→ **Fokusera på Bolagsverket + Skatteverket** för MVP ✅
- Redan 2 fungerande myndighets-API:er
- Tillräckligt för LIA-demo
- Lägg till Open Banking i v2.0

---

## 📅 Nästa steg

### Kortsiktigt (denna vecka):
- [ ] Invänta svar från Open Payments (1-3 dagar)
- [ ] Invänta svar från Noda (1-3 dagar)
- [ ] Jämför pricing när båda svarat
- [ ] Beslut: Vilken leverantör eller skippa för MVP?

### När svar mottaget:
- [ ] Läs dokumentation
- [ ] Testa sandbox
- [ ] Utvärdera API-kvalitet
- [ ] Kolla svenska banker support
- [ ] Beslut: Implementera eller vänta till v2.0?

### Om implementera:
- [ ] Registrera konto
- [ ] API keys
- [ ] Sandbox integration
- [ ] Test med mock data
- [ ] Production planning

---

## 🤔 Beslutskriterier

### Implementera NU om:
- ✅ Pris under 500 kr/mån eller bra usage-based
- ✅ Free tier med tillräckligt transactions för demo
- ✅ God dokumentation
- ✅ Snabb onboarding (< 1 vecka)
- ✅ Svenska företagskonton bekräftat
- ✅ Har tid att implementera före LIA-presentation

### Vänta till v2.0 om:
- ❌ Pris över 1000 kr/mån
- ❌ Krånglig onboarding (certifieringar, avtal, etc.)
- ❌ Dålig dokumentation
- ❌ Osäkert om svenska företagskonton
- ❌ Tidsbrist innan LIA
- ✅ Bolagsverket + Skatteverket räcker för demo

---

## 💡 Rekommendation för LIA-presentation

**MVP (Minimum Viable Product):**
```
✅ Bolagsverket API (prod)
✅ Skatteverket API (test)
✅ Manual input för ägarstruktur (PML kräver ändå manuell verifiering)
= HELT OK för att demonstrera koncept!
```

**Med Open Banking (om rimligt pris):**
```
✅ Bolagsverket API
✅ Skatteverket API
✅ Open Banking (transaktioner)
= IMPONERANDE demo!
```

**Men viktigast:**
- Fungerande onboarding-flow ✅
- State machine (XState) ✅
- Modern UI ✅
- Real API-integration ✅ (2 myndighets-API:er)
- Good documentation ✅

**Open Banking är "cherry on top", inte nödvändigt för godkänt LIA!** 🍒

---

## 📞 Kontaktinfo

**Open Payments:**
- Website: https://openpayments.io (troligen)
- Status: Väntar på kontakt via "Build" plan
- Kontaktformulär skickat: 2025-10-20

**Noda:**
- Website: https://noda.se / https://noda.eu
- Status: Email skickad 2025-10-20
- Email: [deras support email]

**Uppdateras när svar mottages!**

---

*Skapad: 2025-10-20 | Uppdateras löpande*
