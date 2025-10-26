# Email till Skatteverket - Fråga om Produktionscertifikat

**Datum:** 2025-10-20  
**Från:** Lasse Karagiannis <lasse@celestial.se>  
**Till:** api@skatteverket.se (cc: Lena Erlandsson om du har hennes email)  
**Ämne:** Fråga om produktionscertifikat för Skattekonto API

---

## 📧 Mejlutkast:

```
Hej!

Jag har testmiljön för Skattekonto API (huvudmans-saldo-och-transaktioner) 
fungerande och är nu redo att förbereda för produktionsmiljö.

NULÄGE:
- Applikation: lassekaragiannis_onboardingapp_1
- Test-miljö: Fullständigt fungerande ✅
  * Token-hämtning: OK
  * API-anrop (/bestall): OK (202 Accepted)
  * Certifikat-autentisering: OK
- Test-certifikat: Bolag A (från Skatteverket test-zip)

FRÅGA OM PRODUKTIONSCERTIFIKAT:
Jag har kontaktat Expisoft för att beställa produktionscertifikat men de 
har flera certifikattyper i sin katalog och är osäkra på vilken som är 
rätt för Skatteverkets API.

Från Expisoft's produktutbud (https://eid.expisoft.se/valj-elegitimation/):
1. "Serverlegitimation/Organisationslegitimation och funktionscertifikat"
   - Används för inloggningar till myndigheter
2. "E-tjänstelegitimation"
   - Personlig organisationslegitimation

Kan ni bekräfta:

1. Vilket certifikatnamn från Expisoft ska jag beställa för Skattekonto API?

2. Finns det tekniska specifikationer jag ska ange vid beställning?
   - Key length (2048-bit, 4096-bit?)
   - Algoritm
   - Andra tekniska krav

3. Just nu bedriver jag hobbyverksamhet (student), måste jag ställa på min 
   enskilda firma för prod?

4. Finns det en guide eller dokumentation för certifikatbeställning som 
   jag kan följa?

BAKGRUND:
Projektet är en onboarding-applikation för redovisningsbyråer som 
automatiserar kundintroduktion genom att integrera med myndigheters API:er 
(Bolagsverket + Skatteverket). Detta är ett LIA-projekt (Lärande i Arbete) 
men syftar till riktig produktion för hobbyverksamhet.

Tack för hjälpen hittills - Lena har varit fantastisk med att aktivera 
testtjänsten! 🙏

Med vänlig hälsning,
Lasse Karagiannis

---
Celestial
lasse@celestial.se
[ditt telefonnummer om du vill]
```

---

## 📋 Alternativ kortare version:

```
Hej!

Test-miljön för Skattekonto API fungerar perfekt tack vare er hjälp! 
Nu förbereder jag produktionsmiljö.

Expisoft är osäkra på vilken certifikattyp jag ska beställa för 
Skatteverkets API. Kan ni bekräfta:

1. Certifikattyp från Expisoft-katalogen:
   - "Serverlegitimation/Organisationslegitimation"? Eller annan?

2. Tekniska specs (key length, algoritm)?

3. Enskild firma (personnummer) OK för prod? Eller krävs AB?

App: lassekaragiannis_onboardingapp_1
Status: Test-miljö fungerar ✅

Tack!
Lasse Karagiannis
lasse@celestial.se
```

---

## 💡 Tips:

### När du skickar mejlet:
1. ✅ Använd lasse@celestial.se (företagsmail)
2. ✅ Referera till din app-ID (de känner igen dig)
3. ✅ Nämn att test fungerar (visar att du är seriös)
4. ✅ Var specifik om Expisoft-katalogen
5. ✅ Fråga om enskild firma OK

### Förväntat svar:
- Certifikattyp-namn från Expisoft
- Eventuella tekniska specs
- Bekräftelse om enskild firma OK
- Ev. länk till guide/dokumentation
- Svarstid: 1-3 arbetsdagar

### Om de svarar "Serverlegitimation":
→ Beställ direkt från Expisoft  
→ Bifoga F-skattsedel eller registreringsbevis  
→ Signera med BankID  
→ Vänta 1-2 veckor på leverans

### Om de säger "behöver inte prod-certifikat":
→ Använd samma test-certifikat? (osannolikt)  
→ Skatteverket utfärdar egna certifikat? (möjligt)  
→ Följ deras instruktioner

---

**Skicka mejlet så snart som möjligt för att få svar innan veckan är slut!** 📧
