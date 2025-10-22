# VIKTIGT: Loopia Email Forwarding Varning

## ⚠️ Vad Loopia säger:

> "På grund av Googles, Microsofts och Yahoos spamfilterregler rekommenderar vi inte att du vidarebefordrar mail till en @gmail-, @outlook-, @hotmail.com- eller @yahoo.com-adress."

---

## 🤔 Vad betyder detta?

### Problemet:
Gmail, Outlook och Yahoo har strängare SPAM-filter sedan 2024 som **kan blockera vidarebefordrad e-post**.

**Varför?**
- Forwarding kan bryta SPF/DKIM-verifiering
- Gmail ser att mejlet kommer från "celestial.se" men servern är Loopias
- Detta ser ut som spoofing/förfalskning
- Resultat: Mejl hamnar i spam eller blockeras helt

---

## 🎯 Dina alternativ:

### Alternativ 1: ⚠️ Försök ändå (RISK för spam)

**Klicka på:**
> "Skapa ett e-postalias för att vidarebefordra mail till en annan e-postadress"

**Konfigurera:**
```
Från: lasse@celestial.se
Till: lasse.l.karagiannis@gmail.com
```

**Fördelar:**
- ✅ Snabbt (5 minuter)
- ✅ Gratis
- ✅ Enkelt

**Nackdelar:**
- ⚠️ Mejl kan hamna i Gmail SPAM
- ⚠️ Mejl kan blockeras helt
- ⚠️ Osäkert om Klarna-bekräftelse kommer fram

**Rekommendation:** Prova detta först, men var beredd på att mejl hamnar i spam!

---

### Alternativ 2: ✅ ImprovMX (Gratis, bättre än Loopia forwarding)

ImprovMX är specialiserade på email forwarding och hanterar SPF/DKIM bättre!

**Setup:**

**1. Gå till:** https://improvmx.com

**2. Skapa gratis konto**

**3. Lägg till domän:** celestial.se

**4. ImprovMX ger dig MX-records:**
```dns
MX  10  mx1.improvmx.com.
MX  20  mx2.improvmx.com.
```

**5. Lägg till dessa i Loopia DNS:**
   - Loopia → celestial.se → DNS-inställningar
   - Lägg till båda MX-records

**6. Skapa alias på ImprovMX:**
```
lasse@celestial.se → lasse.l.karagiannis@gmail.com
```

**Fördelar:**
- ✅ Bättre hantering av SPF/DKIM
- ✅ Mindre risk för spam-klassificering
- ✅ Gratis
- ✅ Fler funktioner (wildcard, catch-all)

**Nackdelar:**
- ⏱️ Tar lite längre tid (15-20 min)
- 🔧 Kräver DNS-ändringar

---

### Alternativ 3: 🏆 Google Workspace (BÄST, men kostar)

**Den mest professionella lösningen!**

**Setup:**

**1. Gå till:** https://workspace.google.com

**2. Starta 14 dagars gratis trial**

**3. Konfigurera celestial.se**

**4. Skapa lasse@celestial.se**

**Nu har du:**
- ✅ RIKTIG Gmail-inkorg för lasse@celestial.se
- ✅ Webmail (gmail.com interface)
- ✅ SMTP/IMAP för mail-klienter
- ✅ Inget spam-problem
- ✅ Proffsigt företagsmejl
- ✅ Google Drive, Calendar, Meet osv.

**Kostnad:**
- 🎁 **14 dagar GRATIS trial**
- 💰 Därefter ~60 kr/månad (Business Starter)

**Fördelar:**
- ✅ Perfekt för Klarna-registrering
- ✅ Bra för framtida företagande
- ✅ Ser professionellt ut
- ✅ Inga spam-problem
- ✅ Full email-funktionalitet

**Nackdelar:**
- 💰 Kostar pengar efter trial

---

### Alternativ 4: 💸 Loopia Email-paket (fullständig mailbox)

**Istället för forwarding, köp ett mailbox:**

**Loopia erbjuder:**
- Email-paket från ~20-40 kr/månad
- Fullständig mailbox för lasse@celestial.se
- Webmail-access
- SMTP/IMAP

**Klicka på:**
> "Skapa en e-postadress" (den som säger "Uppgradering krävs")

**Fördelar:**
- ✅ Ingen forwarding = inga spam-problem
- ✅ Svensk leverantör
- ✅ Billigare än Google Workspace
- ✅ Enkel integration med Loopia

**Nackdelar:**
- 💰 Kostar pengar
- 📧 Ännu en mailbox att kolla
- 🔧 Mindre funktioner än Google Workspace

---

## 🎯 Min rekommendation för DIG:

### För JUST NU (Klarna-registrering):

**Prova Loopia Forwarding först:**
1. Klicka "Skapa e-postalias"
2. Konfigurera: lasse@celestial.se → Gmail
3. **VIKTIG:** Kolla Gmail SPAM-mapp noga!
4. Registrera på Klarna
5. Om bekräftelsemejl hamnar i spam - flytta till inbox och markera "Inte spam"

**Om det inte fungerar → Använd ImprovMX**

---

### För FRAMTIDEN (långsiktig lösning):

**Google Workspace 14-dagars trial:**
- Perfekt timing för ditt LIA-projekt
- Prova under 14 dagar GRATIS
- Beslut om du vill fortsätta (60 kr/mån) senare
- Bra investering om du vill verka professionell

---

## 🚀 Steg-för-steg: Prova Loopia Forwarding först

### 1. Klicka på:
> "Skapa ett e-postalias för att vidarebefordra mail till en annan e-postadress"

### 2. Fyll i formuläret:
```
E-postadress: lasse
Domän: celestial.se
Vidarebefordra till: lasse.l.karagiannis@gmail.com
```

### 3. Spara och aktivera

### 4. Vänta 15 minuter på aktivering

### 5. TESTA med SPAM-medvetenhet:
```bash
# Skicka test-mejl från Gmail till lasse@celestial.se
```

### 6. Kolla BÅDA:
- ✅ Gmail Inbox
- ⚠️ Gmail SPAM (viktigt!)

### 7. Om mejlet är i SPAM:
- Markera som "Inte spam"
- Skapa filter i Gmail för att acceptera från celestial.se

---

## 📧 Gmail Filter för att undvika spam (om behövs)

**Om forwarding fungerar men hamnar i spam:**

**1. I Gmail, klicka på kugghjulet → Inställningar**

**2. Gå till "Filter och blockerade adresser"**

**3. Skapa nytt filter:**
```
Till: lasse@celestial.se
ELLER
Från: *@celestial.se
```

**4. Välj åtgärd:**
- [✓] Hamna aldrig i skräppost
- [✓] Alltid markera som viktig
- [✓] Kategorisera som: Primär

**5. Spara filter**

**Nu kommer alla mejl till/från celestial.se direkt till inbox!** ✅

---

## 🎯 Slutgiltigt råd:

### STEG 1: Testa Loopia forwarding (5 min)
- Snabbt och gratis
- Kolla spam-mappen noga
- Skapa Gmail-filter om behövs

### STEG 2: Om problem → ImprovMX (15 min)
- Bättre hantering av SPF/DKIM
- Fortfarande gratis

### STEG 3: Om fortfarande problem → Google Workspace trial (30 min)
- 14 dagar gratis
- Garanterat att fungera
- Proffsigaste lösningen

---

## ❓ Fråga till dig:

**Vad vill du göra?**

**A)** Testa Loopia forwarding nu (trots varning) - JAG GUIDAR DIG! ⚡
**B)** Hoppa över Loopia, gå direkt till ImprovMX
**C)** Gå direkt på Google Workspace trial (mest pålitligt)

**Säg till så guidar jag dig steg-för-steg för det du väljer!** 😊

---

**Min personliga rekommendation:**
Prova **A) Loopia forwarding** först - tar 5 minuter. Om bekräftelsemejlet från Klarna hamnar i spam är det inga problem - du hittar det där ändå! 👍

Om du planerar att använda lasse@celestial.se långsiktigt → Investera i **C) Google Workspace** (60 kr/mån efter trial). Det är värt det för ett proffsigt intryck! 💼
