# Bolagsverket API - Test Resultat

## ✅ PRODUKTIONS-CREDENTIALS FUNGERAR!

**Testat:** 2025-10-20  
**Resultat:** Access token mottagen!

### Test-körning
```bash
curl -X POST https://portal.api.bolagsverket.se/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=EJ2Z7mTfXwSfwceewkfCGjI9rToa" \
  -d "client_secret=qVTWmiuF1Rxfykt9MUX0OOZLVmQa"
```

### Svar (exempel)
```json
{
  "access_token": "eyJ4NXQiOiJNell4TW1Ga...[long JWT token]",
  "scope": "default",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Token information
- **Token typ:** Bearer
- **Scope:** default
- **Giltighetstid:** 3600 sekunder (1 timme)
- **Org.nr i token:** 9999999999
- **Org.namn i token:** "Värdefulla datamängder"

## 📝 Nästa steg för integration

1. **Skapa backend-service** som hanterar token-förnyelse
2. **Implementera org.nr-sökning** mot API:et
3. **Cacha tokens** för att undvika onödiga anrop
4. **Integrera med frontend** onboarding-flödet

## 🔗 API Endpoints att använda

Med denna token kan vi nu anropa:
- `/vardefulladatamangder/v1/` - Sök företagsdata
- Parametrar: org.nr, namn, etc.

## ⚠️ OBS

- Test-credentials verkar inte aktiverade än (felmeddelande)
- **Använd endast produktions-credentials** för tillfället
- Token måste förnyas varje timme
