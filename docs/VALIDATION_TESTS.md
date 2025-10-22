# Validerings- och Risktester

## 📋 Översikt
Detta dokument beskriver alla automatiska tester som körs för att validera bokföringsdata och identifiera misstänkta transaktioner enligt AML-regler (Anti-Money Laundering).

Testerna är kategoriserade i fyra huvudgrupper:
1. **SIE-filintegritet** - Teknisk validering av bokföringsfilerna
2. **Bokföringskompetens** - Identifierar okunniga bokförare (utan illvilja)
3. **Fuskindikationer** - Upptäcker medvetna försök att manipulera bokföringen
4. **Penningtvätt & Bedrägeri** - AML-kontroller och kundbedrägeri

---

## 🔐 Kategori 1: SIE-filintegritet

### Test 1.1: KSUMMA-validering
**Beskrivning:** Beräkna och verifiera #KSUMMA (kontrollsumma) i SIE-filen.

**Validering:** Ofta utelämnad av bokföringsprogram, men om den finns måste den stämma.

**Åtgärd:** Varna om KSUMMA saknas, flagga som fel om den finns men inte stämmer.

---

### Test 1.2: Debet/kredit-balans per post
**Beskrivning:** Varje bokföringspost måste balansera.

**Validering:** Debetomslutning + kreditomslutning = 0 för varje enskild post.

**Felmeddelande:** "Bokföringspost [verifikationsnummer] balanserar inte: Debet [X] kr, Kredit [Y] kr, Differens [Z] kr"

**Risk:** Inget bokföringsprogram tillåter obalanserade poster, men manuella korrigeringar kan skapa fel.

---

### Test 1.3: Ingående balans + transaktioner = utgående balans
**Beskrivning:** För varje konto ska IB + alla transaktioner = UB (huvudbokskontroll).

**Validering:** 
```
För konto X:
IB + Σ(debet) + Σ(kredit) = UB
```

**Felmeddelande:** "Konto [kontonummer] [kontonamn]: Beräknad UB [X] kr stämmer inte med rapporterad UB [Y] kr"

**Risk:** Indikerar korrupt SIE-fil eller manuella manipulationer.

---

### Test 1.4: Balansräkningens omslutning = 0
**Beskrivning:** Tillgångar minus skulder och eget kapital måste vara noll.

**Validering:** Σ(tillgångskonton) - Σ(skuldkonton + EK-konton) = 0

**Felmeddelande:** "Balansräkningen balanserar inte för räkenskapsår [år]: Differens [X] kr"

**Orsak:** Slarviga bokförare som rättar gamla poster men glömmer reversera "Årets resultat" till uppdaterat värde.

**Risk:** Indikation på slarvig bokföring vilket är en riskfaktor.

---

## ⚠️ Kategori 2: Bristande bokföringskompetens (Okunnig bokförare utan illvilja)

> **OBS:** Dessa fel kostar ofta extra att rätta upp och indikerar att kunden behöver mer stöd.



-------------------------------------------------------------------------

----------Okunnig bokförare utan illvilja (Kan kosta extra att rätta upp)------

# Gamla balanssaldon hänger kvar flera år
Endast ett kontointervall relaterat till det bundna egna kapitalet kan vara konstanta över räkenskapsåren såsom 
2080	Bundet eget kapital  (gruppkonto - för den som vill slå sammam)
2081	Aktiekapital
2082	Ej registrerat aktiekapital
2083	Medlemsinsatser
2084	Förlagsinsatser
2085	Uppskrivningsfond
2086	Reservfond
2087	Insatsemission
2087	Bunden överkursfond
2088	Fond för yttre underhåll
2089	Fond för utvecklingsutgifter

Alla nadra konton minskar eller ökar i värde. Ligger ett saldo konstant över mer än ett räkenskapsår så är det fel.

Typiskt för bokförare som inte kan bokföra slutskattebesked. Saldon på OBS-konto ligger kvar över konsekutiva räkenskapsår utan att korrigeras innan bokslut.
Gamla skulder hänger kvar som inte finns längre eller gamla fodringar som inte finns längre.
Exempel: Jag bokförde åt en kompis, och bokade upp skulden för mitt arbete för räkenskapsåret kredit konto [2991] Beräknat arvode för bokslut, med 5000kr debet kostnad [6530] Redovisningstjänster, 5000kr. Personen ville inte skriva på årsredovinsningen utan ville att endast frun skulle skriva på, varpå jag svarade kamraten att om inte allt görs helt rätt så kan jag inte ta betalt därför att om jag tar betalt så garnaterar jag att det är rätt. Jag skickade ingen räkning men det kräver en vaksam näste bokförare att vända den skulden nästa räkenskapsår mot "Övriga intäkter".

# Okoventionell bokföring vid inbetalning av preliminärskatten.
Vår bokförare varierade mellan att till kredit bank motboka varierande konto 1630 och 1640, vilket ledde till felaktigheter. För att få bokföringen att stämma med Skattekontots saldo så vändes konton mot kostnader i resulträkningen. Typiskt för bokförare som inte kan hantera bokföring av slutskattebesked.






---------------------------------------------------------------

-------------Bokföraren har försökt fuska-----------------------

# Långa enskilda bokföringsposter större än 15 rader
Har sett att man fifflar genom att slå samman många affärshändelser till en enda lång bokföringspost. Otillåtet eftersom god bokföringssed kräver en bokföringsspost per affärshändelse.


# Antalet bokföringsunderlag = antalet bokföringsposter
Typiskt för oseriös bokföring är att man inte vill nyttja moderna bokföringsverktygs möjlighet att "koppla bokföringsunderlag". Fortnox och Visma e-Ekonomi ger
möjlighet att knyta bokförunderlaget (verifikationen) till bokföringsposten.
(Min LIA-handledare:"Det tar för lång tid"). Om antalet bokföringsunderlag är lika med
antalet bokföringsposter så är sannolikheten större att bokföringen inte innehåller oegentligheter. Det är inte en fullt säker test eftersom exempelvis jag själv ibland brukar ladda upp flera dokument per bokföingspost - ett själva underlaget och ett annat där jag beskriver hur jag har tänkt och hur jag motiverar konteringen - detta för att en annan redovisningsekonom ska förstå (jämför kommentarer i programmeringen)

# Momsrapporter stämmer inte med verklig bokföring
Vår framlidnna redovisningskonsult som bokförde åt oss i flera år R.I.P. var sjuk på slutet, jag såg momsrapporter som hon producerat utan löpande bokföring. Förmodligen
hade hon räknat på miniräknaren men det är behäftat med fel om detta inte genereras ur den löpande bokföringen av programmet. - Hon hade öppnat upp tidigare xml-fil till skatteverket och fyllt i siffror för hand, stackarn. Detta innebär att vi måste korrigera dropzonen för sie-filer att även ha en dropzon för pdf-fil av Skattekontot.





--------------------------------------------------------------------------------
------------Kunden färsöker lura bokförarern ---------------------------

# Privata levnadsomkostnader
Kunden skickar in bokföringsunderlag för privata levnadsomkostnader
-Utrustning och materiel: Stämmer det med verksqamhetsbeskrivningen
Exemplvis har RS Blästring AB tagit upp inköp av två motorcykeldäckk
och en motorcykelinterkom utrustning. Min handledare bokförde detta som varukostnad.

-Attiraljer till mikrovågsugn - kan tillhöra personalkostnader. Förklaringen
att "Ibland finns ingen mikrovågsugn etc. i byggbodar på byggarbetsplatser" kan vara giltlig, men då ska denna tas upp i inventarieförteckningen.

-Hyror: Två hyror upptagna per månad för för RS Blästring AB. Ägaren som är den ende anställd är folkbokförd i Östersund enligt uppgift från handledaren och företaget har
rätt att kostnadsföra kostnader till inkomsters förvärvande. Att hyra en lägenhet
om man utför arbete långt hemifrån under sommarhalvåret kan vara billigare än att hyra
hotellrum men två hyror? Är den ena hyran en industrilokal? Kollas genom att slå upp
verksamhetsbeskrivning för företaget som erhållit betalning - hyr de ut industrifastigheter eller säger verksamhetsbeskrivningen endast bostadsuthyrning.
Om det är industrifastighet så är uthyrning momsbelagd speciellt om hyrestagaren bedriver momspliktig verksamhet. Peersoner som hyr ut industrifastigheter
vill lägga på moms därför att då får man dra av moms på reparationskostnader!!!


# Pengatvätt
-Layering. Kolla om ägaren eller dennes närstående (barn, sambor, maka/make) eller styrelsemedlemmar kontrollerar företag som är mottagare eller sändare av betalningar.
Möjligt layering scenario.

-Fakturor som inte fyller momslagens krav, avseende specificering av
antal och per styck.

-Leverantörsfakturor på främmande språk.

