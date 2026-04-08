# AMW Career Point — Complete API Documentation

> **Version:** 1.0
> **Date:** April 8, 2026
> **Base URL:** `https://api.amwcareerpoint.com/api/v1`
> **Auth:** Admin Panel endpoints require `Bearer <token>` in `Authorization` header
> **Content-Type:** `application/json`

---

## Table of Contents

1. [Overview & Architecture](#1-overview--architecture)
2. [Authentication](#2-authentication)
3. [Countries API](#3-countries-api)
4. [Universities (Colleges) API](#4-universities-colleges-api)
5. [Counsellors API](#5-counsellors-api)
6. [Reviews API](#6-reviews-api)
7. [Blogs API](#7-blogs-api)
8. [Contact / Enquiry API](#8-contact--enquiry-api)
9. [Media Upload API](#9-media-upload-api)
10. [Validation Rules](#10-validation-rules)
11. [Error Response Format](#11-error-response-format)
12. [Admin Panel Usage Guide](#12-admin-panel-usage-guide)

---

## 1. Overview & Architecture

### Total APIs: 8 Modules, 30+ Endpoints

| Module | Public (Frontend) | Admin (Panel) | Total |
|--------|:-:|:-:|:-:|
| Auth | 0 | 3 | 3 |
| Countries | 2 | 4 | 6 |
| Universities | 2 | 4 | 6 |
| Counsellors | 1 | 4 | 5 |
| Reviews | 1 | 4 | 5 |
| Blogs | 2 | 4 | 6 |
| Contact/Enquiry | 1 | 2 | 3 |
| Media Upload | 0 | 1 | 1 |
| **Total** | **9** | **26** | **35** |

### How Frontend & Admin Panel Share the Same API

```
┌─────────────────────┐     ┌─────────────────────┐
│   PUBLIC WEBSITE     │     │    ADMIN PANEL       │
│   (Next.js)          │     │    (React/Next.js)   │
│                      │     │                      │
│  GET /countries      │     │  GET /countries      │  ← Same endpoint
│  GET /countries/:slug│     │  POST /countries     │  ← Admin only
│  GET /universities   │     │  PUT /countries/:id  │  ← Admin only
│  GET /blogs          │     │  DELETE /countries/:id│  ← Admin only
│  POST /enquiries     │     │  POST /media/upload  │  ← Admin only
└─────────┬───────────┘     └─────────┬───────────┘
          │                           │
          │     ┌─────────────┐       │
          └────►│   REST API  │◄──────┘
                │   Server    │
                │  (Node.js)  │
                └──────┬──────┘
                       │
                ┌──────▼──────┐
                │  Database   │
                │ (PostgreSQL/│
                │  MongoDB)   │
                └─────────────┘
```

---

## 2. Authentication

> Used by **Admin Panel only**. Public website does NOT need authentication.

### 2.1 Admin Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@amwcareerpoint.com",
  "password": "securepassword"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
    "expiresIn": 86400,
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@amwcareerpoint.com",
      "role": "admin"
    }
  }
}
```

### 2.2 Refresh Token

```
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."
}
```

### 2.3 Logout

```
POST /auth/logout
Header: Authorization: Bearer <token>
```

---

## 3. Countries API

### 3.1 List Countries (Public + Admin)

```
GET /countries
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `featured` | boolean | — | Filter featured countries only (homepage) |
| `sort` | string | `sortOrder` | Sort by: `sortOrder`, `name`, `createdAt` |
| `search` | string | — | Search by country name |
| `status` | string | `active` | `active` / `inactive` / `all` (admin only) |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "slug": "russia",
      "name": "Russia",
      "countryCode": "ru",
      "description": "Russia offers world-class medical education with globally recognized degrees at affordable costs.",
      "bannerImage": "https://cdn.amwcareerpoint.com/countries/russia-banner.jpg",
      "cardImage": "https://cdn.amwcareerpoint.com/countries/russia-card.jpg",
      "headerColor": "#2563EB",
      "universityCount": 50,
      "feeRange": "₹2.5L – 6L",
      "feeRangeUSD": "$4,000 - $6,000/year",
      "duration": "6 Yrs",
      "highlights": ["No IELTS", "WHO Approved", "Low Cost"],
      "isFeatured": true,
      "sortOrder": 1,
      "status": "active",
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-03-20T14:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 16,
    "totalPages": 1
  }
}
```

### 3.2 Get Country Detail (Public + Admin)

```
GET /countries/:slug
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "slug": "russia",
    "name": "Russia",
    "countryCode": "ru",
    "description": "Russia offers world-class medical education with globally recognized degrees at affordable costs. Russian medical universities are WHO and MCI approved.",
    "bannerImage": "https://cdn.amwcareerpoint.com/countries/russia-banner.jpg",
    "cardImage": "https://cdn.amwcareerpoint.com/countries/russia-card.jpg",
    "headerColor": "#2563EB",
    "universityCount": 50,
    "feeRange": "₹2.5L – 6L",
    "feeRangeUSD": "$4,000 - $6,000/year",
    "duration": "6 years",
    "highlights": ["No IELTS", "WHO Approved", "Low Cost"],
    "isFeatured": true,
    "sortOrder": 1,
    "status": "active",

    "features": [
      "WHO & NMC Approved Universities",
      "No Entrance Exam Required",
      "Affordable Tuition Fees",
      "English Medium Courses",
      "Global Recognition"
    ],
    "eligibility": [
      "Minimum 50% in Physics, Chemistry, Biology",
      "NEET Qualification Required",
      "Age: 17-25 years"
    ],
    "admissionProcess": [
      {
        "step": 1,
        "title": "Submit Application",
        "description": "Fill out the online application form with your academic details and documents."
      },
      {
        "step": 2,
        "title": "Document Verification",
        "description": "Our team verifies all submitted documents within 3-5 working days."
      },
      {
        "step": 3,
        "title": "Admission Letter",
        "description": "Receive official admission letter from the university."
      },
      {
        "step": 4,
        "title": "Visa Processing",
        "description": "Apply for student visa with our end-to-end visa assistance."
      },
      {
        "step": 5,
        "title": "Travel & Arrival",
        "description": "Travel to Russia with airport pickup and hostel arrangement."
      }
    ],
    "climate": "Continental, -20°C to 30°C",
    "language": "Russian (English medium available in all partner universities)",
    "currency": "Russian Ruble (RUB)",
    "livingCost": "₹15,000 – 25,000/month",
    "visaInfo": "Student visa required, 30 days processing time",

    "metaTitle": "MBBS in Russia 2026 – Fees, Top Universities, Admission Process",
    "metaDescription": "Study MBBS in Russia from top WHO & NMC approved universities. Fees from ₹2.5L/year. No donation. Complete admission guidance by AMW Career Point.",

    "universities": [
      {
        "id": "univ-001",
        "slug": "first-moscow-state-medical-university",
        "name": "First Moscow State Medical University",
        "cardImage": "https://cdn.amwcareerpoint.com/universities/moscow-card.jpg",
        "fees": "₹4.5L/year",
        "duration": "6 Years",
        "ranking": "Top 5 in Russia",
        "approvals": ["WHO", "NMC", "FAIMER"]
      },
      {
        "id": "univ-002",
        "slug": "kazan-federal-university",
        "name": "Kazan Federal University",
        "cardImage": "https://cdn.amwcareerpoint.com/universities/kazan-card.jpg",
        "fees": "₹4.2L/year",
        "duration": "6 Years",
        "ranking": "Top 10 in Russia",
        "approvals": ["WHO", "NMC"]
      }
    ],

    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-03-20T14:45:00Z"
  }
}
```

### 3.3 Create Country (Admin Only)

```
POST /countries
Header: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Uzbekistan",
  "countryCode": "uz",
  "description": "Uzbekistan offers affordable medical education...",
  "bannerImage": "https://cdn.amwcareerpoint.com/countries/uzbekistan-banner.jpg",
  "cardImage": "https://cdn.amwcareerpoint.com/countries/uzbekistan-card.jpg",
  "headerColor": "#7C3AED",
  "feeRange": "₹2L – 5L",
  "feeRangeUSD": "$3,000 - $5,000/year",
  "duration": "6 Yrs",
  "highlights": ["Affordable", "NMC Approved", "Indian Food Available"],
  "features": [
    "NMC & WHO Approved Universities",
    "Affordable Fee Structure",
    "Indian Food Available"
  ],
  "eligibility": [
    "Minimum 50% in PCB",
    "NEET Qualification Required"
  ],
  "admissionProcess": [
    { "step": 1, "title": "Apply Online", "description": "Submit application..." },
    { "step": 2, "title": "Get Admission", "description": "Receive letter..." }
  ],
  "climate": "Continental",
  "language": "Uzbek (English medium available)",
  "currency": "Uzbekistani Som (UZS)",
  "livingCost": "₹10,000 – 18,000/month",
  "visaInfo": "Student visa, 20 days processing",
  "metaTitle": "MBBS in Uzbekistan 2026 – Fees, Universities",
  "metaDescription": "Study MBBS in Uzbekistan...",
  "isFeatured": true,
  "sortOrder": 7,
  "status": "active"
}
```

**Validation Rules:**

| Field | Rule | Error Message |
|-------|------|---------------|
| `name` | Required, string, 2-100 chars | "Country name is required" |
| `countryCode` | Required, exactly 2 lowercase letters, ISO 3166-1 | "Must be valid 2-letter ISO country code (e.g. 'ru', 'ua')" |
| `description` | Required, string, 20-1000 chars | "Description must be 20-1000 characters" |
| `bannerImage` | Required, valid URL | "Banner image URL is required" |
| `cardImage` | Optional, valid URL | "Must be a valid URL" |
| `headerColor` | Required, hex color `#XXXXXX` | "Must be valid hex color (e.g. #2563EB)" |
| `feeRange` | Required, string | "Fee range is required" |
| `duration` | Required, string | "Duration is required" |
| `highlights` | Required, array, min 1 item, max 5, each string max 50 chars | "At least 1 highlight required (max 5)" |
| `features` | Required, array, min 3 items | "At least 3 features required" |
| `eligibility` | Required, array, min 1 item | "At least 1 eligibility criteria required" |
| `admissionProcess` | Required, array, min 1 item | "At least 1 admission step required" |
| `admissionProcess[].step` | Required, number, sequential from 1 | "Step number must be sequential" |
| `admissionProcess[].title` | Required, string, max 100 chars | "Step title is required" |
| `admissionProcess[].description` | Required, string, max 500 chars | "Step description is required" |
| `metaTitle` | Required, string, max 60 chars | "Meta title must be under 60 characters" |
| `metaDescription` | Required, string, max 160 chars | "Meta description must be under 160 characters" |
| `isFeatured` | Optional, boolean, default `false` | — |
| `sortOrder` | Optional, number >= 0, default `0` | — |
| `status` | Optional, enum: `active`/`inactive`, default `active` | — |

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Country created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "slug": "uzbekistan"
  }
}
```

> **Note:** `slug` is auto-generated from `name` (lowercased, spaces → hyphens, special chars removed).

### 3.4 Update Country (Admin Only)

```
PUT /countries/:id
Header: Authorization: Bearer <token>
```

**Request Body:** Same as Create (all fields optional — send only what needs updating).

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Country updated successfully",
  "data": { "id": "...", "slug": "uzbekistan" }
}
```

### 3.5 Delete Country (Admin Only)

```
DELETE /countries/:id
Header: Authorization: Bearer <token>
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Country deleted successfully"
}
```

> **Important:** Deleting a country should also handle related universities (either soft-delete or prevent deletion if universities exist).

### 3.6 Reorder Countries (Admin Only)

```
PUT /countries/reorder
Header: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    { "id": "uuid-1", "sortOrder": 1 },
    { "id": "uuid-2", "sortOrder": 2 },
    { "id": "uuid-3", "sortOrder": 3 }
  ]
}
```

---

## 4. Universities (Colleges) API

### 4.1 List Universities (Public + Admin)

```
GET /universities
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `featured` | boolean | — | Featured universities only (homepage carousel) |
| `country` | string | — | Filter by country slug: `?country=russia` |
| `sort` | string | `sortOrder` | Sort by: `sortOrder`, `name`, `fees`, `established` |
| `search` | string | — | Search by university name |
| `status` | string | `active` | `active` / `inactive` / `all` (admin) |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "univ-001",
      "slug": "first-moscow-state-medical-university",
      "name": "First Moscow State Medical University",
      "countryName": "Russia",
      "countrySlug": "russia",
      "countryCode": "ru",
      "heroImage": "https://cdn.amwcareerpoint.com/universities/moscow-hero.jpg",
      "cardImage": "https://cdn.amwcareerpoint.com/universities/moscow-card.jpg",
      "location": "Moscow, Russia",
      "established": 1758,
      "ranking": "Top 5 in Russia",
      "fees": "₹4.5L/year",
      "duration": "6 Years",
      "medium": "English",
      "approvals": ["WHO", "NMC", "FAIMER"],
      "isFeatured": true,
      "sortOrder": 1,
      "status": "active",
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-03-20T14:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### 4.2 Get University Detail (Public + Admin)

```
GET /universities/:slug
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "univ-001",
    "slug": "first-moscow-state-medical-university",
    "name": "First Moscow State Medical University",
    "countryName": "Russia",
    "countrySlug": "russia",
    "countryCode": "ru",
    "description": "One of the oldest and most prestigious medical universities in Russia, offering world-class medical education since 1758.",
    "heroImage": "https://cdn.amwcareerpoint.com/universities/moscow-hero.jpg",
    "cardImage": "https://cdn.amwcareerpoint.com/universities/moscow-card.jpg",
    "galleryImages": [
      "https://cdn.amwcareerpoint.com/universities/moscow-1.jpg",
      "https://cdn.amwcareerpoint.com/universities/moscow-2.jpg",
      "https://cdn.amwcareerpoint.com/universities/moscow-3.jpg"
    ],
    "location": "Moscow, Russia",
    "established": 1758,
    "ranking": "Top 5 in Russia",
    "fees": "₹4.5L/year",
    "hostelFees": "₹50,000/year",
    "totalCost": "₹5L/year (approx)",
    "duration": "6 Years",
    "medium": "English",
    "approvals": ["WHO", "NMC", "FAIMER"],
    "isFeatured": true,
    "sortOrder": 1,
    "status": "active",

    "eligibility": [
      "Minimum 50% in Physics, Chemistry, Biology",
      "NEET Qualification Required",
      "Valid Passport",
      "Medical Certificate"
    ],
    "facilities": [
      "Modern Laboratories",
      "Well-equipped 1000-bed Hospital",
      "Library with 1M+ books",
      "Student Hostels",
      "Sports Complex",
      "Cafeteria with Indian Food"
    ],
    "admissionProcess": [
      { "step": 1, "title": "Submit Application Online", "description": "Fill out the application form with academic documents." },
      { "step": 2, "title": "Document Verification", "description": "Our team verifies all submitted documents." },
      { "step": 3, "title": "Admission Letter", "description": "Receive official admission letter within 7 days." },
      { "step": 4, "title": "Visa Processing", "description": "Apply for student visa with our assistance." },
      { "step": 5, "title": "Travel to Russia", "description": "Airport pickup and hostel check-in arranged." }
    ],
    "intakeMonths": ["September", "February"],
    "indianStudents": 500,
    "hostelAvailable": true,
    "indianFood": true,

    "metaTitle": "First Moscow State Medical University – MBBS Fees 2026, Admission",
    "metaDescription": "Study MBBS at First Moscow State Medical University. Fees ₹4.5L/year. WHO & NMC approved. Apply through AMW Career Point.",

    "faqs": [
      {
        "question": "Is NEET required for admission?",
        "answer": "Yes, NEET qualification is mandatory for Indian students as per NMC guidelines."
      },
      {
        "question": "What is the medium of instruction?",
        "answer": "The MBBS program is taught entirely in English for international students."
      },
      {
        "question": "Is Indian food available?",
        "answer": "Yes, the university hostel has an Indian mess and nearby Indian restaurants."
      }
    ],

    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-03-20T14:45:00Z"
  }
}
```

### 4.3 Create University (Admin Only)

```
POST /universities
Header: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Tashkent Medical Academy",
  "countryId": "550e8400-e29b-41d4-a716-446655440010",
  "description": "One of the leading medical universities in Uzbekistan...",
  "heroImage": "https://cdn.amwcareerpoint.com/universities/tashkent-hero.jpg",
  "cardImage": "https://cdn.amwcareerpoint.com/universities/tashkent-card.jpg",
  "galleryImages": ["url1", "url2"],
  "location": "Tashkent, Uzbekistan",
  "established": 1920,
  "ranking": "Top 1 in Uzbekistan",
  "fees": "₹3L/year",
  "hostelFees": "₹30,000/year",
  "totalCost": "₹3.5L/year",
  "duration": "6 Years",
  "medium": "English",
  "approvals": ["WHO", "NMC"],
  "eligibility": ["Minimum 50% in PCB", "NEET Qualified"],
  "facilities": ["Modern Labs", "Hospital", "Hostel"],
  "admissionProcess": [
    { "step": 1, "title": "Apply Online", "description": "..." }
  ],
  "intakeMonths": ["September"],
  "indianStudents": 200,
  "hostelAvailable": true,
  "indianFood": true,
  "metaTitle": "Tashkent Medical Academy – MBBS Fees 2026",
  "metaDescription": "Study MBBS at Tashkent Medical Academy...",
  "faqs": [
    { "question": "Is NEET required?", "answer": "Yes..." }
  ],
  "isFeatured": true,
  "sortOrder": 5,
  "status": "active"
}
```

**Validation Rules:**

| Field | Rule | Error Message |
|-------|------|---------------|
| `name` | Required, 5-200 chars | "University name is required (5-200 chars)" |
| `countryId` | Required, valid UUID, must exist in countries table | "Valid country is required" |
| `description` | Required, 20-2000 chars | "Description must be 20-2000 characters" |
| `heroImage` | Required, valid URL | "Hero image is required (for homepage carousel)" |
| `cardImage` | Optional, valid URL | — |
| `galleryImages` | Optional, array of valid URLs, max 10 | — |
| `location` | Required, string | "Location is required" |
| `established` | Required, number, 1500-2026 | "Must be valid year (1500-2026)" |
| `ranking` | Optional, string, max 100 chars | — |
| `fees` | Required, string | "Fee information is required" |
| `hostelFees` | Optional, string | — |
| `duration` | Required, string | "Duration is required" |
| `medium` | Required, string | "Medium of instruction required" |
| `approvals` | Required, array, min 1 item | "At least 1 approval body required" |
| `eligibility` | Required, array, min 1 item | "At least 1 eligibility criteria required" |
| `facilities` | Required, array, min 1 item | "At least 1 facility required" |
| `admissionProcess` | Required, array, min 1 step | "At least 1 admission step required" |
| `metaTitle` | Required, max 60 chars | "Under 60 characters" |
| `metaDescription` | Required, max 160 chars | "Under 160 characters" |
| `faqs` | Optional, array, each must have `question` AND `answer` | "Each FAQ needs both question and answer" |

### 4.4 Update University (Admin Only)

```
PUT /universities/:id
Header: Authorization: Bearer <token>
```

Same as Create, all fields optional.

### 4.5 Delete University (Admin Only)

```
DELETE /universities/:id
Header: Authorization: Bearer <token>
```

---

## 5. Counsellors API

### 5.1 List Counsellors (Public + Admin)

```
GET /counsellors
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `status` | string | `active` | `active` / `inactive` / `all` |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "coun-001",
      "name": "Manish Kataria",
      "role": "Private College Expert",
      "avatar": "https://cdn.amwcareerpoint.com/counsellors/manish.jpg",
      "rating": 5.0,
      "studentsGuided": 780,
      "bio": "MBA in Education Management. 3 years of expertise in private medical college admissions across India. Specialist in management quota and NRI seat counselling.",
      "specialization": "Management Quota",
      "isVerified": true,
      "sortOrder": 1,
      "status": "active",
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-03-20T14:45:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 6, "totalPages": 1 }
}
```

### 5.2 Create Counsellor (Admin Only)

```
POST /counsellors
Header: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Dr. New Expert",
  "role": "MBBS Abroad Specialist",
  "avatar": "https://cdn.amwcareerpoint.com/counsellors/new-expert.jpg",
  "rating": 5.0,
  "studentsGuided": 500,
  "bio": "10 years of experience in MBBS abroad counselling...",
  "specialization": "Russia & Ukraine",
  "isVerified": true,
  "sortOrder": 7,
  "status": "active"
}
```

**Validation Rules:**

| Field | Rule | Error Message |
|-------|------|---------------|
| `name` | Required, 2-100 chars | "Counsellor name is required" |
| `role` | Required, 2-100 chars | "Role/designation is required" |
| `avatar` | Optional, valid URL or null | "Must be valid image URL" |
| `rating` | Required, number, 0.0-5.0 | "Rating must be between 0 and 5" |
| `studentsGuided` | Required, number >= 0 | "Must be a positive number" |
| `bio` | Required, 20-250 chars | "Bio must be 20-250 characters" |
| `specialization` | Required, 2-50 chars | "Specialization is required" |
| `isVerified` | Optional, boolean, default `false` | — |
| `sortOrder` | Optional, number >= 0, default `0` | — |
| `status` | Optional, enum: `active`/`inactive`, default `active` | — |

### 5.3 Update Counsellor (Admin Only)

```
PUT /counsellors/:id
Header: Authorization: Bearer <token>
```

### 5.4 Delete Counsellor (Admin Only)

```
DELETE /counsellors/:id
Header: Authorization: Bearer <token>
```

---

## 6. Reviews API

### 6.1 List Reviews (Public + Admin)

```
GET /reviews
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `status` | string | `approved` | `approved` / `pending` / `rejected` / `all` (admin) |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "rev-001",
      "name": "Sunita Agarwal",
      "avatar": null,
      "rating": 5,
      "text": "Excellent service! My son got admission in a top Russian university. The team was available 24/7. Highly trustworthy.",
      "date": "2026-03-25",
      "source": "google",
      "isVerified": true,
      "status": "approved",
      "createdAt": "2026-03-25T08:15:00Z"
    }
  ],
  "meta": {
    "averageRating": 4.9,
    "totalReviews": 3240
  },
  "pagination": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

### 6.2 Create Review (Admin Only)

```
POST /reviews
Header: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Rahul Mehta",
  "avatar": null,
  "rating": 5,
  "text": "Very professional team. Got my admission in just 15 days...",
  "date": "2026-04-01",
  "source": "google",
  "isVerified": true,
  "status": "approved"
}
```

**Validation Rules:**

| Field | Rule | Error Message |
|-------|------|---------------|
| `name` | Required, 2-100 chars | "Reviewer name is required" |
| `avatar` | Optional, valid URL or null | — |
| `rating` | Required, integer, 1-5 | "Rating must be 1-5" |
| `text` | Required, 10-500 chars | "Review text must be 10-500 characters" |
| `date` | Required, valid ISO date (YYYY-MM-DD) | "Valid date is required" |
| `source` | Optional, enum: `google`/`trustpilot`/`manual` | — |
| `isVerified` | Optional, boolean | — |
| `status` | Optional, enum: `approved`/`pending`/`rejected`, default `pending` | — |

### 6.3 Update Review (Admin Only)

```
PUT /reviews/:id
Header: Authorization: Bearer <token>
```

### 6.4 Delete Review (Admin Only)

```
DELETE /reviews/:id
Header: Authorization: Bearer <token>
```

### 6.5 Update Review Meta (Admin Only)

> For updating the overall rating & total count shown on homepage.

```
PUT /reviews/meta
Header: Authorization: Bearer <token>
```

```json
{
  "averageRating": 4.9,
  "totalReviews": 3240
}
```

---

## 7. Blogs API

### 7.1 List Blogs (Public + Admin)

```
GET /blogs
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `category` | string | — | Filter by category slug |
| `tag` | string | — | Filter by tag |
| `featured` | boolean | — | Featured posts (homepage) |
| `sort` | string | `createdAt` | Sort: `createdAt`, `title`, `views` |
| `search` | string | — | Search in title & content |
| `status` | string | `published` | `published` / `draft` / `all` (admin) |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "blog-001",
      "slug": "complete-guide-mbbs-abroad",
      "title": "Complete Guide to MBBS Abroad: Everything You Need to Know",
      "excerpt": "Comprehensive guide covering all aspects of pursuing MBBS abroad, from admission requirements to career prospects.",
      "featuredImage": "https://cdn.amwcareerpoint.com/blogs/mbbs-abroad-guide.jpg",
      "author": {
        "id": "author-001",
        "name": "Dr. Priya Sharma",
        "avatar": "https://cdn.amwcareerpoint.com/authors/priya.jpg"
      },
      "category": {
        "id": "cat-001",
        "name": "Education",
        "slug": "education"
      },
      "tags": ["MBBS", "Study Abroad", "Medical Education", "Career Guide"],
      "readTime": "8 min read",
      "views": 12450,
      "isFeatured": true,
      "status": "published",
      "publishedAt": "2026-03-15T10:00:00Z",
      "createdAt": "2026-03-14T08:30:00Z",
      "updatedAt": "2026-03-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

### 7.2 Get Blog Detail (Public + Admin)

```
GET /blogs/:slug
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "blog-001",
    "slug": "complete-guide-mbbs-abroad",
    "title": "Complete Guide to MBBS Abroad: Everything You Need to Know",
    "excerpt": "Comprehensive guide covering all aspects...",
    "content": "<h2>Why Choose MBBS Abroad?</h2><p>Pursuing MBBS abroad has become increasingly popular...</p>",
    "contentFormat": "html",
    "featuredImage": "https://cdn.amwcareerpoint.com/blogs/mbbs-abroad-guide.jpg",
    "author": {
      "id": "author-001",
      "name": "Dr. Priya Sharma",
      "avatar": "https://cdn.amwcareerpoint.com/authors/priya.jpg",
      "bio": "International Education Expert at AMW Career Point"
    },
    "category": {
      "id": "cat-001",
      "name": "Education",
      "slug": "education"
    },
    "tags": ["MBBS", "Study Abroad", "Medical Education", "Career Guide"],
    "readTime": "8 min read",
    "views": 12450,
    "isFeatured": true,
    "status": "published",
    "publishedAt": "2026-03-15T10:00:00Z",

    "metaTitle": "Complete Guide to MBBS Abroad 2026 | AMW Career Point",
    "metaDescription": "Everything you need to know about MBBS abroad...",

    "relatedPosts": [
      {
        "id": "blog-002",
        "slug": "neet-exam-preparation-tips",
        "title": "NEET Exam Preparation: Essential Tips",
        "featuredImage": "https://cdn.amwcareerpoint.com/blogs/neet-tips.jpg",
        "readTime": "6 min read",
        "publishedAt": "2026-03-10T10:00:00Z"
      }
    ],

    "createdAt": "2026-03-14T08:30:00Z",
    "updatedAt": "2026-03-15T10:00:00Z"
  }
}
```

### 7.3 Create Blog (Admin Only)

```
POST /blogs
Header: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "MBBS in Russia 2026 — Complete Guide",
  "excerpt": "Everything about studying MBBS in Russia...",
  "content": "<h2>Introduction</h2><p>Russia is one of the top destinations...</p>",
  "contentFormat": "html",
  "featuredImage": "https://cdn.amwcareerpoint.com/blogs/russia-guide.jpg",
  "authorId": "author-001",
  "categoryId": "cat-001",
  "tags": ["Russia", "MBBS Abroad"],
  "metaTitle": "MBBS in Russia 2026 – Complete Guide",
  "metaDescription": "Study MBBS in Russia...",
  "isFeatured": false,
  "status": "published"
}
```

**Validation Rules:**

| Field | Rule | Error Message |
|-------|------|---------------|
| `title` | Required, 10-200 chars, unique | "Blog title is required (10-200 chars)" |
| `excerpt` | Required, 20-300 chars | "Excerpt must be 20-300 characters" |
| `content` | Required, min 100 chars | "Blog content must be at least 100 characters" |
| `contentFormat` | Required, enum: `html`/`markdown` | "Must be 'html' or 'markdown'" |
| `featuredImage` | Required, valid URL | "Featured image is required" |
| `authorId` | Required, valid UUID, must exist | "Valid author is required" |
| `categoryId` | Required, valid UUID, must exist | "Valid category is required" |
| `tags` | Optional, array of strings, max 10, each max 30 chars | "Max 10 tags, each under 30 chars" |
| `metaTitle` | Required, max 60 chars | "Meta title under 60 characters" |
| `metaDescription` | Required, max 160 chars | "Meta description under 160 characters" |
| `isFeatured` | Optional, boolean, default `false` | — |
| `status` | Required, enum: `published`/`draft` | "Status must be 'published' or 'draft'" |

> **Note:** `slug` is auto-generated from `title`. `readTime` is auto-calculated from content length. `publishedAt` is auto-set when status changes to `published`.

### 7.4 Update Blog (Admin Only)

```
PUT /blogs/:id
Header: Authorization: Bearer <token>
```

### 7.5 Delete Blog (Admin Only)

```
DELETE /blogs/:id
Header: Authorization: Bearer <token>
```

### 7.6 Blog Categories (Admin — for dropdown)

```
GET /blog-categories
```

```json
{
  "success": true,
  "data": [
    { "id": "cat-001", "name": "Education", "slug": "education", "count": 8 },
    { "id": "cat-002", "name": "Career Guide", "slug": "career-guide", "count": 5 },
    { "id": "cat-003", "name": "University Review", "slug": "university-review", "count": 12 },
    { "id": "cat-004", "name": "Student Experience", "slug": "student-experience", "count": 4 }
  ]
}
```

```
POST /blog-categories       (Admin: create category)
PUT  /blog-categories/:id   (Admin: update category)
DELETE /blog-categories/:id (Admin: delete category)
```

---

## 8. Contact / Enquiry API

### 8.1 Submit Enquiry (Public — from contact form / counselling form)

```
POST /enquiries
```

**Request Body:**
```json
{
  "name": "Rahul Kumar",
  "email": "rahul@gmail.com",
  "phone": "+919876543210",
  "neetScore": "550",
  "interestedCountry": "Russia",
  "message": "I want to know about MBBS in Russia",
  "source": "contact_page",
  "utmSource": "google",
  "utmMedium": "cpc",
  "utmCampaign": "mbbs-abroad-2026"
}
```

**Validation Rules:**

| Field | Rule | Error Message |
|-------|------|---------------|
| `name` | Required, 2-100 chars | "Name is required" |
| `email` | Required, valid email | "Valid email is required" |
| `phone` | Required, valid phone (10-15 digits with optional +) | "Valid phone number is required" |
| `neetScore` | Optional, string | — |
| `interestedCountry` | Optional, string | — |
| `message` | Optional, max 1000 chars | "Message must be under 1000 characters" |
| `source` | Required, enum: `contact_page`/`hero_form`/`cta_form`/`popup` | "Valid source required" |

**Response `201 Created`:**
```json
{
  "success": true,
  "message": "Thank you! Our team will contact you within 24 hours."
}
```

### 8.2 List Enquiries (Admin Only)

```
GET /enquiries
Header: Authorization: Bearer <token>
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page |
| `limit` | number | 20 | Per page |
| `status` | string | `all` | `new` / `contacted` / `converted` / `closed` |
| `source` | string | — | Filter by form source |
| `dateFrom` | string | — | ISO date |
| `dateTo` | string | — | ISO date |

### 8.3 Update Enquiry Status (Admin Only)

```
PUT /enquiries/:id
Header: Authorization: Bearer <token>
```

```json
{
  "status": "contacted",
  "notes": "Called on 08 Apr, interested in Russia. Follow up on 10 Apr."
}
```

---

## 9. Media Upload API

### 9.1 Upload Image (Admin Only)

```
POST /media/upload
Header: Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | Image file (JPG, PNG, WebP) |
| `folder` | string | Target folder: `countries`, `universities`, `blogs`, `counsellors` |

**Validation:**
- Max file size: **5MB**
- Allowed types: `image/jpeg`, `image/png`, `image/webp`
- Auto-resized: Original + thumbnail (400x300) generated
- Files stored on CDN (AWS S3 / Cloudinary recommended)

**Response `201 Created`:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.amwcareerpoint.com/universities/moscow-hero.jpg",
    "thumbnailUrl": "https://cdn.amwcareerpoint.com/universities/moscow-hero-thumb.jpg",
    "filename": "moscow-hero.jpg",
    "size": 245678,
    "mimeType": "image/jpeg"
  }
}
```

> **Admin Panel Flow:** Upload image first → get URL → paste URL into country/university/blog form fields.

---

## 10. Validation Rules — Complete Summary

### Global Rules (Apply to ALL endpoints)

| Rule | Details |
|------|---------|
| All `id` fields | UUID v4 format |
| All `slug` fields | Auto-generated, format: `/^[a-z0-9-]+$/` |
| All URL fields | Must start with `https://` in production |
| All `status` fields | Only valid enum values accepted |
| All arrays | Must be actual arrays (not null, not string) |
| All string fields | Trimmed (no leading/trailing whitespace) |
| Pagination | `page` >= 1, `limit` 1-100 |
| Dates | ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`) |

### Frontend Safety Checks (Implement in Next.js)

```
What frontend must handle to avoid UI crashes:

1. EMPTY ARRAYS      → Always check .length before .map()
2. NULL IMAGES       → Show gradient/placeholder fallback
3. MISSING FIELDS    → Use optional chaining (?.) and defaults
4. LONG TEXT         → CSS line-clamp or JS truncation
5. HTML CONTENT      → Sanitize blog content (XSS prevention)
6. LOADING STATES    → Skeleton UI while API fetches
7. ERROR STATES      → Friendly error message, not blank page
8. 404 RESPONSES     → Show "Not Found" page (already exists)
9. NETWORK ERRORS    → Retry logic or offline message
10. EMPTY RESULTS    → "No items found" placeholder
```

---

## 11. Error Response Format

All errors follow this consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "name",
        "message": "Country name is required"
      },
      {
        "field": "countryCode",
        "message": "Must be valid 2-letter ISO country code"
      }
    ]
  }
}
```

### Error Codes

| HTTP Status | Code | When |
|:-----------:|------|------|
| 400 | `VALIDATION_ERROR` | Invalid request body |
| 401 | `UNAUTHORIZED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Duplicate slug/name |
| 413 | `FILE_TOO_LARGE` | Image > 5MB |
| 415 | `UNSUPPORTED_MEDIA` | Invalid file type |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `SERVER_ERROR` | Internal server error |

---

## 12. Admin Panel Usage Guide

### How Admin Panel Uses These APIs

#### Adding a New Country
```
1. Admin opens "Countries" section in panel
2. Clicks "Add New Country"
3. Fills the form:
   - Name, Country Code, Description
   - Uploads banner image → POST /media/upload → gets URL
   - Uploads card image → POST /media/upload → gets URL
   - Picks header color from color picker
   - Adds fee range, duration
   - Adds highlights (dynamic list, + button to add more)
   - Adds features (dynamic list)
   - Adds eligibility criteria (dynamic list)
   - Adds admission process steps (dynamic ordered list)
   - Fills optional fields (climate, language, etc.)
   - Fills SEO fields (meta title, meta description)
   - Toggles: Featured? Active?
4. Clicks "Save" → POST /countries
5. Country appears on website immediately (if status=active)
```

#### Adding a University (College)
```
1. Admin opens "Universities" section
2. Clicks "Add New University"
3. Fills the form:
   - Name, selects Country from dropdown (populated by GET /countries)
   - Uploads hero image, card image, gallery images
   - Location, established year, ranking
   - Fees, hostel fees, duration, medium
   - Approvals (checkbox: WHO, NMC, FAIMER, etc.)
   - Eligibility (dynamic list)
   - Facilities (dynamic list)
   - Admission steps (dynamic ordered list)
   - Intake months (multi-select: September, February, etc.)
   - Toggles: Indian food? Hostel? Featured?
   - FAQs (dynamic list of Q&A pairs)
   - SEO fields
4. Clicks "Save" → POST /universities
5. University appears on website and under its country page
```

#### Adding a Blog Post
```
1. Admin opens "Blogs" section
2. Clicks "New Post"
3. Fills:
   - Title, excerpt
   - Rich text editor for content (outputs HTML)
   - Uploads featured image
   - Selects author from dropdown
   - Selects category from dropdown (or creates new)
   - Adds tags
   - SEO fields
   - Status: Draft or Published
4. Clicks "Publish" → POST /blogs
5. Blog appears on /blogs page and homepage (if featured)
```

#### Managing Enquiries
```
1. Admin sees new enquiry notification
2. Opens "Enquiries" section — table view with filters
3. Clicks on an enquiry to view details
4. Updates status: New → Contacted → Converted/Closed
5. Adds internal notes for team reference
```

### Admin Panel Pages Needed

| Page | API Used |
|------|----------|
| Dashboard | GET /enquiries (count), GET /reviews (count) |
| Countries → List | GET /countries?status=all |
| Countries → Add/Edit | POST/PUT /countries, POST /media/upload |
| Universities → List | GET /universities?status=all |
| Universities → Add/Edit | POST/PUT /universities, GET /countries (dropdown), POST /media/upload |
| Counsellors → List | GET /counsellors?status=all |
| Counsellors → Add/Edit | POST/PUT /counsellors, POST /media/upload |
| Reviews → List | GET /reviews?status=all |
| Reviews → Add/Edit | POST/PUT /reviews |
| Blogs → List | GET /blogs?status=all |
| Blogs → Add/Edit | POST/PUT /blogs, GET /blog-categories, POST /media/upload |
| Blog Categories | GET/POST/PUT/DELETE /blog-categories |
| Enquiries → List | GET /enquiries |
| Enquiries → Detail | GET/PUT /enquiries/:id |
| Media Library | POST /media/upload (optional: GET /media for browsing) |

---

## Quick Reference — All 35 Endpoints

| # | Method | Endpoint | Auth | Used By |
|---|:------:|----------|:----:|---------|
| 1 | POST | `/auth/login` | No | Admin |
| 2 | POST | `/auth/refresh` | Yes | Admin |
| 3 | POST | `/auth/logout` | Yes | Admin |
| 4 | GET | `/countries` | No | Frontend + Admin |
| 5 | GET | `/countries/:slug` | No | Frontend + Admin |
| 6 | POST | `/countries` | Yes | Admin |
| 7 | PUT | `/countries/:id` | Yes | Admin |
| 8 | DELETE | `/countries/:id` | Yes | Admin |
| 9 | PUT | `/countries/reorder` | Yes | Admin |
| 10 | GET | `/universities` | No | Frontend + Admin |
| 11 | GET | `/universities/:slug` | No | Frontend + Admin |
| 12 | POST | `/universities` | Yes | Admin |
| 13 | PUT | `/universities/:id` | Yes | Admin |
| 14 | DELETE | `/universities/:id` | Yes | Admin |
| 15 | GET | `/counsellors` | No | Frontend + Admin |
| 16 | POST | `/counsellors` | Yes | Admin |
| 17 | PUT | `/counsellors/:id` | Yes | Admin |
| 18 | DELETE | `/counsellors/:id` | Yes | Admin |
| 19 | GET | `/reviews` | No | Frontend + Admin |
| 20 | POST | `/reviews` | Yes | Admin |
| 21 | PUT | `/reviews/:id` | Yes | Admin |
| 22 | DELETE | `/reviews/:id` | Yes | Admin |
| 23 | PUT | `/reviews/meta` | Yes | Admin |
| 24 | GET | `/blogs` | No | Frontend + Admin |
| 25 | GET | `/blogs/:slug` | No | Frontend + Admin |
| 26 | POST | `/blogs` | Yes | Admin |
| 27 | PUT | `/blogs/:id` | Yes | Admin |
| 28 | DELETE | `/blogs/:id` | Yes | Admin |
| 29 | GET | `/blog-categories` | No | Frontend + Admin |
| 30 | POST | `/blog-categories` | Yes | Admin |
| 31 | PUT | `/blog-categories/:id` | Yes | Admin |
| 32 | DELETE | `/blog-categories/:id` | Yes | Admin |
| 33 | POST | `/enquiries` | No | Frontend |
| 34 | GET | `/enquiries` | Yes | Admin |
| 35 | PUT | `/enquiries/:id` | Yes | Admin |
| 36 | POST | `/media/upload` | Yes | Admin |

---

*Document generated for AMW Career Point — Frontend + Admin Panel API integration.*
