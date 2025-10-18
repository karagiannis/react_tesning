# Onboarding App - Mock Fortnox Backend

Mock FastAPI-server som simulerar Fortnox API för demonstration.

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Kör servern

```bash
# Utvecklingsläge
python main.py

# Eller med uvicorn direkt
uvicorn main:app --reload --port 8000
```

Servern startar på: **http://localhost:8000**

API-dokumentation: **http://localhost:8000/docs**

## Endpoints

### 1. Hämta SIE-filer
```bash
GET /api/v1/companies/{company_id}/sie?years=7
```

**Exempel:**
```bash
curl http://localhost:8000/api/v1/companies/5560123456/sie?years=3
```

**Respons:**
```json
{
  "company_id": "5560123456",
  "years_requested": 3,
  "files": [
    {"year": 2024, "filename": "5560123456_2024.se", "size_kb": 1240},
    {"year": 2023, "filename": "5560123456_2023.se", "size_kb": 1180},
    {"year": 2022, "filename": "5560123456_2022.se", "size_kb": 1050}
  ],
  "status": "success"
}
```

---

### 2. Hämta verifikationer med fel
```bash
GET /api/v1/companies/{company_id}/vouchers
```

**Exempel:**
```bash
curl http://localhost:8000/api/v1/companies/5560123456/vouchers
```

**Respons:**
```json
{
  "company_id": "5560123456",
  "total_vouchers_analyzed": 3847,
  "vouchers_with_errors": 5,
  "errors": [
    {
      "voucher_number": "1523",
      "date": "2024-03-15",
      "amount": 125000.0,
      "description": "Kontantuttag utan kvitto",
      "error_type": "missing_receipt",
      "severity": "high",
      "details": "Kontantuttag på 125,000 kr utan bifogat kvitto..."
    }
  ]
}
```

---

### 3. Hämta kontoplan
```bash
GET /api/v1/companies/{company_id}/accounts
```

**Exempel:**
```bash
curl http://localhost:8000/api/v1/companies/5560123456/accounts
```

---

### 4. Hämta likviditetshistorik
```bash
GET /api/v1/companies/{company_id}/balance
```

**Exempel:**
```bash
curl http://localhost:8000/api/v1/companies/5560123456/balance
```

**Respons:**
```json
{
  "company_id": "5560123456",
  "balance_history": [
    {"date": "2023-10-18", "balance": 342150.0, "deposits": 250000.0, "withdrawals": 180000.0}
  ],
  "key_metrics": {
    "average_balance": 285420.0,
    "current_balance": 342150.0,
    "largest_deposit": 350000.0,
    "largest_withdrawal": 320000.0
  },
  "layering_analysis": {
    "suspicious_patterns": false,
    "circular_payments": 0,
    "high_risk_countries": 1
  }
}
```

---

### 5. Riskbedömning
```bash
POST /api/v1/onboarding/assess-risk
```

**Request Body:**
```json
{
  "company_id": "5560123456",
  "branch_code": "restaurang",
  "is_pep": true,
  "is_new_company": false,
  "high_risk_country": true,
  "complex_structure": false,
  "negative_media": false
}
```

**Exempel:**
```bash
curl -X POST http://localhost:8000/api/v1/onboarding/assess-risk \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "5560123456",
    "branch_code": "restaurang",
    "is_pep": true,
    "is_new_company": true,
    "high_risk_country": true,
    "complex_structure": false,
    "negative_media": false
  }'
```

**Respons:**
```json
{
  "risk_score": 21,
  "risk_level": "Mycket Hög",
  "decision": "AVSLÅ",
  "calculation": "Bransch 'restaurang': Hotnivå 4\nBokföringstjänst: Sårbarhetsnivå 3\nGrundrisk: 4 × 3 = 12\nJusteringar: PEP (+4) + Nyetablerad verksamhet (+2) + Högriskland (+3) = +9\nTotal riskvärde: 12 + 9 = 21",
  "recommendation": "Risken bedöms som för hög. Rekommendera avslag på kundansökan."
}
```

---

## Branschkoder (branch_code)

| Kod | Bransch | Hotnivå |
|-----|---------|---------|
| `kommunalt_fastighet` | Kommunalt fastighetsbolag | 1 (Låg) |
| `bygg` | Byggverksamhet | 4 (Hög) |
| `stad` | Städverksamhet | 4 (Hög) |
| `restaurang` | Restaurang/Mat | 4 (Hög) |
| `transport` | Transportverksamhet | 4 (Hög) |
| `bokforing` | Bokföring/Redovisning | 3 (Betydande) |
| `revision` | Revision | 3 (Betydande) |
| `fastighetsmaklare` | Fastighetsmäklare | 3 (Betydande) |
| `varuhandel` | Varuhandel | 4 (Hög) |
| `spel` | Spelverksamhet | 4 (Hög) |
| `bank` | Bank/Finansiering | 3 (Betydande) |
| `livforsakring` | Livförsäkring | 2 (Medel) |
| `valutavaxling` | Valutaväxling | 4 (Hög) |
| `ehandel` | E-handel | 3 (Betydande) |
| `konsult` | Konsultverksamhet | 2 (Medel) |
| `it` | IT-tjänster | 2 (Medel) |
| `tillverkning` | Tillverkningsindustri | 2 (Medel) |

---

## Testning

Se `test_api.sh` för automatiska tester av alla endpoints.

```bash
chmod +x test_api.sh
./test_api.sh
```

---

## Deployment

### Railway.app (Rekommenderad)

1. Skapa konto på railway.app
2. Anslut GitHub-repo
3. Railway detekterar automatiskt Python-projekt
4. Sätt miljövariabel: `PORT=8000`
5. Deploy!

### Render.com

1. Skapa konto på render.com
2. New → Web Service
3. Anslut GitHub-repo
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## CORS

Backend tillåter requests från:
- `http://localhost:5173` (Vite dev)
- `http://localhost:5174` (Vite alt port)
- `https://*.vercel.app` (Deployed frontend)

Uppdatera `main.py` om du deployar på annan domän.

---

## Nästa steg

När Fortnox-access beviljas:
1. Ersätt mock-data med riktiga Fortnox API-anrop
2. Lägg till authentication med Fortnox OAuth2
3. Implementera rate limiting
4. Lägg till logging och monitoring

---

**Built for demo purposes - ready to impress Fortnox! 🚀**
