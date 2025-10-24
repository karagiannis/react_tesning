# Roaring OAuth2 Setup Guide

## Vad du har vs vad du behöver

### ✅ Du har:
- `ROARING_CLIENT_ID` - Din application/client identifier
- `ROARING_CLIENT_SECRET` - Din secret key

### 🎯 Du behöver:
- `ROARING_ACCESS_TOKEN` - Temporär token för API-anrop

## OAuth2 Flow (Client Credentials Grant)

```
┌─────────────┐                                    ┌─────────────┐
│   Du/App    │                                    │   Roaring   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │  POST /oauth/token                              │
       │  client_id=xxx                                  │
       │  client_secret=yyy                              │
       │  grant_type=client_credentials                  │
       │  scope=company:read                             │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │                    200 OK                        │
       │                    {                             │
       │                      "access_token": "abc...",   │
       │                      "token_type": "Bearer",     │
       │                      "expires_in": 3600          │
       │                    }                             │
       │<─────────────────────────────────────────────────┤
       │                                                  │
       │  GET /se/company/risk/1.0/templates             │
       │  Authorization: Bearer abc...                    │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │                    200 OK                        │
       │                    { "templates": [...] }        │
       │<─────────────────────────────────────────────────┤
       │                                                  │
```

## Steg 1: Hitta rätt OAuth endpoint

Roaring dokumentation borde innehålla OAuth endpoint, men vanliga är:

```bash
# Alternativ 1 (vanligast):
https://auth.roaring.io/oauth/token

# Alternativ 2:
https://api.roaring.io/oauth/token

# Alternativ 3:
https://login.roaring.io/oauth/token

# Alternativ 4 (sandbox):
https://sandbox.roaring.io/oauth/token
```

**Kolla Roaring dokumentation eller Developer Portal!**

## Steg 2: Hämta Access Token

### Manuellt (med curl):

```bash
# Sätt dina credentials
export ROARING_CLIENT_ID='din-client-id-här'
export ROARING_CLIENT_SECRET='din-client-secret-här'

# Hämta token
curl -X POST 'https://auth.roaring.io/oauth/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials' \
  -d "client_id=${ROARING_CLIENT_ID}" \
  -d "client_secret=${ROARING_CLIENT_SECRET}" \
  -d 'scope=company:read'

# Response:
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "company:read"
}
```

### Med vårt script:

```bash
# 1. Sätt credentials
export ROARING_CLIENT_ID='din-client-id'
export ROARING_CLIENT_SECRET='din-client-secret'

# 2. Kör script
chmod +x get_access_token.sh
./get_access_token.sh

# 3. Scriptet sparar token till .roaring_token
source .roaring_token

# 4. Nu har du ROARING_ACCESS_TOKEN satt!
echo $ROARING_ACCESS_TOKEN
```

## Steg 3: Använda Access Token

### I curl:

```bash
curl -X GET \
  'https://api.roaring.io/se/company/risk/1.0/templates' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer ${ROARING_ACCESS_TOKEN}"
```

### I vårt test-script:

```bash
# Token redan satt från get_access_token.sh
./test_risk_indicators.sh
```

## Token Lifecycle

### Expiration:
- Access tokens är vanligtvis giltiga i **1 timme (3600 sekunder)**
- Efter expiration: Hämta ny token (kör `get_access_token.sh` igen)

### Refresh:
- Client Credentials flow har INGEN refresh token
- När token expired: Begär ny token med samma client_id + secret

### Säkerhet:
```bash
# ✅ BRA: Sätt i environment variables
export ROARING_CLIENT_ID='...'
export ROARING_CLIENT_SECRET='...'

# ✅ BRA: Läs från säker fil
source ~/.roaring_credentials

# ❌ DÅLIGT: Hårdkoda i script
CLIENT_ID="abc123"  # ❌ Läcker i git!

# ❌ DÅLIGT: Logga token
echo "Token: $ACCESS_TOKEN"  # ❌ Hamnar i logs!
```

## Scopes

Roaring kan ha olika scopes för olika API-delar:

```bash
# Risk Indicators (vårt use case):
scope=company:read

# Beneficial Owner:
scope=beneficial-owner:read

# Alla scopes (om tillåtet):
scope=company:read beneficial-owner:read pep:read sanctions:read
```

**Kolla dokumentation för vilka scopes ditt API-key har tillgång till!**

## Troubleshooting

### Problem: "Invalid client"

```json
{
  "error": "invalid_client",
  "error_description": "Client authentication failed"
}
```

**Lösning:**
- Verifiera CLIENT_ID och CLIENT_SECRET
- Kolla att de är rätt kopierade (inga mellanslag)
- Kontakta Roaring support om credentials expired

---

### Problem: "Invalid scope"

```json
{
  "error": "invalid_scope",
  "error_description": "Requested scope is invalid"
}
```

**Lösning:**
- Ta bort `scope=company:read` från request
- Eller använd annat scope enligt dokumentation
- Eller begär scope från Roaring (Developer Portal)

---

### Problem: "Unauthorized" (401) på API-anrop

```json
{
  "status": {
    "code": 401,
    "text": "Unauthorized"
  }
}
```

**Lösning:**
- Token expired → Hämta ny token
- Token inte satt korrekt → Kolla `echo $ROARING_ACCESS_TOKEN`
- Fel format på Authorization header → Ska vara `Bearer {token}`

---

### Problem: "Forbidden" (403)

```json
{
  "status": {
    "code": 403,
    "text": "Forbidden"
  }
}
```

**Lösning:**
- Din client_id har inte tillgång till denna endpoint
- Kontakta Roaring för att aktivera fler endpoints
- Kolla att du använder rätt API URL (sandbox vs production)

---

## Exempel: Komplett flow

```bash
#!/bin/bash

# 1. Sätt credentials (från Roaring Portal)
export ROARING_CLIENT_ID='abcd1234-5678-90ef-ghij-klmnopqrstuv'
export ROARING_CLIENT_SECRET='secretkey123456789'

# 2. Hämta access token
./get_access_token.sh

# Output:
# ✓ Success! (HTTP 200)
# Token Type: Bearer
# Expires In: 3600 seconds (~60 minutes)
# Access Token: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
# ✓ Token saved to .roaring_token

# 3. Ladda token
source .roaring_token

# 4. Verifiera token är satt
echo "Token prefix: ${ROARING_ACCESS_TOKEN:0:20}..."

# 5. Testa API-anrop
curl -X GET \
  'https://api.roaring.io/se/company/risk/1.0/templates' \
  -H "Authorization: Bearer ${ROARING_ACCESS_TOKEN}" \
  | jq '.'

# 6. Kör hela test-suiten
./test_risk_indicators.sh

# 7. Efter ~1 timme: Token expired, upprepa från steg 2
```

## Integration i VÅR app

När vi bygger vår Celestial Risk Engine:

```python
import requests
import time
from datetime import datetime, timedelta

class RoaringOAuth2Client:
    """OAuth2 client för Roaring API."""
    
    def __init__(self, client_id, client_secret, oauth_url):
        self.client_id = client_id
        self.client_secret = client_secret
        self.oauth_url = oauth_url
        self.access_token = None
        self.token_expires_at = None
    
    def get_access_token(self):
        """Hämta access token (eller använd cached om giltig)."""
        
        # Återanvänd token om inte expired
        if self.access_token and self.token_expires_at > datetime.now():
            return self.access_token
        
        # Hämta ny token
        response = requests.post(self.oauth_url, data={
            'grant_type': 'client_credentials',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'scope': 'company:read'
        })
        
        if response.status_code == 200:
            data = response.json()
            self.access_token = data['access_token']
            expires_in = data.get('expires_in', 3600)
            
            # Sätt expiration (med 5 min marginal)
            self.token_expires_at = datetime.now() + timedelta(seconds=expires_in - 300)
            
            return self.access_token
        else:
            raise Exception(f"OAuth2 failed: {response.text}")
    
    def call_api(self, endpoint):
        """Anropa Roaring API med automatic token refresh."""
        
        token = self.get_access_token()
        
        response = requests.get(
            f"https://api.roaring.io{endpoint}",
            headers={'Authorization': f'Bearer {token}'}
        )
        
        if response.status_code == 401:
            # Token expired, försök igen med ny token
            self.access_token = None
            token = self.get_access_token()
            response = requests.get(
                f"https://api.roaring.io{endpoint}",
                headers={'Authorization': f'Bearer {token}'}
            )
        
        return response.json()

# Användning:
roaring = RoaringOAuth2Client(
    client_id=os.getenv('ROARING_CLIENT_ID'),
    client_secret=os.getenv('ROARING_CLIENT_SECRET'),
    oauth_url='https://auth.roaring.io/oauth/token'
)

# Anropa API (token hämtas automatiskt)
templates = roaring.call_api('/se/company/risk/1.0/templates')
company_risk = roaring.call_api('/se/company/risk/1.0/template-id/company-id')
```

## Nästa steg

1. **Hitta OAuth endpoint** - Kolla Roaring dokumentation eller Developer Portal
2. **Kör `get_access_token.sh`** - Hämta din första access token
3. **Kör `test_risk_indicators.sh`** - Testa alla endpoints
4. **Analysera resultat** - Verifiera vår förståelse av templates/thresholds
5. **Bygg vår OAuth2 client** - Integrera i Celestial Risk Engine

🎯
