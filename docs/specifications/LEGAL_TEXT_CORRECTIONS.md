# Korrigeringar av Lagtexter

**Skapad:** 2025-01-29
**Syfte:** Dokumentera felaktigheter i React-komponenter och korrekta lagtexter

---

## 🔴 Felaktighet #1: "Kontanthanteringslagen"

### Problem
GitHub Copilot Claude använde "Kontanthanteringslagen" i flera komponenter.

**Felaktiga påståenden:**
- "Kontanthantering över 20% av omsättningen kräver tillstånd från Skatteverket"
- "Det är OTILLÅTET att hantera kontanter utan särskilt tillstånd"
- Referens till "Skatteförfarandelagen 39 kap" (felaktig kontext)

### Fakta
❌ Det finns **INGEN lag som heter "Kontanthanteringslagen"** i Sverige
❌ Det krävs **INGET tillstånd från Skatteverket** för att hantera kontanter
❌ 20%-gränsen har **INGEN lagstadgad grund**

### Korrekt Lagtext

**Vad som faktiskt gäller för kontanter:**

1. **Penningtvättslagen (2017:630) 3 kap. 6 §** - Kundkännedom vid kontanttransaktioner
   - Gräns: ≥5000 euro per transaktion
   - Krav: Kundkännedom måste inhämtas

2. **Kontanthanteringslag (2019:650)** - Kassaregister
   - Gäller för vissa branscher (detaljhandel, restaurang, frisör, etc.)
   - Krav: Kassaregister måste användas

3. **Bokföringslagen (1999:1078) 5 kap.** - Dokumentation
   - Alla transaktioner (oavsett betalsätt) måste dokumenteras

### Korrigering

**Status:** ✅ Fixat 2025-01-29

**Filer som ändrats:**
- `RiskFragorSteg4Slide.jsx` - Bytt "Kontanthanteringslagen" mot PTL 3 kap. 6 §
- `SkyldigheterSlide.jsx` - Bytt "tillstånd från Skatteverket" mot korrekt lagtext

**Använd lagtext:**
```
PTL 3 kap. 6 § - Kundkännedom vid kontanttransaktioner
Kontanter (≥5000 euro per transaktion) kräver kundkännedom enligt PTL 3 kap. 6 §.
Kontanter innebär sämre spårbarhet och högre anonymitet.
```

---

## 🔴 Felaktighet #2: Högriskländer "50%-regel"

### Problem
I RiskFragorSteg2Slide.jsx (Multistage wizard steg 2) motiveras frågan om utländska transaktioner med:

**Felaktigt påstående:**
> "Om mer än 50% av omsättningen sker mot högriskländer så krävs fördjupande frågor"

### Fakta
❌ Det finns **INGEN 50%-gräns** i PTL för högriskländer
❌ Det är **INTE beloppet** som avgör, utan **landet i sig**

### Korrekt Lagtext

**PTL 3 kap. 17 § 1-2 st. - Skärpta åtgärder vid högriskländer:**

```
17 § Skärpta åtgärder enligt 16 § ska vidtas vid affärsförbindelser eller enstaka
transaktioner när kunden är etablerad i ett land utanför EES som har identifierats
som ett högrisktredjeland av Europeiska kommissionen.

Sådana åtgärder ska åtminstone avse skärpning av övervakningen av pågående
affärsförbindelser och bedömningen av enstaka transaktioner enligt 4 kap. 1 § och
omfatta inhämtande av:

1. ytterligare information om kunden och den verkliga huvudmannen,
2. ytterligare information om affärsförbindelsens eller den enstaka transaktionens
   syfte och art,
3. information om kundens och den verkliga huvudmannens ekonomiska situation och
   varifrån kundens och den verkliga huvudmannens ekonomiska medel kommer, och
4. godkännande från en behörig beslutsfattare att etablera eller upprätthålla en
   affärsförbindelse.
```

**Klartext:**
- ✅ **ALLA transaktioner** med kunder etablerade i högriskländer kräver skärpta åtgärder
- ✅ **OAVSETT belopp** eller andel av omsättningen
- ✅ Skärpta åtgärder måste vidtas **redan vid etablering** av affärsförbindelsen

### Ytterligare Relevant Lagtext

**PTL 1 kap. 2 § 16 - När PTL gäller för kontanttransaktioner:**

```
16. yrkesmässig handel med varor, om det kan antas att det i verksamheten eller i
en del av verksamheten genomförs eller kommer att genomförs transaktioner, enstaka
eller sådana som kan antas ha samband, som innebär att ett utbetalt eller mottaget
belopp i kontanter uppgår till motsvarande 5 000 euro eller mer,
```

**PTL 3 kap. 6 § - Kundkännedom vid kontanter (förutsatt kund är "verksamhetsutövare"):**

```
6 § En verksamhetsutövare som avses i 1 kap. 2 § första stycket 16 ska, i stället
för vad som följer av 4 §, vidta åtgärder för kundkännedom

1. vid etableringen av en affärsförbindelse, om det när förbindelsen ingås är
   sannolikt eller under förbindelsens gång står klart att utbetalt eller mottaget
   belopp i kontanter inom ramen för affärsförbindelsen uppgår till motsvarande
   5 000 euro eller mer,

2. vid enstaka transaktioner där utbetalt eller mottaget belopp i kontanter uppgår
   till ett belopp motsvarande 5 000 euro eller mer, och

3. vid transaktioner där utbetalt eller mottaget belopp i kontanter understiger ett
   belopp motsvarande 5 000 euro och som verksamhetsutövaren inser eller borde inse
   har samband med en eller flera andra transaktioner i kontanter som tillsammans
   uppgår till minst detta belopp.

Lag (2021:903).
```

**Klartext:**
- ✅ 5000 euro-gränsen gäller för **kontanttransaktioner**
- ✅ Gäller **summan av transaktioner** som har samband (punkt 3)
- ✅ "Borde inse" = Om man har **anledning att misstänka** att transaktioner hör ihop

### Korrigering

**Status:** ⏳ Behöver fixas

**Fil som ska ändras:**
- `RiskFragorSteg2Slide.jsx` - Ta bort "50%-regeln" och använd korrekt lagtext

**Korrekt motivering för frågan:**

**FÖRE (felaktigt):**
```
Om mer än 50% av omsättningen sker mot högriskländer så krävs fördjupande frågor
```

**EFTER (korrekt):**
```
Lagstöd: PTL 3 kap. 17 §

ALLA transaktioner med kunder etablerade i högriskländer kräver skärpta åtgärder,
oavsett belopp eller andel av omsättningen. Skärpta åtgärder innebär:

- Ytterligare information om kunden och verkliga huvudmannen
- Information om transaktionens syfte och art
- Information om medlens ursprung
- Godkännande från behörig beslutsfattare

Dessutom: Vid kontanttransaktioner som kan antas uppgå till ≥5000 euro (enskilt eller
tillsammans med relaterade transaktioner) krävs kundkännedom enligt PTL 3 kap. 6 §.

Referens: [PTL_3_17] - Se Appendix för fullständig lagtext
```

---

## 📋 Sammanfattning av Felaktigheter

| # | Felaktighet | Korrekt Lagtext | Status |
|---|-------------|----------------|--------|
| 1 | "Kontanthanteringslagen" | PTL 3 kap. 6 § | ✅ Fixat |
| 2 | "Tillstånd från Skatteverket för kontanter" | Kundkännedom vid ≥5000 euro | ✅ Fixat |
| 3 | "50%-regel för högriskländer" | PTL 3 kap. 17 § (ALLA transaktioner) | ⏳ Behöver fixas |

---

## 🔗 Uppdaterad legalTexts.js

Alla korrekta lagtexter finns nu i:
```
/src/data/legalTexts.js
```

**Lagtexter som behöver läggas till:**

### högriskländer (PTL 3 kap. 17 §)

```javascript
hogrisklander: {
  id: "PTL_3_17",
  title: "Skärpta åtgärder vid högriskländer",
  law: "Penningtvättslagen (2017:630) 3 kap. 17 §",
  shortText: "ALLA transaktioner med kunder etablerade i högriskländer (identifierade av EU-kommissionen) kräver skärpta åtgärder, oavsett belopp.",
  fullText: `Penningtvättslagen (2017:630) 3 kap. 17 § - Skärpta åtgärder vid högriskländer

Skärpta åtgärder enligt 16 § ska vidtas vid affärsförbindelser eller enstaka transaktioner när kunden är etablerad i ett land utanför EES som har identifierats som ett högrisktredjeland av Europeiska kommissionen.

Sådana åtgärder ska åtminstone avse skärpning av övervakningen av pågående affärsförbindelser och bedömningen av enstaka transaktioner enligt 4 kap. 1 § och omfatta inhämtande av:

1. ytterligare information om kunden och den verkliga huvudmannen,
2. ytterligare information om affärsförbindelsens eller den enstaka transaktionens syfte och art,
3. information om kundens och den verkliga huvudmannens ekonomiska situation och varifrån kundens och den verkliga huvudmannens ekonomiska medel kommer, och
4. godkännande från en behörig beslutsfattare att etablera eller upprätthålla en affärsförbindelse.

VIKTIGT: Skärpta åtgärder gäller ALLA transaktioner med högriskländer, oavsett belopp eller andel av omsättningen.

Högriskländer definieras av EU-kommissionen och listas i FATF:s lista över högriskländer (uppdateras regelbundet).`,
  url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
}
```

---

## 📚 Källor

### Penningtvättslagen (2017:630)
- **1 kap. 2 § 16** - När PTL gäller (kontanttransaktioner ≥5000 euro)
- **3 kap. 6 §** - Kundkännedom vid kontanttransaktioner
- **3 kap. 17 §** - Skärpta åtgärder vid högriskländer

**URL:** https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/

### 01FS 2024:20 (Länsstyrelsen Stockholm)
- **2 kap. 4 §** - Riskbedömning av kunder
- **3 kap. 4 §** - Kontroll av kundens identitet

**URL:** https://www.lansstyrelsen.se/stockholm/om-oss/om-lansstyrelsen-stockholm/lanets-forfattningssamling/forfattningar-2024/forfattningssamling-2024/2024-06-03-01fs-202420.html

### FATF (Financial Action Task Force)
- Lista över högriskländer uppdateras regelbundet
- Används av EU-kommissionen för att identifiera högriskländer enligt PTL 3 kap. 17 §

**URL:** https://www.fatf-gafi.org/

---

## 🛠️ TODO - Fler Komponenter att Granska

GitHub Copilot Claude kan ha gjort liknande fel i andra komponenter. Granska:

- [ ] `RiskFragorSteg2Slide.jsx` - Högriskländer-motivering
- [ ] `RiskFragorSteg3Slide.jsx` - Kunder & partners
- [ ] `PEPSlide.jsx` - PEP-definitioner
- [ ] Alla alertblocks med lagtexter (sök efter "Lag:", "PTL", "§")

---

**Senast uppdaterad:** 2025-01-29
