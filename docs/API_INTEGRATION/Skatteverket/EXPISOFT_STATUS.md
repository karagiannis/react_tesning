# Expisoft - Produktionscertifikat för Skatteverket

**Uppdaterad:** 2025-10-20

---

## 📞 Kontaktstatus

### Samtal 2025-10-20
- **Tid:** Eftermiddag 2025-10-20
- **Kontakt:** Expisoft support
- **Telefon:** 08-446 47 00
- **Email:** support@expisoft.se
- **Status:** ⏳ Väntar på mejl med orderinformation

---

## 🎯 Syfte

### Beställa produktionscertifikat för Skatteverket API
- **Certifikattyp:** Organisationslegitimation för API-anslutning
- **Användning:** Skatteverket Prod-miljö
- **Nuvarande status:** Har test-certifikat, behöver prod-certifikat
- **Organisationsnummer:** Personnummer (enskild firma)

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

## 📋 Information som behövs för beställning

### Organisationsuppgifter:
- **Organisationsnummer:** Personnummer (enskild firma)
- **Företagsnamn:** Celestial
- **Kontaktperson:** Lasse Karagiannis
- **Email:** lasse@celestial.se
- **Telefon:** [ditt telefonnummer]
- **Leveransadress:** [din adress]

### Tekniska krav:
- **Syfte:** API-anslutning till Skatteverket
- **Miljö:** Produktion
- **Certifikatformat:** .p12 (PKCS#12)
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

## 🔄 Nästa steg efter certifikat mottas

### 1. Installera certifikat
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
