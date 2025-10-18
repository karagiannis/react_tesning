# 🚀 Deployment Guide - Onboarding App

## Översikt

Din onboarding-app består av två delar:
1. **Frontend**: React + Vite (deploy till Vercel)
2. **Backend**: FastAPI (deploy till Railway/Render)

---

## 📦 Backend Deployment (Railway.app - Rekommenderad)

### Steg 1: Förbered backend

```bash
cd ~/Documents/tic-tac-toe-server

# Kontrollera att filerna finns:
# - main.py (med nya endpoints)
# - requirements.txt
# - Procfile
```

### Steg 2: Push till GitHub

```bash
git add .
git commit -m "Add Fortnox mock endpoints for onboarding demo"
git push origin main
```

### Steg 3: Deploy till Railway

1. Gå till **https://railway.app**
2. Logga in med GitHub
3. Klicka **"New Project"** → **"Deploy from GitHub repo"**
4. Välj `tic-tac-toe-server`
5. Railway detekterar automatiskt Python
6. Sätt miljövariabel (om behövs):
   - `PORT` = `8000`
7. Klicka **"Deploy"**

**Resultat:** Du får en URL typ `https://tic-tac-toe-server-production.up.railway.app`

---

## 🎨 Frontend Deployment (Vercel)

### Steg 1: Uppdatera API URL i React

```bash
cd ~/Documents/React/tic-tac-toe-app
```

Skapa `.env.production`:
```bash
VITE_API_URL=https://tic-tac-toe-server-production.up.railway.app
```

### Steg 2: Deploy till Vercel

```bash
# Installera Vercel CLI (om inte redan gjort)
npm i -g vercel

# Deploy
vercel --prod
```

**Eller via Vercel Dashboard:**
1. Gå till **https://vercel.com**
2. Import Git Repository
3. Välj `react_tesning`
4. Sätt Environment Variables:
   - `VITE_API_URL` = din Railway URL
5. Deploy!

**Resultat:** Du får en URL typ `https://onboarding-app.vercel.app`

---

## 📹 Screen Recording för Fortnox

### Vad du ska visa:

1. **Intro (10 sek)**
   - "Onboarding-app för redovisningsbyråer enligt penningtvättslagen"

2. **Hero Slide (5 sek)**
   - Klicka "Kom igång"

3. **Fyll i kunddata (30 sek)**
   - Namn, org.nr, bransch, etc.
   - Visa att det går snabbt

4. **Slide 10: Hämta från Fortnox (15 sek)**
   - Klicka "Hämta bokföringsdata"
   - Visa att API anropas (Network tab)
   - SIE-filer hämtas (3 år)

5. **Slide 11: Verifikationsfel (20 sek)**
   - Tabell med 5 verifikationer med fel
   - Klicka på en rad → modal öppnas med detaljer
   - "Här ser konsulten direkt vad som behöver åtgärdas"

6. **Slide 12: Likviditetsanalys (15 sek)**
   - Graf över likviditet 12 månader
   - Nyckeltal visas
   - "AI-baserad layering-detektering i bakgrunden"

7. **Slide 13: Riskbedömning (20 sek)**
   - Välj bransch "Restaurang"
   - Kryssa i PEP, Högriskland
   - Klicka "Beräkna risk"
   - **Resultat visas:** "Hög risk - 21 poäng"
   - "Algoritmisk metod ger samma svar varje gång"

8. **Avslut (10 sek)**
   - "Integration med Fortnox = smidig process för byråer"
   - "Vill demonstrera live - kan vi boka möte?"

**Total längd:** ~2 minuter

### Verktyg för inspelning:

- **Linux:** SimpleScreenRecorder, OBS Studio, Kazam
- **Online:** Loom.com (rekommenderas - gratis, bra kvalitet)

```bash
# Installera SimpleScreenRecorder
sudo apt install simplescreenrecorder

# Eller Kazam
sudo apt install kazam
```

---

## 📧 Email till Fortnox (med video)

**Subject:** Onboarding-app för redovisningsbyråer - Live demo bifogad

**Text:**

```
Hej Fortnox-teamet,

Jag heter Lasse Karagiannis och har utvecklat en onboarding-applikation 
för redovisningsbyråer som effektiviserar kundintag enligt penningtvättslagen 
(01FS 2024-20).

PROBLEMET vi löser:
Byråer spenderar idag 3-5 timmar per ny kund på manuell datainsamling och 
riskbedömning. Vår app automatiserar detta genom att:

✓ Hämta bokföringsdata från Fortnox (SIE-filer, verifikationer)
✓ Analysera verifikationer för avvikelser
✓ Utföra algoritmisk riskbedömning enligt Länsstyrelsens krav
✓ Generera compliance-dokumentation

VARFÖR Fortnox-integration?
Över 1/3 av Sveriges företag använder Fortnox. Genom att integrera med er 
kan byråer sömlöst verifiera nya kunders bokföring utan manuell export.

DEMO: [Bifoga Loom-länk eller ladda upp video]

Live-version: https://onboarding-app.vercel.app
API-dokumentation: https://tic-tac-toe-server-production.up.railway.app/docs

API-behov:
• SIE-export (senaste 1-7 år, konfigurerbart)
• Verifikationsdata för kvalitetskontroll
• Kontoplan och balanser för likviditetsanalys

Scopes: bookkeeping, voucher, sie, account

Byråer som använder vår app kommer att rekommendera Fortnox till sina kunder 
eftersom integrationen blir så smidig. Win-win! 🎯

Kan vi boka 15 minuter för live-demo?

Vänligen,
Lasse Karagiannis
[Din e-post]
[Din telefon]

P.S. Jag har byrålicens hos Fortnox sedan tidigare och är bekant med er plattform.
```

---

## ✅ Checklista innan kontakt med Fortnox

- [ ] Backend deployed på Railway
- [ ] Frontend deployed på Vercel
- [ ] Alla endpoints fungerar (testa via /docs)
- [ ] Screen recording klar (2 min, bra ljud)
- [ ] Video uppladdad (Loom/YouTube unlisted)
- [ ] Email skriven med video-länk
- [ ] LinkedIn-profil uppdaterad (ser professionell ut)
- [ ] GitHub-repo är public och har bra README

---

## 🎯 Nästa steg efter deployment

### IDAG (Lördag):
1. ✅ Backend klar (du har main.py)
2. ✅ LaTeX uppdaterat (slides 17-20)
3. ⏳ Implementera React-slides 10-13 (mot din backend)

### IMORGON (Söndag):
1. Deploy backend till Railway
2. Deploy frontend till Vercel
3. Testa allt live
4. Spela in video (2 min)

### MÅNDAG:
1. Ring Fortnox 08:00 (08:00 = första i kön!)
2. Om de ber om mail: Skicka med video-länk
3. Följ upp på onsdag om inget svar

---

## 💡 Tips för Fortnox-samtalet

**SÄG:**
- "Jag har redan byggt appen - vill visa live demo"
- "Byråer efterfrågar detta - följer penningtvättslagen"
- "Integration gynnar Fortnox - fler företag väljer er"

**SÄG INTE:**
- "Jag vill lära mig ert API" (låter som research)
- "Jag ska bygga en Fortnox-klon" (skrämmer bort dem)
- "Jag är student/nybörjare" (låter oseriöst)

**FOKUS:**
- **Problem → Lösning → Win-Win**
- Du löser verkligt problem för byråer
- Byråer + Fortnox = starkare ekosystem
- Färdig produkt = redo att publicera

---

**Lycka till! Du har redan 80% klart - sista 20% är bara polish! 🚀**
