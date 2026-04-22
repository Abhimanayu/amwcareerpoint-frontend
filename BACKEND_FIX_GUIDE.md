# Backend Image Persistence Fix Guide

## Current Issue
Images upload successfully to the database but files are not persisting on the filesystem after server restart, causing 404 errors.

## Problem Analysis
The uploads directory is likely not configured with proper persistence, causing uploaded files to be lost when the backend server restarts.

## Solution Steps

### 1. Update Backend Server Configuration

Add this to your backend server's main file (usually `server.js` or `app.js`):

```javascript
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists and has proper permissions
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### 2. For Production Deployment

#### Option A: Use Cloud Storage (Recommended)
- Replace file uploads with cloud storage (AWS S3, Google Cloud Storage, Cloudinary)
- Update backend to save files to cloud and return public URLs
- No file persistence issues on server restart

#### Option B: Volume Mounting (Docker/Server)
- Mount uploads directory to persistent storage
- For Docker: Add volume mapping in docker-compose.yml:
```yaml
services:
  backend:
    volumes:
      - ./uploads:/app/uploads
```

#### Option C: Database Storage
- Store small images as base64 in database (not recommended for large files)
- Update upload handler to convert files to base64 and store in database

### 3. Update Upload Middleware

Make sure your multer configuration includes absolute paths:

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
```

### 4. Add File Cleanup on Upload Error

```javascript
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlinkSync(req.file.path); // Clean up uploaded file on error
  }
  next(error);
});
```

## Quick Test
1. Upload an image through admin panel
2. Restart backend server
3. Try accessing image URL directly: `http://localhost:5000/uploads/filename.jpg`
4. Image should still be accessible

## Immediate Action Required
The backend needs one of the above solutions implemented to prevent image loss on server restart.