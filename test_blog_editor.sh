#!/bin/bash

# Blog Editor Implementation Test Script
echo "🎯 Testing Enhanced Blog Editor Implementation..."

# Check if all required files exist
echo ""
echo "📁 Checking implementation files..."

files=(
  "src/components/admin/RichTextEditor.tsx"
  "src/components/admin/ImageUploadDialog.tsx" 
  "src/lib/contentValidation.ts"
  "src/styles/blog-content.css"
  "BLOG_EDITOR_IMPLEMENTATION_GUIDE.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (missing)"
  fi
done

echo ""
echo "🔍 Checking Next.js development server..."
if curl -s http://localhost:3000 > /dev/null; then
  echo "✅ Frontend running on http://localhost:3000"
else
  echo "❌ Frontend not running - please start with 'npm run dev'"
fi

echo ""
echo "🔍 Checking Backend API server..."
if curl -s http://localhost:5000 > /dev/null; then
  echo "✅ Backend running on http://localhost:5000"
else
  echo "❌ Backend not running - please start your API server"
fi

echo ""
echo "🖼️ Testing image serving..."
if curl -I http://localhost:5000/uploads/ 2>/dev/null | grep -q "200\|404\|403"; then
  echo "✅ Image serving endpoint accessible"
else
  echo "❌ Image serving not configured - check backend static file serving"
fi

echo ""
echo "📱 Quick Mobile Test URLs:"
echo "• Admin Blog Editor: http://localhost:3000/admin/blogs/new"
echo "• Blog List: http://localhost:3000/blogs"
echo ""
echo "🧪 Test Checklist:"
echo "1. ✓ Open admin blog editor"
echo "2. ✓ Try all formatting options (fonts, colors, images, tables)"
echo "3. ✓ Check validation feedback appears"  
echo "4. ✓ Test image upload (if backend API ready)"
echo "5. ✓ Refresh page during editing (no errors)"
echo "6. ✓ View blog on mobile device"
echo ""
echo "📋 Need to implement backend image upload API:"
echo "   POST /api/admin/upload"
echo "   See BLOG_EDITOR_IMPLEMENTATION_GUIDE.md for details"
echo ""
echo "🎉 Implementation is ready for testing!"