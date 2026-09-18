# MBBS India module

Uses the existing website theme, header/footer, admin shell, image uploader, university records and enquiry API. The supplied `mbbs_india.html` informed the hero/enquiry card, facts strip and card layout. Its sample statistics and cutoffs were not imported.

## Routes and admin

- `/mbbs-india`: overview and searchable published state guides.
- `/mbbs-india/[slug]`: state content and college search, city, management and annual tuition filters.
- `/college/[slug]`: existing canonical route; mapped Indian colleges get India-specific admission, fees, sources and cutoff presentation.
- `/admin/mbbs-india`: overview/states, preview, draft/publish, sections, FAQs, sources, images and SEO. Saving a published page as draft explicitly unpublishes it.
- Existing university editor: country=India, state mapping, management/deemed status, numeric tuition/seats, academic year/source, additional costs, admission and structured historical cutoff rows. Inactive colleges are excluded from state listings.
- Existing enquiries: state, college, optional rank/year and originating page are retained and visible.

State slug edits retain aliases for permanent redirects. Both `/countries/mbbs-in-india` and `/mbbs-in-india` redirect to `/mbbs-india`. Draft/noindex state pages are excluded from the sitemap. Published state metadata and safe structured data are generated from admin content. Global `SEO_HOLD` still takes precedence.

## Starter content

Five states: Rajasthan, Uttar Pradesh, Madhya Pradesh, Maharashtra and Karnataka. One starter college per state; not a complete state inventory. Six editorial pages including the India overview. Official source URLs and review date are stored with the content. Fees, seats, cutoffs and annual admission deadlines are intentionally unspecified until verified for the relevant year and category.

The backend import is additive and repeatable. It preserves existing content and maps matching colleges where possible. Admin has an **Import 5 starter states** button. Backend CLI: `npm run seed:india-module` with `MONGODB_URI` explicitly set to the intended database. The initial import publishes the supplied editorial guides and activates newly created starter colleges.

Sources used: [MCC](https://mcc.nic.in/ug-medical-counselling/), [Rajasthan Medical Education](https://medicaleducation.rajasthan.gov.in/), [UP NEET](https://upneet.gov.in/), [MP DME](https://dme.mponline.gov.in/), [Maharashtra CET Cell](https://cetcell.mahacet.org/), [KEA](https://cetonline.karnataka.gov.in/kea/). College source links are in the seeded records.

## Verification and release

Backend `npm run test:india` uses an isolated disposable MongoDB instance. Browser suite lives in the backend `tests/india.browser.cjs`; it uses `PLAYWRIGHT_MODULE_PATH` (or installed Playwright) and Microsoft Edge. It starts an isolated persistent local preview DB, seeds it, exercises real local APIs and launches the frontend production build on port 3000. Build for that test with `NEXT_PUBLIC_API_URL=http://127.0.0.1:5055/api/v1`. Browser output is under `test-results/mbbs-india`. Local test DB files are ignored in backend `.local/`.

No production database or deployment was changed during development. For release:

1. Back up the target database and deploy the backend changes first.
2. Import starter data on the intended target using the admin button or CLI.
3. Build/deploy the frontend with the actual deployment API URL; the local QA bundle points at localhost and is not a deployment artifact.
4. Verify admin login, real ImageKit upload, save/publish, state/college pages, enquiry delivery, redirects, sitemap and mobile navigation on the target environment.

Image uploading reuses the existing integration. Local API QA has no ImageKit credentials, so external image uploads require target-environment validation. Existing pages receive local route smoke coverage; this is not a complete production regression of authentication, predictor payments or external services.

Rollback: restore the previous frontend/backend versions. Added collections and optional fields do not require removal for the previous application to run; do not delete existing university/country data.
