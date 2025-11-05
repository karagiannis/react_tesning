# Bokföringsanalys - Steg 6: Företagshierarki över tid (Frontend)

**Datum:** 2025-11-04
**Projekt:** Onboarding_App
**Komponent:** Bokföringsanalys Wizard - Steg 6
**Backend endpoint:** `GET /api/bokforingsanalys/{klient_id}/foretagshierarki-timeline`

---

## 🎯 Översikt

**Steg 6** i Bokföringsanalys-wizarden visar företagets hierarkiska struktur över tid, per räkenskapsår.

**UI-stil:** Expanderbar mappstruktur (Windows Explorer-stil)

**Syfte:**
- Visa hur företagets organisationsstruktur har förändrats över tid
- Identifiera nya och avslutade projekt/avdelningar
- Riskbedömning baserat på organisatorisk stabilitet

---

## 📊 JSON-protokoll från backend

### Endpoint

```
GET /api/bokforingsanalys/{klient_id}/foretagshierarki-timeline
```

### Response-struktur

```json
{
  "klient_id": "string",
  "klient_namn": "string",
  "raknenskapsaar": [
    {
      "rar_id": 0,
      "rar_label": "2024-2025",
      "rar_start": "2024-01-01",
      "rar_slut": "2024-12-31",
      "is_current": true,
      "dimensioner": [
        {
          "dim_id": 1,
          "dim_namn": "Resultatenhet",
          "underdim_till": null,
          "niva": 1,
          "objekt": [
            {
              "obj_id": "Nord",
              "obj_namn": "Kontor Nord",
              "status": "Aktiv",
              "forsta_trans": "2020-01-15",
              "senaste_trans": "2024-11-01",
              "antal_trans_detta_ar": 245,
              "tillkom_detta_ar": false,
              "avslutad_detta_ar": false,
              "change_type": null
            }
          ],
          "metadata": {
            "totalt_objekt": 2,
            "nya_objekt": 0,
            "avslutade_objekt": 0
          }
        }
      ],
      "sammanfattning": {
        "totalt_dimensioner": 2,
        "totalt_objekt": 4,
        "nya_objekt": 1,
        "avslutade_objekt": 0,
        "aktiva_objekt": 4
      }
    }
  ],
  "global_sammanfattning": {
    "antal_raknenskapsaar": 2,
    "totalt_unika_objekt": 6,
    "genomsnittlig_livslangd_dagar": 548,
    "mest_stabila_dimension": {
      "dim_id": 1,
      "dim_namn": "Resultatenhet",
      "forandring_procent": 0
    },
    "mest_dynamiska_dimension": {
      "dim_id": 6,
      "dim_namn": "Projekt",
      "forandring_procent": 50
    }
  }
}
```

---

## 🎨 UI-design

### Visual mockup

```
┌────────────────────────────────────────────────────────────────┐
│ Bokföringsanalys - Steg 6: Företagshierarki över tid          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ 📁 2024-2025 (Aktuellt år) [4 objekt, 🆕 1 ny]                │
│    📁 Resultatenhet (dim 1)                                    │
│       🏷️ Nord [✅ Aktiv] - 245 transaktioner                  │
│       🏷️ Syd [✅ Aktiv] - 180 transaktioner                   │
│    📁 Projekt (dim 6)                                          │
│       🏷️ 0006 Expansion 2025 [🆕 Nytt 2024-09] - 42 trans    │
│       🏷️ 0005 E-handel 2024 [✅ Aktiv] - 156 trans            │
│                                                                │
│ 📁 2023-2024 [5 objekt, 🆕 1 ny, 🔴 1 avslutat]              │
│    📁 Resultatenhet (dim 1)                                    │
│       🏷️ Nord [✅ Aktiv] - 320 transaktioner                  │
│       🏷️ Syd [✅ Aktiv] - 210 transaktioner                   │
│    📁 Projekt (dim 6)                                          │
│       🏷️ 0005 E-handel 2024 [🆕 Nytt 2023-11] - 35 trans     │
│       🏷️ 0004 Lager 2023 [✅ Aktiv] - 89 trans                │
│       🏷️ 0002 Hemsida 2019 [🔴 Avslutat 2023-01] - 8 trans   │
│                                                                │
│ ───────────────────────────────────────────────────────────── │
│ Översikt                                                       │
│ • Mest stabil dimension: Resultatenhet (0% förändring)        │
│ • Mest dynamisk dimension: Projekt (50% förändring)           │
│                                                                │
│ [← Föregående steg]                           [Nästa steg →]  │
└────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Komponenter

### Huvudkomponent

```jsx
// src/components/BokforingsanalysWizard/Step6_ForetagshiearkiTimeline.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Step6_ForetagshiearkiTimeline.css';

const Step6ForetagshiearkiTimeline = ({ klientId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedYears, setExpandedYears] = useState([0]); // Aktuellt år expanderat
  const [expandedDimensions, setExpandedDimensions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/bokforingsanalys/${klientId}/foretagshierarki-timeline`
        );
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [klientId]);

  const toggleYear = (rarId) => {
    setExpandedYears(prev =>
      prev.includes(rarId)
        ? prev.filter(id => id !== rarId)
        : [...prev, rarId]
    );
  };

  const toggleDimension = (rarId, dimId) => {
    const key = `${rarId}-${dimId}`;
    setExpandedDimensions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'new': return '🆕';
      case 'closed': return '🔴';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aktiv': return '✅';
      case 'Gammal': return '⚠️';
      case 'Avslutat': return '🔴';
      case 'Aldrig använd': return '❓';
      default: return '';
    }
  };

  if (loading) return <div className="loading">Laddar företagshierarki...</div>;
  if (error) return <div className="error">Fel: {error}</div>;
  if (!data) return null;

  return (
    <div className="foretagshierarki-timeline">
      <h2>Företagshierarki över tid</h2>

      {data.raknenskapsaar.map(rar => (
        <div key={rar.rar_id} className="year-section">
          {/* Räkenskapsår-header */}
          <div
            className={`year-header ${rar.is_current ? 'current' : ''}`}
            onClick={() => toggleYear(rar.rar_id)}
          >
            <span className="expand-icon">
              {expandedYears.includes(rar.rar_id) ? '📂' : '📁'}
            </span>
            <strong>{rar.rar_label}</strong>
            {rar.is_current && <span className="badge current-badge">Aktuellt</span>}
            <span className="summary">
              [{rar.sammanfattning.totalt_objekt} objekt
              {rar.sammanfattning.nya_objekt > 0 && (
                <span className="new-count">
                  , 🆕 {rar.sammanfattning.nya_objekt} nya
                </span>
              )}
              {rar.sammanfattning.avslutade_objekt > 0 && (
                <span className="closed-count">
                  , 🔴 {rar.sammanfattning.avslutade_objekt} avslutade
                </span>
              )}]
            </span>
          </div>

          {/* Expanderat innehåll */}
          {expandedYears.includes(rar.rar_id) && (
            <div className="year-content">
              {rar.dimensioner.map(dim => (
                <div key={dim.dim_id} className="dimension-section">
                  {/* Dimension-header */}
                  <div
                    className="dimension-header"
                    onClick={() => toggleDimension(rar.rar_id, dim.dim_id)}
                  >
                    <span className="expand-icon">
                      {expandedDimensions[`${rar.rar_id}-${dim.dim_id}`] ? '📂' : '📁'}
                    </span>
                    <strong>{dim.dim_namn} (dim {dim.dim_id})</strong>
                    <span className="summary">
                      [{dim.metadata.totalt_objekt} objekt]
                    </span>
                  </div>

                  {/* Expanderade objekt */}
                  {expandedDimensions[`${rar.rar_id}-${dim.dim_id}`] && (
                    <div className="objekt-list">
                      {dim.objekt.map(obj => (
                        <div key={obj.obj_id} className="objekt-item">
                          <span className="objekt-icon">🏷️</span>
                          <span className="objekt-id">{obj.obj_id}</span>
                          <span className="objekt-namn">{obj.obj_namn}</span>
                          <span className="status-icon">{getStatusIcon(obj.status)}</span>
                          {obj.change_type && (
                            <span className={`change-badge badge-${obj.change_type}`}>
                              {getChangeIcon(obj.change_type)}
                              {obj.change_type === 'new' && ` Nytt ${obj.forsta_trans.substring(0, 7)}`}
                              {obj.change_type === 'closed' && ` Avslutat ${obj.senaste_trans.substring(0, 7)}`}
                            </span>
                          )}
                          <span className="trans-count">
                            - {obj.antal_trans_detta_ar} transaktioner
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Global sammanfattning */}
      <div className="global-summary">
        <h3>Översikt</h3>
        <ul>
          <li>
            <strong>Mest stabil dimension:</strong>{' '}
            {data.global_sammanfattning.mest_stabila_dimension.dim_namn}
            {' '}({data.global_sammanfattning.mest_stabila_dimension.forandring_procent}% förändring)
          </li>
          <li>
            <strong>Mest dynamisk dimension:</strong>{' '}
            {data.global_sammanfattning.mest_dynamiska_dimension.dim_namn}
            {' '}({data.global_sammanfattning.mest_dynamiska_dimension.forandring_procent}% förändring)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Step6ForetagshiearkiTimeline;
```

---

## 🎨 CSS

```css
/* src/components/BokforingsanalysWizard/Step6_ForetagshiearkiTimeline.css */

.foretagshierarki-timeline {
  padding: 1rem;
}

.year-section {
  margin-bottom: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.year-header {
  background: #f5f5f5;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.year-header:hover {
  background: #e8e8e8;
}

.year-header.current {
  background: #e3f2fd;
  border-left: 4px solid #2196F3;
  font-weight: bold;
}

.expand-icon {
  font-size: 1.2rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: normal;
}

.current-badge {
  background: #2196F3;
  color: white;
}

.summary {
  margin-left: auto;
  font-size: 0.9rem;
  color: #666;
}

.new-count {
  color: #4CAF50;
}

.closed-count {
  color: #F44336;
}

.year-content {
  padding: 1rem;
  background: white;
}

.dimension-section {
  margin-left: 2rem;
  margin-bottom: 1rem;
}

.dimension-header {
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fafafa;
  border-radius: 4px;
  transition: background 0.2s;
}

.dimension-header:hover {
  background: #f0f0f0;
}

.objekt-list {
  margin-left: 2rem;
  margin-top: 0.5rem;
}

.objekt-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.objekt-icon {
  font-size: 1.1rem;
}

.objekt-id {
  font-family: monospace;
  background: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.9rem;
}

.objekt-namn {
  font-weight: 500;
}

.status-icon {
  font-size: 1.1rem;
}

.change-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge-new {
  background: #E8F5E9;
  color: #2E7D32;
  border: 1px solid #4CAF50;
}

.badge-closed {
  background: #FFEBEE;
  color: #C62828;
  border: 1px solid #F44336;
}

.trans-count {
  margin-left: auto;
  font-size: 0.85rem;
  color: #666;
}

.global-summary {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.global-summary h3 {
  margin-top: 0;
  color: #333;
}

.global-summary ul {
  list-style: none;
  padding: 0;
}

.global-summary li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.global-summary li:last-child {
  border-bottom: none;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #F44336;
}
```

---

## 🧪 Mock-data för utveckling

Använd denna mock-data innan backend är klart:

```javascript
// src/mocks/bokforingsanalysMockData.js

export const mockForetagshiearkiTimeline = {
  "klient_id": "12345",
  "klient_namn": "Acme AB",
  "raknenskapsaar": [
    {
      "rar_id": 0,
      "rar_label": "2024-2025",
      "rar_start": "2024-01-01",
      "rar_slut": "2024-12-31",
      "is_current": true,
      "dimensioner": [
        {
          "dim_id": 1,
          "dim_namn": "Resultatenhet",
          "underdim_till": null,
          "niva": 1,
          "objekt": [
            {
              "obj_id": "Nord",
              "obj_namn": "Kontor Nord",
              "status": "Aktiv",
              "forsta_trans": "2020-01-15",
              "senaste_trans": "2024-11-01",
              "antal_trans_detta_ar": 245,
              "tillkom_detta_ar": false,
              "avslutad_detta_ar": false,
              "change_type": null
            },
            {
              "obj_id": "Syd",
              "obj_namn": "Kontor Syd",
              "status": "Aktiv",
              "forsta_trans": "2022-06-10",
              "senaste_trans": "2024-10-28",
              "antal_trans_detta_ar": 180,
              "tillkom_detta_ar": false,
              "avslutad_detta_ar": false,
              "change_type": null
            }
          ],
          "metadata": {
            "totalt_objekt": 2,
            "nya_objekt": 0,
            "avslutade_objekt": 0
          }
        },
        {
          "dim_id": 6,
          "dim_namn": "Projekt",
          "underdim_till": null,
          "niva": 1,
          "objekt": [
            {
              "obj_id": "0006",
              "obj_namn": "Expansion 2025",
              "status": "Aktiv",
              "forsta_trans": "2024-09-15",
              "senaste_trans": "2024-11-01",
              "antal_trans_detta_ar": 42,
              "tillkom_detta_ar": true,
              "avslutad_detta_ar": false,
              "change_type": "new"
            },
            {
              "obj_id": "0005",
              "obj_namn": "E-handel 2024",
              "status": "Aktiv",
              "forsta_trans": "2023-11-20",
              "senaste_trans": "2024-10-15",
              "antal_trans_detta_ar": 156,
              "tillkom_detta_ar": false,
              "avslutad_detta_ar": false,
              "change_type": null
            }
          ],
          "metadata": {
            "totalt_objekt": 2,
            "nya_objekt": 1,
            "avslutade_objekt": 0
          }
        }
      ],
      "sammanfattning": {
        "totalt_dimensioner": 2,
        "totalt_objekt": 4,
        "nya_objekt": 1,
        "avslutade_objekt": 0,
        "aktiva_objekt": 4
      }
    },
    {
      "rar_id": -1,
      "rar_label": "2023-2024",
      "rar_start": "2023-01-01",
      "rar_slut": "2023-12-31",
      "is_current": false,
      "dimensioner": [
        {
          "dim_id": 1,
          "dim_namn": "Resultatenhet",
          "underdim_till": null,
          "niva": 1,
          "objekt": [
            {
              "obj_id": "Nord",
              "obj_namn": "Kontor Nord",
              "status": "Aktiv",
              "forsta_trans": "2020-01-15",
              "senaste_trans": "2023-12-30",
              "antal_trans_detta_ar": 320,
              "tillkom_detta_ar": false,
              "avslutad_detta_ar": false,
              "change_type": null
            },
            {
              "obj_id": "Syd",
              "obj_namn": "Kontor Syd",
              "status": "Aktiv",
              "forsta_trans": "2022-06-10",
              "senaste_trans": "2023-12-28",
              "antal_trans_detta_ar": 210,
              "tillkom_detta_ar": false,
              "avslutad_detta_ar": false,
              "change_type": null
            }
          ],
          "metadata": {
            "totalt_objekt": 2,
            "nya_objekt": 0,
            "avslutade_objekt": 0
          }
        },
        {
          "dim_id": 6,
          "dim_namn": "Projekt",
          "underdim_till": null,
          "niva": 1,
          "objekt": [
            {
              "obj_id": "0005",
              "obj_namn": "E-handel 2024",
              "status": "Aktiv",
              "forsta_trans": "2023-11-20",
              "senaste_trans": "2023-12-30",
              "antal_trans_detta_ar": 35,
              "tillkom_detta_ar": true,
              "avslutad_detta_ar": false,
              "change_type": "new"
            },
            {
              "obj_id": "0004",
              "obj_namn": "Lager 2023",
              "status": "Aktiv",
              "forsta_trans": "2022-03-10",
              "senaste_trans": "2023-08-30",
              "antal_trans_detta_ar": 89,
              "tillkom_detta_ar": false,
              "avslutad_detta_ar": false,
              "change_type": null
            },
            {
              "obj_id": "0002",
              "obj_namn": "Hemsida 2019",
              "status": "Avslutat",
              "forsta_trans": "2019-05-01",
              "senaste_trans": "2023-01-15",
              "antal_trans_detta_ar": 8,
              "tillkom_detta_ar": false,
              "avslutad_detta_ar": true,
              "change_type": "closed"
            }
          ],
          "metadata": {
            "totalt_objekt": 3,
            "nya_objekt": 1,
            "avslutade_objekt": 1
          }
        }
      ],
      "sammanfattning": {
        "totalt_dimensioner": 2,
        "totalt_objekt": 5,
        "nya_objekt": 1,
        "avslutade_objekt": 1,
        "aktiva_objekt": 4
      }
    }
  ],
  "global_sammanfattning": {
    "antal_raknenskapsaar": 2,
    "totalt_unika_objekt": 6,
    "genomsnittlig_livslangd_dagar": 548,
    "mest_stabila_dimension": {
      "dim_id": 1,
      "dim_namn": "Resultatenhet",
      "forandring_procent": 0
    },
    "mest_dynamiska_dimension": {
      "dim_id": 6,
      "dim_namn": "Projekt",
      "forandring_procent": 50
    }
  }
};
```

### Användning av mock-data

```jsx
// Under utveckling, använd mock-data
import { mockForetagshiearkiTimeline } from '../../mocks/bokforingsanalysMockData';

const Step6ForetagshiearkiTimeline = ({ klientId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Byt till riktigt API-anrop när backend är klart
    const USE_MOCK_DATA = true;

    if (USE_MOCK_DATA) {
      // Mock-data
      setTimeout(() => {
        setData(mockForetagshiearkiTimeline);
        setLoading(false);
      }, 500);
    } else {
      // Riktigt API-anrop
      axios.get(`/api/bokforingsanalys/${klientId}/foretagshierarki-timeline`)
        .then(response => setData(response.data))
        .catch(error => setError(error.message))
        .finally(() => setLoading(false));
    }
  }, [klientId]);

  // ... resten av komponenten
};
```

---

## 🔌 Integration i wizard

### Lägg till Steg 6 i wizard-flow

**Fil att ändra:** `src/components/BokforingsanalysWizard/BokforingsanalysWizard.jsx`

```jsx
import Step6ForetagshiearkiTimeline from './Step6_ForetagshiearkiTimeline';

const steps = [
  { id: 1, label: 'Varningar', component: Step1Varningar },
  { id: 2, label: 'Rapporter', component: Step2Rapporter },
  { id: 3, label: 'Momsrapporter', component: Step3Momsrapporter },
  { id: 4, label: 'Inkomstdeklarationer', component: Step4Inkomstdeklarationer },
  { id: 5, label: 'Årsredovisningar', component: Step5Arsredovisningar },
  { id: 6, label: 'Företagshierarki', component: Step6ForetagshiearkiTimeline }, // NY!
];
```

---

## ✅ Checklista

- [ ] Skapa komponent: `Step6_ForetagshiearkiTimeline.jsx`
- [ ] Skapa CSS: `Step6_ForetagshiearkiTimeline.css`
- [ ] Skapa mock-data: `bokforingsanalysMockData.js`
- [ ] Lägg till i wizard-flow
- [ ] Testa expandering/kollapsering av år
- [ ] Testa expandering/kollapsering av dimensioner
- [ ] Verifiera badges (🆕 nya, 🔴 avslutade)
- [ ] Verifiera global sammanfattning
- [ ] Testa responsivitet (mobil/desktop)
- [ ] Byt till riktigt API när backend är klart

---

## 📝 Anteckningar för backend-integration

När backend-endpointen är klar:
1. Ändra `USE_MOCK_DATA` till `false`
2. Verifiera att JSON-strukturen matchar specen
3. Testa error-hantering
4. Testa loading-state

---

**Status:** Väntar på backend-implementation
**Nästa steg:** Implementera komponenten med mock-data
