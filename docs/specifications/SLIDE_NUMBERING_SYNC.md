# LaTeX Presentation - Slide Numbering Sync

**Datum:** 2025-10-20  
**Status:** ✅ Synkroniserad med React-implementering

## Bakgrund

LaTeX-presentationen (`Onboardin_app_ny.tex`) hade slide-nummer som inte stämde överens med den faktiska React-implementeringen i `App.jsx`. Detta dokument sammanfattar korrigeringarna.

---

## Slide-mappning: LaTeX ↔ React

| LaTeX Slide | React Slide | Komponent | Route | Beskrivning |
|------------|-------------|-----------|-------|-------------|
| - | 0 | HeroSlide | / | Landing page med värdeproposition |
| - | 1 | LoginSlide | /login | Inloggning |
| - | 2 | RegisterSlide | /register | Registrering med org.nr |
| - | 3 | VerifySlide | /verify | Verifiering |
| Slide 1 → **Slide 4** | 4 | IntroSlide | /inledning | Inledning och bakgrund |
| Slides 2-4 → **Slide 5** | 5 | RiskfragorSlide | /riskfragor | Riskfrågor (flera frames i LaTeX) |
| Slide 4.1 → **Slide 6** | 6 | IdentitetskontrollSlide | /identitet | Identitetskontroll och dokumentation |
| Slide 4.2 → **Slide 7** | 7 | KontrolltabellSlide | /kontrolltabell | Kontrolltabell enligt 01FS 2024:20 |
| Slide 4.3 → **Slide 8** | 8 | PEPSlide | /pepfordjupning | Skärpt kundkännedom (PEP) |
| Slide 5 → **Slide 9** | 9 | VerksamhetSlide | /verksamhet | Verksamhetsbeskrivning & SNI-koder |
| Slide 6 → **Slide 10** | 10 | AgarstrukturSlide | /agarstruktur | Ägarstruktur & verklig huvudman |
| Slide 7 → **Slide 11** | 11 | StyrelseSlide | /styrelse | Styrelsemedlemmar & firmatecknare |
| Slide 8 → **Slide 12** | 12 | RiskindikatorerSlide | /riskindikatorer | Riskindikatorer & sanktionslistor |
| Slide 9 → **Slide 13** | 13 | OvrigaDataSlide | /ovrigadata | Övriga datapunkter |
| Slide 10 → **Slide 14** | 14 | BokforingDataSlide | /bokforing | Bokföringsdata och bankkonto |
| Slide 11 → **Slide 15** | 15 | LikviditetsanalysSlide | /likviditet | Likviditetsanalys |
| Slide 12 → **Slide 16** | 16 | OmsattningsanalysSlide | /omsattning | Omsättningsanalys |
| Slide 13 → **Slide 17** | 17 | ResultatanalysSlide | /resultat | Resultatanalys |
| Slide 14 → **Slide 18** | 18 | BranschjamforelseSlide | /bransch | Branschjämförelse med SCB-data |
| Slide 15 → **Slide 19** | 19 | BokforingsanalysSlide | /bokanalys | Bokföringsanalys & verifikationsfel |
| Slide 17 → **Slide 20** | 20 | RiskbedomningSlide | /beslut | Riskbedömning och besked |
| Slide 18 → **Slide 21** | 21 | SkyldigheterSlide | /skyldigheter | Kundens förväntade skyldigheter |
| Slide 19 → **Slide 22** | 22 | AvtalSlide | /avtal | Avtalsvillkor och BankID-signering |
| Slide 20 → **Slide 23** | 23 | DocumentDeliverySlide | /dokument | E-postbekräftelse och leverans |
| Slide 21 → **Slide 24** | 24 | FortnoxPackageSlide | /fortnox | ⭐ Koppling till Fortnox-paket |
| Slide 22 → **Slide 25** | 25 | BankRattigheterSlide | /bank | ⭐ Läsrättigheter till bankkonto |
| Slide 23 → **Slide 26** | 26 | DeklarationsombudSlide | /ombud | ⭐ Deklarationsombud via Skatteverket |
| Slide 24 → **Slide 27** | - | ❌ EJ IMPLEMENTERAD | /dokument-setup | Digital dokumenthantering |
| Slide 25 → **Slide 28+** | - | ❌ EJ IMPLEMENTERADE | - | Välkommen som kund, rutiner, support, tack |

⭐ = Slides som användaren specifikt ville synkronisera (24-26)

---

## Ändringar i LaTeX-dokumentet

### ✅ Uppdaterade slide-nummer

Följande slide-kommentarer har korrigerats i `Onboardin_app_ny.tex`:

1. **Slide 1 → Slide 4**: "Inledning och bakgrund"  
   - Lagt till kommentar om Auth-slides (0-3) som finns före detta i React

2. **Slides 2-4 → Slide 5**: "Riskfrågor" (RiskfragorSlide)  
   - Uppdaterat flera frames som ingår i samma React-komponent

3. **Slide 4.1 → Slide 6**: "Identitetskontroll" (IdentitetskontrollSlide)

4. **Slide 4.2 → Slide 7**: "Kontrolltabell" (KontrolltabellSlide)

5. **Slide 4.3 → Slide 8**: "PEP-fördjupning" (PEPSlide)

6. **Slide 5 → Slide 9**: "Verksamhetsbeskrivning" (VerksamhetSlide)

7. **Slide 6 → Slide 10**: "Ägarstruktur" (AgarstrukturSlide)

8. **Slide 7 → Slide 11**: "Styrelsemedlemmar" (StyrelseSlide)

9. **Slide 8 → Slide 12**: "Riskindikatorer" (RiskindikatorerSlide)

10. **Slide 9 → Slide 13**: "Övriga datapunkter" (OvrigaDataSlide)

11. **Slide 10 → Slide 14**: "Bokföringsdata" (BokforingDataSlide)

12. **Slides 11-14 → Slides 15-18**: Accounting-slides uppdaterade i kommentarssektionen

13. **Slide 15 → Slide 19**: "Bokföringsanalys" (BokforingsanalysSlide)

14. **Slide 17 → Slide 20**: "Riskbedömning" (RiskbedomningSlide)

15. **Slide 18 → Slide 21**: "Skyldigheter" (SkyldigheterSlide)

16. **Slide 19 → Slide 22**: "Avtalsvillkor" (AvtalSlide)

17. **Slide 20 → Slide 23**: "Dokumentleverans" (DocumentDeliverySlide)

18. **Slide 21 → Slide 24**: "Fortnox-paket" (FortnoxPackageSlide) ⭐
    - Lagt till React-komponentnamn och route: `/fortnox`

19. **Slide 22 → Slide 25**: "Bankrättigheter" (BankRattigheterSlide) ⭐
    - Lagt till React-komponentnamn och route: `/bank`

20. **Slide 23 → Slide 26**: "Deklarationsombud" (DeklarationsombudSlide) ⭐
    - Lagt till React-komponentnamn och route: `/ombud`

21. **Slide 24 → Slide 27**: "Digital dokumenthantering"
    - Markerad som **EJ IMPLEMENTERAD ÄN**
    - TODO: Skapa `DocumentSetupSlide.jsx` för route `/dokument-setup`

22. **Slide 25 → Slide 28+**: "Välkommen som kund"
    - Markerad som **EJ IMPLEMENTERAD ÄN**
    - TODO: Planerade slides (Ongoing routines, Support & contact, Thank you)

---

## Varför skiljer sig numreringen?

**React-implementeringen** har **4 extra slides i början**:
- **Slide 0**: Hero (Landing page, `/`)
- **Slide 1**: Login (`/login`)
- **Slide 2**: Register (`/register`)
- **Slide 3**: Verify (`/verify`)

Därför är alla efterföljande slides **+4 i nummer** jämfört med LaTeX-dokumentet.

**LaTeX-dokumentet** börjar direkt med "Inledning och bakgrund" (som är Slide 4 i React).

---

## Saknade implementationer

### Slide 27: Digital dokumenthantering
**Route:** `/dokument-setup` (finns i routing men ingen komponent)  
**Innehåll från LaTeX:**
- Scan to Dropbox/Email
- Digital dokumenthantering
- Template library
- Automatic document generation
- Email notifications
- Cloud storage options (Google Drive, Dropbox, OneDrive)

**TODO:** Skapa `DocumentSetupSlide.jsx` i `src/components/Slides/`

### Slides 28-30: Avslutning
**Planerade slides:**
- **Slide 28**: Ongoing routines and processes (löpande rutiner för KYC-uppdateringar, årliga reviews, risk re-assessment)
- **Slide 29**: Support and contact information (hur få hjälp, escalation procedures, compliance-frågor)
- **Slide 30**: Final thank you slide (onboarding complete, next steps summary, kontaktinformation)

**TODO:** Skapa dessa slides och uppdatera routing i `App.jsx`

---

## Verifiering

✅ LaTeX-kommentarer uppdaterade  
✅ React-komponentnamn och routes tillagda  
✅ Slides 24-26 (Fortnox, Bank, Deklarationsombud) korrekt numrerade  
✅ Saknade implementationer markerade med TODO  
✅ Dokumentation skapad för framtida referens

---

## Nästa steg

1. **Implementera Slide 27**: `DocumentSetupSlide.jsx` för `/dokument-setup`
2. **Implementera Slides 28-30**: Ongoing routines, Support, Thank you
3. **Uppdatera routing**: Lägg till nya slides i `App.jsx`
4. **Testa navigation**: Verifiera att alla slides fungerar korrekt
5. **Kompilera LaTeX**: Skapa PDF för LIA-presentation

---

## Användning för LIA-presentation

LaTeX-dokumentet kan nu användas som **referensdokumentation** som matchar exakt implementering:

1. **Slide-nummer stämmer**: Kan hänvisa till "Slide 24" och det är samma i både LaTeX och React
2. **Komponentnamn synliga**: Lätt att hitta motsvarande kod i `src/components/Slides/`
3. **Routes dokumenterade**: Kan testa specifika slides direkt via URL
4. **TODO-markeringar**: Tydligt vad som saknas innan fullständig implementation

**Kompilera PDF:**
```bash
cd latex/
pdflatex Onboardin_app_ny.tex
pdflatex Onboardin_app_ny.tex  # Kör 2x för referenser
```

**Resultat:** Professionell presentation med 1473 rader välformaterad Beamer-kod, redo för LIA-demonstration.

---

## Författare

Synkronisering utförd av GitHub Copilot  
**Datum:** 2025-10-20  
**Commit:** Nästa commit efter denna uppdatering
