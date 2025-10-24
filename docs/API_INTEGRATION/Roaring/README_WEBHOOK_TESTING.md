# Roaring Data Updater (Webhook) - Test Setup

Detta är test-suite för Roaring Data Updater API (webhook/subscription-tjänst).

## 📁 Filer

| Fil | Beskrivning |
|-----|-------------|
| `DATA_UPDATER_WEBHOOK.md` | Komplett dokumentation av API |
| `test_data_updater.py` | Python test-skript för alla endpoints |
| `webhook_receiver.py` | Flask-server för att ta emot webhooks |
| `README_WEBHOOK_TESTING.md` | Denna fil |

---

## 🚀 Snabbstart

### 1. Installera dependencies

```bash
pip3 install requests flask
```

### 2. Testa API-endpoints

```bash
cd docs/API_INTEGRATION/Roaring

# Redigera test_data_updater.py och sätt ditt ACCESS_TOKEN
nano test_data_updater.py

# Kör testerna
python3 test_data_updater.py
```

**Vad testas:**
- ✅ Lista tillgängliga services
- ✅ Lista webhooks
- ✅ Validera fil med org.nr
- ✅ Starta övervakningsuppgift
- ✅ Lista aktiva tasks
- ✅ Hämta task-status med protokoll

---

### 3. Testa webhook-mottagning

#### Terminal 1: Starta webhook-mottagare

```bash
python3 webhook_receiver.py
```

Output:
```
================================================================================
  ROARING WEBHOOK RECEIVER
================================================================================
  Started: 2025-10-24T14:30:00
  Webhook URL: http://localhost:5000/webhooks/roaring
  Health check: http://localhost:5000/health
  List events: http://localhost:5000/events

  💡 TIP: Use ngrok to expose this server:
     ngrok http 5000
================================================================================

 * Running on http://0.0.0.0:5000
```

#### Terminal 2: Exponera med ngrok

```bash
# Installera ngrok om inte redan gjort
# https://ngrok.com/download

ngrok http 5000
```

Output:
```
Forwarding   https://abc123.ngrok.io -> http://localhost:5000
```

**Din webhook-URL:** `https://abc123.ngrok.io/webhooks/roaring`

#### Terminal 3: Registrera webhook och starta task

```bash
# 1. Registrera webhook hos Roaring (via developer portal)
#    URL: https://abc123.ngrok.io/webhooks/roaring
#    Få webhook ID: webhook-celestial-test

# 2. Starta övervakningsuppgift
curl -X PUT \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  --data '{
    "companyIds": ["5564881422"],
    "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER"]
  }' \
  'https://api.roaring.io/se/company/current-information/1.0/start/webhook-celestial-test'
```

#### Terminal 1: Se webhook-events

När Roaring skickar event:
```
================================================================================
🔔 WEBHOOK MOTTAGEN: 2025-10-24T14:35:23
================================================================================
Event Type: BOARD_MEMBERS_CHANGED
Org.nr: 5564881422

Full payload:
{
  "eventType": "BOARD_MEMBERS_CHANGED",
  "organizationNumber": "5564881422",
  "timestamp": "2025-10-24T14:35:20Z",
  "changes": {
    "added": [...],
    "removed": [...]
  }
}
================================================================================
```

---

## 🧪 Testscenarier

### Scenario 1: Lista services
**Syfte:** Se vilka typer av data som kan övervakas

```bash
python3 -c "
import requests
response = requests.get(
    'https://api.roaring.io/se/company/current-information/1.0/services',
    headers={'Authorization': 'Bearer {TOKEN}'}
)
print(response.json())
"
```

**Förväntat:**
```json
{
  "services": [
    {"name": "BOARD_MEMBERS", "displayName": "Styrelseändringar"},
    {"name": "BENEFICIAL_OWNER", "displayName": "Ägarändringar"},
    {"name": "ADDRESS_CHANGE", "displayName": "Adressändringar"},
    {"name": "FINANCIAL_EVENTS", "displayName": "Ekonomiska händelser"},
    {"name": "BUSINESS_PROHIBITION", "displayName": "Näringsförbud"}
  ]
}
```

---

### Scenario 2: Validera fil med org.nr
**Syfte:** Kontrollera att alla org.nr är giltiga innan övervakning

```bash
# Skapa testfil
cat > /tmp/test_orgnr.txt << EOF
5564881422
5590523865
556INVALID
5569876543
EOF

# Validera
curl -X PUT \
  --header 'Authorization: Bearer {TOKEN}' \
  --form 'file=@/tmp/test_orgnr.txt' \
  'https://api.roaring.io/se/company/current-information/1.0/validate'
```

**Förväntat:**
```json
{
  "fileName": "test_orgnr.txt",
  "valid": false,
  "goodIdsQuantity": 3,
  "badIdsQuantity": 1,
  "validationMessage": "Line 3: 556INVALID is not a valid organization number"
}
```

---

### Scenario 3: Starta övervakning
**Syfte:** Börja övervaka ett företag

```bash
curl -X PUT \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {TOKEN}' \
  --data '{
    "companyIds": ["5564881422"],
    "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER", "ADDRESS_CHANGE"]
  }' \
  'https://api.roaring.io/se/company/current-information/1.0/start/webhook-celestial-test'
```

**Förväntat:**
```json
{
  "status": {"code": 200, "text": "OK"},
  "task": {
    "id": "task-abc-123",
    "webhookId": "webhook-celestial-test",
    "companyIdsCount": 1,
    "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER", "ADDRESS_CHANGE"],
    "status": "active",
    "startedAt": "2025-10-24T14:00:00Z"
  }
}
```

Spara `task.id` för senare!

---

### Scenario 4: Kontrollera task-status
**Syfte:** Se om webhooks har levererats

```bash
curl -X GET \
  --header 'Authorization: Bearer {TOKEN}' \
  'https://api.roaring.io/se/company/current-information/1.0/status/task-abc-123?withProtocol=true'
```

**Förväntat:**
```json
{
  "task": {
    "id": "task-abc-123",
    "status": "active",
    "generatedCount": 5,
    "deliveredCount": 5,
    "deliveryFailedCount": 0
  },
  "protocol": {
    "services": [
      {
        "serviceName": "BOARD_MEMBERS",
        "eventsGenerated": 3,
        "eventsDelivered": 3,
        "eventsFailed": 0
      },
      {
        "serviceName": "BENEFICIAL_OWNER",
        "eventsGenerated": 2,
        "eventsDelivered": 2,
        "eventsFailed": 0
      }
    ]
  }
}
```

**Problem-detection:**
- Om `deliveryFailedCount > 0` → Din webhook-mottagare är nere eller returnerar fel
- Om `generatedCount > deliveredCount` → Events väntar på leverans (retry-kö)

---

## 🔍 Debugging

### Problem: Webhook når inte mottagaren

**Kontrollera:**
1. ✅ Flask-servern körs (`python3 webhook_receiver.py`)
2. ✅ Ngrok tunnel är aktiv (`ngrok http 5000`)
3. ✅ Webhook-URL är korrekt registrerad hos Roaring (med ngrok-domän)
4. ✅ Flask-servern svarar 200 OK (inte 500 eller 404)

**Test lokalt:**
```bash
# Simulera webhook från Roaring
curl -X POST http://localhost:5000/webhooks/roaring \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "TEST_EVENT",
    "organizationNumber": "5564881422",
    "timestamp": "2025-10-24T14:00:00Z"
  }'
```

**Förväntat i Flask-konsolen:**
```
🔔 WEBHOOK MOTTAGEN: 2025-10-24T14:00:00
Event Type: TEST_EVENT
Org.nr: 5564881422
```

---

### Problem: Task skapas men inga events genereras

**Möjliga orsaker:**
1. Företaget har inga förändringar (inget att rapportera)
2. Services är felstavade (t.ex. "BOARD_MEMBER" istället för "BOARD_MEMBERS")
3. Företaget finns inte i Roaring-databasen

**Testa med:**
```bash
# Lista aktiva tasks
curl -X GET \
  --header 'Authorization: Bearer {TOKEN}' \
  'https://api.roaring.io/se/company/current-information/1.0/tasks'

# Kolla task-status
curl -X GET \
  --header 'Authorization: Bearer {TOKEN}' \
  'https://api.roaring.io/se/company/current-information/1.0/status/{task-id}'
```

---

### Problem: Många deliveryFailedCount

**Orsaker:**
- Webhook-mottagaren returnerar 500 Internal Server Error
- Webhook-mottagaren är långsam (timeout)
- Webhook-mottagaren är tillfälligt nere

**Lösning:**
1. Kolla Flask-logs för exceptions
2. Säkerställ att `/webhooks/roaring` returnerar 200 OK inom 5 sekunder
3. Implementera error handling i Flask-appen

---

## 📊 Webhook Event Structure (förväntad)

### Board Members Changed
```json
{
  "eventType": "BOARD_MEMBERS_CHANGED",
  "organizationNumber": "5564881422",
  "companyName": "PERFECT COMPANY AB",
  "timestamp": "2025-10-24T14:00:00Z",
  "changes": {
    "added": [
      {
        "personalNumber": "197506123456",
        "name": "Erik Eriksson",
        "role": "Styrelseledamot",
        "appointedDate": "2025-10-20"
      }
    ],
    "removed": [
      {
        "personalNumber": "196304182199",
        "name": "Anna Andersson",
        "role": "Styrelseledamot",
        "resignedDate": "2025-10-19"
      }
    ]
  }
}
```

### Beneficial Owner Changed
```json
{
  "eventType": "BENEFICIAL_OWNER_CHANGED",
  "organizationNumber": "5564881422",
  "companyName": "PERFECT COMPANY AB",
  "timestamp": "2025-10-24T14:00:00Z",
  "changes": {
    "added": [
      {
        "personalNumber": "198001011234",
        "name": "Kalle Karlsson",
        "ownershipPercentage": 30.0,
        "registrationDate": "2025-10-20"
      }
    ],
    "removed": []
  }
}
```

### Address Changed
```json
{
  "eventType": "ADDRESS_CHANGED",
  "organizationNumber": "5564881422",
  "companyName": "PERFECT COMPANY AB",
  "timestamp": "2025-10-24T14:00:00Z",
  "changes": {
    "old": {
      "street": "Kungsgatan 1",
      "postalCode": "11143",
      "city": "Stockholm"
    },
    "new": {
      "street": "Drottninggatan 5",
      "postalCode": "11151",
      "city": "Stockholm"
    }
  }
}
```

### Financial Event
```json
{
  "eventType": "FINANCIAL_EVENT",
  "organizationNumber": "5564881422",
  "companyName": "PERFECT COMPANY AB",
  "timestamp": "2025-10-24T14:00:00Z",
  "eventDetails": {
    "type": "BANKRUPTCY",
    "description": "Konkurs ansökt",
    "date": "2025-10-23",
    "courtCase": "Ä 12345-25"
  }
}
```

⚠️ **OBS:** Exakt struktur behöver verifieras mot faktiska webhooks från Roaring.

---

## 📝 Nästa steg

1. **Verifiera event-struktur:** Vänta på faktisk webhook från Roaring och dokumentera exakt JSON-format
2. **Implementera email-notifikationer:** Integrera SendGrid för att skicka email till kunder
3. **Bygg production webhook-handler:** Ersätt Flask med FastAPI/Django för produktion
4. **Database logging:** Spara alla events i PostgreSQL istället för minne
5. **Retry logic:** Implementera exponential backoff om email-sending misslyckas
6. **Monitoring:** Lägg till Sentry/Datadog för att övervaka webhook-delivery rate

---

## 🔗 Länkar

- **Roaring API Docs:** https://api.roaring.io/docs
- **Ngrok:** https://ngrok.com/
- **Flask Docs:** https://flask.palletsprojects.com/
- **SendGrid Python:** https://github.com/sendgrid/sendgrid-python

---

**Senast uppdaterat:** 2025-10-24  
**Författare:** Celestial Redovisning
