# Klarna Kosma Developer - Registreringsstatus

**Uppdaterad:** 2025-10-20 eftermiddag

---

## 📧 Nuvarande status

### ✅ Email forwarding FUNGERAR!
- **Datum:** 2025-10-20 kväll
- **Test:** Hotmail → lasse@celestial.se → Gmail ✅
- **Status:** Forwarding aktivt och fungerande
- **Redo för:** Registreringar med företagsmail

### 🌍 Open Banking - Viktigt beslut

**UK Open Banking (openbanking.org.uk) ❌ INTE relevant för Sverige:**
- Brittiskt system (post-Brexit)
- UK-banker endast (Barclays, HSBC, etc.)
- UK Financial Conduct Authority
- Fungerar INTE med svenska banker

**EU/Svenska Open Banking ✅ Rätt väg:**
- PSD2-reglering (EU-direktiv)
- Finansinspektionen (svensk tillsyn)
- Svenska banker (SEB, Handelsbanken, Swedbank, Nordea)
- Stöd för företagskonton
- Svenska AML-regler (Penningtvättslagen)

### ⚠️ Viktigt: Klarna Kosma är nedlagt (2023)

**Historik:**
- Lanserad: April 2022 som separat brand
- Nedlagt: 2023 (integrerat i Klarna huvudvarumärke)
- Status 2025: "Klarna Kosma" är föråldrad term
- Open Banking: Finns kvar i Klarna, men inte som separat produkt

**Varför hamnade på UK-sajten:**
- Klarna Kosma hade UK-närvaro
- openbanking.org.uk är UK:s stora open banking-hub
- Men INTE relevant för svenska företagskonton

### 🎯 Aktuella alternativ för svenska företagskonton 2025:

**1. Noda** ⭐ (mest relevant för LIA/hobby)
- EU/Nordisk licensierad
- Svenska banker + företagskonton
- Usage-based pricing (rimligt för startup)
- https://noda.se eller noda.eu
- Nordisk support och dokumentation

**2. Open Payments** (fortsättning på Tink Standalone)
- EU PSD2-licensierad
- Etablerad i Norden
- Svenska banker + företagskonton
- Behöver kolla pricing och företagskonto-support

**3. Tink** (Visa-ägd sedan 2022)
- Mest etablerad tekniskt
- Svensk ursprung, nu global
- Svenska banker + alla EU-banker
- ❌ Förmodligen för dyrt (enterprise-fokus)
- ⚠️ Kräver ofta enterprise-avtal

**4. Klarna Open Banking** (om tillgängligt)
- Integrerat i Klarna huvudprodukt
- Mer konsument-fokus än B2B?
- Behöver undersöka om företagskonton stöds
- Troligen inte optimalt för ditt AML/KYC-användningsfall

---

## 🔍 Vad är Klarna Kosma?

### Open Banking API
Klarna Kosma (tidigare Klarna Open Banking) är en tjänst som ger tillgång till:
- **Kontouppgifter** - Hämta kontoinformation från användarens bank
- **Transaktionshistorik** - Se tidigare transaktioner
- **Saldo** - Real-time saldon
- **Betalningar** - Initiera betalningar (PIS)

### Användningsfall för Onboarding App
**Potentiellt användbart för:**
- ✅ Verifiering av företagskonto
- ✅ Kontroll av ekonomisk status
- ✅ Automatisk import av transaktioner för bokföring
- ✅ Bevisa betalningsförmåga vid avtalsingång

**Men:**
- ⚠️ Kan vara overkill för MVP
- ⚠️ Kanske dyrt för hobbyprojekt
- ⚠️ Bolagsverket + Skatteverket kanske räcker

---

## 📋 Nästa steg

### Omedelbart (väntar på):
1. **Email forwarding aktiveras** - Loopia DNS-propagering
2. **Klarna Kosma svar** - Bekräftelsemejl eller support-svar
3. **Test av forwarding** - Skicka testmejl till lasse@celestial.se

### När email funkar:
1. ✅ Kolla inbox (och spam!)
2. ✅ Hitta Klarna-bekräftelse
3. ✅ Klicka verifieringslänk
4. ✅ Logga in på Klarna Kosma Developer Portal
5. ✅ Utforska dokumentation och API capabilities
6. ✅ Skapa test-app
7. ✅ Få API credentials (Client ID/Secret)

### Utvärdering:
Efter att ha granskat Klarna Kosma's:
- **Prissättning** - Gratis? Betalning per transaktion? Månadskostnad?
- **Capabilities** - Vad kan vi faktiskt göra?
- **Integration complexity** - Hur svårt är det att implementera?
- **Värde för projektet** - Behöver vi verkligen detta?

**Beslut:** Använd Klarna Kosma eller skippa för MVP?

---

## 🎯 Bedömning

### För Klarna Kosma:
- ✅ Modern Open Banking integration
- ✅ Komplettering till Skatteverket (bank vs skatt)
- ✅ Imponerande för LIA-presentation
- ✅ Praktisk kunskap om PSD2/Open Banking

### Mot Klarna Kosma:
- ⚠️ Kanske dyrt
- ⚠️ Extra komplexitet
- ⚠️ Bolagsverket + Skatteverket kanske räcker för MVP
- ⚠️ Kan lägga till senare om behov uppstår

### Rekommendation:
**Utvärdera först, beslut sen:**
1. Se vad Klarna erbjuder (gratis test-miljö?)
2. Kolla prissättning
3. Bedöm om det ger värde för onboarding-flödet
4. Om bra + billigt/gratis → implementera
5. Om dyrt/komplicerat → skippa för MVP, lägg till v2.0

---

## 📞 Kontaktinfo

**Klarna Kosma Developer Support:**
- Portal: https://developers.klarna.com/kosma/
- Support: (väntar på mejl)

**Email forwarding:**
- Från: lasse@celestial.se
- Till: lasse.l.karagiannis@gmail.com
- Provider: Loopia
- DNS: Konfigurerad 2025-10-20

---

*Status uppdateras när mejl mottas eller forwarding aktiveras.*
