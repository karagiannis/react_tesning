# Värdefulladatamängder - Uppdateringsschema

**Uppdateringsfrekvens:** Veckovis (varje måndag)
**Senast uppdaterad:** 2025-10-26

---

## Automatiska uppdateringar

### Manuell uppdatering (Nuvarande metod)

**Varje måndag:**
1. Gå till: https://bolagsverket.se/foretag/oppnadata/nedladdningsbara-filer
2. Ladda ner:
   - `bolagsverket_bulkfil.zip` (Grunddata från Bolagsverket)
   - `scb_bulkfil.zip` (Grunddata från SCB)
3. Flytta till: `external_apis/Bolagsverket/Värdefulladatamängder/`
4. Ta bort gamla versioner (om du vill spara diskutrymme)
5. Uppdatera denna fil med nytt datum

---

## Uppdateringslogg

| Datum | Bolagsverket | SCB | Noteringar |
|-------|-------------|-----|------------|
| 2025-10-26 | 231 MB | 67 MB | Initial nedladdning |
| | | | |
| | | | |

---

## Framtida automatisering (TODO)

### Alternativ 1: Bash Script + Cron

Skapa: `update_bolagsverket.sh`
```bash
#!/bin/bash
cd /home/lasse/Documents/Onboarding_App/tic-tac-toe-app/external_apis/Bolagsverket/Värdefulladatamängder

# Backup gamla filer
mv bolagsverket_bulkfil.zip bolagsverket_bulkfil_backup_$(date +%Y%m%d).zip 2>/dev/null
mv scb_bulkfil.zip scb_bulkfil_backup_$(date +%Y%m%d).zip 2>/dev/null

# Ladda ner nya
wget -q https://[URL]/bolagsverket_bulkfil.zip
wget -q https://[URL]/scb_bulkfil.zip

# Logga
echo "$(date): Data uppdaterad - Bolagsverket: $(ls -lh bolagsverket_bulkfil.zip | awk '{print $5}'), SCB: $(ls -lh scb_bulkfil.zip | awk '{print $5}')" >> update_log.txt

# Rensa gamla backups (äldre än 30 dagar)
find . -name "*_backup_*.zip" -mtime +30 -delete
```

**Cron (varje måndag kl 03:00):**
```bash
crontab -e
# Lägg till:
0 3 * * 1 /home/lasse/Documents/Onboarding_App/update_bolagsverket.sh
```

### Alternativ 2: GitHub Actions (När projektet är på GitHub)

Se `.github/workflows/update-bolagsverket.yml` (ska skapas)

### Alternativ 3: Node.js Script

```javascript
// update-bolagsverket.js
const https = require('https');
const fs = require('fs');

// TODO: Implementera download logic
```

---

## Viktigt att komma ihåg

⚠️ **Innan du tar bort gamla filer:**
- Kontrollera att nya filer laddats ner korrekt
- Verifiera filstorlek (ska vara ~200-300 MB totalt)
- Kör eventuella test scripts för att säkerställa data quality

📊 **Diskutrymme:**
- Nuvarande: ~298 MB
- Med backups (4 veckor): ~1.2 GB
- Rekommendation: Rensa backups äldre än 1 månad

🔄 **Efter uppdatering:**
- Uppdatera denna fil (logg-tabellen)
- Om data används i applikation: testa att allt fungerar
- Om bulk data importeras till databas: kör import-script

---

## Nästa uppdatering

📅 **Beräknad:** 2025-11-04 (Måndag om 9 dagar)

**Sätt en påminnelse:**
- Google Calendar: "Uppdatera Bolagsverket data" (varje måndag 09:00)
- Windows Reminder / macOS Reminder
- Eller implementera automatisk lösning ovan

---

**Tips:** Om du glömmer en vecka är det inget problem - data är fortfarande användbart. Men ju nyare, desto bättre för KYC/AML compliance!
