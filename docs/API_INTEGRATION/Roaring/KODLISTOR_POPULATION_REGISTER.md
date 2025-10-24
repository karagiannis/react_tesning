# Kodlistor - Population Register API (SPAR)

> **Källa:** Roaring.io Population Register API 2.0  
> **Schema Version:** 2021.1 (API), 2019.1 (Webhooks)  
> **Uppdaterad:** 2025-10-23

---

## 📋 Avregistreringsorsaker (Deregistration Reason Codes)

| Kod | Svenska | English | Kommentar |
|-----|---------|---------|-----------|
| **AS** | Annullerat samordningsnummer | Annulled Coordination Number | |
| **AV** | Avliden | Deceased | ✅ Primär kod för död |
| **FI** | Falsk identitet | False identity | 🚨 **RED FLAG** |
| **GN** | Bytt personnummer | Changed social security number | Referens till nytt nummer finns |
| **GS** | Bytt samordningsnummer | Changed coordination number | Referens till nytt nummer finns |
| **OB** | Försvunnen | Disappeared | 🚨 **RED FLAG** |
| **TA** | Teknisk avregistrering | Technical deregistration | |
| **UV** | Utvandrad | Emigrated | |
| **A** | Avliden | Deceased | ⚠️ **Gammal kod**, motsvarar AV |
| **G** | Bytt personnummer | Changed social security number | ⚠️ **Gammal kod**, motsvarar GN/GS |
| **O** | Annan orsak | Other cause | ⚠️ **Gammal kod**, kan vara UV, AS, FI, OB eller TA |

### KYC-regler för avregistrering:

```python
RED_FLAGS = ['FI', 'OB']  # Falsk identitet eller försvunnen = automatisk avvisning
DECEASED = ['AV', 'A']     # Avliden = kan inte företräda företag
CHANGED_ID = ['GN', 'GS', 'G']  # Hämta ny personnummer och verifiera igen
EMIGRATED = ['UV']         # Utvandrad = extra kontroller behövs
```

---

## 🆔 Person ID-typer (Person Id Types)

| Kod | Svenska | English | Beskrivning |
|-----|---------|---------|-------------|
| **PERSONNUMMER** | Personnummer | Swedish national social security number | YYYYMMDD-XXXX (10 siffror) |
| **SAMORDNINGSNUMMER** | Samordningsnummer | Coordination number | Personer utan personnummer (dag +60) |
| **IMMUNITETSNUMMER** | Immunitetsnummer | Immunity number | Diplomatpersonal |

### Format:
- **Personnummer:** `YYYYMMDD-XXXX` (t.ex. `19850315-1234`)
- **Samordningsnummer:** `YYYYMM(DD+60)-XXXX` (t.ex. `19850375-1234` där 75 = 15+60)
- **Immunitetsnummer:** `YYYYMMDD-XXXX` (speciell flagga i systemet)

**OBS:** Cached version (FALLBACK/ALWAYS mode) inkluderar **ENDAST personnummer**, ej samordnings- eller immunitetsnummer.

---

## 🏠 Bostadsstatus (Residence Status Code)

| Kod | Svenska | English | Användning |
|-----|---------|---------|-----------|
| **MUNICIPAL** | Saknar bostad, nås via adress | No residence, reachable via address | Hemlös men folkbokförd på specifik adress |
| **RESIDENTIAL** | Folkbokförd på bostadsadress | Residential address where person lives | Normal folkbokföring |
| **UNKNOWN** | Ej känt var personen bor | Unknown residence | 🚨 **RED FLAG** - okänd adress |

### KYC-regler:
```python
if residence_status == "UNKNOWN":
    # RED FLAG: Person saknar känd adress
    risk_score += 50
    
if residence_status == "MUNICIPAL":
    # Varning: Person saknar fast bostad
    manual_review_required = True
```

---

## 🇸🇪 Län och Kommuner (Swedish Counties and Municipalities)

**Format:** `XXYY` där `XX` = län, `YY` = kommun

### Län (Counties)

| Kod | Län |
|-----|-----|
| **01** | Stockholms län |
| **03** | Uppsala län |
| **04** | Södermanlands län |
| **05** | Östergötlands län |
| **06** | Jönköpings län |
| **07** | Kronobergs län |
| **08** | Kalmar län |
| **09** | Gotlands län |
| **10** | Blekinge län |
| **12** | Skåne län |
| **13** | Hallands län |
| **14** | Västra Götalands län |
| **17** | Värmlands län |
| **18** | Örebro län |
| **19** | Västmanlands län |
| **20** | Dalarnas län |
| **21** | Gävleborgs län |
| **22** | Västernorrlands län |
| **23** | Jämtlands län |
| **24** | Västerbottens län |
| **25** | Norrbottens län |

### Exempel Kommuner (Stockholms län - 01)

| Kod | Kommun |
|-----|--------|
| **0114** | Upplands Väsby |
| **0115** | Vallentuna |
| **0117** | Österåker |
| **0120** | Värmdö |
| **0123** | Järfälla |
| **0126** | Huddinge |
| **0127** | Botkyrka |
| **0136** | Haninge |
| **0160** | Täby |
| **0162** | Danderyd |
| **0163** | Sollentuna |
| **0180** | Stockholm |
| **0181** | Södertälje |
| **0182** | Nacka |
| **0184** | Solna |
| **0191** | Sigtuna |

**Källa:** Statistiska centralbyrån (SCB)

**Fullständig lista:** Se [officiell SCB-dokumentation](https://www.scb.se/)

---

## 🌍 Landskoder (Country Codes)

Baserat på kodtabellen i PDF-dokumentet "Landskoder i folkbokföringen" från Skatteverket.

**Länk:** [Skatteverket - Landskoder](https://www.skatteverket.se/)

### Format:
Länder skrivs som en sträng baserat på ISO 3166-1 alpha-2 eller nationell kod.

**Exempel:**
- `SE` = Sverige
- `NO` = Norge
- `DK` = Danmark
- `FI` = Finland
- `DE` = Tyskland
- `US` = USA

---

## 🔐 Sekretessmarkeringar

### Skyddad folkbokföring
**Kod:** `Protected population registration`

**Betydelse:** Person har skyddad identitet (ofta offer för våld, hot, vittnen)

**KYC-hantering:**
- ✅ Person finns i systemet
- ⚠️ Adressuppgifter är INTE tillgängliga
- 🚨 Extra försiktighet vid hantering av personuppgifter
- 📞 Manual verification krävs (telefon, alternativ dokumentation)

### Sekretess (Secrecy)
**Kod:** `Secrecy flag`

**Betydelse:** Sekretessmarkering satt av SPAR

**Begränsningar i cached version:**
- ❌ "Skyddad folkbokföring" finns EJ i cached data
- ✅ "Secrecy"-flagga finns tillgänglig

---

## 📊 Response Mode Codes

**OBS:** Dessa kodas i `status.responseMode` för att visa vilken datakälla som användes.

| Kod | Mode | Beskrivning |
|-----|------|-------------|
| **0** | DIRECT | Data hämtad direkt från Skatteverkets SPAR-API |
| **1** | FALLBACK | Data hämtad från cached copy (timeout/error från SPAR) |
| **2** | CACHED | Data hämtad från cached copy (ALWAYS mode) |

### Användning:
```javascript
if (response.status.responseMode === 1) {
  console.warn('FALLBACK används - kontrollera datakvalitet');
}

if (response.status.responseMode === 2) {
  console.info('CACHED data - ingen samordningsnummer eller <16 år');
}
```

---

## 📝 Begränsningar i Cached Version

### Data SOM INTE finns i FALLBACK/ALWAYS mode:

#### Personer som saknas:
- ❌ Personer under 16 år
- ❌ Samordningsnummer
- ❌ Immunitetsnummer

#### Data som saknas:
- ❌ Referens till gammalt personnummer/samordningsnummer
- ❌ Bostadsstatuskod (Residence status code)
- ❌ Skyddad folkbokföring (endast "Secrecy"-flagga finns)
- ❌ Kontaktadress
- ❌ Avregistreringsdatum och dödsdatum
- ❌ Personer avregistrerade med kod: **AS, FI, OB, TA**
- ❌ Distriktskod
- ❌ Namnhistorik och startdatum för nuvarande namn
- ❌ Folkbokföringsdatumhistorik
- ❌ Förkortat namn
- ❌ Startdatum för adress (om ingen adresshistorik finns)
- ❌ Svenskt medborgarskap-flagga
- ❌ Inkomst/Skatt/Fastighetsuppgifter

### KYC-impact:
```python
if response_mode == "CACHED":
    # Begränsad data tillgänglig
    limitations = [
        "Ingen historik",
        "Ingen samordningsnummer",
        "Ingen under 16 år",
        "Vissa avregistreringskoder saknas"
    ]
    
    # Kompensera med andra datakällor
    fetch_bolagsverket_data()
    fetch_roaring_beneficial_owner()
```

---

## 🧪 Sandbox Test Personnummer

### Current Endpoint (`/current/{personId}`)

| Personnummer | Beskrivning | Testfall |
|--------------|-------------|----------|
| `194812161596` | Special postal address abroad | Utlandsadress |
| `200807052394` | Relation guardian | Vårdnadshavare |
| `197605832380` | Coordination number, inactivated | Inaktiverat samordningsnummer |
| `193701308888` | Efternamn3542 | Namntest |
| `199903672385` | Coordination number, reference | Samordningsnummer med referens |
| `199411091722` | Not secret but with secrecy date set | Sekretessdatum utan sekretess |
| `198106039228` | Protected population registration | Skyddad folkbokföring |
| `198007199295` | Population address with history | Adresshistorik |
| `198308299299` | Immunity number | Immunitetsnummer |
| `198001139297` | Apartment number | Lägenhetsnummer |
| `197901249297` | Special postal address in Sweden | Särskild postadress Sverige |
| `196805029268` | Petra Efternamn2401 | Namntest |
| `198307259294` | Deregistered, emigrated | Avregistrerad (utvandrad) |
| `195704133106` | Name | Namntest |
| `198112752384` | Coordination number, deceased | Samordningsnummer, avliden |
| `193102263153` | Sven, ABO & PEP | **ABO (Actual Beneficial Owner) + PEP** 🚨 |
| `198203249274` | Secrecy | Sekretess |
| `198103269299` | Secrecy, deceased | Sekretess, avliden |
| `192908187541` | Nordic PEP person | **Nordisk PEP** 🚨 |
| `198003119255` | Relation registered partner | Registrerad partner |
| `198604069883` | Deregistered, deceased | Avregistrerad, avliden |
| `198009234181` | Non-current address dateTo set | Adress med dateTo ≠ 9999-12-31 |
| `199101112390` | Deregistered, old personal number | Avregistrerad, gammalt personnummer |

### Full Endpoint (`/full/{personId}`)

Samma personnummer som ovan, men med fullständig historik.

---

## 🎯 KYC Use Cases

### Red Flag Detection
```python
def check_population_register_red_flags(person):
    red_flags = []
    
    # Avregistreringsorsaker
    if person.deregistration_code in ['FI', 'OB']:
        red_flags.append('CRITICAL: Falsk identitet eller försvunnen')
    
    # Okänd adress
    if person.residence_status == 'UNKNOWN':
        red_flags.append('WARNING: Okänd bostadsadress')
    
    # Avliden
    if person.deregistration_code in ['AV', 'A']:
        red_flags.append('CRITICAL: Person avliden')
    
    # PEP (från sandbox test)
    if person.person_id in ['193102263153', '192908187541']:
        red_flags.append('WARNING: PEP-person')
    
    return red_flags
```

### Address Verification
```python
def verify_address(person):
    if person.residence_status == 'RESIDENTIAL':
        return True  # Normal folkbokföring
    
    if person.residence_status == 'MUNICIPAL':
        return 'MANUAL_REVIEW'  # Saknar fast bostad
    
    if person.residence_status == 'UNKNOWN':
        return False  # Okänd adress = red flag
```

### Identity Change Detection
```python
def check_identity_change(person):
    if person.deregistration_code in ['GN', 'GS', 'G']:
        new_person_id = person.reference_to_new_id
        # Hämta data för nytt personnummer
        return fetch_person(new_person_id)
    
    return person
```

---

## 📚 Python Dictionary Examples

```python
# Avregistreringsorsaker
DEREGISTRATION_CODES = {
    'AS': 'Annullerat samordningsnummer',
    'AV': 'Avliden',
    'FI': 'Falsk identitet',
    'GN': 'Bytt personnummer',
    'GS': 'Bytt samordningsnummer',
    'OB': 'Försvunnen',
    'TA': 'Teknisk avregistrering',
    'UV': 'Utvandrad',
    'A': 'Avliden (gammal kod)',
    'G': 'Bytt personnummer (gammal kod)',
    'O': 'Annan orsak (gammal kod)'
}

# Person ID-typer
PERSON_ID_TYPES = {
    'PERSONNUMMER': 'Swedish national social security number',
    'SAMORDNINGSNUMMER': 'Coordination number',
    'IMMUNITETSNUMMER': 'Immunity number'
}

# Bostadsstatus
RESIDENCE_STATUS = {
    'MUNICIPAL': 'Saknar bostad, nås via adress',
    'RESIDENTIAL': 'Folkbokförd på bostadsadress',
    'UNKNOWN': 'Ej känt var personen bor'
}

# Response modes
RESPONSE_MODES = {
    0: 'DIRECT',    # Skatteverkets API
    1: 'FALLBACK',  # Cached (efter error/timeout)
    2: 'CACHED'     # Cached (ALWAYS mode)
}

# Red flag deregistration codes
RED_FLAG_DEREG = ['FI', 'OB']

# Deceased codes
DECEASED_CODES = ['AV', 'A']

# Identity change codes
IDENTITY_CHANGE_CODES = ['GN', 'GS', 'G']
```

---

## ⚠️ Viktiga Noteringar

1. **Schema Version Difference:**
   - API: `2021.1`
   - Webhooks: `2019.1`
   - **Små skillnader kan förekomma**

2. **Cached Version Limitations:**
   - Endast personer 16+ år
   - Endast personnummer (ej samordnings-/immunitetsnummer)
   - Begränsad historik
   - Vissa avregistreringskoder saknas (AS, FI, OB, TA)

3. **Redirect Modes:**
   - **NEVER:** Alltid direkt från SPAR (långsammare, mer komplett)
   - **FALLBACK:** SPAR först, cached vid error (rekommenderat för produktion)
   - **ALWAYS:** Alltid cached (snabbare, begränsad data, ingen Skatteverket-ansökan)

4. **PEP Detection:**
   - Sandbox innehåller 2 PEP-personer: `193102263153` och `192908187541`
   - Produktion kräver separat PEP-screening via Roaring.io PEP API

---

**Källa:** Roaring.io Population Register API Documentation  
**Uppdaterad:** 2025-10-23  
**Schema Version:** 2021.1
