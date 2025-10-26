# Beställning av SKARPT företagscertifikat från Expisoft

## 🔐 För Skatteverket Produktions-API

### Vad du ska beställa:
**Organisationslegitimation (företagscertifikat)**

### Leverantör:
**Expisoft AB**
- Webbplats: https://www.expisoft.se
- Produkt: Organisationscertifikat för e-tjänster

### Priser (uppskattning 2024):
- **Engångsavgift:** ~1000-1500 kr
- **Årlig avgift:** ~500-800 kr/år
- **Kortläsare:** ~300 kr (om du inte har)

### Information du behöver ange:

**Organisationsuppgifter:**
```
Organisationsnummer: [DITT PERSONNUMMER]
Företagsnamn: [DITT NAMN] (enskild firma)
Adress: [DIN ADRESS]
Postnummer: [DITT POSTNUMMER]
Ort: [DIN ORT]
```

**Kontaktperson:**
```
Namn: Lasse Karagiannis
E-post: lasse.l.karagiannis@gmail.com
Telefon: [DITT TELEFONNUMMER]
```

**Användningsområde:**
- Integration med Skatteverkets API:er
- Onboarding-system för redovisningsbyråer
- OAuth2 Client Credentials Grant (CCG)

### Certifikattyp:
**Server-/stämpellegitimation** (samma typ som testcertifikatet)

### Leveransformat:
- **.p12-fil** (PKCS#12)
- PIN-kod via separat brev

### Giltighetstid:
- Vanligtvis 1-3 år
- Välj kortare period först (1 år)

---

## 📝 Beställningsprocess:

1. **Gå till Expisoft:** https://www.expisoft.se/produkter/organisationscertifikat
2. **Välj produkt:** Organisationscertifikat för API-anslutning
3. **Fyll i uppgifter:** Ditt personnummer som org.nr
4. **Betala:** Kreditkort eller faktura
5. **Vänta på leverans:** 
   - Certifikat skickas via e-post
   - PIN-kod skickas via brev
6. **Installera:** Spara .p12-filen i `/Skatteverket/prod/`

---

## ⚠️ Viktigt att tänka på:

### Enskild firma med personnummer:
- ✅ Räcker för att beställa certifikat
- ✅ Ingen F-skatt krävs för test/utveckling
- ✅ Hobbyverksamhet är OK

### Om Skatteverket kräver registrerad firma:
1. Gå till Skatteverket.se
2. "Starta enskild firma"
3. Gratis att registrera
4. Får F-skatt automatiskt (kan begära befrielse om hobbyverksamhet)

---

## 🎯 Nästa steg efter beställning:

1. **Invänta leverans** (1-2 veckor)
2. **Spara certifikat säkert** i projektet
3. **Testa med Skatteverkets test-API** först
4. **Ansök om prod-nycklar** när certifikatet fungerar

---

## 💰 Total kostnad (uppskattning):

| Post | Kostnad |
|------|---------|
| Expisoft certifikat (1 år) | ~1500 kr |
| Kortläsare (om saknas) | ~300 kr |
| **TOTALT** | **~1800 kr** |

**Bolagsverket API:** GRATIS ✅
**Skatteverket API (test):** GRATIS ✅
**Skatteverket API (prod):** Kräver certifikat + avtal

---

## 📧 Kontakta Expisoft:

**E-post:** support@expisoft.se
**Telefon:** 08-446 47 00

**Frågor att ställa:**
1. "Jag behöver organisationscertifikat för Skatteverkets API:er"
2. "Mitt org.nr är mitt personnummer (enskild firma)"
3. "Vilken typ av certifikat behöver jag för OAuth2 CCG?"
4. "Vad kostar det för 1 år?"
5. "Hur lång leveranstid har ni?"
