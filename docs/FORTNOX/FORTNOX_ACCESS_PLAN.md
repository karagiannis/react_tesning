# Fortnox Developer Access - Action Plan

## ✅ Steg 1: Registrera på Developer Portal
**URL:** https://www.fortnox.se/developer

**Actions:**
1. [ ] Gå till utvecklarportalen
2. [ ] Registrera dig som utvecklare
3. [ ] Anteckna vad som händer (får du direkt access eller väntar på godkännande?)

---

## ✅ Steg 2: Be Systemadministratör om licens

**Vem är systemadministratör?**
- På Hyrupstars AB: [Namn?]
- På Fredrik's företag: Fredrik själv (förmodligen)

**Vad de ska göra:**
```
1. Logga in på Fortnox
2. Gå till Support/Hjälp
3. Skapa supportärende
4. Ämne: "Lägg till utvecklarportal-licens för användare [din e-post]"
5. Förklara: "Vi utvecklar intern integration och behöver sandbox-access"
```

**Mall för supportärende:**
```
Ämne: Ansökan om utvecklarportal-licens

Hej,

Vi vill utveckla en intern integration med Fortnox API och behöver tillgång till utvecklarportalen.

Användare som ska ha access:
- Namn: Lasse Karagiannis
- E-post: [din e-post]
- Roll: Utvecklare

Vi behöver:
1. Licens till utvecklarportalen
2. Möjlighet att skapa sandbox-miljöer
3. (Senare) Live API-nycklar för privat bruk

Projektet är en onboarding-app för att följa penningtvättslagens krav.

Mvh,
[Systemadministratörens namn]
[Företagsnamn]
```

---

## ✅ Steg 3: När licens är tillagd

**I utvecklarportalen:**
1. [ ] Skapa första sandbox-miljön
2. [ ] Acceptera inbjudningsmail
3. [ ] Logga in på sandbox
4. [ ] Utforska vilka endpoints som finns
5. [ ] Kolla OAuth scopes (exakta namn)
6. [ ] Testa API-anrop

---

## ✅ Steg 4: För Fredrik's bokföringsassistent

**När Onboarding-appen är klar:**

**Fredrik måste (som systemadministratör på sitt företag):**
1. [ ] Skapa supportärende för utvecklarportal-licens
2. [ ] Ge Lasse access till sitt företag i Fortnox (som konsult)
3. [ ] Godkänna OAuth för bokföringsassistenten
4. [ ] Testa i sandbox först
5. [ ] Byt till live när det fungerar

---

## 📝 Notes:

### Viktig insikt från AI-svaret:
> "API-nycklar och integrationer är kopplade till företaget"

**Detta betyder:**
- Du får INTE en generell nyckel som fungerar för alla
- Varje företag som använder din app gör OAuth-flow
- Token per företag (multi-tenant arkitektur)

### För privat bruk (Fredrik):
- Fredrik's företag = ett Fortnox-konto
- Du bygger app → Fredrik gör OAuth → får token
- Token gäller endast Fredrik's företag

### För marketplace (framtida):
- Samma OAuth-flow
- Men din app måste godkännas av Fortnox först
- Alla användare gör OAuth individuellt

---

## ⏰ Tidslinje:

**Idag:**
- [ ] Registrera på developer.fortnox.se

**Imorgon:**
- [ ] Be systemadministratör skapa supportärende
- [ ] Vänta på svar från Fortnox support (1-3 dagar?)

**När licens tillagd:**
- [ ] Skapa sandbox
- [ ] Börja utveckla mot sandbox
- [ ] Testa alla funktioner

**Om 1-2 veckor:**
- [ ] Demo för Fredrik med sandbox
- [ ] Diskutera live-access

---

## 🔗 Länkar att spara:

- Developer Portal: https://www.fortnox.se/developer
- API Documentation: https://developer.fortnox.se/documentation/
- OAuth Guide: https://developer.fortnox.se/general/authentication/
- Support: Via Fortnox-inloggning → Hjälp → Nytt ärende

---

## ❓ Uppföljningsfrågor till mänsklig support (om behövs):

1. Hur lång tid tar det att få utvecklarportal-licens?
2. Kostar utvecklarportal-access något? (Troligen gratis)
3. Finns det gräns för API-anrop i sandbox?
4. Behövs olika licenser för sandbox vs live?
5. Kan samma OAuth-integration användas för både sandbox och live?

---

**Status:** ⏳ Väntar på registrering + systemadministratör
