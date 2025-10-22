# Expisoft - Produktionscertifikat för Skatteverket

**Uppdaterad:** 2025-10-20

---

## 📞 Kontaktstatus

### Samtal 2025-10-20
- **Tid:** Eftermiddag 2025-10-20
- **Kontakt:** Expisoft support
- **Telefon:** 08-446 47 00
- **Email:** support@expisoft.se
- **Status:** ✅ Fick info och hänvisning

### 📋 Information mottagen:
1. **Hänvisad till:** https://eid.expisoft.se/valj-elegitimation/
2. **Enskild firma:** Bekräftat att jag bör återställa enskild firma-status
3. **Osäkerhet:** Support osäker på exakt vilken produkt som behövs för Skatteverket API

---

## 🎯 Syfte

### Beställa produktionscertifikat för Skatteverket API
- **Certifikattyp:** Organisationslegitimation för API-anslutning
- **Användning:** Skatteverket Prod-miljö
- **Nuvarande status:** Har test-certifikat (Bolag A), behöver prod-certifikat
- **Organisationsnummer:** Personnummer (enskild firma)

### 🔍 Vilken produkt behövs?

Från Expisoft's produktutbud (https://eid.expisoft.se/valj-elegitimation/):

#### Troliga alternativ:

**1. Serverlegitimation/Organisationslegitimation och funktionscertifikat** ⭐ MEST TROLIG
- **Beskrivning:** "Används bla för inloggningar till tjänster hos myndigheter samt olika funktioner"
- **Användningsområde:** Myndighetstjänster ✅
- **Typ:** API-integration ✅
- **Format:** .p12 certifikat
- **Status:** Expisoft osäker, behöver bekräftas

**2. E-tjänstelegitimation**
- **Beskrivning:** "Personlig organisationslegitimation som knyter en användaren till en organisation"
- **Användningsområde:** Användarautentisering
- **Typ:** Personbunden
- **Status:** Mindre trolig för automatiserade API-anrop

**3. Test Serverlegitimation** (har redan detta via Skatteverket)
- **Nuvarande:** Bolag A certifikat fungerar för test-miljö
- **Behövs ej:** Har redan test-certifikat

### ❓ Frågor att klargöra med Skatteverket:
1. Vilket exakt certifikatnamn använder ni? (från Expisoft-katalogen)
2. Är det "Serverlegitimation/Organisationslegitimation"?
3. Finns det specifika tekniska krav (key length, algoritm)?
4. Kan ni ge exempel på "Subject" och "Issuer" för prod-certifikat?

---

## 💰 Förväntad kostnad

Enligt research (se `/Skatteverket/BESTÄLL_PROD_CERTIFIKAT.md`):

| Post | Kostnad | Engångskostnad |
|------|---------|----------------|
| **E-legitimation** | ~1500 kr | ✅ |
| **Kortläsare** (behövs om du saknar) | ~300 kr | ✅ |
| **TOTALT** | **~1800 kr** | Engångskostnad |

**OBS:** Pris kan variera, inväntar offert från Expisoft!

---

## 📋 Beställningskrav från Expisoft

### Vem kan beställa?

**✅ Enskild firma (du uppfyller detta):**
- **Krav 1:** Registrerad hos Bolagsverket ✅ (eller kopia av F-skattsedel)
- **Krav 2:** Firmatecknare måste signera beställningen
- **Krav 3:** Svenskt organisationsnummer (personnummer för enskild firma) ✅

### Vad behövs för beställning:

**Dokumentation:**
1. **Registreringsbevis från Bolagsverket** (för enskild firma) ELLER
2. **Kopia av F-skattsedel** (alternativ)
3. **Giltig legitimation** (för signering med BankID)

**Organisationsuppgifter:**
- **Organisationsnummer:** Personnummer (enskild firma)
- **Företagsnamn:** Celestial
- **Firmatecknare:** Lasse Karagiannis (du själv)
- **Kontaktperson:** Lasse Karagiannis
- **Email:** lasse@celestial.se
- **Telefon:** [ditt telefonnummer]
- **Leveransadress:** [din adress]

---

## ✅ LENAS BEKRÄFTELSE - Produktionskrav (2025-10-20)

**Datum:** 2025-10-20, 16:12  
**Från:** api@skatteverket.se (Lena Erlandsson)

### Krav för Skatteverket produktion-API:

1. ✅ **Programvaruföretag** 
   - Utvecklar tjänster för andra företag och deras ombud
   - Status: OK - Onboarding app uppfyller detta!

2. ✅ **Godkänd F-skatt** (OBLIGATORISKT)
   - Inte frivilligt för produktion
   - Måste ansökas vid företagsregistrering

3. ✅ **Registrerad moms** (OBLIGATORISKT - NYTT KRAV!)
   - Även om omsättning < 80 000 kr
   - Frivillig momsregistrering är OK
   - Visar seriös programvaruverksamhet

**Citat från Lena:**
> "För att kunna koppla sej mot våra partner-API som finns i produktion 
> så ska man vara ett programvaruföretag som utvecklar tjänster som gör 
> att andra företag och dess ombud kan hämta information hos oss, du 
> behöver med andra ord ha ett aktivt programvaruföretag som bland annat 
> ska vara godkänd för F-skatt och ha registrerad moms."

**Status:** Krav tydliggjorda ✅  
**Åtgärd:** Ansök enskild firma med BÅDE F-skatt OCH moms  
**Dokumentation:** Se `LENA_SVAR_PROD_KRAV_2025-10-20.md`

**Tekniska krav:**
- **Syfte:** API-anslutning till Skatteverket
- **Miljö:** Produktion
- **Certifikatformat:** .p12 (PKCS#12)
- **Produkttyp:** Serverlegitimation/Organisationslegitimation (troligen)
- **Nuvarande test-cert:** 68e28fae0d034.p12 (fungerar för test)

---

## 📅 Förväntad tidslinje

### Från beställning till leverans: 1-2 veckor
1. **Beställning skickas** - Mejl/telefon med Expisoft ✅
2. **Identifiering** - BankID eller fysiskt besök (?)
3. **Certifikat utfärdas** - 1-2 dagar efter verifiering
4. **PIN-kod skickas** - Separat brev (säkerhet)
5. **Certifikat levereras** - .p12-fil via mejl eller nedladdning
6. **Kortläsare levereras** - Om beställd, via post

**Total tid:** 1-2 veckor från beställning till allt klart

---

## 🔄 Nästa steg - UPPDATERAT

### 1. Klargör certifikattyp med Skatteverket ⚠️ VIKTIGT FÖRST
```
Till: api@skatteverket.se eller Lena Erlandsson
Ämne: Fråga om produktionscertifikat för Skattekonto API

Hej!

Jag har testmiljön för Skattekonto API fungerande med test-certifikat 
(Bolag A). Nu förbereder jag mig för produktionsmiljö och behöver 
beställa produktionscertifikat från Expisoft.

Expisoft har flera certifikattyper och är osäkra på vilken som passar 
för Skatteverkets API. Kan ni bekräfta:

1. Vilket certifikatnamn från Expisoft-katalogen ska användas?
   - "Serverlegitimation/Organisationslegitimation och funktionscertifikat"?
   - Eller annan typ?

2. Finns tekniska specifikationer jag ska ange vid beställning?
   (key length, algoritm, etc.)

3. Jag har enskild firma (personnummer som org.nr). Fungerar det för 
   produktionsmiljö?

App: lassekaragiannis_onboardingapp_1
Test-miljö: Fungerar ✅

Tack på förhand!
Lasse Karagiannis
lasse@celestial.se
```

### 2. Återställ enskild firma-status
**Från Expisoft-kravet:**
> "Enskilda firmor ska vara registrerade hos Bolagsverket eller så ska 
> kopia av F-skattsedel bifogas beställningen."

**Alternativ:**
- **A) Registrera enskild firma hos Bolagsverket** (~1000 kr engångskostnad)
- **B) Skaffa F-skattsedel** (via Skatteverket)
- **C) Om redan registrerad:** Hämta registreringsbevis

**Fördelar med att återställa enskild firma:**
- ✅ Krävs för Expisoft-certifikat
- ✅ Krävs för Skatteverket prod-miljö (org.nr)
- ✅ Professionellt för LIA/affärer
- ✅ F-skatt möjliggör fakturering

### 3. När certifikattyp bekräftad: Beställ från Expisoft
**Process:**
1. Besök https://eid.expisoft.se/valj-elegitimation/
2. Välj rätt produkt (efter Skatteverket-svar)
3. Fyll i beställningsformulär
4. Signera med BankID (du som firmatecknare)
5. Bifoga F-skattsedel eller registreringsbevis
6. Vänta på leverans (1-2 veckor)

### 4. När certifikat mottas: Ansök prod-nycklar Skatteverket
**Guide:** `/Skatteverket/ANSÖK_PROD_NYCKLAR.md`
```bash
# Kopiera till Skatteverket-mapp
cp /path/to/prod_cert.p12 /home/lasse/Documents/React/tic-tac-toe-app/Skatteverket/

# Säkerhet
chmod 600 /home/lasse/Documents/React/tic-tac-toe-app/Skatteverket/prod_cert.p12
```

### 2. Testa certifikat (test-miljö först!)
```bash
cd /home/lasse/Documents/React/tic-tac-toe-app/Skatteverket
source ../venv/bin/activate
# Modifiera test_tax_ccg_FIXED.py att använda prod_cert.p12
python3 test_tax_ccg_FIXED.py
```

### 3. Ansök om prod-nycklar från Skatteverket
- **Guide:** `/Skatteverket/ANSÖK_PROD_NYCKLAR.md`
- **Kontakt:** api@skatteverket.se eller Utvecklarportalen
- **Behöver:** Prod-certifikatets subject/issuer
- **Tid:** 1-2 veckor handläggningstid

### 4. Uppdatera API-implementation
- Byt test-credentials mot prod-credentials
- Byt test-endpoints mot prod-endpoints
- Implementera ordentlig error-handling
- Implementera token-caching
- Testa grundligt!

---

## 📧 Väntar på från Expisoft

### Information som förväntas i mejl:
1. **Offert/prissättning** - Exakt kostnad
2. **Beställningsprocedur** - Hur beställer jag?
3. **Identifieringskrav** - BankID? Fysiskt besök?
4. **Leveranstid** - Exakt tidslinje
5. **Betalningsvillkor** - Faktura? Kort?
6. **Tekniska specifikationer** - Certifikatdetaljer
7. **Kortläsare** - Behövs? Ingår? Extra?

---

## ⚖️ Beslut att ta

### När offert mottagits:
1. **Kostnadsbedömning:** ~1800 kr rimligt för projektet?
2. **Tidplanering:** 1-2 veckor leverans OK för LIA-tidplan?
3. **ROI:** Värt för hobbyverksamhet/LIA-demo?

### Alternativ:
- ✅ **Beställ prod-cert:** Om pris OK och vill ha full prod-miljö
- ⏸️ **Avvakta:** Kör med test-miljö för LIA, uppgradera senare
- ❌ **Skippa prod:** Använd endast test-API för demo

### Rekommendation:
**Beställ om:**
- Pris under 2000 kr ✅
- Vill imponera på LIA-företag ✅
- Vill lära dig full prod-setup ✅
- Har tid att vänta 1-2 veckor ✅

**Vänta om:**
- Pris över 3000 kr ⚠️
- Stressad tidplan för LIA ⚠️
- Test-API räcker för demo ⚠️

---

## 🔗 Relaterad dokumentation

- **Beställningsguide:** `/Skatteverket/BESTÄLL_PROD_CERTIFIKAT.md`
- **Prod-ansökan:** `/Skatteverket/ANSÖK_PROD_NYCKLAR.md`
- **Skatteverket Setup:** `/Skatteverket/KOMPLETT_SETUP_GUIDE.md`
- **Test-resultat:** `/Skatteverket/TEST_RESULTAT_2025-10-20.md`

---

## 📞 Kontaktinfo

**Expisoft:**
- Email: support@expisoft.se
- Telefon: 08-446 47 00
- Webb: https://www.expisoft.se

**Skatteverket API Support:**
- Email: api@skatteverket.se
- Telefon: 0771-567 567
- Kontakt: Lena Erlandsson (vår handläggare)

---

*Uppdateras när mejl från Expisoft mottas.*
