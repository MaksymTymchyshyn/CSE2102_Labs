#!/bin/bash

# Lab 8 Packaging Script
# Creates a zip file for submission WITHOUT node_modules

echo "📦 Creating Lab 8 submission package..."
echo ""

# Navigate to Lab_8 directory
cd "$(dirname "$0")"

# Define the output zip file
OUTPUT_ZIP="Lab8_React_Quiz_Submission.zip"

# Remove old zip if it exists
if [ -f "$OUTPUT_ZIP" ]; then
    echo "🗑️  Removing old submission package..."
    rm "$OUTPUT_ZIP"
fi

# Create zip excluding node_modules and build artifacts
echo "📝 Packaging files (excluding node_modules)..."
zip -r "$OUTPUT_ZIP" . \
    -x "node_modules/*" \
    -x ".git/*" \
    -x "build/*" \
    -x "coverage/*" \
    -x ".DS_Store" \
    -x "*.swp" \
    -x "*.swo" \
    -x "$OUTPUT_ZIP"

# Check if zip was created successfully
if [ -f "$OUTPUT_ZIP" ]; then
    SIZE=$(ls -lh "$OUTPUT_ZIP" | awk '{print $5}')
    echo ""
    echo "✅ Success! Package created: $OUTPUT_ZIP"
    echo "📊 Size: $SIZE"
    echo ""
    echo "📋 Package includes:"
    echo "   ✓ All source code (src/)"
    echo "   ✓ All tests (*.test.js)"
    echo "   ✓ Configuration files (package.json, etc.)"
    echo "   ✓ Documentation (README.md, IMPLEMENTATION_SUMMARY.md)"
    echo "   ✓ Public assets (public/)"
    echo ""
    echo "❌ Excluded from package:"
    echo "   ✗ node_modules/ (recipient runs 'npm install')"
    echo "   ✗ build/ (generated files)"
    echo "   ✗ coverage/ (test coverage reports)"
    echo ""
    echo "🎯 To submit:"
    echo "   1. Upload $OUTPUT_ZIP to course submission system"
    echo "   2. Instructor will unzip and run 'npm install' then 'npm start'"
    echo ""
else
    echo "❌ Error: Failed to create package"
    exit 1
fi
