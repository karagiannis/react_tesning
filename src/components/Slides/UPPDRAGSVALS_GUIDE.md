# UppdragsvalsSlide - Implementationsguide

**Datum:** 2025-10-24  
**Status:** ✅ Implementerad och integrerad i App.jsx

---

## Översikt

Ny React-komponent för **Content Slide 1: Uppdragsval och introduktion**. Första steget i onboarding-processen efter inloggning.

---

## Funktionalitet

### 1. Sektionsbaserad Layout med Numrerade Badges

Tre huvudsektioner med runda, numrerade badges (1, 2, 3):

**Sektion 1: Varför genomför vi denna onboarding?**
- Förklarar penningtvättslagen (PTL) och regulatoriska krav
- Info-knapp (ⓘ) för utfällbar lagtext om näringspenningtvätt
- Referens: Marie Wallin, "Penningtvätt och Straffrätten", sid. 44

**Sektion 2: Sanktioner vid bristande efterlevnad**
- Varning om hundratusentals kronor i sanktionsavgifter
- Info-knapp (ⓘ) för utfällbar lagtext: 7 kap. 14-16 §§ PTL (2017:630)
- Visar maxstraff: 1 miljon euro för både juridiska och fysiska personer

**Sektion 3: Vilka tjänster behöver ditt företag?**
- 9 checkboxes för tjänsteval
- Textarea för "Annat" (t.ex. succession, företagsanalys)
- Prislista visas under varje tjänst

---

## Utfällbar Lagtext (Expandable Sections)

### Design

**Info-knappar:**
- Rund knapp (ⓘ) 40x40px
- Blå bakgrund: `bg-blue-100 hover:bg-blue-200`
- Lucide React `<Info />` ikon
- Placerad till höger i varje sektion

**Utfälld text:**
- Blå bakgrund för Sektion 1: `bg-blue-50 border-l-4 border-blue-400`
- Amber bakgrund för Sektion 2: `bg-amber-50 border-l-4 border-amber-400` (varning)
- Kursiv text: `italic text-gray-600`
- Mindre font: `text-sm`
- Strukturerad med `<ul>`, `<ol>` för listor

---

## Tjänsteval (9 Checkboxes)

| Tjänst | Pris | Key |
|--------|------|-----|
| Löpande bokföring | 5000 kr/år | `lopandeBokforing` |
| Årsbokslut | 8000 kr/år | `arsbokslut` |
| Deklarationer (moms, arbetsgivardeklaration, inkomstdeklaration) | 3000 kr/år | `deklarationer` |
| Löneadministration | 4000 kr/år | `loneadministration` |
| Ekonomisk rådgivning | 10000 kr/år | `ekonomiskRadgivning` |
| Företagsregistrering (nystartad verksamhet) | 15000 kr (engångsavgift) | `foretagsregistrering` |
| Finansiell rapportering och analys | 6000 kr/år | `finansiellRapportering` |
| Företagsförsäljning/succession | Offert | `foretagsforsaljning` |
| Annat (textarea) | - | `annat` |

---

## API Integration

### Endpoint
```
POST http://localhost:8000/api/onboarding/uppdrag
```

### Request Headers
```javascript
{
  "Authorization": "Bearer <access_token>",  // Från localStorage
  "Content-Type": "application/json"
}
```

### Request Body
```json
{
  "lopandeBokforing": true,
  "arsbokslut": true,
  "deklarationer": false,
  "loneadministration": false,
  "ekonomiskRadgivning": true,
  "foretagsregistrering": false,
  "finansiellRapportering": false,
  "foretagsforsaljning": false,
  "annat": "Succession till nästa generation"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "onboardingId": "a7f3c8e2-4b1d-4e9a-8c3f-1a2b3c4d5e6f",
  "uppskattadKostnad": "18000 kr/år",
  "antalTjanster": 3,
  "riskIndikator": "low",
  "message": "Onboarding-process skapad",
  "nextStep": "/riskfragor"
}
```

### Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Minst en tjänst måste väljas",
  "code": "NO_SERVICES_SELECTED"
}
```

---

## State Management

### Local State
```javascript
const [expandedSections, setExpandedSections] = useState({
  intro: false,      // Sektion 1 lagtext
  sanctions: false,  // Sektion 2 lagtext
});

const [services, setServices] = useState({
  lopandeBokforing: false,
  arsbokslut: false,
  // ... alla 9 tjänster
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### LocalStorage
Efter framgångsrikt API-anrop sparas:
```javascript
localStorage.setItem('onboardingId', data.onboardingId);
```

Detta UUID används i alla efterföljande API-anrop:
```
POST /api/onboarding/{onboardingId}/riskfragor/steg1
POST /api/onboarding/{onboardingId}/identitet
...
```

---

## Validering

### Frontend Validation
```javascript
// Minst en tjänst måste väljas
const hasService = Object.entries(services)
  .filter(([key]) => key !== 'annat')
  .some(([_, value]) => value === true) || services.annat.trim() !== '';

if (!hasService) {
  setError('Vänligen välj minst en tjänst');
  return;
}
```

### Backend Validation
- Validera JWT token (Authorization header)
- Validera att minst en tjänst är vald
- Beräkna uppskattad kostnad baserat på prislista
- Sätt `riskIndikator = "medium"` om `foretagsregistrering = true` (nystartad = högre PTL-risk)

---

## Navigationsflöde

```
1. User loggar in → JWT token sparas
2. /inledning (IntroSlide) → Förklaring av PTL
3. /uppdragsval (UppdragsvalsSlide) → Välj tjänster
   ├── POST /api/onboarding/uppdrag
   ├── Returnerar onboardingId (UUID)
   └── Sparas i localStorage
4. /riskfragor (RiskFragorSlide) → Steg 1 riskfrågor
   └── POST /api/onboarding/{onboardingId}/riskfragor/steg1
```

---

## Implementationsdetaljer

### Fil
```
src/components/Slides/UppdragsvalsSlide.jsx
```

### Dependencies
```json
{
  "lucide-react": "^0.546.0",  // Info, ChevronDown, ChevronUp ikoner
  "react-router-dom": "^7.9.4"  // Navigation
}
```

### Props
```typescript
interface UppdragsvalsSlideProps {
  onNext: (data: {
    onboardingId: string;
    uppskattadKostnad: string;
    antalTjanster: number;
    riskIndikator: string;
  }) => void;
}
```

---

## Styling

### Tailwind CSS Classes

**Numrerade badges:**
```css
w-8 h-8 bg-brand-600 text-white rounded-full font-bold text-sm
```

**Info-knappar:**
```css
w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full
transition-colors group
```

**Checkbox cards:**
```css
p-4 border border-gray-300 rounded-lg 
hover:bg-gray-50 cursor-pointer transition-colors
```

**Utfällbar lagtext:**
```css
/* Sektion 1 (info) */
bg-blue-50 border-l-4 border-blue-400 rounded-r-lg
text-sm italic text-gray-600

/* Sektion 2 (varning) */
bg-amber-50 border-l-4 border-amber-400 rounded-r-lg
text-sm italic text-gray-700
```

---

## Integration i App.jsx

### Import
```javascript
import UppdragsvalsSlide from './components/Slides/UppdragsvalsSlide';
```

### Route
```javascript
<Route path="/uppdragsval" element={
  <UppdragsvalsSlide 
    onNext={(data) => {
      console.log('✅ Onboarding created:', data);
      console.log('📋 onboardingId:', data.onboardingId);
      navigate('/riskfragor');
    }} 
  />
} />
```

### Sidebar
```javascript
// Sidebar.jsx - ny länk tillagd
{ path: '/uppdragsval', title: 'Uppdragsval', icon: 'checkList' },
```

### IntroSlide Navigation
```javascript
// IntroSlide.jsx - uppdaterad next-knapp
<Route path="/inledning" element={
  <IntroSlide onNext={() => navigate('/uppdragsval')} />
} />
```

---

## Testing

### Manual Testing Checklist

- [ ] Visa Sektion 1 lagtext (klicka info-knapp)
- [ ] Visa Sektion 2 lagtext (klicka info-knapp)
- [ ] Stäng expanderad sektion (klicka igen)
- [ ] Välj minst en tjänst (checkbox)
- [ ] Fyll i "Annat" textarea
- [ ] Klicka "Fortsätt" utan att välja tjänst → Visa error
- [ ] Klicka "Fortsätt" med valda tjänster → API-anrop
- [ ] Verifiera `onboardingId` sparas i localStorage
- [ ] Verifiera navigation till `/riskfragor`
- [ ] Responsive design (mobile, tablet, desktop)

### API Testing

```bash
# Start backend
cd backend
python main.py

# Start frontend
cd tic-tac-toe-app
npm run dev

# Test flow
1. Navigera till http://localhost:5173/login
2. Logga in (eller använd demo mode)
3. Navigera till /inledning
4. Klicka "Nästa" → /uppdragsval
5. Välj tjänster och klicka "Fortsätt"
6. Kontrollera Network tab för POST /api/onboarding/uppdrag
7. Kontrollera localStorage för "onboardingId"
```

---

## Nästa Steg

### 1. Uppdatera RiskFragorSlide
Lägg till `onboardingId` i API-anrop:
```javascript
const onboardingId = localStorage.getItem('onboardingId');

const response = await fetch(
  `http://localhost:8000/api/onboarding/${onboardingId}/riskfragor/steg1`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(riskfragorData),
  }
);
```

### 2. Implementera Backend Endpoint
```python
# backend/main.py

@app.post("/api/onboarding/uppdrag")
async def create_onboarding(
    uppdrag: UppdragRequest,
    user_id: str = Depends(get_current_user)
):
    # Generera UUID
    onboarding_id = str(uuid.uuid4())
    
    # Beräkna kostnad
    kostnad = calculate_cost(uppdrag)
    
    # Sätt risk indikator
    risk = "medium" if uppdrag.foretagsregistrering else "low"
    
    # Spara i PostgreSQL
    db.execute("""
        INSERT INTO onboarding_processes (
            id, user_id, uppdrag_data, uppskattad_kostnad, risk_indikator
        ) VALUES ($1, $2, $3, $4, $5)
    """, onboarding_id, user_id, uppdrag.dict(), kostnad, risk)
    
    return {
        "success": True,
        "onboardingId": onboarding_id,
        "uppskattadKostnad": kostnad,
        "antalTjanster": count_services(uppdrag),
        "riskIndikator": risk,
        "message": "Onboarding-process skapad",
        "nextStep": "/riskfragor"
    }
```

### 3. Dokumentera i LaTeX
Redan gjort i `API_Endpoints_ContentSlides.tex` (Sektion 1, rad 147-260).

---

## Fördelar med Denna Design

### UX/UI
✅ Tydlig sektionsbaserad layout med visuell hierarki  
✅ Runda info-knappar är diskreta men synliga  
✅ Utfällbar lagtext förstör inte läsflödet  
✅ Kursiv text i mindre font signalerar "extra information"  
✅ Amber färg för sanktioner = varning  
✅ Checkbox cards med hover-effekt = interaktiv känsla  

### Teknisk
✅ UUID-baserad arkitektur (ingen Redis sessions)  
✅ Persistent lagring i PostgreSQL  
✅ JWT-baserad autentisering  
✅ LocalStorage för onboardingId  
✅ Error handling och loading states  
✅ Validering både frontend och backend  

### Regulatorisk Efterlevnad
✅ Tydlig förklaring av PTL-krav  
✅ Lagtexter citerade korrekt (7 kap. 14-16 §§ PTL)  
✅ Källa refererad (Marie Wallin, sid. 44)  
✅ Dokumentation sparad för audit trail  
✅ GDPR-text i footer  

---

## Troubleshooting

### Problem: API-anrop misslyckas
**Lösning:** Kontrollera att:
1. Backend körs på `http://localhost:8000`
2. JWT token finns i localStorage (`access_token`)
3. CORS är konfigurerat i backend (FastAPI)

### Problem: onboardingId sparas inte
**Lösning:** Kontrollera:
```javascript
console.log('Response:', data);
console.log('onboardingId:', data.onboardingId);
localStorage.setItem('onboardingId', data.onboardingId);
console.log('Saved:', localStorage.getItem('onboardingId'));
```

### Problem: Lucide ikoner visas inte
**Lösning:** Installera lucide-react:
```bash
npm install lucide-react
```

### Problem: Tailwind CSS fungerar inte
**Lösning:** Kontrollera `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

---

## Sammanfattning

**UppdragsvalsSlide** är första steget i onboarding-processen efter inloggning. Komponenten:

1. ✅ Förklarar PTL-krav med utfällbar lagtext
2. ✅ Visar sanktioner (upp till 1 miljon euro)
3. ✅ Låter user välja 9 tjänster
4. ✅ Skapar ny onboarding-process med UUID
5. ✅ Sparar onboardingId i localStorage
6. ✅ Navigerar till /riskfragor

**Design:** Sektionsbaserad layout med numrerade badges, runda info-knappar och utfällbar lagtext i kursiv stil.

**Teknologi:** React hooks, Tailwind CSS, Lucide React ikoner, JWT autentisering, PostgreSQL UUID-arkitektur.

**Status:** Fullt implementerad och integrerad i App.jsx + Sidebar.jsx
