/**
 * Centraliserad lagtext-databas för onboarding-applikationen
 *
 * Källa:
 * - Länsstyrelsen Stockholms författningssamling 01FS 2024:20
 * - Penningtvättslagen (2017:630)
 *
 * Struktur:
 * - id: Unik identifierare för lagtext (används för referens i PDF)
 * - title: Kort titel
 * - law: Lagnamn och paragraf
 * - fullText: Fullständig lagtext (för Appendix i PDF)
 * - shortText: Kort version (för inline-visning i formulär)
 * - url: Länk till källa (om tillgänglig)
 */

export const legalTexts = {
  // ========================================
  // IDENTITETSKONTROLL
  // ========================================
  identitetskontroll: {
    id: "PTL_3_4",
    title: "Kontroll av kundens identitet",
    law: "01FS 2024:20, 3 kap. 4 § och Penningtvättslagen (2017:630)",
    shortText: "Redovisningsbyrån är skyldig att kontrollera kundens identitet enligt PTL 3 kap. 4 § och 01FS 2024:20, 3 kap. 4 §.",
    fullText: `Länsstyrelsen Stockholms författningssamling 01FS 2024:20, 3 kap. 4 § - Kontroll av kundens identitet

Identitetskontrollen ska göras genom att:
1. Identitetshandlingen granskas avseende giltighet, äkthet och att den tillhör den som visar upp den
2. Uppgifter från identitetshandlingen noteras
3. En kopia av identitetshandlingen tas eller nödvändiga uppgifter från den registreras på annat sätt

Denna kontroll måste dokumenteras och sparas enligt 01FS 2024:20, 3 kap. 4 §.

Grundlag: Lagen (2017:630) om åtgärder mot penningtvätt och finansiering av terrorism, 3 kap. 4 §.`,
    url: "https://www.lansstyrelsen.se/stockholm/om-oss/om-lansstyrelsen-stockholm/lanets-forfattningssamling/forfattningar-2024/forfattningssamling-2024/2024-06-03-01fs-202420.html"
  },

  // ========================================
  // KONTANTTRANSAKTIONER
  // ========================================
  kontanttransaktioner: {
    id: "PTL_3_6",
    title: "Kundkännedom vid kontanttransaktioner",
    law: "Penningtvättslagen (2017:630) 3 kap. 6 §",
    shortText: "Kontanter (≥5000 euro per transaktion) kräver kundkännedom enligt PTL 3 kap. 6 §. Kontanter innebär sämre spårbarhet och högre anonymitet.",
    fullText: `Penningtvättslagen (2017:630) 3 kap. 6 § - Kundkännedom vid kontanttransaktioner

Kundkännedom ska inhämtas:

1. När det under en affärsförbindelses gång står klart att utbetalt eller mottaget belopp i kontanter inom ramen för en affärsförbindelse uppgår till minst 5000 euro

2. Vid enstaka transaktioner där utbetalt eller mottaget belopp i kontanter uppgår till ett belopp som motsvarar minst 5000 euro

3. Vid transaktioner där utbetalt eller mottaget belopp i kontanter understiger ett belopp som motsvarar 5000 euro men där det finns misstanke om att transaktionen har samband med en eller flera andra transaktioner i kontanter som tillsammans uppgår till minst detta belopp

Lag (2021:903).

Kommentar: Kontanter och kryptovalutor innebär sämre spårbarhet och högre anonymitet, vilket ökar risken för penningtvätt enligt 01FS 2024:20, 2 kap. 4 §.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  kontantRisk: {
    id: "01FS_2_4_KONTANT",
    title: "Riskbedömning av kontantintensiva kunder",
    law: "01FS 2024:20, 2 kap. 4 §",
    shortText: "Kontantintensiva branscher innebär högre risk och kräver fördjupad dokumentation enligt 01FS 2024:20, 2 kap. 4 §.",
    fullText: `01FS 2024:20, 2 kap. 4 § - Riskbedömning av kunder

För att bestämma kundens riskprofil (2 kap. 3 §) måste verksamhetsutövaren bedöma:
- Kundens verksamhet och bransch
- Betalningsmetoder (kontanter innebär högre risk)
- Geografisk exponering
- Ägarstruktur och verkliga huvudmän

Betalningsmetod avgör när kundkännedom krävs (3 kap. 4 § och 6 §), hur omfattande övervakning behövs (4 kap. 1 §) och om skärpta åtgärder måste vidtas (3 kap. 16 §). Kontanter och kryptovalutor innebär sämre spårbarhet och högre anonymitet.

Branscher med högre risk inkluderar: kontantintensiva verksamheter, kryptovalutahandel, värdeöverföringstjänster.`,
    url: "https://www.lansstyrelsen.se/stockholm/om-oss/om-lansstyrelsen-stockholm/lanets-forfattningssamling/forfattningar-2024/forfattningssamling-2024/2024-06-03-01fs-202420.html"
  },

  // ========================================
  // SKYLDIGHETER & FÖRBUD
  // ========================================
  fakturaSpecifikation: {
    id: "ML_11_1",
    title: "Faktura måste vara fullständigt specificerad",
    law: "Mervärdesskattelagen (1994:200) 11 kap. 1 §",
    shortText: "Fakturor MÅSTE specificera: vad som gjorts, vad som levererats, antal, pris per enhet, timmar, moms. Vaga beskrivningar som 'Diverse arbete' är inte godkända.",
    fullText: `Mervärdesskattelagen (1994:200) 11 kap. 1 § - Innehåll i faktura

En faktura ska innehålla:
1. Fakturadatum
2. Löpnummer (unikt och fortlöpande)
3. Säljarens och köparens namn, adress och organisationsnummer
4. Antal och slag av levererade varor eller omfattningen och arten av utförda tjänster
5. Dag för leverans eller uttag av varan eller då tjänsten utfördes
6. Beskattningsunderlag per skattesats eller per undantag från skatteplikt
7. Skattesats
8. Skattens belopp i svensk valuta
9. Vid omvänd skattskyldighet: uppgift om att köparen ska redovisa skatten

Vaga beskrivningar som "Diverse arbete" eller "Konsulttjänst" utan vidare specifikation är INTE godkända.

Även Bokföringslagen (1999:1078) 5 kap. kräver att alla affärshändelser ska dokumenteras på ett spårbart sätt.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/mervardesskattlag-1994200_sfs-1994-200/"
  },

  betalningUtanFaktura: {
    id: "BFL_5_BOKF",
    title: "Förbud mot att ta emot betalning utan faktura",
    law: "Bokföringslagen (1999:1078) 5 kap. och Brottsbalken 11 kap.",
    shortText: "Det är OTILLÅTET att ta emot betalning (kontant, Swish, bankgiro) utan att utfärda faktura. Alla intäkter måste dokumenteras.",
    fullText: `Bokföringslagen (1999:1078) 5 kap. - Bokföringsskyldighet

Alla affärshändelser ska:
- Dokumenteras med verifikationer (fakturor, kvitton, etc.)
- Bokföras löpande
- Kunna spåras från verifikation till bokföring och vice versa

Att ta emot betalning utan att utfärda faktura eller annan verifikation är:
1. Brott mot bokföringsskyldigheten (kan leda till företagsbot)
2. Potentiellt bokföringsbrott enligt Brottsbalken 11 kap. 5 § (kan leda till böter eller fängelse upp till 2 år)
3. Potentiellt skattebrott om inkomsten inte redovisas

Alla betalningar (kontant, Swish, bankgiro, kort) MÅSTE dokumenteras med faktura eller kvitto.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/bokforingslag-19991078_sfs-1999-1078/"
  },

  agarlån: {
    id: "ABL_21_1",
    title: "Förbud mot lån till ägare och styrelse",
    law: "Aktiebolagslagen (2005:551) 21 kap. 1 §",
    shortText: "Det är FÖRBJUDET för företaget att låna ut pengar till ägare, styrelseledamöter, VD eller närstående. Privata uttag måste bokföras som lön/utdelning (med skatt) eller som återbetalning av tidigare aktieägartillskott.",
    fullText: `Aktiebolagslagen (2005:551) 21 kap. 1 § - Förbud mot lån till styrelseledamot m.fl.

Ett aktiebolag får inte lämna lån till:
1. Styrelseledamot
2. Verkställande direktör
3. Ägare som innehar minst tio procent av aktierna
4. Närstående till personer i punkterna 1-3

Förbudet gäller även:
- Ställa säkerhet för någons skuld
- Ikläda sig en borgensförbindelse för någon

UNDANTAG finns endast för:
- Lån som ingår i bolagets normala verksamhet och på marknadsmässiga villkor
- Koncerninterna lån under vissa förutsättningar

STRAFF: Överträdelse kan leda till böter eller fängelse enligt 30 kap. 1 § ABL.

Privata uttag ska istället hanteras som:
- Lön (arbetsgivaravgifter + skatt)
- Utdelning (efter beslut + skatt)
- Återbetalning av tidigare aktieägartillskott (dokumenterat)`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/aktiebolagslag-2005551_sfs-2005-551/"
  },

  vinstmarginal: {
    id: "ML_9A",
    title: "Förbud mot vinstmarginalbeskattning utan medgivande",
    law: "Mervärdesskattelagen (1994:200) 9a kap.",
    shortText: "Det är OTILLÅTET att tillämpa vinstmarginalbeskattning (t.ex. vid begagnathandel) utan Skatteverkets medgivande.",
    fullText: `Mervärdesskattelagen (1994:200) 9a kap. - Vinstmarginalbeskattning vid handel med begagnade varor m.m.

Vinstmarginalbeskattning innebär att moms endast betalas på vinsten (marginal) vid handel med:
- Begagnade varor
- Konstverk
- Samlarföremål
- Antikviteter

KRAV för att få tillämpa vinstmarginalbeskattning:
1. Varorna måste ha levererats till återförsäljaren av någon som inte har haft rätt till avdrag för ingående skatt
2. Särskilda regler för dokumentation och fakturering måste följas
3. I vissa fall krävs föregående medgivande från Skatteverket

FÖRBUD: Att tillämpa vinstmarginalbeskattning utan att uppfylla villkoren eller utan erforderligt medgivande är:
- Felaktig momsredovisning (kan leda till skattetillägg 40-50%)
- Potentiellt skattebrott vid uppsåt

Kontakta alltid Skatteverket INNAN ni tillämpar vinstmarginalbeskattning.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/mervardesskattlag-1994200_sfs-1994-200/"
  },

  // ========================================
  // PEP & FÖRDJUPAD KUNDKÄNNEDOM
  // ========================================
  pep: {
    id: "PTL_3_8",
    title: "Skärpt kundkännedom vid PEP",
    law: "Penningtvättslagen (2017:630) 3 kap. 8-9 §§",
    shortText: "Enligt penningtvättslagen 3 kap. 8-9 §§ ska fördjupad kundkännedom tillämpas vid affärsförbindelser med PEP (politiskt exponerade personer).",
    fullText: `Penningtvättslagen (2017:630) 3 kap. 8 § - Skärpt kundkännedom

Skärpta åtgärder för kundkännedom ska vidtas när:
1. Kunden är en politiskt exponerad person (PEP)
2. Kunden är en familjemedlem eller känd medarbetare till en PEP
3. Affärsförbindelsen eller transaktionen avser en person, verksamhet, vara eller tjänst med anknytning till ett geografiskt område där risken för penningtvätt eller finansiering av terrorism är hög
4. Andra omständigheter i det enskilda fallet medför en förhöjd risk för penningtvätt eller finansiering av terrorism

PEP-definition (3 kap. 9 §):
Person som innehar eller har innehaft ett framstående offentligt ämbete som:
- Statschef, regeringschef, minister
- Ledamot av riksdag eller parlament
- Domare i högsta domstolen eller konstitutionell domstol
- Ledamot i styrande organ för politiskt parti
- Högre officer i försvarsmakten
- Ledamot i styrelse för statligt företag
- Ambassadör eller diplomatisk beskickningschef

Skärpta åtgärder innebär:
- Inhämta information om medlens och förmögenhetens ursprung
- Intensifierad fortlöpande övervakning
- Godkännande från ledningen för att etablera affärsförbindelsen`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  skarptKundkannedom: {
    id: "01FS_3_8",
    title: "Skärpt kundkännedom - dokumentationskrav",
    law: "01FS 2024:20, 3 kap. 8 §",
    shortText: "Skärpt kundkännedom krävs vid PEP, högriskländer eller ovanliga transaktionsmönster. Måste kunna förklaras för Länsstyrelsen vid tillsyn.",
    fullText: `01FS 2024:20, 3 kap. 8 § - Skärpt kundkännedom

När skärpta åtgärder krävs enligt PTL 3 kap. 8 § (PEP, högriskländer, ovanliga transaktioner) ska verksamhetsutövaren:

1. Inhämta ytterligare information om:
   - Affärsförbindelsens syfte och art
   - Transaktionernas bakgrund och motiv
   - Medlens och förmögenhetens ursprung
   - Kundens ekonomiska situation

2. Öka frekvensen och intensiteten i den fortlöpande övervakningen

3. Dokumentera och motivera:
   - Varför affärsförbindelsen etablerades trots förhöjd risk
   - Vilka skärpta åtgärder som vidtagits
   - Hur den fortlöpande övervakningen genomförs

4. Kunna förklara för Länsstyrelsen (tillsynsmyndigheten) vid tillsyn:
   - Varför transaktionerna ser ut som de gör
   - Hur ni har bedömt och hanterat risken
   - Vilka åtgärder ni vidtagit för att upptäcka avvikande transaktioner

Dokumentationen ska vara så detaljerad att den kan granskas och förstås av tillsynsmyndigheten utan ytterligare förklaringar.`,
    url: "https://www.lansstyrelsen.se/stockholm/om-oss/om-lansstyrelsen-stockholm/lanets-forfattningssamling/forfattningar-2024/forfattningssamling-2024/2024-06-03-01fs-202420.html"
  },

  hogrisklander: {
    id: "PTL_3_17",
    title: "Skärpta åtgärder vid högriskländer",
    law: "Penningtvättslagen (2017:630) 3 kap. 17 §",
    shortText: "ALLA transaktioner med kunder etablerade i högriskländer (identifierade av EU-kommissionen) kräver skärpta åtgärder, oavsett belopp eller andel av omsättningen.",
    fullText: `Penningtvättslagen (2017:630) 3 kap. 17 § - Skärpta åtgärder vid högriskländer

Skärpta åtgärder enligt 16 § ska vidtas vid affärsförbindelser eller enstaka transaktioner när kunden är etablerad i ett land utanför EES som har identifierats som ett högrisktredjeland av Europeiska kommissionen.

Sådana åtgärder ska åtminstone avse skärpning av övervakningen av pågående affärsförbindelser och bedömningen av enstaka transaktioner enligt 4 kap. 1 § och omfatta inhämtande av:

1. ytterligare information om kunden och den verkliga huvudmannen,
2. ytterligare information om affärsförbindelsens eller den enstaka transaktionens syfte och art,
3. information om kundens och den verkliga huvudmannens ekonomiska situation och varifrån kundens och den verkliga huvudmannens ekonomiska medel kommer, och
4. godkännande från en behörig beslutsfattare att etablera eller upprätthålla en affärsförbindelse.

VIKTIGT: Skärpta åtgärder gäller ALLA transaktioner med högriskländer, oavsett belopp eller andel av omsättningen. Det finns INGEN "50%-gräns" eller liknande i PTL.

Högriskländer definieras av EU-kommissionen och listas i FATF:s lista över högriskländer (uppdateras regelbundet).

Dessutom: Vid kontanttransaktioner som kan antas uppgå till ≥5000 euro (enskilt eller tillsammans med relaterade transaktioner) krävs kundkännedom enligt PTL 3 kap. 6 §, oavsett land.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // ========================================
  // RISKBEDÖMNING
  // ========================================
  riskbedomning: {
    id: "01FS_2_4",
    title: "Riskbedömning av kunder",
    law: "01FS 2024:20, 2 kap. 4 §",
    shortText: "Verksamhetsutövaren ska bedöma kundens riskprofil baserat på verksamhet, geografi, betalningsmetoder och ägarstruktur.",
    fullText: `01FS 2024:20, 2 kap. 4 § - Riskbedömning av kunder

Verksamhetsutövaren ska för varje kund bedöma risk för penningtvätt och finansiering av terrorism baserat på:

1. Kundens verksamhet och bransch
   - Kontantintensiva branscher (högre risk)
   - Kryptovaluta och värdeöverföring (högre risk)
   - Reglerade verksamheter (lägre risk)

2. Geografisk exponering
   - FATF:s lista över högriskländer
   - Transaktioner med eller genom högriskländer
   - Kundens verksamhetsländer

3. Betalningsmetoder
   - Kontanter ≥5000 euro (högrisk enligt 3 kap. 6 § PTL)
   - Kryptovalutor (högre risk)
   - Banköverföringar (lägre risk)

4. Ägarstruktur och verkliga huvudmän
   - Komplexa ägarstrukturer (högre risk)
   - PEP-kopplingar (högre risk)
   - Transparent ägarstruktur (lägre risk)

Riskbedömningen ska dokumenteras och ligga till grund för:
- Omfattningen av kundkännedom (3 kap. 4 § PTL)
- Behovet av skärpta åtgärder (3 kap. 8 § PTL)
- Intensiteten i den fortlöpande övervakningen (4 kap. 1 § PTL)

Länsstyrelsen kräver inte bara påståenden som "låg risk" utan dokumenterade rutiner och motiveringar som kan granskas vid tillsyn.`,
    url: "https://www.lansstyrelsen.se/stockholm/om-oss/om-lansstyrelsen-stockholm/lanets-forfattningssamling/forfattningar-2024/forfattningssamling-2024/2024-06-03-01fs-202420.html"
  },

  // ========================================
  // ÖVRIGT
  // ========================================
  arkivering: {
    id: "BFL_7",
    title: "Arkivering av bokföringsmaterial",
    law: "Bokföringslagen (1999:1078) 7 kap.",
    shortText: "Bokföringsmaterial ska bevaras i minst 7 år enligt bokföringslagen.",
    fullText: `Bokföringslagen (1999:1078) 7 kap. - Arkivering

Bokföringsmaterial ska bevaras i minst 7 år efter utgången av det kalenderår då räkenskapsåret avslutades.

Detta inkluderar:
- Verifikationer (fakturor, kvitton, kontoutdrag, etc.)
- Grundbok och huvudbok
- Årsredovisning och årsbokslut
- Löneunderlag
- Räkenskapsinformation som krävs för att kunna spåra och följa affärshändelser

Bevarandet ska ske på ett betryggande sätt så att informationen:
- Är läsbar och kan skrivas ut
- Kan presenteras utan dröjsmål vid kontroll
- Inte kan ändras utan att det kan upptäckas

Digitalt sparande är tillåtet om det uppfyller kraven på spårbarhet och beständighet.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/bokforingslag-19991078_sfs-1999-1078/"
  },

  eidas: {
    id: "EIDAS",
    title: "Elektroniska signaturer enligt eIDAS",
    law: "eIDAS-förordningen (EU) 910/2014",
    shortText: "BankID är en godkänd metod för elektroniska signaturer enligt eIDAS-förordningen och svensk lag.",
    fullText: `eIDAS-förordningen (EU) Nr 910/2014 - Elektronisk identifiering och betrodda tjänster

eIDAS (electronic IDentification, Authentication and trust Services) är en EU-förordning som reglerar elektronisk identifiering och signaturer inom EU.

BankID är:
- En godkänd metod för stark kundautentisering (SCA)
- Accepterat som kvalificerad elektronisk signatur i Sverige
- Juridiskt bindande enligt svensk lag

Elektroniska signaturer med BankID har samma juridiska kraft som handskrivna signaturer enligt:
- eIDAS-förordningen Art. 25
- Lag (2016:561) om tjänster för elektronisk identifiering

Detta innebär att avtal signerade med BankID är:
- Juridiskt bindande
- Kan användas som bevis i domstol
- Uppfyller krav för dokumentation i penningtvättslagen`,
    url: "https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX%3A32014R0910"
  },

  // ========================================
  // STEG 2: GEOGRAFISK RISK & AFFÄRSRELATIONER
  // ========================================
  
  // 2 kap. 1 § PTL - Allmän riskbedömning
  ptl_2_1: {
    id: "PTL_2_1",
    title: "Allmän riskbedömning",
    law: "Penningtvättslagen (2017:630) 2 kap. 1 §",
    shortText: "Verksamhetsutövare ska göra riskbedömning av kunder, länder, produkter och transaktioner.",
    fullText: `En verksamhetsutövare ska göra en riskbedömning av i vilken utsträckning verksamhetsutövarens verksamhet kan komma att utnyttjas för penningtvätt eller finansiering av terrorism. Riskbedömningen ska vara anpassad till verksamhetens storlek och art.

Riskbedömningen ska innehålla en bedömning av de risker som är förknippade med
1. verksamhetsutövarens kunder,
2. de länder eller geografiska områden som verksamhetsutövaren har kunder i eller affärsrelationer med,
3. de produkter och tjänster som verksamhetsutövaren tillhandahåller, och
4. de transaktioner och distributionskanaler som verksamhetsutövaren använder.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 2 kap. 3 § PTL - Riskbedömning av kunder
  ptl_2_3: {
    id: "PTL_2_3",
    title: "Riskbedömning av kunder",
    law: "Penningtvättslagen (2017:630) 2 kap. 3 §",
    shortText: "Riskbedömning ska göras innan affärsförbindelsen inleds eller transaktionen genomförs.",
    fullText: `En verksamhetsutövare ska göra en bedömning av vilken risk för penningtvätt eller finansiering av terrorism som kan förknippas med en affärsförbindelse eller en enstaka transaktion (riskbedömning av kunder).

Riskbedömningen ska göras innan affärsförbindelsen inleds eller den enstaka transaktionen genomförs.

En riskbedömning får även göras efter det att affärsförbindelsen har inletts eller den enstaka transaktionen har genomförts, om detta är nödvändigt för att inte störa den normala affärsverksamheten och risken för penningtvätt eller finansiering av terrorism är låg.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 2 kap. 5 § PTL - Geografisk risk
  ptl_2_5: {
    id: "PTL_2_5",
    title: "Geografisk riskfaktor",
    law: "Penningtvättslagen (2017:630) 2 kap. 5 §",
    shortText: "Transaktioner i/från/till högriskländer utan effektiva AML-system utgör förhöjd risk.",
    fullText: `Som omständigheter som kan tyda på att risken är hög kan verksamhetsutövaren beakta:
5. att transaktionen genomförs i, från eller till en stat som Europeiska kommissionen eller FATF har identifierat som en stat som saknar effektiva system för att förebygga penningtvätt eller finansiering av terrorism.

Högriskländer kan variera över tid enligt EU-kommissionens högrisklista och FATF-listan.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 3 kap. 1 § PTL - Otillräcklig kundkännedom
  ptl_3_1: {
    id: "PTL_3_1",
    title: "Otillräcklig kundkännedom",
    law: "Penningtvättslagen (2017:630) 3 kap. 1 §",
    shortText: "Om kundkännedom inte kan inhämtas får affärsförbindelse inte inledas eller transaktion genomföras.",
    fullText: `Om kundkännedomsåtgärder enligt detta kapitel inte kan vidtas får en verksamhetsutövare inte
1. inleda en affärsförbindelse,
2. genomföra en enstaka transaktion, eller
3. fortsätta en affärsförbindelse.

Om en verksamhetsutövare väljer att inte inleda eller fortsätta en affärsförbindelse eller genomföra en enstaka transaktion enligt första stycket, ska verksamhetsutövaren överväga om förhållandena är sådana att en anmälan ska göras enligt 5 kap. 1 §.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 3 kap. 11 § PTL - Kontroll av högriskländer
  ptl_3_11: {
    id: "PTL_3_11",
    title: "Kontroll av högriskländer",
    law: "Penningtvättslagen (2017:630) 3 kap. 11 §",
    shortText: "Affärsförbindelser med högriskländer kräver skärpta åtgärder och särskild uppmärksamhet.",
    fullText: `En verksamhetsutövare ska ägna särskild uppmärksamhet åt affärsförbindelser och transaktioner som rör länder för vilka detta föreskrivs av Europeiska kommissionen eller av Financial Action Task Force on Money Laundering.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 3 kap. 12 § PTL - Information om affärsförbindelsens syfte och art
  ptl_3_12: {
    id: "PTL_3_12",
    title: "Information om affärsförbindelsens syfte och art",
    law: "Penningtvättslagen (2017:630) 3 kap. 12 §",
    shortText: "Verksamhetsutövare ska inhämta information om affärsförbindelsens syfte och art för att bedöma förväntade aktiviteter och kundens riskprofil.",
    fullText: `En verksamhetsutövare ska inhämta information om affärsförbindelsens syfte och art. Informationen ska ligga till grund för en bedömning av
1. vilka aktiviteter och transaktioner som kunden kan förväntas vidta och genomföra inom ramen för affärsförbindelsen, och
2. kundens riskprofil enligt 2 kap. 3 §.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 3 kap. 16 § PTL - Skärpta åtgärder vid hög risk
  ptl_3_16: {
    id: "PTL_3_16",
    title: "Skärpta åtgärder vid hög risk",
    law: "Penningtvättslagen (2017:630) 3 kap. 16 §",
    shortText: "Vid hög risk krävs särskilt omfattande kontroller, bedömningar och utredningar.",
    fullText: `Om risken för penningtvätt eller finansiering av terrorism som kan förknippas med kundrelationen bedöms som hög, ska särskilt omfattande kontroller, bedömningar och utredningar enligt 7, 8 och 10-13 §§ göras. En verksamhetsutövare ska vidta de åtgärder som är nödvändiga för att hantera risken.

Vid högrisk ska verksamhetsutövaren:
- Inhämta ytterligare information om kunden och den verkliga huvudmannen
- Inhämta ytterligare information om affärsförbindelsens syfte
- Inhämta information om varifrån kundens tillgångar och medel kommer
- Övervaka affärsförbindelsen mer frekvent och noggrant`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 3 kap. 17 § PTL - Skärpta åtgärder vid högrisktredjeland
  ptl_3_17: {
    id: "PTL_3_17",
    title: "Skärpta åtgärder vid högrisktredjeland",
    law: "Penningtvättslagen (2017:630) 3 kap. 17 §",
    shortText: "Affärsförbindelser med personer i högriskländer kräver förstärkt granskning och riskhantering.",
    fullText: `En verksamhetsutövare ska vidta åtgärder för att hantera de risker som är förknippade med affärsförbindelser eller transaktioner som rör länder som Europeiska kommissionen enligt artikel 9 i direktiv (EU) 2015/849 har identifierat som högriskländer.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 4 kap. 1 § PTL - Övervakningsskyldighet
  ptl_4_1: {
    id: "PTL_4_1",
    title: "Övervakningsskyldighet",
    law: "Penningtvättslagen (2017:630) 4 kap. 1 §",
    shortText: "Verksamhetsutövare ska övervaka pågående affärsförbindelser för att upptäcka avvikande transaktioner.",
    fullText: `En verksamhetsutövare ska övervaka pågående affärsförbindelser och bedöma enstaka transaktioner för att säkerställa att transaktioner som görs överensstämmer med den kännedom som verksamhetsutövaren har om kunden, kundens verksamhet och riskprofil, samt i förekommande fall ursprunget till kundens tillgångar och medel. Om transaktioner avviker från förväntat mönster ska verksamhetsutövaren utreda orsakerna.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // ========================================
  // STEG 3: BETALNINGSFLÖDEN
  // ========================================

  // 3 kap. 7-8 §§ PTL - Tredjepartsbetalningar
  ptl_3_7_8: {
    id: "PTL_3_7_8",
    title: "Identifiering av tredje part",
    law: "Penningtvättslagen (2017:630) 3 kap. 7-8 §§",
    shortText: "Om betalning kommer från tredje part måste dennes identitet verifieras och relation till kunden förstås.",
    fullText: `3 kap. 7 § - Om en verksamhetsutövare får kännedom om att en annan person än kunden agerar för kundens räkning, ska verksamhetsutövaren ta reda på identiteten hos denna person och vidta skäliga åtgärder för att verifiera denna identitet.

3 kap. 8 § - Om en verksamhetsutövare får kännedom om att kunden agerar för en annans räkning, ska verksamhetsutövaren ta reda på identiteten hos denne annan och vidta skäliga åtgärder för att verifiera identiteten.

Tredjepartsbetalningar kan dölja penningtvättens ursprung genom att bryta spårbarheten ("layering").`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 3 kap. 31-32 §§ PTL - Elektroniska pengar
  ptl_3_31_32: {
    id: "PTL_3_31_32",
    title: "Elektroniska pengar och förenklade åtgärder",
    law: "Penningtvättslagen (2017:630) 3 kap. 31-32 §§",
    shortText: "Elektroniska betalningsmetoder med lägre belopp kan ha förenklade åtgärder, men kräver fortfarande övervakning.",
    fullText: `3 kap. 31 § - En utgivare av elektroniska pengar får tillämpa förenklade kundkännedomsåtgärder om särskilda villkor är uppfyllda.

3 kap. 32 § - Förenklade åtgärder får endast tillämpas om risken för penningtvätt eller finansiering av terrorism är låg och verksamhetsutövaren kan säkerställa tillräcklig övervakning.

Elektroniska betalningsmetoder (Swish, kort, etc.) ger bättre spårbarhet än kontanter men kräver fortfarande riskbedömning och övervakning.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // ========================================
  // STEG 4: ENHANCED DUE DILIGENCE (EDD)
  // ========================================

  // 3 kap. 6 § PTL - Identifiering av verkliga huvudmän
  ptl_3_6_vhm: {
    id: "PTL_3_6_VHM",
    title: "Identifiering av verkliga huvudmän",
    law: "Penningtvättslagen (2017:630) 3 kap. 6 §",
    shortText: "Verksamhetsutövare ska ta reda på och verifiera identiteten hos verkliga huvudmän.",
    fullText: `En verksamhetsutövare ska ta reda på om det finns en eller flera verkliga huvudmän och vidta skäliga åtgärder för att identifiera och verifiera identiteten hos var och en av dessa.

Verklig huvudman definieras i 1 kap. 5 §: Den fysiska person som i sista hand äger eller kontrollerar en juridisk person eller en trust.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 3 kap. 13 § PTL - Kontroll av medlens ursprung
  ptl_3_13: {
    id: "PTL_3_13",
    title: "Kontroll av medlens ursprung",
    law: "Penningtvättslagen (2017:630) 3 kap. 13 §",
    shortText: "Verksamhetsutövare ska granska och dokumentera ursprunget till tillgångar och medel.",
    fullText: `Verksamhetsutövaren ska granska och dokumentera ursprunget till de tillgångar och medel som används i affärsförbindelsen eller i den enstaka transaktionen.

Vid högrisk krävs särskilt omfattande kontroll av medlens ursprung för att säkerställa att tillgångar inte kommer från brottslig verksamhet.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 3 kap. 19 § PTL - Åtgärder vid PEP
  ptl_3_19: {
    id: "PTL_3_19",
    title: "Åtgärder vid politiskt utsatt person (PEP)",
    law: "Penningtvättslagen (2017:630) 3 kap. 19 §",
    shortText: "PEP utgör förhöjd risk för korruption. Kräver uppgifter om förmögenhet, medlens ursprung och särskild övervakning.",
    fullText: `Om kunden eller den verkliga huvudmannen är en politiskt utsatt person ska verksamhetsutövaren, utöver de åtgärder som ska vidtas enligt 1-18 §§:
1. inhämta uppgifter om personens förmögenhets- och inkomstförhållanden,
2. fastställa varifrån de tillgångar och medel som används i affärsförbindelsen eller den enstaka transaktionen kommer, och
3. särskilt noggrant övervaka affärsförbindelsen.

PEP utgör förhöjd risk för korruption och förskingring av offentliga medel (se 2 kap. 5 § punkt 4 PTL).`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 3 kap. 4 § PTL - 15 000 euro threshold
  ptl_3_4_threshold: {
    id: "PTL_3_4_THRESHOLD",
    title: "Kundkännedom vid enstaka transaktioner",
    law: "Penningtvättslagen (2017:630) 3 kap. 4 §",
    shortText: "Kundkännedom krävs vid transaktioner ≥15 000 euro (ca 150 000 kr).",
    fullText: `Kundkännedomsåtgärder ska vidtas vid enstaka transaktioner om transaktionsbeloppet uppgår till minst 15 000 euro eller motsvarande belopp i annan valuta.

Detta gäller både enstaka transaktioner och flera transaktioner som verkar hänga samman.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 5 kap. 1 § PTL - Anmälningsskyldighet
  ptl_5_1: {
    id: "PTL_5_1",
    title: "Anmälningsskyldighet till FIU-Sverige",
    law: "Penningtvättslagen (2017:630) 5 kap. 1 §",
    shortText: "Misstänkta transaktioner ska anmälas till FIU-Sverige (Finanspolisen).",
    fullText: `En verksamhetsutövare ska utan dröjsmål anmäla omständigheter som verksamhetsutövaren misstänker kan ha samband med penningtvätt eller finansiering av terrorism till Finanspolisen (FIU-Sverige).

Anmälningsskyldigheten gäller även om transaktionen ännu inte har genomförts.

Stora inbetalningar som avviker från kundens normala omsättning kan vara ett tecken på "placement" (första steget i penningtvätt) där brottsliga medel förs in i det finansiella systemet.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  },

  // 01FS 2024:20, 3 kap. 8 § - Skärpt kundkännedom
  lansstyrelsen_3_8: {
    id: "01FS_3_8",
    title: "Skärpt kundkännedom",
    law: "01FS 2024:20, 3 kap. 8 §",
    shortText: "Vid hög risk krävs ytterligare information, förståelse för ekonomiskt syfte och frekventare övervakning.",
    fullText: `Vid hög risk ska verksamhetsutövaren särskilt:
- Inhämta ytterligare information om kundens verksamhet och planerade transaktioner
- Förstå affärsförbindelsens ekonomiska syfte
- Identifiera varifrån medel kommer och vart de ska
- Övervaka affärsförbindelsen mer frekvent och noggrant
- Inhämta information från oberoende källor
- Verifiera att uppgifter om affärsrelationer stämmer
- Dokumentera alla väsentliga affärsförbindelser

Vid utländska bankkonton i högriskländer ska verksamhetsutövaren:
- Inhämta information om transaktionernas syfte och avsedda karaktär
- Dokumentera affärsförbindelsens art
- Övervaka transaktioner löpande
- Granska ursprung och destination för betalningar`,
    url: "https://www.lansstyrelsen.se/stockholm/om-oss/om-lansstyrelsen-stockholm/lanets-forfattningssamling/forfattningar-2024/forfattningssamling-2024/2024-06-03-01fs-202420.html"
  },

  // 1 kap. 5 § PTL - Definition av penningtvätt
  ptl_1_5: {
    id: "PTL_1_5",
    title: "Definition av penningtvätt",
    law: "Penningtvättslagen (2017:630) 1 kap. 5 §",
    shortText: "Penningtvätt definieras som att ta emot, använda eller befatta sig med egendom som härrör från brott.",
    fullText: `Med penningtvätt avses att:
- ta emot, använda eller på annat sätt hantera egendom som härrör från brottslig verksamhet
- vidta åtgärder för att dölja eller skyla över egendomens brottsliga ursprung

Kontroll av startkapitalets ursprung är därför central i riskbedömningen för att säkerställa att företaget inte används för att legitimera ("tvätta") brottsligt förvärvade medel.`,
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2017630-om-atgarder-mot-penningtv_sfs-2017-630/"
  }
};

/**
 * Hjälpfunktion för att hämta lagtext via ID
 */
export const getLegalText = (id) => {
  return Object.values(legalTexts).find(text => text.id === id);
};

/**
 * Hjälpfunktion för att generera Appendix för PDF
 * Returnerar alla lagtexter sorterade efter ID
 */
export const generateLegalAppendix = () => {
  return Object.values(legalTexts).sort((a, b) => a.id.localeCompare(b.id));
};

/**
 * Hjälpfunktion för att formatera lagtext för inline-visning
 */
export const formatInlineLegal = (key) => {
  const text = legalTexts[key];
  if (!text) return null;

  return {
    reference: `[${text.id}]`,
    law: text.law,
    shortText: text.shortText
  };
};

// ========================================
// STRUKTURERAD MAPPNING PER STEG & FRÅGA
// ========================================

/**
 * Steg 2: Geografisk risk & Affärsrelationer
 * Mappning av frågor till relevanta lagtexter
 */
export const riskFragorSteg2 = {
  blockA_question1: {
    // Fråga 1: Har företaget utländska kunder?
    title: "Utländska kunder",
    legalTexts: ['ptl_2_1', 'ptl_3_11', 'ptl_3_12', 'ptl_3_17']
  },
  blockA_question2: {
    // Fråga 2: Ungefär hur stor andel av omsättningen från utländska kunder?
    title: "Omsättningsandel utland",
    legalTexts: ['ptl_2_3', 'ptl_3_12', 'ptl_3_16']
  },
  blockA_question3: {
    // Fråga 3: Typ av internationellt samarbete
    title: "Typ av samarbete",
    legalTexts: ['ptl_3_12', 'ptl_3_1', 'ptl_3_16']
  },
  blockB_question4: {
    // Fråga 4: Tre största leverantörer
    title: "Största leverantörer",
    legalTexts: ['ptl_2_1', 'ptl_2_3', 'ptl_3_12']
  },
  blockC_question5: {
    // Fråga 5: Tre största kunder
    title: "Största kunder",
    legalTexts: ['ptl_2_1', 'ptl_2_3', 'ptl_3_12']
  },
  blockC_question6: {
    // Fråga 6: Utländska bankkonton
    title: "Utländska bankkonton",
    legalTexts: ['ptl_4_1', 'ptl_3_16', 'ptl_2_5', 'lansstyrelsen_3_8']
  }
};

/**
 * Steg 3: Betalningsflöden & Transaktionsmönster
 */
export const riskFragorSteg3 = {
  question1: {
    // Fråga 1: Hur tar företaget betalt?
    title: "Betalningsmetoder",
    legalTexts: ['ptl_2_3', 'ptl_3_31_32', 'ptl_4_1']
  },
  question2: {
    // Fråga 2: Kontantandel
    title: "Kontanthantering",
    legalTexts: ['kontanttransaktioner', 'kontantRisk', 'ptl_3_16']
  },
  question3: {
    // Fråga 3: Utländsk valuta
    title: "Utländsk valuta",
    legalTexts: ['ptl_2_5', 'ptl_3_16', 'ptl_4_1']
  },
  question4: {
    // Fråga 4: Transaktioner >150 000 kr
    title: "Stora transaktioner",
    legalTexts: ['ptl_3_4_threshold', 'ptl_4_1', 'ptl_3_16']
  },
  question5: {
    // Fråga 5: Tredjepartsbetalningar
    title: "Tredjepartsbetalningar",
    legalTexts: ['ptl_3_7_8', 'ptl_3_16', 'ptl_4_1']
  }
};

/**
 * Steg 4: Enhanced Due Diligence (EDD) - Konditionellt
 */
export const riskFragorSteg4 = {
  question1: {
    // Fråga 1: Fördjupad beskrivning av affärsförbindelsen
    title: "Affärsförbindelsens syfte",
    legalTexts: ['ptl_3_16', 'ptl_3_12', 'lansstyrelsen_3_8']
  },
  question2: {
    // Fråga 2: Startkapital och finansiering
    title: "Startkapital",
    legalTexts: ['ptl_3_13', 'ptl_3_16', 'lansstyrelsen_3_8', 'ptl_1_5']
  },
  question3: {
    // Fråga 3: Dokumentation av affärsrelationer
    title: "Affärsdokumentation",
    legalTexts: ['ptl_3_16', 'ptl_3_12', 'lansstyrelsen_3_8']
  },
  question4: {
    // Fråga 4: Ovanliga transaktionsmönster
    title: "Transaktionsmönster",
    legalTexts: ['ptl_4_1', 'ptl_3_16', 'lansstyrelsen_3_8', 'ptl_2_5']
  },
  question5: {
    // Fråga 5: Verkliga huvudmän (fördjupad)
    title: "Verkliga huvudmän",
    legalTexts: ['ptl_3_6_vhm', 'ptl_3_19', 'ptl_3_16']
  },
  question6: {
    // Fråga 6: Stora inbetalningar
    title: "Stora inbetalningar",
    legalTexts: ['ptl_3_13', 'ptl_3_4_threshold', 'ptl_4_1', 'ptl_5_1']
  }
};

/**
 * Hjälpfunktion för att hämta alla lagtexter för en specifik fråga
 * @param {string} step - 'steg2', 'steg3', eller 'steg4'
 * @param {string} questionKey - Nyckel för frågan (t.ex. 'blockA_question1')
 * @returns {Array} Array med lagtext-objekt
 */
export const getLegalTextsForQuestion = (step, questionKey) => {
  let stepData;
  switch(step) {
    case 'steg2':
      stepData = riskFragorSteg2;
      break;
    case 'steg3':
      stepData = riskFragorSteg3;
      break;
    case 'steg4':
      stepData = riskFragorSteg4;
      break;
    default:
      return [];
  }

  const question = stepData[questionKey];
  if (!question) return [];

  return question.legalTexts.map(key => legalTexts[key]).filter(Boolean);
};
