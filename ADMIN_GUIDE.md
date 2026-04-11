# AMW Career Point — Admin Panel User Guide

## Getting Started

### Login
1. Go to **`/admin/login`** in your browser (e.g., `http://localhost:3000/admin/login`)
2. Enter your admin credentials:
   - **Email**: Your admin email address
   - **Password**: Your admin password
3. Click **Login to Admin Panel**
4. You will be redirected to the Dashboard

### Logout
Click the **Logout** button in the top-right corner of the header.

---

## Dashboard

The Dashboard (`/admin`) shows:
- **Stat Cards** — Quick count of Countries, Universities, Reviews, Enquiries, and Blogs. Click any card to go to that section.
- **Recent Enquiries** — Latest 5 enquiries with name, contact, and status.

---

## Countries

**URL**: `/admin/countries`

### View All Countries
- See all countries in a table (desktop) or card list (mobile)
- Shows flag, name, slug, status, and sort order
- Use **Prev/Next** buttons for pagination

### Add Country
1. Click **+ Add Country**
2. Fill in the form sections:
   - **Basic Information** — Name (auto-generates slug), tagline, description, status, sort order
   - **Images** — Upload flag and hero images (drag or click, max 5MB, JPG/PNG/WebP)
   - **Highlights** — Key points about the country (click + Add for more)
   - **Features** — Icon + Title + Description for each feature
   - **Eligibility Criteria** — List of eligibility requirements
   - **Admission Process** — Numbered steps with title and description
   - **SEO** — Meta title, description, keywords
3. Click **Create Country**

### Edit Country
1. Click **Edit** on any country row
2. Modify fields as needed
3. Click **Update Country**

### Delete Country
1. Click **Delete** on any country row
2. Confirm in the popup dialog

---

## Universities

**URL**: `/admin/universities`

### View All Universities
- Table shows logo, name, country, established year, status, and featured badge

### Add/Edit University
Form sections:
- **Basic Information** — Name, slug, country (dropdown), description, status, established year, featured toggle
- **Academic Details** — Ranking, accreditation, course duration, medium, annual fees, hostel fees, eligibility
- **Images** — Logo, hero image, gallery URLs
- **Recognition** — List of recognitions (WHO, NMC, etc.)
- **Highlights** — Label-value pairs
- **FAQs** — Question and answer pairs
- **SEO** — Meta title, description, keywords

---

## Blogs

**URL**: `/admin/blogs`

### View All Blogs
- Shows cover image, title, category, author, status, and date

### Add/Edit Blog
Form sections:
- **Blog Details** — Title (auto-generates slug), slug, author, category (dropdown), tags (comma-separated), excerpt, content (supports HTML), status, featured toggle
- **Cover Image** — Upload blog cover
- **SEO** — Meta title, description, keywords

> **Tip**: The content field supports HTML. You can write formatted content using HTML tags.

---

## Enquiries

**URL**: `/admin/enquiries`

### View & Manage Enquiries
- **Left panel** — List of all enquiries with name, email, phone, source, and status badge
- **Right panel** — Detailed view of selected enquiry
- **Filter** — Use the status dropdown to filter by New, Contacted, Converted, or Closed

### Update Enquiry Status
1. Click on an enquiry to select it
2. In the detail panel, click a status button (New → Contacted → Converted → Closed)
3. Status updates instantly

### Add Notes
1. Select an enquiry
2. Type in the Notes text area
3. Notes auto-save when you click away (on blur)

---

## Mobile Usage

The admin panel is fully responsive:
- On mobile, tap the **hamburger menu** (☰) in the top-left to open the sidebar
- Tap outside the sidebar or the close button to dismiss it
- Tables automatically switch to card view on small screens
- All forms are single-column on mobile for easy scrolling

---

## Tips & Shortcuts

| Action | How |
|--------|-----|
| Quick navigate | Click stat cards on Dashboard |
| Auto-generate slug | Type the name — slug generates automatically (only for new items) |
| Bulk manage | Use pagination to browse through items |
| Filter enquiries | Use the status dropdown at the top |
| View website | Click "View Website →" in the header |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Check email/password. Make sure the backend server is running |
| Images not uploading | Ensure file is under 5MB and is JPG, PNG, or WebP |
| Data not showing | Check if the backend API is running at the correct URL |
| Session expired | You'll be automatically redirected to login. Just log in again |
| Page not loading | Clear browser cache and refresh |

---

## Technical Notes

- **API Base URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable (default: `http://localhost:5000/api/v1`)
- **Authentication**: JWT tokens stored in browser localStorage
- **Token refresh**: Automatic token refresh on 401 responses
- All admin API calls use the authenticated Axios instance with auto-injected Bearer token
