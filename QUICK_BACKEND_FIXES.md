# 🚨 IMMEDIATE BACKEND FIXES NEEDED

## ⚡ QUICK FIXES (Add to your server file)

### 1. Add these imports at the top:
```javascript
const fs = require('fs');
const path = require('path');
```

### 2. Add uploads directory creation (after your app setup):
```javascript
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Create subdirectories
const subDirs = ['countries', 'universities', 'blogs', 'counsellors', 'reviews'];
subDirs.forEach(dir => {
  const subPath = path.join(uploadsDir, dir);
  if (!fs.existsSync(subPath)) {
    fs.mkdirSync(subPath, { recursive: true });
  }
});
```

### 3. Fix static file serving with CORS:
```javascript
// Replace your existing uploads static serving with this:
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, 'uploads')));
```

### 4. Add health check endpoint:
```javascript
app.get('/api/uploads/health', (req, res) => {
  const uploadsExists = fs.existsSync(path.join(__dirname, 'uploads'));
  res.json({
    status: uploadsExists ? 'healthy' : 'error',
    exists: uploadsExists,
    timestamp: new Date().toISOString()
  });
});
```

## 🔥 CRITICAL STEPS:

1. **Open your backend `app.js` or `server.js`**
2. **Add the 4 code blocks above**
3. **Restart your backend server**
4. **Refresh your Pakistan page** 
5. **The diagnostic panel should turn green**

## ✅ EXPECTED RESULT:
- ✅ Backend Health: healthy
- ✅ Static File Serving: configured  
- ✅ Uploaded Image Access: accessible
- ✅ CORS Headers: configured

## 🧪 TEST COMMANDS:
```bash
# Test health check
curl http://localhost:5000/api/uploads/health

# Test existing uploaded image
curl -I http://localhost:5000/uploads/countries/1776321431530-293098.jpg
```

Once green, upload a new flag image from admin panel and it should show immediately!