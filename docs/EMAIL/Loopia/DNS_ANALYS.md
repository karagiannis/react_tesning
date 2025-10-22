# DNS-analys för celestial.se (Loopia)

## 📊 Jämförelse: Före och Efter SendGrid-setup

---

## 🔴 FÖRE SendGrid (celestial-se_OLD.txt)

```dns
$ORIGIN celestial.se.
$TTL 300

@ SOA ns1.loopia.se. registry.loopia.se. (1758828481 ...)
@               IN  3600  NS  ns1.loopia.se.
@               IN  3600  NS  ns2.loopia.se.
@               IN  3600  A   46.101.221.97      ← Digital Ocean Droplet
*               IN  3600  A   46.101.221.97      ← Wildcard → Droplet
www             IN  3600  A   46.101.221.97      ← www → Droplet
```

**Förklaring:**
- **SOA Record:** Start of Authority - grundläggande DNS-info
- **NS Records:** Name servers (Loopias DNS-servrar)
- **@ A Record:** Root-domänen (celestial.se) → pekar på Digital Ocean IP
- **\* A Record:** Wildcard - ALLA subdomäner → pekar på Digital Ocean IP
- **www A Record:** www.celestial.se → pekar på Digital Ocean IP

**Resultat:**
- ✅ celestial.se → 46.101.221.97 (din Droplet)
- ✅ www.celestial.se → 46.101.221.97 (din Droplet)
- ✅ vadsomhelst.celestial.se → 46.101.221.97 (tack vare wildcard \*)

---

## 🟢 EFTER SendGrid-setup (celestial-se.txt)

```dns
$ORIGIN celestial.se.
$TTL 300

@ SOA ns1.loopia.se. registry.loopia.se. (1760572800 ...)
@               IN  3600  NS  ns1.loopia.se.
@               IN  3600  NS  ns2.loopia.se.
@               IN  3600  A   46.101.221.97      ← SAMMA (Digital Ocean)
*               IN  3600  A   46.101.221.97      ← SAMMA (Wildcard)
www             IN  3600  A   46.101.221.97      ← SAMMA (www)

--- NYA RECORDS FÖR SENDGRID: ---

56687795        IN  3600  CNAME  sendgrid.net.                              ← Domain verification
_dmarc          IN  3600  TXT    v=DMARC1; p=none;                          ← Email authentication
em1040          IN  3600  CNAME  u56687795.wl046.sendgrid.net.              ← Email links tracking
s1._domainkey   IN  3600  CNAME  s1.domainkey.u56687795.wl046.sendgrid.net. ← DKIM signature 1
s2._domainkey   IN  3600  CNAME  s2.domainkey.u56687795.wl046.sendgrid.net. ← DKIM signature 2
url2891         IN  3600  CNAME  sendgrid.net.                              ← Link branding
```

**Nyckeln: INGET har ändrats för Digital Ocean!**
- ✅ celestial.se → fortfarande din Droplet
- ✅ www.celestial.se → fortfarande din Droplet
- ✅ \*.celestial.se → fortfarande din Droplet

**Vad har LAGTS TILL:**
- SendGrid-specifika records för email-funktionalitet

---

## 🔍 Detaljerad förklaring av SendGrid-records

### 1. **56687795 CNAME → sendgrid.net**
```
Record: 56687795.celestial.se
Typ: CNAME
Värde: sendgrid.net.
```
**Syfte:** Domain verification - bevisar att du äger celestial.se
**Används av:** SendGrid för att verifiera ägarskap
**URL:** http://56687795.celestial.se → omdirigerar till SendGrid

---

### 2. **_dmarc TXT → v=DMARC1; p=none;**
```
Record: _dmarc.celestial.se
Typ: TXT
Värde: v=DMARC1; p=none;
```
**Syfte:** DMARC (Domain-based Message Authentication, Reporting & Conformance)
**Funktion:** 
- Skyddar mot email-spoofing
- Säger åt mottagare vad de ska göra med mejl som misslyckas SPF/DKIM
- `p=none` = gör ingenting, bara rapportera

**Bättre värden i framtiden:**
- `p=quarantine` = skicka till spam om misslyckat
- `p=reject` = neka helt om misslyckat

**Läs mer:** https://dmarc.org/

---

### 3. **em1040 CNAME → u56687795.wl046.sendgrid.net**
```
Record: em1040.celestial.se
Typ: CNAME
Värde: u56687795.wl046.sendgrid.net.
```
**Syfte:** Email link branding
**Funktion:**
- Länkar i dina mejl blir: http://em1040.celestial.se/... istället för http://sendgrid.net/...
- Ser mer professionellt ut
- Ökar trust/förtroende hos mottagare
- Minskar spam-risk

---

### 4. **s1._domainkey CNAME → s1.domainkey.u56687795.wl046.sendgrid.net**
### 5. **s2._domainkey CNAME → s2.domainkey.u56687795.wl046.sendgrid.net**
```
Record: s1._domainkey.celestial.se
        s2._domainkey.celestial.se
Typ: CNAME
Värde: SendGrid DKIM servers
```
**Syfte:** DKIM (DomainKeys Identified Mail) - Email signature
**Funktion:**
- Kryptografisk signatur på varje mejl
- Bevisar att mejlet verkligen kommer från celestial.se
- Mottagande server verifierar signaturen
- Minskar spam-klassificering KRAFTIGT

**Två nycklar (s1 och s2):**
- Redundans
- Key rotation för ökad säkerhet

**Läs mer:** https://www.dkim.org/

---

### 6. **url2891 CNAME → sendgrid.net**
```
Record: url2891.celestial.se
Typ: CNAME
Värde: sendgrid.net.
```
**Syfte:** Link tracking branding
**Funktion:**
- Spårbara länkar i mejl
- Analytics: vem klickade på vilka länkar
- Använder celestial.se istället för sendgrid.net
- Ökar profesionalism

---

## 📧 Vad SAKNAS för email forwarding?

**DU HAR INTE MX-RECORDS!**

```dns
--- SAKNAS: ---
@  IN  3600  MX  10  mail.celestial.se.
```

**Detta betyder:**
- ❌ Du kan INTE ta emot mejl på celestial.se ännu
- ✅ Du kan SKICKA mejl från lasse@celestial.se (via SendGrid)
- ❌ Men du kan inte TA EMOT mejl till lasse@celestial.se

**Lösning 1: Email forwarding (ENKLAST)**

Lägg till i Loopia:
- Gå till "E-post" → "Vidarekoppling"
- Skapa forwarding: lasse@celestial.se → lasse.l.karagiannis@gmail.com
- Loopia lägger till nödvändiga MX-records automatiskt

**Lösning 2: ImprovMX (Gratis email forwarding service)**

Lägg till dessa MX-records manuellt:
```dns
@  IN  3600  MX  10  mx1.improvmx.com.
@  IN  3600  MX  20  mx2.improvmx.com.
```
Sedan skapa alias på ImprovMX.com

**Lösning 3: SendGrid Inbound Parse**

Lägg till MX-record:
```dns
mail  IN  3600  MX  10  mx.sendgrid.net.
```
Kräver webhook-server för att ta emot mejl (komplicerat)

---

## 🎯 Din nuvarande setup

### ✅ **Fungerar:**
1. **Webbsida:** celestial.se → Digital Ocean Droplet (46.101.221.97)
2. **www:** www.celestial.se → Digital Ocean Droplet
3. **Subdomäner:** \*.celestial.se → Digital Ocean Droplet (wildcard)
4. **Skicka mejl:** lasse@celestial.se kan SKICKA (via SendGrid)
5. **Email auth:** DKIM + DMARC konfigurerat ✅
6. **Link branding:** Länkar i mejl ser proffsiga ut ✅

### ❌ **Fungerar INTE (ännu):**
1. **Ta emot mejl:** lasse@celestial.se kan INTE ta emot mejl
   - **Lösning:** Sätt upp email forwarding i Loopia (se min guide!)

---

## 🔧 Rekommenderade nästa steg

### Steg 1: Sätt upp email forwarding i Loopia

**Enklast:**
1. Logga in på Loopia
2. Välj celestial.se → E-post → Vidarekoppling
3. Skapa: lasse@celestial.se → lasse.l.karagiannis@gmail.com
4. Vänta 15 min
5. Testa!

**Då får du:**
- ✅ SKICKA från lasse@celestial.se (SendGrid)
- ✅ TA EMOT på lasse@celestial.se (Loopia forwarding → Gmail)
- = Komplett email-lösning! 🎉

---

### Steg 2: Förbättra DMARC-policy (i framtiden)

**När allt fungerar, uppgradera DMARC:**

**Nuvarande:**
```dns
_dmarc  IN  3600  TXT  v=DMARC1; p=none;
```

**Bättre (om några veckor):**
```dns
_dmarc  IN  3600  TXT  v=DMARC1; p=quarantine; rua=mailto:dmarc@celestial.se
```

**Bäst (efter någon månad):**
```dns
_dmarc  IN  3600  TXT  v=DMARC1; p=reject; rua=mailto:dmarc@celestial.se; pct=100
```

**Förklaring:**
- `p=none` → Gör ingenting, bara övervaka (nuvarande)
- `p=quarantine` → Skicka till spam om misslyckat DKIM/SPF
- `p=reject` → Neka helt om misslyckat DKIM/SPF
- `rua=mailto:...` → Skicka rapporter hit

**Varför gradvis?**
- Se till att allt fungerar först
- Undvik att blockera legitima mejl
- Samla rapporter och justera

---

### Steg 3: Lägg till SPF-record (om inte Loopia gör det automatiskt)

**SPF = Sender Policy Framework**

```dns
@  IN  3600  TXT  v=spf1 include:sendgrid.net ~all
```

**Förklaring:**
- `v=spf1` → SPF version 1
- `include:sendgrid.net` → SendGrid får skicka för vår domän
- `~all` → Soft fail för andra (markera som spam)
- `+all` → Tillåt alla (DÅLIGT, använd INTE)
- `-all` → Hard fail för andra (strikt, kan blockera legitima mejl)

**Kolla om du redan har SPF:**
```bash
dig celestial.se TXT
```

---

## 📊 Sammanfattning

| Funktion | Status | Lösning |
|----------|--------|---------|
| **Webbsida** | ✅ Fungerar | Digital Ocean Droplet (46.101.221.97) |
| **Skicka mejl** | ✅ Fungerar | SendGrid + DKIM + DMARC konfigurerat |
| **Ta emot mejl** | ❌ Saknas | Sätt upp email forwarding i Loopia |
| **Email auth** | ✅ Fungerar | DKIM (s1, s2), DMARC (p=none) |
| **Link branding** | ✅ Fungerar | em1040, url2891 → SendGrid |
| **SPF** | ❓ Okänt | Kontrollera med `dig celestial.se TXT` |

---

## 🎯 Slutsats

**Dina DNS-inställningar är BRA! ✅**

**Vad Qwen/du gjorde rätt:**
1. ✅ Bevarade Digital Ocean-pekarna (A-records)
2. ✅ Lade till SendGrid-records korrekt
3. ✅ DKIM konfigurerat (två nycklar)
4. ✅ DMARC aktiverat (konservativ policy)
5. ✅ Link branding uppsatt

**Vad som saknas:**
1. Email forwarding för att TA EMOT mejl
   - **Lösning:** Sätt upp i Loopia (5 minuter)
2. Eventuellt SPF-record (kan Loopia ha lagt till automatiskt)
   - **Kontrollera:** `dig celestial.se TXT`

**Nästa steg:**
1. Sätt upp email forwarding i Loopia (se min guide!)
2. Testa att skicka + ta emot mejl
3. Registrera på Klarna Kosma med lasse@celestial.se
4. Profit! 🎉

---

Allt ser bra ut! Du är 95% klar - bara email forwarding kvar! 💪
