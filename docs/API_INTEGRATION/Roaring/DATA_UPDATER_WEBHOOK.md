# Roaring API: Data Updater (Webhook) - Löpande övervakning
**Endpoint:** `/se/company/current-information/1.0/`  
**Dokumenterat:** 2025-10-24  
**Status:** 🟡 Begränsad implementation (endast email-notifikation)  

---

## Innehåll
1. [Översikt](#översikt)
2. [Affärsmodell och begränsningar](#affärsmodell-och-begränsningar)
3. [API-struktur](#api-struktur)
4. [Endpoints](#endpoints)
5. [Användningsfall för Celestial](#användningsfall-för-celestial)
6. [Implementation med email](#implementation-med-email)
7. [Kostnadsmodell (TBD)](#kostnadsmodell-tbd)

---

## Översikt

**Data Updater** är Roarings webhook/subscription-tjänst för att få **löpande uppdateringar** om företag.

### Vad gör den?
- 📡 **Övervakar** specificerade företag för förändringar
- 🔔 **Notifierar** via webhook när något händer
- 📊 **Services:** Olika typer av data som kan övervakas (t.ex. styrelseändringar, adressändringar, ekonomiska händelser)

### Hur fungerar det?
```
1. Du startar en "task" med lista på org.nr + vilka services du vill övervaka
2. Roaring övervakar dessa företag kontinuerligt
3. När något händer → Roaring skickar webhook-event till din URL
4. Din app tar emot event → Agerar (t.ex. skickar email till kund)
```

---

## Affärsmodell och begränsningar

### 🟢 Vad vi KAN erbjuda
**Email-notifikationer till kunder vars företag vi redan hanterar:**

- ✅ Kund tecknar sig som klient hos Celestial
- ✅ Vi gör initial KYC + onboarding
- ✅ Som del av tjänsten: "Vi övervakar ditt företag och meddelar vid förändringar"
- ✅ När Roaring webhook triggas → Vi skickar email till kunden
- ✅ Exempel: "Hej Anna, vi ser att ny styrelseledamot registrerats i ditt AB. Behöver du hjälp med bokföringen?"

**Varför detta fungerar:**
- Vi har redan kundrelationen
- Begränsad mängd företag att övervaka (endast våra kunder)
- Email är billigt att skicka
- Värde för kunden: Proaktiv service

### 🔴 Vad vi INTE kan erbjuda
**Generell webhook-leverans till externa system:**

- ❌ Extern part prenumererar via API på valfria företag
- ❌ Vi bygger webhook-infrastruktur för extern trafik
- ❌ Vi fungerar som "Roaring-reseller" för webhooks

**Varför inte:**
- Oklar prismodell (Roaring tar betalt per event? Per företag? Flat fee?)
- Skalbarhetsproblem (om extern part övervakar 10,000 företag)
- Infrastrukturkrav (garanterad uptime, retry-logic, DDoS-skydd)
- Juridisk komplexitet (är vi databehandlare för extern part?)

---

## API-struktur

### Bas-URL
```
https://api.roaring.io/se/company/current-information/1.0
```

### Endpoints översikt
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/services` | Lista tillgängliga services (vad kan övervakas) |
| GET | `/tasks` | Lista dina aktiva övervakningsuppgifter |
| PUT | `/start/{webhookId}` | Starta övervakning med JSON-lista |
| PUT | `/startWithFile/{webhookId}` | Starta övervakning med fil (många org.nr) |
| GET | `/status/{currentInformationId}` | Status på specifik task (med protokoll) |
| PUT | `/validate` | Validera fil med org.nr innan start |
| GET | `/webhooks` | Lista dina registrerade webhooks |

---

## Endpoints

### 1. Lista tillgängliga services

**GET** `/services`

Hämta lista på vilka typer av data som kan övervakas.

#### Request Example
```bash
curl -X GET \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/se/company/current-information/1.0/services'
```

#### Response Example
```json
{
  "services": [
    {
      "name": "BOARD_MEMBERS",
      "displayName": "Styrelseändringar",
      "description": "Notifierar när styrelseledamöter tillkommer/avgår"
    },
    {
      "name": "ADDRESS_CHANGE",
      "displayName": "Adressändringar",
      "description": "Notifierar när företagets besöks- eller postadress ändras"
    },
    {
      "name": "BENEFICIAL_OWNER",
      "displayName": "Ägarändringar",
      "description": "Notifierar när verklig huvudman ändras"
    },
    {
      "name": "FINANCIAL_EVENTS",
      "displayName": "Ekonomiska händelser",
      "description": "Notifierar vid konkurs, obestånd, likvidation"
    },
    {
      "name": "BUSINESS_PROHIBITION",
      "displayName": "Näringsförbud",
      "description": "Notifierar om styrelseledamot/VH får näringsförbud"
    }
  ],
  "status": {
    "code": 200,
    "text": "OK"
  }
}
```

**⚠️ OBS:** Exakt lista på services behöver verifieras mot faktisk API-dokumentation.

---

### 2. Starta övervakning (JSON)

**PUT** `/start/{webhookId}`

Startar övervakning för specificerade företag och services.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `webhookId` | string | ✅ | ID på webhook-URL som ska ta emot events |

#### Request Body
```json
{
  "companyIds": [
    "5564881422",
    "5590523865",
    "5569876543"
  ],
  "services": [
    "BOARD_MEMBERS",
    "BENEFICIAL_OWNER",
    "ADDRESS_CHANGE"
  ]
}
```

#### Request Example
```bash
curl -X PUT \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  --data '{
    "companyIds": ["5564881422", "5590523865"],
    "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER"]
  }' \
  'https://api.roaring.io/se/company/current-information/1.0/start/{webhookId}'
```

#### Response Example
```json
{
  "status": {
    "code": 200,
    "text": "OK"
  },
  "task": {
    "id": "task-12345-abcde",
    "webhookId": "webhook-celestial-prod",
    "companyIdsCount": 2,
    "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER"],
    "status": "new",
    "startedAt": "2025-10-24T10:30:00Z",
    "completedAt": null,
    "lastModifiedAt": "2025-10-24T10:30:00Z",
    "generatedCount": 0,
    "deliveredCount": 0,
    "deliveryFailedCount": 0,
    "notFoundCount": 0,
    "validationFailedCount": 0
  }
}
```

---

### 3. Starta övervakning (fil)

**PUT** `/startWithFile/{webhookId}`

Startar övervakning med org.nr från textfil (en per rad). Användbart för stora mängder.

#### Request (multipart/form-data)
```bash
curl -X PUT \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  --form 'companyIds=@orgnummer.txt' \
  --form 'services=BOARD_MEMBERS,BENEFICIAL_OWNER' \
  'https://api.roaring.io/se/company/current-information/1.0/startWithFile/{webhookId}'
```

**orgnummer.txt exempel:**
```
5564881422
5590523865
5569876543
5512345678
```

---

### 4. Lista aktiva tasks

**GET** `/tasks`

Hämta alla dina aktiva övervakningsuppgifter.

#### Request Example
```bash
curl -X GET \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/se/company/current-information/1.0/tasks'
```

#### Response Example
```json
{
  "status": {
    "code": 200,
    "text": "OK"
  },
  "tasks": [
    {
      "id": "task-12345-abcde",
      "webhookId": "webhook-celestial-prod",
      "companyIdsCount": 150,
      "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER"],
      "status": "active",
      "startedAt": "2025-10-01T08:00:00Z",
      "lastModifiedAt": "2025-10-24T10:30:00Z",
      "generatedCount": 23,
      "deliveredCount": 22,
      "deliveryFailedCount": 1
    }
  ]
}
```

---

### 5. Lista webhooks

**GET** `/webhooks`

Lista alla dina registrerade webhooks som kan användas för current information tasks.

#### Request Example
```bash
curl -X GET \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/se/company/current-information/1.0/webhooks'
```

#### Response Example
```json
{
  "status": {
    "code": 200,
    "text": "OK"
  },
  "webhooks": [
    {
      "id": "webhook-celestial-prod",
      "url": "https://celestial.se/api/webhooks/roaring",
      "description": "Production webhook for Celestial customer monitoring",
      "created": "2025-09-01T08:00:00Z",
      "active": true
    },
    {
      "id": "webhook-celestial-test",
      "url": "https://test.celestial.se/api/webhooks/roaring",
      "description": "Test webhook for development",
      "created": "2025-09-15T10:30:00Z",
      "active": true
    }
  ]
}
```

**⚠️ OBS:** Exakt webhook-struktur behöver verifieras mot faktisk API.

---

### 6. Validera fil med org.nr

**PUT** `/validate`

Validera en textfil med organisationsnummer innan du startar en task. Användbart för att upptäcka felaktiga org.nr i stora listor.

#### Request (multipart/form-data)
```bash
curl -X PUT \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  --form 'file=@orgnummer.txt' \
  'https://api.roaring.io/se/company/current-information/1.0/validate'
```

#### Response Example
```json
{
  "fileName": "orgnummer.txt",
  "fileSize": 2.5,
  "fileSizeUnit": "K",
  "contentType": "text/plain",
  "valid": false,
  "goodIdsQuantity": 148,
  "badIdsQuantity": 2,
  "validationMessage": "Found 2 invalid organization numbers: Line 47 (55640-1234 - wrong format), Line 103 (556TEST123 - contains letters)"
}
```

**Användbart för:**
- ✅ Validera innan du startar dyr övervakning av 1000+ företag
- ✅ Upptäck typos i org.nr (556123-4567 vs 5561234567)
- ✅ Säkerställ fil-format (en org.nr per rad)

---

### 7. Status på specifik task

**GET** `/status/{currentInformationId}`

Hämta detaljerad status på en specifik övervakningsuppgift, inklusive protokoll om önskat.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `currentInformationId` | string | ✅ | Task ID från `/start` response |

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `withProtocol` | boolean | false | Inkludera detaljerad körningsprotokoll |

#### Request Example
```bash
curl -X GET \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/se/company/current-information/1.0/status/task-12345-abcde?withProtocol=true'
```

#### Response Example
```json
{
  "status": {
    "code": 200,
    "text": "OK"
  },
  "task": {
    "id": "task-12345-abcde",
    "webhookId": "webhook-celestial-prod",
    "companyIdsCount": 150,
    "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER"],
    "status": "active",
    "startedAt": "2025-10-01T08:00:00Z",
    "completedAt": null,
    "lastModifiedAt": "2025-10-24T10:30:00Z",
    "generatedCount": 23,
    "deliveredCount": 22,
    "deliveryFailedCount": 1,
    "notFoundCount": 0,
    "validationFailedCount": 0
  },
  "protocol": {
    "services": [
      {
        "serviceName": "BOARD_MEMBERS",
        "eventsGenerated": 15,
        "eventsDelivered": 15,
        "eventsFailed": 0
      },
      {
        "serviceName": "BENEFICIAL_OWNER",
        "eventsGenerated": 8,
        "eventsDelivered": 7,
        "eventsFailed": 1
      }
    ]
  }
}
```

**Task Status Values:**
- `new` - Nyligen skapad, ej startad än
- `active` - Aktiv övervakning pågår
- `paused` - Pausad (manuellt eller pga fel)
- `completed` - Avslutad (alla företag slutat övervakas)
- `failed` - Misslyckades (tekniskt fel)

**Användbart för:**
- 📊 Dashboard med statistik över övervakningsuppgifter
- 🐛 Debugging när webhooks inte kommer fram
- 📧 Proaktiv notifikation om `deliveryFailedCount` ökar

---

## Användningsfall för Celestial

### Use Case 1: Löpande PTL-övervakning av kundföretag

**Scenario:**
- Kund tecknar löpande bokföringstjänst hos Celestial
- Som del av PTL-kravet måste vi ha "aktuell information" om kunden
- Vi prenumererar på förändringar för kundens företag

**Implementation:**
```javascript
// När ny kund onboardas
async function onboardNewClient(customer) {
  // ... initial KYC ...
  
  // Starta Roaring-övervakning
  await roaring.dataUpdater.start({
    webhookId: 'celestial-prod-webhook',
    companyIds: [customer.organizationNumber],
    services: [
      'BOARD_MEMBERS',        // Nya styrelseledamöter → ny PTL-screening
      'BENEFICIAL_OWNER',     // Ägarändring → ny PTL-screening
      'ADDRESS_CHANGE',       // Adressändring → uppdatera register
      'BUSINESS_PROHIBITION', // Näringsförbud → akut åtgärd
      'FINANCIAL_EVENTS'      // Konkurs → avsluta uppdrag
    ]
  });
  
  // Spara subscription i vår databas
  await db.subscriptions.create({
    customerId: customer.id,
    roaringTaskId: task.id,
    startedAt: new Date()
  });
}
```

---

### Use Case 2: Email-notifikation till kund

**Scenario:**
- Webhook triggas: Ny styrelseledamot i kundföretag
- Vi skickar email till kunden: "Vi ser att X har tillkommit i styrelsen, vill ni att vi gör PTL-screening?"

**Webhook handler:**
```javascript
// POST /api/webhooks/roaring
app.post('/api/webhooks/roaring', async (req, res) => {
  const event = req.body;
  
  // Event structure (förväntad)
  // {
  //   "eventType": "BOARD_MEMBERS_CHANGED",
  //   "organizationNumber": "5564881422",
  //   "timestamp": "2025-10-24T14:23:00Z",
  //   "changes": {
  //     "added": [{
  //       "name": "Erik Eriksson",
  //       "personalNumber": "197506123456",
  //       "role": "Styrelseledamot",
  //       "appointedDate": "2025-10-20"
  //     }]
  //   }
  // }
  
  // Hitta kunden
  const customer = await db.customers.findOne({
    organizationNumber: event.organizationNumber
  });
  
  if (!customer) {
    return res.status(404).send('Customer not found');
  }
  
  // Skicka email via SendGrid
  await sendgrid.send({
    to: customer.email,
    from: 'info@celestial.se',
    subject: `Styrelseändring i ${customer.companyName}`,
    html: `
      <h2>Hej ${customer.contactPerson}!</h2>
      <p>Vi har upptäckt en förändring i styrelsen för ${customer.companyName}:</p>
      <ul>
        <li><strong>Ny ledamot:</strong> ${event.changes.added[0].name}</li>
        <li><strong>Personnummer:</strong> ${event.changes.added[0].personalNumber}</li>
        <li><strong>Roll:</strong> ${event.changes.added[0].role}</li>
        <li><strong>Tillträde:</strong> ${event.changes.added[0].appointedDate}</li>
      </ul>
      <p>Enligt penningtvättslagen måste vi göra en säkerhetskontroll av den nya ledamoten.</p>
      <p>Vi kommer att:</p>
      <ol>
        <li>Kontrollera att personen inte har näringsförbud</li>
        <li>Kontrollera mot PEP-register (politiskt utsatt person)</li>
        <li>Kontrollera mot sanktionslistor</li>
      </ol>
      <p>Ingen åtgärd krävs från er sida. Vi hör av oss om vi behöver mer information.</p>
      <p>Med vänlig hälsning,<br>Celestial Redovisning</p>
    `
  });
  
  // Logga händelsen
  await db.events.create({
    customerId: customer.id,
    eventType: 'BOARD_CHANGE_DETECTED',
    source: 'roaring_webhook',
    data: event,
    emailSent: true
  });
  
  res.status(200).send('OK');
});
```

---

### Use Case 3: Automatisk PTL-rescreening

**Scenario:**
- Ny verklig huvudman registrerad
- Vi kör automatiskt PTL-screening via Roaring API
- Om flaggor hittas → Email till kundansvarig + markera i system

**Implementation:**
```javascript
async function handleBeneficialOwnerChange(event) {
  const customer = await db.customers.findOne({
    organizationNumber: event.organizationNumber
  });
  
  // Hämta ny verklig huvudman-info
  const newBO = event.changes.added[0];
  
  // Kör PTL-screening
  const screening = await Promise.all([
    roaring.checkBusinessProhibition(newBO.personalNumber),
    roaring.checkPEP(newBO.personalNumber),
    roaring.checkSanctions(newBO.personalNumber)
  ]);
  
  const [prohibition, pep, sanctions] = screening;
  
  // Flaggor
  const flags = [];
  if (prohibition.hasProhibition) {
    flags.push({
      type: 'BUSINESS_PROHIBITION',
      severity: 'CRITICAL',
      details: prohibition
    });
  }
  if (pep.isPEP) {
    flags.push({
      type: 'PEP',
      severity: 'HIGH',
      details: pep
    });
  }
  if (sanctions.isSanctioned) {
    flags.push({
      type: 'SANCTIONS',
      severity: 'CRITICAL',
      details: sanctions
    });
  }
  
  // Om KRITISKA flaggor → Avbryt uppdrag
  const hasCritical = flags.some(f => f.severity === 'CRITICAL');
  
  if (hasCritical) {
    // Email till compliance officer
    await sendgrid.send({
      to: 'compliance@celestial.se',
      subject: `AKUT: Kritisk flagga för ${customer.companyName}`,
      html: `
        <h2>Kritisk PTL-varning</h2>
        <p>Ny verklig huvudman hos kund ${customer.companyName} har kritiska flaggor:</p>
        <ul>
          ${flags.map(f => `<li>${f.type}: ${JSON.stringify(f.details)}</li>`).join('')}
        </ul>
        <p><strong>Åtgärd:</strong> Överväg att avsluta uppdraget enligt PTL 3 kap 13 §</p>
      `
    });
    
    // Markera kund som "High Risk - Under Review"
    await db.customers.update(customer.id, {
      riskLevel: 'CRITICAL_REVIEW',
      lastScreening: new Date(),
      flags: flags
    });
  }
}
```

---

## Implementation med email

### Setup-guide för Celestial

#### 1. Registrera webhook hos Roaring
```bash
# (Detta görs troligen via Roaring portal, inte API)
# Webhook URL: https://celestial.se/api/webhooks/roaring
# Webhook ID: celestial-prod-webhook
```

#### 2. Bygg webhook-mottagare
```javascript
// backend/routes/webhooks.js
const express = require('express');
const router = express.Router();

router.post('/roaring', async (req, res) => {
  try {
    const event = req.body;
    
    // Validera webhook (HMAC signature, IP whitelist, etc.)
    if (!validateRoaringWebhook(req)) {
      return res.status(401).send('Unauthorized');
    }
    
    // Hantera olika event types
    switch (event.eventType) {
      case 'BOARD_MEMBERS_CHANGED':
        await handleBoardChange(event);
        break;
      case 'BENEFICIAL_OWNER_CHANGED':
        await handleBeneficialOwnerChange(event);
        break;
      case 'ADDRESS_CHANGED':
        await handleAddressChange(event);
        break;
      case 'BUSINESS_PROHIBITION_ISSUED':
        await handleBusinessProhibition(event);
        break;
      case 'FINANCIAL_EVENT':
        await handleFinancialEvent(event);
        break;
      default:
        console.warn('Unknown event type:', event.eventType);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Internal error');
  }
});

module.exports = router;
```

#### 3. Prenumerera på kundföretag vid onboarding
```javascript
// När kund signar avtal
async function startCustomerMonitoring(customer) {
  const task = await roaring.dataUpdater.start({
    webhookId: 'celestial-prod-webhook',
    companyIds: [customer.organizationNumber],
    services: [
      'BOARD_MEMBERS',
      'BENEFICIAL_OWNER',
      'ADDRESS_CHANGE',
      'BUSINESS_PROHIBITION',
      'FINANCIAL_EVENTS'
    ]
  });
  
  // Spara task ID
  await db.customers.update(customer.id, {
    roaringTaskId: task.id,
    monitoringStarted: new Date()
  });
}
```

#### 4. Avsluta prenumeration vid avslut av uppdrag
```javascript
async function stopCustomerMonitoring(customer) {
  // (Roaring har troligen DELETE /tasks/{taskId} endpoint)
  await roaring.dataUpdater.stopTask(customer.roaringTaskId);
  
  await db.customers.update(customer.id, {
    roaringTaskId: null,
    monitoringStopped: new Date()
  });
}
```

---

## Webhook-testning

### Setup för testning

#### Steg 1: Bygg lokal webhook-mottagare

**Enkel Express.js server för test:**

```javascript
// test_webhook_receiver.js
const express = require('express');
const app = express();

app.use(express.json());

// Webhook endpoint
app.post('/webhooks/roaring', (req, res) => {
  console.log('=== WEBHOOK MOTTAGEN ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Event Type:', req.body.eventType);
  console.log('Org.nr:', req.body.organizationNumber);
  console.log('Full body:', JSON.stringify(req.body, null, 2));
  console.log('========================\n');
  
  res.status(200).send('OK');
});

// Hälsocheck
app.get('/health', (req, res) => {
  res.send('Webhook receiver is running');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Webhook receiver listening on http://localhost:${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhooks/roaring`);
});
```

**Kör:**
```bash
node test_webhook_receiver.js
```

---

#### Steg 2: Exponera lokalt med ngrok

Eftersom Roaring behöver nå din lokala server, använd [ngrok](https://ngrok.com/):

```bash
# Installera ngrok (om inte redan gjort)
# https://ngrok.com/download

# Starta tunnel till port 3000
ngrok http 3000
```

**Output:**
```
Forwarding   https://abc123.ngrok.io -> http://localhost:3000
```

**Din webhook-URL blir då:**
```
https://abc123.ngrok.io/webhooks/roaring
```

⚠️ **OBS:** Ngrok-URL ändras varje gång du startar om. För produktion, använd fast domän (celestial.se).

---

#### Steg 3: Registrera webhook hos Roaring

**(Antagligen görs detta via Roaring developer portal, inte API)**

1. Gå till Roaring developer portal
2. Navigera till "Webhooks"
3. Skapa ny webhook:
   - **URL:** `https://abc123.ngrok.io/webhooks/roaring`
   - **Description:** "Test webhook for Celestial development"
   - **Active:** Yes
4. Kopiera **Webhook ID** (t.ex. `webhook-test-123`)

---

#### Steg 4: Starta övervakningsuppgift med testföretag

**Test med Perfect Company (5564881422):**

```bash
curl -X PUT \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  --data '{
    "companyIds": ["5564881422"],
    "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER", "ADDRESS_CHANGE"]
  }' \
  'https://api.roaring.io/se/company/current-information/1.0/start/webhook-test-123'
```

**Förväntat resultat:**
```json
{
  "status": {"code": 200, "text": "OK"},
  "task": {
    "id": "task-abc-123",
    "webhookId": "webhook-test-123",
    "companyIdsCount": 1,
    "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER", "ADDRESS_CHANGE"],
    "status": "active",
    "startedAt": "2025-10-24T14:00:00Z"
  }
}
```

Spara **task ID**: `task-abc-123`

---

#### Steg 5: Övervaka webhook-mottagare

**Terminal med ngrok:**
```
HTTP Requests
-------------
POST /webhooks/roaring  200 OK
```

**Terminal med Node.js:**
```
=== WEBHOOK MOTTAGEN ===
Timestamp: 2025-10-24T14:05:23.456Z
Event Type: BOARD_MEMBERS_CHANGED
Org.nr: 5564881422
Full body: {
  "eventType": "BOARD_MEMBERS_CHANGED",
  "organizationNumber": "5564881422",
  "timestamp": "2025-10-24T14:05:20Z",
  "changes": {
    "added": [...],
    "removed": [...]
  }
}
========================
```

---

#### Steg 6: Kontrollera task-status

```bash
curl -X GET \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/se/company/current-information/1.0/status/task-abc-123?withProtocol=true'
```

**Förväntat:**
```json
{
  "task": {
    "id": "task-abc-123",
    "status": "active",
    "generatedCount": 1,
    "deliveredCount": 1,
    "deliveryFailedCount": 0
  },
  "protocol": {
    "services": [
      {
        "serviceName": "BOARD_MEMBERS",
        "eventsGenerated": 1,
        "eventsDelivered": 1
      }
    ]
  }
}
```

---

### Testscenarier

#### Test 1: Grundläggande webhook-mottagning
**Mål:** Verifiera att webhook når vår server

1. Starta lokal mottagare
2. Starta ngrok
3. Registrera webhook hos Roaring
4. Starta task för 1 testföretag
5. Vänta på event (eller trigga manuellt om möjligt)

**Framgång:** Webhook loggas i konsol

---

#### Test 2: Filvalidering
**Mål:** Testa att filvalidering fungerar

**Skapa testfil `test_orgnr.txt`:**
```
5564881422
5590523865
556INVALID
5569876543
55640-1234
```

**Validera:**
```bash
curl -X PUT \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  --form 'file=@test_orgnr.txt' \
  'https://api.roaring.io/se/company/current-information/1.0/validate'
```

**Förväntat:**
```json
{
  "fileName": "test_orgnr.txt",
  "valid": false,
  "goodIdsQuantity": 3,
  "badIdsQuantity": 2,
  "validationMessage": "Found 2 invalid organization numbers: Line 3 (556INVALID), Line 5 (55640-1234)"
}
```

---

#### Test 3: Lista webhooks
**Mål:** Se alla registrerade webhooks

```bash
curl -X GET \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/se/company/current-information/1.0/webhooks'
```

**Framgång:** Ser webhook-test-123 i listan

---

#### Test 4: Lista aktiva tasks
**Mål:** Se alla övervakningsuppgifter

```bash
curl -X GET \
  --header 'Authorization: Bearer {ACCESS_TOKEN}' \
  'https://api.roaring.io/se/company/current-information/1.0/tasks'
```

**Framgång:** Ser task-abc-123 i listan med status "active"

---

#### Test 5: Webhook-failure handling
**Mål:** Testa vad som händer om webhook-mottagaren är nere

1. Stoppa Node.js-servern (Ctrl+C)
2. Vänta på event från Roaring
3. Kontrollera task-status

**Förväntat:**
```json
{
  "task": {
    "deliveredCount": 5,
    "deliveryFailedCount": 2  // <- Ökar när mottagare är nere
  }
}
```

**Frågor att utreda:**
- Hur många gånger försöker Roaring igen (retry)?
- Hur lång tid mellan retries?
- Sparas missade events någonstans?
- Kan vi hämta missade events i efterhand?

---

### Python test-skript

**Komplett test-script för Data Updater API:**

```python
#!/usr/bin/env python3
"""
Test script for Roaring Data Updater (Webhook) API
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "https://api.roaring.io/se/company/current-information/1.0"
ACCESS_TOKEN = "your_access_token_here"
WEBHOOK_ID = "webhook-test-123"

headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

def test_list_services():
    """Test 1: Lista tillgängliga services"""
    print("\n=== TEST 1: Lista services ===")
    
    response = requests.get(
        f"{BASE_URL}/services",
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    data = response.json()
    
    if response.status_code == 200:
        print(f"Antal services: {len(data.get('services', []))}")
        for service in data.get('services', []):
            print(f"  - {service.get('name')}: {service.get('displayName')}")
    else:
        print(f"Error: {data}")
    
    return data

def test_list_webhooks():
    """Test 2: Lista webhooks"""
    print("\n=== TEST 2: Lista webhooks ===")
    
    response = requests.get(
        f"{BASE_URL}/webhooks",
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    data = response.json()
    
    if response.status_code == 200:
        webhooks = data.get('webhooks', [])
        print(f"Antal webhooks: {len(webhooks)}")
        for wh in webhooks:
            print(f"  - {wh.get('id')}: {wh.get('url')}")
            print(f"    Active: {wh.get('active')}")
    else:
        print(f"Error: {data}")
    
    return data

def test_validate_file():
    """Test 3: Validera fil med org.nr"""
    print("\n=== TEST 3: Validera fil ===")
    
    # Skapa testfil
    test_file_content = """5564881422
5590523865
556INVALID
5569876543"""
    
    with open('/tmp/test_orgnr.txt', 'w') as f:
        f.write(test_file_content)
    
    # Ladda upp för validering
    with open('/tmp/test_orgnr.txt', 'rb') as f:
        files = {'file': ('test_orgnr.txt', f, 'text/plain')}
        response = requests.put(
            f"{BASE_URL}/validate",
            headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
            files=files
        )
    
    print(f"Status: {response.status_code}")
    data = response.json()
    
    if response.status_code == 200:
        print(f"Fil: {data.get('fileName')}")
        print(f"Valid: {data.get('valid')}")
        print(f"Giltiga: {data.get('goodIdsQuantity')}")
        print(f"Ogiltiga: {data.get('badIdsQuantity')}")
        if data.get('validationMessage'):
            print(f"Meddelande: {data.get('validationMessage')}")
    else:
        print(f"Error: {data}")
    
    return data

def test_start_task():
    """Test 4: Starta övervakningsuppgift"""
    print("\n=== TEST 4: Starta task ===")
    
    payload = {
        "companyIds": ["5564881422"],
        "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER"]
    }
    
    response = requests.put(
        f"{BASE_URL}/start/{WEBHOOK_ID}",
        headers=headers,
        json=payload
    )
    
    print(f"Status: {response.status_code}")
    data = response.json()
    
    if response.status_code == 200:
        task = data.get('task', {})
        task_id = task.get('id')
        print(f"Task ID: {task_id}")
        print(f"Webhook ID: {task.get('webhookId')}")
        print(f"Antal företag: {task.get('companyIdsCount')}")
        print(f"Services: {task.get('services')}")
        print(f"Status: {task.get('status')}")
        return task_id
    else:
        print(f"Error: {data}")
        return None

def test_list_tasks():
    """Test 5: Lista aktiva tasks"""
    print("\n=== TEST 5: Lista tasks ===")
    
    response = requests.get(
        f"{BASE_URL}/tasks",
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    data = response.json()
    
    if response.status_code == 200:
        tasks = data.get('tasks', [])
        print(f"Antal tasks: {len(tasks)}")
        for task in tasks:
            print(f"\n  Task: {task.get('id')}")
            print(f"  Status: {task.get('status')}")
            print(f"  Företag: {task.get('companyIdsCount')}")
            print(f"  Generated: {task.get('generatedCount')}")
            print(f"  Delivered: {task.get('deliveredCount')}")
            print(f"  Failed: {task.get('deliveryFailedCount')}")
    else:
        print(f"Error: {data}")
    
    return data

def test_task_status(task_id):
    """Test 6: Hämta status på specifik task"""
    print(f"\n=== TEST 6: Task status ({task_id}) ===")
    
    response = requests.get(
        f"{BASE_URL}/status/{task_id}?withProtocol=true",
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    data = response.json()
    
    if response.status_code == 200:
        task = data.get('task', {})
        protocol = data.get('protocol', {})
        
        print(f"Task status: {task.get('status')}")
        print(f"Started: {task.get('startedAt')}")
        print(f"Last modified: {task.get('lastModifiedAt')}")
        print(f"\nStatistik:")
        print(f"  Generated: {task.get('generatedCount')}")
        print(f"  Delivered: {task.get('deliveredCount')}")
        print(f"  Failed: {task.get('deliveryFailedCount')}")
        
        if protocol and 'services' in protocol:
            print(f"\nProtokoll per service:")
            for svc in protocol['services']:
                print(f"  {svc.get('serviceName')}:")
                print(f"    Generated: {svc.get('eventsGenerated')}")
                print(f"    Delivered: {svc.get('eventsDelivered')}")
                print(f"    Failed: {svc.get('eventsFailed')}")
    else:
        print(f"Error: {data}")
    
    return data

def main():
    print("=" * 60)
    print("ROARING DATA UPDATER (WEBHOOK) API TEST")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"Base URL: {BASE_URL}")
    print(f"Webhook ID: {WEBHOOK_ID}")
    
    # Kör tester
    test_list_services()
    test_list_webhooks()
    test_validate_file()
    test_list_tasks()
    
    # Starta ny task
    task_id = test_start_task()
    
    if task_id:
        # Vänta lite innan vi kollar status
        print("\nVäntar 5 sekunder...")
        time.sleep(5)
        
        test_task_status(task_id)
    
    print("\n" + "=" * 60)
    print("TESTER KLARA")
    print("=" * 60)

if __name__ == "__main__":
    main()
```

**Kör:**
```bash
python3 test_data_updater.py
```

---

## Kostnadsmodell (TBD)

### Oklart:
❓ **Hur tar Roaring betalt?**
- Per företag som övervakas?
- Per webhook-event som skickas?
- Flat fee per månad?
- Tiered pricing baserat på antal företag?

❓ **Hur ska vi ta betalt av kunder?**
- Inkluderat i löpande bokföringsavgift?
- Separat tillval: "Företagsövervakning +99 kr/mån"?
- Gratis för Premium-kunder, betalt för Basic?

❓ **Vad händer vid många events?**
- Om 1 företag har 50 styrelseändringar per år → 50 events
- Hur skalas kostnaden?

### Förslag på modell:
**Variant A: Inkluderat i basavgift**
- "Företagsövervakning ingår i alla uppdrag"
- Vi äter kostnaden som en del av PTL-compliance
- Fördel: Inga extra faktureringskostnader, bättre kundupplevelse
- Nackdel: Kan bli dyrt om Roaring tar betalt per event

**Variant B: Tillval**
- "Företagsövervakning: +149 kr/mån"
- Kund väljer om de vill ha proaktiva notifikationer
- Fördel: Täcker kostnad, frivilligt för kund
- Nackdel: Ökar komplexitet, färre kunder väljer det

**Variant C: Endast för Premium-segment**
- Basic (bokföring): Ingen övervakning
- Premium (bokföring + rådgivning): Övervakning ingår
- Fördel: Differentiering, höjer värdet på Premium
- Nackdel: Basic-kunder får ingen PTL-uppdatering

---

## Nästa steg

### Teknisk implementation
- [ ] Bygg webhook-mottagare i backend
- [ ] Integrera SendGrid för email-notifikationer
- [ ] Testa webhook med Roaring sandbox
- [ ] Definiera event handlers för varje typ
- [ ] Implementera retry-logic för misslyckade webhooks

### Affär/Juridik
- [ ] **KRITISKT:** Klargör prissättning med Roaring
- [ ] Beslut: Inkludera i basavgift eller tillval?
- [ ] Uppdatera kundavtal med "företagsövervakningsklausul"
- [ ] GDPR-dokumentation (webhook = persondata processing)

### Dokumentation
- [ ] Verifiera faktiska event-strukturer från Roaring
- [ ] Lista alla tillgängliga services
- [ ] Dokumentera webhook-säkerhet (HMAC, IP whitelist)
- [ ] Skapa runbook för webhook-fel

---

## Referenser

### Roaring API
- **Base URL:** `https://api.roaring.io/se/company/current-information/1.0`
- **Dokumentation:** (länk till Roaring developer portal)

### PTL-krav för löpande övervakning
- **PTL 3 kap 9 §:** Verksamhetsutövaren ska löpande uppdatera de åtgärder för kundkännedom som har vidtagits
- **Länsstyrelsen vägledning:** Vad räknas som "löpande"? Årlig genomgång? Kontinuerlig övervakning?

---

**Senast uppdaterat:** 2025-10-24  
**Status:** Avvaktar prissättningsbeslut från Roaring  
**Nästa:** Beneficial Owner API (test-skript)
