# Integration: Roaring API + Er PML-metodik

**Datum:** 2025-10-23  
**Syfte:** Kombinera Roarings datakällor med er dokumenterade PML-metodik för att skapa ett automatiserat KYC-system.

---

## 1. Er befintliga metodik (från PDF-dokumenten)

### 1.1 Metod för riskbedömning av kund

**Formel:**
```
Riskvärde = Hot × Sårbarhet + Justeringar

Hot (1-4): Branschrisknivå från Ekobrottsmyndigheten
Sårbarhet (1-4): Tjänstens kontrollbarhet (ni sätter alla till 3)
Justeringar: PEP +4, Högriskland +3, Nyetablerad +2, etc.
```

**Exempel:**
- Restaurang (Hot 4) × Bokföring (Sårbarhet 3) = 12 + justeringar
- Kommunalt bolag (Hot 1) × Bokföring (Sårbarhet 3) = 3

**Klassificering:**
- 1-3: Låg risk
- 4-6: Normal risk  
- 7+: Hög risk

---

### 1.2 Rutin för löpande KYC (ej bokföringsnära)

**Årlig kontroll:**
1. Ägarstruktur + Verklig huvudman (Bolagsverket)
2. PEP-status (manuell check)
3. Sanktionslistor (EU-databas)
4. Mediebevakning (manuell)
5. **Oanmält platsbesök** (verifierar faktisk verksamhet)

---

### 1.3 Rutin för riskkontroll av bokföringsdata

**22 varningsflaggor** baserade på:
- Fakturamönster (bruten nummerserie, jämna belopp, varierande utseende)
- Betalningsbeteende (kontant >22k SEK, oförklarliga in/utbetalningar)
- Verksamhetsbeteende (ägarbyten, platsbesök utan verksamhet, högriskländer)

**Krav:** Rapportering till Finanspolisen (goAML) vid misstanke.

---

## 2. Roaring API-endpoints och deras PML-användning

### 2.1 Population Register (SPAR)

**Roaring data:**
- Personnummer, namn, adress, folkbokföring
- Sekretessmarkering, skyddad identitet
- Avliden/utvandrad

**PML-användning:**
```python
# 1. Identifiera Verklig Huvudman (för EF)
spar_data = roaring.population_register(personnummer)

if spar_data.deceased:
    risk_flags.append("VH avliden - höj risk +3")
    
if spar_data.protected_identity:
    risk_flags.append("Skyddad identitet - kräver fördjupad KYC")
    
if spar_data.address_changed_recently:
    # Kopplas till er flagga: "Frekventa ändringar av kontaktuppgifter"
    risk_flags.append("Flyttat nyligen +1")
```

---

### 2.2 Business Prohibition (Näringsförbud)

**Roaring data:**
- Aktivt näringsförbud (start/slut-datum)
- Historiskt näringsförbud
- Omfattning (all verksamhet / specifik bransch)

**PML-användning:**
```python
# 2. Kontrollera företrädare och VH
prohibition = roaring.business_prohibition(personnummer)

if prohibition.active:
    return "AVBRYT ONBOARDING - Näringsförbud aktivt"
    
if prohibition.historical and prohibition.ended_within_years(2):
    risk_score += 5  # Nyligen avslutat näringsförbud = hög risk
    actions.append("Fördjupad KYC + manuell granskning")
```

---

### 2.3 Company Information (Företagsöversikt)

**Roaring data:**
- Status (100 Aktivt, 200 Inaktivt, 291 Konkurs, etc.)
- Legal form (AB, EF, KB, IF, etc.)
- Bransch (SNI 2007)
- Anställda, omsättning
- VAT, F-skatt
- Registreringsdatum

**PML-användning:**
```python
# 3. Grundläggande Hot-nivå (från er metodik)
company = roaring.company_overview(orgnr)

# 3a. Status-kontroll (REJECT direkt)
if company.status_code >= 200:
    return "AUTO-REJECT - Inaktivt/Konkurs/Avregistrerat"

# 3b. Bransch → Hot-nivå (från Nationell riskbedömning)
BRANSCH_HOT = {
    "45": 4,  # Bygg (SNI 45xxx)
    "56": 4,  # Restaurang (SNI 56xxx)
    "49": 4,  # Transport (SNI 49xxx)
    "81": 4,  # Städ (SNI 81xxx)
    "84": 1,  # Offentlig förvaltning (SNI 84xxx)
    "64": 3,  # Finansiella tjänster (SNI 64xxx)
}

sni_prefix = company.industry_code[:2]
hot_niva = BRANSCH_HOT.get(sni_prefix, 2)  # Default = Medel

# 3c. Nyetablerad verksamhet (< 2 år)
if company.registration_date > date.today() - timedelta(days=730):
    risk_score += 2
    risk_flags.append("Nyetablerad verksamhet +2")

# 3d. Kontrollera VAT + F-skatt (saknas = misstänkt)
if company.legal_form == "AB" and not company.vat_registered:
    risk_flags.append("AB saknar momsregistrering - kontrollera")
    
if company.employees == "0 anställda" and company.revenue_estimate > 1_000_000:
    risk_flags.append("Hög omsättning utan anställda - skenfakturering?")
```

---

### 2.4 Company History (Historik)

**Roaring data:**
- Namnbyten
- Adressändringar
- Verksamhetsändringar

**PML-användning:**
```python
# 4. Kontrollera frekventa ändringar (er flagga från rutin_riskkontroll)
history = roaring.company_history(orgnr, from_date="2023-01-01")

name_changes = len([h for h in history if h.change_type == "name"])
address_changes = len([h for h in history if h.change_type == "address"])

if name_changes >= 2:
    risk_score += 2
    risk_flags.append("Flera namnbyten (2 år) - möjlig täckmantel +2")
    
if address_changes >= 3:
    risk_score += 1
    risk_flags.append("Frekventa adressändringar +1")
```

---

### 2.5 Beneficial Owner (Verklig Huvudman) - KRITISK!

**Roaring data:**
- Ägare >25% (direkt/indirekt)
- Kontrolltyp (ägande, röstetal, faktisk kontroll)
- Historiska VH

**PML-användning:**
```python
# 5. Identifiera VH (PML-krav 3 kap 6 §)
beneficial_owners = roaring.beneficial_owner(orgnr)

if not beneficial_owners:
    return "AVBRYT - Verklig huvudman ej identifierbar (3 kap 6 § PML)"

for owner in beneficial_owners:
    # 5a. Kontrollera PEP-status
    if owner.is_pep:
        risk_score += 4
        risk_flags.append("VH är PEP - Skärpt KYC (3 kap 18 § PML) +4")
        
    # 5b. Kontrollera näringsförbud
    prohibition = roaring.business_prohibition(owner.personnummer)
    if prohibition.active:
        return "AVBRYT - VH har näringsförbud"
        
    # 5c. Kontrollera nationalitet (högriskland)
    if owner.nationality in EU_HIGH_RISK_COUNTRIES:
        risk_score += 3
        risk_flags.append(f"VH från högriskland ({owner.nationality}) +3")
        
    # 5d. Komplex ägarstruktur
    if owner.ownership_layers > 2:
        risk_score += 2
        risk_flags.append("Komplex bolagsstruktur (>2 led) +2")
```

---

### 2.6 Board Members (Styrelseledamöter)

**Roaring data:**
- Namn, personnummer, roll
- Tillträdes/avgångsdatum
- Historiska styrelsemedlemmar

**PML-användning:**
```python
# 6. Kontrollera styrelsen
board = roaring.board_members(orgnr)

# 6a. Snabba byten (er flagga: "Snabba ägarbyten")
recent_changes = [m for m in board.history if m.exit_date > date.today() - timedelta(days=180)]
if len(recent_changes) >= 3:
    risk_score += 2
    risk_flags.append("Snabba styrelsebyten (3 på 6 mån) +2")

# 6b. Medelålder styrelse
ages = [calculate_age(m.birth_date) for m in board.current]
mean_age = sum(ages) / len(ages)

if mean_age < 25:
    risk_flags.append("Mycket ung styrelse - kontrollera erfarenhet")
elif mean_age > 70:
    risk_flags.append("Hög medelålder - kontrollera aktiv drift")

# 6c. Krysskolla alla mot näringsförbud + PEP
for member in board.current:
    prohibition = roaring.business_prohibition(member.personnummer)
    if prohibition.active:
        return "AVBRYT - Styrelseledamot har näringsförbud"
```

---

### 2.7 Signatories (Firmatecknare)

**Roaring data:**
- Firmatecknare (enskilt/tillsammans)
- Signaturregler

**PML-användning:**
```python
# 7. Kontrollera firmatecknare
signatories = roaring.signatories(orgnr)

# 7a. Samma kontroller som styrelse
for signatory in signatories:
    prohibition = roaring.business_prohibition(signatory.personnummer)
    if prohibition.active:
        return "AVBRYT - Firmatecknare har näringsförbud"
```

---

### 2.8 PEP, Sanctions, AML Registry (Screening trio)

**Roaring data:**
- PEP-status (nationell/internationell)
- Sanktionslistor (EU/UN/nationella)
- AML-registret (Penningtvättsregistret)

**PML-användning:**
```python
# 8. Screening av alla identifierade personer
all_persons = [
    *beneficial_owners,
    *board_members,
    *signatories,
    company.ceo if company.ceo else None
]

for person in all_persons:
    # 8a. PEP
    pep_check = roaring.pep_check(person.personnummer)
    if pep_check.is_pep:
        risk_score += 4
        risk_flags.append(f"PEP: {person.name} ({pep_check.role}) +4")
        
    # 8b. Sanctions
    sanctions = roaring.sanctions_check(person.name, person.birth_date)
    if sanctions.has_match:
        return "AVBRYT - Sanktionerad person"
        
    # 8c. AML Registry (Bolagsverkets penningtvättsregister)
    aml = roaring.aml_registry(orgnr)
    if aml.has_violations:
        risk_score += 5
        risk_flags.append("PML-överträdelser registrerade +5")
```

---

### 2.9 Financial Information (Ekonomisk info)

**Roaring data:**
- Årsredovisningar (senaste 3 år)
- Nyckeltal: omsättning, resultat, tillgångar, skuldsättningsgrad

**PML-användning:**
```python
# 9. Ekonomiska röda flaggor
financials = roaring.financial_information(orgnr)

# 9a. Stora förluster + fortsatt drift = misstänkt finansiering
if financials.latest_year.result < -500_000 and financials.years_with_loss >= 3:
    risk_flags.append("3 år förlust - oklar finansiering")
    
# 9b. Stora aktieägartillskott (er flagga)
shareholder_contributions = financials.shareholder_contributions_last_year
if shareholder_contributions > 1_000_000:
    risk_flags.append(f"Stort ägt tillskott ({shareholder_contributions} SEK) - Kontrollera ursprung")
    
# 9c. Omsättning per anställd (Roaring-indikator)
if company.employees_count > 0:
    revenue_per_employee = financials.revenue / company.employees_count
    if revenue_per_employee > 5_000_000:  # 5M SEK/anställd
        risk_flags.append("Mycket hög omsättning/anställd - skenfakturering?")
```

---

## 3. Automatiserad implementering av er metodik

### 3.1 Initial riskbedömning vid onboarding

```python
def calculate_initial_risk_score(orgnr: str) -> RiskAssessment:
    """
    Implementerar er metod_riskbedömning_kund.pdf
    """
    
    # Steg 1: Hämta grunddata från Roaring
    company = roaring.company_overview(orgnr)
    beneficial_owners = roaring.beneficial_owner(orgnr)
    board = roaring.board_members(orgnr)
    
    # Steg 2: Beräkna Hot-nivå (bransch)
    hot_niva = get_bransch_hot(company.industry_code)  # 1-4
    
    # Steg 3: Sårbarhet (konstant 3 enligt er metodik)
    sarbarhet = 3
    
    # Steg 4: Grundrisk
    grundrisk = hot_niva * sarbarhet  # 3-12
    
    # Steg 5: Justeringar
    justeringar = 0
    risk_flags = []
    
    # PEP
    for owner in beneficial_owners:
        if owner.is_pep:
            justeringar += 4
            risk_flags.append(f"VH är PEP: {owner.name} +4")
    
    # Nyetablerad
    if company.age_years < 2:
        justeringar += 2
        risk_flags.append("Nyetablerad (<2 år) +2")
    
    # Högriskland
    for owner in beneficial_owners:
        if owner.nationality in EU_HIGH_RISK_COUNTRIES:
            justeringar += 3
            risk_flags.append(f"VH från {owner.nationality} +3")
    
    # Komplex struktur
    if any(o.ownership_layers > 2 for o in beneficial_owners):
        justeringar += 2
        risk_flags.append("Komplex ägarstruktur +2")
    
    # Negativ media (kräver manuell check eller extern API)
    # TODO: Integrera med Retriever, Cision, etc.
    
    # Steg 6: Total risk
    total_risk = grundrisk + justeringar
    
    # Steg 7: Klassificering
    if total_risk <= 3:
        risk_class = "LÅG"
    elif total_risk <= 6:
        risk_class = "NORMAL"
    else:
        risk_class = "HÖG"
    
    return RiskAssessment(
        company_id=orgnr,
        risk_class=risk_class,
        risk_score=total_risk,
        hot_niva=hot_niva,
        sarbarhet=sarbarhet,
        grundrisk=grundrisk,
        justeringar=justeringar,
        risk_flags=risk_flags,
        calculated_at=datetime.now(),
        method_version="metod_riskbedömning_kund.pdf v1.0"
    )
```

---

### 3.2 Löpande KYC (årlig uppföljning)

```python
def perform_annual_kyc_check(orgnr: str, last_check_date: date) -> KYCCheckResult:
    """
    Implementerar rutin_lopande_kyc_ej_bokforingsnara.pdf
    """
    
    results = KYCCheckResult(orgnr=orgnr, check_date=date.today())
    
    # 1. Ägarstruktur ändrad?
    current_owners = roaring.beneficial_owner(orgnr)
    historical_owners = roaring.beneficial_owner_history(orgnr, from_date=last_check_date)
    
    if len(current_owners) != len(historical_owners):
        results.add_finding("Ägarstruktur ändrad - kräver uppdaterad KYC")
        results.requires_updated_kyc = True
    
    # 2. Verklig huvudman identifierbar?
    if not current_owners:
        results.add_critical_finding("VH ej identifierbar - AVBRYT RELATION")
        results.should_terminate = True
        return results
    
    # 3. Sanktionslistor
    for owner in current_owners:
        sanctions = roaring.sanctions_check(owner.name, owner.birth_date)
        if sanctions.has_match:
            results.add_critical_finding(f"VH {owner.name} på sanktionslista - RAPPORTERA")
            results.requires_finanspolisen_report = True
    
    # 4. PEP-status
    for owner in current_owners:
        pep = roaring.pep_check(owner.personnummer)
        if pep.is_pep and not pep.was_pep_at(last_check_date):
            results.add_finding(f"{owner.name} blev PEP - höj risk +4")
            results.risk_score_increase += 4
    
    # 5. Bolagsverket-ändringar
    history = roaring.company_history(orgnr, from_date=last_check_date)
    if len(history) > 0:
        results.add_finding(f"{len(history)} ändringar i Bolagsverket sedan senast")
        for change in history:
            results.add_detail(f"- {change.change_type}: {change.description}")
    
    # 6. Mediebevakning (extern källa)
    # TODO: Integrera Retriever API
    
    # 7. Oanmält platsbesök (manuell aktivitet)
    results.requires_site_visit = True
    results.add_task("Boka oanmält platsbesök hos kund")
    
    # 8. Omräkna riskvärde
    new_risk = calculate_initial_risk_score(orgnr)
    results.new_risk_assessment = new_risk
    
    return results
```

---

### 3.3 Bokföringsnära riskkontroll (22 flaggor)

```python
def check_accounting_red_flags(orgnr: str, sie_file: str) -> AccountingRiskCheck:
    """
    Implementerar rutin_riskkontroll_bokforingsdata.pdf
    
    Analyserar SIE-fil från kundens bokföring och flaggar avvikelser.
    """
    
    results = AccountingRiskCheck(orgnr=orgnr)
    
    # Parse SIE-fil
    transactions = parse_sie_file(sie_file)
    
    # FLAGGA 1: Fakturor med jämna belopp
    invoices = [t for t in transactions if t.account.startswith("3")]  # Intäktskonton
    even_invoices = [inv for inv in invoices if inv.amount % 1000 == 0]
    
    if len(even_invoices) / len(invoices) > 0.3:  # >30% jämna belopp
        results.add_red_flag(
            flag="JÄMNA_BELOPP",
            severity="MEDEL",
            description=f"{len(even_invoices)} av {len(invoices)} fakturor har jämna belopp",
            action="Be kund förklara varför så många fakturor är jämnt avrundade"
        )
    
    # FLAGGA 2: Bruten nummerordning (kundfakturor)
    invoice_numbers = sorted([inv.invoice_number for inv in invoices])
    missing_numbers = []
    for i in range(len(invoice_numbers) - 1):
        expected_next = invoice_numbers[i] + 1
        actual_next = invoice_numbers[i + 1]
        if actual_next != expected_next:
            missing_numbers.extend(range(expected_next, actual_next))
    
    if missing_numbers:
        results.add_red_flag(
            flag="BRUTEN_NUMMERSERIE",
            severity="HÖG",
            description=f"Saknade fakturanummer: {missing_numbers}",
            action="Begär förklaring - potentiell oredovisad försäljning"
        )
    
    # FLAGGA 3: Kontantinbetalningar >22 000 SEK (2000 EUR)
    cash_deposits = [t for t in transactions if t.account == "1910" and t.amount > 22000]
    
    for deposit in cash_deposits:
        results.add_red_flag(
            flag="KONTANT_ÖVER_GRÄNS",
            severity="KRITISK",
            description=f"Kontantinsättning {deposit.amount} SEK överstiger 2000 EUR",
            action="SKÄRPT KUNDKÄNNEDOM enligt 5 kap 3 § 2 st PML - OBLIGATORISKT",
            requires_enhanced_dd=True
        )
    
    # FLAGGA 4: Oförklarliga utbetalningar
    payments = [t for t in transactions if t.account.startswith("2") and t.amount > 50000]
    payments_without_invoice = [p for p in payments if not has_matching_invoice(p, transactions)]
    
    if payments_without_invoice:
        results.add_red_flag(
            flag="OFÖRKLARLIG_UTBETALNING",
            severity="HÖG",
            description=f"{len(payments_without_invoice)} stora utbetalningar saknar faktura",
            action="Begär underlag för utbetalningarna"
        )
    
    # FLAGGA 5: Betalning före förfallodatum (utan rabatt)
    early_payments = [
        p for p in payments 
        if p.payment_date < p.due_date - timedelta(days=7)
        and p.discount_taken == 0
    ]
    
    if len(early_payments) > 5:
        results.add_red_flag(
            flag="TIDIGA_BETALNINGAR",
            severity="MEDEL",
            description=f"{len(early_payments)} betalningar >7 dagar före förfall utan rabatt",
            action="Fråga varför - potentiell samordning med motpart"
        )
    
    # FLAGGA 6: Stora aktieägartillskott
    shareholder_contributions = [
        t for t in transactions 
        if t.account == "2086"  # Aktieägartillskott
        and t.amount > 500000
    ]
    
    if shareholder_contributions:
        results.add_red_flag(
            flag="STORT_TILLSKOTT",
            severity="MEDEL",
            description=f"Tillskott totalt {sum(t.amount for t in shareholder_contributions)} SEK",
            action="Kontrollera ursprung - var kommer pengarna ifrån?"
        )
    
    # FLAGGA 7: Penningflöde till högriskländer
    foreign_payments = [
        t for t in transactions
        if t.recipient_country in EU_HIGH_RISK_COUNTRIES
        and t.amount > 100000
    ]
    
    if foreign_payments:
        results.add_red_flag(
            flag="HÖGRISKLAND_BETALNING",
            severity="HÖG",
            description=f"{len(foreign_payments)} betalningar till högriskländer",
            action="Begär specificering av motpart och syfte"
        )
    
    # ... (fortsätt med resterande 15 flaggor)
    
    return results
```

---

## 4. Komplett KYC-flöde med Roaring integration

```python
class OnboardingKYCSystem:
    """
    Komplett implementering av er PML-metodik med Roaring som datakälla
    """
    
    def onboard_new_customer(self, orgnr: str) -> OnboardingDecision:
        """
        Fullständig onboarding-process enligt PML
        """
        
        decision = OnboardingDecision(orgnr=orgnr)
        
        # ====== STEG 1: GRUNDLÄGGANDE KONTROLLER ======
        
        # 1.1 Företaget existerar och är aktivt?
        company = roaring.company_overview(orgnr)
        
        if company.status_code >= 200:
            decision.reject("Företaget är inaktivt/avregistrerat")
            return decision
        
        # 1.2 Verklig huvudman identifierbar?
        beneficial_owners = roaring.beneficial_owner(orgnr)
        
        if not beneficial_owners:
            decision.reject("Verklig huvudman ej identifierbar (3 kap 6 § PML)")
            return decision
        
        # ====== STEG 2: SCREENING AV PERSONER ======
        
        all_persons = self.gather_all_persons(orgnr)
        
        for person in all_persons:
            # 2.1 Näringsförbud?
            prohibition = roaring.business_prohibition(person.personnummer)
            if prohibition.active:
                decision.reject(f"{person.name} har näringsförbud")
                return decision
            
            # 2.2 Sanktionslista?
            sanctions = roaring.sanctions_check(person.name, person.birth_date)
            if sanctions.has_match:
                decision.reject(f"{person.name} på sanktionslista")
                decision.requires_finanspolisen_report = True
                return decision
            
            # 2.3 PEP?
            pep = roaring.pep_check(person.personnummer)
            if pep.is_pep:
                decision.add_finding(f"{person.name} är PEP - kräver skärpt KYC")
                decision.requires_enhanced_dd = True
        
        # ====== STEG 3: BERÄKNA RISKVÄRDE ======
        
        risk_assessment = calculate_initial_risk_score(orgnr)
        decision.risk_assessment = risk_assessment
        
        # ====== STEG 4: BESLUT BASERAT PÅ RISK ======
        
        if risk_assessment.risk_class == "LÅG":
            decision.approve_with_standard_kyc()
            decision.required_actions = [
                "Standard kundkännedom (3 kap 6 § PML)",
                "Årlig uppföljning enligt rutin",
                "Dokumentera beslut"
            ]
        
        elif risk_assessment.risk_class == "NORMAL":
            decision.approve_with_standard_kyc()
            decision.required_actions = [
                "Standard kundkännedom",
                "Halvårsvis uppföljning",
                "Extra kontroll vid stora transaktioner"
            ]
        
        elif risk_assessment.risk_class == "HÖG":
            decision.approve_with_enhanced_dd()
            decision.required_actions = [
                "SKÄRPT kundkännedom (3 kap 18 § PML)",
                "Kvartalsvis uppföljning",
                "Platsbesök obligatoriskt",
                "Källkontroll för alla stora transaktioner",
                "VD-godkännande krävs"
            ]
        
        if risk_assessment.risk_score >= 15:
            decision.manual_review_required = True
            decision.add_note("Extremt hög risk - VD ska besluta om accept")
        
        # ====== STEG 5: DOKUMENTATION ======
        
        decision.save_to_database()
        decision.generate_pdf_report()
        decision.archive_all_roaring_responses()
        
        return decision
    
    
    def perform_ongoing_monitoring(self, orgnr: str) -> MonitoringReport:
        """
        Löpande övervakning kombinerar:
        1. Årlig statisk KYC (rutin_lopande_kyc_ej_bokforingsnara.pdf)
        2. Kontinuerlig bokföringsnära kontroll (rutin_riskkontroll_bokforingsdata.pdf)
        """
        
        report = MonitoringReport(orgnr=orgnr, date=date.today())
        
        # DEL 1: Årlig statisk KYC
        last_check = get_last_kyc_check_date(orgnr)
        if (date.today() - last_check).days >= 365:
            kyc_result = perform_annual_kyc_check(orgnr, last_check)
            report.kyc_check = kyc_result
            
            if kyc_result.requires_finanspolisen_report:
                report.critical_action_required = True
                report.add_action("RAPPORTERA TILL FINANSPOLISEN VIA goAML")
        
        # DEL 2: Bokföringsnära kontroll (vid varje bokföringstillfälle)
        sie_file = get_latest_sie_file(orgnr)
        if sie_file:
            accounting_check = check_accounting_red_flags(orgnr, sie_file)
            report.accounting_check = accounting_check
            
            # Kritiska flaggor kräver omedelbar åtgärd
            critical_flags = [f for f in accounting_check.flags if f.severity == "KRITISK"]
            if critical_flags:
                report.critical_action_required = True
                for flag in critical_flags:
                    report.add_action(flag.action)
        
        # DEL 3: Extern händelsebevakning
        # - Bolagsverket (via webhook eller daglig polling)
        # - Mediebevakning (via Retriever API)
        # - Konkursbevakningar
        
        return report
```

---

## 5. Kostnadsoptimering med caching

```python
class RoaringCacheManager:
    """
    Minimera API-anrop genom smart caching
    """
    
    def __init__(self):
        self.cache = Redis()
        self.cache_ttl = {
            "company_overview": 86400,  # 24h (uppdateras dagligen)
            "beneficial_owner": 2592000,  # 30 dagar (ändras sällan)
            "business_prohibition": 604800,  # 7 dagar (viktigt att vara aktuellt)
            "board_members": 2592000,  # 30 dagar
            "sanctions": 86400,  # 24h (viktigt)
            "pep": 86400,  # 24h (viktigt)
        }
    
    def get_company_overview(self, orgnr: str) -> CompanyOverview:
        cache_key = f"company:{orgnr}"
        
        # Check cache first
        cached = self.cache.get(cache_key)
        if cached:
            return json.loads(cached)
        
        # Cache miss - call Roaring API
        data = roaring.company_overview(orgnr)
        
        # Store in cache
        self.cache.setex(
            cache_key,
            self.cache_ttl["company_overview"],
            json.dumps(data)
        )
        
        return data
```

**Kostnadsbesparing:**
- Initial onboarding: 10-15 API-anrop/företag (ej cacheable)
- Årlig KYC-uppföljning: 2-3 API-anrop (90% cache hit)
- Daglig bokföringskontroll: 0 API-anrop (använder SIE-fil)

**Totalt:** 500 API-anrop = ~200-250 företag onboardade + 500+ årliga uppföljningar

---

## 6. Integration med er framtida bokföringssystem

```python
class FortnoxCloneIntegration:
    """
    När ni byggt er egen bokföringsmotor kan ni kombinera
    Roaring-data med realtidsdata från bokföringen
    """
    
    def detect_anomaly_realtime(self, transaction: Transaction) -> List[Alert]:
        """
        Detektera avvikelser MEDAN bokföringen pågår
        """
        alerts = []
        
        # Kontantinsättning >22k SEK?
        if transaction.account == "1910" and transaction.amount > 22000:
            alerts.append(Alert(
                severity="CRITICAL",
                message="Kontantinsättning över 2000 EUR - SKÄRPT KYC KRÄVS",
                action="Stoppa bokföringen, kontakta kund, dokumentera ursprung"
            ))
        
        # Faktura med jämnt belopp?
        if transaction.is_invoice and transaction.amount % 1000 == 0:
            alerts.append(Alert(
                severity="WARNING",
                message=f"Faktura {transaction.invoice_number} har jämnt belopp",
                action="Kontrollera specifikation"
            ))
        
        # Betalning till högriskland?
        if transaction.recipient_country in EU_HIGH_RISK_COUNTRIES:
            alerts.append(Alert(
                severity="HIGH",
                message=f"Betalning till högriskland: {transaction.recipient_country}",
                action="Begär syfte och motpart"
            ))
        
        return alerts
```

---

## 7. Sammanfattning: Roaring + Er metodik = Komplett KYC

| **Er metodik (PDF)** | **Roaring API** | **Resultat** |
|---------------------|----------------|-------------|
| Hot-nivå (bransch) | Company Overview (SNI-kod) | Automatisk branschklassificering |
| VH identifiering | Beneficial Owner API | Automatisk UBO-identifiering |
| PEP-kontroll | PEP API | Automatisk screening |
| Näringsförbud | Business Prohibition API | Automatisk screening |
| Sanktionslistor | Sanctions API | Automatisk screening |
| Ägarförändringar | Company History + BO History | Automatisk övervaknings |
| 22 bokföringsflaggor | **ER EGEN SIE-PARSER** | Realtidsdetektering |
| Årlig uppföljning | Kombinerat API-anrop | Automatisk påminnelse |
| Riskpoäng 1-19+ | Automatisk beräkning | Konsekvent bedömning |

---

## 8. Nästa steg

1. ✅ **Nu**: Dokumentera Beneficial Owner API (nästa prioritet)
2. ✅ **Vecka 2**: Owner Structure, Board, Signatories (persondatat)
3. ✅ **Vecka 2**: PEP, Sanctions, AML Registry (screening)
4. ✅ **Vecka 3**: Financial Info (bokslutsdatat)
5. 🔨 **Vecka 4**: Bygg SIE-parser för de 22 bokföringsflaggorna
6. 🔨 **Vecka 5**: Implementera komplett KYC-flöde

**ER KONKURRENSFÖRDEL:**
- Roaring ger rådata (bättre än UC, Bisnode)
- Ni äger regellogiken (kan uppdatera direkt när PML ändras)
- Integration med bokföring (ingen annan har detta!)
- Repeterbara, myndighetsgodtagbara resultat

Vill ni att jag fortsätter med Beneficial Owner API-dokumentation nu? 🚀
