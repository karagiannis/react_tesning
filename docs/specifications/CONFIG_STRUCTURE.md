# Configuration Structure for Onboarding App

## Firm Configuration (config.json)

This document describes the structure for firm-wide configuration that is used throughout the onboarding application, particularly in **WelcomeSlide** (Slide 28) and **SupportSlide** (Slide 30).

### Data Structure

```json
{
  "firm": {
    "name": "Din Redovisningsbyrå AB",
    "supportEmail": "support@dinbyra.se",
    "supportPhone": "08-123 45 67",
    "businessHours": "helgfria vardagar 08:00-17:00",
    "complianceEmail": "compliance@dinbyra.se",
    "compliancePhone": "08-123 45 68",
    "taxEmail": "skatt@dinbyra.se",
    "taxPhone": "08-123 45 69",
    "urgentEmail": "akut@dinbyra.se",
    "urgentPhone": "08-123 45 70"
  },
  "assignedConsultant": {
    "name": "Anna Svensson",
    "email": "anna.svensson@dinbyra.se",
    "phone": "070-123 45 67",
    "photo": "/api/photos/anna-svensson.jpg",
    "title": "Auktoriserad redovisningskonsult"
  }
}
```

### Field Descriptions

#### Firm Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Official name of the accounting firm |
| `supportEmail` | string | Yes | General technical support email |
| `supportPhone` | string | Yes | General support phone number |
| `businessHours` | string | Yes | Standard business hours (Swedish format) |
| `complianceEmail` | string | Yes | AML/Compliance specialist email |
| `compliancePhone` | string | Yes | Compliance department phone |
| `taxEmail` | string | Yes | Tax specialist email address |
| `taxPhone` | string | Yes | Tax department phone number |
| `urgentEmail` | string | Yes | Emergency contact email |
| `urgentPhone` | string | Yes | Emergency hotline phone number |

#### Assigned Consultant Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name of assigned accounting consultant |
| `email` | string | Yes | Direct email to consultant |
| `phone` | string | Yes | Direct phone number to consultant |
| `photo` | string | No | URL to consultant's profile photo |
| `title` | string | No | Professional title/credentials |

### Backend API Endpoint

**GET** `/api/settings/firm-config`

**Response:**
```json
{
  "success": true,
  "data": {
    "firm": { ... },
    "assignedConsultant": { ... }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Configuration not found",
  "code": "CONFIG_NOT_FOUND"
}
```

### Usage in React Components

#### WelcomeSlide.jsx (Slide 28)

```jsx
import { useState, useEffect } from 'react';

const [config, setConfig] = useState(null);

useEffect(() => {
  fetch('/api/settings/firm-config')
    .then(res => res.json())
    .then(data => setConfig(data.data));
}, []);

// Display consultant info:
<p>{config?.assignedConsultant.name}</p>
<p>{config?.assignedConsultant.email}</p>
<p>{config?.firm.supportEmail}</p>
```

#### SupportSlide.jsx (Slide 30)

```jsx
// Use config.firm.complianceEmail, taxEmail, urgentPhone, etc.
// for displaying different support categories
```

### Mock Data for Development

Located in: `/src/data/mockFirmConfig.js`

```javascript
export const mockFirmConfig = {
  firm: {
    name: "Demo Redovisning AB",
    supportEmail: "support@demoredovisning.se",
    supportPhone: "08-123 45 67",
    businessHours: "helgfria vardagar 08:00-17:00",
    complianceEmail: "compliance@demoredovisning.se",
    compliancePhone: "08-123 45 68",
    taxEmail: "skatt@demoredovisning.se",
    taxPhone: "08-123 45 69",
    urgentEmail: "akut@demoredovisning.se",
    urgentPhone: "08-123 45 70"
  },
  assignedConsultant: {
    name: "Anna Svensson",
    email: "anna.svensson@demoredovisning.se",
    phone: "070-123 45 67",
    photo: null,
    title: "Auktoriserad redovisningskonsult"
  }
};
```

### Security Considerations

1. **No sensitive data** - Configuration contains only public contact information
2. **CORS policy** - Backend should validate origin for API requests
3. **Rate limiting** - Implement rate limits on config endpoint to prevent abuse
4. **Caching** - Config can be cached client-side for 24 hours (rarely changes)
5. **Validation** - Backend should validate all fields before returning to frontend

### Settings Page Integration

The config can be edited through the **Settings page** (accessed via gear icon):

**PUT** `/api/settings/firm-config`

**Request Body:**
```json
{
  "firm": { ... },
  "assignedConsultant": { ... }
}
```

**Required Permissions:**
- Admin role only
- Must be authenticated with valid session token

### Custom Questions and Legal Basis

Firms can add custom questions to the onboarding wizard with full legal documentation support.

#### Custom Question Structure

```json
{
  "customQuestions": [
    {
      "step": 5,
      "category": "Särskilda omständigheter",
      "question": {
        "id": "custom_q1",
        "text": "Hanterar ni lyxvaror (konst, smycken, bilar över 1 miljon kr)?",
        "type": "radio",
        "options": ["Ja", "Nej", "Ibland"]
      },
      "legalBasis": [
        {
          "heading": "2 kap. 5 § punkt 3 PTL – Riskfaktorer",
          "paragraphs": [
            "Verksamhetsutövaren ska vid riskbedömningen beakta följande omständigheter:",
            "3. hur sårbara de varor eller tjänster som erbjuds är för penningtvätt eller finansiering av terrorism, särskilt om de möjliggör anonymitet, underlättar kapitaltransaktioner eller möjliggör att transaktionerna genomförs utanför Sverige eller EES,"
          ]
        },
        {
          "heading": "Nationell riskbedömning 2020-2021, sid. 47",
          "paragraphs": [
            "Sällanköpsvaror som bilar, båtar, konst och smycken identifieras som högriskområden för penningtvätt på grund av höga transaktionsvärden och möjlighet till värdeöverföring."
          ]
        }
      ],
      "rationale": "Lyxvaror är högriskprodukter enligt både PTL och nationell riskbedömning. Höga värden kan användas för att tvätta brottsvinster."
    }
  ]
}
```

#### Custom Question Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `step` | number | Yes | Which step in wizard to insert (1-10) |
| `category` | string | Yes | Category name displayed in UI |
| `question.id` | string | Yes | Unique identifier for question (alphanumeric + underscore) |
| `question.text` | string | Yes | Question text displayed to user |
| `question.type` | string | Yes | Input type: "radio", "checkbox", "dropdown", "text" |
| `question.options` | array | Conditional | Required for radio/checkbox/dropdown types |
| `legalBasis` | array | No | Array of legal references with headings and paragraphs |
| `legalBasis[].heading` | string | Yes | Legal reference heading (e.g., "2 kap. 5 § PTL") |
| `legalBasis[].paragraphs` | array | Yes | Array of text paragraphs (enables proper line breaks) |
| `rationale` | string | No | Explanation of why this question is asked |

#### Handling Multi-Paragraph Legal Texts

**Option 1: Array of Paragraphs (Recommended)**
```json
"paragraphs": [
  "Första stycket text här.",
  "Andra stycket text här.",
  "Tredje stycket text här med punkter:",
  "1. första punkten,",
  "2. andra punkten, och",
  "3. tredje punkten."
]
```

**Option 2: Explicit Line Breaks**
```json
"paragraphs": [
  "Första stycket.\n\nAndra stycket.\n\nTredje stycket."
]
```

**React Rendering Example:**
```jsx
<div className="legal-text-container" style={{
  maxHeight: '400px',
  overflowY: 'auto',
  padding: '1rem',
  fontSize: '0.75rem'
}}>
  {question.legalBasis?.map((legal, idx) => (
    <div key={idx} className="legal-section mb-4">
      <h4 className="font-bold text-sm mb-2">{legal.heading}</h4>
      {legal.paragraphs.map((para, pIdx) => (
        <p key={pIdx} className="mb-2 text-xs leading-relaxed">
          {para}
        </p>
      ))}
    </div>
  ))}
  {question.rationale && (
    <div className="rationale mt-4 pt-4 border-t">
      <h4 className="font-bold text-sm mb-2">Varför frågar vi detta?</h4>
      <p className="text-xs">{question.rationale}</p>
    </div>
  )}
</div>
```

#### Validation Rules

Backend must validate custom questions:

1. **Question ID**: Alphanumeric + underscore only, max 50 chars
2. **Step number**: Integer between 1-10
3. **Paragraphs**: Max 20 paragraphs per legal reference
4. **Paragraph length**: Max 5000 characters per paragraph
5. **Legal basis**: Max 10 legal references per question
6. **XSS Protection**: Sanitize all text fields
7. **Question type**: Must be one of: "radio", "checkbox", "dropdown", "text"
8. **Options**: Required for radio/checkbox/dropdown, max 10 options

#### Security Considerations

1. **HTML Sanitization** - All user-provided text must be sanitized to prevent XSS
2. **Max Length Limits** - Prevent DoS attacks via extremely long texts
3. **Admin-Only** - Only admin users can upload custom config.json
4. **Validation** - Reject invalid JSON structures before saving
5. **Backup** - Keep previous config version before applying new one

### Future Enhancements

1. **Multiple consultants** - Support assigning different consultants per customer
2. **Localization** - Support multiple languages for businessHours text
3. **Custom fields** - Allow firms to add custom contact categories
4. **Auto-assignment** - Automatically assign consultants based on workload
5. **Availability status** - Real-time status (online/offline/busy) for consultants
6. **Question templates** - Pre-built custom question templates for common scenarios
7. **Conditional logic** - Show/hide questions based on previous answers
8. **Risk scoring** - Automatic risk score calculation based on custom questions

---

## Related Documentation

- [WelcomeSlide Implementation](/src/components/Slides/WelcomeSlide.jsx)
- [SupportSlide Implementation](/src/components/Slides/SupportSlide.jsx)
- [Backend API Documentation](/docs/API.md)
- [Settings Page Specification](/docs/SETTINGS_PAGE.md)

## Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-20 | 1.0 | Initial documentation for slides 28-30 implementation |
