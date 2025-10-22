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

### Future Enhancements

1. **Multiple consultants** - Support assigning different consultants per customer
2. **Localization** - Support multiple languages for businessHours text
3. **Custom fields** - Allow firms to add custom contact categories
4. **Auto-assignment** - Automatically assign consultants based on workload
5. **Availability status** - Real-time status (online/offline/busy) for consultants

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
