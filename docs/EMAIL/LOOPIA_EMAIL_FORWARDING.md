# Email Forwarding via Loopia - Steg för Steg

## 🎯 Mål
Sätt upp email forwarding så att mejl till `lasse@celestial.se` automatiskt skickas vidare till `lasse.l.karagiannis@gmail.com`

---

## 📋 Steg-för-steg guide

### Steg 1: Logga in på Loopia

**1. Gå till:** https://customerzone.loopia.se/

**2. Logga in med:**
   - Kundnummer eller användarnamn
   - Lösenord

---

### Steg 2: Hitta din domän

**1. När du är inloggad, klicka på:**
   - "Domäner" i menyn
   - Eller "Mina tjänster" → "Domäner"

**2. Välj:** `celestial.se`

---

### Steg 3: Aktivera email forwarding

**1. Klicka på:** "E-post" eller "E-posttjänster"

**2. Du ser två alternativ:**

#### Alternativ A: **Email Forwarding** (ENKLAST - välj detta!)
   - Klicka på "Vidarekoppling" eller "Email Forwarding"
   - Detta är GRATIS och tar 5 minuter

#### Alternativ B: **Email-paket** (kostar pengar)
   - Fullt email-konto med webmail
   - Kostar ~20-40 kr/månad per adress
   - INTE nödvändigt just nu

**3. Välj "Email Forwarding" / "Vidarekoppling"**

---

### Steg 4: Skapa forwarding-regel

**1. Klicka på:** "Lägg till vidarekoppling" eller "Ny vidarekoppling"

**2. Fyll i formuläret:**

```
╔══════════════════════════════════════════════╗
║  Skapa email-vidarekoppling                  ║
╠══════════════════════════════════════════════╣
║                                              ║
║  E-postadress att vidarekoppla:              ║
║  ┌────────────────────────────────────────┐ ║
║  │ lasse@celestial.se                     │ ║
║  └────────────────────────────────────────┘ ║
║                                              ║
║  Vidarekoppla till:                          ║
║  ┌────────────────────────────────────────┐ ║
║  │ lasse.l.karagiannis@gmail.com          │ ║
║  └────────────────────────────────────────┘ ║
║                                              ║
║  [✓] Aktivera vidarekoppling                ║
║                                              ║
║  [ Spara ]                                   ║
╚══════════════════════════════════════════════╝
```

**3. Klicka på "Spara" eller "Skapa"**

---

### Steg 5: Vänta på aktivering

**Aktiveringen tar vanligtvis:**
- ⏱️ 5-15 minuter (oftast)
- ⏱️ Max 30-60 minuter (ibland)

**Du kan se status:**
- Aktiv: ✅ Grön markering eller "Aktiv"
- Väntar: ⏳ "Aktiveras..." eller "Pending"

---

### Steg 6: Testa att forwarding fungerar

**1. Öppna din Gmail:** (lasse.l.karagiannis@gmail.com)

**2. Skicka ett testmejl TILL:** `lasse@celestial.se`
   - Skriv ämne: "Test forwarding"
   - Skicka

**3. Vänta 1-2 minuter**

**4. Kontrollera din Gmail inbox:**
   - Du bör få mejlet tillbaka!
   - Observera att "Till:" står lasse@celestial.se
   - Men det kom till din Gmail ✅

**Om det INTE fungerar efter 30 min:**
   - Kolla Spam-mappen i Gmail
   - Kontrollera Loopias status-sida
   - Kolla att du stavat rätt i Loopia-inställningarna

---

### Steg 7: Registrera på Klarna Kosma

**När forwarding fungerar:**

**1. Gå till:** https://www.klarnakosma.com (eller registreringslänken du har)

**2. Registrera dig med:**
```
E-post: lasse@celestial.se  ✅ (företagsmejl!)
Namn: Lasse Karagiannis
Företag: Celestial / Onboarding App
```

**3. Klicka "Registrera" eller "Sign up"**

**4. Bekräftelsemejlet skickas till lasse@celestial.se**
   → Forwarding vidarebefordrar det automatiskt till din Gmail!

**5. Öppna mejlet i Gmail och klicka på bekräftelselänken**

**6. Klart! Du är nu registrerad med företagsmejl! 🎉**

---

## 💡 Extra tips för Loopia

### Skapa fler forwardings (valfritt):

Du kan skapa flera forwarding-regler kostnadsfritt:

```
info@celestial.se     → lasse.l.karagiannis@gmail.com
support@celestial.se  → lasse.l.karagiannis@gmail.com
kontakt@celestial.se  → lasse.l.karagiannis@gmail.com
hello@celestial.se    → lasse.l.karagiannis@gmail.com
```

**Användningsfall:**
- Olika mejl för olika tjänster (Klarna, Skatteverket, etc.)
- Ser mer proffsigt ut
- Kostar ingenting extra!

---

### Catch-all forwarding (alla adresser):

Loopia kan även erbjuda "catch-all" som fångar ALLA mejl till domänen:

```
*@celestial.se → lasse.l.karagiannis@gmail.com
```

**Fördel:**
- Du behöver inte skapa varje adress manuellt
- Allt går till din Gmail automatiskt

**Nackdel:**
- Får mer spam (eftersom alla adresser funkar)

---

## 🔐 Skicka mejl som lasse@celestial.se från Gmail

**Bonus: Du kan svara från lasse@celestial.se i Gmail!**

### Setup i Gmail:

**1. Öppna Gmail (lasse.l.karagiannis@gmail.com)**

**2. Gå till Inställningar (kugghjul) → "Se alla inställningar"**

**3. Klicka på fliken "Konton och import"**

**4. Under "Skicka e-post som:" klicka "Lägg till en annan e-postadress"**

**5. Fyll i:**
```
Namn: Lasse Karagiannis
E-postadress: lasse@celestial.se
[✓] Behandla som ett alias
```

**6. Klicka "Nästa steg"**

**7. Välj "Skicka via SMTP-servrar":**
```
SMTP-server: smtp.sendgrid.net
Port: 587
Användarnamn: apikey
Lösenord: [DIN SENDGRID API KEY från sendgrid.ini]

[✓] Säker anslutning med TLS
```

**8. Gmail skickar verifieringsmejl till lasse@celestial.se**
   → Forwarding skickar det till din Gmail!
   → Klicka på länken för att verifiera

**9. Nu kan du:**
   - Skicka mejl FRÅN lasse@celestial.se (via SendGrid)
   - Ta emot mejl TILL lasse@celestial.se (via Loopia forwarding)
   - Allt i samma Gmail-inbox! 🎉

---

## 📊 Kostnad

**Loopia Email Forwarding:**
- ✅ **GRATIS** (ingår med domänen)
- Obegränsat antal forwardings
- Ingen extra kostnad

**SendGrid (du har redan):**
- ✅ **GRATIS** upp till 100 mejl/dag
- Används för att SKICKA från lasse@celestial.se

**Total kostnad:**
- **0 kr/månad** 🎉

---

## ⚠️ Vanliga problem och lösningar

### Problem 1: "Forwarding fungerar inte efter 30 min"

**Lösningar:**
1. Kontrollera att du stavat rätt i Loopia
2. Kolla Gmail Spam-mappen
3. Logga in på Loopia igen och kontrollera status
4. Prova att ta bort och skapa om forwarding-regeln
5. Kontakta Loopia support: support@loopia.se

---

### Problem 2: "Klarna accepterar inte lasse@celestial.se"

**Möjliga orsaker:**
1. De kräver specifik domän (t.ex. @företag.com)
2. De har blocklist för vissa domäner

**Lösning:**
- Kontakta Klarna Kosma support
- Förklara att du är enskild firma med egen domän
- De bör acceptera det!

---

### Problem 3: "Får bekräftelsemejl men länken funkar inte"

**Lösningar:**
1. Kontrollera att länken inte klipptes av i forwarding
2. Kopiera hela länken manuellt
3. Prova i inkognitoläge / annan webbläsare
4. Kontakta Klarna support

---

## 🎯 Checklista

- [ ] Loggat in på Loopia
- [ ] Skapat email forwarding: lasse@celestial.se → Gmail
- [ ] Väntat 15-30 minuter på aktivering
- [ ] Testat med test-mejl (skickat från Gmail till lasse@celestial.se)
- [ ] Fått test-mejlet i Gmail inbox ✅
- [ ] Registrerat på Klarna Kosma med lasse@celestial.se
- [ ] Fått bekräftelsemejl i Gmail (via forwarding)
- [ ] Klickat på bekräftelselänk
- [ ] Framgångsrikt registrerad! 🎉

---

## 📞 Support

**Loopia Support:**
- **E-post:** support@loopia.se
- **Telefon:** 0771-45 84 00
- **Chatt:** Via Loopias hemsida (kundzon)
- **Svarstid:** Oftast samma dag

**Klarna Kosma Support:**
- Kolla deras hemsida för kontaktuppgifter
- Vanligtvis support-formulär eller chatt

---

## 🚀 Nästa steg efter registrering

När du är registrerad på Klarna Kosma:

1. **Utforska deras API-dokumentation**
2. **Kolla pricing och villkor**
3. **Se om de har test-miljö**
4. **Jämför med Bolagsverket/Skatteverket**
5. **Beslut: Behöver vi Klarna eller räcker våra andra API:er?**

---

**Lycka till! Du fixar detta! 💪**

Om du stöter på problem, hojta till så hjälper jag dig troubleshoota! 😊
