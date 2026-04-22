# AMW Career Point — Backend API Specification

> **For Backend Developer** — This document describes every API endpoint, request/response shape, validation rule, and data model the frontend expects. Build your backend to match this exactly.

**Base URL**: `http://localhost:5000/api/v1`

---

## Table of Contents

1. [Standard Response Format](#1-standard-response-format)
2. [Authentication](#2-authentication)
3. [Countries](#3-countries)
4. [Universities](#4-universities)
5. [Counsellors](#5-counsellors)
6. [Reviews](#6-reviews)
7. [Blogs](#7-blogs)
8. [Blog Categories](#8-blog-categories)
9. [Enquiries](#9-enquiries)
10. [FAQs](#10-faqs)
11. [Media Upload](#11-media-upload)
12. [Pagination & Sorting](#12-pagination--sorting)
13. [CORS Configuration](#13-cors-configuration)
14. [All Endpoints Summary](#14-all-endpoints-summary)
15. [Database Models (Mongoose Schemas)](#15-database-models-mongoose-schemas)

---

## 1. Standard Response Format

### Success Response

```json
{
  "data": { ... },
  "total": 50,
  "page": 1,
  "limit": 10
}
```

- `data` — Single object (for get-by-id/slug, create, update) OR array of objects (for list endpoints)
- `total` — Total number of records (only for list/paginated endpoints)
- `page` — Current page number (only for list endpoints)
- `limit` — Items per page (only for list endpoints)

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name is required",
    "details": [
      { "field": "name", "message": "Name is required" },
      { "field": "email", "message": "Must be a valid email" }
    ]
  }
}
```

- `error.code` — Machine-readable code: `VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`, `FORBIDDEN`, `INTERNAL_ERROR`
- `error.message` — Human-readable message (displayed directly to user in admin panel)
- `error.details` — Optional array of field-level errors

### HTTP Status Codes

| Code | When to use |
|------|-------------|
| `200` | Successful GET, PUT, DELETE |
| `201` | Successful POST (resource created) |
| `400` | Validation error, bad request |
| `401` | Missing/invalid/expired token (frontend auto-redirects to login) |
| `403` | Valid token but insufficient permissions |
| `404` | Resource not found |
| `500` | Server error |

---

## 2. Authentication

### 2.1 Login

```
POST /auth/login
Content-Type: application/json
Auth: None
```

**Request Body:**
```json
{
  "email": "admin@amwcareerpoint.com",
  "password": "Admin@123456"
}
```

**Validation:**
| Field | Rule |
|-------|------|
| `email` | Required, must be valid email format |
| `password` | Required, minimum 6 characters |

**Success Response (200):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "664a1b2c3d4e5f6a7b8c9d0e",
      "name": "Admin",
      "email": "admin@amwcareerpoint.com",
      "role": "admin"
    }
  }
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid email or password"
  }
}
```

> **Important:** The frontend stores `token`, `refreshToken`, and `user` in localStorage. The `token` is sent as `Authorization: Bearer <token>` on every admin API call.

---

### 2.2 Logout

```
POST /auth/logout
Auth: Bearer <token>
```

**Request Body:** None

**Response (200):**
```json
{
  "data": { "message": "Logged out successfully" }
}
```

> Backend should invalidate/blacklist the token if applicable. Frontend ignores errors on this call.

---

### 2.3 Refresh Token

```
POST /auth/refresh
Content-Type: application/json
Auth: None
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "data": {
    "token": "new-jwt-access-token"
  }
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired refresh token"
  }
}
```

---

## 3. Countries

### 3.1 Get All Countries (Public)

```
GET /countries
Auth: None
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `sort` | string | `-sortOrder` | Sort field (prefix `-` for descending) |
| `status` | string | `active` | Filter: `active`, `inactive`, or `all` |

**Response (200):**
```json
{
  "data": [
    {
      "_id": "664a1b2c3d4e5f6a7b8c9d0e",
      "name": "Russia",
      "slug": "russia",
      "tagline": "Study MBBS in Russia at affordable cost",
      "description": "Russia is one of the top destinations for...",
      "flagImage": "https://storage.example.com/countries/russia-flag.png",
      "heroImage": "https://storage.example.com/countries/russia-hero.jpg",
      "status": "active",
      "sortOrder": 1,
      "highlights": [
        "WHO & NMC recognized universities",
        "Low tuition fees",
        "No donation required"
      ],
      "features": [
        {
          "icon": "🎓",
          "title": "Top Universities",
          "description": "Russia has some of the oldest medical universities"
        }
      ],
      "eligibility": [
        "Must have 50% in PCB in 12th",
        "NEET qualified",
        "Age 17+ as of Dec 31 of admission year"
      ],
      "admissionProcess": [
        { "step": 1, "title": "Apply Online", "description": "Fill the enquiry form with your details" },
        { "step": 2, "title": "Document Verification", "description": "Submit your 10th, 12th marksheets and NEET scorecard" },
        { "step": 3, "title": "Get Admission Letter", "description": "Receive official invitation letter from university" }
      ],
      "seo": {
        "metaTitle": "Study MBBS in Russia 2025 | AMW Career Point",
        "metaDescription": "Complete guide to studying MBBS in Russia...",
        "keywords": "mbbs in russia, study in russia, russia medical university"
      },
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-02-20T14:45:00.000Z"
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 10
}
```

---

### 3.2 Get Country by Slug (Public)

```
GET /countries/:slug
Auth: None
```

**Example:** `GET /countries/russia`

**Response (200):**
```json
{
  "data": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "name": "Russia",
    "slug": "russia",
    "tagline": "...",
    "description": "...",
    "flagImage": "...",
    "heroImage": "...",
    "status": "active",
    "sortOrder": 1,
    "highlights": ["..."],
    "features": [{ "icon": "...", "title": "...", "description": "..." }],
    "eligibility": ["..."],
    "admissionProcess": [{ "step": 1, "title": "...", "description": "..." }],
    "seo": { "metaTitle": "...", "metaDescription": "...", "keywords": "..." },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Error (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Country not found"
  }
}
```

---

### 3.3 Create Country (Admin)

```
POST /countries
Content-Type: application/json
Auth: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Russia",
  "slug": "russia",
  "tagline": "Study MBBS in Russia",
  "description": "Detailed description here...",
  "flagImage": "https://storage.example.com/countries/russia-flag.png",
  "heroImage": "https://storage.example.com/countries/russia-hero.jpg",
  "status": "active",
  "sortOrder": 1,
  "highlights": ["Point 1", "Point 2"],
  "features": [
    { "icon": "🎓", "title": "Feature Title", "description": "Feature description" }
  ],
  "eligibility": ["Requirement 1", "Requirement 2"],
  "admissionProcess": [
    { "step": 1, "title": "Step Title", "description": "Step description" }
  ],
  "seo": {
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Description",
    "keywords": "keyword1, keyword2"
  }
}
```

**Validation Rules:**
| Field | Type | Rule |
|-------|------|------|
| `name` | String | **Required**, unique |
| `slug` | String | Auto-generate from `name` if not provided (lowercase, hyphens, no special chars). **Must be unique**. |
| `tagline` | String | Optional |
| `description` | String | Optional |
| `flagImage` | String | Optional, URL |
| `heroImage` | String | Optional, URL |
| `status` | String | Enum: `active`, `inactive`. Default: `active` |
| `sortOrder` | Number | Default: `0` |
| `highlights` | [String] | Optional, array of strings. Filter out empty strings before saving. |
| `features` | [Object] | Optional. Each: `{ icon: String, title: String, description: String }` |
| `eligibility` | [String] | Optional, array of strings. Filter out empty strings. |
| `admissionProcess` | [Object] | Optional. Each: `{ step: Number, title: String, description: String }` |
| `seo.metaTitle` | String | Optional |
| `seo.metaDescription` | String | Optional |
| `seo.keywords` | String | Optional |

**Success Response (201):**
```json
{
  "data": { "_id": "...", "name": "Russia", "slug": "russia", ... }
}
```

---

### 3.4 Update Country (Admin)

```
PUT /countries/:id
Content-Type: application/json
Auth: Bearer <token>
```

**Request Body:** Same fields as create (partial update — only send changed fields).

**Success Response (200):**
```json
{
  "data": { "_id": "...", "name": "Russia", "slug": "russia", ... }
}
```

---

### 3.5 Delete Country (Admin)

```
DELETE /countries/:id
Auth: Bearer <token>
```

**Request Body:** None

**Success Response (200):**
```json
{
  "data": { "message": "Country deleted successfully" }
}
```

---

### 3.6 Reorder Countries (Admin)

```
PUT /countries/reorder
Content-Type: application/json
Auth: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    { "id": "664a1b2c3d4e5f6a7b8c9d01", "sortOrder": 1 },
    { "id": "664a1b2c3d4e5f6a7b8c9d02", "sortOrder": 2 },
    { "id": "664a1b2c3d4e5f6a7b8c9d03", "sortOrder": 3 }
  ]
}
```

**Success Response (200):**
```json
{
  "data": { "message": "Countries reordered successfully" }
}
```

---

## 4. Universities

### 4.1 Get All Universities (Public)

```
GET /universities
Auth: None
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `sort` | string | `-createdAt` | Sort field |
| `status` | string | `active` | `active`, `inactive`, or `all` |
| `country` | string | — | Filter by country ID or slug |
| `featured` | boolean | — | Filter featured only |

**Response (200):**
```json
{
  "data": [
    {
      "_id": "664b2c3d4e5f6a7b8c9d0e1f",
      "name": "Kazan Federal University",
      "slug": "kazan-federal-university",
      "country": {
        "_id": "664a1b2c3d4e5f6a7b8c9d0e",
        "name": "Russia",
        "slug": "russia",
        "flagImage": "https://storage.example.com/countries/russia-flag.png"
      },
      "description": "Kazan Federal University is one of the oldest...",
      "logo": "https://storage.example.com/universities/kazan-logo.png",
      "heroImage": "https://storage.example.com/universities/kazan-hero.jpg",
      "gallery": [
        "https://storage.example.com/universities/kazan-1.jpg",
        "https://storage.example.com/universities/kazan-2.jpg"
      ],
      "establishedYear": "1804",
      "ranking": "Top 50 in Russia",
      "accreditation": "NMC, WHO, ECFMG approved",
      "courseDuration": "6 years (including internship)",
      "annualFees": "$4,500 - $5,000",
      "medium": "English",
      "hostelFees": "$800 - $1,200/year",
      "eligibility": "50% in PCB, NEET qualified",
      "recognition": ["WHO", "NMC", "ECFMG", "FAIMER"],
      "status": "active",
      "featured": true,
      "highlights": [
        { "label": "Tuition Fee", "value": "$4,500/year" },
        { "label": "Duration", "value": "6 Years" },
        { "label": "Medium", "value": "English" }
      ],
      "faqs": [
        {
          "question": "Is Kazan Federal University NMC approved?",
          "answer": "Yes, Kazan Federal University is approved by NMC (National Medical Commission)."
        }
      ],
      "seo": {
        "metaTitle": "Kazan Federal University | MBBS in Russia",
        "metaDescription": "Study MBBS at Kazan Federal University...",
        "keywords": "kazan federal university, mbbs in kazan"
      },
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-03-10T08:30:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

> **CRITICAL**: The `country` field MUST be populated (expanded) as an object `{ _id, name, slug, flagImage }` — NOT just the raw ObjectId string. The admin panel reads `country.name` to display the country name in tables and forms.

---

### 4.2 Get University by Slug (Public)

```
GET /universities/:slug
Auth: None
```

**Response:** Same structure as single item in list above.

---

### 4.3 Create University (Admin)

```
POST /universities
Content-Type: application/json
Auth: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Kazan Federal University",
  "slug": "kazan-federal-university",
  "country": "664a1b2c3d4e5f6a7b8c9d0e",
  "description": "Detailed description...",
  "logo": "https://storage.example.com/universities/kazan-logo.png",
  "heroImage": "https://storage.example.com/universities/kazan-hero.jpg",
  "gallery": ["https://storage.example.com/universities/kazan-1.jpg"],
  "establishedYear": "1804",
  "ranking": "Top 50 in Russia",
  "accreditation": "NMC, WHO, ECFMG approved",
  "courseDuration": "6 years",
  "annualFees": "$4,500 - $5,000",
  "medium": "English",
  "hostelFees": "$800 - $1,200/year",
  "eligibility": "50% in PCB, NEET qualified",
  "recognition": ["WHO", "NMC", "ECFMG"],
  "status": "active",
  "featured": false,
  "highlights": [{ "label": "Fee", "value": "$4500/yr" }],
  "faqs": [{ "question": "Is it NMC approved?", "answer": "Yes." }],
  "seo": { "metaTitle": "...", "metaDescription": "...", "keywords": "..." }
}
```

**Validation Rules:**
| Field | Type | Rule |
|-------|------|------|
| `name` | String | **Required** |
| `slug` | String | Auto-generate from `name` if not provided. **Must be unique**. |
| `country` | ObjectId | **Required**, must reference a valid Country `_id` |
| `description` | String | Optional |
| `logo` | String | Optional, URL |
| `heroImage` | String | Optional, URL |
| `gallery` | [String] | Optional, array of URLs. Filter out empty strings. |
| `establishedYear` | String | Optional |
| `ranking` | String | Optional |
| `accreditation` | String | Optional |
| `courseDuration` | String | Optional |
| `annualFees` | String | Optional |
| `medium` | String | Optional |
| `hostelFees` | String | Optional |
| `eligibility` | String | Optional (plain text, NOT array) |
| `recognition` | [String] | Optional, array of strings. Filter out empty strings. |
| `status` | String | Enum: `active`, `inactive`. Default: `active` |
| `featured` | Boolean | Default: `false` |
| `highlights` | [Object] | Optional. Each: `{ label: String, value: String }` |
| `faqs` | [Object] | Optional. Each: `{ question: String, answer: String }` |
| `seo.metaTitle` | String | Optional |
| `seo.metaDescription` | String | Optional |
| `seo.keywords` | String | Optional |

**Success Response (201):**
```json
{
  "data": { "_id": "...", "name": "Kazan Federal University", ... }
}
```

---

### 4.4 Update University (Admin)

```
PUT /universities/:id
Content-Type: application/json
Auth: Bearer <token>
```

Same body as create (partial update allowed).

---

### 4.5 Delete University (Admin)

```
DELETE /universities/:id
Auth: Bearer <token>
```

**Response (200):**
```json
{
  "data": { "message": "University deleted successfully" }
}
```

---

## 5. Counsellors

### 5.1 Get All Counsellors (Public)

```
GET /counsellors
Auth: None
```

**Query Parameters:** `page`, `limit`, `sort`, `status` (same pattern as above)

**Response (200):**
```json
{
  "data": [
    {
      "_id": "664c3d4e5f6a7b8c9d0e1f2a",
      "name": "Dr. Priya Sharma",
      "role": "Senior Education Counsellor",
      "avatar": "https://storage.example.com/counsellors/priya.jpg",
      "experience": "8+ years",
      "rating": 4.8,
      "bio": "Dr. Priya has been helping students...",
      "specializations": ["Russia", "Uzbekistan", "FMGE Preparation"],
      "languages": ["English", "Hindi"],
      "status": "active",
      "sortOrder": 1,
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
    }
  ],
  "total": 6,
  "page": 1,
  "limit": 10
}
```

---

### 5.2 Create Counsellor (Admin)

```
POST /counsellors
Content-Type: application/json
Auth: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Dr. Priya Sharma",
  "role": "Senior Education Counsellor",
  "avatar": "https://storage.example.com/counsellors/priya.jpg",
  "experience": "8+ years",
  "rating": 4.8,
  "bio": "Detailed bio here...",
  "specializations": ["Russia", "Uzbekistan"],
  "languages": ["English", "Hindi"],
  "status": "active",
  "sortOrder": 1
}
```

**Validation Rules:**
| Field | Type | Rule |
|-------|------|------|
| `name` | String | **Required** |
| `role` | String | **Required** |
| `avatar` | String | Optional, URL |
| `experience` | String | Optional (e.g., "8+ years") |
| `rating` | Number | Optional, min: `0`, max: `5`, step: `0.1`. Default: `5` |
| `bio` | String | Optional |
| `specializations` | [String] | Optional, array of strings. Filter out empty strings. |
| `languages` | [String] | Optional, array of strings. Filter out empty strings. |
| `status` | String | Enum: `active`, `inactive`. Default: `active` |
| `sortOrder` | Number | Default: `0` |

---

### 5.3 Update Counsellor (Admin)

```
PUT /counsellors/:id
Content-Type: application/json
Auth: Bearer <token>
```

Same body as create (partial update).

---

### 5.4 Delete Counsellor (Admin)

```
DELETE /counsellors/:id
Auth: Bearer <token>
```

---

## 6. Reviews

### 6.1 Get All Reviews (Public)

```
GET /reviews
Auth: None
```

**Query Parameters:** `page`, `limit`, `sort`, `status` (same pattern)

**Response (200):**
```json
{
  "data": [
    {
      "_id": "664d4e5f6a7b8c9d0e1f2a3b",
      "studentName": "Rahul Kumar",
      "university": "Kazan Federal University",
      "country": "Russia",
      "avatar": "https://storage.example.com/reviews/rahul.jpg",
      "rating": 5,
      "reviewText": "My experience at Kazan Federal University has been amazing...",
      "videoUrl": "https://www.youtube.com/watch?v=abc123",
      "status": "approved",
      "featured": true,
      "createdAt": "2025-02-15T10:00:00.000Z",
      "updatedAt": "2025-02-15T10:00:00.000Z"
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10
}
```

---

### 6.2 Create Review (Admin)

```
POST /reviews
Content-Type: application/json
Auth: Bearer <token>
```

**Request Body:**
```json
{
  "studentName": "Rahul Kumar",
  "university": "Kazan Federal University",
  "country": "Russia",
  "avatar": "https://storage.example.com/reviews/rahul.jpg",
  "rating": 5,
  "reviewText": "Amazing experience...",
  "videoUrl": "https://www.youtube.com/watch?v=abc123",
  "status": "approved",
  "featured": false
}
```

**Validation Rules:**
| Field | Type | Rule |
|-------|------|------|
| `studentName` | String | **Required** |
| `university` | String | Optional (plain text name, NOT ObjectId) |
| `country` | String | Optional (plain text name, NOT ObjectId) |
| `avatar` | String | Optional, URL |
| `rating` | Number | **Required**, min: `1`, max: `5`, integer |
| `reviewText` | String | **Required** |
| `videoUrl` | String | Optional (YouTube URL) |
| `status` | String | Enum: `approved`, `pending`, `rejected`. Default: `approved` |
| `featured` | Boolean | Default: `false` |

---

### 6.3 Update Review (Admin)

```
PUT /reviews/:id
Content-Type: application/json
Auth: Bearer <token>
```

---

### 6.4 Delete Review (Admin)

```
DELETE /reviews/:id
Auth: Bearer <token>
```

---

### 6.5 Update Review Metadata (Admin)

```
PUT /reviews/meta
Content-Type: application/json
Auth: Bearer <token>
```

**Request Body:**
```json
{
  "averageRating": 4.5,
  "totalReviews": 120
}
```

> This is for storing aggregate review stats (shown on homepage). Can be stored in a separate "settings" or "meta" collection.

---

## 7. Blogs

### 7.1 Get All Blogs (Public)

```
GET /blogs
Auth: None
```

**Query Parameters:** `page`, `limit`, `sort`, `status`, `category`, `featured`

**Response (200):**
```json
{
  "data": [
    {
      "_id": "664e5f6a7b8c9d0e1f2a3b4c",
      "title": "Top 10 Medical Universities in Russia 2025",
      "slug": "top-10-medical-universities-russia-2025",
      "content": "<h2>Introduction</h2><p>Russia has been a top destination...</p>",
      "excerpt": "Discover the best medical universities in Russia...",
      "coverImage": "https://storage.example.com/blogs/russia-top-10.jpg",
      "category": {
        "_id": "664f6a7b8c9d0e1f2a3b4c5d",
        "name": "Study Abroad"
      },
      "author": "AMW Career Point",
      "tags": ["russia", "mbbs", "medical universities", "2025"],
      "status": "published",
      "featured": true,
      "seo": {
        "metaTitle": "Top 10 Medical Universities in Russia 2025",
        "metaDescription": "Complete ranking and guide...",
        "keywords": "best medical universities russia, mbbs russia 2025"
      },
      "createdAt": "2025-03-01T10:00:00.000Z",
      "updatedAt": "2025-03-05T14:30:00.000Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10
}
```

> **CRITICAL**: The `category` field MUST be populated (expanded) as an object `{ _id, name }` — NOT just the raw ObjectId. The admin panel reads `category.name` for display and `category._id` for the dropdown.

---

### 7.2 Get Blog by Slug (Public)

```
GET /blogs/:slug
Auth: None
```

**Response:** Same structure as single item from list.

---

### 7.3 Create Blog (Admin)

```
POST /blogs
Content-Type: application/json
Auth: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Top 10 Medical Universities in Russia 2025",
  "slug": "top-10-medical-universities-russia-2025",
  "content": "<h2>Introduction</h2><p>Russia has been...</p>",
  "excerpt": "Discover the best medical universities...",
  "coverImage": "https://storage.example.com/blogs/russia-top-10.jpg",
  "category": "664f6a7b8c9d0e1f2a3b4c5d",
  "author": "AMW Career Point",
  "tags": ["russia", "mbbs", "2025"],
  "status": "published",
  "featured": false,
  "seo": {
    "metaTitle": "...",
    "metaDescription": "...",
    "keywords": "..."
  }
}
```

**Validation Rules:**
| Field | Type | Rule |
|-------|------|------|
| `title` | String | **Required** |
| `slug` | String | Auto-generate from `title` if not provided. **Must be unique**. |
| `content` | String | **Required** (supports HTML content) |
| `excerpt` | String | Optional |
| `coverImage` | String | Optional, URL |
| `category` | ObjectId | Optional, must reference a valid BlogCategory `_id` |
| `author` | String | Optional |
| `tags` | [String] | Optional, array of strings |
| `status` | String | Enum: `published`, `draft`. Default: `published` |
| `featured` | Boolean | Default: `false` |
| `seo.metaTitle` | String | Optional |
| `seo.metaDescription` | String | Optional |
| `seo.keywords` | String | Optional |

---

### 7.4 Update Blog (Admin)

```
PUT /blogs/:id
Content-Type: application/json
Auth: Bearer <token>
```

---

### 7.5 Delete Blog (Admin)

```
DELETE /blogs/:id
Auth: Bearer <token>
```

---

## 8. Blog Categories

### 8.1 Get All Blog Categories (Public)

```
GET /blog-categories
Auth: None
```

**Response (200):**
```json
{
  "data": [
    { "_id": "664f6a7b8c9d0e1f2a3b4c5d", "name": "Study Abroad" },
    { "_id": "664f6a7b8c9d0e1f2a3b4c5e", "name": "FMGE Preparation" },
    { "_id": "664f6a7b8c9d0e1f2a3b4c5f", "name": "University Reviews" },
    { "_id": "664f6a7b8c9d0e1f2a3b4c60", "name": "Student Life" }
  ]
}
```

> Note: No pagination needed for categories — just return all of them.

---

### 8.2 Create Blog Category (Admin)

```
POST /blog-categories
Content-Type: application/json
Auth: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Study Abroad"
}
```

**Validation:**
| Field | Type | Rule |
|-------|------|------|
| `name` | String | **Required**, unique |

---

### 8.3 Update Blog Category (Admin)

```
PUT /blog-categories/:id
Content-Type: application/json
Auth: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Category Name"
}
```

---

### 8.4 Delete Blog Category (Admin)

```
DELETE /blog-categories/:id
Auth: Bearer <token>
```

---

## 9. Enquiries

### 9.1 Submit Enquiry (Public — from website contact/counselling form)

```
POST /enquiries
Content-Type: application/json
Auth: None
```

**Request Body:**
```json
{
  "name": "Amit Sharma",
  "email": "amit@example.com",
  "phone": "+91 9876543210",
  "interestedCountry": "Russia",
  "source": "homepage-form",
  "message": "I want to study MBBS in Russia. Please guide me."
}
```

**Validation Rules:**
| Field | Type | Rule |
|-------|------|------|
| `name` | String | **Required** |
| `email` | String | **Required**, valid email format |
| `phone` | String | **Required** |
| `interestedCountry` | String | Optional |
| `source` | String | Optional (e.g., `homepage-form`, `contact-page`, `country-page`) |
| `message` | String | Optional |

**Success Response (201):**
```json
{
  "data": {
    "_id": "...",
    "name": "Amit Sharma",
    "status": "new",
    ...
  }
}
```

> Backend should set `status: "new"` automatically on creation.

---

### 9.2 Get All Enquiries (Admin)

```
GET /enquiries
Auth: Bearer <token>
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 15 | Items per page |
| `sort` | string | `-createdAt` | Sort field |
| `status` | string | — | Filter: `new`, `contacted`, `converted`, `closed` (omit to get all) |

**Response (200):**
```json
{
  "data": [
    {
      "_id": "664g7b8c9d0e1f2a3b4c5d6e",
      "name": "Amit Sharma",
      "email": "amit@example.com",
      "phone": "+91 9876543210",
      "interestedCountry": "Russia",
      "source": "homepage-form",
      "message": "I want to study MBBS in Russia. Please guide me.",
      "status": "new",
      "notes": "",
      "createdAt": "2025-03-20T10:30:00.000Z",
      "updatedAt": "2025-03-20T10:30:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 15
}
```

---

### 9.3 Update Enquiry (Admin)

```
PUT /enquiries/:id
Content-Type: application/json
Auth: Bearer <token>
```

**Request Body (partial update):**
```json
{
  "status": "contacted"
}
```
OR
```json
{
  "notes": "Called on 20th March. Student interested in Russia. Follow up next week."
}
```

**Validation:**
| Field | Type | Rule |
|-------|------|------|
| `status` | String | Enum: `new`, `contacted`, `converted`, `closed` |
| `notes` | String | Optional, free text |

> Only `status` and `notes` are updatable. Other enquiry fields (name, email, etc.) are read-only after creation.

---

## 10. FAQs

Page-level FAQs managed independently from university-embedded FAQs. University FAQs stay embedded in the university model.

### 10.1 List FAQs (Public)

```
GET /faqs?page=home
GET /faqs?page=country&pageSlug=russia
GET /faqs?page=contact
GET /faqs?page=general
Auth: None
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | String | Required. Enum: `home`, `country`, `contact`, `general` |
| `pageSlug` | String | Optional. Used when `page=country` to scope FAQs to a specific country slug |
| `status` | String | Optional. `all` returns active + inactive (admin use) |

**Response (200):**

```json
{
  "data": [
    {
      "_id": "665abc...",
      "question": "Are foreign MBBS degrees valid in India?",
      "answer": "Yes, MBBS degrees from NMC-approved universities are valid...",
      "page": "home",
      "pageSlug": null,
      "order": 1,
      "isActive": true,
      "createdAt": "2024-06-01T00:00:00.000Z",
      "updatedAt": "2024-06-01T00:00:00.000Z"
    }
  ]
}
```

### 10.2 Get Single FAQ (Public)

```
GET /faqs/:id
Auth: None
```

**Response (200):**

```json
{
  "data": {
    "_id": "665abc...",
    "question": "Are foreign MBBS degrees valid in India?",
    "answer": "Yes, MBBS degrees from NMC-approved universities...",
    "page": "home",
    "pageSlug": null,
    "order": 1,
    "isActive": true
  }
}
```

### 10.3 Create FAQ (Admin)

```
POST /faqs
Content-Type: application/json
Auth: Bearer <token>
```

**Body:**

```json
{
  "question": "Is NEET mandatory?",
  "answer": "Yes, NEET qualification is mandatory for Indian students.",
  "page": "contact",
  "pageSlug": null,
  "order": 1
}
```

| Field | Type | Validation |
|-------|------|------------|
| `question` | String | Required, max 300 chars |
| `answer` | String | Required, max 2000 chars |
| `page` | String | Required. Enum: `home`, `country`, `contact`, `general` |
| `pageSlug` | String | Optional. Required when `page=country` |
| `order` | Number | Optional, default 0 |
| `isActive` | Boolean | Optional, default `true` |

### 10.4 Update FAQ (Admin)

```
PUT /faqs/:id
Content-Type: application/json
Auth: Bearer <token>
```

Same body as create. All fields optional (partial update).

### 10.5 Delete FAQ (Admin)

```
DELETE /faqs/:id
Auth: Bearer <token>
```

### 10.6 Bulk Reorder FAQs (Admin)

```
PUT /faqs/reorder
Content-Type: application/json
Auth: Bearer <token>
```

**Body:**

```json
{
  "items": [
    { "id": "665abc...", "order": 1 },
    { "id": "665def...", "order": 2 }
  ]
}
```

---

## 11. Media Upload

### 10.1 Upload Image

```
POST /media/upload
Content-Type: multipart/form-data
Auth: Bearer <token>
```

**Form Data Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | **Required**. The image file to upload |
| `folder` | String | **Required**. Folder name for organization |

**Accepted folder values:** `countries`, `universities`, `counsellors`, `reviews`, `blogs`

**File Validation:**
| Rule | Value |
|------|-------|
| Max file size | 5 MB |
| Accepted types | `image/jpeg`, `image/png`, `image/webp` |
| Accepted extensions | `.jpg`, `.jpeg`, `.png`, `.webp` |

**Success Response (200):**
```json
{
  "data": {
    "url": "https://your-storage-bucket.s3.amazonaws.com/countries/russia-flag-1711234567890.png"
  }
}
```

**Error Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "File size exceeds 5MB limit"
  }
}
```

> **Storage Options:** You can use AWS S3, Cloudinary, Google Cloud Storage, or even local disk storage. Just return the public URL of the uploaded image in `data.url`. The frontend stores this URL string in the form fields (e.g., `flagImage`, `logo`, `avatar`, `coverImage`).

---

## 12. Pagination & Sorting

All list endpoints (`GET /countries`, `GET /universities`, etc.) must support these query parameters:

```
?page=1          → Page number (default: 1)
&limit=10        → Items per page (default: 10)
&sort=-createdAt → Sort field. Prefix with - for descending order.
&status=all      → Filter by status
```

**Sort field examples:**
- `-createdAt` → newest first (most common)
- `createdAt` → oldest first
- `-sortOrder` → by sort order descending
- `name` → alphabetical by name

**Status filter logic:**
- `status=active` → only active items (default for public/frontend calls)
- `status=inactive` → only inactive items
- `status=all` → return ALL items regardless of status (used by admin panel)
- No status param → return only `active` items

**Response must always include:**
```json
{
  "data": [...],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

Where `total` is the total count of ALL matching records (not just current page), so the frontend can calculate total pages.

---

## 13. CORS Configuration

```javascript
// Express.js example
const cors = require('cors');

app.use(cors({
  origin: '*',  // Or specific: ['http://localhost:3000', 'https://amwcareerpoint.com']
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

**Required headers in response:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 14. All Endpoints Summary

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | POST | `/auth/login` | No | Admin login |
| 2 | POST | `/auth/logout` | Yes | Admin logout |
| 3 | POST | `/auth/refresh` | No | Refresh JWT token |
| 4 | GET | `/countries` | No | List countries |
| 5 | GET | `/countries/:slug` | No | Get country by slug |
| 6 | POST | `/countries` | Yes | Create country |
| 7 | PUT | `/countries/:id` | Yes | Update country |
| 8 | DELETE | `/countries/:id` | Yes | Delete country |
| 9 | PUT | `/countries/reorder` | Yes | Reorder countries |
| 10 | GET | `/universities` | No | List universities |
| 11 | GET | `/universities/:slug` | No | Get university by slug |
| 12 | POST | `/universities` | Yes | Create university |
| 13 | PUT | `/universities/:id` | Yes | Update university |
| 14 | DELETE | `/universities/:id` | Yes | Delete university |
| 15 | GET | `/counsellors` | No | List counsellors |
| 16 | POST | `/counsellors` | Yes | Create counsellor |
| 17 | PUT | `/counsellors/:id` | Yes | Update counsellor |
| 18 | DELETE | `/counsellors/:id` | Yes | Delete counsellor |
| 19 | GET | `/reviews` | No | List reviews |
| 20 | POST | `/reviews` | Yes | Create review |
| 21 | PUT | `/reviews/:id` | Yes | Update review |
| 22 | DELETE | `/reviews/:id` | Yes | Delete review |
| 23 | PUT | `/reviews/meta` | Yes | Update review metadata |
| 24 | GET | `/blogs` | No | List blogs |
| 25 | GET | `/blogs/:slug` | No | Get blog by slug |
| 26 | POST | `/blogs` | Yes | Create blog |
| 27 | PUT | `/blogs/:id` | Yes | Update blog |
| 28 | DELETE | `/blogs/:id` | Yes | Delete blog |
| 29 | GET | `/blog-categories` | No | List blog categories |
| 30 | POST | `/blog-categories` | Yes | Create blog category |
| 31 | PUT | `/blog-categories/:id` | Yes | Update blog category |
| 32 | DELETE | `/blog-categories/:id` | Yes | Delete blog category |
| 33 | POST | `/enquiries` | No | Submit enquiry (public form) |
| 34 | GET | `/enquiries` | Yes | List enquiries |
| 35 | PUT | `/enquiries/:id` | Yes | Update enquiry |
| 36 | GET | `/faqs` | No | List FAQs (filterable by page/pageSlug) |
| 37 | GET | `/faqs/:id` | No | Get single FAQ |
| 38 | POST | `/faqs` | Yes | Create FAQ |
| 39 | PUT | `/faqs/:id` | Yes | Update FAQ |
| 40 | DELETE | `/faqs/:id` | Yes | Delete FAQ |
| 41 | PUT | `/faqs/reorder` | Yes | Bulk reorder FAQs |
| 42 | POST | `/media/upload` | Yes | Upload image |

---

## 15. Database Models (Mongoose Schemas)

Here are the exact Mongoose schema definitions for reference:

### User (Admin)
```javascript
const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },  // bcrypt hashed
  role:     { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true });
```

### Country
```javascript
const CountrySchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  slug:        { type: String, required: true, unique: true },
  tagline:     { type: String, default: '' },
  description: { type: String, default: '' },
  flagImage:   { type: String, default: '' },
  heroImage:   { type: String, default: '' },
  status:      { type: String, enum: ['active', 'inactive'], default: 'active' },
  sortOrder:   { type: Number, default: 0 },
  highlights:  [{ type: String }],
  features:    [{
    icon:        { type: String, default: '' },
    title:       { type: String, default: '' },
    description: { type: String, default: '' },
  }],
  eligibility: [{ type: String }],
  admissionProcess: [{
    step:        { type: Number },
    title:       { type: String, default: '' },
    description: { type: String, default: '' },
  }],
  seo: {
    metaTitle:       { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords:        { type: String, default: '' },
  },
}, { timestamps: true });
```

### University
```javascript
const UniversitySchema = new mongoose.Schema({
  name:            { type: String, required: true },
  slug:            { type: String, required: true, unique: true },
  country:         { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  description:     { type: String, default: '' },
  logo:            { type: String, default: '' },
  heroImage:       { type: String, default: '' },
  gallery:         [{ type: String }],
  establishedYear: { type: String, default: '' },
  ranking:         { type: String, default: '' },
  accreditation:   { type: String, default: '' },
  courseDuration:  { type: String, default: '' },
  annualFees:      { type: String, default: '' },
  medium:          { type: String, default: '' },
  hostelFees:      { type: String, default: '' },
  eligibility:     { type: String, default: '' },
  recognition:     [{ type: String }],
  status:          { type: String, enum: ['active', 'inactive'], default: 'active' },
  featured:        { type: Boolean, default: false },
  highlights:      [{
    label: { type: String, default: '' },
    value: { type: String, default: '' },
  }],
  faqs: [{
    question: { type: String, default: '' },
    answer:   { type: String, default: '' },
  }],
  seo: {
    metaTitle:       { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords:        { type: String, default: '' },
  },
}, { timestamps: true });
```

### Counsellor
```javascript
const CounsellorSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  role:            { type: String, required: true },
  avatar:          { type: String, default: '' },
  experience:      { type: String, default: '' },
  rating:          { type: Number, default: 5, min: 0, max: 5 },
  bio:             { type: String, default: '' },
  specializations: [{ type: String }],
  languages:       [{ type: String }],
  status:          { type: String, enum: ['active', 'inactive'], default: 'active' },
  sortOrder:       { type: Number, default: 0 },
}, { timestamps: true });
```

### Review
```javascript
const ReviewSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  university:  { type: String, default: '' },
  country:     { type: String, default: '' },
  avatar:      { type: String, default: '' },
  rating:      { type: Number, required: true, min: 1, max: 5 },
  reviewText:  { type: String, required: true },
  videoUrl:    { type: String, default: '' },
  status:      { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
  featured:    { type: Boolean, default: false },
}, { timestamps: true });
```

### Blog
```javascript
const BlogSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  slug:       { type: String, required: true, unique: true },
  content:    { type: String, required: true },
  excerpt:    { type: String, default: '' },
  coverImage: { type: String, default: '' },
  category:   { type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory' },
  author:     { type: String, default: '' },
  tags:       [{ type: String }],
  status:     { type: String, enum: ['published', 'draft'], default: 'published' },
  featured:   { type: Boolean, default: false },
  seo: {
    metaTitle:       { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords:        { type: String, default: '' },
  },
}, { timestamps: true });
```

### BlogCategory
```javascript
const BlogCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });
```

### Enquiry
```javascript
const EnquirySchema = new mongoose.Schema({
  name:              { type: String, required: true },
  email:             { type: String, required: true },
  phone:             { type: String, required: true },
  interestedCountry: { type: String, default: '' },
  source:            { type: String, default: '' },
  message:           { type: String, default: '' },
  status:            { type: String, enum: ['new', 'contacted', 'converted', 'closed'], default: 'new' },
  notes:             { type: String, default: '' },
}, { timestamps: true });
```

### ReviewMeta (optional — for homepage stats)
```javascript
const ReviewMetaSchema = new mongoose.Schema({
  averageRating: { type: Number, default: 0 },
  totalReviews:  { type: Number, default: 0 },
}, { timestamps: true });
```

### FAQ
```javascript
const FaqSchema = new mongoose.Schema({
  question:  { type: String, required: true, maxlength: 300 },
  answer:    { type: String, required: true, maxlength: 2000 },
  page:      { type: String, enum: ['home', 'country', 'contact', 'general'], required: true },
  pageSlug:  { type: String, default: null },  // e.g. country slug — used when page=country
  order:     { type: Number, default: 0 },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });
```

> **Note:** University FAQs remain embedded inside the University model (`faqs: [{ question, answer }]`). This separate FAQ collection handles page-level FAQs for home, contact, country, and general pages.

---

## 15. Important Notes for Backend Developer

### Slug Generation
Auto-generate slugs from name/title fields:
```javascript
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .trim();
};
```

### Population (Mongoose `.populate()`)
These fields MUST be populated in GET responses:
- `University.country` → populate as `{ _id, name, slug, flagImage }`
- `Blog.category` → populate as `{ _id, name }`

### Empty Array Filtering
When receiving arrays (`highlights`, `features`, `eligibility`, etc.), filter out empty/blank entries before saving:
```javascript
// Example: filter empty strings from highlights
if (data.highlights) {
  data.highlights = data.highlights.filter(h => h && h.trim() !== '');
}
```

### Authentication Middleware
```javascript
// Verify JWT token on all admin routes
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token required' } });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }
};
```

### Seed Admin User
Create an initial admin user on first run:
```javascript
// seed.js
const admin = await User.findOne({ email: 'admin@amwcareerpoint.com' });
if (!admin) {
  await User.create({
    name: 'Admin',
    email: 'admin@amwcareerpoint.com',
    password: await bcrypt.hash('Admin@123456', 10),
    role: 'admin',
  });
  console.log('Admin user created');
}
```

### Environment Variables Needed
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/amwcareerpoint
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Storage (pick one)
# For AWS S3:
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_REGION=...

# For Cloudinary:
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

**Total: 36 API endpoints across 8 resource groups + 1 media upload endpoint.**

Give this document to your backend developer — if they build every endpoint to match these exact field names, response wrappers, and validation rules, the admin panel will work out of the box with zero frontend changes.
