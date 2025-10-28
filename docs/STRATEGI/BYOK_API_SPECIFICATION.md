# BYOK - Bring Your Own Key API Specification

**Skapad:** 2025-10-28
**Status:** SPECIFICATION - Implementation pending
**Version:** 1.0

---

## 1. Översikt

### Syfte
Tillåt stora redovisningsbyråer (PwC, Ludvig & Co, m.fl.) att använda sina egna API-avtal med externa leverantörer (Bolagsverket, Roaring.io) istället för Celestials poolade nycklar.

### Affärsvärde
- **För byrån:** Egen fakturering, full kontroll, inga kostnader via Celestial
- **För Celestial:** Attraktivt för Enterprise-kunder, behåller kundrelation trots egen API-integration

### ⚠️ VIKTIGT: Krav på separata avtal

**Byrån måste själva teckna avtal med leverantörerna:**

1. **Bolagsverket/InfoTorg:**
   - Byrån kontaktar Lantmäteriet InfoTorg direkt
   - Tecknar eget abonnemang (från 1000 kr/mån)
   - Får egna Client ID + Client Secret
   - Celestial kan INTE dela våra nycklar (bryter licensvillkoren)

2. **Roaring.io:**
   - Byrån registrerar egen kund hos Roaring
   - Väljer AML & KYC Compliance-paket (2295 kr/mån)
   - Får egen API Key
   - Celestial kan INTE dela våra nycklar (mot terms of service)

**Varför inte dela Celestials nycklar?**
- **Licensvillkor:** Våra avtal tillåter INTE tredjepartsanvändning
- **Säkerhet:** Om byrån komprometteras påverkas ALLA Celestial-kunder
- **Support:** Leverantören kan inte supporta byrån direkt (känner inte till dem)
- **Fakturering:** Byrån kan inte se egen usage eller få separat faktura

**Celestials roll vid BYOK:**
- Guida byrån genom avtalsprocessen
- Tillhandahålla teknisk integration (API proxy, kryptering, UI)
- Hantera credentials säkert
- Aggregera usage från flera källor (Bolagsverket + Roaring + framtida datakällor)

---

## 2. Prismodeller

### Översikt - Tre Tiers

| Tier | Beskrivning | Kostnad | API-nycklar |
|------|-------------|---------|-------------|
| **Starter** | Celestial poolade nycklar, begränsad | Första 50 gratis, sedan 3 kr/anrop | Celestial |
| **Professional** | Volymrabatt via Celestial | 2500 kr/mån (1000 anrop), 2 kr/extra | Celestial |
| **Enterprise (BYOK)** | Byrån använder egna nycklar | 0 kr för API-anrop | Byråns egna |

### Detaljerad priskalkyl

#### Bolagsverket (via Lantmäteriet InfoTorg)
- **Lägsta tier:** 1000 kr/mån (exkl moms) för max 500 anrop
- **Efter moms:** 1250 kr/mån
- **Kostnad per anrop:** 2.50 kr (1250/500)

#### Roaring.io
- **Bastjänst:** 1795 kr/mån
- **AML & KYC Compliance:** +500 kr/mån
- **Total:** 2295 kr/mån
- **Pay-as-you-go:** Från 0.20 kr/kredit (volymrabatt)

### Celestial markup

**Starter tier:**
```
Anrop 1-50:    Gratis (lockar nya byråer)
Anrop 51-200:  3.00 kr/anrop (50% markup)
Anrop 201+:    2.50 kr/anrop (25% markup)
```

**Professional tier:**
```
Fast pris: 2500 kr/mån
Inkluderar: 1000 anrop
Extra anrop: 2.00 kr/anrop (0% markup, självkostnad)
```

**Enterprise (BYOK):**
```
API-kostnad: 0 kr (byrån betalar direkt)
Platform fee: Ingår i Enterprise-licens (separat prissättning)
```

### Kostnadsjämförelse för byråer

**Liten byrå (20 onboardingar/mån, 40 API-anrop):**
- Celestial Starter: **0 kr** ✅
- Eget avtal: 1250 kr/mån (slöseri, använder 40/500)
- **Rekommendation:** Starter

**Medelstorlek (150 onboardingar/mån, 300 API-anrop):**
- Celestial Starter: (50×0) + (150×3) + (100×2.5) = **700 kr**
- Celestial Professional: 2500 kr (overkill)
- Eget avtal: 1250 kr/mån ✅
- **Rekommendation:** Starter eller eget avtal

**Stor byrå (500+ onboardingar/mån, 1000+ API-anrop):**
- Celestial Professional: 2500 + (500×2) = **3500 kr**
- Eget avtal: 1250 + 2295 = **3545 kr**
- **Rekommendation:** BYOK (eget avtal) ✅

**ROI för stora byråer vid BYOK:**
- Kostnaden är likvärdig (~50 kr skillnad)
- **Fördelar med BYOK:**
  - Full kontroll över API-användning
  - Direkt support från Bolagsverket/Roaring
  - Ingen vendor lock-in för datakällor
  - Kan använda samma nycklar för andra system
  - Egen faktura (enklare redovisning)

---

## 3. Avtalprocess för BYOK-kunder

### 3.1 Onboarding-flöde

**Steg 1: Enterprise-licens**
1. Byrån tecknar Celestial Enterprise-licens
2. Får tillgång till BYOK-funktionalitet i Settings

**Steg 2: Bolagsverket/InfoTorg**
1. Celestial tillhandahåller kontaktinfo och guide
2. Byrån kontaktar InfoTorg: `kundservice@infotorg.se`
3. Väljer abonnemang (minst 1000 kr/mån för 500 anrop)
4. Får Client ID + Client Secret via säker kanal
5. Registrerar credentials i Celestial Settings UI

**Steg 3: Roaring.io**
1. Celestial tillhandahåller registreringslänk
2. Byrån registrerar på `https://roaring.io/signup`
3. Väljer "AML & KYC Compliance"-paket (2295 kr/mån)
4. Får API Key via Roaring dashboard
5. Registrerar API Key i Celestial Settings UI

**Steg 4: Testning**
1. Celestial Settings UI: "Testa anslutning"-knapp
2. Backend testar med känt orgnummer (556903-8671 Celestial AB)
3. Bekräftar att credentials fungerar
4. ✅ BYOK aktiverad - alla framtida API-anrop använder byråns nycklar

### 3.2 Support från Celestial

**Vad Celestial hjälper till med:**
- Guide för hur man tecknar avtal
- Kontaktuppgifter till InfoTorg/Roaring
- Prisförhandlingstips för stora volymer
- Teknisk integration (Settings UI, test connection)
- Aggregerad usage dashboard (flera datakällor)

**Vad Celestial INTE ansvarar för:**
- Avtalsförhandling med leverantörer (sker direkt mellan byrå och leverantör)
- Fakturering från leverantörer
- Teknisk support för API-problem (byrån kontaktar leverantören direkt)

### 3.3 Template-mejl till InfoTorg

```
Ämne: Förfrågan om API-avtal för Bolagsverket/Infotorg

Hej,

Vi är en redovisningsbyrå som använder Celestial Onboarding App 
för PTL-complianceschema. Vi vill teckna eget API-avtal för att 
hämta företagsdata från Bolagsverket.

Förväntad användning: ca 500-1000 API-anrop per månad

Kan ni skicka information om:
- Abonnemangsalternativ och priser
- Registreringsprocess
- Leveranstid för Client ID/Secret

Med vänlig hälsning,
[Byrånamn]
[Kontaktperson]
```

---

## 4. Teknisk Implementation

### 4.1 Backend - API Key Storage

**Databasschema:**
```sql
CREATE TABLE firm_api_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
````

---

## 3. Teknisk Implementation

### 3.1 Backend - API Key Storage

**Databasschema:**
```sql
CREATE TABLE firm_api_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'bolagsverket', 'roaring'
  mode VARCHAR(20) NOT NULL,     -- 'celestial_shared', 'byok'
  
  -- Krypterade credentials
  encrypted_client_id TEXT,
  encrypted_client_secret TEXT,
  encrypted_api_key TEXT,
  
  -- Metadata
  encryption_key_version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  
  -- Audit
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  
  UNIQUE(firm_id, provider)
);

CREATE INDEX idx_firm_api_provider ON firm_api_credentials(firm_id, provider);
```

**Kryptering:**
```python
from cryptography.fernet import Fernet
import os

# Master encryption key (environment variable, roteras årligen)
MASTER_KEY = os.getenv('API_CREDENTIALS_MASTER_KEY')
cipher_suite = Fernet(MASTER_KEY)

def encrypt_credential(plaintext: str) -> str:
    """Krypterar API-credentials med AES-256"""
    return cipher_suite.encrypt(plaintext.encode()).decode()

def decrypt_credential(ciphertext: str) -> str:
    """Dekrypterar API-credentials"""
    return cipher_suite.decrypt(ciphertext.encode()).decode()
```

### 3.2 API Proxy Service

**Python implementation:**
```python
# services/api_proxy.py

from typing import Optional
from models import Firm, APICredentials

class APIProxyService:
    
    def get_company_data(self, org_nr: str, firm_id: str) -> dict:
        """
        Hämtar företagsdata från Bolagsverket.
        Använder automatiskt rätt API-nycklar baserat på byråns konfiguration.
        """
        firm_config = self._get_firm_api_config(firm_id, 'bolagsverket')
        
        if firm_config['mode'] == 'byok':
            # Använd byråns egna nycklar
            client_id = decrypt_credential(firm_config['encrypted_client_id'])
            client_secret = decrypt_credential(firm_config['encrypted_client_secret'])
            
            # Audit log
            self._log_api_usage(firm_id, 'bolagsverket', 'byok', org_nr)
            
        else:
            # Använd Celestials poolade nycklar
            client_id = CELESTIAL_BOLAGSVERKET_CLIENT_ID
            client_secret = CELESTIAL_BOLAGSVERKET_SECRET
            
            # Debitera byrån
            self._charge_firm(firm_id, 'bolagsverket', self._get_rate(firm_id))
            self._log_api_usage(firm_id, 'bolagsverket', 'celestial_shared', org_nr)
        
        # Gör det faktiska API-anropet
        response = bolagsverket_client.fetch_company(
            org_nr=org_nr,
            client_id=client_id,
            client_secret=client_secret
        )
        
        # Uppdatera last_used_at
        self._update_last_used(firm_id, 'bolagsverket')
        
        return response
    
    def _get_rate(self, firm_id: str) -> float:
        """Beräknar pris per anrop baserat på byråns tier och månadens användning"""
        firm = Firm.query.get(firm_id)
        monthly_usage = self._get_monthly_usage(firm_id)
        
        if firm.subscription_tier == 'starter':
            if monthly_usage < 50:
                return 0.0
            elif monthly_usage < 200:
                return 3.0
            else:
                return 2.5
        
        elif firm.subscription_tier == 'professional':
            # Fast pris 2500 kr för 1000 anrop
            if monthly_usage < 1000:
                return 0.0  # Inkluderat i månadskostnad
            else:
                return 2.0
        
        else:  # enterprise/byok
            return 0.0  # Ingen kostnad via Celestial
```

### 3.3 Frontend - Settings UI

**React component:**
```jsx
// components/Settings/APIConfiguration.jsx

import { useState } from 'react';

export const APIConfiguration = ({ firmId }) => {
  const [mode, setMode] = useState('celestial_shared');
  const [credentials, setCredentials] = useState({
    bolagsverket: { clientId: '', clientSecret: '' },
    roaring: { apiKey: '' }
  });
  
  const testConnection = async (provider) => {
    const response = await fetch('/api/settings/test-api-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        credentials: credentials[provider]
      })
    });
    
    const result = await response.json();
    if (result.success) {
      alert('✅ Anslutningen fungerar!');
    } else {
      alert(`❌ Fel: ${result.error}`);
    }
  };
  
  return (
    <div className="api-configuration">
      <h2>Externa API-tjänster</h2>
      
      <div className="tier-selector">
        <label>
          <input
            type="radio"
            value="starter"
            checked={mode === 'starter'}
            onChange={() => setMode('starter')}
          />
          <div>
            <strong>Starter</strong>
            <p>Celestial poolade nycklar</p>
            <ul>
              <li>Första 50 anrop/mån gratis</li>
              <li>3 kr/anrop (51-200)</li>
              <li>2.50 kr/anrop (>200)</li>
            </ul>
          </div>
        </label>
        
        <label>
          <input
            type="radio"
            value="professional"
            checked={mode === 'professional'}
            onChange={() => setMode('professional')}
          />
          <div>
            <strong>Professional</strong>
            <p>Volymrabatt</p>
            <ul>
              <li>2500 kr/mån för 1000 anrop</li>
              <li>2 kr/anrop efter det</li>
            </ul>
          </div>
        </label>
        
        <label>
          <input
            type="radio"
            value="byok"
            checked={mode === 'byok'}
            onChange={() => setMode('byok')}
          />
          <div>
            <strong>Enterprise (BYOK)</strong>
            <p>Använd era egna API-nycklar</p>
            <ul>
              <li>Ingen kostnad via Celestial</li>
              <li>Full kontroll och egen fakturering</li>
            </ul>
          </div>
        </label>
      </div>
      
      {mode === 'byok' && (
        <div className="byok-credentials">
          <h3>Bolagsverket/InfoTorg API</h3>
          <input
            type="text"
            placeholder="Client ID"
            value={credentials.bolagsverket.clientId}
            onChange={(e) => setCredentials({
              ...credentials,
              bolagsverket: { ...credentials.bolagsverket, clientId: e.target.value }
            })}
          />
          <input
            type="password"
            placeholder="Client Secret"
            value={credentials.bolagsverket.clientSecret}
            onChange={(e) => setCredentials({
              ...credentials,
              bolagsverket: { ...credentials.bolagsverket, clientSecret: e.target.value }
            })}
          />
          <button onClick={() => testConnection('bolagsverket')}>
            Testa anslutning
          </button>
          
          <h3>Roaring.io API</h3>
          <input
            type="password"
            placeholder="API Key"
            value={credentials.roaring.apiKey}
            onChange={(e) => setCredentials({
              ...credentials,
              roaring: { apiKey: e.target.value }
            })}
          />
          <button onClick={() => testConnection('roaring')}>
            Testa anslutning
          </button>
          
          <div className="usage-stats">
            <h4>Nuvarande användning denna månad:</h4>
            <p>Bolagsverket: 347 anrop</p>
            <p>Roaring.io: 289 anrop</p>
          </div>
          
          <div className="security-note">
            ℹ️ Nycklar krypteras med AES-256.
            Endast backend har dekrypteringsnyckel.
          </div>
        </div>
      )}
      
      <button onClick={saveConfiguration}>Spara ändringar</button>
    </div>
  );
};
```

---

## 4. Säkerhet

### 4.1 Kryptering

**Algoritm:** AES-256 via Fernet (Python cryptography library)

**Key Management:**
- Master key lagras i environment variable (AWS Secrets Manager i production)
- Key rotation årligen
- `encryption_key_version` i DB för att hantera multipla nycklar under rotation

**Åtkomstkontroll:**
- Endast backend kan dekryptera
- Frontend ser **ALDRIG** plaintext credentials
- API-anrop går alltid via Celestial backend (proxy)

### 4.2 Audit Logging

```sql
CREATE TABLE api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES firms(id),
  provider VARCHAR(50) NOT NULL,
  mode VARCHAR(20) NOT NULL,  -- 'celestial_shared' or 'byok'
  endpoint VARCHAR(200),
  request_params JSONB,
  response_status INT,
  cost DECIMAL(10,2),  -- Kostnad för byrån (0.00 vid BYOK)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_logs_firm_date ON api_usage_logs(firm_id, created_at DESC);
CREATE INDEX idx_api_logs_provider ON api_usage_logs(provider, created_at DESC);
```

### 4.3 Rate Limiting

**Per byrå:**
- Starter: Max 500 anrop/månad (soft limit, varna vid 450)
- Professional: Max 5000 anrop/månad (soft limit)
- BYOK: Ingen limit från Celestial (leverantören hanterar egna limiter)

**Globalt (Celestials poolade nycklar):**
- Max 10 000 anrop/dag totalt över alla Starter/Professional-byråer
- Circuit breaker vid leverantörsfel

---

## 5. Testing & Validation

### 5.1 Test Connection Endpoint

```python
# routes/api_settings.py

@app.route('/api/settings/test-api-connection', methods=['POST'])
@require_auth
@require_admin  # Endast admin kan ändra API-credentials
def test_api_connection():
    data = request.json
    provider = data['provider']
    credentials = data['credentials']
    
    try:
        if provider == 'bolagsverket':
            # Testa med känt orgnummer
            result = bolagsverket_client.fetch_company(
                org_nr='556903-8671',  # Celestial AB
                client_id=credentials['clientId'],
                client_secret=credentials['clientSecret']
            )
            
        elif provider == 'roaring':
            result = roaring_client.test_connection(
                api_key=credentials['apiKey']
            )
        
        return jsonify({'success': True, 'message': 'Anslutningen fungerar!'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400
```

### 5.2 Migration Plan

**Fas 1: Starter/Professional (Q1 2026)**
- Implementera poolade nycklar
- Prissättning och debitering
- Usage dashboard

**Fas 2: BYOK MVP (Q2 2026)**
- Settings UI för credentials
- Kryptering och storage
- API proxy med key selection

**Fas 3: Enterprise Features (Q3 2026)**
- Advanced usage analytics
- Multi-region support
- Custom rate limits per byrå

---

## 6. Affärsmodell

### Revenue Streams

**Direkt:**
- Starter tier: Markup på API-anrop (1.50 kr profit per anrop > 50)
- Professional tier: Månadskostnad 2500 kr (break-even vid 1250 anrop)

**Indirekt (BYOK-kunder):**
- Platform fee (ingår i Enterprise-licens)
- Support och managed service
- Lock-in via integrationer

### Konkurrensfördelar

**Vs byggande egen integration:**
- Celestial hanterar alla API-versioner och breaking changes
- Fallback till alternativ datakälla vid outages
- Compliance-rutiner redan inbyggda

**Vs andra platforms:**
- Flexibilitet: Välj mellan poolade eller egna nycklar
- Ingen vendor lock-in för stora byråer
- Transparent prissättning

---

## 7. Nästa Steg

### Implementation Checklist

- [ ] Databas-schema för API credentials
- [ ] Kryptering/dekryptering service
- [ ] API proxy service med key selection
- [ ] Settings UI (React component)
- [ ] Test connection endpoint
- [ ] Audit logging
- [ ] Usage dashboard
- [ ] Billing integration
- [ ] Documentation för Enterprise-kunder
- [ ] Migration guide från Starter → BYOK

### Prioritet

**P0 (Krävs för MVP):**
- Poolade nycklar (Starter/Professional)
- Basic usage tracking

**P1 (Krävs för Enterprise):**
- BYOK implementation
- Settings UI

**P2 (Nice-to-have):**
- Advanced analytics
- Multi-provider failover

---

## 8. Referenser

**Externa API-dokumentation:**
- [Bolagsverket API](../external_apis/Bolagsverket/INDEX.md)
- [Roaring.io API](../external_apis/roaring/INDEX.md)

**Relaterade dokument:**
- [DATAKÄLLOR_STRATEGI.md](./DATAKÄLLOR_STRATEGI.md) - Jämförelse av datakällor
- [CONFIG_STRUCTURE.md](../specifications/CONFIG_STRUCTURE.md) - Firm configuration

**Compliance:**
- [compliance/INDEX.md](../compliance/INDEX.md) - PTL-krav på datakällor

