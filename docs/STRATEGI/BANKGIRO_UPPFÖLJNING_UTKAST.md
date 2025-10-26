# Bankgiro - Uppföljningsmejl Utkast

**Datum:** 2025-10-26
**Status:** UTKAST - För granskning innan skickas
**Kontext:** 3 mejl skickade, inget svar på prisfrågor

---

## Mejlhistorik

1. **Första mejlet:** ✅ Bekräftelse mottagen
   - Svar: Bulknedladdning finns + veckovisa uppdateringar per mejl

2. **Andra mejlet:** ❌ Prisfråga obesvarat

3. **Tredje mejlet:** ❌ Påminnelse "Du har glömt mig" obesvarat

---

## Utkast 1: Professionell och tålmodig (REKOMMENDERAD)

**Ämne:** Uppföljning: Prisfråga för Bankgiro-databas

---

Hej,

Jag hoppas allt är bra!

Jag följer upp min tidigare förfrågan om pris och villkor för Bankgiros databastjänst (bulknedladdning + veckovisa uppdateringar).

**Bakgrund:**
Vi utvecklar en KYC/AML-compliance-lösning för svenska bokföringsbyråer och behöver kunna matcha bankgironummer mot organisationsnummer för att validera företagstransaktioner.

Från er första bekräftelse förstår jag att ni erbjuder:
- Bulknedladdning av hela databasen
- Veckovisa uppdateringar per mejl

**Mina frågor:**
1. Vad kostar bulknedladdningen (engångskostnad)?
2. Vad kostar de veckovisa uppdateringarna (årlig kostnad)?
3. Vilket format levereras datan i (CSV, XML, JSON)?
4. Hur ser avtalstiden ut (årsavtal, månadsavtal)?
5. Finns det någon teknisk dokumentation att ta del av?

**Alternativ om det inte passar:**
Om Bankgirot inte erbjuder denna typ av datadelning för externa företag är det såklart helt förståeligt. I så fall uppskattar jag ett tydligt besked så att vi kan utforska alternativa lösningar.

Tack för er tid och jag ser fram emot att höra från er!

Med vänliga hälsningar,
Lasse
Celestial AB
lasse@celestial.se

---

## Utkast 2: Kort och direkt (om du vill vara mer koncis)

**Ämne:** Svar på prisfråga efterfrågas - Bankgiro-databas

---

Hej,

Jag har skickat två tidigare mejl om priser för Bankgiro-databasen (bulknedladdning + veckovisa uppdateringar) men har inte fått svar ännu.

Kan ni meddela:
- Pris för bulknedladdning
- Årskostnad för uppdateringar
- Om tjänsten är tillgänglig för externa företag

Om tjänsten inte är tillgänglig uppskattar jag ett kort besked så att jag kan planera vidare.

Tack!

Lasse
Celestial AB
lasse@celestial.se

---

## Utkast 3: Diplomatisk avslutning (om du vill ge dem en "sista chans")

**Ämne:** Sista uppföljning: Bankgiro-databas prisfråga

---

Hej igen,

Jag har följt upp min förfrågan om Bankgiro-databasen några gånger nu utan svar. Jag förstår att ni kanske har mycket att göra eller att tjänsten eventuellt inte är tillgänglig för externa företag.

**Deadline för svar:** Fredag 1 november 2025

Om jag inte hör från er senast denna fredag kommer jag att anta att tjänsten inte är tillgänglig och utforska andra lösningar istället.

Jag uppskattar verkligen om ni kan ge ett kort besked åt endera hållet!

Tack för förståelsen.

Vänliga hälsningar,
Lasse
Celestial AB
lasse@celestial.se

---

## Rekommendation

**Jag rekommenderar Utkast 1** av följande skäl:

✅ **Professionell ton** - Visar att du är seriös
✅ **Tydliga frågor** - Lätt för dem att svara
✅ **Ger dem en "ut"** - Om tjänsten inte finns är det okej
✅ **Inte pressande** - Bygger goodwill för framtida samarbeten
✅ **Visar förståelse** - "Helt förståeligt om det inte passar"

**Undvik:**
❌ Låta frustrerad (även om du är det)
❌ Ge ultimatum (Utkast 3) - kan stänga dörrar
❌ Vara för kortfattad (Utkast 2) - kan uppfattas abrupt

---

## Nästa steg beroende på svar

### Om de svarar med pris:
1. Jämför med kostnaden för egen databas-implementation
2. Förhandla om pris är för högt
3. Be om teknisk dokumentation och exempel-data

### Om de säger "Ej tillgängligt för externa":
1. Acceptera svaret professionellt
2. Tack för deras tid
3. Implementera egen Bankgiro-databas enligt plan i DATAKÄLLOR_STRATEGI.md

### Om de fortsätter att inte svara (efter Utkast 1):
1. Skicka Utkast 3 efter 1 vecka
2. Om fortfarande inget svar efter deadline → Ge upp
3. Dokumentera: "Bankgirot svarade inte, bygger egen lösning"
4. Implementera egen databas med crowdsourcing + scraping

---

## Implementation av egen Bankgiro-databas (Plan B)

Om Bankgirot inte svarar, se DATAKÄLLOR_STRATEGI.md sektion 5 för detaljer:

**Datakällor:**
1. Kund anger vid onboarding (manuell input)
2. Scraping från bolagsverket.se (vissa företag listar Bankgiro)
3. Scraping från företagshemsidor
4. Crowdsourcing mellan bokföringsbyråer

**Förväntad tillväxt:**
- 100 klienter = ~2 000-5 000 Bankgiro-mappningar
- Efter 1 år = Majoriteten av svenska företags Bankgiro

**Kostnad:** 0 kr (egen implementation)

---

**Välj vilket utkast du vill använda och skicka!**
