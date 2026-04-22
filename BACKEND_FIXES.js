/**
 * � URGENT BACKEND FIX - Add this to your Express server immediately
 * 
 * Problem: http://localhost:5002/uploads/* returns 404 (file not found)
 * Solution: Add static file serving middleware
 */

// ===== COPY THIS EXACT CODE TO YOUR BACKEND SERVER =====
const express = require('express');
const path = require('path');
const app = express(); // or your existing app instance

// 🔥 CRITICAL FIX: Enable static file serving for /uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // Enable CORS for images
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Cache-Control', 'public, max-age=3600'); // 1 hour cache
    
    // Set correct content types
    if (filePath.endsWith('.png')) res.set('Content-Type', 'image/png');
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) res.set('Content-Type', 'image/jpeg');
    if (filePath.endsWith('.webp')) res.set('Content-Type', 'image/webp');
    if (filePath.endsWith('.svg')) res.set('Content-Type', 'image/svg+xml');
  }
}));

// Debug endpoint to test uploads
app.get('/debug-uploads', (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, 'uploads');
  
  let html = '<h1>🔍 Debug: Static File Status</h1>';
  html += `<p><strong>Server Port:</strong> 5002</p>`;
  html += `<p><strong>Uploads Directory:</strong> ${uploadsPath}</p>`;
  html += `<p><strong>Directory Exists:</strong> ${fs.existsSync(uploadsPath)}</p>`;
  
  if (fs.existsSync(uploadsPath)) {
    html += '<h2>📁 Directory Contents:</h2><ul>';
    try {
      const files = fs.readdirSync(uploadsPath, { withFileTypes: true });
      files.forEach(file => {
        const type = file.isDirectory() ? '📁' : '📄';
        html += `<li>${type} ${file.name}</li>`;
      });
    } catch (e) {
      html += `<li>Error reading directory: ${e.message}</li>`;
    }
    html += '</ul>';
  }
  
  html += '<h2>🧪 Test Image:</h2>';
  html += '<img src="/uploads/universities/edge-hero-2.jpg" style="max-width:200px; border:1px solid #ccc;" onerror="this.style.border=\"2px solid red\";"><br>';
  html += '<small>If image shows with red border = file not found</small>';
  
  res.send(html);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    port: 5002,
    uploads: 'configured',
    time: new Date().toISOString()
  });
});

app.listen(5002, () => {
  console.log('🚀 Backend server running on http://localhost:5002');
  console.log('📁 Static files served from /uploads');
  console.log('🧪 Debug at: http://localhost:5002/debug-uploads');
});

/*
🧪 IMMEDIATE TESTS AFTER RESTART:
1. http://localhost:5002/debug-uploads (see directory contents)
2. http://localhost:5002/uploads/universities/edge-hero-2.jpg (direct file)
3. Refresh frontend - images should load!

🚨 CRITICAL: Make sure your backend is running on PORT 5002 (not 5000)
*/

// ================================
// 🚨 FIX 1: Ensure uploads directory exists and persists
// ================================
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory:", uploadsDir);
}

// Create subdirectories for organization
const subDirs = [
  "countries",
  "universities",
  "counsellors",
  "reviews",
  "blogs",
];
subDirs.forEach((dir) => {
  const subPath = path.join(uploadsDir, dir);
  if (!fs.existsSync(subPath)) {
    fs.mkdirSync(subPath, { recursive: true });
    console.log("📁 Created subdirectory:", subPath);
  }
});

// ================================
// 🚨 FIX 2: Static file serving with CORS
// ================================
app.use(
  "/uploads",
  (req, res, next) => {
    // Add CORS headers for images
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    res.header("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    next();
  },
  express.static(path.join(__dirname, "uploads")),
);

// ================================
// 🚨 FIX 3: Health check endpoint
// ================================
app.get("/api/uploads/health", (req, res) => {
  const uploadsExists = fs.existsSync(uploadsDir);
  const subdirStatus = {};

  // Check each subdirectory
  subDirs.forEach((dir) => {
    const subPath = path.join(uploadsDir, dir);
    subdirStatus[dir] = fs.existsSync(subPath);
  });

  res.json({
    status: uploadsExists ? "healthy" : "error",
    uploadsDir: uploadsDir,
    exists: uploadsExists,
    subdirectories: subdirStatus,
    timestamp: new Date().toISOString(),
  });
});

// ================================
// 🚨 FIX 4: Enhanced media upload endpoint
// ================================
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.body.folder || "general";
    const uploadPath = path.join(__dirname, "uploads", folder);

    // Ensure folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit as per your spec
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
    }
  },
});

// Media upload endpoint (as per your API spec)
app.post("/api/v1/media/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "No file uploaded",
        },
      });
    }

    const folder = req.body.folder || "general";
    const fileUrl = `http://localhost:5000/uploads/${folder}/${req.file.filename}`;

    res.json({
      data: {
        url: fileUrl,
        filename: req.file.filename,
        folder: folder,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: "UPLOAD_ERROR",
        message: error.message,
      },
    });
  }
});

// ================================
// 🚨 FIX 5: File verification endpoint
// ================================
app.get("/api/verify-image/:folder/:filename", (req, res) => {
  const { folder, filename } = req.params;
  const imagePath = path.join(__dirname, "uploads", folder, filename);

  if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath);
    res.json({
      exists: true,
      path: `uploads/${folder}/${filename}`,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    });
  } else {
    res.status(404).json({
      exists: false,
      path: `uploads/${folder}/${filename}`,
      error: "File not found",
    });
  }
});

// ================================
// 🚨 FIX 6: Error handling for uploads
// ================================
app.use((error, req, res, next) => {
  if (req.file) {
    // Clean up uploaded file if there was an error
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete file:", err);
    });
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "File size exceeds 5MB limit",
        },
      });
    }
  }

  res.status(500).json({
    error: {
      code: "SERVER_ERROR",
      message: error.message,
    },
  });
});

// Your existing routes and middleware below...
console.log("🖼️ Image upload system initialized");
console.log("📁 Uploads directory:", uploadsDir);
console.log("🌐 Static files served at: http://localhost:5000/uploads/");

// Start your server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/uploads/health`);
});
