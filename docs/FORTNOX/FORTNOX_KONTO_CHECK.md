# Fortnox Konto-Check

## 🔍 Kolla vilka Fortnox-konton du har tillgång till:

### 1. Logga in på Fortnox (https://www.fortnox.se)

### 2. Titta på företagsväljaren (oftast uppe till vänster)

**Du ser förmodligen:**
```
📁 Din byrå (Byrålicens)
   └── Fredrik's företag (som konsult)
   └── [Andra klientföretag?]

📁 [Ditt gamla företag?] (om det fortfarande finns)
```

### 3. Identifiera kontotyper:

#### **Byrålicens (Digital byrå):**
- Ser lista med klientföretag
- Kan växla mellan klienters företag
- Har "byrå-funktioner" i menyn
- **KAN INTE** få developer portal-licens direkt

#### **Företagskonto (vanligt Fortnox):**
- Ett specifikt företag (ditt eller Fredrik's)
- Har bokföring, fakturering, etc.
- **KAN** få developer portal-licens

---

## 🎯 **Baserat på vad du ser - välj ett alternativ:**

### **Alternativ A: Du ser ditt gamla företag i listan**
✅ **GÖR DETTA:**
1. Växla till ditt gamla företagskonto (klicka på företagsnamnet)
2. Gå till Hjälp/Support
3. Skapa supportärende (använd mallen från FORTNOX_SUPPORT_TICKET_MALL.md)
4. Du är systemadmin på det kontot ✅

**Resultat:** Du får sandbox-access kopplat till ditt gamla företag

---

### **Alternativ B: Du ser INTE ditt gamla företag**
Du har troligen bara byrålicens + konsultaccess till Fredrik's företag.

**PROBLEM:** Du är INTE systemadmin på Fredrik's företag (Fredrik är det).

✅ **LÖSNINGAR:**

**Lösning 1: Be Fredrik göra ärendet** (REKOMMENDERAT)
```
Maila Fredrik:
"Hej Fredrik, jag behöver developer portal-access för att bygga 
bokföringsassistenten. Kan du som systemadmin på ditt företag 
skapa ett supportärende? Jag har en färdig mall åt dig."
```

**Lösning 2: Reaktivera ditt gamla företag**
```
1. Kontakta Fortnox support
2. Be dem återaktivera ditt gamla företagskonto
3. Skapa supportärende från det kontot
```

**Lösning 3: Skapa nytt test-företag**
```
1. Skapa nytt Fortnox-konto (gratis trial 30 dagar)
2. Du blir systemadmin automatiskt
3. Skapa supportärende för developer portal
4. Använd detta BARA för sandbox-utveckling
```

---

### **Alternativ C: Fredrik's företag ÄR "ditt företag" i pop-upen**
Om du skapade Fortnox-kontot för Fredrik's företag ursprungligen och är systemadmin...

✅ **GÖR DETTA:**
1. Växla till Fredrik's företagskonto (inte byrålicens)
2. Gå till Hjälp/Support
3. Skapa supportärende
4. Skriv att det är för intern integration

**Resultat:** Developer portal kopplas till Fredrik's företag

---

## 🤔 **FÖRVIRRANDE? Här är enkla test:**

### **Är du systemadmin?**
1. Logga in på Fortnox
2. Gå till Inställningar
3. Letar efter "Användare och behörigheter" eller "Användare"
4. Kan du lägga till/ta bort användare?
   - **JA** = Du är systemadmin ✅ → Skapa supportärende
   - **NEJ** = Du är konsult/begränsad → Be Fredrik göra det

---

## 💡 **MIN REKOMMENDATION:**

Baserat på att du sa "byrålicens" och "Fredrik har lagt till mig som konsult":

**Du är troligen INTE systemadmin på Fredrik's företag.**

**→ Be Fredrik skapa supportärendet** (använd mallen nedan)

---

## 📧 **Mall till Fredrik:**

```
Hej Fredrik,

Jag behöver tillgång till Fortnox utvecklarportal för att bygga 
bokföringsassistenten och onboarding-appen.

Eftersom jag är konsult på ditt företagskonto (inte systemadmin) 
behöver du skapa ett supportärende:

1. Logga in på Fortnox
2. Gå till Hjälp/Support
3. Skapa ärende med denna text:

---
Ämne: Ansökan om utvecklarportal-licens

Hej,

Vi vill lägga till utvecklarportal-licens för att utveckla intern integration.

Användare som behöver access:
- Namn: Lasse Karagiannis  
- E-post: [din e-post]
- Roll: Utvecklare (konsult på vårt företag)

Vi utvecklar bokföringsassistent och onboarding-app för byråverksamhet.
Behöver sandbox-access för utveckling och testning.

Mvh,
Fredrik [Efternamn]
[Företagsnamn]
---

Tar 2 minuter, sedan kan jag börja utveckla! 

Tack!
/Lasse
```

---

## ⏰ **Medan du väntar:**

Vill du att jag hjälper dig med något annat?
- Bygga expandable info-popups för slides?
- Förbereda OAuth-flow i React?
- Designa settings-sidan?

