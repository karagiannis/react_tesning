# Admin Dashboard v2 - Celestial's Kunddashboard

**Datum:** 2025-11-01  
**Status:** 🆕 Ny specifikation - Iteration 2  
**Syfte:** Celestial hanterar sina B2B-kunder (redovisningsbyråerna)  
**Ersätter:** Admin_Dashboard_Spec.tex (v1 - fokuserade på fraud detection för Finanspolisen)

---

## Översikt

**Vad är skillnaden från v1?**

| **v1 (Admin_Dashboard_Spec.tex)** | **v2 (denna spec)** |
|-----------------------------------|---------------------|
| Fokus: Fraud detection för Finanspolisen | Fokus: B2B customer management (redovisningsbyråer) |
| Demo-koncept för säljpitch | Produktionssystem för live kunder |
| Mock data för revisionsbyråer | Real data från PostgreSQL |
| 5 flikar: Översikt, Fraud, Support, Fakturering, Email | TBD - vilka features behövs? |

**Ny målgrupp:**
- **Celestial's anställda:** Hanterar redovisningsbyråer som kunder
- **Customer Success:** Onboarding av nya byråer, support, uppföljning
- **Ekonomi:** Fakturahantering, prenumerationer, betalningsstatus
- **Säljteam:** Pipeline-hantering, demos, uppföljning av trials

---

## Frågeställning: Vilka features behöver Celestial?

Innan vi designar UI:et - låt oss identifiera **vad Celestial behöver göra** med sina kunder:

### 1. Customer Management (Byråöversikt)

**Vad ska Celestial se?**
- [ ] Alla registrerade redovisningsbyråer (tabell/kort)
- [ ] Företagsinformation (org.nr, kontaktperson, telefon, email, adress)
- [ ] Registreringsdatum
- [ ] Senaste inloggning
- [ ] Prenumerationsstatus (Trial / Active / Paused / Cancelled)
- [ ] Antal användare per byrå
- [ ] Total revenue från byrån (lifetime value)

**Vad ska Celestial kunna göra?**
- [ ] Söka efter specifik byrå (företagsnamn, org.nr, kontaktperson)
- [ ] Filtrera byråer (status, registreringsdatum, prenumeration)
- [ ] Klicka på byrå → Öppna detaljvy med full historik
- [ ] Manuellt skapa ny byrå (för offline-signups)
- [ ] Pausa/Avsluta prenumeration
- [ ] Markera byrå som "VIP" eller "High-touch"
- [ ] **Visa och ladda ner alla avtal för byrån** (prova-på, prenumeration, uppdrag)

#### 1.1 Avtalsvy i Byrådetaljvy (NY FUNKTION)

**Syfte:** Celestial behöver se alla BankID-signerade avtal för varje byrå för:
- Legal compliance (GDPR audit)
- Support-ärenden ("Skicka mig mitt avtal igen")
- Kontroll av betalda onboardings (vilka uppdragsavtal har genererats?)
- Ekonomi (vad har byråerna faktiskt avtalat om?)

**UI - Avtalsflik i Byrådetaljvy:**

När Celestial klickar på en byrå → Öppnas detaljvy med flikar:
```
┌──────────────────────────────────────────────────────────────────────┐
│  📋 Revision Stockholm AB (556789-1234)                    [✖ Stäng] │
│                                                                      │
│  [Översikt] [Användare] [Avtal] [Fakturor] [Support] [Aktivitet]   │
│                                                                      │
│  ─────────────── Avtalsflik vald ─────────────────                  │
│                                                                      │
│  📄 Alla avtal för Revision Stockholm AB                            │
│                                                                      │
│  🔵 Prova-på-avtal (Trial Agreement)                                │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  ✅ Signerat: 2025-11-02 14:32:15                          │    │
│  │  📝 Avtalsnummer: TRIAL-2025-1102-A4F7                     │    │
│  │  👤 Signatär: Lasse Andersson                             │    │
│  │  🆔 Personnummer: 19850315-XXXX (maskerat för GDPR)       │    │
│  │  🔐 BankID-transaktions-ID: abc123def456...               │    │
│  │                                                            │    │
│  │  Kostnad:                                                  │    │
│  │    • Statisk KYC: 18 kr                                    │    │
│  │    • Forensisk analys:                                     │    │
│  │       - År 2024 (30 transaktioner): 60 kr                 │    │
│  │       - År 2023 (500 transaktioner): 1,000 kr             │    │
│  │       - År 2022 (100 transaktioner): 200 kr               │    │
│  │    • Totalt: 1,278 kr (betalt 2025-11-02 14:35 via Stripe)│    │
│  │                                                            │    │
│  │  Status: ✅ Genomförd (2025-11-02 15:10)                   │    │
│  │                                                            │    │
│  │  Stripe Payment ID: pi_1234567890abcdef                   │    │
│  │  PDF URL: https://celestial-agreements.fra1.digital...    │    │
│  │                                                            │    │
│  │  [📄 Ladda ner PDF]  [🔍 Visa BankID-kvitto]  [📋 Audit log]│    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  🟢 Företagsavtal (Subscription Agreement)                          │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  ✅ Signerat: 2025-11-05 10:15:42                          │    │
│  │  📝 Avtalsnummer: SUB-2025-1105-B9E2                       │    │
│  │  👤 Signatär: Lasse Andersson                             │    │
│  │  🆔 Personnummer: 19850315-XXXX (maskerat)                │    │
│  │  🔐 BankID-transaktions-ID: ghi789jkl012...               │    │
│  │                                                            │    │
│  │  Prenumeration:                                            │    │
│  │    • Fast pris: 1,995 kr/mån                               │    │
│  │    • Rörliga API-kostnader faktureras månadsvis            │    │
│  │    • Startdatum: 2025-11-05                                │    │
│  │    • Nästa faktura: 2025-12-05                             │    │
│  │    • Betalningsmetod: Kort (•••• 4242)                     │    │
│  │                                                            │    │
│  │  Status: ✅ Aktivt                                          │    │
│  │                                                            │    │
│  │  PDF URL: https://celestial-agreements.fra1.digital...    │    │
│  │                                                            │    │
│  │  [📄 Ladda ner PDF]  [🔍 Visa BankID-kvitto]  [📋 Audit log]│    │
│  │  [⏸️ Pausa prenumeration]  [❌ Avsluta prenumeration]       │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  🟡 Uppdragsavtal (Assignment Agreements) - 5 st                    │
│                                                                      │
│  Tabell:                                                             │
│  Avtalsnr         Företag              Signerat     Kostnad  Status │
│  ──────────────────────────────────────────────────────────────────│
│  ASSIGN-2025-1110 Johanssons Bygg AB  2025-11-10  2,141 kr  ✅     │
│  ASSIGN-2025-1108 Svenssons Handel AB 2025-11-08  1,562 kr  ✅     │
│  ASSIGN-2025-1105 Nordiska AB         2025-11-05    982 kr  ✅     │
│  ASSIGN-2025-1101 Beta Corp AB        2025-11-01  1,234 kr  ✅     │
│  ASSIGN-2025-1029 Acme Industries AB  2025-10-29  3,456 kr  ✅     │
│                                                                      │
│  [Visa alla uppdragsavtal (5)]                                      │
│                                                                      │
│  Klicka på rad → Öppnar detaljvy i modal:                           │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  📝 Uppdragsavtal: ASSIGN-2025-1110-C3D8          [✖]     │    │
│  │                                                            │    │
│  │  ✅ Signerat: 2025-11-10 09:45:12                          │    │
│  │  👤 Signatär: Erik Johansson (19920520-XXXX)              │    │
│  │  🏢 Företag: Johanssons Bygg AB (556123-4567)             │    │
│  │  🔐 BankID-transaktions-ID: mno345pqr678...               │    │
│  │                                                            │    │
│  │  Kostnad:                                                  │    │
│  │    • Statisk KYC: 18 kr                                    │    │
│  │    • Forensisk analys:                                     │    │
│  │       - År 2024 (45 transaktioner): 90 kr                 │    │
│  │       - År 2023 (800 transaktioner): 1,600 kr             │    │
│  │       - År 2022 (200 transaktioner): 400 kr               │    │
│  │       - År 2021 (15 transaktioner): 30 kr                 │    │
│  │       - År 2020 (1 transaktioner): 2 kr                   │    │
│  │    • Totalt: 2,141 kr (fakturerat till byrån)             │    │
│  │                                                            │    │
│  │  Status: ✅ Genomförd (2025-11-10 10:30)                   │    │
│  │                                                            │    │
│  │  Onboarding-session ID: uuid-session-abc123               │    │
│  │  Faktura-ID: INV-2025-1110-001 (Fakturerad till byrån)    │    │
│  │  PDF URL: https://celestial-agreements.fra1.digital...    │    │
│  │                                                            │    │
│  │  [📄 Ladda ner PDF]  [🔍 Visa BankID-kvitto]  [📋 Audit log]│    │
│  │  [📊 Visa onboarding-rapport]  [✉️ Skicka till kund]      │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  💡 Totalt antal avtal: 7 (1 trial + 1 subscription + 5 assignment) │
│  💰 Total intäkt från avtal: 8,658 kr (exkl. löpande prenumeration)│
└──────────────────────────────────────────────────────────────────────┘
```

**BankID-kvitto modal (klick på "Visa BankID-kvitto"):**
```
┌──────────────────────────────────────────────────────────────┐
│  🔐 BankID-signering - TRIAL-2025-1102-A4F7         [✖]     │
│                                                              │
│  Transaktions-ID: abc123def456ghi789jkl012mno345pqr678      │
│  Signerad: 2025-11-02 14:32:15                              │
│                                                              │
│  👤 Signatär:                                                │
│     Namn: Lasse Andersson                                   │
│     Personnummer: 198503XX-XXXX (maskerat - GDPR)           │
│     IP-adress: 192.168.1.100                                │
│     User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64...)     │
│                                                              │
│  📄 Signerat dokument:                                       │
│     Avtalstyp: Prova-på-avtal (Trial Agreement)             │
│     Avtalstext: "Celestial Accounting AB ("Celestial")      │
│                  tillhandahåller tjänster enligt följande    │
│                  villkor. Kostnader för forensisk analys     │
│                  beräknas efter SIE-analys..."               │
│                  [Visa fullständig text]                     │
│                                                              │
│  🔏 Kryptografisk signatur:                                  │
│     Algorithm: RSA-2048 + SHA-256                           │
│     Signature: MIIGTQYJKoZIhvcNAQcCoIIGPjCCBjoCAQExDz...    │
│     [Visa fullständig signatur]                             │
│                                                              │
│  ✅ Verifierad: Signatur är giltig och oförändrad           │
│                                                              │
│  [📄 Ladda ner BankID-kvitto (JSON)]  [Stäng]               │
└──────────────────────────────────────────────────────────────┘
```

**Audit log modal (klick på "Audit log"):**
```
┌──────────────────────────────────────────────────────────────┐
│  📋 Audit Log - TRIAL-2025-1102-A4F7                [✖]     │
│                                                              │
│  Händelse          Användare              Tidpunkt          │
│  ──────────────────────────────────────────────────────────│
│  🆕 Avtal skapat    System                2025-11-02 14:30 │
│  🔐 BankID-signering Lasse Andersson      2025-11-02 14:32 │
│  💳 Stripe-betalning System               2025-11-02 14:35 │
│  ✅ Onboarding klar  Lasse Andersson      2025-11-02 15:10 │
│  📄 PDF nedladdad   Lasse Andersson       2025-11-02 15:15 │
│  👁️ Avtalet visat   Anna (Support)        2025-11-05 10:20 │
│  📄 PDF nedladdad   Anna (Support)        2025-11-05 10:21 │
│  📄 BankID-kvitto   Erik (Admin)          2025-11-08 14:00 │
│                                                              │
│  Alla händelser loggas för GDPR-compliance och audit.       │
│  Retention: 7 år enligt Bokföringslagen.                    │
│                                                              │
│  [Export to CSV]  [Stäng]                                   │
└──────────────────────────────────────────────────────────────┘
```

**Backend API-endpoints (Admin):**

```javascript
// Get all agreements for a firm
GET /api/admin/firms/:firmId/agreements
{
  trialAgreement: {
    id: "uuid-trial",
    agreementNumber: "TRIAL-2025-1102-A4F7",
    signedAt: "2025-11-02T14:32:15Z",
    signerName: "Lasse Andersson",
    signerPersonnr: "19850315-XXXX",  // Masked
    bankidTransactionId: "abc123...",
    staticKycCost: 18,
    layeringYears: {
      "2024": 60,
      "2023": 1000,
      "2022": 200
    },
    totalCost: 1278,
    paidAt: "2025-11-02T14:35:00Z",
    stripePaymentId: "pi_123...",
    pdfUrl: "https://celestial-agreements.fra1.digitaloceanspaces.com/...",
    status: "completed"
  },
  
  subscriptionAgreement: {
    id: "uuid-sub",
    agreementNumber: "SUB-2025-1105-B9E2",
    signedAt: "2025-11-05T10:15:42Z",
    signerName: "Lasse Andersson",
    signerPersonnr: "19850315-XXXX",
    bankidTransactionId: "ghi789...",
    monthlyPrice: 1995,
    startDate: "2025-11-05",
    nextBillingDate: "2025-12-05",
    paymentMethod: {
      type: "card",
      last4: "4242"
    },
    pdfUrl: "https://...",
    status: "active"
  },
  
  assignmentAgreements: [
    {
      id: "uuid-assign-1",
      agreementNumber: "ASSIGN-2025-1110-C3D8",
      signedAt: "2025-11-10T09:45:12Z",
      signerName: "Erik Johansson",
      signerPersonnr: "19920520-XXXX",
      companyName: "Johanssons Bygg AB",
      companyOrgnr: "556123-4567",
      bankidTransactionId: "mno345...",
      staticKycCost: 18,
      layeringYears: {
        "2024": 90,
        "2023": 1600,
        "2022": 400,
        "2021": 30,
        "2020": 2
      },
      totalCost: 2141,
      invoiceId: "INV-2025-1110-001",
      sessionId: "uuid-session-abc123",
      pdfUrl: "https://...",
      status: "completed"
    },
    // ... 4 more assignment agreements
  ],
  
  summary: {
    totalAgreements: 7,
    totalRevenue: 8658,  // Excluding ongoing subscription
    activeSubscription: true
  }
}

// Get BankID receipt for agreement
GET /api/admin/agreements/:agreementId/bankid-receipt
{
  transactionId: "abc123def456...",
  signedAt: "2025-11-02T14:32:15Z",
  signerName: "Lasse Andersson",
  signerPersonnr: "198503XX-XXXX",  // Partially masked
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  agreementText: "Fullständig avtalstext...",
  signature: {
    algorithm: "RSA-2048 + SHA-256",
    value: "MIIGTQYJKoZIhvcNAQcCoIIGPjCCBjo...",
    verified: true
  }
}

// Get audit log for agreement
GET /api/admin/agreements/:agreementId/audit-log
{
  events: [
    {
      timestamp: "2025-11-02T14:30:00Z",
      action: "agreement_created",
      userId: null,  // System
      userName: "System",
      ipAddress: "10.0.0.1",
      details: "Trial agreement created for firm uuid-..."
    },
    {
      timestamp: "2025-11-02T14:32:15Z",
      action: "bankid_signed",
      userId: "uuid-byråchef",
      userName: "Lasse Andersson",
      ipAddress: "192.168.1.100",
      details: "Agreement signed via BankID"
    },
    {
      timestamp: "2025-11-02T14:35:00Z",
      action: "payment_completed",
      userId: null,
      userName: "System (Stripe webhook)",
      ipAddress: "52.89.214.238",  // Stripe IP
      details: "Stripe payment pi_123... completed (1278 kr)"
    },
    {
      timestamp: "2025-11-02T15:10:00Z",
      action: "onboarding_completed",
      userId: "uuid-byråchef",
      userName: "Lasse Andersson",
      ipAddress: "192.168.1.100",
      details: "Onboarding session completed"
    },
    {
      timestamp: "2025-11-02T15:15:00Z",
      action: "pdf_downloaded",
      userId: "uuid-byråchef",
      userName: "Lasse Andersson",
      ipAddress: "192.168.1.100",
      details: "Agreement PDF downloaded"
    },
    {
      timestamp: "2025-11-05T10:20:00Z",
      action: "agreement_viewed",
      userId: "uuid-support-anna",
      userName: "Anna (Support)",
      ipAddress: "10.0.0.5",
      details: "Agreement viewed in Admin Dashboard"
    },
    {
      timestamp: "2025-11-05T10:21:00Z",
      action: "pdf_downloaded",
      userId: "uuid-support-anna",
      userName: "Anna (Support)",
      ipAddress: "10.0.0.5",
      details: "Agreement PDF downloaded by support"
    },
    {
      timestamp: "2025-11-08T14:00:00Z",
      action: "bankid_receipt_viewed",
      userId: "uuid-admin-erik",
      userName: "Erik (Admin)",
      ipAddress: "10.0.0.10",
      details: "BankID receipt viewed"
    }
  ],
  retentionPeriod: "7 years (Bokföringslagen)"
}

// Pause subscription (from subscription agreement view)
POST /api/admin/agreements/:agreementId/pause-subscription
{
  reason: "Customer requested pause - moving offices"
}
// Response:
{
  success: true,
  pausedAt: "2025-11-10T12:00:00Z",
  resumeAt: null,  // Manual resume required
  auditEntry: {
    action: "subscription_paused",
    userId: "uuid-admin-erik",
    timestamp: "2025-11-10T12:00:00Z"
  }
}

// Cancel subscription (from subscription agreement view)
DELETE /api/admin/agreements/:agreementId/cancel-subscription
{
  reason: "Customer cancelled - switching to competitor",
  effectiveDate: "2025-12-05"  // End of billing period
}
// Response:
{
  success: true,
  cancelledAt: "2025-11-10T12:00:00Z",
  effectiveDate: "2025-12-05",
  refundAmount: 0,  // No refund (end of period)
  auditEntry: {
    action: "subscription_cancelled",
    userId: "uuid-admin-erik",
    timestamp: "2025-11-10T12:00:00Z"
  }
}
```

**GDPR-considerations:**

1. **Personnummer:**
   - Lagras ENCRYPTED i databas (bcrypt)
   - Visas MASKERAT i Admin UI (19850315-XXXX)
   - Full personnummer ENDAST i BankID-kvitto modal (support/legal access)

2. **IP-adresser:**
   - Loggas vid signering (legal requirement för BankID)
   - Retention: 90 dagar enligt GDPR, sedan maskeras
   - Visas endast för admin/compliance

3. **Audit log:**
   - 7 års retention enligt Bokföringslagen
   - Varje access loggad (vem, när, varifrån)
   - Exporterbar för GDPR-förfrågningar

4. **Rätt till radering:**
   - Soft delete efter 30 dagar (kund kan ångra sig)
   - Hard delete efter 365 dagar (GDPR-rätt)
   - BankID-kvitton BEHÅLLS i 7 år (legal requirement)

**Permission levels:**

| **Roll** | **Visa avtal** | **Ladda ner PDF** | **BankID-kvitto** | **Audit log** | **Pausa/Avsluta** |
|----------|---------------|------------------|------------------|--------------|------------------|
| Support  | ✅ Yes        | ✅ Yes           | ❌ No             | ✅ Yes (limited) | ❌ No            |
| Admin    | ✅ Yes        | ✅ Yes           | ✅ Yes            | ✅ Yes (full)    | ✅ Yes            |
| Compliance | ✅ Yes      | ✅ Yes           | ✅ Yes            | ✅ Yes (full)    | ❌ No            |
| Finance  | ✅ Yes        | ✅ Yes           | ❌ No             | ✅ Yes (payments) | ✅ Yes (pause)   |

---

### 2. Prenumerationer & Fakturering

**Vad ska Celestial se?**
- [ ] Månadsinkomst (MRR - Monthly Recurring Revenue)
- [ ] Churn rate (antal byråer som avslutat per månad)
- [ ] Average Revenue Per Account (ARPA)
- [ ] Betalningsstatus per byrå (Betald / Obetald / Förfallen)
- [ ] Trial-conversions (hur många trials blir betalande?)

**Fakturatabell:**
- [ ] Faktura-ID, byrå, period, antal användare, API-kostnader, totalsumma
- [ ] Förfallodatum, betald datum, status (Betald/Obetald/Förfallen)
- [ ] Export till Excel/CSV
- [ ] Skicka påminnelse för obetalda fakturor (email)

**Prismodell (från SettingsPage_v2.md):**
```
Fast: 1,995 kr/månad per byrå
Variabelt: API-kostnader (se SettingsPage_v2.md sektion 4.3)
  - Statisk KYC: 18 kr (Bolagsverket 2kr + PEP 5kr + Sanctions 5kr + Handling 6kr)
  - Layering 3yr: 1,560 kr
  - Layering 5yr: 2,080 kr
  - Layering 7yr: 2,600 kr
```

### 3. Support & Communication

**Vad ska Celestial se?**
- [ ] Support-ärenden från redovisningsbyråer (ticket system)
- [ ] Prioritet (Hög / Medium / Låg)
- [ ] Status (Ny / Under behandling / Avslutad / Eskalerad)
- [ ] Kategori (Teknisk / Faktura / Onboarding / Feature Request)
- [ ] Senaste aktivitet (datum + vem som svarat)
- [ ] **Aktiva shadow-sessions** (vem som tittar på vilken byrå just nu)

**Vad ska Celestial kunna göra?**
- [ ] Svara på support-ärenden (inline reply eller email)
- [ ] Tilldela ärende till specifik support-agent
- [ ] Markera som "Resolved" eller "Escalated"
- [ ] Se ärendehistorik per byrå
- [ ] **Skapa shadow-login för telefonsupport** (NYTT! Se detaljer nedan)
- [ ] Massutskick: Nyhetsbrev, produktuppdateringar, systemunderhåll

**Shadow-login för telefonsupport (samma teknologi som Kollega-inlogg):**

**Användningsfall:**
1. Byråchef ringer: "Jag vet inte hur jag ska fylla i detta"
2. Support-agent klickar "Skapa Shadow-login" i ticket-vyn
3. Support ser EXAKT samma vy som byråchefen (via JWT-token)
4. Support ger instruktioner: "Klicka på kugghjulet, välj 'Prislista'..."
5. **Byråchefen gör själv ändringen** - Support kan INTE göra det åt dem (Fortnox-mönster)

**UI i Support-ticket:**
```
┌──────────────────────────────────────────────────┐
│  Ticket #1234 - Revision Stockholm AB             │
│  Status: Under behandling                         │
│  Prioritet: Hög                                   │
│                                                   │
│  Problem: "Vet inte hur man ändrar prislista"    │
│                                                   │
│  [Skapa Shadow-login] [Svara via Email]          │
│                                                   │
│  ── Shadow-login modal ──────────────────────────│
│  Typ: [▼ Support (läsvy - telefonsupport)]       │
│                                                   │
│  Support-agent: Anna Andersson                   │
│  Email: anna.andersson@celestial.se              │
│                                                   │
│  Välj aktiv session: [▼ Acme AB (tiger-3847)]   │
│                                                   │
│  Giltighetstid: [▼ 1 timme___________________]   │
│    - 30 minuter                                  │
│    - 1 timme (standard för telefonsupport)       │
│    - 4 timmar                                    │
│                                                   │
│  ℹ️ Support-läge permissions:                     │
│  ✅ Se exakt vad byråchefen ser                   │
│  ✅ Se teknisk debug-info (API-status)            │
│  ❌ Kan INTE göra ändringar                       │
│  ❌ Kan INTE godkänna/avslå onboarding            │
│                                                   │
│  [Generera Shadow-token]  [Avbryt]               │
└──────────────────────────────────────────────────┘
```

**Backend (JWT-baserat, INGEN session ID):**
```javascript
POST /api/admin/support/create-shadow-login
{
  ticketId: "uuid-ticket-1234",
  firmId: "uuid-revisionstockholm",
  sessionId: "uuid-onboarding-abc",  // Den aktiva onboarding-sessionen
  shadowType: "support",
  agentName: "Anna Andersson",
  agentEmail: "anna@celestial.se",
  expiresIn: 3600  // 1 timme i sekunder
}

// Response med JWT:
{
  shadowToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1dWlkLWJ5cmFjaGVmLTEyMyIsImZpcm1JZCI6InV1aWQtcmV2aXNpb25zdG9ja2hvbG0iLCJzZXNzaW9uSWQiOiJ1dWlkLW9uYm9hcmRpbmctYWJjIiwicm9sZSI6InNoYWRvdyIsInNoYWRvd1R5cGUiOiJzdXBwb3J0Iiwic2hhZG93ZWRCeSI6InV1aWQtc3VwcG9ydC1hZ2VudC00NTYiLCJwZXJtaXNzaW9ucyI6eyJjYW5WaWV3Ijp0cnVlLCJjYW5FZGl0IjpmYWxzZSwiY2FuQXBwcm92ZSI6ZmFsc2UsImNhbk1lc3NhZ2UiOmZhbHNlfSwiZXhwaXJlc0F0IjoiMjAyNS0xMS0wMVQxODowMDowMFoiLCJpYXQiOjE2OTg4NTAwMDAsImV4cCI6MTY5ODg1MzYwMH0.signature",
  
  accessLink: "https://app.celestial.se/o/TG3847?token=SHADOW_JWT",
  
  permissions: {
    canView: true,
    canEdit: false,
    canApprove: false,
    canMessage: false,
    debugMode: true  // Kan se API-logs, console errors
  },
  
  expiresAt: "2025-11-01T18:00:00Z",
  
  auditLog: {
    action: "shadow_login_created",
    ticketId: "uuid-ticket-1234",
    agentId: "uuid-agent-456",
    firmId: "uuid-revisionstockholm",
    timestamp: "2025-11-01T17:00:00Z"
  }
}
```

**JWT payload exempel:**
```json
{
  "userId": "uuid-byråchef-123",
  "firmId": "uuid-revisionstockholm",
  "sessionId": "uuid-onboarding-abc",
  "role": "shadow",
  "shadowType": "support",
  "shadowedBy": "uuid-support-agent-456",
  "ticketId": "uuid-ticket-1234",
  "permissions": {
    "canView": true,
    "canEdit": false,
    "canApprove": false,
    "canMessage": false
  },
  "expiresAt": "2025-11-01T18:00:00Z",
  "iat": 1698850000,
  "exp": 1698853600
}
```

**Frontend middleware (kollar JWT):**
```javascript
// I varje protected component:
const permissions = checkJWTPermissions(token);

if (permissions.isShadow) {
  // Visa banner:
  <ShadowModeBanner 
    type={permissions.shadowType} 
    canEdit={permissions.canEdit} 
  />
  
  // Disable edit-knappar om canEdit = false:
  <button disabled={!permissions.canEdit}>
    Godkänn Onboarding
  </button>
}
```

**Eskalering till Admin-läge:**
Om support inte kan lösa problemet:
```
┌──────────────────────────────────────────────────┐
│  ⚠️ Eskalera till Admin-läge?                     │
│                                                   │
│  Support-läge räcker inte - problem kräver       │
│  faktiska ändringar i systemet.                  │
│                                                   │
│  Admin-permissions:                              │
│  ✅ Full kontroll - kan ändra åt kunden           │
│  ✅ Kan godkänna/avslå onboarding                 │
│  ⚠️ All aktivitet loggas i audit trail            │
│                                                   │
│  Anledning till eskalering:                      │
│  [Beskriv varför admin-access behövs___________] │
│  [__________________________________________]    │
│                                                   │
│  [Skapa Admin Shadow-token]  [Avbryt]            │
└──────────────────────────────────────────────────┘
```

**Aktiva shadow-sessions (Dashboard-widget):**
```
┌──────────────────────────────────────────────────┐
│  🔍 Aktiva Shadow-sessions (3)                    │
│                                                   │
│  Agent            Byrå             Typ    Upphör │
│  ───────────────────────────────────────────────│
│  Anna Andersson  Revision Stockholm Support 17:30│
│  Erik Svensson   Ekonomibyrån Väst  Admin   18:00│
│  Maria Nilsson   Nordisk Revision   Colleague 19:00│
│                                                   │
│  [Visa alla] [Återkalla åtkomst]                 │
└──────────────────────────────────────────────────┘
```

**Audit trail (logging):**
```javascript
// Varje action loggad i PostgreSQL:
{
  action: "shadow_login_created",
  ticketId: "uuid-ticket-1234",
  agentId: "uuid-agent-456",
  agentName: "Anna Andersson",
  firmId: "uuid-revisionstockholm",
  firmName: "Revision Stockholm AB",
  sessionId: "uuid-onboarding-abc",
  shadowType: "support",
  permissions: { canView: true, canEdit: false },
  expiresAt: "2025-11-01T18:00:00Z",
  timestamp: "2025-11-01T17:00:00Z"
}

// Om admin-läge används:
{
  action: "admin_shadow_action",
  agentId: "uuid-agent-456",
  firmId: "uuid-revisionstockholm",
  changesMade: [
    { field: "pricing.baseFee", oldValue: 500, newValue: 450 },
    { field: "onboarding.status", oldValue: "pending", newValue: "approved" }
  ],
  reason: "Customer reported system bug preventing form submission",
  timestamp: "2025-11-01T17:15:00Z"
}
```

**Email-integration:**
- [ ] Skicka enskild email till specifik byrå
- [ ] Skicka massutskick till alla byråer (eller filtrerade segment)
- [ ] Email-mallar (t.ex. "Välkommen till trial", "Faktura förfallen", "Ny feature")
- [ ] Integration med SendGrid API
- [ ] **Auto-email vid shadow-login skapad** (transparency till byråchef)

### 4. Analytics & Metrics

**Vad ska Celestial se?**
- [ ] **Growth metrics:**
  - Nya registreringar per vecka/månad
  - Trial → Paid conversion rate
  - Churn rate (% som avbryter)
  - Net Revenue Retention (NRR)
  
- [ ] **Usage metrics:**
  - Antal onboarding-sessioner per byrå (genomsnitt per månad)
  - API-användning (statisk KYC vs layering-analys)
  - Mest aktiva byråer (top 10 per användning)
  - Inaktiva byråer (inga onboardings senaste 30 dagar)
  
- [ ] **Revenue metrics:**
  - MRR (Monthly Recurring Revenue)
  - ARPA (Average Revenue Per Account)
  - Total revenue YTD (Year To Date)
  - Förväntad revenue nästa månad (based on active subscriptions)

**Visualiseringar:**
- [ ] Line chart: MRR över tid (senaste 12 månader)
- [ ] Bar chart: Nya registreringar per månad
- [ ] Pie chart: Prenumerationsstatus (Trial / Active / Paused / Cancelled)
- [ ] Table: Top 10 byråer per revenue

### 5. Onboarding Pipeline (Sales)

**Vad ska Celestial se?**
- [ ] Nya trials (senaste 7/30 dagar)
- [ ] Trial-status (Aktiv / Har genomfört första onboarding / Ingen aktivitet)
- [ ] Dagar kvar av trial (countdown)
- [ ] Sales pipeline: Lead → Demo → Trial → Paid

**Vad ska Celestial kunna göra?**
- [ ] Markera trial som "Hot lead" (likely to convert)
- [ ] Skicka uppföljnings-email automatiskt (t.ex. dag 3 av trial)
- [ ] Boka demo-samtal (integration med Calendly?)
- [ ] Konvertera trial till betalande (manuell override om behövs)

### 6. Product Usage & Feature Adoption

**Vad ska Celestial se?**
- [ ] Vilka features används mest? (Settings-sidan, Kollega-inlogg, Avtalsmall-upload)
- [ ] Vilka features används minst? (identifiera onboarding-behov)
- [ ] Antal LaTeX-mallar uppladdade (feature adoption)
- [ ] Antal custom KYC-frågor uppladdade (config.json)
- [ ] Genomsnittlig tid för onboarding-session (från start till godkänd)

### 7. Compliance & Security

**Vad ska Celestial se?**
- [ ] Byråer som har:
  - Valt fakturabetalning (status: `invoice_pending` vs `paid_invoice`)
  - Verifieringsstatus (Bolagsverket + telefonkontroll)
- [ ] API-nyckelhantering (BYOK - Bring Your Own Key)
- [ ] Access logs (vem loggade in när, från vilken IP)

---

## Sidebar-struktur (förslag)

Baserat på ovanstående - här är en möjlig struktur:

```
┌─────────────────────────┬──────────────────────────────────┐
│  🏢 Celestial Admin     │  ← Tillbaka till Dashboard        │
│                         │                                   │
│  📊 Översikt            │  [Aktivt innehåll]                │
│    ├─ Key Metrics       │                                   │
│    └─ Recent Activity   │                                   │
│                         │                                   │
│  👥 Kunder (Byråer)     │                                   │
│    ├─ Alla byråer       │  (Tabell med sök/filter)          │
│    ├─ Ny byrå           │  (Manuell registrering)           │
│    └─ Inaktiva          │  (Ingen aktivitet 30+ dagar)      │
│                         │                                   │
│  💳 Prenumerationer     │                                   │
│    ├─ Översikt          │  (MRR, ARPA, Churn)               │
│    ├─ Fakturor          │  (Tabell med betalningsstatus)    │
│    └─ Trials            │  (Pipeline: Trial → Paid)         │
│                         │                                   │
│  🎫 Support             │                                   │
│    ├─ Alla ärenden      │  (Ticket-tabell)                  │
│    ├─ Nya (ej hanterade)│  (Filter: Status = Ny)            │
│    └─ Eskalerade        │  (Hög prioritet)                  │
│                         │                                   │
│  📧 Communication       │                                   │
│    ├─ Skicka email      │  (Enskild eller massutskick)      │
│    ├─ Email-mallar      │  (Templates)                      │
│    └─ Email-historik    │  (Alla skickade emails)           │
│                         │                                   │
│  📈 Analytics           │                                   │
│    ├─ Revenue           │  (MRR, ARPA, revenue graphs)      │
│    ├─ Growth            │  (Nya registreringar, churn)      │
│    └─ Usage             │  (Feature adoption, API-usage)    │
│                         │                                   │
│  🔒 Compliance          │                                   │
│    ├─ Verifieringar     │  (Invoice-pending status)         │
│    ├─ API-nycklar       │  (BYOK management)                │
│    └─ Access logs       │  (Login history)                  │
│                         │                                   │
│  ──────────────────────                                     │
│                         │                                   │
│  📚 Bokföring           │  (Celestials egen bokföring!)     │
│    ├─ Verifikationslista│  (Alla verifikationer)            │
│    └─ Bokför            │  (Ny verifikation - Fortnox-vy)   │
└─────────────────────────┴──────────────────────────────────┘
```

---

## Frågor att diskutera

Innan jag fortsätter med detaljerad UI-spec - behöver ni hjälp med att prioritera:

1. **Vilka features är MVP (Minimum Viable Product)?**
   - Förslag: Kunder (alla byråer tabell), Prenumerationer (översikt), Support (ticket-tabell)

2. **Vilka features kan vänta till v3?**
   - Förslag: Analytics (avancerade grafer), Compliance (access logs), Email-mallar (kan börja med basic email-form)

3. **Ska Celestial kunna impersonate byråchef?**
   - D.v.s. logga in som en specifik byrå för debugging/support-syfte
   - Säkerhetsaspekter: Kräver explicit consent från byrån?

4. **Integration med Stripe/Klarna/Fortnox?**
   - Hämta fakturahistorik direkt från payment provider?
   - Eller hantera allt internt i PostgreSQL?

5. **Skal vi återanvända komponenter från Volt Pro?**
   - Transactions.js → Fakturatabell
   - Users.js → Byråtabell
   - Invoice.js → Faktura-modal

6. **Behövs en separat AdminLayout?**
   - Egen sidebar (lila färgschema istället för grön)
   - Egen header med admin-specifika notifications
   - Helt separat från byråchefernas UI

---

## Nästa steg

1. **Du berättar:** Vilka features prioriteras? Vad är must-have vs nice-to-have?
2. **Jag skapar:** Detaljerad UI/UX-spec baserat på dina prioriteringar
3. **Vi implementerar:** Börjar med MVP-features och itererar

---

## 8. Bokföring (Mini-bokföringsprogram för Celestial)

**Syfte:** Celestial ska kunna sköta sin egen bokföring direkt i Admin Dashboard

**Varför?** 
- Celestial är en enskild firma (eller litet AB) och behöver enkel bokföring
- Istället för att betala Fortnox kan ni använda er egen app! 🎉
- Proof of concept för Fortnox-klonen senare

### 8.1 Verifikationslista

**UI:**
```
┌──────────────────────────────────────────────────────────────────────┐
│  📚 Bokföring - Verifikationslista                  [🟡 Bokför →]    │
│                                                                      │
│  [Sök verifikation_______] [År: ▼ 2025] [Månad: ▼ Alla]            │
│                                                                      │
│  Ver.nr  Datum      Typ        Beskrivning                   Belopp │
│  ───────────────────────────────────────────────────────────────────│
│  1       2025-01-05 Intäkt     Faktura Revision Stockholm AB 1,995 kr│
│  2       2025-01-10 Kostnad    Digital Ocean (servers)       -500 kr│
│  3       2025-01-15 Kostnad    Loopia (domain)               -200 kr│
│  4       2025-01-20 Intäkt     Faktura Ekonomibyrån Väst     1,995 kr│
│  5       2025-01-25 Kostnad    Bolagsverket API (127 anrop)  -254 kr│
│  6       2025-02-01 Intäkt     Faktura Nordisk Revision      4,950 kr│
│  7       2025-02-05 Kostnad    SendGrid (email)              -150 kr│
│                                                                      │
│  Visar 7 av 127 verifikationer                                      │
│  [← Föregående] [Sida 1 av 19] [Nästa →]                            │
└──────────────────────────────────────────────────────────────────────┘
```

**Kolumner:**
- **Ver.nr:** Löpnummer (1, 2, 3, ...) - autoincrementerar per år
- **Datum:** Bokföringsdatum
- **Typ:** Intäkt / Kostnad / Lön / Moms / Privat
- **Beskrivning:** Fritext (t.ex. "Faktura Revision Stockholm AB")
- **Belopp:** Positivt för intäkter, negativt för kostnader

**Klick på rad → Öppnar detaljvy:**
```
┌──────────────────────────────────────────────────┐
│  Verifikation #1                          [✖]    │
│                                                   │
│  Datum: 2025-01-05                               │
│  Typ: Intäkt                                     │
│  Beskrivning: Faktura Revision Stockholm AB      │
│                                                   │
│  Kontorader:                                     │
│  Konto  Benämning              Debet    Kredit   │
│  ─────────────────────────────────────────────── │
│  1930   Företagskonto SEB     1,995 kr     -     │
│  3001   Tjänsteintäkter          -     1,995 kr  │
│                                                   │
│  Summa:                        1,995 kr 1,995 kr │
│  Differens: 0 kr ✅                               │
│                                                   │
│  [Redigera] [Radera] [Stäng]                     │
└──────────────────────────────────────────────────┘
```

### 8.2 Bokför (Ny verifikation - Fortnox-liknande vy)

**Routing:** Klicka på "🟡 Bokför →"-knapp → Öppnar bokföringsvy

**UI (inspirerad av Fortnox):**
```
┌──────────────────────────────────────────────────────────────────────┐
│  📚 Bokför ny verifikation                        [← Tillbaka]       │
│                                                                      │
│  Ver.nr: [128___] (nästa lediga)  Datum: [2025-11-01_______]        │
│  Typ: [▼ Intäkt________]  (Intäkt / Kostnad / Lön / Moms / Privat)  │
│  Beskrivning: [Faktura Revision Stockholm AB___________________]    │
│                                                                      │
│  ──────────────────────────────────────────────────────────────────│
│  Kontorader:                                                         │
│                                                                      │
│  Konto    Benämning                        Debet        Kredit      │
│  ───────────────────────────────────────────────────────────────── │
│  [1930_▼] Företagskonto SEB               [1,995__] kr [_______]   │
│  [3001_▼] Tjänsteintäkter                 [_______]    [1,995__] kr│
│  [_____▼] [Välj konto eller sök______]    [_______]    [_______]   │
│  [+ Lägg till rad]                                                   │
│                                                                      │
│  ──────────────────────────────────────────────────────────────────│
│  Summa Debet:  1,995 kr                                              │
│  Summa Kredit: 1,995 kr                                              │
│  Differens:    0 kr ✅ (Verifikationen går ihop!)                    │
│                                                                      │
│  [Spara verifikation]  [Rensa]  [Avbryt]                            │
└──────────────────────────────────────────────────────────────────────┘
```

**Features:**

1. **Kontoplan dropdown med autocomplete:**
```
[1930_▼] → Droppar ner:
  1930 - Företagskonto SEB
  1931 - Företagskonto Swedbank
  1510 - Kundfordringar
  2440 - Leverantörsskulder
  3001 - Tjänsteintäkter
  ...

Eller sök: [ser_▼] → Filtrerar till:
  3001 - Tjänsteintäkter (för "service")
  3002 - Konsultintäkter
```

2. **Auto-validering:**
- Om Debet ≠ Kredit → Visa röd varning: "⚠️ Verifikationen går inte ihop! Differens: 500 kr"
- Om Debet = Kredit → Grön check: "✅ Verifikationen går ihop!"

3. **Förifyllda mallar (shortcuts):**
```
[📋 Använd mall ▼]
  - Intäkt från kund (1930 Debet, 3001 Kredit)
  - Kostnad Digital Ocean (6990 Debet, 1930 Kredit)
  - Moms till Skatteverket (2650 Debet, 1930 Kredit)
  - Privat uttag (2013 Debet, 1930 Kredit)
```

### 8.3 Kontoplan (BAS 2024 för enskild firma)

**Standard kontoplan inkluderad:**
```
1930 - Företagskonto SEB
1510 - Kundfordringar
2013 - Lasse Karagiannis (privat)
2440 - Leverantörsskulder
2650 - Redovisningskonto för skatter och avgifter
3001 - Tjänsteintäkter (SaaS-prenumerationer)
3002 - Konsultintäkter
6990 - Övriga externa kostnader (Digital Ocean, Loopia, APIs)
7010 - Lönekostnader (om ni anställer senare)
```

**Användaren kan lägga till egna konton:**
```
┌──────────────────────────────────────────────────┐
│  Lägg till nytt konto                             │
│                                                   │
│  Kontonummer: [6991____]                         │
│  Benämning: [Bolagsverket API-kostnader______]   │
│  Kontotyp: [▼ Kostnad____________]               │
│                                                   │
│  [Spara konto]  [Avbryt]                         │
└──────────────────────────────────────────────────┘
```

### 8.4 Integration med Roaring.io (Auto-bokföring!)

**Smart feature:** När Roaring.io detekterar en betalning → Auto-skapar verifikation!

```javascript
// Roaring.io webhook när betalning kommer in:
POST /api/admin/bank-webhook
{
  date: "2025-11-01",
  amount: 1995,
  reference: "INV-2025-001",
  payer: "Revision Stockholm AB",
  payerOrgNr: "556789-1234"
}

// Backend:
// 1. Hitta faktura med ID "INV-2025-001"
// 2. Skapa automatisk verifikation:
{
  verNr: 128,
  date: "2025-11-01",
  type: "Intäkt",
  description: "Faktura Revision Stockholm AB (Auto-bokfört)",
  rows: [
    { account: 1930, description: "Företagskonto SEB", debit: 1995, credit: 0 },
    { account: 3001, description: "Tjänsteintäkter", debit: 0, credit: 1995 }
  ],
  autoBooked: true  // Flagga att det är auto-skapat
}

// 3. Markera faktura som "Betald"
// 4. Skicka email till byrå: "Tack för betalningen!"
```

**UI - Auto-bokförda verifikationer markeras:**
```
┌──────────────────────────────────────────────────────────────────────┐
│  📚 Bokföring - Verifikationslista                                    │
│                                                                      │
│  Ver.nr  Datum      Typ        Beskrivning                   Belopp │
│  ───────────────────────────────────────────────────────────────────│
│  1       2025-01-05 Intäkt     Faktura Revision Stockholm AB 1,995 kr│
│  2       2025-01-10 Kostnad    Digital Ocean (servers)       -500 kr│
│  128 🤖  2025-11-01 Intäkt     Faktura Revision Stockholm AB 1,995 kr│
│          (Auto-bokfört via Roaring.io)                               │
└──────────────────────────────────────────────────────────────────────┘
```

### 8.5 Exportfunktion (SIE4-fil)

**Knapp i Verifikationslista:**
```
[📥 Exportera till SIE4]
```

**Genererar SIE4-fil:**
```sie
#FLAGGA 0
#PROGRAM "Celestial Bokföring" 1.0
#FORMAT PC8
#GEN 2025-11-01
#SIETYP 4
#FNAMN "Celestial AB"
#ORGNR 5591234567
#KPTYP BAS2024

#KONTO 1930 "Företagskonto SEB"
#KONTO 3001 "Tjänsteintäkter"
...

#VER "" 1 2025-01-05 "Faktura Revision Stockholm AB"
{
  #TRANS 1930 {} 1995.00
  #TRANS 3001 {} -1995.00
}

#VER "" 2 2025-01-10 "Digital Ocean"
{
  #TRANS 6990 {} 500.00
  #TRANS 1930 {} -500.00
}
...
```

**Användningsfall:**
- Exportera årets bokföring för att skicka till revisor
- Importera i Fortnox/Visma (om ni växlar system senare)
- Backup för bokföringsdata

### 8.6 Backend Schema

```sql
-- Verifikationer
CREATE TABLE accounting_vouchers (
  id UUID PRIMARY KEY,
  voucher_number INT NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(50),  -- 'income', 'expense', 'salary', 'tax', 'private'
  description TEXT,
  auto_booked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID  -- Celestial admin user
);

-- Kontorader
CREATE TABLE accounting_rows (
  id UUID PRIMARY KEY,
  voucher_id UUID REFERENCES accounting_vouchers(id),
  account_number INT NOT NULL,
  account_name VARCHAR(255),
  debit DECIMAL(10, 2) DEFAULT 0,
  credit DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Kontoplan
CREATE TABLE accounting_accounts (
  account_number INT PRIMARY KEY,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50),  -- 'asset', 'liability', 'income', 'expense'
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 8.7 Fortnox-inspiration (UI-detaljer)

**Fortnox-gul knapp (🟡):**
```jsx
<Button 
  variant="warning"  // Bootstrap gul
  className="bg-fortnox-yellow hover:bg-fortnox-yellow-dark"
  onClick={() => navigate('/admin/accounting/vouchers')}
>
  🟡 Bokför →
</Button>

// CSS:
.bg-fortnox-yellow {
  background-color: #FFD700;  // Fortnox-gul
}
```

**Samma känsla som Fortnox:**
- Clean white background
- Tydliga input-fält med borders
- Grön check när verifikation går ihop (✅)
- Röd varning när differens (⚠️)
- Sticky header när man scrollar ner i lång verifikationslista

---

**Sammanfattning Bokföring:**
- ✅ Mini-bokföringsprogram för Celestials egen bokföring
- ✅ Verifikationslista (alla bokföringar)
- ✅ Bokför-vy (Fortnox-liknande interface)
- ✅ Auto-bokföring via Roaring.io
- ✅ SIE4-export för revisor/backup
- ✅ Proof of concept för Fortnox-klonen senare!

---

## Nästa steg

1. **Du berättar:** Vilka features prioriteras? Vad är must-have vs nice-to-have?
2. **Jag skapar:** Detaljerad UI/UX-spec baserat på dina prioriteringar
3. **Vi implementerar:** Börjar med MVP-features och itererar

---

**Vad tycker du? Vilka av ovanstående features är viktigast för Celestial att kunna göra?**
