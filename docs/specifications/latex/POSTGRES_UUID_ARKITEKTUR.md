# PostgreSQL UUID-baserad Arkitektur (Ingen Redis Sessions)

**Datum:** 2025-10-24  
**Status:** ✅ Implementerad i API_Endpoints_ContentSlides.tex

---

## Översikt

Onboarding-appen använder **endast PostgreSQL med UUID-baserad process-identifiering** istället för Redis sessions. Detta ger:

✅ **Persistent lagring** - Data överlever browser-stängning och server-restart  
✅ **Långvariga processer** - Stödjer 1-2 timmar AI-analys av 800 MB filer  
✅ **Multi-dag workflows** - Användare kan pausa och fortsätta nästa dag  
✅ **Enklare arkitektur** - En datakälla istället för två (Redis + PostgreSQL)  
✅ **Audit trail** - All historik sparas automatiskt  
✅ **Säkerhet** - Varje API-anrop verifierar user_id från JWT token  

---

## Hur det fungerar

### 1. User loggar in
```
POST /api/auth/login
Response: {
  "access_token": "eyJhbGc...",
  "user_id": "b8e1c7d3-9f2a-4e1b-8a3c-5d6e7f8g9h0i"
}
```

JWT token innehåller `user_id` och används för autentisering i alla API-anrop.

---

### 2. Starta onboarding-process
```
POST /api/onboarding/uppdrag
Headers: {
  "Authorization": "Bearer <access_token>"
}
Body: {
  "lopandeBokforing": true,
  "arsbokslut": true,
  ...
}

Response: {
  "success": true,
  "onboardingId": "a7f3c8e2-4b1d-4e9a-8c3f-1a2b3c4d5e6f",  ← UUID genererat
  "uppskattadKostnad": "15000 kr/år",
  "nextStep": "/riskfragor"
}
```

Backend:
1. Hämtar `user_id` från JWT token
2. Genererar nytt UUID för onboarding-processen
3. Skapar rad i `onboarding_processes` tabell
4. Returnerar UUID till frontend

---

### 3. Frontend sparar onboardingId

Frontend lagrar UUID i React state:
```javascript
const [onboardingId, setOnboardingId] = useState(null);

// Efter POST /api/onboarding/uppdrag
setOnboardingId(response.onboardingId);

// Alla efterföljande API-anrop använder detta UUID
POST /api/onboarding/{onboardingId}/riskfragor/steg1
POST /api/onboarding/{onboardingId}/identitet
POST /api/onboarding/{onboardingId}/upload-chunk
GET  /api/onboarding/{onboardingId}/analysis-status
```

---

### 4. Varje API-anrop verifierar ägarskap

Backend säkerhetskontroll på VARJE endpoint:

```sql
-- Hämta user_id från JWT token
-- Verifiera att onboarding-processen ägs av denna user

SELECT * FROM onboarding_processes
WHERE id = $1                    -- onboardingId från URL
  AND user_id = $2;              -- user_id från JWT token

-- Om inte hittat eller inte ägs av user → 403 Forbidden
```

Detta förhindrar att User A kan komma åt User B:s onboarding-process.

---

### 5. Uppdatera onboarding-process

```
POST /api/onboarding/{onboardingId}/riskfragor/steg1
Headers: {
  "Authorization": "Bearer <access_token>"
}
Body: {
  "affarsIde": "Redovisningstjänster",
  "organisationsnummer": "556903-8671",
  ...
}
```

Backend:
```sql
UPDATE onboarding_processes
SET 
  riskfragor_steg1 = $1::jsonb,
  bolagsverket_data = $2::jsonb,
  current_step = 2,
  status = 'in_progress',
  updated_at = NOW()
WHERE id = $3                    -- onboardingId (UUID)
  AND user_id = $4;              -- Från JWT token (security check)
```

---

## Databasschema

### Tabell: onboarding_processes

```sql
CREATE TABLE onboarding_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'draft',        -- 'draft', 'in_progress', 'completed', 'rejected'
  current_step INTEGER DEFAULT 1,            -- 1-7 (vilket steg användaren är på)
  
  -- Steg 1: Uppdragsval
  uppdrag_data JSONB,
  uppskattad_kostnad VARCHAR(50),
  risk_indikator VARCHAR(20),
  
  -- Steg 2: Riskfrågor
  riskfragor_steg1 JSONB,
  riskfragor_steg2 JSONB,
  
  -- Externa API-data
  bolagsverket_data JSONB,
  spar_data JSONB,
  roaring_data JSONB,
  
  -- Steg 3: Identitetskontroll
  bankid_data JSONB,
  
  -- Steg 4: Jämförelse
  comparison_results JSONB,
  
  -- Steg 5: Dokument (800 MB files)
  uploaded_files JSONB,                      -- [{"filename": "sie.se", "size": 524288, "s3_key": "..."}]
  total_upload_size BIGINT,                  -- Bytes (max 800,000,000)
  
  -- Steg 6: AI-analys (långvarig process)
  ai_analysis_status VARCHAR(50),            -- 'pending', 'processing', 'completed', 'failed'
  ai_analysis_progress INTEGER DEFAULT 0,    -- 0-100
  ai_analysis_started_at TIMESTAMP,
  ai_analysis_estimated_completion TIMESTAMP,
  ai_analysis_completed_at TIMESTAMP,
  ai_analysis_result JSONB,                  -- Red flags, risk score, etc.
  
  -- Steg 7: Beslut
  risk_score INTEGER,                        -- 0-100
  risk_flags JSONB,                          -- PTL violations
  decision VARCHAR(50),                      -- 'approved', 'rejected', 'manual_review'
  decision_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index för snabb lookup
CREATE INDEX idx_onboarding_user ON onboarding_processes(user_id);
CREATE INDEX idx_onboarding_status ON onboarding_processes(status);
CREATE INDEX idx_onboarding_ai_status ON onboarding_processes(ai_analysis_status);
```

---

### Tabell: external_api_responses (Audit Trail)

```sql
CREATE TABLE external_api_responses (
  id SERIAL PRIMARY KEY,
  onboarding_id UUID NOT NULL REFERENCES onboarding_processes(id),
  api_name VARCHAR(50),                      -- 'bolagsverket', 'spar', 'roaring', 'bankid'
  endpoint VARCHAR(255),
  request_data JSONB,
  response_data JSONB,
  response_code INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_external_api_onboarding ON external_api_responses(onboarding_id);
```

---

## API Endpoints URL-struktur

Alla endpoints (utom POST /uppdrag) använder `{onboardingId}` i URL:en:

| Endpoint | Metod | Beskrivning |
|----------|-------|-------------|
| `/api/onboarding/uppdrag` | POST | Skapa ny process → returnerar UUID |
| `/api/onboarding/{onboardingId}/riskfragor/steg1` | POST | Spara riskfrågor Steg 1 |
| `/api/onboarding/{onboardingId}/riskfragor/steg2` | POST | Spara riskfrågor Steg 2 |
| `/api/onboarding/{onboardingId}/identitet` | POST | BankID-verifiering |
| `/api/onboarding/{onboardingId}/comparison` | GET | Hämta jämförelseresultat |
| `/api/onboarding/{onboardingId}/upload-chunk` | POST | Ladda upp chunk (multipart) |
| `/api/onboarding/{onboardingId}/upload-complete` | POST | Slutför upload, starta AI |
| `/api/onboarding/{onboardingId}/analysis-status` | GET | AI-analys progress (0-100%) |
| `/api/onboarding/{onboardingId}/decision` | GET | Hämta slutgiltigt beslut |

---

## Säkerhet

### 1. JWT Token Validation
Varje API-anrop kräver `Authorization: Bearer <access_token>` header.

Backend extraherar `user_id` från JWT token och verifierar signaturen.

### 2. Ownership Verification
Varje API-anrop verifierar att onboarding-processen ägs av den inloggade användaren:

```python
def verify_ownership(onboarding_id: str, user_id: str):
    process = db.query(OnboardingProcess).filter(
        OnboardingProcess.id == onboarding_id,
        OnboardingProcess.user_id == user_id
    ).first()
    
    if not process:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    return process
```

### 3. SQL Injection Prevention
Använd alltid parametriserade queries (`$1`, `$2`, etc.) istället för string concatenation.

### 4. JSONB Validation
Validera alla JSONB-fält med Pydantic models innan INSERT/UPDATE.

---

## Långvariga Processer (AI-analys)

### Problem: 800 MB PDFs tar 1-2 timmar att analysera

**Scenario:** RS MEK-kunden laddar upp 6 års bokföring (800 MB PDFs).  
**AI-modell:** Hugging Face `microsoft/layoutlmv3-large` (CPU inference på budget droplet).  
**Processtid:** 1-2 timmar.

### Lösning: Celery Background Tasks

1. **Upload-fas:**
   ```
   POST /api/onboarding/{onboardingId}/upload-chunk  (chunked upload)
   POST /api/onboarding/{onboardingId}/upload-complete
   ```

2. **Starta AI-analys (Celery task):**
   ```python
   @celery.task
   def analyze_documents(onboarding_id: str):
       # Hämta uploaded_files från PostgreSQL
       # Ladda ner från S3
       # Analysera med Hugging Face model
       # Uppdatera progress 0-100% i PostgreSQL
       # Detektera red flags (privata kostnader som företagskostnader)
       # Spara result i ai_analysis_result JSONB
       # Skicka email när klart
   ```

3. **Frontend polling:**
   ```javascript
   // Poll varje 5 sekunder
   const checkAnalysisStatus = async () => {
     const response = await fetch(
       `/api/onboarding/${onboardingId}/analysis-status`
     );
     const data = await response.json();
     
     setProgress(data.progress);  // 0-100
     
     if (data.status === 'completed') {
       clearInterval(pollInterval);
       // Visa resultat
     }
   };
   ```

4. **Database tracking:**
   ```sql
   UPDATE onboarding_processes
   SET 
     ai_analysis_status = 'processing',
     ai_analysis_progress = 45,  -- 45% klart
     ai_analysis_estimated_completion = NOW() + INTERVAL '30 minutes'
   WHERE id = $1;
   ```

---

## Fördelar vs Redis Sessions

| Feature | Redis Sessions | PostgreSQL UUID |
|---------|---------------|-----------------|
| **Persistent** | ❌ Försvinner vid server restart | ✅ Överlever allt |
| **TTL** | ⚠️ 15-60 min, sedan borta | ✅ Ingen expiration |
| **Multi-dag** | ❌ Sessions går ut | ✅ Fortsätt när som helst |
| **Långvariga processer** | ❌ Max 60 min | ✅ 1-2 timmar AI-analys OK |
| **Audit trail** | ❌ Måste duplicera till DB | ✅ Automatiskt sparad historik |
| **Komplexitet** | ⚠️ Två datakällor (Redis + PostgreSQL) | ✅ En datakälla |
| **Backup** | ❌ Redis RDB snapshots | ✅ Standard PostgreSQL backup |
| **Skalbarhet** | ✅ Snabb in-memory | ✅ PostgreSQL JSONB indexing snabb nog |

---

## Implementationsstatus

### ✅ Klart i API_Endpoints_ContentSlides.tex

1. **Teknisk arkitektur (rad 119-125):** Uppdaterad med UUID-baserad approach
2. **POST /api/onboarding/uppdrag (rad 150-260):** 
   - Beskrivning uppdaterad: "Skapar ny onboarding-process"
   - Response inkluderar `onboardingId` (UUID)
   - Business logic: Genererar UUID, sparar i `onboarding_processes`
   - SQL: `INSERT INTO onboarding_processes` med `gen_random_uuid()`

3. **POST /api/onboarding/{onboardingId}/riskfragor/steg1 (rad 287-450):**
   - URL ändrad: `/{onboardingId}/` i path
   - Beskrivning: "Använder onboardingId från URL-path"
   - Business logic: Verifiera ägarskap (user_id från JWT)
   - SQL: `UPDATE onboarding_processes WHERE id = $5 AND user_id = $6`
   - Security check: 403 Forbidden om inte ägare

---

## Nästa steg

1. ✅ **Uppdatera Sektion 2B:** Riskfrågor Steg 2 (POST /{onboardingId}/riskfragor/steg2)
2. ⏳ **Sektion 3:** Identitetskontroll (POST /{onboardingId}/identitet)
3. ⏳ **Sektion 4:** Jämförelse (GET /{onboardingId}/comparison)
4. ⏳ **Sektion 5:** Dokument (POST /{onboardingId}/upload-chunk, upload-complete)
5. ⏳ **Sektion 6:** AI-analys (GET /{onboardingId}/analysis-status) + Celery dokumentation
6. ⏳ **Sektion 7:** Beslut (GET /{onboardingId}/decision)

---

## Exempel: RS MEK-workflow med UUID

**Dag 1: 10:00**
```
User loggar in → JWT token med user_id
POST /api/onboarding/uppdrag → onboardingId = "a7f3c8e2..."
POST /api/onboarding/a7f3c8e2.../riskfragor/steg1
POST /api/onboarding/a7f3c8e2.../upload-chunk (800 MB PDFs, 6 års bokföring)
POST /api/onboarding/a7f3c8e2.../upload-complete → Startar Celery task

PostgreSQL:
  ai_analysis_status = 'processing'
  ai_analysis_progress = 0
  ai_analysis_started_at = '2025-10-24 10:00:00'
  ai_analysis_estimated_completion = '2025-10-24 12:00:00'
```

**Dag 1: 10:30** (User stänger browser och går på lunch)
```
Browser stängd, men:
- Celery task fortsätter köra i bakgrunden
- PostgreSQL håller kvar all data
- ai_analysis_progress = 25
```

**Dag 1: 12:00** (AI-analys klar, user fortfarande borta)
```
Celery task:
  - Uppdaterar ai_analysis_status = 'completed'
  - Uppdaterar ai_analysis_progress = 100
  - Sparar red flags i ai_analysis_result JSONB
  - Skickar email: "Din analys är klar, logga in för att se resultatet"
```

**Dag 2: 08:00** (User loggar in igen)
```
User loggar in → Nytt JWT token
Frontend: GET /api/onboarding/a7f3c8e2.../analysis-status

Response: {
  "status": "completed",
  "progress": 100,
  "completedAt": "2025-10-24T12:00:00Z",
  "result": {
    "riskScore": 85,
    "redFlags": [
      {
        "type": "PRIVATE_EXPENSE_AS_BUSINESS",
        "amount": 124500,
        "description": "Privata levnadskostnader och boendekostnader felaktigt bokförda som företagskostnader"
      }
    ]
  }
}

Backend beslut:
  decision = 'rejected'
  decision_reason = 'PTL-risk: Systematisk felklassificering av privata kostnader'
```

**Resultat:** Onboarding-processen fungerade perfekt över två dagar utan någon Redis session!

---

## Sammanfattning

**Redis sessions är INTE nödvändiga.** PostgreSQL med UUID ger:

✅ Persistent lagring  
✅ Långvariga processer (1-2 timmar AI-analys)  
✅ Multi-dag workflows  
✅ Enklare arkitektur  
✅ Bättre säkerhet (ägarskapsverifiering)  
✅ Audit trail automatiskt  

**Alla endpoints uppdaterade i API_Endpoints_ContentSlides.tex för att använda denna arkitektur.**
