# Skatteverket API Integration

## 🎉 Status: FULLSTÄNDIGT FUNGERANDE! ✅

**Datum:** 2025-10-20  
**Test-miljö:** Komplett testtjänst  
**Token:** ✅ Fungerar  
**API-anrop:** ✅ Fungerar (202 Accepted)

---

## 🚀 Snabbstart

### Kör test:
```bash
cd /home/lasse/Documents/React/tic-tac-toe-app
source venv/bin/activate
cd Skatteverket
python3 test_tax_ccg_FIXED.py
```

### Förväntat resultat:
```
✅ Certifikat-session initierad
✅ Token mottaget!
✅ Anropet till 'beställ' lyckades (202 Accepted)!
```

---

## 📚 Dokumentation

### 🌟 START HÄR:
**[KOMPLETT_SETUP_GUIDE.md](./KOMPLETT_SETUP_GUIDE.md)** ⭐  
→ Allt du behöver veta om Skatteverket API!

### Övrig dokumentation:
- **[TEST_RESULTAT_2025-10-20.md](./TEST_RESULTAT_2025-10-20.md)** - Första test-resultat
- **[LENA_UPPDATERING_2025-10-20.md](./LENA_UPPDATERING_2025-10-20.md)** - Vad Lena aktiverade
- **[BESTÄLL_PROD_CERTIFIKAT.md](./BESTÄLL_PROD_CERTIFIKAT.md)** - Guide för Expisoft
- **[ANSÖK_PROD_NYCKLAR.md](./ANSÖK_PROD_NYCKLAR.md)** - Guide för prod-ansökan
- **AGC.txt** - Authorization Code Grant dokumentation
- **CCG.txt** - Client Credentials Grant dokumentation

---

## 📁 Filer

### Test-skript:
- ✅ **test_tax_ccg_FIXED.py** ⭐ **ANVÄND DENNA!**
- ⚠️ test_tax_ccg_valfri_org.py (original, saknar certifikat för API)
- ⚠️ test_tax_ccg_utpekad_org.py (original, saknar certifikat för API)

### Credentials:
- **NY_RegistreraApplikation_lassekaragiannis_onboardingapp_1.txt** - Senaste credentials från Lena
- **RegistreraApplikation_LasseKaragiannis_onboardingapp_1.txt** - Original credentials

### Certifikat:
- **68e28fae0d034.p12** - Testcertifikat (Bolag A)
- **Testcertifikat-server-och-stämpellegitimationer.zip** - Original certifikat-fil från Skatteverket

---

## 🔑 Credentials (TEST)

### OAuth2:
```
Client ID:     11a90b8849a912ea045b97597701cead83bd69f7b8a7df68
Client Secret: 5d4b7894e65653d223d14ba12219e4361eb40ed528a7cead83bd69f7b8a7df68
Scope:         skahmst
```

### APIgw:
```
Client_Id:     ed6e1114-0e19-4103-b518-035ae5ef8eed
Client_Secret: 45e8647d-f61d-4a4b-ab2f-4781f2224435
```

### Certifikat:
```
Fil:  68e28fae0d034.p12
PIN:  6323251803413456
```

---

## 🌐 Endpoints (TEST)

**Token:**
```
https://sysorgoauth2.test.skatteverket.se/oauth2/v1/sysorg/token
```

**API:**
```
https://api.test.skatteverket.se/beskattning/skattekonto/huvudmans-saldo-och-transaktioner/v1/bestall
```

---

## 💡 Viktigt att veta

### ⚠️ Certifikat krävs för ALLA anrop!
- Token-hämtning: Behöver certifikat ✅
- API-anrop: Behöver certifikat ✅
- Använd SAMMA session för båda!

### ✅ test_tax_ccg_FIXED.py löser detta
Original-skripten använde certifikat ENDAST för token-hämtning, vilket gav timeout vid API-anrop.

---

## 📞 Support

**Skatteverket API:**
- Lena Erlandsson
- api@skatteverket.se
- 0771-567 567

**Expisoft (certifikat):**
- support@expisoft.se
- 08-446 47 00

---

## 🎯 Nästa steg

1. ✅ ~~Test token-hämtning~~ - KLART!
2. ✅ ~~Test API-anrop~~ - KLART!
3. 🔄 Testa /hamta endpoint
4. 💡 Implementera ACG för BankID-login
5. 📧 Beställ prod-certifikat (~1800 kr)
6. 📝 Ansök om prod-nycklar

---

**Läs [KOMPLETT_SETUP_GUIDE.md](./KOMPLETT_SETUP_GUIDE.md) för fullständig information!** 📖
