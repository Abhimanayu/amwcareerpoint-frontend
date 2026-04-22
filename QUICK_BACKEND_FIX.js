// ===== ADD THIS TO YOUR BACKEND SERVER ON PORT 5002 =====

const express = require('express');
const path = require('path');

// Your existing app setup...
// const app = express();

// 🔥 ADD THIS ONE CRITICAL LINE:
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Your existing routes...

// Start server
app.listen(5002, () => {
  console.log('✅ Backend on port 5002 - Static files enabled');
});

/*
🧪 AFTER ADDING THE LINE ABOVE:
1. Restart your backend server on port 5002
2. Test: http://localhost:5002/uploads/universities/edge-hero-2.jpg
3. Should return the actual image (not 404)
4. Refresh your frontend - images will work!
*/