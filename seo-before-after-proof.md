# AMW Career Point SEO Before/After Proof

Date: 2026-05-12

This report is based on Git history and local production-build verification, not manual claims.

## Comparison Range

Before baseline commit:

```text
589ebf838f32a74bec2d8ae2d5d83c2cb095cf6e - Fix admin dashboard count parsing
```

After/current deployed commit:

```text
120860ead93062253b28a7f12b5370aa7f6c13be - Add college routes and redirects
```

Command used:

```bash
git diff --shortstat 589ebf8..HEAD -- src/app src/components src/lib next.config.ts scripts package.json
```

Result:

```text
44 files changed, 1345 insertions(+), 842 deletions(-)
```

## Automated Before/After Evidence

Command used:

```bash
git grep -n "<pattern>" 589ebf8 -- src next.config.ts scripts package.json
git grep -n "<pattern>" HEAD -- src next.config.ts scripts package.json
```

| SEO / Feature Check | Before Count | After Count | Meaning |
|---|---:|---:|---|
| `homeJsonLd` | 0 | 2 | Home page JSON-LD schema graph added. |
| Home page `application/ld+json` | 0 | 1 | Home page now outputs structured data. |
| Home page `og-image.png` | 0 | 1 | Home page now has social sharing image metadata. |
| `clampSeoDescription` | 0 | 9 | Meta descriptions now have safe length/HTML handling. |
| `resolveCanonicalUrl` | 0 | 7 | Canonical URLs now validate and safely fallback. |
| `serializeJsonLd` | 0 | 11 | Schema output is escaped safely before rendering. |
| `validateSchemaMarkup` | 0 | 4 | Admin validates custom schema JSON before save. |
| `RichTextEditor` usage | 5 | 9 | Rich editor support expanded, including country/university descriptions. |
| `/college` public route references | 0 | 27 | New college SEO route and internal links added. |
| Redirect config `/universities` to `/college` | 0 | 2 | Old university URLs now permanently redirect to new college URLs. |

## What Was Added

### 1. Home Page Schema

Current evidence:

```text
src/app/(website)/page.tsx:23  homeJsonLd
src/app/(website)/page.tsx:27  Organization
src/app/(website)/page.tsx:34  WebSite
src/app/(website)/page.tsx:43  BreadcrumbList
src/app/(website)/page.tsx:68  FAQPage
src/app/(website)/page.tsx:219 application/ld+json
```

Proof before:

```text
Before home application/ld+json = 0
```

### 2. Home Page Social Preview Image

Current evidence:

```text
src/app/(website)/page.tsx:193 openGraph
src/app/(website)/page.tsx:199 /og-image.png
```

Proof before:

```text
Before home og-image = 0
```

### 3. Safer Canonical, Meta Description, and Schema Rendering

Current evidence:

```text
src/lib/utils.ts:93  clampSeoDescription
src/lib/utils.ts:101 serializeJsonLd
src/lib/utils.ts:258 resolveCanonicalUrl
```

Used on:

```text
src/app/(website)/blogs/[slug]/page.tsx
src/app/(website)/countries/[slug]/page.tsx
src/app/(website)/college/[slug]/page.tsx
```

### 4. Admin Schema Validation

Current evidence:

```text
src/lib/validation.ts:16  validateSchemaMarkup
src/lib/validation.ts:309 validateSchemaMarkup for blog
src/lib/validation.ts:375 validateSchemaMarkup for country
src/lib/validation.ts:409 validateSchemaMarkup for university
```

Meaning:

```text
Invalid custom JSON-LD schema is blocked in admin validation instead of silently breaking SEO output.
```

### 5. Country and University Rich Editor for Internal Linking

Current evidence:

```text
src/components/admin/CountryForm.tsx:670 RichTextEditor for country description
src/components/admin/UniversityForm.tsx:167 RichTextEditor for university description
```

Meaning:

```text
Admin can add formatted content and internal links directly inside country/university page descriptions.
```

### 6. New College Route, Sitemap, Canonical, and Redirects

Current evidence:

```text
src/app/(website)/college/page.tsx
src/app/(website)/college/[slug]/page.tsx
src/app/sitemap.ts:20 /college
src/app/sitemap.ts:43 /college/${slug}
src/app/(website)/college/[slug]/page.tsx:42 canonical fallback /college/${slug}
```

Redirect evidence:

```text
next.config.ts:7  source: /universities
next.config.ts:8  destination: /college
next.config.ts:12 source: /universities/:slug
next.config.ts:13 destination: /college/:slug
```

Production-mode local HTTP verification:

```text
GET /universities
HTTP/1.1 308 Permanent Redirect
location: /college

GET /universities/andijan-state-medical-university-andijan-uzbekistan
HTTP/1.1 308 Permanent Redirect
location: /college/andijan-state-medical-university-andijan-uzbekistan

GET /universities?country=Uzbekistan
HTTP/1.1 308 Permanent Redirect
location: /college?country=Uzbekistan
```

## Build Verification

Command used:

```bash
npm run build
```

Result:

```text
SEO safety check passed.
Compiled successfully.
TypeScript completed successfully.
Static pages generated successfully.
Routes include:
/college
/college/[slug]
/universities
/universities/[slug]
```

## Client-Facing Summary

Before:

```text
Home schema was not present.
Home OG image was not present.
Admin custom schema JSON could be invalid.
Canonical/meta/schema output had fewer safety guards.
Country/university editor workflow for interlinking was incomplete.
Public university SEO URL was /universities.
```

After:

```text
Home schema is present.
Home canonical and OG image are present.
Country, college, and blog detail pages have safer canonical/meta/schema output.
Admin validates schema JSON.
Country and university descriptions support rich editor content and internal links.
New /college URLs are in sitemap/canonical logic.
Old /universities URLs permanently redirect to /college with 308.
Production build passes.
```

## Recommended External Screenshots for Client

Use these tools for third-party proof:

```text
Google Rich Results Test: https://search.google.com/test/rich-results
Schema Validator: https://validator.schema.org/
PageSpeed Insights: https://pagespeed.web.dev/
HTTP Status Redirect Checker: https://httpstatus.io/
Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
```

Suggested URLs:

```text
https://amwcareerpoint.com/
https://amwcareerpoint.com/countries/mbbs-in-uzbekistan
https://amwcareerpoint.com/college/andijan-state-medical-university-andijan-uzbekistan
https://amwcareerpoint.com/universities
https://amwcareerpoint.com/sitemap.xml
```

