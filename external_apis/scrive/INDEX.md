# Scrive - E-Signature & BankID Integration

**Status:** 🟢 Vald leverantör för Agreement Management  
**Prissättning:** Pay-as-you-go till självkostnadspris (~70 kr/signering)  
**API-dokumentation:** https://apidocs.scrive.com/  
**Skapad:** 2025-11-02  

---

## Översikt

**Scrive** är vår valda leverantör för elektroniska signaturer med BankID-integration. De hanterar hela avtalsflödet från PDF-generering till signering och lagring.

### Varför Scrive?

✅ **BankID-integration inkluderad** - Ingen egen BankID-setup behövs  
✅ **PDF-generering** - API:et hanterar dokumentskapande  
✅ **GDPR-compliant lagring** - De sparar signerade avtal säkert  
✅ **Pay-as-you-go** - Betala endast för det ni använder (~70 kr/signering)  
✅ **Svenskt företag** - Support på svenska, förstår svensk compliance  
✅ **Webhook-stöd** - Asynkron hantering av signeringsstatus  

### Alternativ vi övervägde:

- ❌ **Direkt BankID-integration** - För dyrt att bygga egen (200k kr dev + 50k/år underhåll)
- ❌ **GetAccept** - Liknande funktionalitet men fokus på säljprocesser
- ❌ **Signicat** - För stort/dyrt för vårt behov (enterprise-fokus)

---

## Use Cases i Celestial

### 1. Trial Agreement (Prova-på-avtal)
**När:** Första onboarding-sessionen  
**Signerar:** Byråchefen (BankID)  
**Innehåll:**
- Avtalstecken utan fast pris (juridisk grund)
- Text: "Kostnad beräknas efter SIE-analys"
- Signeras INNAN SIE-uppladdning

**Flöde:**
```
1. Byråchef startar trial
2. Backend skapar Scrive-dokument (API)
3. Byråchef får BankID-prompt
4. Efter signering → Scrive webhook → Backend sparar avtalet
5. Byråchef laddar upp SIE → Backend räknar pris
6. Byråchef väljer år för analys → Stripe-betalning
```

### 2. Subscription Agreement (Företagsavtal)
**När:** Konvertering från trial till prenumeration  
**Signerar:** Byråchefen (BankID)  
**Innehåll:**
- Fast pris: 1,995 kr/mån
- Rörliga API-kostnader faktureras månadsvis
- Löpande avtal (månad för månad)

### 3. Assignment Agreement (Uppdragsavtal)
**När:** Varje ny kund-onboarding (efter trial)  
**Signerar:** Slutkunden (företagare som onboardas) via BankID  
**Innehåll:**
- Specifik kostnad för den onboarding-sessionen
- KYC-kostnad + forensisk analys för valda år
- Genereras per session

---

## API-integration

### Autentisering

Scrive använder OAuth 2.0 Client Credentials:

```python
import requests

# Hämta access token
response = requests.post('https://api.scrive.com/oauth/token',
    data={
        'grant_type': 'client_credentials',
        'client_id': SCRIVE_CLIENT_ID,
        'client_secret': SCRIVE_CLIENT_SECRET
    }
)

access_token = response.json()['access_token']
```

### Skapa och skicka dokument för signering

```python
# 1. Skapa dokument
response = requests.post('https://api.scrive.com/api/v2/documents/new',
    headers={'Authorization': f'Bearer {access_token}'},
    json={
        "document": {
            "title": "Prova-på-avtal - Celestial Accounting",
            "parties": [{
                "id": 1,
                "role": "signatory",
                "fields": {
                    "name": "Lasse Andersson",
                    "email": "lasse@revisionstockholm.se",
                    "mobile": "+46701234567"
                },
                "authentication": {
                    "method": "se_bankid",
                    "personal_number": "198503151234"  # Optional för pre-fill
                }
            }],
            "file": {
                "name": "trial_agreement.pdf",
                "content": base64_encoded_pdf  # Base64-encoded PDF
            }
        }
    }
)

document_id = response.json()['id']

# 2. Skicka för signering
requests.post(f'https://api.scrive.com/api/v2/documents/{document_id}/send',
    headers={'Authorization': f'Bearer {access_token}'}
)

# Response innehåller:
# - signing_url: URL för BankID-signering
# - document_id: För tracking
```

### Webhook för signering

```python
# Backend endpoint (FastAPI)
@app.post("/webhook/scrive")
async def scrive_webhook(request: Request):
    """
    Scrive skickar webhook när dokument signeras
    """
    data = await request.json()
    
    if data['event'] == 'document_signed':
        document_id = data['document']['id']
        
        # Hämta signerad PDF
        response = requests.get(
            f'https://api.scrive.com/api/v2/documents/{document_id}/files/main',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        signed_pdf = response.content
        
        # Spara i databas
        agreement = Agreement(
            id=uuid4(),
            firm_id=data['document']['metadata']['firm_id'],
            agreement_type='trial',
            scrive_document_id=document_id,
            signed_at=data['document']['signing_time'],
            signer_name=data['parties'][0]['fields']['name'],
            signer_personnr=data['parties'][0]['authentication']['personal_number'],
            pdf_url=f'https://celestial-agreements.fra1.digitaloceanspaces.com/...',
            status='completed'
        )
        db.add(agreement)
        db.commit()
        
        # Upload PDF till DigitalOcean Spaces
        upload_to_spaces(signed_pdf, agreement.pdf_url)
        
        return {"status": "ok"}
```

### Hämta signerad PDF

```python
# Hämta signerad PDF
response = requests.get(
    f'https://api.scrive.com/api/v2/documents/{document_id}/files/main',
    headers={'Authorization': f'Bearer {access_token}'}
)

with open('signed_agreement.pdf', 'wb') as f:
    f.write(response.content)
```

---

## Metadata och Custom Fields

Scrive låter dig lägga till custom metadata för att koppla dokument till er databas:

```python
"document": {
    "title": "Trial Agreement",
    "metadata": {
        "firm_id": "uuid-revisionstockholm",
        "agreement_type": "trial",
        "session_id": "uuid-onboarding-abc123",
        "internal_reference": "TRIAL-2025-1102-A4F7"
    }
}
```

Detta returneras i webhooks och gör det lätt att matcha signerade dokument mot er databas.

---

## Kostnadsberäkning

### Pay-as-you-go prissättning:

```
Scrive självkostnadspris (pay-as-you-go):
- BankID-signering: ~70 kr/dokument
- Enkel e-signering (utan BankID): ~20 kr/dokument
- SMS-notifikation: ~1 kr/SMS

Ingen månadskostnad, endast per signering.
```

### Scenario: 100 byråer första året

```
Kostnader år 1:
- Trial agreements: 100 × 70 kr = 7,000 kr
- Subscription agreements: 100 × 70 kr = 7,000 kr
- Assignment agreements (avg 5/byrå): 500 × 70 kr = 35,000 kr

Total årskostnad: ~49,000 kr

Jämfört med egen BankID-integration: 250,000 kr (dev + setup)
Besparing år 1: 201,000 kr! 🎉
```

---

## Implementation Checklist

### Steg 1: Setup (innan implementation)
- [ ] Kontakta Scrive sales för pay-as-you-go-avtal
- [ ] Få sandbox API-credentials (test-miljö)
- [ ] Få production API-credentials
- [ ] Konfigurera webhook URL i Scrive admin

### Steg 2: Backend Integration
- [ ] Implementera OAuth 2.0 autentisering
- [ ] Skapa endpoint: POST `/api/agreements/create-trial`
- [ ] Implementera Scrive document creation
- [ ] Implementera webhook listener: POST `/webhook/scrive`
- [ ] PDF-upload till DigitalOcean Spaces efter signering
- [ ] Database insert för agreements-tabellen

### Steg 3: Frontend Integration
- [ ] BankID-signing popup (visa Scrive signing URL)
- [ ] Polling för signering-status
- [ ] Visa "Väntar på signering..."-meddelande
- [ ] Redirect efter lyckad signering

### Steg 4: Testing
- [ ] Testa med Scrive sandbox (test BankID)
- [ ] Verifiera webhook delivery
- [ ] Testa PDF-nedladdning från Spaces
- [ ] Testa alla tre avtalstyper (trial, subscription, assignment)

### Steg 5: Production
- [ ] Byt till production API-credentials
- [ ] Testa med riktigt BankID
- [ ] Monitera webhook-failure rate
- [ ] Sätt upp alerting för misslyckade webhooks

---

## Databas-integration

### Spara Scrive-metadata

```sql
-- Lägg till Scrive-specifika fält i agreements-tabellen
ALTER TABLE agreements ADD COLUMN scrive_document_id VARCHAR(255);
ALTER TABLE agreements ADD COLUMN scrive_signing_url TEXT;
ALTER TABLE agreements ADD COLUMN scrive_webhook_received_at TIMESTAMP;

CREATE INDEX idx_agreements_scrive_document_id ON agreements(scrive_document_id);
```

### Exempel agreement record efter Scrive-signering

```python
agreement = {
    "id": "uuid-trial-12345",
    "firm_id": "uuid-revisionstockholm",
    "agreement_type": "trial",
    "agreement_number": "TRIAL-2025-1102-A4F7",
    
    # Scrive-specifikt
    "scrive_document_id": "9876543210",
    "scrive_signing_url": "https://sign.scrive.com/9876543210",
    "scrive_webhook_received_at": "2025-11-02T14:32:15Z",
    
    # Standard fields
    "signed_at": "2025-11-02T14:32:15Z",
    "signer_name": "Lasse Andersson",
    "signer_personnr": "19850315XXXX",  # Från Scrive webhook
    "pdf_url": "https://celestial-agreements.fra1.digitaloceanspaces.com/...",
    "status": "completed"
}
```

---

## Error Handling

### Common errors

**1. Signering timeout (15 minuter)**
```python
if data['event'] == 'document_timeout':
    # Användaren signerade inte inom 15 min
    # Markera agreement som "expired"
    # Skicka påminnelse-email
```

**2. Signering nekad**
```python
if data['event'] == 'document_declined':
    # Användaren avbröt BankID-signeringen
    # Markera agreement som "declined"
    # Låt användare försöka igen
```

**3. BankID-fel**
```python
if data['event'] == 'document_error':
    # Tekniskt fel med BankID
    # Logga error
    # Notify support
    # Låt användare försöka igen
```

---

## Säkerhet & GDPR

### Personuppgifter från Scrive

Scrive returnerar personnummer i webhook (efter BankID-signering). Vi måste:

1. **Encrypt personnummer** innan databas-insert (bcrypt)
2. **Mask personnummer** i UI (19850315-XXXX)
3. **Logga all access** till personnummer (audit trail)
4. **Retention policy** - Ta bort personnummer efter 7 år (Bokföringslagen)

### Scrive GDPR-compliance

Scrive är GDPR-compliant och hanterar:
- ✅ Right to access (användare kan begära sina data)
- ✅ Right to deletion (vi kan be Scrive radera dokument)
- ✅ Data portability (vi kan exportera signerade PDFer)
- ✅ Encrypted storage (Scrive krypterar all data at rest)

**OBS:** Vi måste fortfarande ha vårt eget DPA (Data Processing Agreement) med Scrive.

---

## Support & Dokumentation

### Länkar

- **API-dokumentation:** https://apidocs.scrive.com/
- **Sandbox:** https://sandbox.scrive.com/
- **Support:** support@scrive.com
- **Status page:** https://status.scrive.com/

### Vår kontakt på Scrive

**TODO:** Lägg till kontaktperson när avtal tecknat

---

## Nästa steg

1. ✅ Dokumentera Scrive som vald leverantör
2. ⏳ Kontakta Scrive sales för pay-as-you-go-avtal
3. ⏳ Få sandbox credentials
4. ⏳ Implementera backend-integration (tic-tac-toe-server)
5. ⏳ Implementera frontend BankID-popup
6. ⏳ Testa i sandbox
7. ⏳ Production deploy

---

**Senast uppdaterad:** 2025-11-02
