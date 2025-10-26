# Lena's Svar - Produktionskrav Skatteverket API

**Datum:** 2025-10-20, 16:12 (4:12 PM)  
**Från:** api@skatteverket.se (Lena Erlandsson, IT-tjänsteman)  
**Ämne:** SV: Re: Re: Begär tillgång till API komplett testtjänst för Skattekonto

---

## 📧 LENAS SVAR (fullständigt):

> Hej Lasse!
>
> För att kunna koppla sej mot våra partner-API som finns i produktion så ska man vara ett **programvaruföretag** som utvecklar tjänster som gör att andra företag och dess ombud kan hämta information hos oss, du behöver med andra ord ha ett aktivt programvaruföretag som bland annat ska vara **godkänd för F-skatt** och ha **registrerad moms**.
>
> Med vänlig hälsning
>
> API - anslutningar och teknisk support  
> Lena Erlandsson  
> IT-tjänsteman

---

## ✅ KRAV FÖR PRODUKTION - BEKRÄFTADE:

### 1. **Programvaruföretag** ✅
- Du utvecklar onboarding-app = programvara ✅
- För andra företag och deras ombud = tjänst för kunder ✅
- **Status:** OK - du uppfyller detta!

### 2. **Godkänd F-skatt** ⭐ MÅSTE HA
- Lena bekräftar: F-skatt är **OBLIGATORISKT**
- Inte frivilligt för produktion!
- **Åtgärd:** Ansök enskild firma med F-skatt NU!

### 3. **Registrerad moms** ⚠️ NYTT KRAV!
- Lena säger: Även **MOMS krävs**!
- Detta var INTE nämnt tidigare
- **Åtgärd:** Måste registrera moms vid ansökan!

---

## 🔄 UPPDATERAD HANDLINGSPLAN

### ❌ GAMMAL PLAN (före Lenas svar):
- Enskild firma med F-skatt
- **SKIPPA moms** (under 80k gräns)
- ~300 kr kostnad

### ✅ NY PLAN (efter Lenas svar):
- Enskild firma med F-skatt
- **INKLUDERA MOMS** (obligatoriskt för Skatteverket prod!) ⚠️
- ~300 kr kostnad (samma)
- Lite mer administration (momsdeklaration)

---

## 📋 UPPDATERAD VERKSAMT-ANSÖKAN

### Kryssa i följande:
- ✅ **Registrera företag** (enskild firma)
- ✅ **F-skatt** (Obligatoriskt för Skatteverket API)
- ✅ **MOMS** ⚠️ (NU OBLIGATORISKT - Lena bekräftar!)
- ✅ **Skattekonto**

### Varför moms nu är nödvändigt:
- Skatteverket kräver det för partner-API i produktion
- Även om omsättning < 80 000 kr
- Frivillig momsregistrering är tillåten (under 80k)
- **Du MÅSTE registrera för att få produktionsaccess**

---

## 💰 KOSTNAD (oförändrad)

**Registreringsavgift:** ~300 kr  
**F-skatt:** GRATIS (ingår)  
**Moms:** GRATIS (ingår)  
**Totalt:** ~300 kr ✅

---

## 📊 VAD MOMS INNEBÄR FÖR DIG

### Administration (mer än utan moms):
1. **Momsdeklaration:**
   - Lämnas månatligen (små företag) ELLER kvartalsvis (om tillåtet)
   - Via Skatteverkets e-tjänst
   - Deadline: 26:e månaden efter (månatlig) eller 26:e efter kvartal
   - **OBS:** Även om ingen omsättning = noll-deklaration

2. **Bokföring:**
   - Måste föra momsräkning
   - Utgående moms på fakturor (om relevant)
   - Ingående moms på inköp (avdragsgillt!)
   - Lite mer komplext än utan moms

3. **Fakturering:**
   - Lägga till 25% moms på fakturor
   - Men: För LIA/hobby med låg omsättning kanske få fakturor?

### FÖRDELAR med moms (silver lining):
- ✅ Du kan dra av moms på inköp (laptop, licenser, etc.)!
- ✅ Får tillbaka 25% på Fortnox, Azure, OpenAI-licenser, etc.
- ✅ Professionellt - visar att du är seriös
- ✅ Nödvändigt för Skatteverket prod-API access

---

## ⏰ UPPDATERAD TIDSPLAN

### NU (2025-10-20):
- ✅ Lena bekräftat krav (F-skatt + MOMS)
- 🔄 Ansök enskild firma med F-skatt + MOMS

### Vecka 1-2:
- 🔄 Bolagsverket behandlar ansökan
- 🔄 Skatteverket behandlar F-skatt + momsregistrering

### Vecka 2-4:
- 📬 F-skattsedel kommer via post
- 📧 Momsregistreringsnummer bekräftat (organisationsnummer)
- ✅ Enskild firma klar med både F-skatt och moms

### Efter mottagande:
- 📸 Scanna F-skattsedel
- 📧 Maila Lena igen: "Nu har jag F-skatt + moms, kan jag ansöka om prod-API?"
- 🔄 Invänta certifikattyp-svar från Lena
- 🛒 Beställ certifikat från Expisoft
- 🔑 Ansök produktionsnycklar hos Skatteverket

---

## 📧 NÄSTA KONTAKT MED LENA

**När:** Efter F-skattsedel + momsregistrering mottagen (2-4 veckor)

**Mejl till Lena:**
```
Ämne: Programvaruföretag etablerat - Ansökan om produktions-API

Hej Lena!

Tack för ditt tidigare svar om krav för produktion!

Jag har nu registrerat mitt programvaruföretag (enskild firma) 
med både F-skatt och momsregistrering enligt dina anvisningar.

Organisationsnummer: [ditt personnummer]
F-skatt: Godkänd [datum]
Momsregistrering: Aktiv [datum]
Företagsnamn: [Lasse Karagiannis / Celestial]

Bilagor:
- F-skattsedel (PDF)
- Bolagsverkets registreringsbevis (PDF)

Jag har tidigare 3 frågor angående produktionscertifikat:

1. Vilket certifikat från Expisoft katalog ska jag beställa?
   (https://eid.expisoft.se/valj-elegitimation/)
   - "Serverlegitimation/Organisationslegitimation"?
   - "E-tjänstelegitimation för juridisk person"?

2. Finns tekniska specifikationer (nyckelstorlek, algoritm)?

3. Finns guide för certifikatbeställning och prod-API-ansökan?

Min testmiljö fungerar perfekt (app-ID: lassekaragiannis_onboardingapp_1)
och jag är redo att ansöka produktionsnycklar när certifikat beställt.

Med vänlig hälsning,
Lasse Karagiannis
lasse@celestial.se
```

---

## 🎯 HANDLINGSLISTA NU

### 1. ✅ Uppdatera ENSKILD_FIRMA_ANSOKAN_CHECKLISTA.md
- Ändra "SKIPPA moms" → "INKLUDERA moms"
- Förklara varför (Skatteverket krav)
- Lägg till momsadministration info

### 2. 🔄 Ansök enskild firma på Verksamt.se
- Med F-skatt ✅
- Med MOMS ✅ (även under 80k omsättning)
- Verksamhetsbeskrivning: Programvaruföretag
- SNI-kod: 62010
- Kostnad: ~300 kr

### 3. ⏰ Invänta behandling (2-4 veckor)
- F-skattsedel via post
- Momsregistrering bekräftad
- Organisationsnummer aktivt

### 4. 📧 Kontakta Lena igen (efter F-skatt + moms klart)
- Bifoga F-skattsedel
- Bifoga registreringsbevis
- Fråga om certifikattyp
- Be om prod-guide

### 5. 🛒 Beställ certifikat från Expisoft
- När Lena bekräftat typ
- Bifoga F-skattsedel
- Sign med BankID
- ~1800 kr

### 6. 🔑 Ansök prod-nycklar Skatteverket
- När certifikat mottagit
- Sign partnerskapsavtal
- Vänta 1-2 veckor

---

## 📊 TOTAL TIDSPLAN (uppdaterad)

| Vecka | Vad händer | Status |
|-------|------------|--------|
| **0 (nu)** | Ansök enskild firma (F-skatt + MOMS) | 🔄 Gör nu! |
| **1-2** | Bolagsverket + Skatteverket behandlar | ⏰ Väntar |
| **2-4** | F-skattsedel + momsreg. klart | ⏰ Väntar |
| **4** | Kontakta Lena med dokumentation | 📧 Efter mottagen |
| **4-5** | Lena svarar om certifikattyp | ⏰ Väntar svar |
| **5** | Beställ certifikat Expisoft (~1800kr) | 🛒 Efter Lenas svar |
| **6-7** | Certifikat levererat | 📬 Väntar leverans |
| **7** | Ansök prod-nycklar Skatteverket | 📧 Med certifikat |
| **8-9** | Prod-nycklar godkända | ✅ Klar! |

**Total tid: ~9 veckor från nu till produktions-API**

---

## 💡 VIKTIGA INSIKTER

### Vad Lena INTE svarade på:
- ❓ Vilket certifikatnamn från Expisoft
- ❓ Tekniska specifikationer
- ❓ Guide för certifikatbeställning

→ **Fråga igen EFTER F-skatt + moms klart!**

### Varför Lena kräver moms:
- "Programvaruföretag" = seriöst företag
- Partner-API = högre krav än test-API
- Skatteverket vill säkerställa legitimitet
- Momsregistrering = bevis på aktiv verksamhet

### Silver lining:
- Du kan dra av moms på alla inköp (Azure, Fortnox, laptop, etc.)!
- Professionellt - visar att du är seriös aktör
- Nödvändigt för andra företagstjänster också (inte bara Skatteverket)

---

## 🎉 POSITIVT

✅ **Lena svarade snabbt!** (samma dag)  
✅ **Tydliga krav!** (F-skatt + moms)  
✅ **Test-API fungerar!** (bekräftelse att vi är på rätt spår)  
✅ **Kostnad oförändrad!** (~300 kr för registrering)  
✅ **Vägen framåt är klar!**

---

## 🚀 NÄSTA STEG: GÖR NU

1. **Uppdatera checklista** (inkludera moms)
2. **Öppna Verksamt.se**
3. **Ansök enskild firma**
   - ✅ F-skatt
   - ✅ MOMS (även under 80k)
   - ✅ Skattekonto
4. **Betala ~300 kr**
5. **Invänta F-skattsedel** (2-4 veckor)
6. **Kontakta Lena igen** (med dokumentation)

---

*Uppdaterad: 2025-10-20 17:30*  
*Status: Krav bekräftade - redo för ansökan!* ✅
