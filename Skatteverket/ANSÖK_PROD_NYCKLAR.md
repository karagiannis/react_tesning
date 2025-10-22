# Ansökan om SKARPA API-nycklar från Skatteverket

## 📋 Förberedelser innan ansökan

### ✅ Checklist:
- [ ] SKARPT företagscertifikat från Expisoft (beställt/levererat)
- [ ] Certifikatet testat mot test-API:et
- [ ] Läst och förstått avtalsvillkoren
- [ ] Bestämt vilka API:er du behöver

---

## 🎯 API:er att ansöka om

### 1. **Skattekonto API**
**Användning:** Hämta skattekonto-information för kunder

**Dokumentation:**
- https://skatteverket.se/omoss/samarbetspartners/digitalsamarbete/utvecklarportalen
- Sök efter "Skattekonto"

**Scope:** `skahmst` (huvudmans-saldo-och-transaktioner)

**Avtal:**
- Partnerskapsavtal krävs
- Ladda ner från API:ets sida på Utvecklarportalen

**Behörigheter som krävs:**
- Registreringsombud arbetsgivardeklaration (för organisationslegitimation)

---

### 2. **Ombudshantering API** (valfritt)
**Användning:** Kontrollera ombudsbehörigheter

**Dokumentation:**
- Sök på Utvecklarportalen efter "Ombudshantering"

**Användningsfall:**
- Verifiera att byrå har rätt fullmakter
- Kontrollera kundrelationer

---

## 📝 Ansökningsprocess

### Steg 1: Gå till Utvecklarportalen
```
https://skatteverket.se/omoss/samarbetspartners/digitalsamarbete/utvecklarportalen
```

### Steg 2: Logga in eller registrera dig
- Använd ditt personnummer
- Skapa konto om du inte har

### Steg 3: Välj API och klicka "Begär tillgång"

### Steg 4: Fyll i formuläret

**Uppgifter att fylla i:**

```
=== FÖRETAGSUPPGIFTER ===
Organisationsnummer: [DITT PERSONNUMMER]
Företagsnamn: [DITT NAMN] Enskild Firma
Kontaktperson: Lasse Karagiannis
E-post: lasse.l.karagiannis@gmail.com
Telefon: [DITT NUMMER]

=== APPLIKATION ===
Namn på applikation: Onboarding App
Applikations-ID: LasseKaragiannis_onboardingapp_1

Vill du återanvända API-nycklar? 
[X] Ja - om du redan har nycklar från test

Certifikat-subjekt:
Subject: CN=[DITT NAMN] + SERIALNUMBER=[DITT PERSONNUMMER], O=[DITT NAMN], C=SE

=== REDIRECT URI:er ===
(Om du använder CCG behövs inga redirect-URI:er)
Lämna tomt eller ange:
- https://localhost:3000/callback
- https://celestial.se/callback

=== ANVÄNDNINGSOMRÅDE ===
Beskrivning:
"Onboarding-system för redovisningsbyråer. Systemet hjälper byråer att 
uppfylla penningtvättslagens krav vid kundonboarding genom att automatiskt 
hämta och verifiera företagsdata från Bolagsverket och Skatteverket. 
Utvecklas som examensarbete på Yrkeshögskola (Iterum Education)."

=== AVTAL ===
[X] Jag har läst och godkänner avtalsvillkoren
```

### Steg 5: Ladda upp certifikat
- Om formuläret kräver certifikat
- Ladda upp din .p12-fil ELLER
- Ange certifikat-subject (CN, SERIALNUMBER)

### Steg 6: Signera avtalet
- Ladda ner avtalet
- Skriv under (digitalt med BankID eller utskrivet)
- Ladda upp signerat avtal

### Steg 7: Skicka in ansökan

---

## ⏳ Väntetid och leverans

### Handläggningstid:
- **Test-nycklar:** 1-3 arbetsdagar
- **Prod-nycklar:** 1-2 veckor (efter avtal klart)

### Leverans av prod-nycklar:
- **OAuth2 Client ID:** Skickas via e-post
- **OAuth2 Client Secret:** Skickas via SMS
- **APIgw nycklar:** Skickas tillsammans med OAuth2-nycklarna

### Kontakta Skatteverket om frågor:
- **E-post:** api@skatteverket.se
- **Telefon:** 0771-567 567

---

## 🔐 Säkerhet efter mottagande

### Spara nycklarna säkert:

1. **Skapa fil:**
```bash
cd /home/lasse/Documents/React/tic-tac-toe-app/Skatteverket
mkdir -p prod
touch prod/prod_credentials.txt
```

2. **Lägg in nycklar:**
```
OAuth2 Client ID: [från e-post]
OAuth2 Client Secret: [från SMS]
APIgw Client ID: [från e-post]
APIgw Client Secret: [från e-post]
```

3. **Säkra filen:**
```bash
chmod 600 prod/prod_credentials.txt
```

4. **Uppdatera .gitignore:**
Kontrollera att `Skatteverket/prod/` är ignorerad!

---

## 🧪 Testa prod-nycklar

### När du fått nycklarna:

1. **Uppdatera Python-skriptet:**
```python
# test_tax_prod.py
OAUTH2_CLIENT_ID = "[DITT PROD CLIENT ID]"
OAUTH2_CLIENT_SECRET = "[DITT PROD CLIENT SECRET]"
APIGW_CLIENT_ID = "[DITT PROD APIGW ID]"
APIGW_CLIENT_SECRET = "[DITT PROD APIGW SECRET]"
CERT_FILE_PATH = "prod/[DITT_CERT].p12"
CERT_PASSWORD = "[DIN PROD PIN-KOD]"

# VIKTIGT: Ändra till PROD-endpoint!
TOKEN_URL = "https://sysorgoauth2.skatteverket.se/oauth2/v1/sysorg/token"
BASE_URL = "https://api.skatteverket.se"
```

2. **Kör test:**
```bash
cd /home/lasse/Documents/React/tic-tac-toe-app/Skatteverket
python3 test_tax_prod.py
```

3. **Förväntat resultat:**
```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## 💡 Tips för framgångsrik ansökan

### Gör detta FÖRST:
1. ✅ Testa test-API:et grundligt
2. ✅ Dokumentera din användning
3. ✅ Ha ett tydligt användningsområde
4. ✅ Läs avtalet noga

### Undvik dessa misstag:
- ❌ Ansöka innan du testat
- ❌ Otydlig beskrivning av användning
- ❌ Glömma signera avtalet
- ❌ Felaktiga kontaktuppgifter

### Vid frågor:
- 📧 api@skatteverket.se är snabba att svara
- 📞 Ring om brått
- 💬 Var tydlig med att det är för LIA/utbildning

---

## 🎯 Checklista efter godkänd ansökan

- [ ] Prod-nycklar mottagna (e-post + SMS)
- [ ] Nycklar sparade säkert i Skatteverket/prod/
- [ ] Prod-certifikat mottaget och installerat
- [ ] Test-körning lyckad mot prod-API
- [ ] Uppdaterat .gitignore
- [ ] Dokumenterat i README
- [ ] Säkerhet och GDPR-rutiner på plats

---

## 📚 Användbara länkar

- **Utvecklarportalen:** https://skatteverket.se/omoss/samarbetspartners/digitalsamarbete/utvecklarportalen
- **API-dokumentation:** På Utvecklarportalen under respektive API
- **Avtal och villkor:** Ladda ner från API:ets sida
- **Support:** api@skatteverket.se

---

## 💰 Kostnad för Skatteverket Prod-API

**Skattekonto API:**
- ✅ **GRATIS** för mindre volymer
- Eventuella kostnader beror på användning
- Läs prismodell i avtalet

**Ombudshantering API:**
- ✅ **GRATIS**

---

## 🚀 När allt är klart

Du har då:
- ✅ Bolagsverket PROD-API (fungerar redan!)
- ✅ Skatteverket PROD-API (när godkänt)
- ✅ Företagscertifikat (skarpt)
- ✅ Komplett onboarding-system redo för produktion!

**Gratulerar - då kan du visa en RIKTIG demo med RIKTIGA API:er!** 🎉
