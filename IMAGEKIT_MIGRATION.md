# ImageKit Migration

Use ImageKit as the Cloudinary replacement for AMW images.

## Why ImageKit

- Free tier is enough for the current Cloudinary backup size.
- It supports CDN delivery and image transformations like Cloudinary.
- It is simpler for this project than object storage-only options.

## Current Backup

Cloudinary backup is saved locally at:

```text
cloudinary-backup/20260806-094844
```

The ZIP backup is:

```text
cloudinary-backup/cloudinary-backup-20260806-094844-v2.zip
```

## Setup

Create `.env.imagekit.local` in the project root:

```env
IMAGEKIT_PRIVATE_KEY=private_xxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
IMAGEKIT_FOLDER=/amw
AMW_ADMIN_TOKEN=your_admin_jwt_for_apply_step
```

Do not commit this file.

## Upload Backup To ImageKit

```bash
node scripts/upload-cloudinary-backup-to-imagekit.mjs cloudinary-backup/20260806-094844
```

This creates:

```text
tmp/imagekit-url-mapping.json
tmp/imagekit-url-mapping.failures.json
```

## Prepare Rewritten API Payloads

```bash
node scripts/apply-imagekit-url-mapping-to-api-payloads.mjs
```

This creates JSON files in:

```text
tmp/imagekit-rewritten-payloads
```

Use these payloads or the mapping file to update the backend database URLs from
`res.cloudinary.com` to `ik.imagekit.io`.

## Update Backend API URLs

Dry-run first:

```bash
npm run imagekit:update-api:dry-run
```

Apply after checking the dry-run report:

```bash
npm run imagekit:update-api:apply
```

This updates country, university, and blog records through the public backend
API using `AMW_ADMIN_TOKEN`.
