#!/bin/bash

echo "🧪 Testing Backend Static File Serving..."
echo ""

echo "1. Testing backend health:"
curl -s http://localhost:5002/health -w " Status: %{http_code}\n" || echo "Backend not responding"

echo ""
echo "2. Testing static file:"
HTTP_STATUS=$(curl -s http://localhost:5002/uploads/universities/edge-hero-2.jpg -o /dev/null -w "%{http_code}")

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ SUCCESS: Static files are working! (HTTP: $HTTP_STATUS)"
    echo "🎉 Your frontend images should now load properly!"
else
    echo "❌ FAILED: Static files not working (HTTP: $HTTP_STATUS)"
    echo "🔧 You still need to add the static file serving code to your backend"
fi

echo ""
echo "3. Direct URL test:"
echo "Visit this URL in browser: http://localhost:5002/uploads/universities/edge-hero-2.jpg"
echo "- If you see an image: ✅ Working"  
echo "- If you see 404 error: ❌ Backend fix needed"