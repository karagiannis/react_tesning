# Email-forwarding för Klarna Kosma registrering

## 🎯 Problemet

Du vill registrera dig på Klarna Kosma med `lasse@celestial.se` (företagsmejl) men kan inte ta emot mejl på den adressen eftersom du inte har mailserver uppsatt.

---

## ✅ Lösning 1: Email forwarding via DNS (REKOMMENDERAT)

### Steg-för-steg:

**1. Logga in på din domänleverantör (där du äger celestial.se)**
   - T.ex. Loopia, One.com, GoDaddy, etc.

**2. Hitta DNS-inställningar eller Email-forwarding**

**3. Skapa email forwarding:**
```
Från: lasse@celestial.se
Till: lasse.l.karagiannis@gmail.com
```

**4. Spara och vänta 5-30 minuter på DNS-propagering**

**5. Testa att det fungerar:**
   - Skicka ett test-mejl till lasse@celestial.se från din Gmail
   - Kontrollera att det dyker upp i lasse.l.karagiannis@gmail.com

**6. Registrera på Klarna Kosma med lasse@celestial.se**
   - Bekräftelsemejlet kommer nu till din Gmail!

---

## ✅ Lösning 2: Gratis email-tjänst med forward

### ImprovMX (gratis email forwarding):

**1. Gå till:** https://improvmx.com

**2. Skapa konto (gratis)**

**3. Lägg till din domän:** `celestial.se`

**4. ImprovMX ger dig DNS-records att lägga till:**
```
MX Record:
Priority: 10
Host: @
Value: mx1.improvmx.com

MX Record:
Priority: 20
Host: @
Value: mx2.improvmx.com
```

**5. Lägg till dessa i din DNS (hos domänleverantören)**

**6. Skapa alias:**
```
lasse@celestial.se → lasse.l.karagiannis@gmail.com
```

**7. Vänta på DNS-propagering (15-60 min)**

**8. Testa och registrera på Klarna!**

---

## ✅ Lösning 3: Använd SendGrid Inbound Parse

SendGrid kan även **TA EMOT** mejl, inte bara skicka!

### Setup:

**1. Logga in på SendGrid Dashboard**

**2. Gå till Settings → Inbound Parse**

**3. Klicka "Add Host & URL"**

**4. Konfigurera:**
```
Subdomain: mail
Domain: celestial.se
Destination URL: https://ditt-server.com/inbound (behöver webhook)
```

**5. SendGrid ger dig MX-records:**
```
MX Record:
Priority: 10
Host: mail.celestial.se
Value: mx.sendgrid.net
```

**6. Lägg till i DNS**

**Problem:** Behöver en webhook-server för att ta emot mejlen → mer komplicerat

**Rekommendation:** Använd ImprovMX eller domänleverantörens forwarding istället

---

## ✅ Lösning 4: Gratis Google Workspace Trial

**1. Gå till:** https://workspace.google.com

**2. Starta 14 dagars gratis trial**

**3. Verifiera celestial.se med Google**

**4. Skapa lasse@celestial.se i Google Workspace**

**5. Nu har du en RIKTIG mailbox på celestial.se!**

**6. Använd för Klarna-registrering**

**Problem:**
- Kostar pengar efter 14 dagar (~6 USD/månad)
- Men bra om du vill ha proffsig företagsmejl permanent!

---

## 🚀 Snabbaste lösningen JUST NU

### Om din domänleverantör erbjuder email forwarding:

```bash
1. Logga in hos domänleverantören
2. Hitta "Email" eller "Email forwarding"
3. Skapa: lasse@celestial.se → lasse.l.karagiannis@gmail.com
4. Vänta 10 minuter
5. Registrera på Klarna!
```

**Total tid:** ~15 minuter

---

## 📋 Vilken domänleverantör har du?

**Vanliga svenska:**
- **Loopia:** Har email forwarding (gratis)
- **One.com:** Har email forwarding (gratis)
- **Binero:** Har email forwarding (gratis)
- **GoDaddy:** Har email forwarding (gratis)
- **Namecheap:** Har email forwarding (gratis)

**Om du inte vet:**
1. Kör detta kommando för att se var celestial.se är registrerad:
```bash
whois celestial.se
```

---

## 🎯 Rekommendation för dig

**JUST NU (snabbast):**
1. Sätt upp email forwarding hos din domänleverantör
2. Testa att det fungerar
3. Registrera på Klarna Kosma

**LÅNGSIKTIGT (bäst för företag):**
- Google Workspace (proffsig företagsmejl)
- Kostar ~60 kr/månad
- Ger dig lasse@celestial.se med full mailbox
- Bra för LIA och framtida företagande!

---

## 📧 Kan du använda SendGrid för att TA EMOT mejl?

**Kort svar:** JA, men komplicerat (behöver webhook-server)

**Enkelt svar:** NEJ, använd email forwarding istället

**SendGrid är bäst för:**
- ✅ SKICKA automatiska mejl (bekräftelser, påminnelser, etc.)
- ❌ INTE för att hantera vanlig inbox

---

## 🔍 Nästa steg

1. **Kolla vilken domänleverantör du har för celestial.se**
2. **Sätt upp email forwarding (5-10 minuter)**
3. **Testa att forwarding fungerar**
4. **Registrera på Klarna Kosma med lasse@celestial.se**
5. **Profit!** 🎉

---

Vill du ha hjälp med någon specifik lösning? Säg till vilken domänleverantör du har så guidar jag dig steg-för-steg! 😊
