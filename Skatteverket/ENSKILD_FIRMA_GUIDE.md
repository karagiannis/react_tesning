# Enskild Firma - Återställning för Certifikatbeställning

**Datum:** 2025-10-20  
**Anledning:** Krävs för Expisoft-certifikat och Skatteverket prod-miljö

---

## 🎯 Varför återställa enskild firma?

### Krav från Expisoft:
> "Enskilda firmor ska vara registrerade hos Bolagsverket eller så ska 
> kopia av F-skattsedel bifogas beställningen."

### Krav från Skatteverket:
- Produktionsmiljö kräver organisationsnummer
- Personnummer kan användas för enskild firma
- Alternativt krävs aktiebolag (dyrare)

### Fördelar:
- ✅ **Certifikatbeställning möjlig** (primärt skäl)
- ✅ **Skatteverket prod-API** (kräver org.nr)
- ✅ **Professionellt** (för LIA och framtida kunder)
- ✅ **F-skatt** (kan fakturera kunder)
- ✅ **Hobbyverksamhet OK** (ingen omsättningsgräns)
- ✅ **Låg kostnad** (jämfört med AB)

---

## 📋 Alternativ

### Alternativ 1: F-skattsedel (SNABBAST) ⭐
**Vad:** Bevis om F-skatt för enskild näringsidkare  
**Kostnad:** GRATIS  
**Tid:** 1-2 veckor  
**Process:**
1. Ansök via Skatteverkets webbplats eller blankett SKV 4620
2. Personnummer används som organisationsnummer
3. F-skattsedel skickas hem
4. Använd för Expisoft-beställning

**För:** Snabbt, gratis, enkelt  
**Emot:** Begränsat jämfört med full registrering

### Alternativ 2: Registrera enskild firma hos Bolagsverket
**Vad:** Full registrering av enskild firma  
**Kostnad:** ~1000 kr (engångsavgift)  
**Tid:** 2-4 veckor  
**Process:**
1. Ansök via verksamt.se
2. Välj företagsnamn ("Celestial" om tillgängligt)
3. Registreras i Bolagsverkets register
4. Får registreringsbevis
5. Automatiskt F-skatt

**För:** Full legitimitet, kan ha anställda, tydligt företagsnamn  
**Emot:** Kostar pengar, lite längre process

### Alternativ 3: Aktiebolag (OVERKILL)
**Vad:** Eget juridiskt subjekt  
**Kostnad:** ~25 000 kr (aktiekapital) + ~1000 kr registrering  
**Tid:** 4-8 veckor  
**Process:** Komplicerad, stämma, bolagsordning, etc.

**För:** Begränsat personligt ansvar, proffsigare  
**Emot:** Dyrt, krångligt, bokföringsskyldighet, overkill för LIA/hobby

---

## 💡 Rekommendation: F-SKATTSEDEL ⭐

### Varför F-skattsedel först?

**Snabbast:**
- 1-2 veckor jämfört med 2-4 veckor för full registrering
- Kan parallellt vänta på Skatteverket-svar om certifikattyp

**Billigast:**
- GRATIS vs 1000 kr för Bolagsverket-registrering

**Tillräckligt:**
- Expisoft accepterar F-skattsedel ✅
- Personnummer = organisationsnummer ✅
- Kan uppgradera till full registrering senare om behov

**Flexibelt:**
- Om Skatteverket säger "behöver inte prod-cert" → inget förlorat
- Om certifikat krävs → har F-skatt redo

---

## 📝 Steg-för-steg: Ansök F-skattsedel

### 1. Förbered information
- **Personnummer:** Ditt personnummer
- **Verksamhetsbeskrivning:** "IT-konsult / Mjukvaruutveckling"
- **Branschkod:** 62010 (Dataprogrammering)
- **Start datum:** Datum du vill att F-skatten börjar gälla
- **Kontaktuppgifter:** Adress, telefon, email

### 2. Ansök online (REKOMMENDERAT)
**Via Skatteverkets e-tjänst:**
1. Gå till https://www.skatteverket.se/
2. Sök "Ansökan om F-skatt"
3. Logga in med BankID
4. Fyll i blankett SKV 4620 online
5. Skicka in elektroniskt

### 3. Ansök via blankett (ALTERNATIV)
**Via papper:**
1. Ladda ner blankett SKV 4620
2. Fyll i för hand eller på dator
3. Skriv ut och signera
4. Posta till Skatteverket

### 4. Vänta på beslut
- **Tid:** 1-2 veckor
- **Besked:** Kommer per post
- **F-skattsedel:** Skickas separat när godkänt

### 5. När F-skattsedel mottas
- ✅ Scanna eller fotografera
- ✅ Spara PDF/bild för Expisoft-beställning
- ✅ Kan nu beställa certifikat!

---

## ⚠️ Saker att tänka på

### Om du redan har haft enskild firma:
- **Avregistrerad?** Ansök om återregistrering (samma process)
- **Vilande?** Kan reaktivera direkt
- **F-skatt kvar?** Kolla med Skatteverket först

### Skattekonsekvenser:
- **F-skatt:** Du betalar preliminär skatt själv (inga avdrag av arbetsgivare)
- **Hobbyverksamhet:** Begränsad omsättning OK, enkel bokföring
- **Ingen momsregistrering behövs** (under 80 000 kr omsättning/år)

### Bokföringskrav:
- **Förenklad bokföring** för hobbyverksamhet
- **SRU-filer** räcker för deklaration
- Kan använda Fortnox (gratis upp till 50 verifikationer/månad?)

---

## 📅 Tidsplan

### Scenario 1: Parallellt (REKOMMENDERAT)
```
Vecka 1:
- Ansök F-skattsedel                    → start
- Mejla Skatteverket om certifikattyp   → start

Vecka 2-3:
- F-skattsedel anländer                 → redo för Expisoft
- Skatteverket svarar på certifikatfråga → vet vilken typ

Vecka 3:
- Beställ certifikat från Expisoft      → signera med BankID

Vecka 4-5:
- Certifikat levereras                  → .p12 fil mottas

Vecka 5:
- Ansök prod-nycklar Skatteverket       → skicka in ansökan

Vecka 6-7:
- Prod-nycklar mottagna                 → KLART! 🎉

Total tid: ~7 veckor
```

### Scenario 2: Sekventiellt (LÅNGSAMMARE)
```
Vänta på Skatteverket-svar → sen F-skatt → sen certifikat
Total tid: ~9-10 veckor
```

---

## ✅ Action Items

### Omedelbart (idag/imorgon):
- [ ] Mejla Skatteverket om certifikattyp
- [ ] Ansök F-skattsedel online

### När F-skattsedel mottas:
- [ ] Scanna/fotografera F-skattsedel
- [ ] Spara digitalt för Expisoft

### När Skatteverket svarat:
- [ ] Beställ rätt certifikat från Expisoft
- [ ] Bifoga F-skattsedel
- [ ] Signera med BankID

### När certifikat mottas:
- [ ] Installera i venv
- [ ] Testa i test-miljö först
- [ ] Ansök prod-nycklar

---

## 📞 Kontakter

**Skatteverket (F-skatt):**
- Telefon: 0771-567 567
- Web: https://www.skatteverket.se/
- Blankett: SKV 4620

**Bolagsverket (registrering):**
- Telefon: 0771-670 670
- Web: https://verksamt.se/

**Expisoft (certifikat):**
- Email: support@expisoft.se
- Telefon: 08-446 47 00
- Web: https://eid.expisoft.se/

---

## 🎯 Slutsats

**Rekommenderad väg:**
1. ✅ Ansök F-skattsedel NU (gratis, 1-2 veckor)
2. ✅ Mejla Skatteverket om certifikattyp NU (parallellt)
3. ⏳ Vänta på båda svaren
4. ✅ Beställ certifikat med F-skattsedel
5. ⏳ Vänta på leverans (1-2 veckor)
6. ✅ Ansök prod-nycklar
7. 🎉 Prod-miljö klar!

**Totalkostnad:**
- F-skatt: GRATIS
- Certifikat: ~1800 kr (cert + kortläsare)
- **TOTALT: ~1800 kr**

Mycket rimligt för ett professionellt LIA-projekt! 💪
