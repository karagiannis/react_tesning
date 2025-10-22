"""
FastAPI Mock Backend for Fortnox Integration Demo
==================================================

Detta är en mock-server som simulerar Fortnox API för onboarding-appen.
Används för att demonstrera funktionalitet innan Fortnox API-access beviljas.

Endpoints:
- GET  /api/v1/companies/{company_id}/sie        - Hämta SIE-fil
- GET  /api/v1/companies/{company_id}/vouchers   - Hämta verifikationer med fel
- GET  /api/v1/companies/{company_id}/accounts   - Hämta kontoplan
- GET  /api/v1/companies/{company_id}/balance    - Hämta likviditetsdata
- POST /api/v1/onboarding/assess-risk            - Riskbedömning
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import random

app = FastAPI(
    title="Onboarding App - Mock Fortnox API",
    description="Mock backend för demonstration av onboarding-funktionalitet",
    version="1.0.0"
)

# CORS - tillåt React-appen att anropa backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== PYDANTIC MODELS =====

class Voucher(BaseModel):
    """Verifikation med potentiella fel"""
    voucher_number: str
    date: str
    amount: float
    description: str
    error_type: str
    severity: str  # "low", "medium", "high"
    details: str

class Account(BaseModel):
    """Konto i kontoplan"""
    account_number: str
    name: str
    balance: float

class BalancePoint(BaseModel):
    """Likviditetspunkt i tid"""
    date: str
    balance: float
    deposits: float
    withdrawals: float

class RiskAssessmentRequest(BaseModel):
    """Request för riskbedömning"""
    company_id: str
    branch_code: str  # SNI-kod eller bransch
    is_pep: bool = False
    is_new_company: bool = False
    high_risk_country: bool = False
    complex_structure: bool = False
    negative_media: bool = False

class RiskAssessmentResponse(BaseModel):
    """Svar från riskbedömning"""
    risk_score: int
    risk_level: str  # "Låg", "Normal", "Hög"
    decision: str    # "ACCEPTERA", "FÖRDJUPAD KONTROLL", "AVSLÅ"
    calculation: str
    recommendation: str

# ===== MOCK DATA =====

MOCK_VOUCHERS = [
    Voucher(
        voucher_number="1523",
        date="2024-03-15",
        amount=125000.00,
        description="Kontantuttag utan kvitto",
        error_type="missing_receipt",
        severity="high",
        details="Kontantuttag på 125,000 kr utan bifogat kvitto. Kan inte verifieras enligt god redovisningssed."
    ),
    Voucher(
        voucher_number="2104",
        date="2024-05-22",
        amount=89500.00,
        description="Momsavdrag på privat bil",
        error_type="incorrect_vat",
        severity="high",
        details="Momsavdrag gjort på bil som enligt bilregistret är privatregistrerad. Felaktig avdragsgill moms."
    ),
    Voucher(
        voucher_number="2847",
        date="2024-08-10",
        amount=45000.00,
        description="Utlandsbetalning till högriskland",
        error_type="high_risk_payment",
        severity="medium",
        details="Betalning till företag registrerat i land på EU:s högrisklista. Kräver extra dokumentation."
    ),
    Voucher(
        voucher_number="3421",
        date="2024-09-03",
        amount=15000.00,
        description="Representation utan närvarolista",
        error_type="missing_documentation",
        severity="medium",
        details="Representationskostnad utan närvarolista eller affärsändamål dokumenterat."
    ),
    Voucher(
        voucher_number="3892",
        date="2024-10-12",
        amount=250000.00,
        description="Lån från närstående utan avtal",
        error_type="related_party_transaction",
        severity="high",
        details="Lånetransaktion från styrelseledamot utan skriftligt låneavtal eller marknadsränta."
    ),
]

MOCK_ACCOUNTS = [
    Account(account_number="1910", name="Kassa", balance=5420.00),
    Account(account_number="1930", name="Företagskonto SEB", balance=342150.00),
    Account(account_number="2440", name="Leverantörsskulder", balance=-125300.00),
    Account(account_number="2610", name="Utgående moms", balance=-68900.00),
    Account(account_number="3001", name="Försäljning varor", balance=-1250000.00),
    Account(account_number="4010", name="Inköp varor", balance=650000.00),
    Account(account_number="5010", name="Lokalhyra", balance=180000.00),
    Account(account_number="6071", name="Representation", balance=24500.00),
    Account(account_number="7210", name="Lön", balance=420000.00),
]

# Generera 12 månaders likviditetsdata
def generate_balance_history() -> List[BalancePoint]:
    """Genererar realistisk likviditetshistorik"""
    balances = []
    current_date = datetime.now() - timedelta(days=365)
    current_balance = 150000.0
    
    for month in range(12):
        # Simulera månatliga in- och utflöden
        deposits = random.uniform(180000, 350000)
        withdrawals = random.uniform(150000, 320000)
        current_balance += (deposits - withdrawals)
        
        # Lägg till lite volatilitet
        current_balance += random.uniform(-20000, 20000)
        
        balances.append(BalancePoint(
            date=(current_date + timedelta(days=30*month)).strftime("%Y-%m-%d"),
            balance=round(current_balance, 2),
            deposits=round(deposits, 2),
            withdrawals=round(withdrawals, 2)
        ))
    
    return balances

# Branschkatalog med hotnivåer (från PDF)
BRANCH_THREAT_LEVELS = {
    "kommunalt_fastighet": 1,
    "bygg": 4,
    "stad": 4,
    "restaurang": 4,
    "transport": 4,
    "bokforing": 3,
    "revision": 3,
    "fastighetsmaklare": 3,
    "varuhandel": 4,
    "spel": 4,
    "bank": 3,
    "livforsakring": 2,
    "valutavaxling": 4,
    "ehandel": 3,
    "konsult": 2,
    "it": 2,
    "tillverkning": 2,
    "default": 2  # Om bransch ej specificerad
}

# ===== ENDPOINTS =====

@app.get("/")
async def root():
    """Hälsocheck"""
    return {
        "status": "ok",
        "message": "Mock Fortnox API för Onboarding App",
        "version": "1.0.0",
        "endpoints": [
            "/api/v1/companies/{company_id}/sie",
            "/api/v1/companies/{company_id}/vouchers",
            "/api/v1/companies/{company_id}/accounts",
            "/api/v1/companies/{company_id}/balance",
            "/api/v1/onboarding/assess-risk"
        ]
    }

@app.get("/api/v1/companies/{company_id}/sie")
async def get_sie_file(company_id: str, years: int = 7):
    """
    Hämta SIE-fil (Standard Import Export format)
    
    I verkligheten returneras faktisk SIE-fil.
    I mock returneras metadata om vilka år som skulle hämtas.
    """
    return {
        "company_id": company_id,
        "years_requested": years,
        "files": [
            {"year": 2024, "filename": f"{company_id}_2024.se", "size_kb": 1240},
            {"year": 2023, "filename": f"{company_id}_2023.se", "size_kb": 1180},
            {"year": 2022, "filename": f"{company_id}_2022.se", "size_kb": 1050},
            {"year": 2021, "filename": f"{company_id}_2021.se", "size_kb": 980},
            {"year": 2020, "filename": f"{company_id}_2020.se", "size_kb": 920},
            {"year": 2019, "filename": f"{company_id}_2019.se", "size_kb": 890},
            {"year": 2018, "filename": f"{company_id}_2018.se", "size_kb": 850},
        ][:years],
        "status": "success",
        "message": f"SIE-filer för {years} år hämtade"
    }

@app.get("/api/v1/companies/{company_id}/vouchers")
async def get_vouchers_with_errors(company_id: str):
    """
    Hämta verifikationer med fel/varningar
    
    Returnerar endast verifikationer som har identifierade problem.
    """
    return {
        "company_id": company_id,
        "total_vouchers_analyzed": 3847,
        "vouchers_with_errors": len(MOCK_VOUCHERS),
        "errors": [v.dict() for v in MOCK_VOUCHERS]
    }

@app.get("/api/v1/companies/{company_id}/accounts")
async def get_accounts(company_id: str):
    """
    Hämta kontoplan med saldon
    """
    return {
        "company_id": company_id,
        "accounts": [a.dict() for a in MOCK_ACCOUNTS],
        "total_accounts": len(MOCK_ACCOUNTS)
    }

@app.get("/api/v1/companies/{company_id}/balance")
async def get_balance_history(company_id: str):
    """
    Hämta likviditetshistorik för graf
    """
    balance_data = generate_balance_history()
    
    # Beräkna nyckeltal
    balances = [b.balance for b in balance_data]
    avg_balance = sum(balances) / len(balances)
    max_deposit = max(b.deposits for b in balance_data)
    max_withdrawal = max(b.withdrawals for b in balance_data)
    
    return {
        "company_id": company_id,
        "balance_history": [b.dict() for b in balance_data],
        "key_metrics": {
            "average_balance": round(avg_balance, 2),
            "current_balance": round(balances[-1], 2),
            "highest_balance": round(max(balances), 2),
            "lowest_balance": round(min(balances), 2),
            "largest_deposit": round(max_deposit, 2),
            "largest_withdrawal": round(max_withdrawal, 2),
        },
        "layering_analysis": {
            "suspicious_patterns": False,
            "circular_payments": 0,
            "structuring_detected": False,
            "high_risk_countries": 1,
            "cash_intensity": "medium",
            "notes": "En transaktion till högriskland identifierad (ver. 2847). Övrig aktivitet inom normala parametrar."
        }
    }

@app.post("/api/v1/onboarding/assess-risk")
async def assess_risk(request: RiskAssessmentRequest):
    """
    Utför riskbedömning enligt algoritm från PDF
    
    Formel: Riskvärde = (Hotnivå × Sårbarhetsnivå) + Justeringar
    
    Hotnivå: 1-4 baserat på bransch
    Sårbarhetsnivå: 3 (för alla bokföringstjänster)
    Justeringar:
      - PEP: +4
      - Nyetablerad: +2
      - Högriskland: +3
      - Komplex struktur: +2
      - Negativ media: +2
    
    Klassificering:
      1-3: Låg risk
      4-6: Normal risk
      7+: Hög risk
    """
    
    # Bestäm hotnivå från bransch
    threat_level = BRANCH_THREAT_LEVELS.get(request.branch_code, 2)
    
    # Sårbarhetsnivå (alltid 3 för bokföringstjänster)
    vulnerability_level = 3
    
    # Grundrisk
    base_risk = threat_level * vulnerability_level
    
    # Justeringar
    adjustments = 0
    adjustment_details = []
    
    if request.is_pep:
        adjustments += 4
        adjustment_details.append("PEP (+4)")
    
    if request.is_new_company:
        adjustments += 2
        adjustment_details.append("Nyetablerad verksamhet (+2)")
    
    if request.high_risk_country:
        adjustments += 3
        adjustment_details.append("Högriskland (+3)")
    
    if request.complex_structure:
        adjustments += 2
        adjustment_details.append("Komplex struktur (+2)")
    
    if request.negative_media:
        adjustments += 2
        adjustment_details.append("Negativ media (+2)")
    
    # Total riskpoäng
    total_risk = base_risk + adjustments
    
    # Klassificera risk
    if total_risk <= 3:
        risk_level = "Låg"
        decision = "ACCEPTERA"
        recommendation = "Kunden kan accepteras med standard KYC-åtgärder."
    elif total_risk <= 6:
        risk_level = "Normal"
        decision = "ACCEPTERA"
        recommendation = "Kunden kan accepteras. Utför löpande övervakning enligt rutin."
    elif total_risk <= 12:
        risk_level = "Hög"
        decision = "FÖRDJUPAD KONTROLL"
        recommendation = "Fördjupad kontroll krävs. Inhämta ytterligare dokumentation och godkänn på chefsnivå."
    else:
        risk_level = "Mycket Hög"
        decision = "AVSLÅ"
        recommendation = "Risken bedöms som för hög. Rekommendera avslag på kundansökan."
    
    # Bygg beräkningstext
    calculation_parts = [
        f"Bransch '{request.branch_code}': Hotnivå {threat_level}",
        f"Bokföringstjänst: Sårbarhetsnivå {vulnerability_level}",
        f"Grundrisk: {threat_level} × {vulnerability_level} = {base_risk}"
    ]
    
    if adjustment_details:
        calculation_parts.append(f"Justeringar: {' + '.join(adjustment_details)} = +{adjustments}")
    
    calculation_parts.append(f"Total riskvärde: {base_risk} + {adjustments} = {total_risk}")
    
    calculation = "\n".join(calculation_parts)
    
    return RiskAssessmentResponse(
        risk_score=total_risk,
        risk_level=risk_level,
        decision=decision,
        calculation=calculation,
        recommendation=recommendation
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
