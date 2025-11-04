# Settings Page - Iteration 2 Update

**Datum:** 2025-11-03  
**Status:** 🔄 Uppdaterad med Agreement Context + Modal implementation  
**Baserat på:** LaTeX spec (rad 3850-3950) + Volt Pro Dashboard + Agreement workflow

---

## 🆕 NYTT: Agreement Context + Modal (2025-11-03)

### Översikt
Implementation av avtalssystem med delad state mellan Settings och onboarding-flöde. 
Modal blockerar fortsättning av onboarding tills avtal (företag ELLER engång) är tecknat.

### Teknisk arkitektur

**AgreementContext.jsx** (`/src/contexts/AgreementContext.jsx`)
- Global state för avtal
- Delas mellan SettingsPageV2 och RiskFragorSlide
- Två typer av avtal:
  1. **platformAgreement**: Företagsavtal (tecknas i Settings)
  2. **oneTimeAgreement**: Engångsavtal (tecknas i RiskSlide popup)

**AgreementModal.jsx** (`/src/components/Modals/AgreementModal.jsx`)
- Blockerar onboarding när kritisk data finns
- Tre val: Gå till Settings, Teckna engångsavtal, Avbryt
- `backdrop="static"` - kan inte stängas utan val

**Trigger i RiskFragorSlide:**
```javascript
useEffect(() => {
  const hasCompanyName = formData.foretagsnamn.trim() !== '';
  const hasOrgNr = formData.organisationsnummer.trim() !== '';
  const hasPersonNr = formData.personnummer.trim() !== '';
  const hasBusinessDescription = formData.affarsIde.trim() !== '';
  
  const allCriticalDataFilled = 
    hasCompanyName && hasOrgNr && hasPersonNr && hasBusinessDescription;
  
  if (allCriticalDataFilled && !hasAnyAgreement()) {
    setShowAgreementModal(true); // Blockera!
  }
}, [formData, hasAnyAgreement]);
```

### Flöde

#### Scenario 1: Användare tecknar företagsavtal
```
RiskSlide → Modal visas → Klicka "Gå till Inställningar"
    ↓
Modal stängs temporärt
    ↓
Navigate to /settings?section=firm-sign-agreement
    ↓
User signerar företagsavtal (BankID mock 5s)
    ↓
Context uppdateras: platformAgreement.isSigned = true
    ↓
User navigerar tillbaka till /risk
    ↓
useEffect triggas → hasAnyAgreement() returnerar TRUE
    ↓
Modal visas INTE → Onboarding fortsätter normalt
```

#### Scenario 2: Användare tecknar engångsavtal
```
RiskSlide → Modal visas → Klicka "Teckna engångsavtal"
    ↓
BankID mock (3s) i modal
    ↓
Context uppdateras: oneTimeAgreement.isSigned = true
    ↓
Modal stängs automatiskt
    ↓
Onboarding fortsätter → StaticKYCSlide → Betalnings-popup (Stripe)
```

#### Scenario 3: Användare avbryter
```
RiskSlide → Modal visas → Klicka "Avbryt onboarding"
    ↓
Navigate to /
    ↓
Onboarding resettas
```

### State struktur

**AgreementContext:**
```javascript
{
  platformAgreement: {
    isSigned: false,
    agreementNumber: 'PLAT-2025-XXXXX',
    signedAt: ISO-8601,
    signerName: 'Lasse Karagiannis',
    signerPersonnr: '19XXXXXX-XXXX',
    monthlyFee: 1995,
    status: 'Ej signerat' | 'Under verifiering' | 'Godkänt',
    isSigningInProgress: boolean
  },
  oneTimeAgreement: {
    isSigned: false,
    agreementNumber: 'ONETIME-2025-XXXXX',
    signedAt: ISO-8601,
    signerName: 'Testanvändare',
    signerPersonnr: '19XXXXXX-XXXX',
    totalCost: 0, // Räknas efter API-anrop
    isSigningInProgress: boolean
  },
  hasAnyAgreement: () => platformAgreement.isSigned || oneTimeAgreement.isSigned
}
```

### Filer skapade/modifierade

**Nya filer:**
- `/src/contexts/AgreementContext.jsx` (Context provider)
- `/src/components/Modals/AgreementModal.jsx` (Popup med 3 val)

**Modifierade filer:**
- `/src/App.jsx` - Wrappad med `<AgreementProvider>`
- `/src/components/Pages/SettingsPageV2.jsx` - Använder `useAgreements()` istället för lokal state
- `/src/components/Slides/RiskFragorSlide.jsx` - Trigger för modal, visar `<AgreementModal>`

### Edge cases hanterade

| **Scenario** | **Beteende** |
|-------------|--------------|
| User går till Settings men signerar inte | Modal visas igen när user kommer tillbaka till RiskSlide |
| User signerar i Settings medan modal är öppen | Modal försvinner automatiskt (useEffect dependency) |
| User har redan företagsavtal | Modal visas aldrig |
| User har redan engångsavtal | Modal visas aldrig |
| User fyller i data partiellt | Modal visas INTE (alla 4 fält krävs) |

---

## Navigationsflöde

### Problem identifierat:
❌ **Ingen "Stäng" eller "Tillbaka"-knapp** - användare måste använda webbläsarens bakåtpil

### Lösning:
✅ **Lägg till header med "← Tillbaka till Dashboard"-knapp** överst på Settings-sidan

```jsx
<div className="d-flex justify-content-between align-items-center py-4">
  <Button variant="link" onClick={() => navigate('/dashboard')}>
    ← Tillbaka till Dashboard
  </Button>
  <h4>⚙️ Inställningar</h4>
  <div>{/* Spacer för center alignment */}</div>
</div>
```

---

## Sidebar-struktur (uppdaterad)

```
┌─────────────────────────┬──────────────────────────────────┐
│  ⚙️ Inställningar       │  ← Tillbaka till Dashboard        │
│                         │                                   │
│  👤 Användare           │  [Aktivt innehåll]                │
│    ├─ Alla användare    │                                   │
│    └─ Lägg till         │                                   │
│                         │                                   │
│  🔗 Åtkomst             │                                   │
│    ├─ Fjärronboarding   │                                   │
│    └─ Skuggning         │   (NY - Shadow-login)             │
│                         │                                   │
│  🏢 Byråinställningar   │                                   │
│    ├─ Kontaktuppgifter  │                                   │
│    ├─ Prislista         │   (NY)                            │
│    ├─ Teckna avtal med oss │ (NY - Plattformsavtal)        │
│    ├─ Avtalsmall        │   (NY - LaTeX upload)             │
│    └─ Egna frågor       │   (NY - config.json)              │
│                         │                                   │
│  💳 Prenumeration       │   (NY struktur)                   │
│    ├─ Översikt          │                                   │
│    └─ Fakturor          │                                   │
│                         │                                   │
│  📄 Avtal               │   (NY)                            │
│    ├─ Prova-på-avtal    │   (BankID-signerat)               │
│    ├─ Företagsavtal     │   (Prenumeration)                 │
│    └─ Uppdragsavtal     │   (Per onboarding-session)        │
│                         │                                   │
│  ⚠️ Danger Zone         │                                   │
│    └─ Ta bort konto     │                                   │
└─────────────────────────┴──────────────────────────────────┘
```

---

## 1. Användare (oförändrat från tidigare spec)

Se tidigare SettingsPage.md för:
- Alla användare (tabell med sök/filter)
- Lägg till användare (modal med roller: Admin/User/Granskning)
- Send Invite flow

---

## 2. Åtkomst (uppdaterad med ny struktur)

### 2.1 Fjärronboarding-sessioner

**SE TIDIGARE SPEC** - behålls som den är:
- Skapa session med Access Code (word-4digits format)
- Aktiva sessioner tabell
- Kopiera länkar för accountant/client

### 2.2 Skuggning / Shadow-inlogg (NY FUNKTION)

**Syfte:** Låt andra se samma vy som byråchefen i en onboarding-session (shadowing/utbildning/support)

**Tre användningsfall med SAMMA teknologi:**

| **Användningsfall** | **Vem** | **Permissions** | **Varför** |
|---------------------|---------|-----------------|------------|
| **Kollega-inlogg** | Nyanställd/praktikant | Read-only, see-accountant-view | Utbildning, lära sig processen |
| **Support-inlogg** | Celestial Support | Read-only, see-accountant-view | Telefonsupport ("Klicka på kugghjulet...") |
| **Admin-inlogg** | Celestial Admin | **Full kontroll** (kan ändra) | Akut hjälp, fixa fel åt kunden |

**UI:**
```
┌──────────────────────────────────────────────────┐
│  Generera skuggnings-inlogg                       │
│                                                   │
│  Låt någon annan se samma vy som dig under       │
│  en onboarding-session.                          │
│                                                   │
│  Typ av åtkomst: [▼ Välj typ________________]    │
│    - Kollega (läsvy - utbildning)                │
│    - Support (läsvy - telefonsupport)            │
│    - Admin (full kontroll - Celestial)           │
│                                                   │
│  Välj session: [▼ Välj aktiv session___________] │
│    - Acme AB (tiger-3847) - Fjärronboarding      │
│    - Beta Corp (lion-1234) - Fysisk onboarding   │
│                                                   │
│  Namn: [Erik Eriksson_________________________]  │
│  E-post: [erik@revisionstockholm.se___________]  │
│                                                   │
│  Giltighetstid: [▼ Till sessionens slut_______]  │
│    - Till sessionens slut (standard)             │
│    - 24 timmar                                   │
│    - 7 dagar                                     │
│                                                   │
│  ℹ️ Permissions baserat på typ:                  │
│  • Kollega/Support: Läsvy, kan EJ ändra          │
│  • Admin: Full kontroll, kan ändra åt kunden     │
│                                                   │
│  [Generera inlogg]  [Avbryt]                     │
└──────────────────────────────────────────────────┘
```

**Backend:**
```javascript
POST /api/access/shadow-login
{
  sessionId: "uuid-abc123",
  shadowType: "colleague",  // "colleague" | "support" | "admin"
  name: "Erik Eriksson",
  email: "erik@revisionstockholm.se",
  expiresIn: "session-end"  // "session-end" | 24 | 168 (hours)
}

// Response:
{
  shadowId: "uuid-def456",
  accessLink: "https://app.celestial.se/o/TG3847?role=shadow&type=colleague&token=JWT_TOKEN",
  accessCode: "wolf-3847",  // samma pattern som client access code
  permissions: {
    canView: true,
    canEdit: false,  // TRUE endast för admin-typ
    canApprove: false,
    canMessage: false
  },
  expiresAt: "2025-11-01T12:00:00Z"
}
```

**Permissions per typ:**

**Kollega (colleague):**
- ✅ Se allt byråchefen ser (Admin Dashboard, forensiska analyser, riskbedömningar)
- ❌ Kan INTE göra ändringar
- ❌ Kan INTE skicka meddelanden till klient
- ❌ Kan INTE godkänna/avslå onboarding

**Support (support):**
- ✅ Se allt byråchefen ser (samma som kollega)
- ✅ Se teknisk debug-info (konsolloggar, API-anrop status)
- ❌ Kan INTE göra ändringar
- ❌ Kan INTE skicka meddelanden till klient
- **Användningsfall:** Telefonsupport - "Jag ser att du är på rätt sida, klicka på kugghjulet upp till vänster..."

**Admin (admin - Celestial):**
- ✅ Se allt byråchefen ser
- ✅ **KAN göra ändringar åt kunden** (fixa fel, fylla i formulär)
- ✅ Kan godkänna/avslå onboarding
- ✅ Kan skicka meddelanden
- ⚠️ **KRITISKT:** Kräver explicit consent från byråchefen (loggad i audit trail)
- **Användningsfall:** Akut support - kund har tekniskt problem, Celestial fixar åt dem

**Användningsfall:**

1. **Kollega-inlogg:**
   - Nyanställd redovisningskonsult ska lära sig processen
   - Praktikant observerar onboarding
   - Senior revisor granskar juniors arbete

2. **Support-inlogg (Fortnox-mönster):**
   - Byråchef ringer Celestial Support: "Jag vet inte hur jag ska fylla i detta"
   - Support-agent skapar shadow-login och ser EXAKT samma vy
   - Support ger instruktioner: "Klicka på kugghjulet, välj 'Prislista', ändra till 950 kr..."
   - **Kunden gör själv ändringen** - Support kan INTE göra det åt dem

3. **Admin-inlogg (escalation):**
   - Byråchef: "Jag har försökt 5 gånger men systemet låter mig inte gå vidare"
   - Celestial Admin: "Okej, jag skapar en admin-inlogg och fixar det åt dig"
   - Admin loggar in med full kontroll, fixar felet, loggar ut
   - All aktivitet loggas i audit trail: "Admin (support@celestial.se) ändrade fält X på uppdrag av byråchef Y"

---

## 3. Byråinställningar

### 3.1 Kontaktuppgifter (från LaTeX-spec)

**Design:** Läsläge med Edit-knapp (Volt Pro-pattern - förhindrar oavsiktliga ändringar)

**Läsläge (default):**
```
┌──────────────────────────────────────────────────┐
│  Byråinformation                        [Redigera]│
│                                                   │
│  Byrånamn:              Revision Stockholm AB    │
│  Organisationsnummer:   556789-1234              │
│  Adress:                Storgatan 1              │
│  Postnummer:            11122                    │
│  Ort:                   Stockholm                │
│  Telefon:               08-123 45 67             │
│  E-post:                info@revisionstockholm.se│
│  Webbplats:             www.revisionstockholm.se │
│                                                   │
│  Compliance Officer:    Anna Andersson           │
│  Revisorsuppgifter:     Auktoriserad revisor FAR │
│  Skattekontor:          Södermalm                │
└──────────────────────────────────────────────────┘
```

**Redigeringsläge (efter klick på "Redigera"):**
```
┌──────────────────────────────────────────────────┐
│  Redigera byråinformation                         │
│                                                   │
│  Byrånamn: [Revision Stockholm AB______________] │
│  Org.nr:   [556789-1234_______________________] │
│  Adress:   [Storgatan 1_______________________] │
│  Postnr:   [11122____]  Ort: [Stockholm______] │
│  Telefon:  [08-123 45 67_____________________] │
│  E-post:   [info@revisionstockholm.se________] │
│  Webbplats: [www.revisionstockholm.se_________] │
│                                                   │
│  Compliance officer: [Anna Andersson___________] │
│  Revisorsuppgifter:  [Auktoriserad revisor FAR] │
│  Skattekontor:       [Södermalm________________] │
│                                                   │
│  [Spara ändringar]  [Avbryt]                     │
└──────────────────────────────────────────────────┘
```

**State Management:**
```jsx
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState(initialData);

// Läsläge
if (!isEditing) {
  return (
    <Card>
      <CardHeader>
        <h5>Byråinformation</h5>
        <Button onClick={() => setIsEditing(true)}>Redigera</Button>
      </CardHeader>
      <CardBody>
        <dl>
          <dt>Byrånamn:</dt><dd>{formData.firmName}</dd>
          <dt>Organisationsnummer:</dt><dd>{formData.orgNr}</dd>
          {/* ... */}
        </dl>
      </CardBody>
    </Card>
  );
}

// Redigeringsläge
return (
  <Card>
    <Form>
      <Input value={formData.firmName} onChange={...} />
      {/* ... */}
      <Button onClick={handleSave}>Spara ändringar</Button>
      <Button onClick={() => setIsEditing(false)}>Avbryt</Button>
    </Form>
  </Card>
);
```

**Syfte:** Dessa uppgifter auto-fylls i avtal, rapporter, och kommunikation med klienter. Läsläge förhindrar oavsiktliga ändringar.

### 3.2 Teckna avtal med oss (NY FUNKTION)

**Datum:** 2025-11-03  
**Syfte:** Byråchef tecknar plattformsavtal för att använda tjänsten med faktura i efterskott. Utan signerat avtal måste enskilda användare betala direkt för API-anrop via Stripe.

**Betalningsmodeller:**

| **Avtalsstatus** | **Betalningsvillkor** | **Vem betalar** | **Metod** |
|------------------|----------------------|-----------------|-----------|
| **Inget avtal** | Direktbetalning | Enskild användare | Stripe (per onboarding) |
| **Signerat avtal** | 30 dagars kredit | Företaget (byrån) | Faktura i efterskott |
| **Engångs-testavtal** | Direktbetalning (självkostnad) | Enskild användare | Stripe (endast en gång) |

---

#### UI - Status: Ej signerat avtal

```
┌────────────────────────────────────────────────────────┐
│  Teckna avtal med oss                                   │
│                                                         │
│  ⚠️ Avtalet är inte signerat ännu                       │
│                                                         │
│  För att använda plattformen med faktura i efterskott   │
│  måste ni teckna ett företagsavtal. Tills avtalet är    │
│  signerat och godkänt måste enskilda användare betala   │
│  direkt för API-anrop via Stripe.                       │
│                                                         │
│  Månadskostnad: 1995 SEK (exkl. moms)                   │
│  Inkluderar: Obegränsade onboardings, lagring,          │
│              API-åtkomst                                │
│  Betalningsvillkor: 30 dagars kredit, faktura i         │
│                     efterskott                          │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  Vill endast testa?                                     │
│                                                         │
│  Företagsanvändare kan teckna engångs-testavtal vid     │
│  första onboarding. Kostar endast självkostnadspris     │
│  för API-anrop + avtalsteckning.                        │
│  ⚠️ OBS: Erbjuds endast en gång.                        │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  [📄 PDF Viewer - plattformsavtal_redovisningsbyra.pdf] │
│                                                         │
│  [📥 Ladda ner PDF]                                     │
│                                                         │
│  [✍️ Signera med BankID]                                │
│                                                         │
│  ⚠️ Betalningsvillkor utan godkänt företagsavtal        │
│  Tills företagsavtalet är godkänt måste enskilda        │
│  användare betala direkt för API-anrop via Stripe       │
│  (Skatteverket, Bolagsverket, etc.) vid varje           │
│  onboarding.                                            │
│                                                         │
│  Med godkänt avtal: 30 dagars betalningsvillkor,        │
│  faktura i efterskott för alla API-kostnader.           │
└────────────────────────────────────────────────────────┘
```

**Mock BankID-signering:**
- Visar QR-kod (fejk) i 5 sekunder
- Status uppdateras till "Under verifiering"
- Efter "godkännande" (manuell uppdatering): Status = "Signerat"

---

#### UI - Status: Signerat avtal

```
┌────────────────────────────────────────────────────────┐
│  Teckna avtal med oss                                   │
│                                                         │
│  ✅ Avtalet är signerat!                                │
│                                                         │
│  Avtalsnummer: PLAT-2025-A3F2B1                         │
│  Signerad av: Lasse Karagiannis                         │
│  Personnummer: 19XXXXXX-XXXX                            │
│  Signeringsdatum: 2025-11-03 14:32:00                   │
│  Månadskostnad: 1995 SEK (exkl. moms)                   │
│  Status: Under verifiering / Godkänt                    │
│                                                         │
│  [📥 Ladda ner signerat avtal]                          │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  ℹ️ Tack för er signering!                              │
│  Vi verifierar nu er byrå. Ni kommer att få ett         │
│  e-postmeddelande när verifieringen är klar (normalt    │
│  1-2 arbetsdagar). Under tiden kan ni redan börja       │
│  sätta upp era inställningar och testa funktioner.      │
└────────────────────────────────────────────────────────┘
```

---

#### Integration med onboarding (popup)

**Trigger:** Företagsanvändare når RiskSlide och har fyllt i:
- Företagsnamn (→ org.nr via autocomplete)
- Verksamhetsbeskrivning
- Personnummer (firmatecknare)

**Popup visas:**
```
┌────────────────────────────────────────────────────────┐
│  Betalning krävs för att fortsätta                      │
│                                                         │
│  Företagsanvändare betalar i efterskott efter signerat  │
│  avtal.                                                 │
│                                                         │
│  Med godkänt avtal: 30 dagars betalningsvillkor,        │
│  faktura i efterskott.                                  │
│                                                         │
│  Tills avtalet är godkänt måste enskild användare       │
│  betala direkt för API-anrop via Stripe.                │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  Välj alternativ:                                       │
│                                                         │
│  [ ] Teckna företagsavtal i "Inställningar → Teckna     │
│      avtal med oss"                                     │
│                                                         │
│  [ ] Om du endast vill testa, teckna engångsavtal       │
│      med oss till en kostnad av API-anrop +             │
│      avtalsteckning till ett självkostnadspris.         │
│      ⚠️ OBS: Erbjuds endast en gång.                    │
│                                                         │
│  [Gå till Inställningar]  [Teckna engångsavtal]         │
│  [Avbryt onboarding]                                    │
└────────────────────────────────────────────────────────┘
```

**Om "Teckna engångsavtal":**
- Visar BankID-signering (mock)
- Efter signering: Fortsätt till StaticKYCSlide
- Efter StaticKYCSlide: Visa betalnings-popup (Stripe)

**Om "Gå till Inställningar":**
- Navigera till `/settings` → Byråinställningar → Teckna avtal med oss
- Onboarding pausas, fortsätts senare

---

### 3.3 Prislista (NY FUNKTION)

**Syfte:** Fast prislista som kan overridas av byråchefen i appens prisförslag-input

**UI:**
```
┌──────────────────────────────────────────────────┐
│  Standard Prislista                               │
│                                                   │
│  Tjänst                        Fast pris   Override│
│  ──────────────────────────────────────────────── │
│  Grundavgift (Fast)            500 kr      [____] │
│  Per klient-konto (Variabel)   150 kr/st   [____] │
│  Per bokföringstransaktion     5 kr/st     [____] │
│  SIE-filimport (engångsavgift) 1000 kr     [____] │
│  Layering-analys (7 år)        2500 kr     [____] │
│  Layering-analys (5 år)        2000 kr     [____] │
│  Layering-analys (3 år)        1500 kr     [____] │
│                                                    │
│  ℹ️ Override-fält används vid prisförslag i app.  │
│  Lämna tomt för standard.                         │
│                                                    │
│  [Återställ till standard]  [Spara ändringar]    │
└──────────────────────────────────────────────────┘
```

**Backend:**
```javascript
GET /api/settings/pricing
{
  baseFee: { default: 500, override: null },
  perAccount: { default: 150, override: null },
  perTransaction: { default: 5, override: null },
  sieImport: { default: 1000, override: null },
  layering7Years: { default: 2500, override: null },
  layering5Years: { default: 2000, override: null },
  layering3Years: { default: 1500, override: null }
}

PUT /api/settings/pricing
{
  baseFee: { override: 450 },  // Nedsatt från 500 kr
  layering7Years: { override: 2200 }  // Rabatt från 2500 kr
}
```

**Integration med app:**
- I onboarding-flödet, när prisförslag visas:
  ```jsx
  const price = settings.pricing.baseFee.override || settings.pricing.baseFee.default;
  ```
- Byråchefen kan också manuellt overrida i input-fält när prisförslag visas
- Popup med kostnadsuppskattning för layering-analys baserat på transaktionslista

### 3.4 Avtalsmall (LaTeX-baserat arbetsflöde)

**Status:** 📝 DOKUMENTERAD (2025-11-03) - Implementation nästa steg

**Syfte:** Settings lagrar alltid EN LaTeX-mall som är source of truth. Vid upload kompileras mallen direkt och förhandsgranskas. Vid onboarding hämtas mallen från Settings och genereras med dynamiska data.

---

## Tekniskt flöde (3 steg)

### **STEG 1: Initial setup (ny byrå)**
```
Nyöppnat konto
    ↓
System kopierar default LaTeX-mall till byråns Settings
    ↓
/public/uppdragsavtal_template.tex → byråns aktiva mall
    ↓
Settings visar: "Nuvarande mall: uppdragsavtal_template.tex (Standard)"
```

**Default-mall location:** `/public/uppdragsavtal_template.tex`

---

### **STEG 2: Byråchef laddar upp egen LaTeX-mall i Settings**

**Trigger:** Byråchef väljer .tex-fil och klickar "Ladda upp"

**Flöde:**
```
1. Frontend: POST /api/settings/contract-template/upload
   {
     file: uppdragsavtal_custom.tex,
     firmId: "firma-uuid-123"
   }

2. Backend: Ta emot .tex-fil
   ↓
3. Extrahera placeholders (regex: /\{\{([A-ZÅÄÖ_]+)\}\}/g)
   ↓
4. Kompilera LaTeX → PDF (TeX Live: pdflatex)
   - Körs OMEDELBART vid upload
   - Genererar preview-PDF (alla placeholders synliga som {{...}})
   ↓
5. Spara:
   - .tex-fil: /storage/firms/firma-uuid-123/contract_template.tex
   - PDF preview: /storage/firms/firma-uuid-123/contract_preview.pdf
   ↓
6. Response till frontend:
   {
     success: true,
     templateId: "firma-uuid-123",
     filename: "uppdragsavtal_custom.tex",
     uploadedAt: "2025-11-03T14:32:00Z",
     previewPdfUrl: "/storage/.../contract_preview.pdf",
     placeholders: [
       "{{FÖRETAGSNAMN}}", "{{MÅNADSPRIS}}", "{{BYRÅNAMN}}", ...
     ],
     compilationLog: "pdflatex completed successfully"
   }

7. Frontend uppdaterar Settings UI:
   - Visar ny mall: "uppdragsavtal_custom.tex"
   - Visar preview-PDF med alla placeholders synliga
   - Denna mall är nu AKTIV och används vid alla nya onboardings
```

**Settings UI efter upload:**
```
┌────────────────────────────────────────────────────────┐
│  Avtalsmall                                             │
│                                                         │
│  📄 Nuvarande mall: uppdragsavtal_custom.tex            │
│  Uppladdad: 2025-11-03 14:32                            │
│  Storlek: 28 KB                                         │
│                                                         │
│  [📥 Ladda ner .tex-fil]  [👁️ Förhandsgranska PDF]     │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  📤 Ladda upp ny LaTeX-mall (.tex)                      │
│  [Välj fil_________________] [📁 Bläddra] [Ladda upp]   │
│                                                         │
│  ℹ️ Vid upload kompileras mallen omedelbart och        │
│  preview-PDF genereras. Mallen ersätter den nuvarande.  │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  📋 Tillgängliga placeholders (dubbla klamrar):         │
│  {{FÖRETAGSNAMN}}   {{ORGNUMMER}}   {{KONTAKTPERSON}}   │
│  {{EMAIL}}          {{TELEFON}}     {{ADRESS}}          │
│  {{MÅNADSPRIS}}     {{STARTDATUM}}  {{BYRÅNAMN}}        │
│  {{BYRÅ_ORGNR}}     {{BYRÅ_ADRESS}} {{COMPLIANCE_OFF}}  │
│                                                         │
│  ⚠️ Om placeholder inte fylls i ersätts den med         │
│  whitespace vid generering.                             │
└────────────────────────────────────────────────────────┘
```

---

### **STEG 3: Onboarding - Generera avtal med dynamiska data**

**Trigger 1:** Byråchef öppnar content-slide "Avtal & Signering"

**Flöde (första gången - tom preview):**
```
1. AvtalSlide.jsx laddas
   ↓
2. Frontend: GET /api/settings/contract-template/preview?firmId=firma-uuid-123
   ↓
3. Backend returnerar:
   {
     previewPdfUrl: "/storage/.../contract_preview.pdf",
     placeholders: ["{{FÖRETAGSNAMN}}", "{{MÅNADSPRIS}}", ...]
   }
   ↓
4. AvtalSlide visar preview-PDF (alla placeholders synliga)
   ↓
5. UI visar: "⚠️ Detta är en förhandsgranskning. Avtalet fylls i när du accepterar kunden."
```

---

**Trigger 2:** Byråchef accepterar kund i Riskbedömning-slide och anger månadspris

**Flöde (generering med dynamiska data):**
```
1. RiskbedomningSlide.jsx: Byråchef klickar "Acceptera kund"
   - Input: monthlyPrice = 4500 kr
   ↓
2. Frontend samlar data från tidigare slides:
   {
     "{{FÖRETAGSNAMN}}": "Acme AB",           // från FöretagsinformationSlide
     "{{ORGNUMMER}}": "556123-4567",         // från FöretagsinformationSlide
     "{{KONTAKTPERSON}}": "Erik Johansson",  // från FöretagsinformationSlide
     "{{EMAIL}}": "erik@acme.se",            // från BokforingDataSlide
     "{{TELEFON}}": "08-123 45 67",          // från BokforingDataSlide
     "{{ADRESS}}": "Kungsgatan 10",          // från Bolagsverket/manuellt
     "{{MÅNADSPRIS}}": "4500",               // från RiskbedomningSlide
     "{{STARTDATUM}}": "2025-11-03",         // dagens datum
     "{{BYRÅNAMN}}": "Revision Stockholm AB", // från Settings
     "{{BYRÅ_ORGNR}}": "556789-1234",        // från Settings
     "{{BYRÅ_ADRESS}}": "Storgatan 1",       // från Settings
     "{{COMPLIANCE_OFF}}": "Anna Andersson"  // från Settings
   }
   ↓
3. Frontend: POST /api/onboarding/:sessionId/generate-contract
   {
     templateId: "firma-uuid-123",  // Hämta från Settings
     sessionId: "session-xyz",
     data: { /* alla placeholders med värden */ }
   }
   ↓
4. Backend:
   a) Hämta LaTeX-mall från Settings: /storage/firms/firma-uuid-123/contract_template.tex
   b) Ersätt ALLA placeholders med faktiska värden:
      - Regex: /\{\{FÖRETAGSNAMN\}\}/g → "Acme AB"
      - Regex: /\{\{MÅNADSPRIS\}\}/g → "4500"
      - Om placeholder saknar värde → ersätt med "" (whitespace)
   c) Spara ifylld .tex-fil temporärt
   d) Kompilera LaTeX → PDF (pdflatex)
   e) Spara PDF: /storage/sessions/session-xyz/contract_final.pdf
   ↓
5. Response:
   {
     success: true,
     contractPdfUrl: "/storage/sessions/session-xyz/contract_final.pdf",
     generatedAt: "2025-11-03T15:45:00Z"
   }
   ↓
6. Frontend navigerar till AvtalSlide (/avtal)
   ↓
7. AvtalSlide hämtar final PDF och visar:
   - PDF viewer med fullständigt ifyllt avtal
   - BankID-signeringsknapp
   - UI: "✅ Avtalet är ifyllt och klart för signering"
```

---

## UI/UX i onboarding-flödet

**Före "Acceptera kund" (preview-läge):**
```
┌────────────────────────────────────────────────────────┐
│  Avtal & Signering                                      │
│                                                         │
│  📄 Förhandsgranskning av avtalsmall                    │
│                                                         │
│  [PDF Viewer med preview - alla {{PLACEHOLDERS}} synliga]│
│                                                         │
│  ⚠️ Detta är en förhandsgranskning.                     │
│  Avtalet kommer fyllas i automatiskt när du accepterar  │
│  kunden i Riskbedömning-steget.                         │
│                                                         │
│  [← Tillbaka]                                           │
└────────────────────────────────────────────────────────┘
```

**Efter "Acceptera kund" (final-läge):**
```
┌────────────────────────────────────────────────────────┐
│  Avtal & Signering                                      │
│                                                         │
│  📄 Uppdragsavtal - Acme AB                             │
│                                                         │
│  [PDF Viewer med IFYLLT avtal - alla data synliga]     │
│                                                         │
│  ✅ Avtalet är ifyllt och klart för signering           │
│                                                         │
│  Företag: Acme AB (556123-4567)                         │
│  Månadspris: 4500 kr/mån (exkl. moms)                   │
│  Genererat: 2025-11-03 15:45                            │
│                                                         │
│  [📥 Ladda ner PDF]  [✍️ Signera med BankID] [← Tillbaka]│
└────────────────────────────────────────────────────────┘
```

---

## State Management (Frontend)

**SettingsPageV2.jsx:**
```jsx
const [latexTemplate, setLatexTemplate] = useState({
  templateId: 'default',           // eller firma-uuid-123
  filename: 'uppdragsavtal_template.tex',
  uploadedAt: null,
  previewPdfUrl: '/public/uppdragsavtal_exempel.pdf',
  placeholders: [
    '{{FÖRETAGSNAMN}}', '{{MÅNADSPRIS}}', '{{BYRÅNAMN}}', ...
  ],
  isUploading: false,
  uploadError: null
});

const handleLatexUpload = async (file) => {
  setLatexTemplate({...latexTemplate, isUploading: true});
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('firmId', currentUser.firmId);
  
  const response = await fetch('/api/settings/contract-template/upload', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  
  if (result.success) {
    setLatexTemplate({
      templateId: result.templateId,
      filename: result.filename,
      uploadedAt: result.uploadedAt,
      previewPdfUrl: result.previewPdfUrl,
      placeholders: result.placeholders,
      isUploading: false,
      uploadError: null
    });
    alert('✅ LaTeX-mall uppladdad och kompilerad!');
  } else {
    setLatexTemplate({...latexTemplate, isUploading: false, uploadError: result.error});
    alert('❌ Kompileringsfel: ' + result.error);
  }
};
```

**AvtalSlide.jsx:**
```jsx
const [contractState, setContractState] = useState({
  mode: 'preview',  // 'preview' eller 'final'
  pdfUrl: null,
  isGenerating: false,
  generationError: null
});

useEffect(() => {
  // Vid första laddning: Hämta preview från Settings
  const fetchPreview = async () => {
    const response = await fetch(`/api/settings/contract-template/preview?firmId=${firmId}`);
    const data = await response.json();
    setContractState({...contractState, pdfUrl: data.previewPdfUrl});
  };
  
  // Om kunden är accepterad: Generera final PDF
  if (isCustomerAccepted && sessionData) {
    generateFinalContract();
  } else {
    fetchPreview();
  }
}, [isCustomerAccepted, sessionData]);

const generateFinalContract = async () => {
  setContractState({...contractState, isGenerating: true});
  
  const response = await fetch(`/api/onboarding/${sessionId}/generate-contract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      templateId: latexTemplate.templateId,
      data: {
        '{{FÖRETAGSNAMN}}': sessionData.companyName,
        '{{MÅNADSPRIS}}': sessionData.monthlyPrice,
        // ... alla placeholders
      }
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    setContractState({
      mode: 'final',
      pdfUrl: result.contractPdfUrl,
      isGenerating: false,
      generationError: null
    });
  } else {
    setContractState({...contractState, isGenerating: false, generationError: result.error});
  }
};
```

---

## Backend-endpoints (teknisk spec)

### **1. Upload LaTeX-mall**
```
POST /api/settings/contract-template/upload
Content-Type: multipart/form-data

Request:
- file: .tex-fil
- firmId: string (UUID)

Process:
1. Spara ORIGINAL .tex till /storage/firms/{firmId}/contract_template.tex
   ⚠️ VIKTIGT: Denna fil förblir ORÖRD - modifieras ALDRIG
2. Extrahera placeholders: regex /\{\{([A-ZÅÄÖ_]+)\}\}/g
3. Kompilera preview PDF:
   - Skapa temp-kopia av original .tex
   - Kör: pdflatex -output-directory=/tmp contract_template_copy.tex
   - Om fel: returnera compilation log
   - Radera temp-kopia efter kompilering
4. Spara preview PDF: /storage/firms/{firmId}/contract_preview.pdf

Response (SUCCESS):
{
  success: true,
  templateId: "{firmId}",
  filename: "contract_template.tex",
  uploadedAt: "ISO-8601",
  previewPdfUrl: "/storage/firms/{firmId}/contract_preview.pdf",
  placeholders: ["{{FÖRETAGSNAMN}}", ...],
  compilationLog: "pdflatex completed"
}

Response (ERROR):
{
  success: false,
  error: "LaTeX compilation failed",
  log: "! Undefined control sequence..."
}
```

---

### **2. Hämta preview (för AvtalSlide)**
```
GET /api/settings/contract-template/preview?firmId={firmId}

Response:
{
  previewPdfUrl: "/storage/firms/{firmId}/contract_preview.pdf",
  placeholders: ["{{FÖRETAGSNAMN}}", "{{MÅNADSPRIS}}", ...],
  filename: "contract_template.tex"
}
```

---

### **3. Generera final avtal (vid "Acceptera kund")**
```
POST /api/onboarding/:sessionId/generate-contract
Content-Type: application/json

Request:
{
  templateId: "{firmId}",
  sessionId: "session-xyz",
  data: {
    "{{FÖRETAGSNAMN}}": "Acme AB",
    "{{MÅNADSPRIS}}": "4500",
    // ... alla placeholders
  }
}

Process:
1. Hämta ORIGINAL LaTeX-mall (orörd): /storage/firms/{templateId}/contract_template.tex
   ⚠️ ALDRIG modifiera original-filen - den används för ALLA onboardings
2. Läs original .tex-fil som sträng (in i minnet)
3. Skapa temp-kopia i minnet med ersatta placeholders:
   - För varje key i data:
     - Ersätt alla förekomster: .replace(/\{\{FÖRETAGSNAMN\}\}/g, "Acme AB")
   - Om placeholder saknar värde i data → ersätt med ""
4. Spara ifylld temp-kopia: /tmp/session-xyz-contract-{timestamp}.tex
5. Kompilera temp-kopia:
   - pdflatex -output-directory=/tmp session-xyz-contract-{timestamp}.tex
6. Spara final PDF: /storage/sessions/{sessionId}/contract_final.pdf
7. Radera temp .tex-fil (cleanup)
   ⚠️ Original i /storage/firms/{firmId}/ förblir ORÖRD för nästa onboarding

Response (SUCCESS):
{
  success: true,
  contractPdfUrl: "/storage/sessions/{sessionId}/contract_final.pdf",
  generatedAt: "ISO-8601"
}

Response (ERROR):
{
  success: false,
  error: "Compilation failed",
  log: "..."
}
```

---

## Placeholders (standardiserade)

**Format:** `{{NYCKEL_I_VERSALER}}` (dubbla klammerparenteser, CAPS, understreck tillåtet)

**Tillgängliga:**
```
{{FÖRETAGSNAMN}}        - Klientens företagsnamn
{{ORGNUMMER}}           - Klientens org.nr (nnnnnn-nnnn)
{{KONTAKTPERSON}}       - Kontaktperson namn
{{EMAIL}}               - Klientens e-post
{{TELEFON}}             - Klientens telefon
{{ADRESS}}              - Företagsadress (gatuadress)
{{POSTNUMMER}}          - Postnummer (nnn nn)
{{ORT}}                 - Ort
{{MÅNADSPRIS}}          - Pris i kr/mån (från Riskbedömning)
{{STARTDATUM}}          - Datum för avtalets början (YYYY-MM-DD)
{{BYRÅNAMN}}            - Byråns namn (från Settings)
{{BYRÅ_ORGNR}}          - Byråns org.nr
{{BYRÅ_ADRESS}}         - Byråns gatuadress
{{BYRÅ_POSTNUMMER}}     - Byråns postnummer
{{BYRÅ_ORT}}            - Byråns ort
{{BYRÅ_TELEFON}}        - Byråns telefon
{{BYRÅ_EMAIL}}          - Byråns e-post
{{COMPLIANCE_OFF}}      - Compliance officer namn
{{BETALNINGSVILLKOR}}   - Standard: "30 dagar" (konfigurerbart)
```

**Whitespace-hantering:**
Om placeholder inte finns i data → ersätt med `""` (tom sträng)

---

## Sammanfattning (TL;DR)

**Settings är source of truth:**
- Default LaTeX-mall: `/public/uppdragsavtal_template.tex`
- Ny byrå får automatiskt default-mall kopierad till sina Settings
- Vid upload av egen .tex → kompileras omedelbart → ersätter nuvarande mall

**2 PDF-genereringar:**
1. **Vid upload i Settings:** Preview-PDF (alla placeholders synliga: `{{FÖRETAGSNAMN}}`)
2. **Vid "Acceptera kund":** Final PDF (alla placeholders ifyllda: "Acme AB")

**Avtal & Signering slide:**
- Visar preview INNAN acceptans
- Visar final PDF EFTER acceptans med BankID-signering

**Placeholders:** `{{VERSALER}}` format, whitespace om saknas

---

## ⚠️ KRITISKT: Original LaTeX-fil förblir ORÖRD

**Problem:**
Om vi modifierar LaTeX-filen direkt vid varje onboarding → placeholders ersätts permanent → nästa onboarding har ingen mall att fylla i!

**Lösning:**
```
/storage/firms/{firmId}/contract_template.tex  ← ORIGINAL (skrivskyddad i logiken)
    ↓
    Läs till minnet
    ↓
    Skapa temp-kopia med ersatta placeholders
    ↓
    Kompilera temp-kopia → PDF
    ↓
    Radera temp-kopia
    ↓
    Original förblir ORÖRD för nästa session
```

**Filstruktur:**
```
/storage/
  firms/
    firma-uuid-123/
      contract_template.tex       ← ORIGINAL (NEVER MODIFY)
      contract_preview.pdf         ← Preview (alla {{PLACEHOLDERS}} synliga)
  sessions/
    session-xyz-001/
      contract_final.pdf           ← Ifyllt avtal (Acme AB, 4500 kr)
    session-xyz-002/
      contract_final.pdf           ← Ifyllt avtal (Beta AB, 3200 kr)
    session-xyz-003/
      contract_final.pdf           ← Ifyllt avtal (Gamma AB, 5100 kr)
  tmp/
    session-xyz-001-1730640000.tex  ← Temp-kopia (raderas efter kompilering)
    session-xyz-002-1730640001.tex  ← Temp-kopia (raderas efter kompilering)
```

**Logik:**
1. **Upload:** Spara original → `contract_template.tex` (skrivs 1 gång)
2. **Preview:** Läs original → kompilera temp-kopia → `contract_preview.pdf`
3. **Session 1:** Läs original → ersätt placeholders i minnet → temp-kopia → kompilera → `session-xyz-001/contract_final.pdf` → radera temp
4. **Session 2:** Läs SAMMA original → ersätt placeholders i minnet → temp-kopia → kompilera → `session-xyz-002/contract_final.pdf` → radera temp
5. **Session 3:** Läs SAMMA original → ersätt placeholders i minnet → temp-kopia → kompilera → `session-xyz-003/contract_final.pdf` → radera temp

**Resultat:**
- Original `contract_template.tex` används för **alla onboardings**
- Varje session får sitt eget `contract_final.pdf` i egen mapp
- Byråchef kan generera 1000+ avtal från SAMMA LaTeX-mall

---

### 3.5 Egna frågor (config.json - framtida)

**Status:** ⏳ PLANERAD - EJ IMPLEMENTERAD
1. Byråchefen väljer: **Standardmall** (vår färdiga) ELLER **Egen mall** (ladda upp PDF/DOCX)
2. Om egen mall: Använd placeholders som `{{FÖRETAGSNAMN}}`, `{{MÅNADSPRIS}}` etc.
3. Under onboarding: Data från formulär fylls automatiskt i avtalet
4. Vid Riskbedömning → "Acceptera kund": Generera PDF med ifylld data
5. Om placeholder inte fylls i → ersätts med whitespace automatiskt

**UI (Radio-val):**
```
┌──────────────────────────────────────────────────┐
│  Avtalsmall                                       │
│                                                   │
│  ( ) Använd standardmall                          │
│      Vår färdiga uppdragsavtalsmall med alla      │
│      nödvändiga placeholders.                     │
│      [Förhandsgranska standardmall]               │
│                                                   │
│  (•) Ladda upp egen mall                          │
│      Använd din egen avtalsmall med anpassade     │
│      villkor och placeholders.                    │
│                                                   │
│      ┌──────────────────────────────────────┐    │
│      │ Ladda upp din avtalsmall              │    │
│      │                                       │    │
│      │ [Välj fil (PDF/DOCX)___] [Bläddra]   │    │
│      │ ✓ uppdragsavtal_custom.pdf uppladdad  │    │
│      │                                       │    │
│      │ Placeholders för dynamisk data:       │    │
│      │ {{FÖRETAGSNAMN}}   {{ORGNUMMER}}     │    │
│      │ {{KONTAKTPERSON}}  {{EMAIL}}          │    │
│      │ {{TELEFON}}        {{ADRESS}}         │    │
│      │ {{MÅNADSPRIS}}     {{STARTDATUM}}     │    │
│      │ {{BYRÅNAMN}}       {{BYRÅ_ORGNR}}     │    │
│      │                                       │    │
│      │ ℹ️ Om placeholder inte fylls i ersätts│    │
│      │ den automatiskt med whitespace.       │    │
│      └──────────────────────────────────────┘    │
│                                                   │
│  [Spara avtalsmall]                               │
└──────────────────────────────────────────────────┘
```

**Tillgängliga placeholders:**
```
{{FÖRETAGSNAMN}}     - Klientens företagsnamn (från Bolagsverket)
{{ORGNUMMER}}        - Klientens org.nr (från formulär)
{{KONTAKTPERSON}}    - Kontaktpersonens namn
{{EMAIL}}            - Klientens e-postadress
{{TELEFON}}          - Klientens telefonnummer
{{ADRESS}}           - Klientens företagsadress
{{MÅNADSPRIS}}       - Pris från Riskbedömning-slide
{{STARTDATUM}}       - Dagens datum vid avtalsgenerering
{{BYRÅNAMN}}         - Byråns namn (från Byråinställningar)
{{BYRÅ_ORGNR}}       - Byråns org.nr (från Byråinställningar)
```

**Flöde i onboarding:**
1. **Företagsinformation-slide** → Samla `{{FÖRETAGSNAMN}}`, `{{ORGNUMMER}}`, `{{KONTAKTPERSON}}`
2. **BokforingData-slide** → Samla `{{EMAIL}}`, `{{TELEFON}}`
3. **Riskbedömning-slide** → Byråchef fyller i `{{MÅNADSPRIS}}`
4. **"Acceptera kund"-knapp** → Generera avtal automatiskt
5. **Avtal-slide** → Visa PDF med ifyllda värden, BankID-signering

**State Management:**
```jsx
const [contractTemplate, setContractTemplate] = useState({
  hasCustomTemplate: false,
  customTemplateFile: null,
  useDefaultTemplate: true
});

// Val av standardmall
<input 
  type="radio" 
  checked={contractTemplate.useDefaultTemplate}
  onChange={() => setContractTemplate({
    ...contractTemplate, 
    useDefaultTemplate: true, 
    hasCustomTemplate: false
  })}
/>

// Val av egen mall
<input 
  type="radio" 
  checked={contractTemplate.hasCustomTemplate}
  onChange={() => setContractTemplate({
    ...contractTemplate, 
    useDefaultTemplate: false, 
    hasCustomTemplate: true
  })}
/>

// Upload-fält (visas endast om hasCustomTemplate = true)
{contractTemplate.hasCustomTemplate && (
  <input 
    type="file" 
    accept=".pdf,.docx"
    onChange={(e) => setContractTemplate({
      ...contractTemplate,
      customTemplateFile: e.target.files[0]
    })}
  />
)}
```

**Backend (framtida implementation):**
```javascript
POST /api/settings/contract-template/upload
{
  file: File,  // PDF eller DOCX
  encoding: "utf-8"
}

// Processering:
// 1. Spara fil i storage (S3/lokal)
// 2. Extrahera text och identifiera placeholders ({{...}})
// 3. Validera att placeholders är kända
// 4. Returnera lista över funna placeholders

// Response:
{
  templateId: "uuid-123",
  filename: "uppdragsavtal_custom.pdf",
  uploadedAt: "2025-11-03T10:00:00Z",
  size: 145000,
  placeholders: [
    "{{FÖRETAGSNAMN}}", 
    "{{MÅNADSPRIS}}", 
    "{{BYRÅNAMN}}"
  ],
  success: true
}

// Under onboarding - Generera avtal:
POST /api/onboarding/:sessionId/generate-contract
{
  templateId: "uuid-123",  // eller "default" för standardmall
  data: {
    "{{FÖRETAGSNAMN}}": "Acme AB",
    "{{ORGNUMMER}}": "556123-4567",
    "{{MÅNADSPRIS}}": "4500",
    "{{BYRÅNAMN}}": "Revision Stockholm AB"
  }
}

// Response: PDF med ifyllda värden
{
  contractPdf: "https://storage.../contracts/session-xyz-contract.pdf",
  success: true
}
```

**Standardmall location:**
`/public/uppdragsavtal_exempel.pdf` - används som fallback om byråchefen inte laddar upp egen mall

**Whitespace-hantering:**
Om en placeholder (t.ex. `{{TELEFON}}`) inte fylls i under onboarding:
- Ersätt med `""` (tom sträng) i PDF-generering
- Eller hoppa över raden helt (konfigurerbart)

**Komponenter:**

**Syfte:** Ladda upp ert eget avtalsformat som fylls i automatiskt under onboarding-sessionen

**Hur det fungerar:**
1. Ni skapar ert standardavtal i LaTeX-format (.tex fil)
2. Ni använder placeholders (t.ex. `{{client_name}}`) där kundinformation ska fyllas i
3. Systemet laddar upp och testar att kompilera mallen
4. Under onboarding-sessionen: Ni fyller i kundinformation i formulär
5. Systemet genererar automatiskt PDF med ifylld data - **inget manuellt arbete**

**UI:**
```
┌──────────────────────────────────────────────────┐
│  Ladda upp avtalsmall                             │
│                                                   │
│  ℹ️ Ladda upp ert standardavtal i LaTeX-format.  │
│  Under onboarding fylls avtalet automatiskt med  │
│  kundinformation från formulär - ingen manuell   │
│  editering krävs.                                │
│                                                   │
│  ──────────────────────────────────────────────── │
│                                                   │
│  📄 Nuvarande mall: uppdragsavtal_template.tex   │
│  Uppladdad: 2025-09-15                           │
│  Storlek: 24 KB                                  │
│                                                   │
│  [Ladda ner mall]  [Förhandsgranska PDF]         │
│                                                   │
│  ──────────────────────────────────────────────── │
│                                                   │
│  📤 Ladda upp ny mall (.tex fil)                 │
│                                                   │
│  [Välj fil___________________] [📁 Bläddra]      │
│                                                   │
│  ℹ️ Använd placeholders i ert LaTeX-avtal:       │
│  {{client_name}}, {{client_orgnr}},              │
│  {{firm_name}}, {{firm_address}},                │
│  {{date}}, {{price_total}}, {{payment_terms}}    │
│                                                   │
│  Dessa ersätts automatiskt när ni godkänner      │
│  klienten i onboarding-flödet.                   │
│                                                   │
│  [Ladda upp och testa kompilering]  [Avbryt]     │
│                                                   │
│  ──────────────────────────────────────────────── │
│                                                   │
│  📋 Tillgängliga placeholders:                   │
│  • {{client_name}} - Klientens företagsnamn      │
│     (hämtas från Bolagsverket under onboarding)  │
│  • {{client_orgnr}} - Organisationsnummer        │
│     (fylls i av byråchefen i formulär)           │
│  • {{client_address}} - Klientens adress         │
│     (från Bolagsverket eller manuellt)           │
│  • {{firm_name}} - Byråns namn                   │
│     (från Settings → Kontaktuppgifter)           │
│  • {{firm_orgnr}} - Byråns org.nr                │
│     (från Settings → Kontaktuppgifter)           │
│  • {{firm_address}} - Byråns adress              │
│     (från Settings → Kontaktuppgifter)           │
│  • {{compliance_officer}} - Ansvarig för AML     │
│     (från Settings → Kontaktuppgifter)           │
│  • {{date}} - Dagens datum                       │
│     (genereras automatiskt vid godkännande)      │
│  • {{price_total}} - Totalpris                   │
│     (från prisuppskattning i onboarding)         │
│  • {{payment_terms}} - Betalningsvillkor         │
│     (standard: 30 dagar, konfigurerbart)         │
│                                                   │
│  💡 Ni behöver INTE känna till klientinformation │
│  i förväg - allt fylls i automatiskt under       │
│  onboarding-sessionen!                           │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Exempel på användning i onboarding-flödet:**

1. **Byråchef startar onboarding-session för "Acme AB"**
2. **System hämtar automatiskt data:**
   - Företagsnamn från Bolagsverket: "Acme AB"
   - Org.nr: "556123-4567"
   - Adress: "Kungsgatan 10, Stockholm"
3. **Byråchef fyller i prisuppskattning:**
   - Grundavgift: 500 kr
   - SIE-import: 1000 kr
   - Layering-analys (7 år): 2500 kr
   - **Totalt: 4000 kr**
4. **Vid godkännande: "Generera avtal"-knapp**
5. **System genererar PDF automatiskt:**
   ```latex
   % uppdragsavtal_template.tex (er mall)
   \documentclass{article}
   \begin{document}
   
   UPPDRAGSAVTAL
   
   Detta avtal träffas mellan {{firm_name}} ({{firm_orgnr}})
   och {{client_name}} ({{client_orgnr}}).
   
   Totalt arvode: {{price_total}} kr exkl. moms
   Betalningsvillkor: {{payment_terms}} dagar
   
   Datum: {{date}}
   
   Ansvarig compliance officer: {{compliance_officer}}
   
   \end{document}
   ```
   
   **Blir automatiskt:**
   ```
   UPPDRAGSAVTAL
   
   Detta avtal träffas mellan Revision Stockholm AB (556789-1234)
   och Acme AB (556123-4567).
   
   Totalt arvode: 4000 kr exkl. moms
   Betalningsvillkor: 30 dagar
   
   Datum: 2025-11-01
   
   Ansvarig compliance officer: Anna Andersson
   ```

6. **PDF genereras och kan:**
   - Laddas ner direkt
   - Skickas till klient via email
   - Sparas i kunddatabasen

**Backend:**
```javascript
POST /api/settings/contract-template/upload
{
  file: File,  // .tex file
  encoding: "utf-8"
}

// Kompileringsprocess:
// 1. Spara .tex-fil temporärt
// 2. Testa kompilering med pdflatex
// 3. Om fel → testa med xelatex (för speciella typsnitt)
// 4. Om fel → testa med lualatex (för avancerade inställningar)
// 5. Om alla misslyckas → returnera felmeddelande

// Response (SUCCESS):
{
  templateId: "uuid-123",
  filename: "uppdragsavtal_template.tex",
  uploadedAt: "2025-10-31T12:00:00Z",
  size: 24576,
  compiledPdf: "/storage/templates/uuid-123.pdf",  // Preview PDF
  compilationEngine: "pdflatex",  // eller "xelatex", "lualatex"
  placeholders: [
    "{{client_name}}",
    "{{client_orgnr}}",
    "{{firm_name}}",
    // ...
  ],
  success: true,
  message: "✅ Kompilering lyckades med pdflatex! Mallen är redo att användas. Alla placeholders kommer fyllas automatiskt med kunddata under onboarding."
}

// Response (ERROR):
{
  success: false,
  error: "compilation_failed",
  message: "❌ Kompilering misslyckades. Kontrollera LaTeX-syntax och typsnitt.",
  compilationLog: `
    ! LaTeX Error: File 'mycustomfont.sty' not found.
    ...
  `,
  suggestedFix: "Om ni använder speciella typsnitt, kontakta support för att installera dessa på servern.",
  attemptedEngines: ["pdflatex", "xelatex", "lualatex"]
}
```

**UI - Kompileringsresultat (SUCCESS):**
```
┌──────────────────────────────────────────────────┐
│  ✅ Uppladdning lyckades!                         │
│                                                   │
│  Mallen har testats och kompilerar utan fel.     │
│                                                   │
│  Kompileringsmotor: pdflatex                     │
│  Filstorlek: 24 KB                               │
│  Antal placeholders: 10                          │
│                                                   │
│  Alla placeholders kommer fyllas automatiskt med │
│  kunddata under onboarding-sessionen.            │
│                                                   │
│  [Förhandsgranska PDF]  [Stäng]                  │
└──────────────────────────────────────────────────┘
```

**UI - Kompileringsresultat (ERROR):**
```
┌──────────────────────────────────────────────────┐
│  ❌ Kompilering misslyckades                      │
│                                                   │
│  Er LaTeX-mall kunde inte kompileras.            │
│                                                   │
│  Testade motorer:                                │
│  • pdflatex - Misslyckades                       │
│  • xelatex - Misslyckades                        │
│  • lualatex - Misslyckades                       │
│                                                   │
│  Felmeddelande:                                  │
│  ! LaTeX Error: File 'mycustomfont.sty' not found│
│                                                   │
│  Möjliga lösningar:                              │
│  1. Kontrollera att alla \usepackage är standard │
│  2. Ta bort speciala typsnitt eller kontakta     │
│     support för installation                     │
│  3. Testa kompilera lokalt först (texlive-full)  │
│                                                   │
│  [Visa full logg]  [Försök igen]  [Stäng]       │
└──────────────────────────────────────────────────┘
```

**Varför testa flera motorer?**
- **pdflatex:** Standard, stöder latinska tecken och svenska åäö
- **xelatex:** För UTF-8 och speciella typsnitt (t.ex. företagsfont)
- **lualatex:** För avancerade inställningar och moderna LaTeX-features

**Rekommendation i UI:**
```
💡 Tips: Testa kompilera er mall INNAN första onboarding-sessionen
för att säkerställa att typsnitt och paket fungerar korrekt.
```

GET /api/settings/contract-template
// Returns current template metadata

POST /api/contracts/generate
{
  templateId: "uuid-123",
  data: {
    client_name: "Acme AB",
    client_orgnr: "556123-4567",
    // ...
  }
}
// Returns generated PDF with filled-in placeholders
```

**LaTeX Compilation:**
- Server-side kompilering med pdflatex
- Placeholders ersätts innan kompilering
- Felhantering om .tex-fil inte kan kompileras
- Förhandsvisning av genererad PDF innan användning

### 3.5 Egna frågor (NY FUNKTION - config.json)

**Syfte:** Ladda upp egna KYC-frågor genom config.json

**UI:**
```
┌──────────────────────────────────────────────────┐
│  Ladda upp egna KYC-frågor                        │
│                                                   │
│  📄 Nuvarande config: custom_questions.json      │
│  Uppladdad: 2025-09-15                           │
│  Antal frågor: 3 egna frågor                     │
│                                                   │
│  [Ladda ner mall]  [Ladda ner nuvarande config]  │
│                                                   │
│  ──────────────────────────────────────────────── │
│                                                   │
│  📤 Ladda upp ny config.json                     │
│                                                   │
│  [Välj fil___________________] [📁 Bläddra]      │
│                                                   │
│  ℹ️ Exempel på config.json struktur:             │
│                                                   │
│  {                                                │
│    "customQuestions": [                          │
│      {                                            │
│        "id": "custom_q1",                        │
│        "question": "Din fråga 1 här",            │
│        "legalText": "Din lagtext 1 här",         │
│        "type": "text|dropdown|checkbox",         │
│        "required": true,                         │
│        "options": ["Alt 1", "Alt 2"]  // Om dropdown│
│      },                                           │
│      {                                            │
│        "id": "custom_q2",                        │
│        "question": "Din fråga 2 här",            │
│        "legalText": "Din lagtext 2 här",         │
│        "type": "text",                           │
│        "required": false                         │
│      }                                            │
│    ]                                              │
│  }                                                │
│                                                   │
│  [Ladda upp]  [Avbryt]                           │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Backend:**
```javascript
POST /api/settings/custom-questions/upload
{
  file: File  // config.json
}

// Validation:
// - Check JSON syntax
// - Validate required fields (id, question, type)
// - Check that question types are valid
// - Ensure unique IDs

// Response:
{
  configId: "uuid-456",
  filename: "custom_questions.json",
  uploadedAt: "2025-10-31T12:00:00Z",
  questionCount: 3,
  questions: [
    {
      id: "custom_q1",
      question: "Din fråga 1 här",
      type: "text"
    },
    // ...
  ]
}

GET /api/settings/custom-questions
// Returns current config

// Integration i onboarding:
GET /api/onboarding/questions
// Returns standard questions + custom questions merged
```

**Mall för nedladdning (example_config.json):**

⚠️ **VIKTIGT:** `placeholder`-fältet är en UI-hjälptext för KLIENTEN när de fyller i formuläret - **INTE ett korrekt svar eller facit**. Dessa är öppna frågor för riskbedömning där byråchefen läser svaren och gör en bedömning.

```json
{
  "customQuestions": [
    {
      "id": "custom_q1",
      "question": "Varifrån kommer företagets intäkter primärt?",
      "legalText": "Penningtvättslagen (2017:630) 4 kap. 1 § - Kunskap om kundens verksamhet",
      "type": "text",
      "required": true,
      "placeholder": "T.ex. försäljning av varor, konsulttjänster, fastighetsförvaltning..."
    },
    {
      "id": "custom_q2",
      "question": "Förväntas företaget ta emot eller göra kontantbetalningar över 50 000 kr?",
      "legalText": "Penningtvättslagen (2017:630) 4 kap. 2 § - Identifiering av risker",
      "type": "dropdown",
      "required": true,
      "options": ["Ja, regelbundet", "Ja, sällan", "Nej, aldrig", "Vet ej"]
    },
    {
      "id": "custom_q3",
      "question": "Har företaget affärsrelationer i högriskländer (enligt FATF)?",
      "legalText": "Penningtvättslagen (2017:630) 4 kap. 3 § - Geografiska riskfaktorer",
      "type": "dropdown",
      "required": true,
      "options": ["Ja", "Nej", "Planeras"]
    }
  ]
}
```

**Exempel på användarens svar som kräver uppföljning:**

✅ **Normalt svar:**
> "Försäljning av redovisningstjänster till småföretag, fakturering månadsvis."

⚠️ **Suspekt svar (kräver uppföljning av byråchef):**
> "Vunnit på lotto och trav, även lite kryptovaluta."

**Detta är INTE ett certifieringstest** - byråchefen läser alla svar och gör en helhetsbedömning av risknivån. Systemet validerar INTE svar automatiskt utan presenterar dem för manuell granskning.

---

## 4. Prenumeration (NY struktur baserad på Volt Pro)

### Design-beslut: **Sidebar entry MED tabell**

**Rationale:**
- Volt Pro använder både Billing-sida OCH Transactions-tabell
- Vi kombinerar båda: Översikt i card + Fakturatabell nedanför
- Dubbelklick på rad → Öppnar faktura i modal (inte ny sida)

### 4.1 Översikt (Volt Pro ChangePlanWidget-inspirerad)

```
┌──────────────────────────────────────────────────┐
│  💳 Prenumeration                                 │
│                                                   │
│  Plan: Professional                               │
│  Status: ✅ Aktiv                                │
│  Pris: 1 995 kr/månad                            │
│  Nästa faktura: 2025-11-15                       │
│                                                   │
│  Betalningsmetod: •••• 4242                      │
│  Giltig till: 12/2026                            │
│                                                   │
│  [Ändra plan]  [Uppdatera betalning]            │
│  [Avsluta prenumeration]                         │
└──────────────────────────────────────────────────┘
```

### 4.2 Fakturor (Volt Pro Transactions-inspirerad)

**Tabell med dubbelklick:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  📋 Fakturhistorik                                                   │
│                                                                      │
│  [Sök: ____________]  [Status: ▼ Alla]  [År: ▼ 2025]               │
│                                                                      │
│  Fakturanr    Datum      Belopp   Status      Förfallodatum  PDF    │
│  ───────────────────────────────────────────────────────────────── │
│  300501    2025-10-15   1 995 kr  ✅ Betald   2025-11-15    [📄]   │
│  300500    2025-09-15   1 995 kr  ✅ Betald   2025-10-15    [📄]   │
│  300499    2025-08-15   1 995 kr  ⏰ Förfallen 2025-09-15   [📄]   │
│  300498    2025-07-15   1 995 kr  ✅ Betald   2025-08-15    [📄]   │
│                                                                      │
│  💡 Dubbelklicka på rad för att visa faktura                        │
└─────────────────────────────────────────────────────────────────────┘
```

**Status badges:**
- ✅ Betald (grön)
- ⏰ Förfallen (röd)
- 🕐 Väntande (gul)
- ❌ Avbruten (grå)

**Dubbelklick → Modal med faktura:**
```
┌──────────────────────────────────────────────────┐
│  📄 Faktura #300501                          [✖] │
│                                                   │
│  [Se Volt Pro Invoice.js för layout]            │
│                                                   │
│  - Logo                                          │
│  - Företagsinfo                                  │
│  - Klientinfo                                    │
│  - Line items                                    │
│  - Subtotal / VAT / Total                       │
│  - Payment info                                  │
│                                                   │
│  [Ladda ner PDF]  [Skriv ut]  [Stäng]           │
└──────────────────────────────────────────────────┘
```

**Backend:**
```javascript
GET /api/subscription/overview
{
  plan: "professional",
  status: "active",
  pricePerMonth: 1995,
  nextBillingDate: "2025-11-15",
  paymentMethod: {
    type: "card",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2026
  }
}

GET /api/subscription/invoices
{
  invoices: [
    {
      id: 300501,
      date: "2025-10-15",
      amount: 1995,
      currency: "SEK",
      status: "paid",
      dueDate: "2025-11-15",
      pdfUrl: "https://stripe.com/invoices/pdf/123...",  // External link
      items: [
        { description: "Professional Plan", quantity: 1, price: 1995 }
      ]
    },
    // ...
  ]
}

GET /api/subscription/invoices/:id
// Returns full invoice details for modal

### 4.3 Fakturering och rörliga API-kostnader (policy)

**Sammanfattning:** Appen har ett fast månadspris (t.ex. 1 995 kr/mån) plus rörliga kostnader för externa API-anrop. Dessa rörliga kostnader specificeras fullständigt på fakturan och i dokumentationen som genereras för varje onboarding-session. Vi visar inte en löpande "API-counter" i Settings — B2B-kunder får full insyn via faktura och per-session PDF.

1) Förhandsinformation och popup
- Innan något externt API-anrop som medför kostnad (särskilt layering-analys) visas en bekräftelse-popup i onboarding-flödet med kostnadsuppskattning (t.ex. layering 7 år: 2 500 kr + hanteringsavgift). Användaren måste bekräfta för att anropet ska genomföras.

2) Två separata betalningar vid fullständig onboarding (för trial / out-of-pocket-flöde)
- För att undvika oklarheter delas betalningen upp i två Stripe-betalningar när det är motiverat:
  - Betalning A: Statisk KYC (Bolagsverket, PEP, sanktionskontroller etc.) — liten summa (t.ex. ~15–50 kr med markup)
  - Betalning B: Layering-analys (om användaren väljer detta) — stor summa (t.ex. 2 500 kr + markup)

3) Fakturor och kvittenser
- Varje Stripe-betalning genererar automatiskt en betalningskvitto/PDF som användaren kan ladda ner (används t.ex. för utlägg och lönehantering). När kunden senare faktureras per företag (faktura 30 dagar) inkluderas alla rörliga poster som en fullständig specifikation på fakturan.
- Fakturan måste vara fullständigt specificerad (exempelvis: månadsavgift, antal användare x pris, antal API-anrop x pris). Se exempel i denna spec (ovan) för format.

4) Verifieringsflöde för fakturabetalning (byråchef som vill faktura)
- Om byråchefen väljer "Faktura" men är ännu ej verifierad (status `invoice_pending`):
  - Hen måste betala månadsavgift och eventuella API-anrop **ur egen ficka via Stripe** tills verifiering är slutförd.
  - När administrativ verifiering (Bolagsverket + telefonkontroll) godkänns, uppdateras kontot till `paid_invoice` och tidigare Stripe-utlägg krediteras/kompenseras på första fakturan (eller enligt avtal).

5) Per-onboarding dokumentation
- Resultatet av varje onboarding-session inkluderar en PDF-rapport som bifogas vid nedladdning. Denna PDF innehåller:
  - Lista över utförda externa API-anrop och deras individuella kostnader
  - Sammanfattning av analysresultat (t.ex. layering-avvikelser, PEP-träffar)
  - Genererat uppdragsavtal (om tillämpligt)

6) Varför ingen API-counter i Settings?
- För B2B är faktura + per-session dokumentation den korrekta platsen för kostnadsgranskning. En realtidsräknare i Settings är mer relevant för B2C och riskerar att skapa onödig brus i gränssnittet. Istället: popup före kostnadsdrivande anrop + fullständig post-factum-specifikation.

7) Exempel – fakturarader (visning på faktura och i session-PDF):
```
Månadsprenumeration (nov 2025)           1 995 kr
Användare (5 st à 20 kr)                   100 kr
Externa API-anrop:                         1 000 kr
  - Bolagsverket (x50 à 2 kr)                100 kr
  - PEP-screening (x100 à 5 kr)              500 kr
  - Sanktionskontroller (x50 à 5 kr)         250 kr
  - Layering-analys (1 à 2 500 kr)          2 500 kr
```

Obs: Moms och summering visas enligt vanligt fakturautseende.

```

**OBS:**
- Faktura-PDFer lagras INTE lokalt - endast metadata och externa länkar
- Kunden kan ladda ner fakturor direkt från Stripe/Klarna/Fortnox
- Integration med Fortnox/Stripe för fakturahantering

---

## 5. Avtal (Agreement Management)

### 5.1 Översikt

Denna sektion visar alla BankID-signerade avtal som är kopplade till byråns konto. Tre typer av avtal lagras:

1. **Prova-på-avtal** (Trial Agreement)
   - Signeras vid första onboarding-sessionen
   - Täcker KYC-kostnader (statisk: ~18 kr)
   - Täcker forensisk analys (dynamisk: beräknas efter SIE-uppladdning)
   - Giltig för en (1) onboarding-session

2. **Företagsavtal** (Subscription Agreement)
   - Signeras vid konvertering från trial till betald prenumeration
   - Fast månadspris: 1 995 kr/mån
   - Rörliga API-kostnader (faktureras månadsvis)
   - Löper tills uppsägning

3. **Uppdragsavtal** (Assignment Agreement)
   - Genereras PER onboarding-session (efter trial)
   - Täcker specifika KYC + forensik-kostnader för den sessionen
   - Signeras av slutkunden (inte byråchefen) via BankID-popup
   - Bifogas som PDF tillsammans med forensik-rapporten

### 5.2 UI-layout

```
┌──────────────────────────────────────────────────────────────┐
│  📄 AVTAL                                                      │
│                                                               │
│  Här hittar du alla BankID-signerade avtal för din byrå.     │
│  Prova-på-avtal gäller endast för första onboarding-         │
│  sessionen. Företagsavtal gäller löpande prenumeration.      │
│  Uppdragsavtal genereras per kund-onboarding.                │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│  📋 Prova-på-avtal                                            │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ✅ Signerat: 2025-11-02 14:32                         │  │
│  │  📝 Avtalsnummer: TRIAL-2025-1102-A4F7                 │  │
│  │  👤 Signatär: Lasse Andersson (19850315-XXXX)         │  │
│  │                                                        │  │
│  │  Kostnad:                                              │  │
│  │    • Statisk KYC: 18 kr                                │  │
│  │    • Forensisk analys (3 år): 64 kr                    │  │
│  │    • Totalt: 82 kr (betalt via Stripe)                │  │
│  │                                                        │  │
│  │  Status: ✅ Genomförd (2025-11-02 15:10)               │  │
│  │                                                        │  │
│  │  [Ladda ner PDF]  [Visa BankID-kvitto]                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│  🏢 Företagsavtal                                             │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ✅ Signerat: 2025-11-05 10:15                         │  │
│  │  📝 Avtalsnummer: SUB-2025-1105-B9E2                   │  │
│  │  👤 Signatär: Lasse Andersson (19850315-XXXX)         │  │
│  │                                                        │  │
│  │  Prenumeration:                                        │  │
│  │    • Fast pris: 1 995 kr/mån                           │  │
│  │    • Rörliga API-kostnader faktureras månadsvis        │  │
│  │    • Startdatum: 2025-11-05                            │  │
│  │    • Nästa faktura: 2025-12-05                         │  │
│  │                                                        │  │
│  │  Status: ✅ Aktivt                                      │  │
│  │                                                        │  │
│  │  [Ladda ner PDF]  [Visa BankID-kvitto]                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│  📝 Uppdragsavtal                                             │
│                                                               │
│  Visar alla uppdragsavtal som genererats för kund-           │
│  onboardingar. Varje avtal är unikt per session.             │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ✅ Signerat: 2025-11-10 09:45                         │  │
│  │  📝 Avtalsnummer: ASSIGN-2025-1110-C3D8                │  │
│  │  👤 Signatär: Erik Johansson (19920520-XXXX)          │  │
│  │  🏢 Företag: Johanssons Bygg AB (556123-4567)         │  │
│  │                                                        │  │
│  │  Kostnad:                                              │  │
│  │    • Statisk KYC: 18 kr                                │  │
│  │    • Forensisk analys (5 år): 2 123 kr                 │  │
│  │    • Totalt: 2 141 kr (fakturerat till byrån)         │  │
│  │                                                        │  │
│  │  Status: ✅ Genomförd (2025-11-10 10:30)               │  │
│  │                                                        │  │
│  │  [Ladda ner PDF]  [Visa BankID-kvitto]                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ✅ Signerat: 2025-11-08 14:20                         │  │
│  │  📝 Avtalsnummer: ASSIGN-2025-1108-F1A9                │  │
│  │  👤 Signatär: Maria Svensson (19880712-XXXX)          │  │
│  │  🏢 Företag: Svenssons Handel AB (559876-5432)        │  │
│  │                                                        │  │
│  │  Kostnad:                                              │  │
│  │    • Statisk KYC: 18 kr                                │  │
│  │    • Forensisk analys (3 år): 1 544 kr                 │  │
│  │    • Totalt: 1 562 kr (fakturerat till byrån)         │  │
│  │                                                        │  │
│  │  Status: ✅ Genomförd (2025-11-08 15:05)               │  │
│  │                                                        │  │
│  │  [Ladda ner PDF]  [Visa BankID-kvitto]                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  [Visa alla uppdragsavtal (23)]                               │
└──────────────────────────────────────────────────────────────┘
```

### 5.3 Dynamisk prissättning (Forensisk analys)

**KRITISK INSIKT:** Kostnaden för forensisk analys (layering) kan INTE visas som fast pris i avtalet, eftersom den beror på antalet B2B-transaktioner i SIE-filen.

**Exempel på variation:**
- År -1 (2024): 30 B2B-transaktioner × 2 kr = 60 kr
- År -2 (2023): 1 000 B2B-transaktioner × 2 kr = 2 000 kr
- År -3 (2022): 150 B2B-transaktioner × 2 kr = 300 kr

**Total variation:** 50x beroende på verksamhetens aktivitet!

**Lösning: Två-stegs prissättning**

1. **Steg 1: BankID-signering UTAN specifikt pris**
   - Användaren signerar avtalet VIA BankID
   - Avtalstexten säger: "Kostnad för forensisk analys beräknas efter SIE-analys"
   - INGEN fast summa visas i detta skede
   - Juridiskt korrekt enligt Konsumentköplagen (transparent, ej vilseledande)

2. **Steg 2: Efter SIE-uppladdning → Visa EXAKT pris**
   - Backend räknar antalet B2B-transaktioner per år
   - Frontend visar checkbox per år med EXAKT kostnad:
   
```
┌──────────────────────────────────────────────────────────────┐
│  📊 Välj år för forensisk analys                              │
│                                                               │
│  Vi har analyserat din SIE-fil och räknat antalet            │
│  B2B-transaktioner per år. Priset är 2 kr per transaktion.   │
│                                                               │
│  Välj vilka år du vill analysera:                             │
│                                                               │
│  ☑️ År -1 (2024): 30 transaktioner = 60 kr                    │
│  ☐  År -2 (2023): 1 000 transaktioner = 2 000 kr             │
│  ☐  År -3 (2022): 150 transaktioner = 300 kr                 │
│  ☐  År -4 (2021): 80 transaktioner = 160 kr                  │
│  ☐  År -5 (2020): 45 transaktioner = 90 kr                   │
│                                                               │
│  Statisk KYC: 18 kr (obligatorisk)                            │
│  Forensisk analys: 60 kr (baserat på ditt val)               │
│                                                               │
│  💰 Totalt: 78 kr om du klickar "Nästa"                       │
│                                                               │
│  [Tillbaka]  [Nästa →]                                        │
└──────────────────────────────────────────────────────────────┘
```

3. **Steg 3: Betalning**
   - Om trial: Stripe-betalning (direkt)
   - Om prenumeration: Faktureras till byrån (månadsfaktura)

4. **Steg 4: Uppdatera avtal med faktisk kostnad**
   - Efter betalning: Uppdatera `agreement_costs`-tabellen
   - PDF genereras med slutgiltig kostnad
   - BankID-kvitto visar ursprunglig signering (utan pris)
   - PDF-rapport visar slutgiltig kostnad (efter val)

**Juridisk motivering:**
- Svensk Konsumentköplagen kräver transparent prissättning
- Att visa "~2 500 kr" i avtalet är vilseledande om faktisk kostnad blir 60 kr
- Att visa exakt pris EFTER SIE-analys är transparent och korrekt
- Användaren ser exakt vad hen betalar INNAN betalning

**Implementation:**
```javascript
// Steg 1: Skapa avtal utan specifik kostnad
POST /api/agreements/create-trial
{
  firmId: "uuid",
  agreementType: "trial",
  staticKycCost: 18,
  layeringYears: null,  // Not yet determined
  totalCost: null       // Not yet determined
}

// Steg 2: Efter SIE-analys
POST /api/pricing/analyze-sie
{
  firmId: "uuid",
  sieFile: "base64..."
}
// Response:
{
  transactionCounts: {
    "2024": 30,
    "2023": 1000,
    "2022": 150,
    "2021": 80,
    "2020": 45
  },
  pricePerTransaction: 2
}

// Steg 3: Användaren väljer år
POST /api/pricing/calculate-cost
{
  firmId: "uuid",
  selectedYears: ["2024"]  // Only year -1
}
// Response:
{
  staticKycCost: 18,
  layeringCost: 60,
  totalCost: 78
}

// Steg 4: Uppdatera avtal efter betalning
PATCH /api/agreements/:id/finalize-cost
{
  layeringYears: {"2024": 60},
  totalCost: 78,
  paid: true,
  stripePaymentId: "pi_..."
}
```

### 5.4 Backend API-endpoints

```javascript
// List all agreements for firm
GET /api/agreements/list/:firmId
{
  trialAgreement: {...},
  subscriptionAgreement: {...},
  assignmentAgreements: [...]
}

// Get specific agreement
GET /api/agreements/:agreementId
{
  id: "uuid",
  firmId: "uuid",
  agreementType: "trial",
  bankidTransactionId: "abc123...",
  signedAt: "2025-11-02T14:32:00Z",
  signerName: "Lasse Andersson",
  signerPersonnr: "ENCRYPTED",  // Hashed with bcrypt
  agreementText: "Fullständig avtalstext...",
  pdfUrl: "https://celestial-agreements.fra1.digitaloceanspaces.com/trial-agreements/uuid/trial-2025-1102-a4f7.pdf",
  status: "active"
}

// Download agreement PDF
GET /api/agreements/:agreementId/pdf
// Returns: Signed PDF from DigitalOcean Spaces

// Get BankID receipt
GET /api/agreements/:agreementId/bankid-receipt
{
  transactionId: "abc123...",
  signedAt: "2025-11-02T14:32:00Z",
  signerName: "Lasse Andersson",
  signerPersonnr: "19850315-XXXX",  // Masked
  signature: "base64..."
}

// Cancel agreement (soft delete)
DELETE /api/agreements/:agreementId
{
  reason: "Customer cancelled subscription"
}
// Sets status = "cancelled", schedules deletion after 30 days
```

### 5.5 Databasschema

**Tabell: agreements**
```sql
CREATE TABLE agreements (
  id UUID PRIMARY KEY,
  firm_id UUID NOT NULL,
  agreement_type VARCHAR(50) NOT NULL,  -- 'trial', 'subscription', 'assignment'
  bankid_transaction_id VARCHAR(255) NOT NULL,
  signed_at TIMESTAMP NOT NULL,
  signer_name VARCHAR(255) NOT NULL,
  signer_personnr VARCHAR(255) NOT NULL,  -- ENCRYPTED with bcrypt
  agreement_text TEXT NOT NULL,
  pdf_url VARCHAR(500) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',  -- 'active', 'expired', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (firm_id) REFERENCES firms(id)
);

CREATE INDEX idx_agreements_firm_id ON agreements(firm_id);
CREATE INDEX idx_agreements_type ON agreements(agreement_type);
CREATE INDEX idx_agreements_status ON agreements(status);
```

**Tabell: agreement_costs**
```sql
CREATE TABLE agreement_costs (
  id UUID PRIMARY KEY,
  agreement_id UUID NOT NULL,
  static_kyc_cost DECIMAL(10, 2) DEFAULT 18.00,
  layering_years JSONB,  -- {"2024": 60, "2023": 2000, ...}
  total_cost DECIMAL(10, 2),
  paid BOOLEAN DEFAULT FALSE,
  stripe_payment_id VARCHAR(255),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (agreement_id) REFERENCES agreements(id)
);

CREATE INDEX idx_agreement_costs_agreement_id ON agreement_costs(agreement_id);
CREATE INDEX idx_agreement_costs_paid ON agreement_costs(paid);
```

**Exempel data:**
```sql
-- Prova-på-avtal
INSERT INTO agreements VALUES (
  'uuid-trial',
  'uuid-firm',
  'trial',
  'bankid-abc123',
  '2025-11-02 14:32:00',
  'Lasse Andersson',
  '$2b$12$...',  -- Encrypted personnr
  'Fullständig avtalstext...',
  'https://celestial-agreements.fra1.digitaloceanspaces.com/trial-agreements/uuid-firm/trial-2025-1102-a4f7.pdf',
  'active'
);

INSERT INTO agreement_costs VALUES (
  'uuid-cost',
  'uuid-trial',
  18.00,
  '{"2024": 60}',
  78.00,
  TRUE,
  'pi_stripe123',
  '2025-11-02 14:35:00'
);
```

### 5.6 File Storage (DigitalOcean Spaces)

**Bucket:** `celestial-agreements`

**Folder Structure:**
```
celestial-agreements/
├── trial-agreements/{firm_id}/
│   ├── trial-2025-1102-a4f7.pdf
│   ├── trial-2025-1105-b9e2.pdf
│   └── bankid-receipts/
│       ├── bankid-abc123.json
│       └── bankid-def456.json
│
├── subscription-agreements/{firm_id}/
│   ├── subscription-2025-1105-c3d8.pdf
│   └── bankid-receipts/
│       └── bankid-ghi789.json
│
└── assignment-agreements/{firm_id}/
    ├── assign-2025-1110-f1a9.pdf
    ├── assign-2025-1108-e2b4.pdf
    └── bankid-receipts/
        ├── bankid-jkl012.json
        └── bankid-mno345.json
```

**Security:**
- All files encrypted at rest (AES-256)
- Signed URLs with 15-minute expiration for downloads
- CORS restricted to celestial.se domain only
- Audit log for all access (who, when, IP address)

**Pricing:** ~0.02 USD/GB/month (DigitalOcean Spaces)

### 5.7 GDPR-compliance

**Personuppgifter som lagras:**
- Personnummer (ENCRYPTED med bcrypt)
- Namn (plaintext, nödvändigt för avtalsvisning)
- BankID-transaktions-ID (plaintext, behövs för verifiering)
- IP-adress vid signering (audit log, 90 dagar retention)

**Användarrättigheter:**
1. **Rätt till radering:** Soft delete efter 30 dagar, permanent delete efter 365 dagar
2. **Rätt till dataportabilitet:** Export av alla avtal som JSON + PDF
3. **Rätt till tillgång:** Användaren kan alltid ladda ner sina egna avtal
4. **Rätt till rättelse:** Kan inte redigera signerat avtal (BankID-integritet), men kan kontakta support

**Audit Trail:**
```sql
CREATE TABLE agreement_audit_log (
  id UUID PRIMARY KEY,
  agreement_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,  -- 'view', 'download', 'delete', 'access'
  user_id UUID,  -- Who accessed it (byråchef, admin, support)
  ip_address VARCHAR(45),
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (agreement_id) REFERENCES agreements(id)
);
```

---

## 6. Danger Zone (oförändrat från LaTeX-spec)

```
┌──────────────────────────────────────────────────┐
│  ⚠️ DANGER ZONE                                   │
│                                                   │
│  Ta bort konto                                    │
│                                                   │
│  ⚠️ Varning: All data raderas omedelbart och     │
│  kan ej återställas.                             │
│                                                   │
│  □ Jag förstår att detta är permanent            │
│                                                   │
│  [Ta bort konto permanent]                        │
└──────────────────────────────────────────────────┘
```

**Backend:**
```javascript
DELETE /api/account
{
  confirmation: true
}

// Soft delete:
// - Set account.status = "deleted"
// - Schedule data deletion after 30 days
// - Send confirmation email
// - Revoke all access tokens
```

---

## Risktester-sektionen (från LaTeX-spec)

**INTE EN SIDEBAR-ENTRY** - men viktigt att dokumentera:

### Vad LaTeX-specen säger:

✅ **Risktester kan INTE stängas av** av användaren
- Kategori 1: SIE-filintegritet
- Kategori 2: Bristande bokföringskompetens
- Kategori 3: Fuskindikationer (Test 3.7 AI-detektering, 3.8 Raderade transaktioner, 3.9 Sekvensbrott)
- Kategori 4: Penningtvätt & kundbedrägeri (layering, PEP, sanktionslistor)

### Ändring du nämnde:

❌ **Ta bort "stänga av tester"-option** i Settings

✅ **Ersätt med popup MED prisuppgift** i appen (INTE Settings):
- När layering-analys ska köras → popup med:
  * "Layering-analys kommer att köras"
  * "Pris: 2 500 kr (7 år) / 2 000 kr (5 år) / 1 500 kr (3 år)"
  * "Beräknat på antal transaktioner: 15 342"
  * [Fortsätt] [Avbryt]

**Implementation:**
- Popup visas i onboarding-flödet (INTE i Settings)
- Pris beräknas dynamiskt baserat på transaktionslista
- Använder prislista från Settings → Byråinställningar → Prislista

---

## Implementation Notes

### Volt Pro-komponenter att återanvända:

1. **Users.js** → User Management tabell
2. **Transactions.js** → Fakturatabell
3. **Invoice.js** → Faktura-modal (dubbelklick)
4. **Billing.js** → ChangePlanWidget + OrderHistoryWidget
5. **SweetAlert2** → Bekräftelse-dialogs

### React Router navigering:

```jsx
// I Settings.jsx
import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();
  
  return (
    <div>
      <Button onClick={() => navigate('/dashboard')}>
        ← Tillbaka till Dashboard
      </Button>
      {/* Settings content */}
    </div>
  );
}
```

### Sidebar navigation:

```jsx
const settingsSections = [
  { id: 'users', title: 'Användare', icon: UsersIcon, subsections: [...] },
  { id: 'access', title: 'Åtkomst', icon: KeyIcon, subsections: [...] },
  { id: 'firm', title: 'Byråinställningar', icon: BuildingIcon, subsections: [...] },
  { id: 'subscription', title: 'Prenumeration', icon: CreditCardIcon },
  { id: 'danger', title: 'Danger Zone', icon: ExclamationIcon }
];
```

---

## Sammanfattning av förändringar från tidigare spec

### ✅ BEHÅLLS:
- User Management (Alla användare, Lägg till)
- Fjärronboarding-sessioner
- Kontaktuppgifter

### 🆕 NYTT:
1. **Navigering:** "← Tillbaka till Dashboard"-knapp
2. **Kollega-inlogg:** Shadowing/utbildning för nyanställda
3. **Prislista:** Fast pris med override-möjlighet
4. **Avtalsmall:** LaTeX-upload med placeholders
5. **Egna frågor:** config.json-upload för custom KYC-frågor
6. **Prenumeration:** Översikt + Fakturatabell med dubbelklick-modal

### ❌ BORTTAGET:
- "Stänga av tester"-option (flyttad till popup i appen med prisuppgift)

---

## Nästa steg

1. **Granska denna spec tillsammans**
2. **Titta på Volt Pro-komponenter live** (http://localhost:5173)
3. **Börja implementation** med Extensions-Claude:
   - Steg 1: Settings-sidebar navigation
   - Steg 2: User Management (återanvänd Volt Pro Users.js)
   - Steg 3: Fjärronboarding + Kollega-inlogg
   - Steg 4: Byråinställningar (Prislista, Avtalsmall, Egna frågor)
   - Steg 5: Prenumeration (Översikt + Fakturatabell)
   - Steg 6: Danger Zone

---

**Frågor att diskutera:**

1. Ska faktura-modal vara full-screen eller overlay?
2. Vill du ha "Förhandsgranska" för LaTeX-mall före save?
3. Ska egna frågor kunna ordnas om (drag-and-drop)?
4. Ska kollega-inlogg ha egen tabell eller bara lista under Åtkomst?
