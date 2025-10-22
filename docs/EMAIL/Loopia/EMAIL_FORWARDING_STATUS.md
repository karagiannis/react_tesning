# Email Forwarding Setup - Status

## ✅ Genomfört: 2025-10-20

### Email forwarding konfigurerat i Loopia:
```
Från: lasse@celestial.se
Till: lasse.l.karagiannis@gmail.com
Status: Aktiveras... (väntar på Loopia)
```

---

## ⏱️ Väntetid:
- **Normalt:** 5-15 minuter
- **Max:** 30-60 minuter
- **Loopia DNS-propagering:** Kan ta upp till 1 timme

---

## 🧪 Test när forwarding är aktivt:

### Steg 1: Testa forwarding
```bash
# Från din Gmail (lasse.l.karagiannis@gmail.com)
# Skicka mejl TILL: lasse@celestial.se
# Ämne: "Test forwarding"
# Meddelande: "Fungerar det?"
```

### Steg 2: Vänta 1-2 minuter

### Steg 3: Kolla Gmail
- ✅ **Inbox** (bästa scenariot)
- ⚠️ **SPAM** (vanligt första gången - markera "Inte spam")
- ❌ **Inget mejl** (vänta längre, kan ta 30 min)

---

## 📧 Klarna Kosma Registrering

### När forwarding fungerar:

**1. Gå till Klarna Kosma registrering**

**2. Använd:**
```
E-post: lasse@celestial.se  ✅ (företagsmejl!)
Företag: Celestial / Onboarding App
Namn: Lasse Karagiannis
```

**3. Registrera dig**

**4. Klarna skickar bekräftelsemejl till lasse@celestial.se**

**5. Forwarding skickar det vidare till din Gmail!**

**6. Kolla BÅDE:**
- Gmail Inbox
- Gmail SPAM (viktigt!)

**7. Klicka på bekräftelselänken**

**8. Klart! Du är registrerad! 🎉**

---

## ⚠️ Om bekräftelsemejl hamnar i SPAM:

### Skapa Gmail-filter för framtiden:

**1. I Gmail:** Kugghjul → Inställningar → Filter och blockerade adresser

**2. Skapa nytt filter:**
```
Till: lasse@celestial.se
ELLER
Från: *@klarna.com
ELLER  
Från: *@klarnakosma.com
```

**3. Välj åtgärd:**
- [✓] Hamna aldrig i skräppost
- [✓] Alltid markera som viktig

**4. Spara filter**

Nu hamnar Klarna-mejl alltid i inbox! ✅

---

## 📊 Förväntad tidslinje:

```
Nu (14:00):     Email forwarding skapat i Loopia
↓ 15-30 min
14:30:          Forwarding aktivt
↓ 2 min (test)
14:32:          Test-mejl bekräftat fungerande
↓ 5 min
14:37:          Registrering på Klarna Kosma
↓ 1-2 min
14:39:          Bekräftelsemejl från Klarna i Gmail
↓ 1 min
14:40:          Klickat på länk, verifierad!
↓
KLAR! 🎉
```

**Total tid:** ~40-60 minuter från nu

---

## 🎯 Checklista:

- [✓] Email forwarding skapat i Loopia
- [ ] Väntat 15-30 min på aktivering
- [ ] Testat med test-mejl från Gmail → lasse@celestial.se
- [ ] Fått test-mejlet tillbaka i Gmail (inbox eller spam)
- [ ] Registrerat på Klarna Kosma med lasse@celestial.se
- [ ] Fått bekräftelsemejl i Gmail
- [ ] Klickat på bekräftelselänk
- [ ] Utforskat Klarna Kosma API-dokumentation
- [ ] Utvärderat om Klarna behövs för projektet

---

## 🔍 Felsökning om det inte fungerar:

### Problem: "Inget test-mejl efter 30 min"

**Lösningar:**
1. Kolla Gmail SPAM noga
2. Kolla Gmail "Alla mail" (kan hamna i fel kategori)
3. Logga in på Loopia igen och kontrollera status på forwarding
4. Vänta ytterligare 30 min (DNS kan ta tid)
5. Ta bort och skapa om forwarding-regeln
6. Kontakta Loopia support: support@loopia.se

---

### Problem: "Klarna accepterar inte lasse@celestial.se"

**Lösningar:**
1. Kontrollera att du skrev rätt (inga mellanslag, rätt @ etc.)
2. Prova att registrera i inkognitoläge / annan webbläsare
3. Kolla om Klarna kräver specifikt domänformat
4. Kontakta Klarna support och förklara situationen

---

### Problem: "Bekräftelsemejl kommer inte från Klarna"

**Lösningar:**
1. Vänta 10 minuter (kan ta lite tid)
2. Kolla Gmail SPAM
3. Kolla Gmail "Kampanjer" eller "Socialt" (kan hamna där)
4. Kolla "Alla mail" i Gmail
5. Logga in på Klarna och begär nytt bekräftelsemejl
6. Kontakta Klarna support

---

## 💡 Tips medan du väntar:

### Utforska Klarna Kosma:

**1. Läs om deras API:**
   - Kolla vilka endpoints de har
   - Vad kostar det?
   - Vilka länder/banker stöds?
   - Behöver du Open Banking för ditt projekt?

**2. Jämför med dina andra API:er:**
```
Bolagsverket:  ✅ Företagsdata (GRATIS, funkar)
Skatteverket:  🔄 Skattekonto (GRATIS, väntar på Lena)
Bankgirot:     ⏳ Bankgironummer (???, väntar på Simon)
Klarna Kosma:  🆕 Open Banking (??, utvärderar nu)
```

**3. Fundera:**
   - Behöver vi verkligen Klarna för onboarding-appen?
   - Eller räcker Bolagsverket + Skatteverket?
   - Vad tillför Open Banking?

---

## 📚 Användbara länkar:

**Loopia:**
- Support: support@loopia.se
- Telefon: 0771-45 84 00
- Kundzon: https://customerzone.loopia.se/

**Gmail:**
- Webmail: https://mail.google.com
- Inställningar: Kugghjul → Se alla inställningar

**Klarna Kosma:**
- Hemsida: https://www.klarnakosma.com (eller vad du har)
- Support: Kolla deras hemsida

---

## 🎉 När allt fungerar:

**Du har då:**
- ✅ Professionell företagsmejl (lasse@celestial.se)
- ✅ Kan SKICKA från celestial.se (SendGrid)
- ✅ Kan TA EMOT på celestial.se (Loopia → Gmail)
- ✅ Registrerad på Klarna Kosma med företagsmejl
- ✅ Ser proffsig ut för alla tjänster! 💼

**Grattis! Du är en riktig företagare nu! 😎**

---

## 📞 Hör av dig när:

- ✅ Forwarding fungerar (test-mejl motaget)
- ✅ Klarna-registrering lyckad
- ⚠️ Problem uppstår
- 🤔 Frågor om nästa steg

**Lycka till! Du fixar detta! 💪🎉**
