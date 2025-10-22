# Bolagsverket API - Credentials (UPPACKADE)

## ✅ Test-miljö credentials

**Client ID (test):**
```
JBnmdBzK0xyMmeq4ELzfmpAM3oUa
```

**Client Secret (test):**
```
YovJbipiSKjkVojWOWwSHnfp5TYa
```

**Dekrypteringskod (SMS):**
```
26-X7NtSa!fQpDFe!Q2e
```

## ✅ Produktions-miljö credentials

**Client ID (prod):**
```
EJ2Z7mTfXwSfwceewkfCGjI9rToa
```

**Client Secret (prod):**
```
qVTWmiuF1Rxfykt9MUX0OOZLVmQa
```

**Dekrypteringskod (SMS):**
```
GB!WwKjB+Ub31CwZya7q
```

## 📋 Status

- ✅ Test-credentials: **UPPACKADE OCH KLARA**
- ✅ Produktions-credentials: **UPPACKADE OCH KLARA**

## 🔧 Nästa steg

1. **Hitta produktions-zip** från Bolagsverket (utan "test" i namnet)
2. **Packa upp** med lösenord: `GB!WwKjB+Ub31CwZya7q`
3. **Testa API-anrop** med test-credentials först

## 🧪 Testa credentials

```bash
curl -X POST https://portal.api.bolagsverket.se/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=JBnmdBzK0xyMmeq4ELzfmpAM3oUa" \
  -d "client_secret=YovJbipiSKjkVojWOWwSHnfp5TYa"
```

## 📁 Filer i denna mapp

- `bolagsverket_test.zip` - Original test-zip
- `client_credentials.txt` - Original credentials-fil (båda värden)
- `test_client_id.txt` - Separat Client ID
- `test_client_secret.txt` - Separat Client Secret

**OBS:** Alla dessa filer är .gitignored och kommer inte committas!
