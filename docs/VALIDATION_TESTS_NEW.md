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

---

### Test 2.1: Gamla balanssaldon hänger kvar
**Beskrivning:** Kontosaldon som är konstanta över flera räkenskapsår (utom bundet eget kapital).

**Validering:** Identifiera konton där UB år N = IB år N+1 = UB år N+1 för icke-bundna EK-konton.

**Undantag - Tillåtna konstanta konton (Bundet eget kapital):**
- 2080: Bundet eget kapital (gruppkonto)
- 2081: Aktiekapital
- 2082: Ej registrerat aktiekapital
- 2083: Medlemsinsatser
- 2084: Förlagsinsatser
- 2085: Uppskrivningsfond
- 2086: Reservfond
- 2087: Insatsemission / Bunden överkursfond
- 2088: Fond för yttre underhåll
- 2089: Fond för utvecklingsutgifter

**Varning vid:** Alla andra konton där saldo ligger konstant över mer än 2 räkenskapsår.

**Typiska exempel:**
- **OBS-konton (1790, 2990-serien):** Bokförare kan inte bokföra slutskattebesked korrekt
- **Gamla skulder (26xx-28xx):** Skulder som inte finns längre men ej korrigerats
- **Gamla fordringar (16xx):** Fordringar som ej längre existerar

**Verkligt exempel - Beräknat arvode (2991):**
> **Scenario:** Bokförare utförde löpande bokföring och bokslut för kompis under räkenskapsår 2024 (arbetet gjordes mars 2025). Korrekt periodisering: Debet 6530 (Redovisningstjänster) 5000 kr, Kredit 2991 (Beräknat arvode för bokslut) 5000 kr. Kunden vägrade skriva på årsredovisningen (ville att endast frun skulle underteckna). Bokföraren avbröt då samarbetet och skickade **ingen faktura** eftersom avtalet var "jag garanterar att det är rätt om jag tar betalt – men här är det inte rätt så jag tar inget betalt".
>
> **Problemet:** Skulden på 2991 (5000 kr) låstes in när räkenskapsår 2024 avslutades. 
>
> **Skatteeffekt 2024:** Kostnaden på 5000 kr minskade kundens resultat och därmed skatten för 2024 – **trots att kostnaden aldrig blev verklig** (ingen faktura skickades).
>
> **Lösning för nästa bokförare:** Eftersom 2024 är låst måste skulden bort i 2025:  
> `Debet 2991 (Beräknat arvode) 5000 kr`  
> `Kredit 3990 (Övriga intäkter) 5000 kr`  
>
> **Skatteeffekt 2025:** De 5000 kr som minskade resultatet 2024 blir nu en **intäkt** 2025 – vilket ökar skatten det året istället.
>
> Detta kräver en **vaksam bokförare** som upptäcker den gamla skulden och förstår att den ska reverseras mot intäkt 2025 (inte kostnad 2024 som är låst).

**Felmeddelande:** "Konto [kontonummer] har identiskt saldo i [N] räkenskapsår: [år1, år2, år3]. Kontrollera om saldot är aktuellt."

---

### Test 2.2: Okonventionell bokföring av preliminärskatt
**Beskrivning:** Inkonsekvent användning av skattekonton vid inbetalning av preliminärskatt.

**Validering:** Analysera om bokförare varierar mellan konto 1630 (Inbetald preliminärskatt) och 1640 (Redovisningskonto för skatter) slumpmässigt.

**Rött ljus:**
- Växlande mellan 1630/1640 utan logik
- Konton vänds mot resultaträkningskonton (kostnadskonton) för att matcha Skattekontots saldo
- Bokföringsposter som "gömmer" skatteavstämning i omkostnader

**Åtgärd:** Flagga för manuell granskning. Föreslå att kunden byter bokförare.

**Typiskt för:** Bokförare som inte kan hantera slutskattebesked korrekt.

---

## 🚩 Kategori 3: Fuskindikationer (Bokföraren försöker manipulera)

> **VARNING:** Dessa mönster indikerar medveten manipulation av bokföringen.

---

### Test 3.1: Långa enskilda bokföringsposter (>15 rader)
**Beskrivning:** Sammanslagna affärshändelser i en enda lång bokföringspost.

**Validering:** Räkna antal rader per verifikation. Flagga om >15 rader.

**God bokföringssed:** En bokföringspost per affärshändelse.

**Varför det är misstänkt:** Bokförare "fifflar" genom att dölja individuella transaktioner i en enda stor post för att undvika granskning.

**Felmeddelande:** "Verifikation [nummer] innehåller [X] rader. God bokföringssed kräver en post per affärshändelse. Granska noggrant."

**Åtgärd:** Manuell granskning av samtliga rader. Kräv uppdelning i separata poster.

---

**🚨 VERKLIGT EXEMPEL - RS MekService AB, Verifikation A308:**

> **Företag:** RS Blästring AB (senare RS MekService AB)  
> **Verifikationsnummer:** A308  
> **Datum:** 2025-07-31 (bokförd 2025-09-12)  
> **Text:** "Inköp av förbrukningsmaterial"  
> **Antal rader:** **87 rader** (!!!)
>
> **Analys:**
> - **29 separata affärshändelser** sammanslagna i en enda post
> - Innehåller allt från elkostnad (5611), varukostnader (4000), telefon (5420), inhyrd personal (6212), till **motorcykeldäck** dolda som varukostnad
> - Moms aggregerad per transaktion istället för per faktura
> - Inga referenser till underliggande fakturor/kvitton i SIE-filen
>
> **Motorcykeldäck-exemplet:**  
> Bland de 87 raderna finns inköp av två motorcykeldäck (verksamhet: blästringsarbeten):
> ```
> #TRANS 4000 {} 2604.06 "" "" 0   <- Motorcykeldäck 1 (varukostnad)
> #TRANS 2641 {} 651.02 "" "" 0    <- Ingående moms 25%
> 
> #TRANS 4000 {} 2943.20 "" "" 0   <- Motorcykeldäck 2 (varukostnad)
> #TRANS 2641 {} 735.80 "" "" 0    <- Ingående moms 25%
> ```
> Totalt: 5547 kr + 1387 kr moms = **6934 kr för privata motorcykeldäck** bokförda som företagskostnad.
>
> **Verksamhetsbeskrivning enligt Bolagsverket:** Blästringsarbeten (SNI 43.39 - Annan slutbehandling av byggnader)  
> **Relevans för motorcykeldäck:** **Ingen** - Klart fall av privat levnadskostnad bokförd som företagsutgift.
>
> **Varför detta är manipulation:**
> - Genom att slå samman 29 affärshändelser blir det omöjligt att se vad som faktiskt köpts utan att gräva djupt
> - Motorcykeldäcken "dränks" i mängden bland legitima elkostnader, telefonräkningar etc.
> - LIA-handledare bokförde detta utan att ifrågasätta - citat: "Det tar för lång tid att koppla underlag"
> - Ingen möjlighet att verifiera mot fakturor i systemet (trots att de finns på Dropbox)
>
> **Korrekt bokföring skulle varit:**
> - 29 separata verifikationer (A308a, A308b, A308c...)
> - Varje med kopplad faktura/kvitto från Fortnox/Dropbox
> - Motorcykeldäck skulle flaggats omedelbart som "matchar ej verksamhetsbeskrivning"
> - Möjlighet att neka momsavdrag på privata inköp

**Implementering i systemet:**
```python
def validate_long_verification(verification):
    lines = count_transaction_lines(verification)
    
    if lines > 15:
        return {
            "severity": "HIGH",
            "message": f"Verifikation {verification.number} innehåller {lines} rader. "
                      f"God bokföringssed kräver max 15 rader per post. "
                      f"Misstänkt sammanslagning av affärshändelser.",
            "action": "MANUAL_REVIEW_REQUIRED",
            "example": "Se RS MekService AB A308 (87 rader) där motorcykeldäck doldes bland 29 affärshändelser"
        }
```

---

### Test 3.2: Saknade bokföringsunderlag
**Beskrivning:** Bokföringsposter utan kopplat underlag (verifikation/kvitto).

**Validering:** 
```
Idealfall: Antal bokföringsunderlag ≈ Antal bokföringsposter
Varning: Antal underlag < 50% av antal poster
```

**Moderna bokföringsprogram:** Fortnox och Visma e-Ekonomi tillåter att koppla digitala underlag till varje post.

**Ursäkt från oseriösa bokförare:** "Det tar för lång tid" (verkligt citat från LIA-handledare)

**Undantag (godtagbart):**
- Flera dokument per post (t.ex. originalkvitto + kommentarsdokument som förklarar konteringstänk, jämförbart med kod-kommentarer)
- Periodiseringar och justeringsposter som saknar fysiskt underlag

**Åtgärd:** Om <50% av poster har underlag → Flagga för granskning och överväg att avsluta samarbete.

---

### Test 3.3: Momsrapporter stämmer inte med bokföring
**Beskrivning:** Momsrapport till Skatteverket genererad utanför bokföringssystemet.

**Validering:** 
1. Beräkna förväntad moms från bokföring (alla 26xx-konton)
2. Hämta faktiskt rapporterad moms från Skattekonto CSV (från Skatteverket)
3. Jämför bokförd moms mot Skattekontots transaktioner
4. Acceptabel avvikelse: ±100 kr (avrundning)

**Skattekonto CSV-format:**
Användare laddar upp CSV-fil från Skatteverket:
- Portal: skatteverket.se → Transaktioner och kontoutdrag → Bokförda transaktioner
- Valfri period: Välj 8 år tillbaka (2018-01-01 till dagens datum)
- Ladda ner: "csv-fil Excel"
- Format: 4 semicolon-delimiterade kolumner (Datum; Transaktionstyp; Belopp; Saldo)

**Momsrelaterade transaktionstyper i CSV:**
- "Inbetald moms" / "Redovisad moms" (utgående moms)
- "Momsfordran" / "Momsskuld" (ingående moms)
- Jämför mot konto 2640 (utgående moms), 2650 (momsredovisning)

**Rött ljus:**
- Momsrapport skapad manuellt i XML-editor
- Siffror räknade på miniräknare istället för genererade från bokföring
- Stora avvikelser (>100 kr) mellan rapporterad moms och bokförd moms
- Skattekonto CSV saknas för momsregistrerat företag

**Verkligt exempel - Framlidna redovisningskonsulten:**
> "Vår framlidna redovisningskonsult R.I.P. var sjuk på slutet. Hon öppnade tidigare 
> XML-filer och fyllde i siffror för hand – stackarn. Hon hade förmodligen räknat på 
> miniräknare, men det är behäftat med fel om detta inte genereras ur bokföringen."
>
> **Problemet:** Momsrapporter skapades utanför bokföringssystemet vilket innebär:
> - Ingen automatisk avstämning mot konto 26xx
> - Risk för räknefel (miniräknare vs automatik)
> - Ingen verifikationsspår mellan bokföring och deklaration
>
> **Lösningen:** Skattekonto CSV-jämförelse hade omedelbart flaggat avvikelser.

**Teknisk implementation:**
```python
# Backend-validering
def validate_moms(sie_file, skattekonto_csv):
    # 1. Extrahera bokförd moms från SIE
    bokford_moms = sie_file.sum_transactions(kontorange='26xx')
    
    # 2. Extrahera rapporterad moms från Skattekonto CSV
    rapporterad_moms = skattekonto_csv.get_moms_transactions()
    
    # 3. Jämför per period (månad/kvartal)
    for period in bokford_moms.periods():
        diff = abs(bokford_moms[period] - rapporterad_moms[period])
        if diff > 100:  # Större än avrundningsgräns
            yield ValidationError(
                test="3.3",
                period=period,
                differens=diff,
                bokford=bokford_moms[period],
                rapporterad=rapporterad_moms[period]
            )
```

**Felmeddelande:** "Momsrapport för period [ÅÅMM] avviker med [X] kr från bokföringen. Bokförd: [Y] kr, Rapporterad enligt Skattekonto: [Z] kr. Manuell granskning krävs."

---

### Test 3.4: Fastighetsavgift och avskrivningar på anläggningstillgångar
**Beskrivning:** Fastighetsägare som missar fastighetsavgift eller avskrivningar på anläggningstillgångar.

**Validering - Fastighetsavgift:**
1. Kontrollera om företaget äger fastigheter (Bolagsverket API eller konto 1110-1150 > 0)
2. Beräkna fastighetsavgift: 0,75% av taxeringsvärde (max takbelopp enligt inkomstbasbelopp)
3. Jämför mot konto 8423 "Fastighetsavgift"
4. Flagga om avgift saknas helt eller avviker >500 kr från beräknat

**Validering - Avskrivningar (BAS2024):**

Systemet använder SIE-filens kontoplan (#KPTYP) för att identifiera rätt konton. Nedan exempel från BAS2024/EUBAS97:

**✅ SKA avskrivas (årlig kontroll):**

**Immateriella anläggningstillgångar (Klass 10):**
- 1010 Utvecklingsutgifter → 1019 Ackumulerade avskrivningar
- 1020 Koncessioner m.m. → 1029 Ackumulerade avskrivningar
- 1030 Patent → 1039 Ackumulerade avskrivningar ■
- 1040 Licenser → 1049 Ackumulerade avskrivningar
- 1050 Varumärken → 1059 Ackumulerade avskrivningar
- 1060 Hyresrätter, tomträtter → 1069 Ackumulerade avskrivningar ■
- 1070 Goodwill → 1079 Ackumulerade avskrivningar

**Byggnader och mark (Klass 11):**
- 1110 Byggnader → 1119 Ackumulerade avskrivningar ■ (2-5% per år)
- 1120 Förbättringsutgifter annans fastighet → 1129 Ackumulerade avskrivningar
- 1150 Markanläggningar → 1159 Ackumulerade avskrivningar ■

**Maskiner och inventarier (Klass 12):**
- 1210 Maskiner och tekniska anläggningar → 1219 Ackumulerade avskrivningar ■ (20-30%)
- 1220 Inventarier och verktyg → 1229 Ackumulerade avskrivningar ■ (20-30%)
- 1230 Installationer → 1239 Ackumulerade avskrivningar
- 1240 Bilar och transportmedel → 1249 Ackumulerade avskrivningar ■ (20-30%)
- 1250 Datorer → 1259 Ackumulerade avskrivningar ■ (20-33%)
- 1260 Leasade tillgångar → 1269 Ackumulerade avskrivningar [Ej K2]
- 1290 Övriga materiella tillgångar → 1299 Ackumulerade avskrivningar ■

*■ = Grundkonton som används av de flesta företag*

**❌ SKA INTE avskrivas (undantag):**
- **1130 Mark** - Evigt värde, ingen avskrivning
- **1140 Tomter och obebyggda markområden** - Evigt värde, ingen avskrivning
- **13xx Finansiella anläggningstillgångar** (aktier, andelar, obligationer, fordringar)

**Valideringsalgoritm:**
```python
# För varje anläggningstillgång i SIE-filen
for konto in sie.get_tillgangar(klass='1[012]xx'):
    # Hoppa över mark, tomter och finansiella tillgångar
    if konto.nummer in ['1130', '1140'] or konto.nummer.startswith('13'):
        continue
    
    # Beräkna förväntat avskrivningskonto (XX0 → XX9)
    # Ex: 1110 Byggnader → 1119 Ack avskrivningar på byggnader
    avskrivningskonto = konto.nummer[:-1] + '9'
    
    # Kontrollera om avskrivning gjorts under räkenskapsåret
    if konto.saldo > 0 and not sie.has_transactions(avskrivningskonto, år):
        flagga_fel(f"Avskrivning saknas på {konto.namn}")
```

**Flagga om:**
- Anläggningstillgång finns på balansräkning (saldo > 0)
- Motsvarande "Ackumulerade avskrivningar" konto (XX9) saknar transaktioner
- Avskrivning utanför normalintervall för tillgångstyp
- Mark eller tomter har avskrivningar (får ej förekomma)

**Verkligt exempel - Vinissi Fastighet AB (556903-8671):**
> **Bakgrund:** Kundens tidigare redovisningskonsult, som avlidit februari 2025, hade 
> skött bokföringen under flera år men blev sjuk på slutet. Hon sköt på bokföringen 
> och gjorde flera grundläggande fel.
>
> **Upptäckta fel:**
> 1. **Fastighetsavgift 2021-2024:** Fastigheten ej upptagen i deklarationen, 
>    fastighetsavgift (9 287 kr/år) ej bokförd på konto 8423
> 2. **Avskrivning 2023:** Avskrivning på småhus hoppades över efter att kunden 
>    (nybörjare på bokföringsutbildning) skrev SMS: "Det ska nog inte vara någon 
>    avskrivning på småbostadshus" (felaktigt). Konsulten litade på rådet och hoppade 
>    över konto 1119 "Ackumulerade avskrivningar på byggnader"
> 3. **Försenad bokföring:** Bokföringen för 2023 gjordes våren 2024 (6+ månader 
>    efter räkenskapsårets slut)
> 4. **Utebliven bokföring:** Bokföring för 2024 gjordes aldrig (konsulten gick bort)
>
> **Skatteverkets beslut (handläggare Björn Hedman):**
> - Accepterade rättelse med "försiktiga bedömningar"
> - Retroaktiv fastighetsavgift: 9 287 kr/år × 4 år = **37 148 kr**
> - Godkände avdrag för fastighetsavgift 2023 (9 287 kr)
> - Justerat resultat 2023: från överskott 5 641 kr till underskott 3 646 kr
> - Ackumulerat underskott efter avdrag: **335 401 kr**
>
> **Citat från Skatteverkets beslut:**
> "Ni har förklarat att er tidigare redovisningskonsult, som avlidit, inte hade 
> skött bokföringen korrekt under flera år. Ni har redogjort för hur ni har gått 
> igenom bokföringen och rättat felaktigheter så gott det har varit möjligt med 
> hänsyn till att det inte alltid gått att få klarhet. Ni har därvid gjort 
> **försiktiga bedömningar** där ni i osäkra fall har behandlat intäkter som 
> skattepliktiga men kostnader som ej avdragsgilla."
>
> **Lärdomar:**
> - ✅ Transparens och försiktighet belönas av Skatteverket
> - ❌ Sjuka/äldre konsulter är högrisk - fortsätter för länge
> - ❌ Nybörjare (studenter) bör inte ge råd till konsulter
> - ⚠️ Automatiska valideringar hade upptäckt alla dessa fel omedelbart

**Felmeddelanden:**
- "Fastighetsavgift saknas för räkenskapsår [år]. Beräknat belopp: [X] kr baserat på taxeringsvärde [Y] kr"
- "Avskrivning saknas på [kontonamn] (konto [nummer], saldo [X] kr). Normalt avskrivningsintervall: [Y-Z]%"
- "Avskrivning [X]% på [kontonamn] ligger utanför normalintervall [Y-Z]%"
- "Mark (konto 1210-1219) får ej avskrivas. Felaktig transaktion på konto [nummer]"

**Risknivå:** ⚠️ MEDEL (Skatteverket upptäcker vid kontroll, kräver rättelse och retroaktiv betalning)

**Åtgärd:**
1. Kontakta kund omgående vid saknade avskrivningar/fastighetsavgift
2. Begär uppgifter om fastigheter från Bolagsverket/Lantmäteriet
3. Rätta bokföring och deklaration
4. Om tidigare år påverkas: Hjälp kund skriva ansökan om rättelse till Skatteverket
5. Dokumentera kunds förklaring (sjukdom, nybörjare, etc.) för Skatteverket

---

### Test 3.5: Försenad eller utebliven bokföring
**Beskrivning:** Bokföringen görs långt efter räkenskapsårets slut, eller uteblir helt.

**Validering:**
1. Kontrollera datum för senaste verifikationen i SIE-filen
2. Jämför med räkenskapsårets slutdatum
3. Flagga om >3 månader mellan bokslut och senaste verifikation

**Riskbedömning:**
- 3-6 månaders försening: ⚠️ MEDEL - Kan indikera sjukdom, personalbrist eller okunskap
- 6-12 månaders försening: 🔴 HÖG - Starkt tecken på problem, risk för konkurs
- >12 månaders försening: 🚨 KRITISK - Potentiell skattebrott, uppenbar försummelse

**Verkligt fall:**
> "Bokföringen för 2023 gjordes våren 2024, och 2024 gjordes aldrig då konsulten 
> gick bort februari 2025. Hon sköt på bokföringen pga sjukdom men var 'glad i pengar' 
> och ville inte lägga ner företaget."

**Felmeddelande:** "Bokföring för räkenskapsår [år] gjordes med [X] månaders försening (senaste verifikation: [datum])"

**Åtgärd:**
1. Kontakta kund omedelbart vid >6 månaders försening
2. Begär förklaring (sjukdom, personalbrist, IT-problem?)
3. Hjälp kund upprätta handlingsplan för att komma ikapp
4. Överväg om företaget ska övergå i konkurs/likvidation

---

### Test 3.7: Sammanslagna verifikationer (Obfuscering)
**Beskrivning:** Flera kvitton/fakturor bokförda som EN post för att dölja spår eller undvika granskning.

**Detekteringsmetoder:**

**1. Pattern Matching (Traditional AI):**
```python
def detect_merged_verifications(verifikation):
    red_flags = 0
    
    # Onormalt lång beskrivning
    if len(verifikation.beskrivning) > 100:
        red_flags += 1
        
    # Multipla datum nämnda
    if len(re.findall(r'\d{4}-\d{2}-\d{2}', verifikation.beskrivning)) > 1:
        red_flags += 2
        
    # "Additionsord" i beskrivningen
    addition_keywords = ['totalt', 'summa', 'tillsammans', 'diverse', 
                        'enligt kvitton', 'flera inköp', 'sammanlagt']
    if any(word in verifikation.beskrivning.lower() for word in addition_keywords):
        red_flags += 2
        
    # Saknar kvittonummer men nämner "kvitton" (plural!)
    if 'kvitton' in verifikation.beskrivning.lower() and not verifikation.kvittonummer:
        red_flags += 2
        
    # Belopp är "suspekt jämnt" (multipel av 1000)
    if verifikation.belopp % 1000 == 0 and verifikation.belopp > 5000:
        red_flags += 1
        
    return red_flags >= 3  # Threshold: 3+ flags = misstänkt
```

**2. AI-baserad semantisk analys (LLM):**
- Claude/GPT analyserar beskrivningstext för obfusceringsförsök
- Identifierar semantiska mönster som tyder på sammanläggning
- Misstänkthetsgrad 0-10 baserat på språkanalys

**3. Kvitto-matchning (OCR + AI):**
- OCR alla PDF-kvitton → extrahera belopp, datum, leverantör
- Jämför mot bokföringsposter → hitta saknade kvitton
- Detektera adderade belopp → om summa av 2+ kvitton = 1 bokföringspost

**Flagga om:**
- Beskrivning >100 tecken OCH innehåller "totalt"/"summa"/"diverse"
- Multipla datum nämnda i samma verifikation
- Texten säger "enligt kvitton" (plural) men bara EN verifikation finns
- Saknas kvittonummer/referens trots att kvitton nämns
- AI-misstänkthetsgrad ≥7/10

**Verkligt exempel - RS MekService A308 (Motorcykeldäck):**
> **Bakgrund:** LIA-handledare (redovisningsekonom) köpte motorcykeldäck vid två 
> separata tillfällen. Istället för att skapa två verifikationer bokfördes inköpen 
> som EN post med manuellt adderade belopp.
>
> **Normal bokföring:**
> ```
> A308a: Motorcykeldäck 1 (datum1) - 5 000 kr + 1 250 kr moms = 6 250 kr
> A308b: Motorcykeldäck 2 (datum2) - 3 000 kr + 750 kr moms = 3 750 kr
> ```
>
> **Faktisk bokföring (obfuscerad):**
> ```
> A308: "Motorcykeldäck diverse inköp enligt kvitton daterade 
>        [datum1] och [datum2] totalt exkl. moms" - 8 000 kr + 2 000 kr moms = 10 000 kr
> ```
>
> **Upptäckt:** 
> 1. Letade efter enskilda motorcykeldäckskvitton i bokföringen
> 2. Kunde ej hitta de förväntade beloppen (6 250 kr, 3 750 kr)
> 3. Blev misstänksam över onormalt lång beskrivning i A308
> 4. Insåg att beloppen måste ha adderats → sökte efter summa (10 000 kr)
> 5. Fann A308 med adderade belopp och adderad moms
>
> **Problemet:**
> - Omöjligt att spåra tillbaka till enskilda kvitton (bryter mot verifikationsplikten)
> - Kräver miniräknare för att addera beloppen (Fortnox har ingen inbyggd kalkylator)
> - Extra ansträngning för att obfuscera = medveten handling
> - "Här döljs något" - legitima skäl att vara misstänksam

**Varför detta är allvarligt:**
1. **Bryter mot verifikationsplikten** (Bokföringslagen 5 kap 5§)
2. **Omöjlig revision** - enskilda kvitton kan ej verifieras
3. **Indikerar medveten manipulation** - kräver extra arbete att dölja
4. **Potentiell skattefusk** - lättare att "glömma" kvitton i sammanläggningar

**Risknivå:** 🔴 HÖG (Bryter mot bokföringslagen, indikerar medveten obfuscering)

**Åtgärd:**
1. **Begär ALLA originalkvitton** för den sammanslagna transaktionen
2. **Dela upp i separata verifikationer** - en per kvitto/faktura
3. Om kvitton saknas → begär skriftlig förklaring från bokförare
4. Dokumentera i granskningsrapport som "Avvikelse från god redovisningssed"
5. Vid upprepade fall → överväg rapportering till Revisorsnämnden

**AI-implementation för LIA-demo:**
```javascript
// Mock AI-detection i frontend
const detectMergedTransaction = (verifikation) => {
  const flags = [];
  
  if (verifikation.beskrivning.length > 100) {
    flags.push("Onormalt lång beskrivning");
  }
  
  if (/\d{4}-\d{2}-\d{2}.*\d{4}-\d{2}-\d{2}/.test(verifikation.beskrivning)) {
    flags.push("Multipla datum nämnda");
  }
  
  if (/totalt|summa|diverse|enligt kvitton/i.test(verifikation.beskrivning)) {
    flags.push("Additionsord detekterade");
  }
  
  if (/kvitton/i.test(verifikation.beskrivning) && !verifikation.kvittonummer) {
    flags.push("Plural 'kvitton' men inget kvittonummer");
  }
  
  const suspicionScore = flags.length * 2.5; // 0-10 skala
  
  return {
    isSuspicious: flags.length >= 3,
    suspicionScore,
    redFlags: flags,
    recommendation: flags.length >= 3 
      ? "FLAGGA: Begär originalkvitton och dela upp verifikationen"
      : "OK"
  };
};
```

---

### Test 3.8: Raderade transaktioner (#BTRANS) och korrigerade transaktioner (#RTRANS)
**Beskrivning:** Verifiera att SIE-filen innehåller alla transaktioner inklusive raderade och korrigerade poster enligt bokföringslagen.

**Bakgrund - SIE-specifikationen:**
- **#VER** = Normal verifikationspost
- **#BTRANS** = Borttagen transaktion (deleted transaction)
- **#RTRANS** = Korrigerad/rättad transaktion (corrected transaction)

**Problem:** Gamla Visma Administration har export-alternativ "Utan strukna rader" vilket **BRYTER mot bokföringslagen 5 kap 3§**:
> "Bokföring ska vara fullständig, korrekt och spårbar"

**Validering:**
1. Läs genom hela SIE-filen
2. Räkna antal:
   - `#VER` posts (normala verifikationer)
   - `#BTRANS` posts (raderade transaktioner)
   - `#RTRANS` posts (korrigerade transaktioner)
3. Kontrollera om programvaran stödjer #BTRANS/#RTRANS:
   - **Fortnox:** Stödjer `#BTRANS` för raderade verifikationer
   - **Visma:** Stödjer `#BTRANS` (om "Utan strukna rader" INTE är vald vid export)
   - **Bokio:** Stödjer `#RTRANS` för korrigerade poster
4. Om programmet stödjer men SIE-filen saknar → **FLAGGA**

**Felmeddelande:** 
"SIE-filen saknar raderade/korrigerade transaktioner (#BTRANS/#RTRANS). Detta kan indikera:
- Export med 'Utan strukna rader' (Visma Administration)
- Manuell radering ur SIE-filen efter export
- Ofullständig revision trail

⚠️ **BRYTER MOT:** Bokföringslagen 5 kap 3§ (fullständig och spårbar bokföring)"

**Risk:**
- **Låg risk:** Programvaran stödjer inte primitiven (acceptabelt för vissa äldre system)
- **Hög risk:** Programvaran stödjer men primitiven saknas → Avsiktlig borttagning
- **Kritisk risk:** Stora belopp eller många poster saknar #BTRANS-spår

**Åtgärd:**
1. Om #BTRANS/#RTRANS saknas totalt → Varna användaren
2. Om användaren bekräftar att det exporterades "Utan strukna rader" → Begär omexport
3. Om omexport visar samma brist → **FLAGGA för manuell granskning**

**Exempel från SIE-specifikationen:**
```
#VER A 308 20250731 "Inköp av förbrukningsmaterial" 20250912
{
  #TRANS 4000 {} 5000.00 "" "" 0
  #BTRANS 4000 {} 2604.06 "" "" 0    <- RADERAD motorcykeldäck 1
  #BTRANS 2641 {} 651.02 "" "" 0     <- RADERAD moms
  #RTRANS 4000 {} 2500.00 "" "" 0    <- KORRIGERAD belopp istället
  #TRANS 2641 {} 1250.00 "" "" 0
}
```

**Automatisk validering i Python:**
```python
def validate_btrans_rtrans(sie_file_content):
    """Validera att raderade/korrigerade transaktioner finns om programmet stödjer det"""
    
    # Räkna primitiver
    ver_count = sie_file_content.count('#VER')
    btrans_count = sie_file_content.count('#BTRANS')
    rtrans_count = sie_file_content.count('#RTRANS')
    
    # Identifiera bokföringsprogram från #PROGRAM tag
    program_line = [line for line in sie_file_content.split('\n') if line.startswith('#PROGRAM')][0]
    program_name = program_line.split()[1].strip('"')
    
    # Program som MÅSTE ha #BTRANS om poster raderats
    supports_btrans = program_name.lower() in ['fortnox', 'visma', 'bokio']
    
    if supports_btrans and ver_count > 10 and btrans_count == 0 and rtrans_count == 0:
        return {
            'passed': False,
            'severity': 'HIGH',
            'message': f'{program_name} stödjer #BTRANS/#RTRANS men inga sådana finns i {ver_count} verifikationer.',
            'recommendation': 'Begär omexport MED strukna rader eller granska manuellt för dolda transaktioner'
        }
    
    return {
        'passed': True,
        'message': f'Hittade {btrans_count} raderade och {rtrans_count} korrigerade transaktioner',
        'recommendation': 'Granskat och dokumenterat'
    }
```

**Juridisk grund:**
- **Bokföringslagen 5 kap 3§:** Fullständig och spårbar bokföring
- **Bokföringsnämndens allmänna råd (BFNAR 2001:3):** Revision trail krävs
- **Skatteverkets ställningstagande:** Export utan strukna rader godtas INTE vid revision

---

### Test 3.9: Sekventialitet i verifikationsnummer
**Beskrivning:** Verifiera att verifikationsnummer är sekventiella utan luckor inom varje serie.

**Bakgrund - #VER primitiv:**
```
#VER serie vernr verdatum vertext regdatum sign
```

**Unik identifierare:** Tupeln `(serie, vernr)` ska unikt peka ut en bokföringspost inom ett räkenskapsår.

**Exempel på serier:**
- **Serie A:** Leverantörsfakturor (A1, A2, A3, A4, ...)
- **Serie B:** Kundfakturor (B1, B2, B3, ...)
- **Serie K:** Kontantutlägg (K1, K2, K3, ...)
- **Serie L:** Lön (L1, L2, L3, ...)

**Många använder endast en serie (A) för alla transaktionstyper.**

**Problemet:** SIE-filer är **läsbara plaintext** och kan editeras manuellt.

**Attack-scenario:**
1. Bokförare skapar verifikation A308 (motorcykeldäck 6934 kr)
2. Bokförare raderar rad manuellt ur SIE-filen
3. SIE-filen visar nu: A307, A309 (A308 saknas)
4. Vid import till nytt system upptäcks inte borttagningen

**Validering:**
1. Extrahera alla `#VER` rader från SIE-filen
2. Gruppera per serie (A, B, K, etc.)
3. För varje serie:
   - Sortera verifikationsnummer
   - Hitta min och max nummer
   - Skapa förväntad sekvens: `[min, min+1, min+2, ..., max]`
   - Jämför med faktiska nummer
   - Flagga alla saknade nummer

**Felmeddelande:**
"⚠️ SEKVENSBROTT I VERIFIKATIONSNUMMER

**Serie A (Leverantörsfakturor):**
- Intervall: A1 → A450
- Saknade nummer: **A308**, A329, A407
- Totalt saknas: 3 verifikationer

**Möjliga orsaker:**
1. Raderade verifikationer utan #BTRANS-markering
2. Manuell editering av SIE-fil efter export
3. Tekniskt fel i bokföringsprogrammet
4. Avsiktlig borttagning av transaktioner

**BRYTER MOT:** Bokföringslagen 5 kap 3§ (fullständig bokföring)

**ÅTGÄRD KRÄVS:**
- Begär förklaring från kund för varje saknat nummer
- Kontrollera om #BTRANS finns (Test 3.8)
- Vid misstanke om fusk → Rapportera enligt AML-lag"

**Risk:**
- **1-2 saknade:** Låg risk (kan vara tekniskt fel eller testposter)
- **3-10 saknade:** Medel risk (begär förklaring)
- **>10 saknade:** Hög risk (misstänkt manipulation)
- **Saknade nummer med stora belopp:** Kritisk risk

**Åtgärd:**
1. **Låg risk:** Dokumentera och fråga kund
2. **Medel risk:** Begär originalkvitton för omgivande verifikationer
3. **Hög risk:** FLAGGA för manuell granskning + kräv komplett förklaring
4. **Kritisk risk:** Överväg rapportering till Skatteverket/Finanspolisen

**Automatisk validering i Python:**
```python
def validate_sequential_vernr(sie_file_content):
    """Kontrollera att verifikationsnummer är sekventiella inom varje serie"""
    
    import re
    from collections import defaultdict
    
    # Extrahera alla #VER rader
    ver_pattern = r'#VER\s+(\w+)\s+(\d+)'
    verifikationer = re.findall(ver_pattern, sie_file_content)
    
    # Gruppera per serie
    serier = defaultdict(list)
    for serie, vernr in verifikationer:
        serier[serie].append(int(vernr))
    
    issues = []
    
    for serie, nrlist in serier.items():
        nrlist_sorted = sorted(set(nrlist))  # Ta bort dubbletter och sortera
        min_nr = nrlist_sorted[0]
        max_nr = nrlist_sorted[-1]
        
        # Skapa förväntad sekvens
        expected = set(range(min_nr, max_nr + 1))
        actual = set(nrlist_sorted)
        
        # Hitta saknade nummer
        missing = sorted(expected - actual)
        
        if missing:
            issues.append({
                'serie': serie,
                'min': min_nr,
                'max': max_nr,
                'missing': missing,
                'missing_count': len(missing),
                'severity': 'CRITICAL' if len(missing) > 10 else 'HIGH' if len(missing) > 2 else 'MEDIUM'
            })
    
    if issues:
        return {
            'passed': False,
            'issues': issues,
            'message': f'Hittade {len(issues)} serier med sekvensbrott',
            'recommendation': 'Begär förklaring för alla saknade verifikationsnummer'
        }
    
    return {
        'passed': True,
        'message': 'Alla verifikationsserier är sekventiella',
        'recommendation': 'OK'
    }
```

**Exempel på output:**
```json
{
  "passed": false,
  "issues": [
    {
      "serie": "A",
      "min": 1,
      "max": 450,
      "missing": [308, 329, 407],
      "missing_count": 3,
      "severity": "HIGH"
    }
  ],
  "message": "Hittade 1 serier med sekvensbrott",
  "recommendation": "Begär förklaring för alla saknade verifikationsnummer"
}
```

**Särskilt misstänkt:** 
- A308 saknas (motorcykeldäck-exemplet från Test 3.7)
- Nummer saknas i mitten av sekvensen (inte i början eller slutet)
- Stora belopp på verifikationer precis före/efter luckan

**Juridisk grund:**
- **Bokföringslagen 5 kap 5§:** Verifikationer ska numreras löpande
- **BFN R2:** Verifikationsserier ska vara löpande och spårbara
- **Skatteverkets kontrollrutin:** Sekvensbrott används som indikator för manipulation

**Säkerhetsförbättring - framtida:**
Du har helt rätt: SIE-filer borde INTE vara plaintext!

**Förslag:**
1. **Krypterad SIE-export:** Digitalt signerad med SHA-256 hash
2. **Blockchain-baserad verifikation:** Varje #VER får en hash som inkluderar föregående #VER
3. **HMAC-signatur:** Bokföringsprogram signerar hela filen med privat nyckel
4. **XML-ersättning:** Ny standard (SIE6?) som använder XML med digital signatur

**Tills dess:** Test 3.8 + Test 3.9 ger oss bästa möjliga detektering av manipulation.

---

## 🕵️ Kategori 4: Penningtvätt & Kundbedrägeri

> **KRITISKT:** Dessa tester identifierar potentiell brottslighet. Vid träff → Rapportera enligt AML-lag.

---

### Test 4.1: Layering (Penningtvätt via närstående företag)
**Beskrivning:** Kunden skickar pengar till egna eller närståendes företag för att dölja ursprung.

**Validering:**
1. Extrahera alla Bankgiro-in/-utbetalningar från kontoutdrag
2. Slå upp ägare av mottagande/sändande bankgironummer (Bolagsverket API)
3. Jämför mot:
   - Kundens namn och personnummer
   - Make/maka, sambo, barn (folkbokföringsregister)
   - Styrelseledamöter (Bolagsverket)
   - Verkliga huvudmän (Bolagsverket Betalinformation)

**Flaggas som misstänkt layering om:**
- Samma person äger både sändande och mottagande företag
- Närstående (sambo, familj) kontrollerar mottagarföretag
- Styrelsemedlem i kundens företag är ägare till mottagarföretag
- Cirkulära transaktioner: A → B → C → A

**Åtgärd:** 
- Låg risk (1-2 träffar): Dokumentera och följa upp
- Medel risk (3-5 träffar): Begär förklaring från kund
- Hög risk (>5 träffar eller cirkulära): Rapportera till Finanspolisen

---

### Test 4.2: Privata levnadskostnader bokförda som företagsutgifter
**Beskrivning:** Kunden försöker få företaget betala privata kostnader.

#### Test 4.2a: Utrustning som inte matchar verksamhetsbeskrivning
**Verkligt exempel:** RS Blästring AB (blästringsarbeten) bokförde:
- 2 st motorcykeldäck
- 1 st motorcykel-intercom-utrustning

**Handledare bokförde som:** Varukostnad 🚩

**Validering:**
1. Hämta verksamhetsbeskrivning från Bolagsverket
2. Matcha inköp mot branschkod (SNI-kod)
3. Flagga om inköp inte rimligen kan kopplas till verksamheten

**Felmeddelande:** "Inköp av [produktnamn] matchar inte verksamhet '[verksamhetsbeskrivning]'. Granska om privat levnadskostnad."

---

#### Test 4.2b: Dubbla hyror utan industrilokal
**Verkligt exempel:** RS Blästring AB (1 anställd = ägaren, folkbokförd Östersund) bokförde **två hyror per månad**.

**Legitim förklaring:** Hyra lägenhet vid tillfälligt arbete långt från hemorten (billigare än hotell).

**Misstänkt scenario:** Två hyror utan motivering.

**Validering:**
1. Räkna antal hyresposter per månad
2. Om >1 hyra → Slå upp mottagarföretag
3. Kontrollera verksamhetsbeskrivning:
   - **Industrifastighet:** OK (momsbelagd uthyrning om momspliktig verksamhet)
   - **Bostadsuthyrning:** 🚩 Misstänkt privat hyra

**Särskilt misstänkt:** Personer som hyr ut industrifastigheter vill lägga på moms för att dra av moms på reparationskostnader → Kolla om moms finns på fakturan.

**Felmeddelande:** "Företaget har [X] hyror per månad. Mottagare '[namn]' bedriver '[verksamhet]'. Verifiera att hyra ej är privatbostad."

---

#### Test 4.2c: Privata inventarier bokförda som företagstillgångar
**Verkligt exempel:** Attiraljer till mikrovågsugn (tallrikar, bestick etc.)

**Ursäkt från bokförare:** "Ibland finns ingen mikrovågsugn i byggbodar på byggarbetsplatser"

**Validering:**
1. Om inventarier för personlig användning → Ska finnas i **inventarieförteckningen**
2. Om ej i förteckning → Misstänkt privat inköp
3. Jämför mot bransch: Byggföretag kan ha personalkostnader för arbetsmiljö

**Åtgärd:** Kräv att inventarier tas upp i förteckningen eller ombokas till utdelning/lön.

---

### Test 4.3: Bristfälliga fakturor (momsbedrägeri)
**Beskrivning:** Fakturor som inte fyller momslagens krav.

**Validering enligt Momslag (1994:200):**
- ✅ Leverantörens org.nr och namn
- ✅ Fakturadatum
- ✅ Specificering: **Antal × Á-pris** (MÅSTE finnas!)
- ✅ Momssats och momsbelopp
- ✅ Totalt belopp

**Rött ljus:**
- "Diverse arbeten 5000 kr" utan specifikation
- Endast totalsumma utan uppdelning
- Felaktig momssats (t.ex. 25% på momsbefriad verksamhet)

**Åtgärd:** Neka momsavdrag tills korrekt faktura framställs.

---

### Test 4.4: Utländska leverantörsfakturor
**Beskrivning:** Fakturor på främmande språk utan översättning.

**Risk:** 
- Svårare att granska innehåll
- Kan dölja bedrägliga transaktioner
- Omvänd skattskyldighet kan missas

**Validering:**
1. Identifiera fakturor med icke-svenska tecken
2. Flagga om >10% av leverantörsfakturor är utländska
3. Kräv översättning och dokumentation av omvänd skattskyldighet

**Särskilt misstänkt:** 
- Fakturor från skatteparadis
- Många olika utländska leverantörer inom kort tid
- Runda belopp på utländska fakturor (indikerar fingerade kostnader)

---

## 🌐 Ytterligare Penningtvättsscenarier

### Test 4.5: Smurfing (Strukturering)
**Beskrivning:** Många små transaktioner under rapporteringströskeln (15 000 kr kontant, 150 000 kr totalt).

**Validering:**
- Identifiera mönster: Många transaktioner strax under gränsvärden
- Exempel: 10 st inbetalningar à 14 500 kr istället för 1 st à 145 000 kr

**Flagga vid:** >5 transaktioner inom 30 dagar som ligger 90-99% av tröskelvärde.

---

### Test 4.6: Snabba in- och utbetalningar (Pass-through)
**Beskrivning:** Pengar in på kontot och ut inom kort tid (24-48h).

**Validering:**
- Identifiera transaktionspar: Inbetalning följd av utbetalning till annat konto inom 48h
- Särskilt misstänkt om beloppen är nästan identiska (±5%)

**Flagga vid:** >3 sådana par per månad.

---

### Test 4.7: Omotiverat höga kontantuttag
**Beskrivning:** Stora kontantuttag utan logisk koppling till verksamheten.

**Validering:**
- Kolla bransch: Restaurang/café OK med kontanter, konsultföretag misstänkt
- Flagga uttag >50 000 kr kontant för företag utan kontanthantering

---

### Test 4.8: Handel med högriskländer
**Beskrivning:** Transaktioner till/från länder med hög korruptionsrisk.

**Validering:**
- Transparency International's Corruption Perceptions Index
- FATF (Financial Action Task Force) grålistade länder
- EU:s lista över högriskländer för penningtvätt

**Flagga vid:** Transaktioner >100 000 kr till/från högriskland utan tydlig affärsmotivering.

---

### Test 4.9: Shell companies (Skalbolag)
**Beskrivning:** Transaktioner med företag utan verklig verksamhet.

**Validering:**
- Kolla Bolagsverket: 0 anställda, ingen omsättning föregående år
- Nyregistrerat företag (<6 månader) med stora transaktioner
- Företag registrerade på "brevlådeadress"

**Flagga vid:** Transaktion >50 000 kr till skalbolag.

---

### Test 4.10: Trade-based money laundering
**Beskrivning:** Över- eller underfakturering av varor för att flytta pengar.

**Validering:**
- Jämför fakturabelopp mot marknadspris (om möjligt)
- Flagga extrema avvikelser: T.ex. 10 pennor för 50 000 kr
- Kontrollera att antal × á-pris = totalt

---

### Test 4.11: Round-tripping
**Beskrivning:** Pengar går ut och kommer tillbaka via mellanled för att se legitima ut.

**Validering:**
- Kartlägg transaktionsflöde: A → B → C → A inom 90 dagar
- Särskilt misstänkt om beloppen minskar lite i varje steg (för att dölja spåret)

---

### Test 4.12: Phantom employees (Fantomanställda)
**Beskrivning:** Lön betalas till icke-existerande personer.

**Validering:**
- Jämför löneutbetalningar mot A-skatt och arbetsgivardeklaration
- Kontrollera personnummer mot folkbokföringsregistret
- Flagga om lön till personer ej folkbokförda i Sverige (utan F-skattsedel)

---

### Test 4.13: Fake invoices (Falska fakturor)
**Beskrivning:** Fakturor för tjänster/varor som aldrig levererats.

**Validering:**
- Kontrollera att leverantör finns registrerat (org.nr i Bolagsverket)
- Flagga om leverantör avregistrerades kort efter fakturadatum
- Kolla logik: Konsultföretag köper byggmaterial för 500 000 kr?

---

### Test 4.14: Back-to-back loans
**Beskrivning:** Lån mellan närstående företag för att dölja penningflöden.

**Validering:**
- Identifiera lånetransaktioner (konto 24xx)
- Kolla om långivare kontrolleras av samma person/närstående
- Flagga om ränta saknas eller är ovanligt låg/hög

---

### Test 4.15: Integration av svarta pengar via legitim verksamhet
**Beskrivning:** Kontantintensiv verksamhet (restaurang, biltvättar, frisör) blandas med illegala medel.

**Validering:**
- Jämför rapporterad omsättning mot branschgenomsnitt per anställd
- Flagga om >150% av branschsnitt utan förklaring
- Kontrollera lönekostnader: För låga i relation till omsättning = misstänkt

---

## 📊 Implementation Notes

### SIE-filhantering
- **Stödda format:** SIE1, SIE2, SIE3, SIE4 (SIE4 är standard för bokföringsprogram)
- **Korrigeringar:** Justeringsposter måste ha referens till ursprunglig verifikation
- **Saknade verifikationsnummer:** Flagga som fel, kan inte granskas

### Bankgiro-lookup
- **API:** Bankgirot API för ägare-lookup (kräver avtal)
- **Närstående definition:** 
  - Make/maka/sambo (folkbokföring)
  - Barn, föräldrar, syskon (släktskap)
  - Styrelseledamöter (Bolagsverket)
  - Verkliga huvudmän >25% ägarandel
- **Cache:** 30 dagar för Bolagsverket-data, 7 dagar för folkbokföring

### Prestandakrav
- **Transaktioner:** Ska kunna processa 100 000 transaktioner samtidigt
- **Timeout:** Max 30 sekunder per SIE-fil
- **Batchning:** SIE-filer >10 MB körs i bakgrunden med progress bar

### Rapportering
- **Automatisk:** Systemet loggar alla flaggade transaktioner
- **Manuell:** Redovisningsekonom granskar och bestämmer åtgärd
- **Finanspolisen:** Vid hög risk → automatisk PDF-rapport genereras

---

## 🚀 Framtida Utveckling

- [ ] Real-time validering vid bokföringstillfället (Fortnox integration)
- [ ] Machine learning för att identifiera nya penningtvättsmönster
- [ ] Integration med Bolagsverket för "Verklig huvudman"-kontroller (kräver betalavtal)
- [ ] Bangiro-fil analys för avancerad layering detection
- [ ] Automatisk rapportering till Finanspolisen vid allvarliga misstankar
- [ ] AI-assistent som föreslår konteringar baserat på historik
- [ ] Dashboard med risk-score per kund (0-100)
- [ ] API för extern revision (PwC, KPMG etc.)

---

## 📚 Relaterad Dokumentation

- [CONFIG_STRUCTURE.md](./CONFIG_STRUCTURE.md) - Firm configuration
- [REMOTE_ONBOARDING.md](./REMOTE_ONBOARDING.md) - Remote onboarding system
- [API Specification](../backend/README.md) - Backend API endpoints
- [Bokföringslagen (1999:1078)](https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/bokforingslag-19991078_sfs-1999-1078)
- [Penningtvättslagen (2017:630)](https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtvatt-och_sfs-2017-630)
- [Momslagen (1994:200)](https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/mervardesskattslag-1994200_sfs-1994-200)

---

**Senast uppdaterad:** 2025-10-20  
**Version:** 1.0  
**Författare:** Lasse Karagiannis (med AI-assistans för strukturering)
