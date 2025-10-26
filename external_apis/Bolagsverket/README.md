# Bolagsverket API - Credentials

## ⚠️ SÄKERHETSVARNING
Denna mapp innehåller känsliga credentials för Bolagsverket API.
**Dela ALDRIG innehållet i denna mapp offentligt eller committa till Git!**

## Filer i denna mapp

### Produktions-credentials
- `bolagsverket_prod.zip` - Original zip från Bolagsverket (produktion)
- `prod_client_id.txt` - Client ID för produktion (efter uppackning)
- `prod_client_secret.txt` - Client Secret för produktion (efter uppackning)
- Dekrypteringskod (SMS): `GB!WwKjB+Ub31CwZya7q`

### Test-credentials
- `bolagsverket_test.zip` - Original zip från Bolagsverket (test)
- `test_client_id.txt` - Client ID för test (efter uppackning)
- `test_client_secret.txt` - Client Secret för test (efter uppackning)
- Dekrypteringskod (SMS): `26-X7NtSa!fQpDFe!Q2e`

## Hur du packar upp zip-filerna

### Linux/Mac:
```bash
# För produktion
unzip -P 'GB!WwKjB+Ub31CwZya7q' bolagsverket_prod.zip

# För test
unzip -P '26-X7NtSa!fQpDFe!Q2e' bolagsverket_test.zip
```

### Windows:
1. Högerklicka på zip-filen
2. Välj "Extract All..."
3. Ange lösenordet när du ombeds

## API Information

### OAuth2 Token Endpoint
```
https://portal.api.bolagsverket.se/oauth2/token
```

### Developer Portal
Dokumentation finns på Bolagsverkets Developer Portal

### Grant Type
OAuth2 Client Credentials Grant

### Exempel på token-anrop (curl)
```bash
curl -X POST https://portal.api.bolagsverket.se/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=DIN_CLIENT_ID" \
  -d "client_secret=DIN_CLIENT_SECRET"
```

## Integration med applikationen

Credentials ska laddas från `.env`-fil (se `backend/.env.example`)

**Committa ALDRIG `.env`-filen till Git!**

## Vad API:et ger dig (gratis)

Från "Värdefulla datamängder":
- ✅ Organisationsnummer
- ✅ Företagsnamn
- ✅ Adress
- ✅ Verksamhetsbeskrivning

## Vad som INTE ingår (kostar extra)

Från "Företagsinformation" (5000 kr + 1000 kr/mån):
- ❌ Ägarstruktur
- ❌ Styrelseuppgifter
- ❌ Dagliga uppdateringar (kommer Q1 2026)

## Kontakt vid säkerhetsproblem

Om credentials hamnat i orätta händer:
- 📧 Kontakta: api@bolagsverket.se
- 📞 Telefon: 0771-670 670
