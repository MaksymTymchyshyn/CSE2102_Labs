#!/bin/bash
# Package Lab 09 for submission

echo "=============================================="
echo "Packaging Lab 09 for Submission"
echo "=============================================="
echo ""

# Create submission directory
SUBMISSION_DIR="Lab09_WebTokens_Submission"
rm -rf "$SUBMISSION_DIR"
mkdir -p "$SUBMISSION_DIR"

# Copy required files
echo "Copying files..."
cp my-server.py "$SUBMISSION_DIR/"
cp my-calls.py "$SUBMISSION_DIR/"
cp test_token_service.py "$SUBMISSION_DIR/"
cp requirements.txt "$SUBMISSION_DIR/"
cp demo.sh "$SUBMISSION_DIR/"
cp README.md "$SUBMISSION_DIR/"
cp IMPLEMENTATION_SUMMARY.md "$SUBMISSION_DIR/"

# Make scripts executable
chmod +x "$SUBMISSION_DIR/demo.sh"

# Create zip file
ZIP_FILE="Lab09_WebTokens_Submission.zip"
rm -f "$ZIP_FILE"
echo "Creating zip file: $ZIP_FILE"
zip -r "$ZIP_FILE" "$SUBMISSION_DIR"

echo ""
echo "=============================================="
echo "Submission Package Created!"
echo "=============================================="
echo ""
echo "Contents of $ZIP_FILE:"
unzip -l "$ZIP_FILE"

echo ""
echo "=============================================="
echo "SUBMISSION CHECKLIST:"
echo "=============================================="
echo "✓ 1. Brief description: IMPLEMENTATION_SUMMARY.md"
echo "✓ 2. Unit and functional tests: test_token_service.py (22 tests)"
echo "✓ 3. Code in zip file: $ZIP_FILE"
echo "✓ 4. Simple description to run: README.md"
echo ""
echo "⚠ MANUAL STEP REQUIRED:"
echo "  - Create a video demonstration of the service working"
echo "    (Run ./demo.sh and record the screen)"
echo ""
echo "Your submission package is ready: $ZIP_FILE"
