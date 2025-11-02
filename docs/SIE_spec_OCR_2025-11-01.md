

============================================================
PAGE 1/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
SIE filformat

Utgåva 4B – 2008-09-30

============================================================
PAGE 2/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
Innehåll
1. Inledning.................................................................................................................................................. 5
   Bakgrund .................................................................................................................................................. 5
   Målsättning............................................................................................................................................. 5
2. Efterlevnad av standarden.................................................................................................................... 5
3. Test av SIE-filformat ............................................................................................................................. 6
   Lista över godkända program............................................................................................................. 6
   Godkännandets varaktighet .................................................................................................................. 6
   Användning av SIE-gruppens logotype............................................................................................. 6
   Skrivning av SIE-filer ............................................................................................................................ 6
   Inläsning ................................................................................................................................................ 6
4. De olika typerna av SIE-filer ............................................................................................................. 7
   Allmänt om de olika filtyperna ......................................................................................................... 7
   Typ 1 - Export av bokslutssaldon....................................................................................................... 7
   Typ 2 - Export av periodsaldon.......................................................................................................... 7
   Typ 3 - Export av objektsaldon ......................................................................................................... 7
   Typ 4 - Import/Export av transaktioner............................................................................................ 7
5. Filformatet............................................................................................................................................. 8
   Filernas namn och placering.............................................................................................................. 8
   Filens innehåll....................................................................................................................................... 8
   Allmänt om SIE-filens uppbyggnad.................................................................................................. 9
   Skillnaden mellan en obligatorisk post och ett obligatoriskt fält.................................................. 9
   Ingående och utgående balanser ...................................................................................................... 9
   När saldon saknas............................................................................................................................... 9
6. Obligatoriska och frivilliga poster i SIE-filen.................................................................................... 10
7. Att tänka på vid läsning av SIE-filer .................................................................................................. 12
   Utbyggbarhet....................................................................................................................................... 12
   Användning av flaggposten ............................................................................................................. 12
   Immunitet mot extremdata ............................................................................................................... 13
8. Objektredovisning i SIE-filer (typ 3 och 4)..................................................................................... 13
   Deklaration av dimensioner ............................................................................................................. 13
   Universella dimensioner.................................................................................................................... 13

============================================================
PAGE 3/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
Enkla dimensioner .................................................................................................................................................. 14
Hierarkiska dimensioner........................................................................................................................................... 14
Underkonton ............................................................................................................................................................. 15
Reserverade dimensionsnummer ............................................................................................................................ 15
Användning av dimensioner och objekt i importfiler av typ 4 ................................................................. 15
Transaktionernas objektlista ................................................................................................................................. 16
9. Kvantitetsredovisning i SIE-filer ..................................................................................................................... 16
Allmänt om kvantitetsredovisning ..................................................................................................................... 16
10. Kontrollsummering ........................................................................................................................................... 17
Syfte....................................................................................................................................................................... 17
Praktiskt införande i SIE-standarden ............................................................................................................. 17
Införande av kontrollsumman i SIE-filen ...................................................................................................... 17
Algoritm för kontrollsummering ....................................................................................................................... 17
Parametrar för kontrollsummaalgoritmen........................................................................................................ 18
Vilka delar av filinnehållet ska kontrollsummeras?....................................................................................... 18
Exempel ............................................................................................................................................................... 18
Kodexempel på kontrollsummering .................................................................................................................. 18
11. Beskrivning av samtliga posttyper ............................................................................................................... 21
#ADRESS    Adressuppgifter för det exporterade företaget............................................................................. 21
#BKOD      Branschkod för det exporterade företaget..................................................................................... 21
#DIM       Enkel dimension............................................................................................................................... 21
#ENHET     Enhet vid kvantitetsredovisning .................................................................................................. 21
#FLAGGA    Importflaggan................................................................................................................................. 22
#FNAMN     Fullständigt namn för det företag som exporterats. ................................................................. 22
#FNR       Redovisningsprogrammets internkod för företaget som exporterats......................... 22
#FORMAT    Anger vilken teckenuppsättning som används........................................................................ 23
#FTYP      Typ av företag ............................................................................................................................... 23
#GEN       Anger när och av vem som filen genererats ............................................................................. 24
#IB        Ingående balans för balanskonto.................................................................................................. 24
#KONTO     Kontouppgifter............................................................................................................................... 25
#KPTYP     Typ av kontoplan......................................................................................................................... 25
#KTYP      Kontotyp ....................................................................................................................................... 25

============================================================
PAGE 4/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
#OBJEKT    Objekt................................................................................................................................. 26
#OIB      Ingående balans för objekt ............................................................................................. 26
#OMFATTN   Datum för periodsaldons omfattning ................................................................. 27
#ORGNR    Anger organisationsnummer för det företag som exporterats ....................... 27
#OUB      Utgående balans för objekt ..................................................................................... 27
#PBUDGET  Periodbudgetpost. .................................................................................................. 28
#PROGRAM  Anger program som exporterat filen ................................................................. 28
#PROSA    Fri kommentartext kring filens innehåll................................................................. 28
#PSALDO   Periodsaldopost ........................................................................................................ 29
#RAR      Räkenskapsår från vilket exporterade data hämtats............................................. 29
#RES      Saldo för resultatkonto ............................................................................................ 30
#SIETYP   Anger vilken filtyp inom SIE-formatet som filen följer ..................................... 30
#SRU      SRU-kod för överföring av kontosaldo till deklaration ....................................... 30
#TAXAR    Taxeringsår som SRU-koderna avser ................................................................. 31
#TRANS    Transaktionspost..................................................................................................... 31
#RTRANS   Tillagd transaktionspost.......................................................................................... 32
#BTRANS   Borttagen transaktionspost ................................................................................... 33
#UB       Utgående balans för balanskonto........................................................................... 34
#UNDERDIM Underdimension vid hierarkiska dimensioner .................................................. 35
#VALUTA   Redovisningsvaluta .................................................................................................. 35
#VER      Verifikationspost....................................................................................................... 35

12. Sammanfattning av samtliga posttyper............................................................................. 36

============================================================
PAGE 5/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
1. Inledning

Bakgrund
1.1. I allt större utsträckning framställs önskemål om överföring av data mellan olika typer av program. På en del områden har det utarbetats standarder, antingen genom standardiseringsorganisationer eller genom att någon programtillverkare s filformat blivit de-facto-standard.
1.2. Inom redovisningsprogrammens värld har det dock inte funnits några standarder. Den som har önskat föra över redovisningsdata mellan program från olika leverantörer har ofta stått helt utan hjälp. I en del fall har programleverantörerna implementerat import- eller exportrutiner riktade mot en viss annan leverantörs interna filformat. Detta tillvägagångssätt ger kraftiga begränsningar.
1.3. Ett mer användbart alternativ är att programleverantörerna enas kring ett gemensamt filformat för import/export. SIE-formatet är resultatet av ett sådant arbete.

Målsättning
1.4. Målsättningen med standarden är följande:
• Vid tveksamhet om två program kan kommunicera ska det räcka att undersöka om båda hanterar SIE-filer av en viss typ. Om så är fallet ska man kunna vara säker på att överföringen fungerar.
• Filformatet ska kunna utökas utan att filer exporterade enligt tidigare versioner av standarden blir oläsbara.
• Det ska vara lätt att skriva exporterande och importerande program i de flesta programmeringsspråk.
• Filerna ska ha en enkel uppbyggnad.
• Filformatet ska vara lätt att läsa utan speciell programvara. Genom att använda sig av klartext i filerna kan dessa enkelt granskas med hjälp av en vanlig textredigerare eller ordbehandlare. Detta är viktigt för att man enkelt ska kunna verifiera funktionen hos de system som genererar filerna.
• Filformatet ska vara så generellt som möjligt, så att de täcker in de flesta variationer i exporterbare data som förekommer i olika redovisningsprogram. På motsvarande sätt ska de flesta variationer i databehov i importerande program tillgodoses.

2. Efterlevnad av standarden
2.1. En programleverantör som väljer att exportera data enligt specifikationen av SIE-formatet skall i sin implementation understödja filspecifikationen i sin helhet. Om bara en delmängd av de obligatoriska posttyperna exporteras kan man inte anse att programmet följer SIE-formatet.
2.2. Ett importerande program ska kunna förutsätta att en SIE-fil av en viss angiven typ innehåller de poster som specificerats för filtypen. Det är helt förkastligt att exportera endast de posttyper man tror behövs av ett visst mottagande program. Ett sådant program följer inte SIE-standarden och får inte marknadsföras som ett sådant.
2.3. Vid marknadsföring av ett program som genererar SIE-filer bör anges vilken typ av SIE-fil som kan genereras. Om typ ej anges ska åtminstone specifikationen för typ 1 följas. På motsvarande sätt bör tillverkare av SIE-läsande program ange vilken typ av

============================================================
PAGE 6/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
filer som krävs. Vid användning av SIE-gruppens logotyp är det ett krav att filtyp anges.
2.4. Syftet med dessa ”varudeklarationskrav” är att den som inskaffar ett program med SIE-export och ett med SIE-import ska kunna vara förvissad om att överföringen mellan dessa ska fungera.

3. Test av SIE-filformat

Lista över godkända program
3.1. SIE-gruppen upprättar med utgångspunkt från genomförda tester en lista över godkända program. Denna lista används i SIE-gruppens informationsverksamhet. I listan noteras även i vilken omfattning programmet hanterar vissa valfria uppgifter i SIE-formatet.

Godkännandets varaktighet
3.2. I SIE-gruppens lista anges från och med vilken programversion som stöd för SIE-filer finns. Programleverantören skall meddela SIE-gruppen om det registrerade stödet för SIE-filer upphör delvis eller i sin helhet.
3.3. Ett godkännande kan omedelbart återkallas om det visar sig att programmets stöd för SIE-filer inte längre motsvarar de uppgifter som lämnats i samband med godkännandet.
3.4. Programleverantör som lämnar vilseledande eller grovt oriktiga uppgifter kan bli föremål för disciplinär prövning.

Användning av SIE-gruppens logotype
3.5. Godkännandet ger programleverantören rätt att utnyttja SIE-gruppens logotyp i samband med marknadsföring av det godkända programmet. Direkt under logotypen skall anges vilka filtyper som programmet blivit godkänt för. Om programmet är godkänt för läsning av en viss filtyp anges ett L efter typnumret.

Exempel:
1, 2, 4L   Programmet skriver filer enligt typ 1, 2 och 4, samt läser filer enligt typ 4.

Skrivning av SIE-filer
3.6. Ifylld anmälan insändes tillsammans med testfiler till SIE-gruppen.
3.7. Testfilerna skall innehålla ett fullödigt testmaterial. Filer insända för test som endast innehåller ett fåtal poster kommer att underkännas även om filen i sig är korrekt. Filen ska innehålla saldon avseende föregående år, budgetvärden och motsvarande för att betraktas som fullödig.

Inläsning
3.8. För att vara godkänt avseende inläsning av en viss filtyp krävs att programmet felfritt läst in de testfiler som finns tillgängliga på SIE-Gruppens hemsida, samt att programleverantören intygar att så är fallet.
3.9. Ett program som klarar att läsa in uppgifterna från SIE-filer av typ 1 skall givetvis kunna läsa dessa uppgifter även från en fil av typ 2 eller 3. För att bli godkänd för

============================================================
PAGE 7/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
inläsning av filer av typ 2 eller 3 krävs dock att programmet tillgodogör sig merinformationen i dessa filtyper.

4. De olika typerna av SIE-filer

Allmänt om de olika filtyperna.
4.1. Exportbehoven från redovisningsprogram till eftersystem kan vara olika omfattande. Förekomsten av olika uppgifter i redovisningen kan också variera beroende på redovisningsprogrammets möjligheter. Beroende på programvaruföretagens ambitionsnivå tillåts därför informationsmängden i en exporterad fil att variera.
4.2. Filtyperna 1, 2 och 3 är olika nivåer på exporten av saldon från redovisningsprogram. Typ 4 specificerar ett filformat för import och export av verifikationer.

Typ 1 - Export av bokslutssaldon
4.3. Denna typ innefattar de posttyper som behövs för export av årssaldon till olika eftersystem. Årssaldon är ofta tillräckliga för program för deklaration eller årsredovisning.
4.4. Filtyp 1 innehåller relativt lite information och tillåts främst av historiska skäl. Vi rekommenderar att alla nya implementationer av SIE-export omfattar minst typ 2.

Typ 2 - Export av periodsaldon
4.5. Typ 2 är en utökning av typ 1 och ska således innehålla alla poster som specificerats för typ 1. Dessutom ingår i filer av denna typ poster för periodvisa saldon samt periodvisa budgetsaldon. Innehållet i denna filtyp är avsedd att användas av olika typer av analysprogram.

Typ 3 - Export av objektsaldon
4.6. Denna typ av exportformatet innefattar export av saldon på objektnivå. Då program från olika tillverkare hanterar objekt på mycket varierande sätt har här gjorts ett försök att generalisera begreppen.

Typ 4 - Import/Export av transaktioner
4.7. Detta filformat är avsett för att importera och exportera transaktioner till/från redovisningsprogram. Exempel på importfiler är filer som genereras av försystem, t ex ett faktureringssystem. Genom att här använda SIE-formatet ges stora möjligheter att använda försystem från en programtillverkare samtidigt som man använder ett redovisningsprogram från annat håll. Detta är speciellt intressant då många försystem är skräddarsydda branschlösningar. Genom att försystemet stödjer SIE-formatet erhåller man större valfrihet vid val av redovisningsprogram.
4.8. Import av transaktioner används även då man utnyttjar speciella bokslutsprogram. De transaktioner som genereras av bokslutsprogrammet kan då enkelt återföras till redovisningsprogrammet.
4.9. Export av transaktioner är kanske inte lika vanligt. Dock finns ett stort behov av detta i samband med bl a datorstödd revision. Genom att exportera samtliga transaktioner ur redovisningsprogrammet kan ett revisionsprogram utföra olika automatiska kontroller.

============================================================
PAGE 8/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
4.10. Då det inte är önskvärt att ha olika filformat för import och export bygger dessa på samma filformatspecifikation. Dock förekommer vissa skillnader i vilka poster och fält som är obligatoriska.

5. Filformatet

Filernas namn och placering
5.1. Namnsättning av filerna är fri, dock rekommenderas följande:
• Filerna, av typen 1, 2, 3 och 4E, ges filändelsen .SE vid export från redovisningsprogrammet. Filer som är avsedda att importeras av redovisningsprogrammet, s k transaktionsfiler av typen 4I, ges filändelsen .SI. (Se punkt 6. Obligatoriska och frivilliga poster i SIE-filen).
• Filerna läggs i en katalog med namnet \SIE.
5.2. Filnamn för överföring av transaktioner från de vanligaste försystemen rekommenderas enligt följande
• Fakturering      FAKT.SI
• Leverantörsreskontra   LEVR.SI
• Löneprogram      LÖN.SI
Läs mer om filnamn under punkten 7.4 Användning av flaggposten.

Filens innehåll
5.3. Varje fil innehåller ett antal poster, vilka kan ha varierande innebörd. Varje post inleds med en ”etikett” som markerar postens innebörd. Alla etiketter inleds med tecknet #. Exempel på etiketter är #PSALDO och #KONTO som inleder en periodsaldopost resp en kontopost
5.4. Vissa poster kan innehålla underposter. Exempel på underposter är konteringsrader till en verifikation. Dessa underposter anges inom klammer ({ resp }) direkt efter huvudposten. Dessa klamrar ska stå ensamma på var sin rad.
5.5. Varje post skall avslutas med en radmatning (ASCII 10). En vagnretur (ASCII 13) före radslut tillåts men är inget krav.
5.6. Tomrader tillåts var som helst i filen och ska ignoreras av det importerande programmet.
5.7. De olika fälten inom varje post avgränsas av ett eller flera mellanslag. Som mellanslag godtas även tabulatorer (ASCII 9). Alla fält får omslutas av citationstecken (ASCII 34). Citationstecken är dock inget krav utan behövs endast då fältet innehåller mellanslag. Om ett citationstecken förekommer inuti ett fält ska det i exportfilen föregås av en backslash (ASCII 92). Kontrolltecken får ej förekomma inom en textsträng. Med kontrolltecken avses ASCII 0 till och med ASCII 31 samt ASCII 127.
5.8. Teckenrepertoaren i filen ska vara IBM PC 8-bitars extended ASCII (Codepage 437)
5.9. Belopp ska ska skrivas med en punkt (ASCII 46) som decimalavgränsare. Om öretal saknas får belopp anges utan decimaler. Maximalt två öressiffror får anges. Eventuellt minustecken skall anges före beloppet. Plustecken får ej anges. Ingen övre gräns för beloppens storlek finns. Därfor bör det importerande programmet kontrollera att dess maximigräns inte överskrids.
5.10. Datum anges alltid i format ÅÅÅÅMMDD.

============================================================
PAGE 9/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
Allmänt om SIE-filens uppbyggnad
5.11. De olika posterna i en SIE-fil är indelade i grupper.
5.12. Inom filen ska posterna förekomma i följande ordning:
    1   Flaggpost
    2   Identifikationsposter
    3   Kontoplansuppgifter
    4   Saldoposter/Verifikationsposter
5.13. Ordningen mellan olika poster inom respektive grupp är helt fri om inte annat anges i de olika postspecifikationerna nedan.
5.14. Samtliga poster som i nedanstående tabell markerats som obligatoriska för angiven posttyp skall förekomma i filen. För några posttyper gäller speciella obligatoriekrav, vilka markerats i tabellen samt beskrivits nedan.

Skillnaden mellan en obligatorisk post och ett obligatoriskt fält
5.15. För varje posttyp har angetts om posten är obligatorisk i en viss typ av SIE-fil. En sammanfattnings av obligatoriska och frivilliga poster finns i tabellen nedan. För varje posttyp har i specifikationen dessutom angetts vilka fält som är obligatoriska och vilka som är frivilliga. Exempelvis är posttypen #BKOD frivillig. Fältet för branschkod inom posten är dock ett obligatoriskt fält. Om en post av typen #BKOD skrivs i SIE-filen måste alltså branschkod finnas angiven. Om man vid filskrivning saknar uppgift om branschkod ska man inte skriva någon #BKOD-post över huvud taget.

Ingående och utgående balanser
5.16. Både posttyperna #IB och #UB har i sammanställningen markerats som obligatoriska för både innevarande och föregående år. De exakta kraven på dessa poster är följande:
• #UB för innevarande år ska alltid finnas.
• Antingen #UB för föregående år eller #IB för innevarande år ska finnas. Vi rekommenderar dock att båda postyperna skrivs i den mån värden finns tillgängliga.
• #IB för föregående år är helt frivilligt. Vi rekommenderar dock att dessa poster skrivs i den mån värden finns tillgängliga.

När saldon saknas
5.17. Saldoposter som i sammanställningen ovan markerats som obligatoriska poster kan under vissa omständigheter utelämnas. I sammanställningen har t ex angetts att #IB är en obligatorisk post. Samtidigt anges att poster med nollbelopp ej behöver skrivas i SIE-filen. Det kan då t ex inträffa att ett nystartat företag som inte har något ingående saldo därför saknar #IB-poster i SIE-filen. Detta är givetvis helt i sin ordning. Motsvarande kan inträffa i en SIE-fil av typ 2 eller 3 för poster av typen #PBUDGET. Om man i redovisningsprogrammet inte har registrerat någon budget så kommer inte heller några budgetposter att skrivas.
5.18. Obligatoriet för dessa poster ska tolkas så att om det finns några värden som kan skrivas så skall dessa skrivas.

============================================================
PAGE 10/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
6. Obligatoriska och frivilliga poster i SIE-filen

Identifikationsposter:

<table>
  <tr>
    <th>#FLAGGA</th>
    <th>Flaggpost som anger om filen tagits emot av mottagaren.</th>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>4I</th>
    <th>4E</th>
  </tr>
  <tr>
    <td>#PROGRAM</td>
    <td>Vilket program som genererat filen.</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
  </tr>
  <tr>
    <td>#FORMAT</td>
    <td>Vilken teckenuppsättning som används.</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
  </tr>
  <tr>
    <td>#GEN</td>
    <td>När och av vem som filen genererats.</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
  </tr>
  <tr>
    <td>#SIETYP</td>
    <td>Vilken typ av SIE-formatet filen följer.</td>
    <td>○</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
  </tr>
  <tr>
    <td>#PROSA</td>
    <td>Fri kommentartext kring filens innehåll.</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
  </tr>
  <tr>
    <td>#FTYP</td>
    <td>Företagstyp.</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
  </tr>
  <tr>
    <td>#FNR</td>
    <td>Redovisningsprogrammets internkod för exporterat företag.</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
  </tr>
  <tr>
    <td>#ORGNR</td>
    <td>Organisationsnummer för det företag som exporterats.</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
  </tr>
  <tr>
    <td>#BKOD</td>
    <td>Branschtillhörighet för det exporterade företaget.</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>-</td>
    <td>○</td>
  </tr>
  <tr>
    <td>#ADRESS</td>
    <td>Adressuppgifter för det aktuella företaget.</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
  </tr>
  <tr>
    <td>#FNAMN</td>
    <td>Fullständigt namn för det företag som exporterats.</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
    <td>●</td>
  </tr>
  <tr>
    <td>#RAR</td>
    <td>Räkenskapsår från vilket exporterade data hämtats.</td>
    <td>●†</td>
    <td>●†</td>
    <td>●†</td>
    <td>○</td>
    <td>●†</td>
  </tr>
  <tr>
    <td>#TAXAR</td>
    <td>Taxeringsår för deklarationsinformation (SRU-koder).</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
  </tr>
  <tr>
    <td>#OMFATTN</td>
    <td>Datum för periodsaldons omfattning.</td>
    <td>-</td>
    <td>●</td>
    <td>●</td>
    <td>-</td>
    <td>○</td>
  </tr>
  <tr>
    <td>#KPTYPER</td>
    <td>Kontoplanstyp.</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
  </tr>
  <tr>
    <td>#VALUTA</td>
    <td>Redovisningsvaluta.</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
    <td>○</td>
  </tr>
</table>

Kontoplansuppgifter:

<table>
  <tr>
    <th></th>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>4I</th>
    <th>4E</th>
  </tr>
</table>

============================================================
PAGE 11/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
#KONTO    Kontouppgifter.        ● ● ● ○ ●
#KTYP     Kontotyp.             ○ ○ ○ ○ ○

#ENHET    Enhet vid kvantitetsredovisning.    ○ ○ ○ ○ ○
#SRU      RSV-kod för standardiserat räkenskapsutdrag.    ● ● ○ ○ ○
#DIM      Dimension.             - - ●○ ○ ○
#UNDERDIM Underdimension.         - - ●○ ○ ○
#OBJEKT   Objekt.                - - ●○ ○ ○

Saldoposter/Verifikationsposter:
#IB       Ingående balans för ett balanskonto.    ●† ●† ●† - ●†
#UB       Utgående balans för ett balanskonto.    ●† ●† ●† - ●†
#OIB      Ingående balans för ett balanskonto.    - - ●† - ○
#OUB      Utgående balans för ett balanskonto.    - - ●† - ○
#RES      Saldopost för ett resultatkonto.       ●† ●† ●† - ●†
#PSALDO   Periodens saldo för ett visst konto.    - ● ● - ○
#PBUDGET  Periodens budget för ett visst konto.   - ● ● - ○
#VER      Verifikationspost.                     - - - ○ ○
#TRANS    Transaktionspost.                      - - - ○ ○
#RTRANS   Tillagd transaktionspost.               - - - ○ ○
#BTRANS   Borttagen transaktionspost.             - - - ○ ○

Kontrollsummeposter:
#KSUMMA   Start av kontrollsummering/-summa.      ○ ○ ○ ○ ○

Symbolförklaringar:
4I = 4I avser SIE typ 4 som är avsedd för import till ett redovisningsprogram.
4E = 4E avser export från ett redovisningsprogram enligt SIE typ 4.
○ = Frivillig post.
● = Obligatorisk post. Saldoposter med nollsaldo kan dock utelämnas. Se

============================================================
PAGE 12/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
kommentarer ovan.

† = Poster ska finnas för både innevarande och föregående räkenskapsår. Om föregående år saknas kan dock poster för detta utelämnas. Se även kommentarer nedan.

❖ = Dimensioner och underdimensioner behöver inte deklareras om de sammanfaller med de standarddimensioner som angetts för SIE typ 3.

- = Posten får inte förekomma i denna filtyp.

Eftersom det är frivilligt att deklarera både konto och objekt i filer av typen 41 förutsätts det i princip att dessa finns upplagda i ett importerande program före import för att innehållet i filen skall kunna läsas in på ett korrekt sätt. Genom att deklarera dessa poster i filen behöver inte konton och objekt vara upplagda i ett importerande företag innan importen görs.
Det rekommenderas därför att konton och objekt som används i en SIE-fil alltid deklareras under #KONTO och #OBJEKT även om detta är frivilligt.

7. Att tänka på vid läsning av SIE-filer

Utbyggbarhet
7.1. Filformatet är utbyggbart eftersom man enkelt kan utöka specifikationen med nya etiketter. Ett läsande program behöver inte heller understödja alla förekommande etiketter.

etikett        fält
#RAR   årsnr   start   slut
posttyp

T ex kan ett eftersystem som inte behöver budgetsaldon ignorera eventuella budgetposter i SIE-filen. Ett importerande program skall tillåta förekomsten av okända etiketter. De okända posttyperna ska då ignoreras.

7.2. Endast etiketter specificerade i SIE-standarden får förekomma i en SIE-fil. Detta för att det inte skall bli problem då man lägger till nya etiketter i SIE-standarden och någon annan redan använt denna.

7.3. Utökning av formatet kan även ske inom befintliga posttyper. Ett importerande program ska därför tillåta förekomsten av ”okända” fält på slutet av posten. På detta sätt kommer all programvara som läser filformatet att kunna läsa filer enligt framtida utökning av formatet, dock utan att kunna tillgodogöra sig den tillkommande informationen.

Användning av flaggposten
7.4. För att i någon mån få bekräftelse på att en SIE-fil förts över korrekt från ett försystem till ett redovisningsprogram används flaggan i flaggposten. Denna fungerar alltså som en primitiv återrapporteringskanal. För att denna ska fungera förutsätts en viss disciplin hos både exporterande försystem och importerande redovisningsprogram. Följande gäller:

============================================================
PAGE 13/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
• Det importerande redovisningsprogrammet får ej ta bort inlästa SIE-filer. SIE-filerna raderas av försystemet efter det att försystemet med hjälp av flaggposten konstaterat att transaktionerna överförts korrekt.
• Det importerande redovisningsprogrammet skall signalera att inläsning skett genom att sätta flaggan i flaggposten.
• Ett försystem bör använda sig av ett förutbestämt filnamn så att man med hjälp av systeminställning i det mottagande programmet kan ange detta filnamn. Läs mer under punkt 5.1 Filernas namn och placering.
• Ett försystem kan alternativt använda sig av ett variabelt filnamn för att kunna exportera ett valfritt antal SIE-filer till en ”Utkorg”. Det mottagande programmet kan sedan läsa av samma mapp som sin ”Inkorg” för SIE-filer och visa vilka filer som är möjliga att importera med hjälp av flaggposten. Det exporterande försystemet och det importerande mottagarprogrammet använder sig lämpligen av systeminställningar för att anvisa mappar för ”Utkorg” respektive ”Inkorg”.

Immunitet mot extremdata
7.5. SIE-formatet anger väldigt få begränsningar på storleken på data i enskilda fält. Exempelvis anger standarden inga gränser för hur stora belopp som kan hanteras. Inte heller specificeras begränsningar i fältlängder mer än för ett fåtal fält.
7.6. Då de flesta inläsande program har någon systembegränsning när det gäller till exempel beloppsstorlek eller stränglängder bör det inläsande programmet ha speciell hantering för de fall då en inläst fil innehåller data som överskrider dessa begränsningar.

8. Objektredovisning i SIE-filer (typ 3 och 4)

Deklaration av dimensioner
8.1. För att det importerande programmet ska veta vad filens objektsaldon har för innebörd måste det först i filen ligga en beskrivning av dimensionerna. Varje dimension åsätts här ett dimensionsnummer. I deklarationen anges också dimensionernas samband, t ex om de är hierarkiska. Ett läsande program kan således använda dessa deklarationer för att avgöra hur objektsaldona ska utnyttjas samt vilka saldon som är av intresse.
8.2. En deklaration kan t ex se ut på följande vis:
    #DIM      1   "Kostnadsställe"
    #UNDERDIM 2   "Kostnadsbärare"   1
    #DIM      6   "Projekt"

8.3. Deklarationen av dimensioner är i princip fri. Dock reserveras vissa dimensionsnummer för en del vanligt förekommande objekttyper.
8.4. Om endast reserverade dimensionsnummer används behöver dessa dimensioner inte deklareras.

Universella dimensioner
8.5. Eftersom innebördien av de olika dimensionerna är vitt skiftande måste ofta en speciell ”överenskommelse om innebördien” träffas mellan sändande och mottagande program. Dock finns det en del vanligt förekommande dimensioner (T ex

============================================================
PAGE 14/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
kostnadsställe, kostnadsbärare och projekt) som vanligtvis har en mer universell innebörd. Genom att reservera vissa dimensionsnummer för dessa dimensioner kan man åstadkomma ett filformat där objektsaldon i flertalet sammanhang kan överföras utan att dessa ”speciella överenskommelser” behöver upprättas.
8.6. SIE-formatets reserverade dimensionsnummer återfinns längre fram i detta dokument.

Enkla dimensioner
8.7. I det enkla fallet har dimensionerna inget samband med varandra. I dessa fall deklareras dimensionerna på följande vis:
#DIM    7    "Anställningsnummer"

8.8. Export av objekten inom dimensionen sker därefter på följande vis:
#OBJEKT    7    "23"    "Sven Svensson"

8.9. Export av saldon sker enligt följande:
#PSALDO    0    200801    7010    {7 "23"}    200.00

Hierarkiska dimensioner
8.10. Vissa objekt är en ren uppdelning av överliggande objekt. Kodén för underliggande objekt saknar innebörd om inte överliggande objekt anges. Avdelning 01 kan t ex ha tre underavdelningar (01, 02 och 03) medan avdelning 02 har fyra underavdelningar (01, 02, 03 och 04). Att här ange endast koden för underavdelning (t ex 02) ger ej fullständig information om vilken avdelning som avses.
8.11. En underdimension deklareras på samma sätt som en vanlig dimension. Dock tillfogas information om vilken dimension som är överordnad. Exempel:
#DIM    20    "Avdelning"
#UNDERDIM    21    "Underavdelning"    20

8.12. Vid export av hierarkiska objekt exporteras saldon för de överliggande objekten för sig, och saldon för de underliggande för sig. Vid export av underobjekten konkateras koderna för överliggande och underliggande objekt.
8.13. Exempel:
#DIM    20    "Avdelning"
#UNDERDIM    21    "Underavdelning"    20

#OBJEKT    20    "01"    "Barnavd"
#OBJEKT    20    "02"    "Ungdomsavd"

#OBJEKT    21    "0101"    "Spädbarn"
#OBJEKT    21    "0102"    "Barn 1–3 år"
#OBJEKT    21    "0103"    "Barn 4–6 år"

============================================================
PAGE 15/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
#OBJEKT   21   "0201"   "Högstadieungdom"
#OBJEKT   21   "0202"   "Gymnasieungdom"

#PSALDO   0   200801   4010   {20 "01"}   49655.00
#PSALDO   0   200801   4010   {20 "02"}   200.00
#PSALDO   0   200801   4010   {21 "0101"}   13200.00
#PSALDO   0   200801   4010   {21 "0102"}   7800.00
#PSALDO   0   200801   4010   {21 "0103"}   28655.00
#PSALDO   0   200801   4010   {21 "0201"}   200.00

8.14. Enhetlig längd på kodsträng förutsätts. Konkatenering av kod och underkoder om längden på kodsträngen tillåts variera kan ge icke-unika koder. Exempel: avd 21 underavd 410 och avd 214 underavd 10 ger samma kod (21410) vid konkatenering. Exporterande program som tillåter varierande längd på koderna kan lösa detta problem genom att lägga till mellanslag (eller annat utfyllnadstecken). Utfyllnad med x till fem tecken i exemplet ovan ger vid konkatenering koderna 21xxxx410xxx resp 214xxxx10xxx.

Underkonton
8.15. Underkonton förekommer ofta då man för ett visst konto (eller en viss kontogrupp) vill ha en ytterligare specifikation. Ett typexempel är reskontrakonton som kan indelas med kund- eller leverantörsnummer (alternativt fakturanummer).
8.16. Underkonton deklareras på samma sätt som enkla dimensioner.

Reserverade dimensionsnummer
8.17. Följande dimensionsnummer är reserverade:
    1   =   Kostnadsställe / resultatenhet.
    2   =   Kostnadsbärare (skall vara underdimension till 1).
    3-5   =   Reserverade för framtida utökning av standarden.
    6   =   Projekt.
    7   =   Anställd.
    8   =   Kund.
    9   =   Leverantör.
    10   =   Faktura.
    11-19   =   Reserverade för framtida utökning av standarden.
    20-   =   Fritt disponibla.

Användning av dimensioner och objekt i importfiler av typ 4
8.18. Transaktioner med objektspecifikation ska naturligtvis endast användas i de fall då det är befogat. Vid import gäller detta då man redan i försystemet specificerar konteringens med någon form av objekt.

============================================================
PAGE 16/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
8.19. Som exempel kan nämnas ett lönesystem där de genererade konteringarna kan specificeras med anställningsnummer. Vid generering av SIE-filen deklarerar löneprogrammet att det använder dimension 7 för att ange anställningsnummer.
#DIM 7 "Anställningsnummer"

8.20. Genom att använda det fördefinierade dimensionsnumret för anställningsnummer (nummer 7) så vet det importerande redovisningsprogrammet att de objektspecifikationer som angetts i filen är just anställningsnummer. Om redovisningsprogrammet inte kan hantera denna information kan det välja att ignorera objektspecifikationen.

Transaktionernas objektlista
8.21. En transaktion omfattar förutom konto och belopp även uppgift om vilka objekt transaktionen avser. Detta görs genom en lista med objektnummer. Denna lista innehåller parvis dimensionsnummer och objektnummer. Endast de objektnummer som är relevanta för transaktionen i fråga behöver anges.
8.22. Exempel:
#DIM 7 "Anställningsnummer"
#DIM 1 "Avdelning"
#DIM 6 "Projekt"

#VER A 567 20081216 "Kontant lön"

{
    #TRANS 7010 {"1" "456" "7" "47"} 13200.00
    #TRANS 1910 {} -13200.00
}

8.23. Vid import av hierarkiska dimensioner ska på underobjektets plats i objektlistan endast anges underdimensionens kod. Det överliggande objektet måste i dessa fall alltid anges i objektlistan.

9. Kvantitetsredovisning i SIE-filer

Allmänt om kvantitetsredovisning
9.1. Vissa redovisningsprogram har funktioner för att registrera kvantitet samtidigt med belopp på transaktioner. Dessa salderas sedan på samma sätt som beloppen, och ger möjlighet att ta ut t ex kostnad/intäkt per enhet. Vissa branscher använder kvantitetsredovisning i mycket stor utsträckning, exempelvis lantbruk.
9.2. Samtliga saldoposter och transaktionsposter i SIE-formatet har därför försetts med ett frivilligt fält för att underlätta överföring av denna kvantitetsredovisning till olika eftersystem. Dessa poster är: #IB, #OIB, #OUB, #UB, #RES, #PSALDO och #PBUDGET.

============================================================
PAGE 17/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
9.3. Även transaktionsposterna #TRANS, #RTRANS och #BTRANS i SIE-formatet har försetts med ett frivilligt fält för kvantitet.
9.4. En speciell posttyp #ENHET kan användas för att deklarera enheten för de kvantiteter som anges för ett visst konto. Kvantitetsangivelser kan dock anges oavsett om någon enhet har deklarerats för kontot.

10. Kontrollsummering

Syfte
10.1. Kontrollsummeringen är framför allt till för att skydda användaren av SIE-filer mot fel som beror på att data förvanskats i samband med fel på lagringsmedia eller fel vid datakommunikation. Den föreslagna algoritmen ger en mycket hög sannolikhet för upptäckt av sådana fel.
10.2. Kontrollsummeringen ger också en viss möjlighet att upptäcka avsiktlig manipulering av SIE-filerna. Det bör dock observeras att kontrollsummeringen inte i första hand är avsedd som ett skydd mot avsiktlig datamanipulation.

Praktiskt införande i SIE-standarden
10.3. Kontrollsumman är ett frivilligt tillägg till SIE-standarden. Ett importerande program som stödjer kontrollsummering ska därför acceptera alla infiler som saknar kontrollsumma, samt kontrollera alla infiler som har kontrollsumma.

Införande av kontrollsumman i SIE-filen
10.4. En SIE-fil som kontrollsummerats vid generering ska innehålla två poster av typen #KSUMMA enligt följande:
#FLAGGA 0
#KSUMMA

...
Övriga poster
...

#KSUMMA 1234567890

10.5. Den första posten av typ #KSUMMA har som uppgift att signalera till det inläsande programmet att kontrollsummering har skett, och att en kontrollsumma kommer att presenteras i slutet av filen.
10.6. Om det importerande programmet upptäckt den inledande kontrollsummasignalen men inte hittar någon avslutande kontrollsummapost bör det importerande programmet vägra importera filen. Filen är nämligen i så fall felaktig (förkortad).

Algoritm för kontrollsummering
10.7. För kontrollsummeringen används en algoritm CRC-32 som används inom bl a telekommunikation och telefaxöverföring.

============================================================
PAGE 18/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
10.8. Algoritmen går ut på att betrakta varje bit i texten (meddelandet) som koefficienter i ett polynom. Detta polynom divideras med ett s k generatorpolynom. Resten vid denna division används som kontrollsumma. Tekniken ger en mycket hög säkerhet eftersom varje bit i meddelandet påverkar kontrollsumman. Den statistiska fördelningen på kontrollsumman blir dessutom mycket jämn med denna algoritm vilket är ett kännetecken på en god algoritm.
10.9. Polynomdivison är en relativt omfattande operation. Det har därför utvecklats olika algoritmer där beräkningen förenklas genom sökning i en genererad tabell. En sådan algoritm har bifogats i detta dokument.
10.10. Vi har valt att inte redogöra för de tekniska detaljerna i algoritmen här. Den intresserade kan erhålla ytterligare information i följande artiklar:
• “A Tutorial on CRC Computations.”, IEEE Micro, augusti 1998.
• “File verification using CRC”, Dr. Dobb’s Journal, maj 1992.

Parametrar för kontrollsummaalgoritmen
10.11. Det generatorpolynom som skall användas vid kontrollsummering av SIE-filer ska ha koefficienterna EDB88320H.
10.12. Kontrollsumman skall före beräkning sättas till FFFFFFFFH (prekonditionering).
10.13. Kontrollsumman skall efter slutförd beräkning bitinverteras (postkonditionering).

Vilka delar av filinnehållet ska kontrollsummeras?
10.14. För att skrivande och läsande program ska kunna komma fram till samma kontrollsumma måste följande anvisningar följas till fullo:
• Kontrollsummering börjar med den första post som följer efter den inledande #KSUMMA och omfattar samtliga poster fram till (men ej inkluderande) den avslutande #KSUMMA.
• I kontrollsummaberäkningen ingår dels de postetiketter som inleder varje post, dels fälten inom posten.
• Blanktecken och tabulatorer mellan fälten skall inte ingå i kontrollsummaberäkningen.
• Citationstecken som inleder och avslutar fält ska inte ingå i kontrollsummaberäkningen.
• Klammer som omger objektlistor eller konteringsposter ska inte ingå i kontrollsummaberäkningen.
• Kontrollsumman beräknas på tecknets värde enligt IBM PC-8 teckentabell (codepage 437).
• Då citationstecken inom fält markerats med en ”backslash” skall endast citationstecknet ingå vid beräkning av kontrollsumman.

Exempel
10.15. I följande exempel har de tecken som ingår i kontrollsumman strukits under #KONTO 1915 "Kassa \\"special\\\""

Kodexempel på kontrollsummering
#define CRC32_POLYNOMIAL   0xEDB88320L

============================================================
PAGE 19/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
unsigned long CRCTable[ 256 ];
unsigned long crc;           // Global variabel för att ackumulera CRC

// Denna rutin skall anropas för att initiera lookup-tabellen
// innan beräkningen påbörjas

void CRC_skapa_tabell()
{
    int i;
    int j;
    unsigned long crc;

    for ( i = 0; i <= 255 ; i++ )
    {
        crc = i;
        for ( j = 8 ; j > 0; j-- )
        {
            if ( crc & 1 )
            {
                crc = ( crc >> 1 ) ^ CRC32_POLYNOMIAL;
            }
            else
            {
                crc >>= 1;
            }
        }

        CRCTable[ i ] = crc;
    }
}

// Denna rutin påbörjar CRC-beräkning

void CRC_start(void)
{
    // Påbörjar CRC-beräkning genom att sätta den globala

============================================================
PAGE 20/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
// CRC-ackumulatorn till prekonditioneringsvärdet.

    crc = 0xFFFFFFFFFL;
}

// Denna rutin anropas för varje textdel som ska ingå
// i kontrollsumman

void CRC_ackumulera(void *buffer, unsigned int count)
{
    unsigned char *p;
    unsigned long temp1;
    unsigned long temp2;

    p = (unsigned char*) buffer;

    while ( count-- != 0 )
    {
        temp1 = ( crc >> 8 ) & 0x00FFFFFFFL;
        temp2 = CRCTable[ ( (int) crc ^ *p++ ) & 0xff ];
        crc = temp1 ^ temp2;
    }
}

// Denna rutin avslutar CRC-bärkningen samt returnerar det
// resulterande CRC-värdet.

unsigned long CRC_retur(void)
{
    // Gör postkonditionering av det ackumulerade CRC-värdet genom
    // att bitinvertera enligt postkonditioneringsmasken

    return( crc ^ 0xFFFFFFFFFL );
}

============================================================
PAGE 21/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
11. Beskrivning av samtliga posttyper

#ADRESS    Adressuppgifter för det exporterade företaget
Format:
    #ADRESS   kontakt   utdelningsadr   postadr   tel

Beskrivning:
1. Adressuppgifter för exporterat företag.
Exempel:
    #ADRESS   "Sven Svensson"   "Box 21"   "211 20 MALMÖ"   "040-123 45"

#BKOD    Branschkod för det exporterade företaget
Format:
    #BKOD   SNI-kod

Beskrivning:
1. Branschtillhörighet för exporterat företag. Bransch anges med SNI-kod. Denna kan utnyttjas i bl a analysprogram för jämförelse med branschmedelvärden.
Exempel:
    #BKOD   82300

#DIM    Enkel dimension
Format:
    #DIM   dimensionsnr   namn

Beskrivning:
1. Deklarerar en enkel dimension. Om den dimension man avser att deklarera är någon av de universella dimensionerna bör det reserverade dimensionsnumret användas. I annat fall anges ett dimensionsnummer inom det fritt disponibla området.
Exempel:
    #DIM   1   "Avdelning"
    #DIM   6   "Projekt"

#ENHET    Enhet vid kvantitetsredovisning
Format:
    #ENHET   kontonr   enhet

Beskrivning:

============================================================
PAGE 22/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
1. Anger enhet för de kvantiteter som redovisas på angivet konto. Kontot måste ha deklarerats tidigare i filen med en post av typ #KONTO.
2. Att ange enheter är frivilligt. Det är inget som hindrar att kvantiteter anges i saldo eller transaktionsposter för konton som saknar enhetspost.
   Exempel:
   #ENHET    4010    liter

#FLAGGA    Importflaggan
Format:
#FLAGGA    x

Beskrivning:
1. Först i varje fil ligger en flaggpost som indikerar om filen blivit inläst eller ej. Den sätts till 0 av det program som skriver filen. Vid lyckad inläsning skrivs en etta i nollans position. På detta sätt förhindras att samma fil importeras två gånger. Programmet som genererar importfiler kan på samma sätt kontrollera att föregående fil blivit inläst innan en ny skrivs. Detta är speciellt viktigt i försystem som genererar verifikationer (filer av typen 4I), eftersom dessa varken får glömmas bort eller importeras två gånger.
2. Denna flagga behöver endast hanteras vid ackumulerande import (t ex import av verifikationer). Program där det inte gör något om man importerar samma fil två gånger bör inte bry sig om denna flagga.
   Exempel:
   #FLAGGA    0

#FNAMN    Fullständigt namn för det företag som exporterats.
Format:
#FNAMN    företagsnamn

Beskrivning:
1. Företagets juridiska namn.
   Exempel:
   #FNAMN    "Målerifirman Axelsson & Johnsson AB"

#FNR    Redovisningsprogrammets internkod för företaget som exporterats
Format:
#FNR    företagsid

Beskrivning:

============================================================
PAGE 23/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
1. Redovisningssystemets identitetsbegrepp för företaget. Vad som används för att identifiera ett företag kan vara olika för olika typer av redovisningssystem. Denna kod är viktig för t ex ett bokslutsprogram som skall återexportera bokslutstransaktioner till redovisningsprogrammet.

Exempel:
#FNR    Kalles

#FORMAT    Anger vilken teckenuppsättning som används
Format:
#FORMAT    PC8

Beskrivning:
1. Tills vidare tillåter standarden endast IBM Extended 8-bit ASCII (PC8 - codepage 437).
Exempel:
#FORMAT    PC8

#FTYP    Typ av företag
Format:
#FTYP    Företagstyp

Beskrivning:
1. Företagstyp används för att identifiera företagsformen. Används t ex av importerande program för att kunna veta vilken uppsättning SRU-koder som skall användas.
2. De företagsformer som finns i listan är Bolagsverkets definition av företagsformer. För utländska företagsformer eller företagsformer som inte finns i listan skall företagsformen X d v s Annan företagsform anges.
AB = Aktiebolag.
E = Enskild näringsidkare.
HB = Handelsbolag.
KB = Kommanditbolag.
EK = Ekonomisk förening.
KHF = Kooperativ hyresrättsförening.
BRF = Bostadsrättsförening.
BF = Bostadsförening.
SF = Sambruksförening.
I = Ideell förening som bedriver näring.
S = Stiftelse som bedriver näring.

============================================================
PAGE 24/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
FL    = Filial till utländskt bolag.
BAB   = Bankaktiebolag.
MB    = Medlemsbank.
SB    = Sparbank.
BFL   = Utländsk banks filial.
FAB   = Försäkringsaktiebolag.
OFB   = Ömsesidigt försäkringsbolag.
SE    = Europabolag.
SCE   = Europakooperativ.
TSF   = Trossamfund.
X     = Annan företagsform.

Exempel:
#FTYP AB

#GEN Anger när och av vem som filen genererats
Format:
#GEN datum sign

Beskrivning:
3. Datum anges på formen ÅÅÅÅMMDD och är en obligatorisk uppgift. Signatur kan vara namn, signatur eller användarid för den person eller process som genererat utskriften. Signatur kan utelämnas.

Exempel:
#GEN 20080518 AN

#IB Ingående balans för balanskonto
Format:
#IB årsnr konto saldo kvantitet

Beskrivning:
1. Kreditsaldo anges med negativt belopp.
2. Årsnr anges med 0 för innevarande år och -1 för föregående år. Om man önskar exportera ytterligare jämförelseår kan dessa läggas till som år -2, -3 osv.
3. Fältet för kvantitet är frivilligt. Kvantiteten ska normalt anges med samma tecken som beloppet för saldot, dvs plus för debet och minus för kredit.

Exempel:
#IB 0 1930 23780.78

============================================================
PAGE 25/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
#KONTO    Kontouppgifter
Format:
  #KONTO   kontonr   kontonamn

Beskrivning:
1. Anger kontonamn för ett befintligt konto.
2. Kontonummer skall vara numeriskt.
3. Vid export ska samtliga använda konton exporteras.
4. Vid import förutsätts att de konton som används i transaktionerna finns upplagda i redovisningsprogrammets kontoplan. I annat fall skall importfilen innehålla lämpliga kontoposter.
5. Om en kontopost förekommer i importfilen men inte i redovisningsprogrammets kontoplan skall det importerande programmet lägga upp det nya kontot.
6. Om en kontopost förekommer i importfilen med ett namn som ej överensstämmer med motsvarande konto i redovisningsprogrammets kontoplan bör det importerande programmet göra användaren uppmärksam på detta.
Exempel:
  #KONTO   1510   "Kundforderingar"

#KPTYP    Typ av kontoplan
Format:
  #KPTYP   typ

Beskrivning:
1. Anger vilken kontoplanstyp som ligger till grund för den exporterade kontoplanen. Posten är frivillig. Om denna post saknas bör ett inläsande program anta att kontoplanen följer BAS 95.
2. Som typ kan anges BAS95, BAS96, EUBAS97 eller NE2007.
3. NE2007 avser BAS 2007 för enskilda näringsidkare (K1).
4. SIE-gruppen kommer att införa nya tillåtna kontoplanstyper endast om dessa i struktur avviker från någon av ovanstående. Om exempelvis BAS-gruppen publicerar en EU-BAS 98 som till sin struktur överensstämmer med EU-BAS 97 skall fortfarande EUBAS97 anges i SIE-filen.
5. Börjar kontoplanstypen på BAS2, t ex BAS2008, skall denna hanteras som en kontoplan av typen EUBAS97.
Exempel:
  #KPTYP   EUBAS97

#KTYP    Kontotyp
Format:
  #KTYP   kontonr   kontotyp

============================================================
PAGE 26/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
Beskrivning:
1. Kontotyp anges som T, S, K eller I (tillgång, skuld, kostnad eller intäkt). För att kontotyp ska få anges måste motsvarande kontopost ha förekommit tidigare i filen.
2. Posttypen är frivillig. Om kontotyp ej anges antas att kontot har den typ som anges av BAS-standarden.
Exempel:
#KTYP   1510   T

#OBJEKT    Objekt
Format:
#OBJEKT   dimensionsnr   objektnr   objektnamn

Beskrivning:
1. Används för export av befintliga objekt inom en dimension.
2. Om ett objekt inte finns upplagt i det importerande programmet och inte är deklarerat under #OBJEKT men ändå förekommer på #TRANS-rader i importfilen (filer av typen 4l) kan det vara möjligt att det importerande programmet väljer att inte läsa in/lägga upp objektet.
Exempel:
#OBJEKT   1   "0123"   "Serviceavdelningen"
#OBJEKT   1   "0124"   "Försäljningsavdelningen"
#OBJEKT   1   "0125"   "Utvecklingsavdelningen"

#OIB    Ingående balans för objekt
Format:
#OIB   årsnr   konto   {dimensionsnr objektnr}   saldo   kvantitet

Beskrivning:
1. Kreditsaldo anges med negativt belopp.
2. Årsnr anges med 0 för innevarande år och -1 för föregående år. Om man önskar exportera ytterligare jämförelseår kan dessa läggas till som år -2, -3 osv.
3. Fältet för kvantitet är frivilligt. Kvantiteten ska normalt anges med samma tecken som beloppet för saldot, dvs plus för debet och minus för kredit. Enhet avseende kontot definieras under #ENHET.
Exempel:
#OIB   0   1510   {8 "12345"}   23780.78

============================================================
PAGE 27/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
#OMFATTN    Datum för periodsaldons omfattning
    Format:
        #OMFATTN    datum

    Beskrivning:
1. Anger omfattningen (datum t o m) av de saldon som exporterats i filen. Detta anges för att informera den som läser filen om att filens saldon endast omfattar del av år. Normalt anges datum för senaste periodbokslut eller senast avslutade period. Posten måste förekomma vid export av periodsaldon.
Exempel:
    #OMFATTN    20080630

#ORGNR    Anger organisationsnummer för det företag som exporterats
    Format:
        #ORGNR    orgnr    förvnr    verknr

    Beskrivning:
1. Anger organisationsnummer för det exporterade företaget. Organisationsnumret ska innehålla ett bindestreck efter den sjätte siffran.
2. Förvärvsnummer och verksamhetsnummer är ej obligatoriska utan anges endast då uppgiften finns till hands. Förvärvsnummer används för att särskilja företag då det förekommer flera företag med samma organisationsnummer (Uppstår bl a då en person driver flera enskilda firmar).
3. Från och med 1995 års taxering görs i deklarationssammanhang inte indelning efter förvärvsnummer och verksamhetsnummer. Då flera företag förekommer med samma organisationsnummer får dessa ett löpnummer. Om detta löpnummer kan registreras i redovisningsprogrammet bör detta exporteras i fältet förvnr.
Exempel:
    #ORGNR    556334-3689    1

#OUB    Utgående balans för objekt
    Format:
        #OUB    årsnr    konto    {dimensionsnr objektnr}    saldo    kvantitet

    Beskrivning:
1. Kreditsaldo anges med negativt belopp.
2. Årsnr anges med 0 för innevarande år och -1 för föregående år. Om man önskar exportera ytterligare jämförelseår kan dessa läggas till som år -2, -3 osv.
3. Fältet för kvantitet är frivilligt. Kvantiteten ska normalt anges med samma tecken som beloppet för saldot, dvs plus för debet och minus för kredit. Enhet avseende kontot definieras under #ENHET.

============================================================
PAGE 28/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
Exempel:
#OUB   0   1510   {8 "12345"}   23780.78

#PBUDGET    Periodbudgetpost.
Format:
#PBUDGET   årsnr   period   konto   {dimensionsnr objektnr}   saldo   kvantitet

Beskrivning:
1. Posten anger periodens förändring på kontot. Kreditsaldo anges med negativt belopp.
2. Årsnr anges med 0 för innevarande år och -1 för föregående år. Om man önskar exportera ytterligare jämförelseår kan dessa läggas till som år -2, -3 osv. Räkenskapsårets omfattning definieras under #RAR.
3. Period anges i formen ÅÅÅÅMM (där ÅÅÅÅ avser kalenderår och MM avser kalendermånad).
4. Objektspecifikation (dimensionsnr och objektnr) utelämnas vid export av periodsaldon enligt SIE typ 2. Program som läser SIE typ 2 ska ignorera poster som har en objektspecifikation som ej är tom.
5. Vid export enligt SIE typ 3 skall poster anges både för kontot som helhet (dvs utan objektspecifikation) och för objekten.
6. Fältet för kvantitet är frivilligt. Kvantiteten ska normalt anges med samma tecken som beloppet för saldot, dvs plus för debet och minus för kredit.
Exempel:
#PBUDGET   0   200801   3011   {} -1243.50   -415
#PBUDGET   0   200801   5010   {1 "0123"}   3411.80

#PROGRAM    Anger program som exporterat filen
Format:
#PROGRAM   programnamn   version

Beskrivning:
1. Anger vilket program som exporterat filen.
Exempel:
#PROGRAM   "Visma Compact"   5.1

#PROSA    Fri kommentartext kring filens innehåll.
Format:
#PROSA   text

Beskrivning:

============================================================
PAGE 29/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
1. Kan till exempel ange vem eller vilket program som genererat filen.
   Exempel:
   #PROSA    "Exporterat med Visma Compact 080512"

#PSALDO    Periodsaldopost
Format:
#PSALDO  årsnr  period  konto  {dimensionsnr objektnr}  saldo  kvantitet

Beskrivning:
1. Posten anger periodens förändring på kontot. Kreditsaldo anges med negativt belopp.
2. Årsnr anges med 0 för innevarande år och -1 för föregående år. Om man önskar exportera ytterligare jämförelseår kan dessa läggas till som år -2, -3 osv. Räkenskapsårets omfattning definieras under #RAR.
3. Period anges i formen ÅÅÅÅMM (där ÅÅÅÅ avser kalenderår och MM avser kalendermånad).
4. Objektspecifikation (dimensionsnr och objektnr) utelämnas vid export av periodsaldon enligt SIE typ 2. Program som läser SIE typ 2 ska ignorera poster som har en objektspecifikation som ej är tom.
5. Vid export enligt SIE typ 3 skall poster anges både för kontot som helhet (dvs utan objektspecifikation) och för objekten.
6. Fältet för kvantitet är frivilligt. Kvantiteten ska normalt anges med samma tecken som beloppet för saldot, dvs plus för debet och minus för kredit.
Exempel:
#PSALDO  0  200808  1910  {}  1243.50  123
#PSALDO  0  200809  5010  {1 "0123"}  3411.80

#RAR    Räkenskapsår från vilket exporterade data hämtats
Format:
#RAR  årsnr  start  slut

Beskrivning:
1. Räkenskapsårets start och slutdatum anges i formatet ÅÅÅÅMMDD. Årsnr sätts till 0 för innevarande år och -1 för föregående år.
2. Om man önskar exportera ytterligare jämförelseår kan dessa läggas som år −2, −3 osv.
3. Observera att SIE-filen endast innehåller en kontoplan (den som avser år 0). Alla data för jämförelseåren måste normaliseras till denna kontoplan.
Exempel:
#RAR  0  20080101  20081231
#RAR  -1  20070101  20071231

============================================================
PAGE 30/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
#RES      Saldo för resultatkonto
Format:
    #RES   års   konto   saldo   kvantitet

Beskrivning:
1. Kreditsaldo anges med negativt belopp. Årsnr anges med 0 för innevarande år och -1 för föregående år. Om man önskar exportera ytterligare jämförelseår kan dessa läggas till som år -2, -3 osv. Räkenskapsårets omfattning definieras under #RAR.
2. Fältet för kvantitet är frivilligt. Kvantiteten ska normalt anges med samma tecken som beloppet för saldot, dvs plus för debet och minus för kredit. Enhet avseende kontot definieras under #ENHET.
Exempel:
    #RES   0   3011   -23780.78

#SIETYP    Anger vilken filtyp inom SIE-formatet som filen följer
Format:
    #SIETYP   typnr

Beskrivning:
1. Anger vilken filtyp inom SIE-formatet som filen följer. Om filtyp ej angetts kan det importerande programmet anta att filen följer SIE typ 1.
Exempel:
    #SIETYP   2

#SRU      SRU-kod för överföring av kontosaldo till deklaration
Format:
    #SRU   konto   SRU-kod

Beskrivning:
1. Anger för ett visst konto var på blanketten för standardiserat räkenskapsutdrag som kontots saldo ska hamna. För vissa konton ska saldot samtidigt hamna under flera rubriker på blanketten eller på flera deklarationsblanketter. I detta fall ska filen innehålla flera poster med samma kontonummer (en för varje SRU-kod).
2. I vissa fall skall belopp redovisas under olika SRU-koder beroende på beloppets tecken. I detta fall skall endast den ena SRU-koden anges i SIE-filen med posttyp #SRU (det är egalt vilken). Det mottagande programmet (deklarationsprogrammet) har redan kännedom om den alternativa koden och kan göra en förflyttning av beloppet till den kod som stämmer med beloppets tecken.
Exempel:

============================================================
PAGE 31/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
#SRU    1910    7214

#TAXAR    Taxeringsår som SRU-koderna avser
Format:
#TAXAR    år

Beskrivning:
1. Då deklarationsblanketterna förändras inför varje taxeringsår kommer de SRU-koder som läggs i SIE-filen endast att vara relevanta för ett visst taxeringsår. Genom denna post anger det exporterande programmet vilket års deklarationsblankett SRU-koderna avser. Ett importerande program bör kontrollera denna post för att avgöra om SRU-koderna är relevanta för aktuell deklaration. År anges i formen ÅÅÅÅ.
2. Posten är frivillig.
Exempel:
#TAXAR    2008

#TRANS    Transaktionspost
Format:
#TRANS    kontonr    {objektlista}    belopp    transdat    transtext    kvantitet    sign

Beskrivning:
1. Transdat och transtext behöver ej anges.
2. Om transdat ej anges antas att transaktionen avser det datum som angetts som verifikationsdatum.
3. Transaktionsposter får endast förekomma som underposter till #VER.
4. Inom en verifikation skall det råda balans. Summan av samtliga transaktionsbelopp inom en verifikation skall således vara noll.
5. Fältet för kvantitet är frivilligt. Kvantiteten ska normalt anges med samma tecken som beloppet för transaktionen, dvs plus för debet och minus för kredit.
6. Sign kan vara namn, signatur eller användarid för den person eller process som genererat transaktionsposten. Signatur kan utelämnas.
Exempel:
#VER    ""    ""    20080101    "Porto"
{
    #TRANS    1910 { }    -1000.00
    #TRANS    2640 { }    200.00
    #TRANS    6250 { }    800.00
}

============================================================
PAGE 32/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
#RTRANS    Tillagd transaktionspost

Format:
    #RTRANS kontonr {objektlista} belopp transdat transtext kvantitet sign

Beskrivning:
1. Transdat och transtext behöver ej anges.
2. Om transdat ej anges antas att transaktionen avser det datum som angetts som verifikationsdatum.
3. Tillagda transaktionsposter får endast förekomma som underposter till #VER.
4. Denna post är ett tillägg i SIE-standarden. För att bibehålla bakåtkompatibiliteten med det gamla SIE-formatet skall alltid en rad av typen #RTRANS direkt åtföljas av en likadan rad av typen #TRANS.
Exempel:
    #RTRANS   1910 {}      200.00
    #TRANS    1910 {}      200.00

Först kommer den tillagda raden. På raden omedelbart under den tillagda raden skall en exakt likadan rad av typen #TRANS komma.
5. Hanteras inte poster av typen #RTRANS och #BTRANS skall dessa rader ignoreras vid import av en SIE-fil.
6. Hanteras poster av typen #RTRANS skall den åtföljande raden av typen #TRANS ignoreras vid import av en SIE-fil.
7. Fältet för kvantitet är frivilligt. Kvantiteten ska normalt anges med samma tecken som beloppet för transaktionen, dvs plus för debet och minus för kredit.
8. Signatur kan vara namn, signatur eller användarid för den person eller process som lagt till transaktionsposten. Signatur kan utelämnas.

Exempel:
    #VER   ""   ""   20080101   "Porto"
    {
        #TRANS   1910 {}   -1200.00
        #TRANS   2640 {}   240.00
        #TRANS   6250 {}   960.00
        #RTRANS  1910 {}   200.00
        #TRANS   1910 {}   200.00
        #RTRANS  2640 {}   -40.00
        #TRANS   2640 {}   -40.00
        #RTRANS  6250 {}   -160.00
        #TRANS   6250 {}   -160.00
    }

============================================================
PAGE 33/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
Exempel på hur verifikatet kan se ut efter inläsning, då inte poster av typen #RTRANS hanteras:

<table>
  <tr>
    <th>Konto</th>
    <th>Text</th>
    <th>Debet</th>
    <th>Kredit</th>
  </tr>
  <tr>
    <td>1910</td>
    <td>Porto</td>
    <td></td>
    <td>1.200,00</td>
  </tr>
  <tr>
    <td>2640</td>
    <td>Porto</td>
    <td>240,00</td>
    <td></td>
  </tr>
  <tr>
    <td>6250</td>
    <td>Porto</td>
    <td>960,00</td>
    <td></td>
  </tr>
  <tr>
    <td>1910</td>
    <td>Porto</td>
    <td>200,00</td>
    <td></td>
  </tr>
  <tr>
    <td>2640</td>
    <td>Porto</td>
    <td></td>
    <td>40,00</td>
  </tr>
  <tr>
    <td>6250</td>
    <td>Porto</td>
    <td></td>
    <td>160,00</td>
  </tr>
  <tr>
    <td>Omslutning</td>
    <td></td>
    <td>1.400,00</td>
    <td>1.400,00</td>
  </tr>
</table>

Exempel på hur verifikatet kan se ut efter inläsning, då poster av typen #RTRANS hanteras:

<table>
  <tr>
    <th>Konto</th>
    <th>Text</th>
    <th>Debet</th>
    <th>Kredit</th>
  </tr>
  <tr>
    <td>1910</td>
    <td>Porto</td>
    <td></td>
    <td>1.200,00</td>
  </tr>
  <tr>
    <td>2640</td>
    <td>Porto</td>
    <td>240,00</td>
    <td></td>
  </tr>
  <tr>
    <td>6250</td>
    <td>Porto</td>
    <td>960,00</td>
    <td></td>
  </tr>
  <tr>
    <td>1910</td>
    <td>Porto</td>
    <td>200,00</td>
    <td></td>
  </tr>
  <tr>
    <td>2640</td>
    <td>Porto</td>
    <td></td>
    <td>40,00</td>
  </tr>
  <tr>
    <td>6250</td>
    <td>Porto</td>
    <td></td>
    <td>160,00</td>
  </tr>
  <tr>
    <td>Omslutning</td>
    <td></td>
    <td>1.400,00</td>
    <td>1.400,00</td>
  </tr>
</table>

#BTRANS   Borttagen transaktionspost
Format:
#BTRANS kontonr {objektlista} belopp transdat transtext kvantitet sign

Beskrivning:
1. Transdat och transtext behöver ej anges.
2. Om transdat ej anges antas att transaktionen avser det datum som angetts som verifikationsdatum.
3. Bortagna transaktionsposter får endast förekomma som underposter till #VER.
4. Hanteras inte poster av typen #BTRANS och #RTRANS skall dessa rader ignoreras vid import av en SIE-fil.
5. Fältet för kvantitet är frivilligt. Kvantiteten ska normalt anges med samma tecken som beloppet för transaktionen, dvs plus för debet och minus för kredit.
6. Sign kan vara namn, signatur eller användarid för den person eller process som tagit bort (strukit) transaktionsposten. Signatur kan utelämnas.

Exempel:

============================================================
PAGE 34/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
#VER "" ""
20080101 "Porto"
{
    #TRANS 1910 { } -1000.00
    #TRANS 2640 { } 200.00
    #BTRANS 6110 { } 800.00
    #RTRANS 6250 { } 800.00
    #TRANS 6250 { } 800.00
}
}

Exempel på hur verifikatet ser ut efter inläsning, då inte poster av typen #BTRANS och #RTRANS hanteras:

<table>
  <tr>
    <th>Konto</th>
    <th>Text</th>
    <th>Debet</th>
    <th>Kredit</th>
  </tr>
  <tr>
    <td>1910</td>
    <td>Porto</td>
    <td></td>
    <td>1.000,00</td>
  </tr>
  <tr>
    <td>2640</td>
    <td>Porto</td>
    <td>200,00</td>
    <td></td>
  </tr>
  <tr>
    <td>6250</td>
    <td>Porto</td>
    <td>800,00</td>
    <td></td>
  </tr>
  <tr>
    <td>Omslutning</td>
    <td></td>
    <td>1.000,00</td>
    <td>1.000,00</td>
  </tr>
</table>

Exempel på hur verifikatet kan se ut efter inläsning, då poster av typen #BTRANS och #RTRANS hanteras:

<table>
  <tr>
    <th>Konto</th>
    <th>Text</th>
    <th>Debet</th>
    <th>Kredit</th>
  </tr>
  <tr>
    <td>1910</td>
    <td>Porto</td>
    <td></td>
    <td>1.000,00</td>
  </tr>
  <tr>
    <td>2640</td>
    <td>Porto</td>
    <td>200,00</td>
    <td></td>
  </tr>
  <tr>
    <td>6110</td>
    <td>Porto</td>
    <td>800,00</td>
    <td></td>
  </tr>
  <tr>
    <td>6250</td>
    <td>Porto</td>
    <td>800,00</td>
    <td></td>
  </tr>
  <tr>
    <td>Omslutning</td>
    <td></td>
    <td>1.000,00</td>
    <td>1.000,00</td>
  </tr>
</table>

#UB Utgående balans för balanskonto

Format:
#UB årsnr konto saldo kvantitet

Beskrivning:
1. Kreditsaldo anges med negativt belopp.
2. Årsnr anges med 0 för innevarande år och -1 för föregående år.
3. Fältet för kvantitet är frivilligt. Kvantiteten ska normalt anges med samma tecken som beloppet för saldot, dvs plus för debet och minus för kredit.

Exempel:
#UB 0 2440 -2380.39

============================================================
PAGE 35/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
#UNDERDIM   Underdimension vid hierarkiska dimensioner
    Format:
        #UNDERDIM    dimensionsnr    namn    superdimension

    Beskrivning:
1. Som #DIM ovan. Dock anges även överliggande dimension.
    Exempel:
        #UNDERDIM    21    "Underavdelning"    1

#VALUTA   Redovisningsvaluta
    Format:
        #VALUTA    valutakod

    Beskrivning:
1. Valutakoden avser hela SIE-filens innehåll.
2. Valutakod anges enligt ISO 4217. Posten är frivillig. Om denna post saknas bör ett inläsande program anta att valutakoden är SEK. Även om valutakod är angiven i en SIE-fil är det inte säkert att ett importerande program läser denna post då denna är frivillig.
    Exempel:
        #VALUTA    NOK

#VER   Verifikationspost
    Format:
        #VER    serie    verno    verdatum    vertext    regdatum    sign

    Beskrivning:
1. Verifikationsposten ska alltid följas av ett antal #TRANS-poster inom klammer.
2. Vertext behöver ej anges.
3. Regdatum avser det datum då verifikationen genererades/registrerades. Detta datum används framför allt inom behandlingshistoriken. Angivande av regdatum är frivilligt.
4. Serie anges med bokstäver från A och framåt, alternativt med siffror från 1 och framåt. Ett importerande program ska hantera båda varianter.
5. Serie kan även anges som en alfanumerisk sträng, t ex LEV1.
6. Då filformatet används för att läsa in transaktioner (med hjälp av filer av typen 4I) från ett försystem till ett redovisningsprogram kan serie och/eller verno lämnas tomta. I detta fall åsätts serie resp verifikationsnummer av redovisningsprogrammet.

============================================================
PAGE 36/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
7. Alla numrerade verifikationer inom en och samma serie skall i SIE-filen läggas i stigande verifikatnummerordning.
8. Sign kan vara namn, signatur eller användarid för den person eller process som genererat eller senast redigerat transaktionsposten. Signatur kan utelämnas.
Exempel:
#VER   ""   ""   20081216   "Porto"
{
    ...
}

12. Sammanfattning av samtliga posttyper
Nedan listas samtliga posttyper i alfabetisk ordning. De fält som är obligatoriska har angetts i fetstil. Observera dock att det inte är säkert att förekomst av posten är obligatorisk.

<table>
  <tr>
    <th>Etikett</th>
    <th>Fält</th>
  </tr>
  <tr>
    <td>#ADRESS</td>
    <td>kontakt utdelningsadr postadr tel</td>
  </tr>
  <tr>
    <td>#BKOD</td>
    <td>SNI-kod</td>
  </tr>
  <tr>
    <td>#DIM</td>
    <td>dimensionsnr namn</td>
  </tr>
  <tr>
    <td>#ENHET</td>
    <td>kontonr enhet</td>
  </tr>
  <tr>
    <td>#FLAGGA</td>
    <td>x</td>
  </tr>
  <tr>
    <td>#FNAMN</td>
    <td>företagsnamn</td>
  </tr>
  <tr>
    <td>#FNR</td>
    <td>företagsid</td>
  </tr>
  <tr>
    <td>#FORMAT</td>
    <td>PC8</td>
  </tr>
  <tr>
    <td>#FTYP</td>
    <td>företagstyp</td>
  </tr>
  <tr>
    <td>#GEN</td>
    <td>datum sign</td>
  </tr>
  <tr>
    <td>#IB</td>
    <td>årsrn konto saldo kvantitet</td>
  </tr>
  <tr>
    <td>#KONTO</td>
    <td>kontonr kontonamn</td>
  </tr>
  <tr>
    <td>#KPTYP</td>
    <td>kontoplanstyp</td>
  </tr>
  <tr>
    <td>#KTYP</td>
    <td>kontonr kontotyp</td>
  </tr>
  <tr>
    <td>#OBJEKT</td>
    <td>dimensionsnr objektnr objektnamn</td>
  </tr>
  <tr>
    <td>#OIB</td>
    <td>årsrn konto {dimensionsnr objektnr} saldo kvantitet</td>
  </tr>
  <tr>
    <td>#OMFATTN</td>
    <td>datum</td>
  </tr>
  <tr>
    <td>#ORGNR</td>
    <td>orgnr förvrn verknr</td>
  </tr>
  <tr>
    <td>#OUB</td>
    <td>årsrn konto {dimensionsnr objektnr} saldo kvantitet</td>
  </tr>
  <tr>
    <td>#PBUDGET</td>
    <td>årsrn period konto {dimensionsnr objektnr} saldo kvantitet</td>
  </tr>
</table>

============================================================
PAGE 37/37
============================================================

---
primary_language: sv
is_rotation_valid: True
rotation_correction: 0
is_table: False
is_diagram: False
---
#PROGRAM    programnamn version
#PROSA      text
#PSALDO     årsnr period konto {dimensionsnr objektnr} saldo kvantitet
#RAR        årsnr start slut
Etikett     Fält
#RES        årsnr konto saldo kvantitet

#SIETYP     typnr
#SRU        konto SRU-kod
#TAXAR      år
#TRANS      kontonr {objektlista} belopp transdat transtext kvantitet sign
#RTRANS     kontonr {objektlista} belopp transdat transtext kvantitet sign

#BTRANS     kontonr {objektlista} belopp transdat transtext kvantitet sign
#UB         årsnr konto saldo kvantitet
#UNDERDIM   dimensionsnr namn superdimension
#VALUTA     Valutakod
#VER        serie verner verdatum vertext regdatum sign