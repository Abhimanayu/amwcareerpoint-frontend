# College Predictor - Client Questionnaire and Requirement Document

## 1. Project Summary
- Project Name:
- Client Name:
- Prepared By:
- Date:
- Version:
- Target Launch Date:

## 2. Business Goals
Please confirm the primary goals:
- [ ] Predict college eligibility based on rank and category
- [ ] Suggest best-fit colleges based on preferences
- [ ] Lead generation (student counselling inquiries)
- [ ] SEO traffic growth
- [ ] Other:

Success metrics (fill target numbers):
- Monthly visitors target:
- Prediction submissions target:
- Lead conversion target:
- Avg response time target:

## 3. Scope Confirmation
### In Scope
- [ ] College prediction by rank
- [ ] State-wise category and quota filtering
- [ ] Results table with sorting/filtering
- [ ] Counselling CTA integration
- [ ] Admin panel data upload
- [ ] SEO optimization for predictor page

### Out of Scope
- [ ] Real-time seat matrix integration from live counseling portals
- [ ] Payment gateway
- [ ] Student login/profile
- [ ] Other:

## 4. Data Requirements (Critical)
### 4.1 Source of Data
- Official data source links/files (MCC/state portals):
- Data owner/contact person:
- Data update frequency (daily/round-wise/manual):

### 4.2 Coverage
- Counseling year(s):
- Round(s):
  - [ ] Round 1
  - [ ] Round 2
  - [ ] Round 3
  - [ ] Stray
  - [ ] Final merged cutoff
- Course coverage:
  - [ ] MBBS
  - [ ] BDS
  - [ ] BAMS
  - [ ] BHMS
  - [ ] Other:

### 4.3 Geography
- States to include:
- Include All India Quota (AIQ): Yes/No

### 4.4 Category and Quota Policy
Choose one:
- [ ] Show raw categories exactly as source data
- [ ] Normalize categories into standard buckets
- [ ] Both (raw + mapped)

Quota types required:
- [ ] State Quota
- [ ] AIQ
- [ ] Management
- [ ] NRI
- [ ] Minority
- [ ] EWS
- [ ] PwD
- [ ] Other:

### 4.5 Data File Format
Upload format expected:
- [ ] XLSX
- [ ] CSV
- [ ] JSON
- [ ] API feed

Mandatory columns expected in source data:
- State
- College Name
- Course
- Category
- Quota
- Closing Rank
- Round
- Year

## 5. Functional Requirements - Frontend
### 5.1 User Input Fields
Mark mandatory fields:
- [ ] Rank (mandatory)
- [ ] State
- [ ] Category
- [ ] Quota
- [ ] Course
- [ ] College Type (Govt/Private)
- [ ] Domicile
- [ ] Gender
- [ ] PwD Status
- [ ] Minority Status
- [ ] Other:

### 5.2 Validation Rules
- Rank valid range:
- Invalid input behavior:
- Mandatory field rules:
- Unsupported field combination behavior:

### 5.3 Results View
Required columns in output:
- [ ] College Name
- [ ] State
- [ ] Category
- [ ] Quota
- [ ] Closing Rank
- [ ] Round
- [ ] Course
- [ ] College Type
- [ ] Fees
- [ ] Bond/Service details

### 5.4 User Actions
- [ ] Sort by closest rank
- [ ] Sort by low fees
- [ ] Filter Govt first
- [ ] Filter by state
- [ ] Filter by quota
- [ ] Export CSV
- [ ] Print/PDF
- [ ] Save/share result link

### 5.5 Empty/Error States
- No data message approved by client:
- API failure message approved by client:
- Slow response/loading behavior:

## 6. Functional Requirements - Backend
### 6.1 Prediction Logic
Confirm logic:
- [ ] Eligible if user_rank <= closing_rank
- [ ] Use final round only
- [ ] Use best of all rounds
- [ ] Show round-wise separate entries
- [ ] De-duplicate by college+category+quota
- [ ] Other rule:

### 6.2 APIs Required
1. Metadata API (states/categories/quotas)
2. Prediction API (rank + filters)
3. Health/diagnostic API
4. Admin upload API

Required API details:
- Authentication required for admin APIs: Yes/No
- Rate limits:
- Cache policy:
- Expected max request volume per minute:

### 6.3 Admin Requirements
- [ ] Data upload with preview
- [ ] File validation before publish
- [ ] Rollback to previous dataset
- [ ] Dataset version history
- [ ] Audit logs (who uploaded what/when)

## 7. SEO Requirements (Frontend + Content)
- Primary keyword:
- Secondary keywords:
- Page title format:
- Meta description format:
- FAQ schema required: Yes/No
- WebApplication schema required: Yes/No
- Canonical URL policy:
- Sitemap inclusion required: Yes/No

## 8. Analytics and Tracking
Tracking platform:
- [ ] GA4
- [ ] GTM
- [ ] Other:

Events required:
- [ ] Predictor submitted
- [ ] State selected
- [ ] Category selected
- [ ] Result CTA clicked
- [ ] Contact form submitted from predictor
- [ ] Other:

## 9. Non-Functional Requirements
### 9.1 Performance
- Max API response time:
- Max page load time:
- Expected concurrent users:

### 9.2 Security
- Input sanitization required: Yes/No
- Bot protection required: Yes/No
- Admin role-based access required: Yes/No
- PII storage involved: Yes/No

### 9.3 Reliability
- Data backup frequency:
- Rollback SLA:
- Incident response owner:

## 10. QA and Acceptance Criteria
### 10.1 Test Coverage Expectations
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] API validation tests
- [ ] Data integrity checks
- [ ] SEO checks

### 10.2 UAT Checklist
Client must approve:
- [ ] Filters show correct state-wise categories
- [ ] Quota values are accurate
- [ ] Rank logic is correct
- [ ] Result sorting works as expected
- [ ] CTA and lead flow works
- [ ] SEO metadata is correct

### 10.3 Sign-off
- Client approver name:
- Sign-off date:
- Post sign-off change policy:

## 11. Timeline and Milestones
- Requirement freeze date:
- Design freeze date:
- Development completion date:
- UAT start date:
- Go-live date:

## 12. Risks and Dependencies
Dependencies from client:
- Timely data files
- Category/quota mapping confirmation
- UAT feedback within agreed window
- Legal/disclaimer approval

Potential risks:
- Inconsistent state data formats
- Late round data updates
- Last-minute logic changes

## 13. Final Deliverables Checklist
- [ ] Predictor frontend page
- [ ] Backend prediction APIs
- [ ] Admin data upload workflow
- [ ] Data dictionary and mapping document
- [ ] QA report
- [ ] SEO implementation proof
- [ ] Deployment and rollback notes

---

## Quick Approval Section (One-Page Summary)
Client confirms the following:
1. Data source and scope are final.
2. Rank prediction logic is approved.
3. Category and quota display policy is approved.
4. Result fields and sorting are approved.
5. UAT checklist and timeline are approved.

Client Name:
Designation:
Signature:
Date:
