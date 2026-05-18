# Automated SEO Before/After Proof

Generated: 2026-05-12T10:19:07.979Z

Before commit: `589ebf838f32a74bec2d8ae2d5d83c2cb095cf6e`
After commit: `120860ead93062253b28a7f12b5370aa7f6c13be`

## Rendered Production HTML Checks

| Check | Before | After |
|---|---:|---:|
| Build | PASS | PASS |
| Home status | 200 | 200 |
| Home JSON-LD blocks | 1 | 2 |
| Home JSON-LD types | EducationalOrganization | EducationalOrganization, Organization, WebSite, BreadcrumbList, Article, FAQPage |
| Home canonical | https://amwcareerpoint.com | https://amwcareerpoint.com |
| Home OG image | - | https://amwcareerpoint.com/og-image.png |
| Home Twitter image | https://amwcareerpoint.com/og-image.png | https://amwcareerpoint.com/og-image.png |
| /college status | 404 | 200 |
| /universities status | 200 | 308 |
| /universities location | - | /college |
| /universities/:slug status | 200 | 308 |
| /universities/:slug location | - | /college/andijan-state-medical-university-andijan-uzbekistan |
| Sitemap has /college URLs | false | true |
| Sitemap has /universities URLs | true | false |

## Source-Level Automated Counts

| Pattern | Before | After |
|---|---:|---:|
| `homeJsonLd` | 0 | 2 |
| `application/ld+json` | 4 | 10 |
| `og-image.png` | 2 | 3 |
| `clampSeoDescription` | 0 | 9 |
| `resolveCanonicalUrl` | 0 | 7 |
| `serializeJsonLd` | 0 | 11 |
| `validateSchemaMarkup` | 0 | 4 |
| `RichTextEditor` | 5 | 9 |
| `/college` | 0 | 27 |

Raw JSON evidence: `seo-automated-proof.json`
