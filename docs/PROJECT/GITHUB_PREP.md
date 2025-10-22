# GitHub Push - Organisationsplan

**Skapad:** 2025-10-20

---

## 🎯 Mål

Förbereda `tic-tac-toe-app` för GitHub push med:
- ✅ Professionell struktur
- ✅ Inga känsliga credentials
- ✅ Tydlig dokumentation
- ✅ Separata mappar för olika typer av innehåll

---

## 📁 Föreslagen mappstruktur

```
tic-tac-toe-app/
│
├── 📱 Frontend (React/Vite)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── eslint.config.js
│
├── 🔧 Backend (Python/Flask)
│   └── backend/
│       ├── main.py
│       ├── requirements.txt
│       └── Procfile
│
├── 📚 Documentation (Organiserad)
│   └── docs/
│       ├── API_INTEGRATION/
│       │   ├── API_STATUS.md
│       │   ├── Bolagsverket/
│       │   │   ├── README.md
│       │   │   ├── API_TEST_RESULTS.md
│       │   │   └── CREDENTIALS_STATUS.md (SANITIZED)
│       │   └── Skatteverket/
│       │       ├── README.md
│       │       ├── KOMPLETT_SETUP_GUIDE.md
│       │       ├── TEST_RESULTAT_2025-10-20.md
│       │       ├── LENA_UPPDATERING_2025-10-20.md
│       │       ├── BESTÄLL_PROD_CERTIFIKAT.md
│       │       ├── ANSÖK_PROD_NYCKLAR.md
│       │       └── EXPISOFT_STATUS.md
│       │
│       ├── DEPLOYMENT/
│       │   └── DEPLOYMENT_GUIDE.md
│       │
│       ├── DESIGN/
│       │   ├── FÄRGGUIDE.md
│       │   └── FÄRG_FÖRSLAG.md
│       │
│       ├── EMAIL/
│       │   ├── EMAIL_FORWARDING_GUIDE.md
│       │   ├── LOOPIA_EMAIL_FORWARDING.md
│       │   └── Loopia/
│       │       ├── DNS_ANALYS.md
│       │       ├── EMAIL_FORWARDING_STATUS.md
│       │       ├── KLARNA_KOSMA_STATUS.md
│       │       └── celestial-se.txt (DNS records example)
│       │
│       ├── FORTNOX/
│       │   ├── FORTNOX_ACCESS_PLAN.md
│       │   ├── FORTNOX_KONTO_CHECK.md
│       │   └── FORTNOX_SUPPORT_TICKET_MALL.md
│       │
│       └── PROJECT/
│           ├── STATUS_TODO.md
│           ├── DEVELOPMENT_ROADMAP.md
│           └── 01FS_2024-20.md
│
├── 📄 LaTeX (Presentation/Report)
│   └── latex/
│       ├── Onboardin_app_ny.tex
│       ├── Onboardin_app_ny.pdf
│       └── onboarding_app.tex
│
├── 🔐 Private (INTE för GitHub - lokal only)
│   └── private/ (gitignored)
│       ├── credentials/
│       │   ├── bolagsverket_prod.txt
│       │   ├── skatteverket_test.txt
│       │   └── certificates/
│       │       └── 68e28fae0d034.p12
│       ├── Loopia/
│       │   └── celestial-se_OLD.txt (med lösenord etc)
│       └── personal_notes/
│           ├── kommandon-personliga.txt
│           ├── bolagsverket_mail.txt
│           ├── fortnox_support_message.txt
│           └── MAIL_TILL_FREDRIK.md
│
├── 🗑️ Temporary/Legacy (kan tas bort)
│   ├── db.json (mock data?)
│   ├── roaring_endpoints.txt
│   ├── fortnox_voucherlist.text
│   └── *.snm, *.vrb, *.toc (LaTeX temp files)
│
├── 📋 Root files
│   ├── README.md (NY - projektbeskrivning)
│   ├── .gitignore (utökad)
│   ├── LICENSE (lägg till?)
│   └── CONTRIBUTING.md (om open source)
│
└── 🚫 ALDRIG commita
    ├── node_modules/ (✅ redan gitignored)
    ├── dist/ (✅ redan gitignored)
    ├── venv/ (✅ behöver gitignore)
    ├── __pycache__/ (✅ behöver gitignore)
    └── *.p12, *.zip, credentials (✅ redan gitignored)
```

---

## 🔄 Föreslagen omorganisering

### Steg 1: Skapa nya mappar
```bash
mkdir -p docs/{API_INTEGRATION/{Bolagsverket,Skatteverket},DEPLOYMENT,DESIGN,EMAIL/Loopia,FORTNOX,PROJECT}
mkdir -p latex
mkdir -p private/{credentials/certificates,Loopia,personal_notes}
```

### Steg 2: Flytta API-dokumentation
```bash
# Flytta API-status
mv API_STATUS.md docs/API_INTEGRATION/

# Flytta Bolagsverket (exkl. credentials)
cp -r Bolagsverket/*.md docs/API_INTEGRATION/Bolagsverket/
# Behåll original Bolagsverket/ för credentials (gitignored)

# Flytta Skatteverket docs
cp -r Skatteverket/*.md docs/API_INTEGRATION/Skatteverket/
# Behåll original Skatteverket/ för scripts och certifikat
```

### Steg 3: Flytta övrig dokumentation
```bash
# Deployment
mv DEPLOYMENT_GUIDE.md docs/DEPLOYMENT/

# Design
mv FÄRGGUIDE.md FÄRG_FÖRSLAG.md docs/DESIGN/

# Email
mv EMAIL_FORWARDING_GUIDE.md LOOPIA_EMAIL_FORWARDING.md docs/EMAIL/
mv Loopia/*.md docs/EMAIL/Loopia/
mv Loopia/celestial-se.txt docs/EMAIL/Loopia/ # Exempel utan lösenord

# Fortnox
mv FORTNOX_*.md docs/FORTNOX/

# Project management
mv STATUS_TODO.md DEVELOPMENT_ROADMAP.md 01FS_2024-20.md docs/PROJECT/
```

### Steg 4: Flytta LaTeX
```bash
mv Onboardin_app_ny.* latex/
mv onboarding_app.tex latex/
# Ta bort dubblett latex/ mapp om finns
```

### Steg 5: Flytta privata filer
```bash
# Credentials (dessa ska INTE till GitHub)
mv Bolagsverket/*_client_*.txt private/credentials/ 2>/dev/null || true
mv Bolagsverket/*.zip private/credentials/ 2>/dev/null || true
mv Skatteverket/*.p12 private/credentials/certificates/ 2>/dev/null || true
mv Skatteverket/*.zip private/credentials/ 2>/dev/null || true

# Personliga noter
mv kommandon-personliga.txt private/personal_notes/ 2>/dev/null || true
mv bolagsverket_mail.txt private/personal_notes/ 2>/dev/null || true
mv fortnox_support_message.txt private/personal_notes/ 2>/dev/null || true
mv MAIL_TILL_FREDRIK.md private/personal_notes/ 2>/dev/null || true

# Loopia med känslig info
mv Loopia/celestial-se_OLD.txt private/Loopia/ 2>/dev/null || true
```

### Steg 6: Rensa temporära filer
```bash
# LaTeX temporära
rm -f *.toc *.vrb *.snm *.aux *.nav *.log

# Kanske ta bort (beroende på användning)
# rm db.json
# rm roaring_endpoints.txt
# rm fortnox_voucherlist.text
```

---

## 📝 Uppdatera .gitignore

Lägg till:
```gitignore
# Python
venv/
__pycache__/
*.pyc
*.pyo
*.pyd

# Private folder (credentials, personal notes)
private/

# Skatteverket sensitive files
Skatteverket/*.p12
Skatteverket/*.zip
Skatteverket/*_credentials.txt
Skatteverket/NY_RegistreraApplikation*.txt
Skatteverket/RegistreraApplikation*.txt

# Loopia sensitive
Loopia/*_OLD.txt
Loopia/celestial-se.txt  # Om innehåller lösenord

# LaTeX temporary files (redan finns, men förtydliga)
*.aux
*.log
*.nav
*.out
*.toc
*.vrb
*.snm
*.fls
*.fdb_latexmk
*.synctex.gz

# Temporary files
db.json
*.tmp
*.bak
```

---

## 📖 Skapa ny README.md

### Innehåll:
1. **Projektbeskrivning** - Vad är Onboarding App?
2. **Features** - Vad kan appen göra?
3. **Tech Stack** - React, Vite, XState, Tailwind, Python/Flask
4. **API Integrations** - Bolagsverket, Skatteverket
5. **Setup Instructions** - Hur kör man lokalt?
6. **Documentation** - Hänvisning till docs/
7. **Development Status** - LIA-projekt, under utveckling
8. **License** - MIT? GPL? Proprietary?

---

## ✅ Checklista innan GitHub push

### Säkerhet:
- [ ] Alla credentials borttagna från tracked files
- [ ] .gitignore täcker alla känsliga filer
- [ ] Inga .p12 certifikat i repo
- [ ] Inga API keys/secrets i kod
- [ ] Kolla `git status` noggrant innan push

### Dokumentation:
- [ ] README.md uppdaterad med projektinfo
- [ ] API_STATUS.md saniterad (inga riktiga credentials)
- [ ] Bolagsverket/README.md har exempel-credentials (inte riktiga)
- [ ] Skatteverket/KOMPLETT_SETUP_GUIDE.md saniterad
- [ ] Alla .md filer korrekta länkar efter omorganisering

### Struktur:
- [ ] Frontend-filer på rätt plats
- [ ] Backend-filer organiserade
- [ ] docs/ mapp välstrukturerad
- [ ] latex/ mapp separat
- [ ] private/ mapp gitignored
- [ ] Inga duplicerade filer

### Kod:
- [ ] `npm run build` fungerar
- [ ] `npm run dev` fungerar
- [ ] Backend startar utan fel
- [ ] ESLint happy
- [ ] Inga console.log kvar (eller OK med dem)

### Git:
- [ ] Git repo initierat (om inte redan)
- [ ] Skapat .gitattributes (om behövs)
- [ ] Första commit message professionell
- [ ] Branch-strategi beslutad (main? develop?)

---

## 🚀 GitHub push-kommandon

```bash
# Steg 1: Kontrollera status
git status

# Steg 2: Lägg till filer
git add .

# Steg 3: Kontrollera vad som ska commitas (VIKTIGT!)
git status
git diff --cached --name-only

# Steg 4: Om allt ser bra ut, commit
git commit -m "feat: Initial commit - Onboarding App with API integrations

- React/Vite frontend with XState state machine
- Python/Flask backend
- Bolagsverket API integration (production ready)
- Skatteverket API integration (test environment)
- Comprehensive documentation
- LaTeX presentation materials
- Email forwarding setup guides"

# Steg 5: Skapa GitHub repo (via web eller gh CLI)
# gh repo create onboarding-app --public --source=. --remote=origin

# Steg 6: Push till GitHub
git branch -M main
git remote add origin https://github.com/karagiannis/onboarding-app.git
git push -u origin main
```

---

## 💡 Tips

### Dokumentation efter push:
1. Uppdatera README med GitHub badges
2. Skapa GitHub Issues för TODO-items
3. Sätt up GitHub Actions för CI/CD?
4. Lägg till CONTRIBUTING.md om open source

### Branches:
- `main` - Stable, working code
- `develop` - Active development
- `feature/*` - Nya features
- `fix/*` - Bugfixar

### GitHub Features:
- **Issues** - Spåra bugs och features
- **Projects** - Kanban board för todo-list
- **Wiki** - Utökad dokumentation
- **Actions** - Auto-deploy till Render/Railway

---

## 🎯 Prioriterad ordning

### Kritiskt (gör först):
1. ✅ Skapa `private/` mapp
2. ✅ Flytta alla credentials dit
3. ✅ Uppdatera .gitignore
4. ✅ Skapa ny README.md
5. ✅ Sanitera credentials i docs

### Rekommenderat:
6. Skapa `docs/` struktur
7. Flytta dokumentation
8. Rensa temp-filer
9. Testa att build fungerar
10. Git commit och push

### Nice-to-have:
11. LICENSE file
12. CONTRIBUTING.md
13. GitHub badges i README
14. Setup GitHub Actions

---

Vill du att jag hjälper dig att genomföra detta steg-för-steg? 🚀
